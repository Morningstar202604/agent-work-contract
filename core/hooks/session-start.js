'use strict';

const m = require('./lib/memory.js');

async function main() {
  const payload = m.parsePayload(await m.readStdin());
  const cwd = payload.cwd || process.cwd();
  const source = payload.source || 'startup';
  const file = m.memoryPathFor(cwd);
  const body = m.readText(file);
  const index = body ? m.headingIndex(body) : [];

  const state = m.readState(cwd);
  m.writeState(cwd, {
    ...state,
    stopRounds: 0,
    memNudge: false,
    cleanupNudged: false,
    sessionId: payload.session_id || state.sessionId || null,
  });

  const lines = [
    '【上下文记忆契约 · 会话启动】',
    `本工作区的上下文记忆文件：${file}`,
    body
      ? '该文件已存在。需要回顾上下文时，只读这个文件（先看标题索引），不要重新扫描代码库或复述历史对话。'
      : '该文件尚不存在。本轮一旦给出计划，必须先创建它并写入：目标、约束、计划步骤、关键决策、已验证事实、待办。',
  ];
  if (index.length) lines.push('', `标题索引（${index.length} 条，用于快速定位）：`, ...index);
  lines.push(
    '',
    '规则：新事实先核对记忆文件，冲突时以文件为准并向用户指认差异；文件内容过时立即更新，不要外挂记忆。',
    `恢复中断的任务时：先读该文件，再从「待办」第一条未完成项继续。会话来源=${source}。`
  );

  m.emit({ additionalContext: lines.join('\n') });
}

main().catch(() => {});
