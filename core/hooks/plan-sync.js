'use strict';

const fs = require('node:fs');
const path = require('node:path');
const m = require('./lib/memory.js');

const PLAN_START = '<!-- plan:start -->';
const PLAN_END = '<!-- plan:end -->';
const STATUS_MARK = { completed: 'x', in_progress: '~', pending: ' ' };

function renderPlan(todos, sessionId) {
  const done = todos.filter((t) => t.status === 'completed').length;
  const open = todos.filter((t) => t.status !== 'completed');
  const lines = [
    PLAN_START,
    '## 当前计划',
    '',
    `- 更新时间：${new Date().toISOString()}`,
    `- 会话：${sessionId || 'unknown'}`,
    `- 进度：${done}/${todos.length}`,
    '',
  ];
  for (const t of todos) {
    const mark = STATUS_MARK[t.status] ?? ' ';
    const pri = t.priority ? ` _(${t.priority})_` : '';
    lines.push(`- [${mark}] ${String(t.content || '').replace(/\s+/g, ' ').trim()}${pri}`);
  }
  lines.push('', open.length ? `**下一步**：${open[0].content}` : '**下一步**：全部完成，等待新指令', '', PLAN_END);
  return lines.join('\n');
}

function skeleton(cwd) {
  return [
    `# 上下文记忆：${path.basename(cwd)}`,
    '',
    `- 工作区：${cwd}`,
    `- 创建时间：${new Date().toISOString()}`,
    '',
    '> 回顾上下文只读本文件，不重扫代码库、不复述历史对话。',
    '',
    '## 目标',
    '',
    '## 关键约束',
    '',
    '## 关键决策与依据',
    '',
    '## 已验证事实（命令 / 测试 / 文件行号）',
    '',
    '## 待办与阻塞',
    '',
    '## 已知坑 / 不要重犯',
    '',
  ].join('\n');
}

function upsertPlan(markdown, block, cwd) {
  const start = markdown.indexOf(PLAN_START);
  const end = markdown.indexOf(PLAN_END);
  if (start >= 0 && end > start) {
    return markdown.slice(0, start) + block + markdown.slice(end + PLAN_END.length);
  }
  const header = markdown.trim() ? markdown.replace(/\s*$/, '\n\n') : skeleton(cwd);
  return header + block + '\n';
}

async function main() {
  const payload = m.parsePayload(await m.readStdin());
  const cwd = payload.cwd || process.cwd();
  const input = payload.tool_input || payload.toolInput || {};
  const todos = Array.isArray(input.todos) ? input.todos : null;
  if (!todos || todos.length === 0) return;

  const file = m.memoryPathFor(cwd);
  m.ensureDir();
  const next = upsertPlan(m.readText(file) || skeleton(cwd), renderPlan(todos, payload.session_id), cwd);

  let wrote = true;
  try {
    fs.writeFileSync(file, next, 'utf8');
  } catch {
    wrote = false;
  }

  const open = todos.filter((t) => t.status !== 'completed');
  const state = m.readState(cwd);
  m.writeState(cwd, {
    ...state,
    lastTodos: todos.map((t) => ({ content: t.content, status: t.status, priority: t.priority })),
    lastTodosAt: new Date().toISOString(),
    openTodos: open.map((t) => String(t.content || '').replace(/\s+/g, ' ').trim()),
    sessionId: payload.session_id || state.sessionId || null,
    memoryDirtyAt: wrote ? null : state.memoryDirtyAt || null,
    memNudge: false,
  });

  const ctx = wrote
    ? open.length
      ? `计划已同步到 ${file}（进度 ${todos.length - open.length}/${todos.length}，剩余 ${open.length} 项）。收尾前必须把剩余项全部做完。`
      : `计划已同步到 ${file}（全部 ${todos.length} 项完成）。收尾前确认关键结论已写进记忆文件。`
    : `计划写入失败，请手动维护 ${file}`;
  m.emit({ additionalContext: ctx });
}

main().catch(() => {});
