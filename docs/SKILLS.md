# 技能清单（71）

安装后位于 `<安装目录>/skills/`。触发词与完整流程见各目录内的 `SKILL.md`。

| 技能 | 用途 |
|---|---|
| `agent-designer` | 设计多智能体系统：选择编排模式、搭建工作流、生成工具 schema 并分析运行日志。 |
| `agent-hierarchy` | 为仓库设计编排者-子代理层级：按独占写入面拆分代理，让产出者与独立校验者配对。 |
| `agent-work-contract` | 把本套规则、技能、子代理、命令与钩子复用到任意机器/任意编程智能体：安装、升级、验证、卸载。 |
| `api-design-reviewer` | REST/GraphQL 接口契约设计评审专用。当 software-api-designer 产出 API spec、或 software-reviewer 在门禁阶段审查接口正确性/一致性/安… |
| `aqg-audit-adjudication` | Decide accept / reject / needs-user-decision for each Claude Opus, Gemini 3.1, o3, Codex internal-… |
| `aqg-automation-audit` | Inventory automation stack (hooks / MCP / plugins / skills / env) + overlap-check vs AQG workflow … |
| `aqg-code-construction` | Invoke this before writing, modifying, refactoring, or implementing code in any repository — the e… |
| `aqg-decision-capture` | Capture, commit, and query durable project decisions (Owner rulings, agent autonomous choices, age… |
| `aqg-evidence-closeout` | Evidence-backed closeout for AI team project tasks in any repository path, covering fresh verifica… |
| `aqg-multi-review` | Use PROACTIVELY for a non-trivial change — a multi-file feature or larger — that needs balanced co… |
| `aqg-security-review` | Review code for OWASP Top 10, CWE Top 25, and secure-by-default library usage in any repository. U… |
| `aqg-session-handoff` | Generate a paste-ready cross-session handoff prompt that lets a next-session LLM cold-start on a g… |
| `aqg-startup-preflight` | Verify worktree + GitHub live state (dirty git, gone upstream, behind remote, missing context file… |
| `aqg-systematic-debugging` | Root-cause debugging workflow for AI team project failures in any repository path, including faili… |
| `aqg-test-quality-review` | Use when reviewing whether a PR's tests assert BEHAVIOR (output / side-effects / errors) or only S… |
| `archify` | 创建架构、流程、时序与状态图等可交互 HTML/SVG 图表，支持多格式导出。 |
| `audit` | Have one or more EXTERNAL, cross-vendor auditors review code, documents, plans, migrations, or des… |
| `audit-adjudication` | Consolidate multiple completed audit results into one traceable decision record, whether they came… |
| `ci-cd-pipeline-builder` | CI/CD 流水线生成与发布门禁规程。当全栈/软件开发团队需要搭建或改造自动化流水线时调用。覆盖触发策略、并行作业、缓存、构建/测试/扫描门禁、制品打包、多环境部署与回滚，要求门禁失败即阻断、密钥… |
| `code-generator` | 把结构化实现计划变成可运行代码：生成 CRUD、测试桩等骨架与复杂逻辑。 |
| `code-intent-planner` | 识别编码意图并拆解任务：三层瀑布式识别生成带证据分级的执行计划。 |
| `code-reviewer` | 代码静态分析：检测复杂度、密钥泄露、SQL 注入与 SOLID 违规并审查 PR diff。 |
| `deep-security-scan` | 多遍深度安全扫描。当全栈/软件开发团队需要上线前深度安全审计、或单遍 security-scan 发现疑点需深挖时调用。多轮迭代：数据流污点追踪、鉴权越权矩阵、依赖传递漏洞、密钥溯源、业务逻辑漏洞… |
| `design-brief-interpreter` | 把模糊的视觉设计需求转成可校验规格：画布尺寸、构图、配色与文字层级。 |
| `diagram-builder-pro` | 专业架构图与流程图绘制 skill。绘制系统架构图、微服务架构、网络拓扑图、业务流程图、数据流图、时序图、状态机、ER图等。支持 show_widget 内联 SVG 渲染与 Mermaid 代码… |
| `docker-development` | Docker and container development agent skill and plugin for Dockerfile optimization, docker-compos… |
| `draft-response` | 针对具体情境与客户关系起草得体的客户对外回复，覆盖产品答疑、故障与升级、延期等坏消息、拒绝需求与账单问题。 |
| `env-secrets-manager` | 审计 .env 与环境变量卫生，排查已提交的密钥泄露、监测配置漂移并准备凭证轮换，只做检查不读取或打印密钥值。 |
| `executing-plans` | 在当前会话中由自己亲自执行实施计划、逐项落地；当用户选择内联执行或没有子代理可用时使用。 |
| `feature-flags-architect` | 审计、规划并治理功能开关全生命周期，覆盖分类、上线、灰度放量与下线，含灰度发布计划、发布门禁与开关债务扫描。 |
| `finishing-a-development-branch` | 实现完成且所有测试通过后，决定如何整合开发分支的工作成果，收尾并合并特性分支。 |
| `frontend-app-builder` | 前端应用脚手架与组件实现规程。当全栈团队需要从零搭建前端工程或实现具体页面/组件时调用。覆盖技术栈选型、项目结构、路由与状态管理、数据获取、组件拆分、样式方案与构建优化，要求组件单一职责、服务端数… |
| `frontend-component-lab` | 搭建生产级 React 与 TypeScript 组件脚手架，配套 CSS Modules 和 design-tokens.json，并提供规避魔法数字、内联样式等问题的审查清单。 |
| `frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing … |
| `frontend-testing-debugging` | 前端测试与调试规程。当全栈团队需要为前端补 E2E/组件测试、或排查页面交互 Bug 时调用。覆盖组件测试、E2E 关键路径、可视回归的组织方式，以及用浏览器/DevTools 定位渲染、状态、网… |
| `github-actions-advanced` | GitHub Actions 高级 Workflow 工程化指南。当需要编写/优化 CI/CD、配置 OIDC 云认证、复用 reusable workflow、矩阵构建、依赖缓存、密钥与环境保护… |
| `master-checklist` | 主理人工作契约 + 能力最大化指令 + 分类执行清单：开工先拉满、交付带三清单。 |
| `observability-designer` | 可观测性体系设计指南。当需要为服务规划 metrics/logs/traces、定义 RED/USE 指标、设计仪表盘与告警、接入 OpenTelemetry、做健康检查与关键路径埋点时，由 fu… |
| `performance-profiler` | 对 Node.js、Python、Go 应用做系统性性能剖析：定位 CPU/内存/I/O 瓶颈、生成火焰图、分析包体积、优化数据库查询、用 k6 与 Artillery 跑压测。始终先测后改。何时… |
| `plugin-creator` | Create and scaffold plugin directories for Codex with a required `.codex-plugin/plugin.json`, opti… |
| `postgresql-table-design` | 设计或审查 PostgreSQL 数据库表结构：最佳实践、数据类型、索引、约束、性能模式与高级特性。 |
| `python` | Python 开发最佳实践：覆盖 Web、数据科学与自动化。 |
| `quality-gate-checklist` | 通用交付前质检门禁。从完整性、一致性、可追溯、可复现、合规、版权、格式 7 个维度逐项 checklist 检查，不合格项标 H/M/L 分级，H 级问题不交付。全团队 P0 通用 skill，t… |
| `react-best-practices` | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should b… |
| `rust` | Rust 开发规范：内存安全、性能与异步编程。 |
| `secrets-vault-manager` | 搭建密钥管理基础设施：集成 HashiCorp Vault、配置 AWS/Azure/GCP 云密钥库、实现凭证轮换与密钥访问审计，仅做流程设计。 |
| `security-scan` | 单遍快速仓库安全审计。当全栈/软件开发团队在门禁阶段需要一轮快速安全检查时调用。单遍扫描依赖漏洞、硬编码密钥、注入点、鉴权缺失、危险函数等常见风险，输出分级清单与修复建议，速度优先、覆盖面广，不做… |
| `senior-architect` | 系统架构设计、架构评审、技术选型、撰写 ADR，生成 Mermaid、PlantUML 或 ASCII 架构图 |
| `session-handoff` | 把进行中的长会话压缩成冷启动交接文档，含目标、进度、下一步、坑点与关键文件，供新 Agent 接手 |
| `shadcn` | shadcn/ui 组件管理与主题定制指南。当需要用 CLI 添加/更新组件、配置 components.json、定制主题 token 与 CSS 变量、用 CVA 写 variants、覆盖默… |
| `ship-gate` | 上线前发布门禁审计：扫描安全、数据库、部署、代码质量、依赖与可观测性问题，拦截部署直到严重项通过。 |
| `skill-author` | 从零起草新 Agent 技能：命名、写触发描述、生成 SKILL.md 十段式骨架并设计带 argparse 的脚本 |
| `skill-finder` | 按关键词检索本仓库技能、推荐场景组合并输出统计，读取真实 manifest.json 与 SKILL.md |
| `skill-linter` | 按 awesome-skillkit 规范校验 SKILL.md，输出 PASS/WARN/FAIL 报告与修复建议 |
| `skill-router` | 任务一开始就判断：该用哪些已安装技能、各打几分、要不要用。确定性离线词法匹配，毫秒级出结果。 |
| `slo-architect` | Use when defining, reviewing, or operating SLOs/SLIs/error budgets. Triggers on \"define an SLO\",… |
| `spec-driven-workflow` | Use when the user asks to write a spec before code, write specifications, define acceptance criter… |
| `sql-database-assistant` | 编写 SQL 查询、优化慢查询与数据库性能、生成迁移与表结构文档，适配 Prisma、TypeORM 等 ORM |
| `supabase` | 处理任何 Supabase 任务：数据库、Auth、Edge Functions、Storage、RLS 与排错 |
| `supabase-postgres-best-practices` | Postgres 最佳实践：建表改表、schema 设计、迁移、RLS 策略、索引、pgvector 与慢查询诊断 |
| `systematic-debugging` | 遇到任何 bug、测试失败或异常行为时，在提出修复方案前先做系统化调试排查 |
| `tdd-guide` | 测试驱动开发指南：编写单元测试、生成 fixtures 与 mock、分析覆盖率缺口，指导红绿重构流程 |
| `ticket-triage` | 对客服工单进行分类与优先级排序：判定 P1-P4、指派处理团队，并识别重复或已知问题 |
| `typescript` | TypeScript 规范：类型安全与整洁代码实践。 |
| `ui-ux-accessibility` | 审计 UI 设计与代码的可用性与无障碍：Nielsen 启发式评审、WCAG 2.2 数值核对、ARIA 与键盘检查 |
| `verification-before-completion` | 在宣称完成、修复或通过、提交或建 PR 之前，先运行验证命令并用证据确认结果 |
| `visualize` | Create visualizations and interactive tools directly in conversation. Proactively use to show how … |
| `web-data-extractor` | 用 requests 与 BeautifulSoup 抓取网页数据：CSS 选择器、自动翻页、导出 CSV/JSON |
| `web-search` | 免费联网搜索规程。当任何团队需要查最新资料、官方文档、报错解法、依赖版本或事实核查时调用。优先使用自建 SearXNG 或 DuckDuckGo 等免费、无需付费 Key 的搜索入口，带本地缓存避… |
| `writing-plans` | 在拿到规格或多步任务需求后、动手写代码前，先撰写分步实现计划 |
| `writing-skills` | Use when creating new skills, editing existing skills, or verifying skills work before deployment |
