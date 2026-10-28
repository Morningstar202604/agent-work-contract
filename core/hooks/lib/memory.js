'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// 记忆目录解析优先级：
//   1. AGENT_RULES_MEMORY_DIR（新约定，安装到任意工具时显式指定）
//   2. ZCODE_MEMORY_DIR（兼容旧环境与自检脚本）
//   3. <规则目录>/memory —— 规则目录 = 本文件上两级（安装根）
// 这样仓库被装到 ~/.zcode、~/.claude 或任意目录时，记忆都跟着规则目录走。
function resolveMemoryDir() {
  if (process.env.AGENT_RULES_MEMORY_DIR) return path.resolve(process.env.AGENT_RULES_MEMORY_DIR);
  if (process.env.ZCODE_MEMORY_DIR) return path.resolve(process.env.ZCODE_MEMORY_DIR);
  return path.resolve(__dirname, '..', '..', 'memory');
}

const MEMORY_DIR = resolveMemoryDir();
// 规则安装根目录：hooks/lib 的上两级。guard-write 用它判断「写入规则目录自身」是否放行。
const RULES_HOME = path.resolve(__dirname, '..', '..');

function readStdin() {
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => { buf += c; });
    process.stdin.on('end', () => resolve(buf));
    process.stdin.on('error', () => resolve(buf));
  });
}

function parsePayload(raw) {
  try {
    const v = JSON.parse(raw || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

function slugFor(cwd) {
  const base = path.basename(cwd || process.cwd()) || 'root';
  const clean = base.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'root';
  const digest = crypto.createHash('sha1').update(path.resolve(cwd || process.cwd())).digest('hex').slice(0, 8);
  return `${clean}-${digest}`;
}

function memoryPathFor(cwd) {
  return path.join(MEMORY_DIR, `${slugFor(cwd)}.md`);
}

function journalPathFor(cwd) {
  return path.join(MEMORY_DIR, `${slugFor(cwd)}.journal.md`);
}

function statePathFor(cwd) {
  return path.join(MEMORY_DIR, `${slugFor(cwd)}.state.json`);
}

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function headingIndex(markdown, limit = 40) {
  const out = [];
  const seen = new Set();
  for (const line of markdown.split(/\r?\n/)) {
    const m = /^(#{1,4})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    if (level > 3) continue;
    const text = m[2].replace(/[*`_]/g, '').trim();
    const key = `${level}:${text}`;
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(`${'  '.repeat(level - 1)}- ${text}`);
    if (out.length >= limit) break;
  }
  return out;
}

function readState(cwd) {
  try {
    return JSON.parse(readText(statePathFor(cwd)) || '{}');
  } catch {
    return {};
  }
}

function atomicWrite(file, data) {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmp, data, 'utf8');
    fs.renameSync(tmp, file);
    return true;
  } catch {
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
    return false;
  }
}

function sleepMs(ms) {
  try {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  } catch {
    const end = Date.now() + ms;
    while (Date.now() < end) { /* spin */ }
  }
}

function withLock(file, fn) {
  const lock = `${file}.lock`;
  const deadline = Date.now() + 1500;
  for (;;) {
    try {
      const fd = fs.openSync(lock, 'wx');
      fs.closeSync(fd);
      try {
        return fn();
      } finally {
        try { fs.unlinkSync(lock); } catch { /* ignore */ }
      }
    } catch (e) {
      if (e && e.code !== 'EEXIST') return fn();
      let stale = false;
      try {
        stale = Date.now() - fs.statSync(lock).mtimeMs > 2000;
      } catch { /* lock vanished */ }
      if (stale) {
        try { fs.unlinkSync(lock); } catch { /* ignore */ }
        continue;
      }
      if (Date.now() > deadline) return fn();
      sleepMs(2 + Math.floor(Math.random() * 4));
    }
  }
}

function writeState(cwd, state) {
  try {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    const file = statePathFor(cwd);
    const data = JSON.stringify(state, null, 2);
    if (!withLock(file, () => atomicWrite(file, data))) {
      fs.writeFileSync(file, data, 'utf8');
    }
  } catch {
    /* state is advisory only */
  }
}

function updateState(cwd, patchFn) {
  let result = {};
  try {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    const file = statePathFor(cwd);
    withLock(file, () => {
      const current = readState(cwd);
      const next = typeof patchFn === 'function' ? patchFn(current) : { ...current, ...patchFn };
      result = next || current;
      atomicWrite(file, JSON.stringify(result, null, 2));
    });
  } catch {
    /* state is advisory only */
  }
  return result;
}

function ensureDir() {
  try {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  } catch {
    /* ignore */
  }
}

function emit(obj) {
  process.stdout.write(JSON.stringify(obj));
}

module.exports = {
  MEMORY_DIR,
  RULES_HOME,
  readStdin,
  parsePayload,
  slugFor,
  memoryPathFor,
  journalPathFor,
  statePathFor,
  readText,
  headingIndex,
  readState,
  writeState,
  updateState,
  ensureDir,
  emit,
};
