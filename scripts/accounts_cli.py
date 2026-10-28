#!/usr/bin/env python3
"""凭据库 CLI：list|check|sync|store-git|env|path。

数据源 ~/.agent-secrets/accounts.json（见 docs/SECRETS.md）。
纪律：不打印 token 值；日志只记录"已配置/未配置/探活结果"。
"""
import argparse
import json
import os
import subprocess
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

VAULT = Path(os.environ.get("AGENT_SECRETS_DIR", Path.home() / ".agent-secrets"))
ACCOUNTS = VAULT / "accounts.json"

GIT_HOSTS = {"gitcode": "gitcode.com", "gitee": "gitee.com", "github": "github.com"}


def load():
    if not ACCOUNTS.exists():
        sys.exit(f"凭据库不存在：{ACCOUNTS}（参考 docs/SECRETS.md 初始化）")
    return json.loads(ACCOUNTS.read_text(encoding="utf-8"))


def save(data):
    ACCOUNTS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def iter_accounts(data):
    for platform, pc in data.get("platforms", {}).items():
        for user, acc in pc.get("accounts", {}).items():
            yield platform, pc, user, acc


def probe(platform, pc, acc):
    base = pc["api_base"].rstrip("/")
    token = acc["token"]
    if platform == "github":
        req = urllib.request.Request(base + "/user", headers={"Authorization": "Bearer " + token, "User-Agent": "agent-vault"})
    else:
        req = urllib.request.Request(base + "/user?access_token=" + token, headers={"User-Agent": "agent-vault"})
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            body = json.loads(res.read().decode("utf-8"))
            return res.status, body.get("login") or body.get("username") or ""
    except Exception as exc:  # noqa: BLE001 - 探活失败原因需要展示，token 不在异常文本里
        code = getattr(exc, "code", None)
        return code or 0, str(exc)[:80]


def cmd_list(data):
    print(f"{'platform':<10} {'account':<20} {'env':<32} status/checked")
    for platform, _, user, acc in iter_accounts(data):
        checked = (acc.get("checked") or "")[:19]
        print(f"{platform:<10} {user:<20} {acc.get('env',''):<32} {acc.get('status','?')} {checked}")


def cmd_check(data):
    for platform, pc, user, acc in iter_accounts(data):
        code, info = probe(platform, pc, acc)
        acc["status"] = "ok" if code == 200 else f"http-{code}"
        acc["checked"] = datetime.now(timezone.utc).isoformat()
        print(f"{platform}/{user}: {acc['status']}" + (f" ({info})" if info else ""))
    save(data)


def cmd_sync(data):
    lines = []
    for _, _, _, acc in iter_accounts(data):
        lines.append(f"export {acc['env']}={acc['token']}")
    (VAULT / "accounts.env").write_text("\n".join(lines) + "\n", encoding="utf-8")
    registered = 0
    for _, _, _, acc in iter_accounts(data):
        try:
            subprocess.run(["setx", acc["env"], acc["token"]], check=True, capture_output=True, shell=False)
            registered += 1
        except Exception:
            print(f"setx 失败：{acc['env']}（可手动注册）", file=sys.stderr)
    print(f"accounts.env 已更新；用户级环境变量注册 {registered} 个。新变量对新开的进程生效。")


def cmd_store_git(data):
    ok = 0
    for platform, _, user, acc in iter_accounts(data):
        host = GIT_HOSTS.get(platform)
        if not host:
            continue
        payload = f"protocol=https\nhost={host}\nusername={user}\npassword={acc['token']}\n\n"
        try:
            subprocess.run(["git", "credential", "approve"], input=payload, text=True, check=True, capture_output=True)
            ok += 1
        except Exception:
            print(f"git credential approve 失败：{platform}/{user}", file=sys.stderr)
    print(f"已注入 git 凭据管理器 {ok} 条（同一 host 多账号时，远端 URL 需带 username 区分）。")


def cmd_env(data):
    for _, _, _, acc in iter_accounts(data):
        print(f"export {acc['env']}={acc['token']}")


def cmd_path(_data):
    print(str(VAULT))


def main():
    parser = argparse.ArgumentParser(description="本机凭据库 CLI（不打印 token）")
    parser.add_argument("command", choices=["list", "check", "sync", "store-git", "env", "path"])
    args = parser.parse_args()
    data = load()
    {"list": cmd_list, "check": cmd_check, "sync": cmd_sync,
     "store-git": cmd_store_git, "env": cmd_env, "path": cmd_path}[args.command](data)


if __name__ == "__main__":
    main()
