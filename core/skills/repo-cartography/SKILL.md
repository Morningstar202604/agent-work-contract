---
name: repo-cartography
description: "快速测绘陌生仓库：技术栈、目录职责、入口、构建与测试命令、约定与风险点，产出一页地图。触发：接手项目、进入新仓库、评审前摸底、问这个项目是干什么的。"
license: MIT
metadata:
  version: "1.0"
---

# 仓库测绘

目标：在 10 分钟内产出一页「仓库地图」，让后续工作不用重复扫描。

## 顺序（每步只读必要文件）

1. **识别栈**：`package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` / `pom.xml` / `build.gradle`。读依赖与 scripts。
2. **读说明**：`README.md` 前 100 行、`AGENTS.md`、`CONTRIBUTING.md`、`docs/` 目录列表。
3. **看结构**：`git ls-files | head -200`，按目录聚合；跳过 vendored 与生成物。
4. **找入口**：`src/index.*`、`main.*`、`cmd/`、`app/`、`pages/`、`routes/`。
5. **定命令**：从 scripts / Makefile / CI 配置里提取 `install / dev / build / test / lint / typecheck`。
6. **找约定**：格式化配置、lint 规则、commit 规范、目录命名习惯。
7. **标风险**：鉴权、密钥、迁移、定时任务、外部集成。

## 输出模板

```markdown
# 仓库地图：<name>

## 一句话
<这个项目解决什么问题>

## 技术栈
- 语言/框架：
- 包管理器：
- 数据库/外部服务：

## 目录职责
| 目录 | 职责 |
|---|---|

## 关键入口
| 入口 | 说明 |
|---|---|

## 命令
| 用途 | 命令 |
|---|---|
| 安装 | |
| 开发 | |
| 测试 | |
| 构建 | |

## 约定
- 

## 风险点
- 
```

## 纪律

- 不读整个仓库；用 `git ls-files` 与目录聚合代替逐文件浏览。
- 地图写进记忆文件「已验证事实」或仓库 `docs/`（用户同意时）。
- 后续会话先读地图，不重复扫描。
