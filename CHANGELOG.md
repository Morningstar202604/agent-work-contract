# Changelog

## 1.0.0 — 2026-10-28

首个可复用版本，从本机 `~/.zcode` 规则体系整理而来。

### 新增

- `AGENTS.md`：16 节全局工作规范（输出纪律、工作流程、诚实、安全、边界与风险、指令优先级、效率、技术选型、AQG、Skill-first、凭据库、提示词润色、上下文记忆、完成度纪律、收尾检查、进程生命周期、工作区边界、工具优先级、移植）。
- `core/skills/`：70 个技能，覆盖工作契约、AQG 审计、代码评审、调试、TDD、架构、前端、后端、数据库、安全、可观测性、发布门禁、技能工程。
- `core/agents/`：220 个子代理角色，按战队组织。
- `core/commands/`：`review`、`arch-review`、`security-scan`、`test-gap`。
- `core/hooks/`：8 个钩子 + 5 个共用模块，提供记忆注入、计划落盘、危险命令提示、验证门禁、收尾阻断、清理检查。
- `install.js`：跨工具安装器（ZCode / Claude Code / opencode / Codex / generic），支持 `--all`、`--dry-run`、`--home`、`--no-hooks`、`--uninstall`，幂等且备份覆盖。
- `docs/`：`PORTABILITY.md`（能力矩阵与降级）、`HOOKS.md`（钩子协议）、`SECRETS.md`（凭据接入）、`SKILLS.md`（技能清单）。
- `templates/`：凭据库与记忆文件的最小模板，不含真实凭据。

### 相对原始本机配置的改动

- 移除全部个人路径与主机名，改用 `<规则目录>` / `AGENT_RULES_HOME` / `AGENT_SECRETS_DIR` 等占位与环境变量。
- `hooks/lib/memory.js`：记忆目录改为跟随规则安装目录（`<安装根>/memory`），可用 `AGENT_RULES_MEMORY_DIR` / `ZCODE_MEMORY_DIR` 覆盖。
- `hooks/guard-write.js`：放行判定从 `~/.zcode` 改成规则安装根 `RULES_HOME`。
- `hooks/guard-bash.js`：巡检命令判定改为只看命令链第一段，修复 `vite dev --port 5173 && echo ...` 被误判为巡检、从而不登记长驻服务的问题。
- `hooks/selftest.js`：修复 3 条随代码演进过期的用例（`vite --port` → `vite dev --port`、无 `startedAt` 的进程记录、`zcode 目录内写入` → `规则目录内写入`），并把临时目录从系统临时目录移到仓库内 `.tmp/selftest/`。
- 删除 `core/skills/ARCHITECTURE.md`、`core/skills/README-RESTORE.md`（描述的是原机器 231→68 治理历史，对复用无意义）。
- `master-checklist` 技能：移除本机 MCP 状态、权限模式存址、ZCode 专属落点等一次性信息，改成通用占位与指向 `docs/PORTABILITY.md`。
- 安装器在 ZCode 下合并 `cli/config.json`、在 Claude 下合并 `settings.json`，按脚本绝对路径识别自有条目，不覆盖用户已有钩子；卸载时一并移除。
