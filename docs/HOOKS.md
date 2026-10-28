# 钩子说明

8 个钩子位于 `<安装目录>/hooks/`，共用 `<安装目录>/hooks/lib/` 下的 6 个模块（5 个共用模块 + 1 个 Claude Code 输出适配器 `claude-wrap.js`）。全部是纯 Node.js（>= 18）、零第三方依赖、不联网。

## 执行契约

- 从 stdin 读 JSON payload（`{ session_id, cwd, tool_name, tool_input, prompt, ... }`）。
- 向 stdout 写一行 JSON；不输出即视为"放行"。
- 任何异常都在 `main().catch(() => {})` 里吞掉，**钩子永不因自身错误阻断用户**。
- 状态文件写在 `<安装目录>/memory/<项目>-<hash>.state.json`，可用 `AGENT_RULES_MEMORY_DIR` 重定向。

## 逐个说明

### session-start.js（SessionStart）

读工作区记忆文件，把路径与标题索引注入上下文；重置 `stopRounds` 与提示标记。

### user-prompt.js（UserPromptSubmit）

合并两件事：注入「提示词润色」规则（`lib/polish.js`）+ 注入记忆定位（`lib/recall.js`）。纯停止短语（"停""算了""暂停"）会把 `skipGuard` 置为 true，本轮收尾不阻断。

### guard-write.js（PreToolUse · Edit|Write|ApplyPatch）

- 敏感文件（`.env`、`*.pem`、`id_rsa`、`credentials.json`、`accounts.json` 等）→ 只提示，不阻断。
- 工作区外写入 → 提示边界；规则安装目录内写入放行（升级自身不受影响）。
- 代码文件写入 → 记 `changedFiles`、`needsVerify=true`，把验证门禁挂上。

### guard-bash.js（PreToolUse · Bash）

- 13 条危险命令规则（`lib/danger-rules.js`）：`git reset --hard`、`git clean -f`、`rm -rf`、`DROP TABLE`、无 WHERE 的 UPDATE/DELETE、`mkfs`/`dd`、`npm publish`、生产部署、迁移重置、按名杀进程、历史改写等 → 提示 + 给出可回滚做法。
- 密钥类 git 操作（`git add -A`、`git add .env`、`--no-verify`）→ 提示。
- 长驻服务启动（dev server / `docker run` / `uvicorn` 等）→ 登记到 `runningProcs`，提示收尾必须关闭；构建/测试类一次性命令不登记。
- 永远只注入 `additionalContext`，不返回 `permissionDecision`，因此不会弹权限确认。

### plan-sync.js（PostToolUse · TodoWrite）

把 todo 列表渲染进记忆文件的 `<!-- plan:start --> ... <!-- plan:end -->` 区块，同时写 `openTodos` 供 stop-guard 判断。

### track-verify.js（PostToolUse / PostToolUseFailure · Bash）

用正则识别验证类命令（`npm test`、`vitest`、`pytest`、`cargo test`、`tsc --noEmit`、`eslint` 等），记录 `lastVerifyOk`；通过则解除 `needsVerify`。

### stop-guard.js（Stop）

收尾前检查四项：未关闭的 `runningProcs`、`openTodos`、`needsVerify`、记忆未落盘。命中任一项返回 `decision: block`，最多阻断 3 轮；用户喊停或达到上限时只提示不阻断，然后串联 `cleanup-check`。

`persistentProcs`（`state.json` 里的正则数组）可声明"常驻不关"的进程，命中即从存活清单剔除。

### cleanup-check.js（被 stop-guard 调用，也可独立运行）

扫描工作区（深度 3、上限 3000 文件）找临时文件（`.tmp/.bak/.orig/.rej/*~/.swp/.log` 等）、本轮报告文件、被改动文档、改动文件清单；`git ls-files` 能识别为已跟踪的文件不算临时；每轮只阻断一次。

## 自检

```bash
npm run selftest
# ALL 50 CASES PASS
```

自检在 `<仓库>/.tmp/selftest/` 建临时工作区，通过 `ZCODE_MEMORY_DIR` 把记忆重定向到临时目录，不碰真实状态。可用 `AGENT_RULES_TEST_TMP` 改位置。

## Claude Code 适配器

`hooks/lib/claude-wrap.js` 不是钩子，是输出适配层：接收 Claude Code 的事件 JSON，转调目标钩子，再把钩子的 ZCode 风格输出改写成 Claude Code 能识别的形状。

| 事件 | 转换 |
|---|---|
| `SessionStart` / `UserPromptSubmit` / `PostToolUse` | `additionalContext` → `hookSpecificOutput.additionalContext`（补 `hookEventName`） |
| `PreToolUse` | `additionalContext` → `systemMessage`（Claude Code 的 PreToolUse 没有 additionalContext 通道） |
| `Stop` | `decision:block` + `reason` 原样透传 |
| 其它 | `additionalContext` → `systemMessage` |

## 新增钩子的步骤

1. 在 `core/hooks/` 写脚本，复用 `lib/memory.js` 的 stdin/emit/state。
2. 在 `install.js` 的 `zcodeHookEvents()`、`claudeHookEvents()` 里登记。
3. 在 `core/hooks/selftest.js` 加用例（含 schema 校验）。
4. 更新本文件与 `README.md` 的钩子表。
5. `npm run selftest` 全绿再提交。
