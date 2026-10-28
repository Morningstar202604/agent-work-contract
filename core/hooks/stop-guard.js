'use strict';

const fs = require('node:fs');
const net = require('node:net');
const m = require('./lib/memory.js');
const cleanupCheck = require('./cleanup-check.js');

const MAX_ROUNDS = 3;

function portOpen(port, timeoutMs = 120) {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    let done = false;
    const finish = (open) => {
      if (done) return;
      done = true;
      sock.destroy();
      resolve(open);
    };
    sock.setTimeout(timeoutMs);
    sock.once('connect', () => finish(true));
    sock.once('timeout', () => finish(false));
    sock.once('error', () => finish(false));
    sock.connect(port, '127.0.0.1');
  });
}

function persistentMatchers(state) {
  // 常驻服务白名单：某些项目本身就是「一直挂着」的服务（如 QQ 机器人三件套）。
  // 用户明确要求这类进程不得在收尾时被清掉，也不该每轮报「进程未关闭」。
  // 用 state.persistentProcs（正则字符串数组）声明，命中即从存活清单里剔除。
  const raw = Array.isArray(state.persistentProcs) ? state.persistentProcs : [];
  const out = [];
  for (const p of raw) {
    try {
      out.push(new RegExp(String(p), 'i'));
    } catch {
      /* 非法正则忽略，不能让守卫自己崩掉 */
    }
  }
  return out;
}

async function liveEntries(state) {
  const list = Array.isArray(state.runningProcs) ? state.runningProcs.filter(Boolean) : [];
  if (!list.length) return [];
  const keepPatterns = persistentMatchers(state);
  const still = [];
  for (const item of list) {
    const cmd = item && typeof item === 'object' ? String(item.command || '') : '';
    if (cmd && keepPatterns.some((re) => re.test(cmd))) continue;
    const port = item && typeof item === 'object' ? item.port : null;
    if (!port) {
      // 没有端口就无法判断死活。旧逻辑一律当作「还在跑」，于是任何一条误登记
      // （比如把 `npx vite build` 当成 dev server）都会让收尾检查永久误报。
      // 现在只保留 10 分钟内的无端口条目（给启动中的服务一个宽限），其余丢弃。
      const started = item && typeof item === 'object' ? Date.parse(item.startedAt || '') : NaN;
      if (Number.isFinite(started) && Date.now() - started < 10 * 60 * 1000) still.push(item);
      continue;
    }
    if (await portOpen(port)) still.push(item);
  }
  return still;
}

async function runGuard(payload) {
  const cwd = payload.cwd || process.cwd();
  const file = m.memoryPathFor(cwd);
  const state = m.readState(cwd);

  const liveProcs = await liveEntries(state);
  if (liveProcs.length !== (Array.isArray(state.runningProcs) ? state.runningProcs.length : 0)) {
    m.writeState(cwd, { ...state, runningProcs: liveProcs });
  }

  if (state.skipGuard) {
    if (Number(state.stopRounds || 0)) m.writeState(cwd, { ...state, stopRounds: 0 });
    if (!liveProcs.length) return null;
    const body = [
      '【收尾提醒 · 用户已喊停，本次不阻断】',
      `本轮启动的进程还没关闭（${liveProcs.length} 个）：`,
      ...liveProcs.slice(0, 8).map((p) => `  · ${typeof p === 'string' ? p : p.command || p.pid || JSON.stringify(p)}`),
      '请在离开前手动关闭这些进程（只关自己启动的，不要动别人的进程）。',
    ].join('\n');
    return { additionalContext: body };
  }

  const rounds = Number(state.stopRounds || 0);
  if (rounds >= MAX_ROUNDS) {
    m.writeState(cwd, { ...state, stopRounds: 0 });
    if (!liveProcs.length) return null;
    const body = [
      '【收尾提醒 · 已达到阻断轮次上限，本次不阻断】',
      `本轮启动的进程还没关闭（${liveProcs.length} 个）：`,
      ...liveProcs.slice(0, 8).map((p) => `  · ${typeof p === 'string' ? p : p.command || p.pid || JSON.stringify(p)}`),
      '请在离开前手动关闭这些进程。',
    ].join('\n');
    return { additionalContext: body };
  }

  let mtimeMs = 0;
  try {
    mtimeMs = fs.statSync(file).mtimeMs;
  } catch {
    mtimeMs = 0;
  }

  const dirtyAt = state.memoryDirtyAt ? Date.parse(state.memoryDirtyAt) : 0;
  const memoryStale = !!dirtyAt && mtimeMs < dirtyAt && !state.memNudge;
  const openTodos = Array.isArray(state.openTodos) ? state.openTodos.filter(Boolean) : [];
  const needsVerify = state.needsVerify === true && state.lastVerifyOk !== true;

  const reasons = [];
  if (liveProcs.length) {
    reasons.push(
      `本轮启动的进程还没关闭（${liveProcs.length} 个）：`,
      ...liveProcs.slice(0, 8).map((p) => `  · ${typeof p === 'string' ? p : p.command || p.pid || JSON.stringify(p)}`),
      '收尾前按记录逆序停止这些进程并确认端口已释放；只关自己启动的，不要动别人的进程。'
    );
  }
  if (openTodos.length) {
    reasons.push(
      `计划里还有 ${openTodos.length} 项未完成，不允许在此停止：`,
      ...openTodos.map((t, i) => `  ${i + 1}. ${t}`),
      '直接继续做完，不要只描述下一步，也不要把剩余项推给用户。'
    );
  }
  if (needsVerify) {
    const files = Array.isArray(state.changedFiles) ? state.changedFiles.slice(-5) : [];
    reasons.push(
      '本轮改了代码但没跑验证，不允许说「完成」：',
      ...(files.length ? [`  改动：${files.join('、')}`] : []),
      '  先跑项目自带的验证命令（test / typecheck / lint / gate），把真实结果贴出来；没跑通过就不要收尾。'
    );
  }
  if (memoryStale) {
    reasons.push(
      `本轮已有改动尚未落盘。把关键事实、决策与依据、已验证结论（命令与文件行号）、新发现的坑写入 ${file}，`,
      '并更新「当前计划」区块与「待办与阻塞」。只写摘要要点，不要贴大段代码或日志。'
    );
  }

  if (!reasons.length) {
    if (rounds) m.writeState(cwd, { ...state, stopRounds: 0 });
    return null;
  }

  m.writeState(cwd, {
    ...state,
    stopRounds: rounds + 1,
    ...(memoryStale ? { memNudge: true } : {}),
  });

  const body = ['【完成度校验 · 第 ' + (rounds + 1) + '/' + MAX_ROUNDS + ' 轮】', ...reasons].join('\n');
  return { continue: true, decision: 'block', reason: body, additionalContext: body };
}

async function main() {
  const payload = m.parsePayload(await m.readStdin());
  const guard = await runGuard(payload);
  if (guard) {
    m.emit(guard);
    return;
  }
  const cwd = payload.cwd || process.cwd();
  const state = m.readState(cwd);
  const cleanup = await cleanupCheck.runCached(payload, state);
  if (cleanup) m.emit(cleanup);
}

if (require.main === module) main();

module.exports = { runGuard };
