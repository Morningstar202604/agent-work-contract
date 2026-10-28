---
name: repo-hygiene
description: "仓库卫生与长期可维护性：分支策略、提交粒度、忽略规则、产物与密钥隔离、依赖与告警治理。触发：仓库管理、提交规范、清理仓库、分支规划。"
license: MIT
metadata:
  version: "1.0"
---

# 仓库卫生

## 分支

| 场景 | 做法 |
|---|---|
| 单人小改 | 直接在 main，小步提交 |
| 多切片功能 | `feat/<主题>`，每片一提交 |
| 实验性改动 | `exp/<主题>`，验证后合或弃 |
| 紧急修复 | `fix/<主题>`，合入后补回归测试 |

合并前：本地跑验证命令、rebase 到最新主干、确认无冲突残留。

## 提交

格式：`<type>(<scope>): <祈使句描述>`

- type：feat / fix / refactor / test / docs / chore / perf / build
- 一提交一件事；能独立回滚
- body 写「为什么」，不写「改了什么」（diff 已经说明）
- 不提交密钥、构建产物、编辑器状态文件、大二进制

## .gitignore 基线

```
node_modules/
dist/
build/
out/
coverage/
.tmp/
*.log
.env
.env.*
!.env.example
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/extensions.json
```

## 产物与源码隔离

- 构建产物不进版本库；需要发布用 CI 制品或 Release。
- 生成文件要么进 `.gitignore`，要么在 README 写明生成命令。
- 数据库文件、上传目录、缓存目录一律忽略。

## 依赖治理

1. 新增依赖前：是否已有等价能力？包体积与维护状态如何？
2. 锁文件必须提交；升级依赖单独一个提交。
3. 定期跑 `pnpm audit` / `npm audit`，高危优先处理。
4. 不用 `--force` 绕过 peer 冲突，先查清原因。

## 清理

- 死代码、注释掉的代码块、调试打印、临时开关，收尾时删。
- 过时文档比没有文档更糟：改动影响到的文档必须同步。
- 分支合并后删除远端分支。
