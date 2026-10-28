# 技能清单（82）

安装后位于 `<安装目录>/skills/`。触发词与完整流程见各目录内的 `SKILL.md`。

| 技能 | 用途 |
|---|---|
| `agent-designer` | Design multi-agent systems: pick an orchestration pattern (supervisor/swarm/pipeline/router), scaffold the wo… |
| `agent-hierarchy` | Design orchestrator-and-subagent hierarchies for a repo: split agents by exclusive write surface, pair each p… |
| `agent-work-contract` | Use when the user wants to reuse, install, migrate, or sync this working contract (rules + skills + subagents… |
| `api-design-reviewer` | REST/GraphQL 接口契约设计评审专用。当 software-api-designer 产出 API spec、或 software-reviewer 在门禁阶段审查接口正确性/一致性/安全时调用。覆盖资源建模… |
| `aqg-audit-adjudication` | Decide accept / reject / needs-user-decision for each Claude Opus, Gemini 3.1, o3, Codex internal-review, or … |
| `aqg-automation-audit` | Inventory the automation stack (hooks / MCP / plugins / skills / env) and check it against the AQG workflow; … |
| `aqg-code-construction` | Invoke this before writing, modifying, refactoring, or implementing code in any repository — the entry point … |
| `aqg-decision-capture` | Capture and query durable project decisions (owner rulings, agent choices, audit adjudications) as short entr… |
| `aqg-evidence-closeout` | Evidence-backed closeout for AI team project tasks in any repository path, covering fresh verification, audit… |
| `aqg-multi-review` | Use PROACTIVELY for a non-trivial change — a multi-file feature or larger — that needs balanced coverage acro… |
| `aqg-security-review` | Review code for OWASP Top 10, CWE Top 25 and secure-by-default usage; use when writing auth, handling user in… |
| `aqg-session-handoff` | Generate a paste-ready cross-session handoff: repo/branch, what is done and verified, current state, next ste… |
| `aqg-startup-preflight` | Verify worktree + GitHub live state (dirty git, gone upstream, behind remote, missing context files, open PRs… |
| `aqg-systematic-debugging` | Root-cause debugging for project failures: failing checks, CI errors, test failures, preflight or health-prob… |
| `aqg-test-quality-review` | Review whether tests assert behavior (outputs, side effects, errors) rather than shape, and whether a diff we… |
| `archify` | Create architecture, workflow, sequence, data-flow and lifecycle diagrams as standalone HTML with inline SVG,… |
| `audit` | Have one or more EXTERNAL, cross-vendor auditors review code, documents, plans, migrations, or designs for de… |
| `audit-adjudication` | Consolidate multiple completed audit results into one traceable decision record, whether they came from the s… |
| `cache-economy` | 控制上下文成本与缓存命中：稳定前缀、少而精的读取、增量编辑、避免重复扫描。触发：上下文变长、响应变慢、重复读同一文件、长会话、token 成本高。 |
| `ci-cd-pipeline-builder` | CI/CD 流水线生成与发布门禁规程。当全栈/软件开发团队需要搭建或改造自动化流水线时调用。覆盖触发策略、并行作业、缓存、构建/测试/扫描门禁、制品打包、多环境部署与回滚，要求门禁失败即阻断、密钥走 secrets 不… |
| `code-generator` | Two-tier code generation (L1 script template engine + L2 agent generation) that turns a structured plan into … |
| `code-intent-planner` | Three-tier waterfall intent recognition (L1 regex <10ms, L2 Flash LLM, L3 Pro LLM) that classifies user inten… |
| `code-reviewer` | Static analysis for changes and files across TS/JS/Python/Go/Swift/Kotlin/C#/Java/C++/Rust/Ruby/PHP/Dart: com… |
| `decision-log` | 记录与检索项目的关键决策：背景、候选方案、选择理由、影响范围、复审条件。触发：技术选型、架构取舍、为什么这么做、回顾决策。 |
| `deep-security-scan` | 多遍深度安全扫描。当全栈/软件开发团队需要上线前深度安全审计、或单遍 security-scan 发现疑点需深挖时调用。多轮迭代：数据流污点追踪、鉴权越权矩阵、依赖传递漏洞、密钥溯源、业务逻辑漏洞，输出带复现路径与 P… |
| `delivery-quality-bar` | 定义并执行交付质量标准：验收标准、回归验证、文档同步、可回滚、可追溯。触发：交付前自检、质量门禁、代码评审前、发布前。 |
| `design-brief-interpreter` | Turn a vague visual design request into a checkable spec: purpose, audience, canvas size, composition, palett… |
| `diagram-builder-pro` | 专业架构图与流程图绘制 skill。绘制系统架构图、微服务架构、网络拓扑图、业务流程图、数据流图、时序图、状态机、ER图等。支持 show_widget 内联 SVG 渲染与 Mermaid 代码块两种方式。触发关键词… |
| `docker-development` | Docker and container development agent skill and plugin for Dockerfile optimization, docker-compose orchestra… |
| `draft-response` | Draft a professional customer-facing response for product questions, escalations, outages, delays, won-t-fix … |
| `env-secrets-manager` | Audit .env and environment hygiene, find committed secrets, detect config drift and plan credential rotation;… |
| `executing-plans` | Use when executing an implementation plan in the current session as the implementer yourself — your human par… |
| `feature-flags-architect` | Audit, plan and govern feature flags across their lifecycle: classify, ship, ramp, retire; includes rollout p… |
| `finishing-a-development-branch` | Use when implementation is complete, all tests pass, and you need to decide how to integrate the work |
| `frontend-app-builder` | 前端应用脚手架与组件实现规程。当全栈团队需要从零搭建前端工程或实现具体页面/组件时调用。覆盖技术栈选型、项目结构、路由与状态管理、数据获取、组件拆分、样式方案与构建优化，要求组件单一职责、服务端数据取放分层、可访问性与… |
| `frontend-component-lab` | Scaffold production React/TypeScript components with CSS Modules and design-tokens.json, plus a checklist tha… |
| `frontend-design` | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps … |
| `frontend-testing-debugging` | 前端测试与调试规程。当全栈团队需要为前端补 E2E/组件测试、或排查页面交互 Bug 时调用。覆盖组件测试、E2E 关键路径、可视回归的组织方式，以及用浏览器/DevTools 定位渲染、状态、网络、交互问题的调试流程… |
| `github-actions-advanced` | GitHub Actions 高级 Workflow 工程化指南。当需要编写/优化 CI/CD、配置 OIDC 云认证、复用 reusable workflow、矩阵构建、依赖缓存、密钥与环境保护、Runner 安全加… |
| `incremental-refactor` | 安全地重构既有代码：小步改动、行为不变、测试护航、可随时停下。触发：重构、拆分模块、替换实现、清理技术债。 |
| `master-checklist` | Use when starting any engineering task, taking over an unfamiliar project, auditing or fixing a repo, reviewi… |
| `observability-designer` | 设计可观测性体系：metrics/logs/traces、RED/USE 指标、仪表盘与告警、OpenTelemetry 接入、健康检查与关键路径埋点。触发：dashboard / alert fatigue / go… |
| `performance-profiler` | 对 Node.js、Python、Go 应用做系统性性能剖析：定位 CPU/内存/I/O 瓶颈、生成火焰图、分析包体积、优化数据库查询、用 k6 与 Artillery 跑压测。始终先测后改。何时使用：排查慢接口、规划… |
| `plugin-creator` | Create and scaffold plugin directories for Codex with a required `.codex-plugin/plugin.json`, optional plugin… |
| `postgresql-table-design` | Design or review PostgreSQL schemas: data types, indexing, constraints, performance patterns and advanced fea… |
| `process-and-artifact-ledger` | 维护运行中进程、未完成任务、改动文件与交付物的台账；项目内不强制每轮清理，项目收尾才统一完结。触发：起服务、多轮开发、进程管理、收尾清理。 |
| `project-lifecycle` | 项目全周期管理：立项澄清→WBS 拆解→切片排期→逐片交付→项目收尾。触发：项目管理、多阶段任务、里程碑规划、接手项目、判断项目何时算完成。 |
| `python` | Expert in Python development with best practices across web, data science, and automation Do NOT use for Pyth… |
| `quality-gate-checklist` | 通用交付前质检门禁。从完整性、一致性、可追溯、可复现、合规、版权、格式 7 个维度逐项 checklist 检查，不合格项标 H/M/L 分级，H 级问题不交付。全团队 P0 通用 skill，team-lead 最终… |
| `react-best-practices` | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when… |
| `repo-cartography` | 快速测绘陌生仓库：技术栈、目录职责、入口、构建与测试命令、约定与风险点，产出一页地图。触发：接手项目、进入新仓库、评审前摸底、问这个项目是干什么的。 |
| `repo-hygiene` | 仓库卫生与长期可维护性：分支策略、提交粒度、忽略规则、产物与密钥隔离、依赖与告警治理。触发：仓库管理、提交规范、清理仓库、分支规划。 |
| `requirement-framing` | 接到需求先做问题拆解：还原真实目标、划清范围、列出未知与假设、给出可验收定义。触发：需求模糊、目标不清、先想清楚再动手、方案前置分析。 |
| `rust` | Expert in Rust development with focus on safety, performance, and async programming Do NOT use for unsafe/FFI… |
| `secrets-vault-manager` | Design secret-management infrastructure: HashiCorp Vault, AWS/Azure/GCP secret stores, rotation flows and acc… |
| `security-scan` | 单遍快速仓库安全审计。当全栈/软件开发团队在门禁阶段需要一轮快速安全检查时调用。单遍扫描依赖漏洞、硬编码密钥、注入点、鉴权缺失、危险函数等常见风险，输出分级清单与修复建议，速度优先、覆盖面广，不做深度链路追踪。 |
| `senior-architect` | Design or review system architecture, choose a tech stack, write ADRs, and produce Mermaid/PlantUML/ASCII dia… |
| `session-handoff` | Compress a long in-flight session into a cold-start handoff doc: goal, done, next, gotchas, key files, one-pa… |
| `shadcn` | shadcn/ui 组件管理与主题定制指南。当需要用 CLI 添加/更新组件、配置 components.json、定制主题 token 与 CSS 变量、用 CVA 写 variants、覆盖默认样式、组织私有 re… |
| `ship-gate` | Pre-production audit that scans a codebase for security, database, deployment, code quality, AI/LLM, dependen… |
| `skill-author` | Draft a new agent skill from scratch: clarify the need, name it, write a trigger-rich description, generate t… |
| `skill-finder` | Search this repo-s skills by keyword, recommend scene packs or ad-hoc combos, and print statistics from the r… |
| `skill-linter` | Lint a SKILL.md or skills directory against the spec: frontmatter, name sync, description routing, section sk… |
| `skill-router` | Decide which installed skills a task needs before work starts: offline TF-IDF index over SKILL.md description… |
| `slo-architect` | Define, review and operate SLOs/SLIs and error budgets: burn-rate alerts, multi-window policies, and service … |
| `spec-driven-workflow` | Use when the user asks to write a spec before code, write specifications, define acceptance criteria, do spec… |
| `sql-database-assistant` | Write SQL queries, optimize slow queries and database performance, generate migrations and schema docs; suppo… |
| `supabase` | Handle any Supabase task: Database, Auth, Edge Functions, Storage, Realtime, RLS, vectors, cron, queues and t… |
| `supabase-postgres-best-practices` | Postgres best practices for Supabase: schema and column types, migrations, RLS policies, indexes, pgvector an… |
| `systematic-debugging` | Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes |
| `task-slicing` | 把需求拆成可独立验收的小任务：WBS、依赖排序、验收标准（DoD）、并行面识别。触发：拆任务、做计划、模块化、增量交付、任务太大不知从哪下手。 |
| `tdd-guide` | Test-driven development: write unit tests, generate fixtures and mocks, analyze coverage gaps, and run red-gr… |
| `ticket-triage` | Triage a support ticket: categorize, assign P1-P4 priority, route to the owning team, and detect duplicates o… |
| `toolchain-playbook` | 本机工具链速查与选型：搜索、JSON/YAML 处理、Git 平台、包管理、运行时、构建与容器。触发：选工具、命令怎么写、本机装了什么、该用哪个 CLI。 |
| `typescript` | Expert in TypeScript development with best practices for type safety and clean code Do NOT use for tsconfig/c… |
| `ui-ux-accessibility` | Audit UI designs and code for usability and accessibility: Nielsen heuristics, WCAG 2.2 numeric checks, ARIA,… |
| `verification-before-completion` | Use when about to claim work is complete, fixed, or passing, before committing or creating PRs - requires run… |
| `visualize` | Create visualizations and interactive tools directly in conversation. Proactively use to show how something w… |
| `web-data-extractor` | Extract structured data from websites with requests + BeautifulSoup: CSS-selector field mapping, pagination, … |
| `web-search` | 免费联网搜索规程。当任何团队需要查最新资料、官方文档、报错解法、依赖版本或事实核查时调用。优先使用自建 SearXNG 或 DuckDuckGo 等免费、无需付费 Key 的搜索入口，带本地缓存避免重复抓取，要求交叉验… |
| `writing-plans` | Use when you have a spec or requirements for a multi-step task, before touching code |
| `writing-skills` | Use when creating new skills, editing existing skills, or verifying skills work before deployment |
