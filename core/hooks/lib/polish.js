'use strict';

// 每轮注入保持短小：完整规则在 AGENTS.md §九，这里只做提醒。
// 旧版把整段规则 + 最多 4000 字原请求回贴进上下文，每轮多出上千 token，
// 对长会话是纯负担；模型本来就能看到用户原话，无需重复。
const MAX_PROMPT = 600;

function shouldSkip(text) {
  if (!text) return true;
  const t = text.trim();
  if (t.length < 2) return true;
  if (t.startsWith('/') || t.startsWith('!')) return true;
  if (/^\[(Request interrupted|Tool use|系统|system)/i.test(t)) return true;
  return false;
}

function build(prompt) {
  if (shouldSkip(prompt)) return '';
  const shown = prompt.length > MAX_PROMPT ? prompt.slice(0, MAX_PROMPT) + '\u2026' : prompt;
  return [
    '【提示词润色】按 AGENTS.md §九：回复开头给「原始请求 → 润色后 + 假设」块；已足够精确则写一行「原请求已专业，无需改写」。',
    '自动化契约：不询问、不用 AskUserQuestion；需要选方向时列 5 个候选对比后自选并执行。',
    `原始请求摘要（完整原文见用户消息）：${shown}`,
  ].join('\n');
}

module.exports = { build, shouldSkip };
