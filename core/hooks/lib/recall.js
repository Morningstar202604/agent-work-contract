'use strict';

const m = require('./memory.js');

const RECALL_HINT = /回顾|回顾一下|上下文|继续(做|干|上次)?|接着|上次|之前(的|说到)|进度|做到哪|恢复|刚才|前面(说|提)|现在到哪|下一步/;
const STOP_INTENT = /^\s*(?:停|停止|停下|暂停|先停|算了|到此为止|不用了|不再做|取消|结束|够了|先这样|改天再|明天再|我自己来)[\s。！!，,。；;]*$/;

function statePathOf(cwd) {
  return m.statePathFor(cwd);
}

function markTurnStart(cwd, payload, prompt) {
  const state = m.readState(cwd);
  m.writeState(cwd, {
    ...state,
    stopRounds: 0,
    memNudge: false,
    cleanupNudged: false,
    turnStartedAt: new Date().toISOString(),
    skipGuard: STOP_INTENT.test(prompt),
    sessionId: payload.session_id || state.sessionId || null,
  });
}

function build(cwd, payload, prompt) {
  const file = m.memoryPathFor(cwd);
  const body = m.readText(file);
  const state = m.readState(cwd);

  const lines = ['【上下文记忆 · 定位规则】', `工作区记忆文件：${file}`];

  if (!body.trim()) {
    lines.push('该文件尚未建立：本轮若给出计划，必须立即创建它并写入目标、约束、计划、决策与验证结论。');
  } else {
    const open = Array.isArray(state.openTodos) ? state.openTodos.filter(Boolean) : [];
    const updatedAt = state.lastTodosAt ? state.lastTodosAt.slice(0, 19).replace('T', ' ') : '未知';
    lines.push(`计划最后同步：${updatedAt}，未完成 ${open.length} 项。`);
    if (open.length) lines.push('未完成项：' + open.slice(0, 8).map((t, i) => `${i + 1}) ${t}`).join('；'));
  }

  if (RECALL_HINT.test(prompt) && body.trim()) {
    const index = m.headingIndex(body);
    lines.push('', '本轮属于上下文回顾类请求：先读上述记忆文件，按下列索引直接跳读要点；禁止重扫代码库、禁止复述历史对话全文。');
    if (index.length) lines.push(...index);
  }

  lines.push('', '纪律：任何事实以记忆文件为准；发现文件与现状不符，先更新文件再继续；不要把记忆写成大段代码或日志粘贴。');
  return lines.join('\n');
}

module.exports = { build, markTurnStart, RECALL_HINT, STOP_INTENT };
