'use strict';

const m = require('./lib/memory.js');
const polish = require('./lib/polish.js');
const recall = require('./lib/recall.js');

async function main() {
  const payload = m.parsePayload(await m.readStdin());
  const cwd = payload.cwd || process.cwd();
  const prompt = typeof payload.prompt === 'string' ? payload.prompt : '';

  recall.markTurnStart(cwd, payload, prompt);

  const parts = [];
  const p = polish.build(prompt);
  if (p) parts.push(p);

  if (prompt.trim()) {
    const r = recall.build(cwd, payload, prompt);
    if (r) parts.push(r);
  }

  if (!parts.length) return;
  m.emit({ additionalContext: parts.join('\n\n') });
}

main().catch(() => {});
