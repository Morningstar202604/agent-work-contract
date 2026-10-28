# Changelog

## 1.1.0 — 2026-10-29

### 新增

- **10 个工程管理技能**：`project-lifecycle`（全周期与阶段门禁）、`task-slicing`（WBS/切片/DoD）、`requirement-framing`（动手前五问）、`cache-economy`（缓存与上下文成本）、`process-and-artifact-ledger`（台账制）、`repo-cartography`（陌生仓库测绘）、`repo-hygiene`（分支/提交/依赖治理）、`incremental-refactor`（小步重构）、`decision-log`（轻量 ADR）、`delivery-quality-bar`（交付质量基线）、`toolchain-playbook`（本机工具链速查）。
- **`hooks/ledger.js` 台账 CLI**：`status` / `phase active|closing|done` / `add-proc` / `rm-proc` / `add-file` / `artifact`，状态同步渲染到记忆文件的「资源台账」区块。
- **项目阶段模型**：`active` 阶段允许保留进程与中间产物；只有 `closing` 才强制清零并触发清理检查。
- **运行时配置下发**：安装器写入 `skills.metadataBudget=60000`、`toolConcurrency.maxConcurrency=16`、`features` 全开、`hooks.maxOutputBytes=65536`、`hooks.timeoutMs=30000`。

### 修改

- `AGENTS.md`：新增「十一之二 切片式交付」「十一之三 缓存与成本经济」；把「每轮收尾」改为「按项目阶段收尾」；「进程与资源生命周期」改为「进程与资源台账（登记实时，清理统一）」。
- `hooks/stop-guard.js`：按 `projectPhase` 分支。`active` 只拦未验证改动与记忆未落盘；`closing` 才拦未关进程与未完成待办，并串联 `cleanup-check`。
- `hooks/guard-bash.js`：长驻服务提示改为「已登记台账，项目收尾统一关闭」，并写 `procNudged=false`。
- `hooks/lib/polish.js`：每轮注入 4000→600 字符，只留规则摘要与原请求截断。
- `hooks/lib/recall.js`：常驻注入压缩为「路径 + 阶段 + 未完成数 + 台账进程数」，标题索引只在回顾类请求时给。
- `install.js`：`installRules()` 保留 `## 十七、本机环境与个人约定` 段落；`readJson()` 剥离 UTF-8 BOM；`copyTree()` 支持跳过与插件同名的技能。
- 82 个技能的 `description` 全部压到 250 字符以内（ZCode 单条硬截断阈值），累计描述元数据从 25k 降到 12k 字符。
- 默认跳过 `docx` / `pdf` / `pptx` / `xlsx` / `skill-creator` / `visualize` / `plugin-creator`：官方插件版功能更全，用户级同名技能会遮蔽它们。
- `core/hooks/selftest.js`：52 例（新增 active/closing 阶段分支与台账提示用例）。
- `README.md` / `docs/HOOKS.md` / `docs/SKILLS.md` 同步更新。

### 修复

- 220 个子代理缺少 `name` frontmatter，ZCode 会静默丢弃全部；已按文件名补齐。
- 39 个只读子代理的 `tools: {write:false,edit:false}` 映射写法被 ZCode 忽略，改为 `disallowedTools: Write, Edit`。
- `~/.zcode/cli/config.json` 带 BOM 导致安装器 `JSON.parse` 失败、钩子静默未注册。

## 1.0.0 — 2026-10-28

首个可复用版本，从本机 `~/.zcode` 规则体系整理而来。

### 新增

- `AGENTS.md`：16 节全局工作规范（输出纪律、工作流程、诚实、安全、边界与风险、指令优先级、效率、技术选型、AQG、Skill-first、凭据库、提示词润色、上下文记忆、完成度纪律、收尾检查、进程生命周期、工作区边界、工具优先级、移植）。
- `core/skills/`：71 个技能（含本仓库的复用技能 `agent-work-contract`），覆盖工作契约、AQG 审计、代码评审、调试、TDD、架构、前端、后端、数据库、安全、可观测性、发布门禁、技能工程。
- `core/agents/`：220 个子代理角色，按战队组织。
- `core/commands/`：`review`、`arch-review`、`security-scan`、`test-gap`。
- `core/hooks/`：8 个钩子 + 5 个共用模块 + Claude Code 输出适配器，提供记忆注入、计划落盘、危险命令提示、验证门禁、收尾阻断、清理检查。
- `install.js`：跨工具安装器（ZCode / Claude Code / opencode / Codex / generic），支持 `--all`、`--dry-run`、`--home`、`--no-hooks`、`--uninstall`，幂等且备份覆盖。
- `docs/`：`PORTABILITY.md`（能力矩阵与降级）、`HOOKS.md`（钩子协议）、`SECRETS.md`（凭据接入）、`SKILLS.md`（技能清单）、`REUSE-PROMPT.md`（一键复用提示词）。
- `scripts/verify.js`：交付前自检（技能/子代理/命令/钩子数量、50 例自检、密钥与个人路径扫描、文档齐全）。
- `.github/workflows/verify.yml`：Ubuntu + Windows 双平台跑自检、仓库校验与安装冒烟。
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
