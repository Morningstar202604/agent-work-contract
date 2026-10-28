#!/usr/bin/env node
'use strict';

// 台账 CLI 入口：node <规则目录>/hooks/ledger.js <status|phase|add-proc|rm-proc|add-file|artifact>
// 实现在 lib/ledger.js；这里显式调用 main，保证从 hooks/ 根目录直接执行时行为一致。
const ledger = require('./lib/ledger.js');

try {
  ledger.main();
} catch (e) {
  process.stderr.write(String((e && e.message) || e) + '\n');
  process.exitCode = 1;
}
