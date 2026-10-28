'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO = path.join(__dirname, '..');
const SKILLS = path.join(REPO, 'core', 'skills');

function frontmatterValue(fm, key) {
  const m = new RegExp('^\\s*' + key + ':\\s*(.+)$', 'm').exec(fm);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
}

const rows = [];
for (const dir of fs.readdirSync(SKILLS).sort()) {
  const file = path.join(SKILLS, dir, 'SKILL.md');
  if (!fs.existsSync(file)) continue;
  const parts = fs.readFileSync(file, 'utf8').split(/^---$/m);
  const fm = parts[1] || '';
  let desc = frontmatterValue(fm, 'description_zh') || frontmatterValue(fm, 'description');
  desc = desc.replace(/\s+/g, ' ').trim();
  if (desc.length > 100) desc = desc.slice(0, 98) + '…';
  rows.push('| `' + dir + '` | ' + (desc || '-').replace(/\|/g, '\\|') + ' |');
}

const out = [
  '# 技能清单（' + rows.length + '）',
  '',
  '安装后位于 `<安装目录>/skills/`。触发词与完整流程见各目录内的 `SKILL.md`。',
  '',
  '| 技能 | 用途 |',
  '|---|---|',
  ...rows,
  '',
].join('\n');

fs.writeFileSync(path.join(REPO, 'docs', 'SKILLS.md'), out, 'utf8');
console.log('skills:', rows.length);
