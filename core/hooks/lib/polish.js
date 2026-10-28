'use strict';

const MAX_PROMPT = 4000;

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
    '【提示词润色规则 · 每轮生效】',
    '执行本轮任务前，先按全局指令「用户提示词润色」把下方原始请求改写为专业提示词，并在回复最开头输出【提示词润色】块（原始请求 → 润色后提示词 + 假设），随后才是正式结果。',
    '改写要求：术语专业化、意图去模糊、隐含约束显式化、缺失信息按最合理默认补齐并标注为假设；不改变用户的实际目标，不擅自扩大或缩小范围。',
    '自动化契约：本环境已开启全自动模式 —— 不询问用户、不使用 AskUserQuestion、不因风险或歧义停下；需要选方向时按 AGENTS.md §五第 16 条列 5 个候选方案、逐项对比优缺点与成本、自选最优后直接执行，把假设与选择依据写进交付清单。',
    '若原始请求本身已足够专业精确（无模糊点、无缺口），只输出一行「【提示词润色】原请求已专业，无需改写」。',
    '',
    '--- 原始请求开始 ---',
    shown,
    '--- 原始请求结束 ---',
  ].join('\n');
}

module.exports = { build, shouldSkip };
