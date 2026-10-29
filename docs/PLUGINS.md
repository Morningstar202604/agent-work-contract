# 推荐插件清单

本仓库收录**规则 + 技能 + 子代理 + 命令 + 钩子**；插件不进仓库（由 ZCode 官方市场分发，搬运会腐化），这里只维护「每台新机器必装」的清单。装完插件后，与官方插件同名的 7 个仓库技能会被安装器自动跳过（`install.js` 的 `SKIP_SKILL_NAMES`），避免遮蔽。

## 必装（官方市场）

| 插件 | 用途 | 替代的仓库技能 |
|---|---|---|
| `documents` | Word 文档读写与查看 | docx, docx-viewer |
| `pdf` | PDF 处理与查看 | pdf, pdf-viewer |
| `presentations` | PPT 生成与查看 | pptx, pptx-viewer |
| `spreadsheets` | Excel 处理与查看 | xlsx, xlsx-viewer |
| `skill-creator` | 创建/迭代技能 | skill-creator |
| `visualize` | 会话内可视化与交互页 | visualize |
| `browser-use` | 浏览器自动化与网页测试 | — |
| `computer-use` | 原生桌面应用操作 | — |
| `zcode-guide` | ZCode 配置/钩子/MCP/插件诊断 | — |
| `node-repl-host` | 受控 JS 运行时 | — |

## 按需

| 插件 | 用途 |
|---|---|
| `android-emulator` | Android 构建/模拟器/UI 自动化 |
| `ios-simulator` | iOS 模拟器构建与自动化 |
| `plugin-creator` | 开发自有插件与本地市场 |
| `image-search` | 图片检索 |
| `restore-legacy-sessions` | 旧版会话迁移 |

## 新机安装顺序

```bash
git clone https://gitcode.com/badhope/rules.git && cd rules
node install.js --all          # 规则 + 技能 + 子代理 + 钩子
# 插件在 ZCode 内：/plugin 安装上方「必装」清单
python ~/.agent-secrets/accounts_cli.py sync   # 凭据（见 docs/SECRETS.md）
```
