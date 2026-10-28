'use strict';

const DANGER_RULES = [
  // force-push：用户已于 2026-10-24 明确长期授权（本人自有仓库的多平台镜像同步），
  // 不再拦截询问。若未来操作他人仓库，请手动恢复此规则。
  {
    id: 'reset-hard',
    re: /\bgit\s+reset\s+[^\n]*--hard\b/i,
    why: '--hard 丢弃工作区与暂存区全部未提交改动',
    fix: '先 git stash 或 git diff > backup.patch 留底',
  },
  {
    id: 'clean-fd',
    re: /\bgit\s+clean\s+[^\n]*-[a-z]*f/i,
    why: 'git clean -f 永久删除未跟踪文件',
    fix: '先 git clean -nd 预览清单',
  },
  {
    id: 'checkout-discard',
    re: /\bgit\s+(checkout|restore)\s+(--\s+)?\.\s*$/i,
    why: '整目录 checkout/restore 丢弃所有未提交改动',
    fix: '指定具体文件路径，或用 git stash 保留现场',
  },
  {
    id: 'rm-rf',
    re: /\brm\b(?=[^\n]*(?:^|\s)-{1,2}[a-zA-Z-]*r)(?=[^\n]*(?:^|\s)-{1,2}[a-zA-Z-]*f)/i,
    why: '递归强删不进回收站，路径写错（或变量为空）无法挽回',
    fix: '先 ls 确认目标，删除构建产物优先用项目 clean 脚本',
  },
  {
    id: 'windows-delete',
    re: /\b(rmdir|rd)\s+\/s\b|\bdel\s+\/[sqf]/i,
    why: 'Windows 递归删除不经过回收站',
    fix: '改为移动到临时目录，或用资源管理器手动删除',
  },
  {
    id: 'drop-truncate',
    re: /\b(DROP\s+(TABLE|DATABASE|SCHEMA)|TRUNCATE\s+TABLE)\b/i,
    why: '删表/库不可回滚',
    fix: '先导出备份（pg_dump / mysqldump），或在事务里验证',
  },
  {
    id: 'sql-no-where',
    re: /\b(?:DELETE\s+FROM\s+[\w."`]+|UPDATE\s+[\w."`]+\s+SET\b)(?![^\n;]*\bWHERE\b)/i,
    why: '不带 WHERE 的 DELETE/UPDATE 会改全表',
    fix: '先用同条件 SELECT 确认影响行数',
  },
  {
    id: 'disk-write',
    re: /\b(mkfs(\.\w+)?|dd\s+if=|diskpart|format\s+[a-zA-Z]:)/i,
    why: '直接操作磁盘会毁掉分区数据',
    fix: '先只读检查目标设备（lsblk / diskutil list）',
  },
  {
    id: 'publish',
    re: /\b(npm|yarn|pnpm)\s+publish\b|\bcargo\s+publish\b|\btwine\s+upload\b/i,
    why: '发布到公共仓库后版本号无法撤回',
    fix: '先 npm pack 本地检查包内容',
  },
  {
    id: 'deploy-prod',
    re: /\b(npm\s+run\s+deploy(:prod(uction)?)?|vercel\s+(--prod|deploy\s+--prod)|netlify\s+deploy\s+--prod|firebase\s+deploy|wrangler\s+publish|gcloud\s+(app|run)\s+deploy)\b/i,
    why: '生产部署影响真实用户，部分平台不保留可回滚版本',
    fix: '先部署到开发/预览环境验证（deploy:dev / --dry-run / preview）',
  },
  {
    id: 'db-migrate-reset',
    re: /\b(prisma\s+migrate\s+(reset|deploy)|sequelize\s+db:migrate:undo:all|alembic\s+downgrade\s+base|flyway\s+clean)\b/i,
    why: '迁移重置会清空数据库结构',
    fix: '先导出快照，或在测试库验证迁移脚本',
  },
  {
    id: 'kill-all',
    re: /\b(pkill|killall)\s+-9\b|\btaskkill\s+\/f\s+\/im\b/i,
    why: '按名字杀进程会连带杀掉同名的无关进程',
    fix: '按端口或 PID 精确定位后再结束',
  },
  {
    id: 'history-rewrite',
    re: /\bgit\s+(filter-branch|filter-repo)\b|\bgit\s+commit\b[^\n]*--amend\b/i,
    why: '改写历史会让已推送提交分叉；--amend 丢掉原提交',
    fix: '仅对未推送的本地提交使用',
  },
];

module.exports = { DANGER_RULES };
