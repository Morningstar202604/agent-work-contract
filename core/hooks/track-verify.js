'use strict';

const m = require('./lib/memory.js');

const VERIFY_RE = [
  /\b(npm|pnpm|yarn|bun)\s+(run\s+)?(test|tests|typecheck|type-check|lint|gate|verify|check)(:|$|\s)/i,
  /\b(npm|pnpm|yarn|bun)\s+test\b/i,
  /\b(vitest|jest|mocha|ava|playwright|cypress)\b/i,
  /\b(pytest|py\.test|unittest|tox|nox)\b/i,
  /\bpython[0-9.]*\s+-m\s+(pytest|unittest|mypy|ruff|flake8|black)\b/i,
  /\b(cargo\s+(test|check|clippy)|go\s+(test|vet)|mvn\s+(test|verify)|gradle(w)?\s+(test|check))\b/i,
  /\b(tsc\s+(--noEmit|-p)|vue-tsc|eslint|prettier\s+--check|ruff|mypy)\b/i,
  /\bgitleaks\b|\baudit\b.*--prod|\bsemgrep\b/i,
  /\bnode\s+--test\b/i,
  /\bmake\s+(test|check|lint)\b/i,
];

const FAIL_HINT = /\b(?:[1-9]\d*\s+(?:failed|failing|errors?)|FAIL|Traceback|AssertionError)\b|[✗✘]/i;

async function main() {
  let payload = {};
  try {
    payload = JSON.parse((await m.readStdin()) || '{}');
  } catch {
    return;
  }

  const toolName = payload.tool_name || payload.toolName || '';
  if (toolName !== 'Bash') return;

  const input = payload.tool_input || payload.toolInput || {};
  const cmd = String(input.command || '');
  if (!cmd.trim() || !VERIFY_RE.some((re) => re.test(cmd))) return;

  const event = payload.hook_event_name || payload.hookEventName || 'PostToolUse';
  const cwd = payload.cwd || process.cwd();
  const response = payload.tool_response || payload.toolResponse || {};
  const raw =
    typeof response === 'string'
      ? response
      : JSON.stringify(response);
  const exitCode =
    response && typeof response === 'object'
      ? response.exitCode ?? response.exit_code ?? response.code
      : undefined;

  const status = response && typeof response === 'object' ? String(response.status || '').toLowerCase() : '';
  const failed =
    event === 'PostToolUseFailure' ||
    (typeof exitCode === 'number' && exitCode !== 0) ||
    (typeof exitCode !== 'number' && ['failed', 'timed_out', 'cancelled', 'spawn_error'].includes(status)) ||
    (typeof exitCode !== 'number' && !status && FAIL_HINT.test(raw || ''));

  const errorText =
    event === 'PostToolUseFailure'
      ? String(payload.error || payload.error_details?.message || 'tool execution failed').slice(0, 200)
      : '';

  const state = m.readState(cwd);
  m.writeState(cwd, {
    ...state,
    lastVerifyAt: new Date().toISOString(),
    lastVerifyCmd: cmd.slice(0, 200),
    lastVerifyOk: !failed,
    needsVerify: failed ? true : false,
    verifyFailed: failed ? true : false,
    ...(errorText ? { lastVerifyError: errorText } : {}),
  });
}

main().catch(() => {});
