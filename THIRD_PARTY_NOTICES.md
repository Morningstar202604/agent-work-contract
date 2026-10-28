# 第三方声明

本仓库的 `core/skills/`、`core/agents/` 与 `core/hooks/` 包含来自多个上游项目的材料，按各自许可分发。使用、修改、再分发前请保留本文件与各技能目录中的原始许可文件。

## 1. 本仓库自有部分

| 范围 | 许可 | 说明 |
|---|---|---|
| `AGENTS.md`、`README.md`、`docs/`、`install.js`、`scripts/`、`templates/` | MIT | 本仓库原创 |
| `core/skills/master-checklist/` | MIT | 原创，`metadata.author: X1882` |
| `core/hooks/`、`core/hooks/lib/` | MIT | 原创运行时门禁实现 |

## 2. 按上游许可分发的技能

| 技能 | 上游 / 作者 | 许可 |
|---|---|---|
| `agent-designer` 等同批 `agent-*`、`api-design-reviewer`、`ci-cd-pipeline-builder`、`code-generator`、`code-intent-planner`、`code-reviewer`、`docker-development`、`env-secrets-manager`、`feature-flags-architect`、`frontend-component-lab`、`observability-designer`、`performance-profiler`、`secrets-vault-manager`、`senior-architect`、`session-handoff`、`ship-gate`、`skill-author`、`skill-finder`、`skill-linter`、`skill-router`、`slo-architect`、`spec-driven-workflow`、`sql-database-assistant`、`tdd-guide`、`ui-ux-accessibility`、`web-data-extractor`、`web-search`、`design-brief-interpreter` | awesome-skillkit | Apache-2.0 |
| `agent-hierarchy` | cbrock84/headcount | MIT |
| `archify` | tt-a1i/archify（含 Cocoon AI 部分） | MIT，见 `core/skills/archify/LICENSE` 与 `THIRD_PARTY_NOTICES.md` |
| `draft-response`、`ticket-triage` | anthropics/knowledge-work-plugins | Apache-2.0 |
| `executing-plans`、`finishing-a-development-branch`、`systematic-debugging`、`verification-before-completion`、`writing-plans` | obra/superpowers | MIT |
| `postgresql-table-design` | wshobson/agents | MIT |
| `python`、`rust`、`typescript` | mindrally/skills（由 Cursor Rules 转换） | Apache-2.0 |
| `supabase`、`supabase-postgres-best-practices` | supabase/agent-skills | MIT |
| `frontend-design` | 原始作者随附 | 见 `core/skills/frontend-design/LICENSE.txt`（Apache-2.0 全文） |
| `react-best-practices` | vercel | 未在 frontmatter 声明；按 Vercel 上游仓库条款使用 |
| `diagram-builder-pro`、`frontend-app-builder`、`frontend-testing-debugging`、`github-actions-advanced`、`quality-gate-checklist`、`shadcn` | 未声明作者 | frontmatter 声明 MIT（`frontend-app-builder` 等）或未声明；保留原文件不动 |
| `deep-security-scan`、`security-scan` | 未声明作者 | MIT（frontmatter） |
| `visualize`、`plugin-creator`、`writing-skills` | 未声明作者 | frontmatter 未声明许可；按原样随附，再分发前请自行确认上游条款 |

## 3. AQG 与审计体系

`core/skills/aqg-*`（11 个）与 `core/skills/audit`、`core/skills/audit-adjudication` 来自 deeppatternai 的 `agent-quality-gates` 与 `decision-engine` 项目（MIT，Copyright (c) 2026 Zhou Peng）。原项目地址：

- https://github.com/deeppatternai/agent-quality-gates
- https://gitee.com/deeppatternai/decision-engine

## 4. 子代理（`core/agents/`）

220 个子代理角色文件为本仓库原创整理，未在文件内声明第三方来源；如后续确认某个角色改编自上游，请在此表补充对应条目。

## 5. 处理原则

1. 上游许可文件（`LICENSE`、`LICENSE.txt`、`THIRD_PARTY_NOTICES.md`）随技能目录原样保留，不要删除。
2. 修改上游技能时，在文件头注明"modified from <upstream>"。
3. 无法确认许可的技能（上表第 2 节末两行）在对外分发前应逐一核实；本仓库作为个人/团队内部复用时保留原状。
4. 本文件随技能增删同步更新；`docs/SKILLS.md` 为技能清单的机器生成版本。
