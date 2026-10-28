'use strict';

const fs = require('node:fs');
const path = require('node:path');
const m = require('./lib/memory.js');
const { classifyTarget } = require('./lib/guards.js');

const CODE_EXT = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.vue', '.svelte',
  '.py', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cc', '.cpp', '.h', '.hpp',
  '.cs', '.rb', '.php', '.lua', '.sh', '.ps1', '.sql', '.css', '.scss', '.less',
  '.wxml', '.wxss',
]);

const MANIFESTS = [
  'package.json', 'pyproject.toml', 'setup.py', 'requirements.txt', 'Cargo.toml',
  'go.mod', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'composer.json', 'Gemfile',
];

const SKIP_PATH = /(^|[\\/])(node_modules|dist|build|out|\.git|\.venv|venv|__pycache__|\.next|target|coverage|\.zcode|\.aqg|\.workbuddy)([\\/]|$)/i;

function findManifest(startDir, stopDir) {
  let dir = startDir;
  const stop = path.resolve(stopDir);
  for (let i = 0; i < 10; i += 1) {
    for (const name of MANIFESTS) {
      if (fs.existsSync(path.join(dir, name))) return path.join(dir, name);
    }
    const parent = path.dirname(dir);
    if (parent === dir || path.resolve(dir) === stop) break;
    dir = parent;
  }
  return null;
}

async function main() {
  const payload = m.parsePayload(await m.readStdin());
  const input = payload.tool_input || payload.toolInput || {};
  const target = input.file_path || input.path || input.notebook_path || '';
  if (!target) return;

  const kind = classifyTarget(target);
  if (kind) {
    m.emit({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: [
          `【密钥保护】检测到对${kind}的写操作：${target}`,
          '规则：凭据、令牌、私钥原则上不由 AI 读取或改写，也不得复制进对话产物。',
          '本次已按用户授权放行，仅作提示。',
        ].join('\n'),
      },
    });
    return;
  }

  const cwd = payload.cwd || process.cwd();
  const abs = path.resolve(cwd, String(target));
  if (abs.startsWith(path.resolve(m.MEMORY_DIR) + path.sep)) return;
  if (SKIP_PATH.test(abs)) return;

  const root = path.resolve(cwd);
  const rulesHome = path.resolve(m.RULES_HOME);
  const isUnder = (base, p) => p === base || p.startsWith(base + path.sep);
  const allowedOutside = isUnder(rulesHome, abs);
  const inside = isUnder(root, abs);
  if (!inside && !allowedOutside) {
    m.emit({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: [
          `【工作区边界】目标在工作区外：${abs}`,
          `当前工作区：${root}`,
          '规则：所有产物必须留在当前工作区内；需要改外部文件时先向用户确认或改用工作区内的副本。',
        ].join('\n'),
      },
    });
    return;
  }

  const ext = path.extname(abs).toLowerCase();
  const looksCode = CODE_EXT.has(ext) || (payload.tool_name || payload.toolName) === 'ApplyPatch';
  const manifest = looksCode ? findManifest(path.dirname(abs), cwd) : null;

  m.updateState(cwd, (state) => {
    const next = { ...state, memoryDirtyAt: new Date().toISOString() };
    if (manifest) {
      next.needsVerify = true;
      next.lastVerifyOk = false;
      next.verifyProject = path.relative(cwd, path.dirname(manifest)) || '.';
      next.changedFiles = [...new Set([...(state.changedFiles || []), path.relative(cwd, abs)])].slice(-20);
    }
    return next;
  });
}

main().catch(() => {});
