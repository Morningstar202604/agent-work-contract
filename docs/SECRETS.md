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

## CLI 与五平台上传

安装器会把 `scripts/accounts_cli.py` 部署到凭据库目录：

```bash
python ~/.agent-secrets/accounts_cli.py list     # 列出账号（不显示 token）
python ~/.agent-secrets/accounts_cli.py check    # 探活各平台 API 并更新状态
python ~/.agent-secrets/accounts_cli.py sync     # 重新生成 accounts.env 并注册用户级环境变量
python ~/.agent-secrets/accounts_cli.py store-git  # 注入 git 凭据管理器
python ~/.agent-secrets/accounts_cli.py env      # 输出 export 行（供 eval）
python ~/.agent-secrets/accounts_cli.py path     # 输出凭据库目录
```

五平台默认上传（gitcode/badhope、gitee/badhope、github/x33834、github/Morningstar202604、github/badhope，仓库统一命名 `rules`）：

```bash
scripts/upload_all.sh            # 串行推送 + 8s 平台间隔限速
UPLOAD_SLEEP=15 scripts/upload_all.sh   # 调大间隔
```

token 只从凭据库读入进程内存拼进推送 URL，不写 .git/config、不打印。

## 与规则联动

`AGENTS.md` 的「本机凭据库（可选）」章节按 `AGENT_SECRETS_DIR`（默认 `~/.agent-secrets`）寻址。若沿用旧版 `~/.zcode/secrets/accounts_cli.py`，把该章节路径改成实际位置即可。

## 已提交密钥的处置

1. 立即在提供方吊销并重新签发。
2. `git filter-repo --path <file> --invert-paths` 清理历史（改写后需 force push，仅限本人仓库）。
3. 通知所有协作者重新 clone。
4. 在本机库更新新 token，跑 `sync`。
