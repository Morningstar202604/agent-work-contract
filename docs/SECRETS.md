# 凭据接入（可选）

仓库**不含**任何凭据。本文件说明如何在目标机器上自建一个本地凭据库，供 skill / 脚本读取。不配置不影响规则运行。

## 设计

- 唯一数据源：`~/.agent-secrets/accounts.json`（权限 0600，永不进 Git）。
- 派生文件：`accounts.env`（shell 可 source）、`git-credentials`（可选）。
- 读取顺序：账号专属环境变量 → 本机库 → 通用环境变量（`GITHUB_TOKEN` / `GH_TOKEN`）。
- 纪律：不打印、不提交、不外传密钥值；日志只记录"已配置/未配置"。

## 最小文件

`templates/secrets/accounts.example.json` 是结构模板：

```json
{
  "version": 1,
  "platforms": {
    "github": {
      "api_base": "https://api.github.com",
      "accounts": {
        "your-account": {
          "env": "GITHUB_TOKEN_YOUR_ACCOUNT",
          "token": "<FILL_ME>",
          "status": "unchecked",
          "consumers": []
        }
      }
    }
  }
}
```

## 手动启用

```bash
mkdir -p ~/.agent-secrets && chmod 700 ~/.agent-secrets
cp <repo>/templates/secrets/accounts.example.json ~/.agent-secrets/accounts.json
chmod 600 ~/.agent-secrets/accounts.json
# 编辑填入真实 token，然后：
set -a; . ~/.agent-secrets/accounts.env; set +a
```

## 与规则联动

`AGENTS.md` 的「本机凭据库（可选）」章节按 `AGENT_SECRETS_DIR`（默认 `~/.agent-secrets`）寻址。若沿用旧版 `~/.zcode/secrets/accounts_cli.py`，把该章节路径改成实际位置即可。

## 已提交密钥的处置

1. 立即在提供方吊销并重新签发。
2. `git filter-repo --path <file> --invert-paths` 清理历史（改写后需 force push，仅限本人仓库）。
3. 通知所有协作者重新 clone。
4. 在本机库更新新 token，跑 `sync`。
