'use strict';

const SECRET_FILE_PATTERNS = [
  /(^|[\\/])\.env$/i,
  /(^|[\\/])\.env\.(?!example$|sample$|template$)[\w.-]+$/i,
  /\.pem$/i, /\.p12$/i, /\.pfx$/i, /\.key$/i, /\.keystore$/i, /\.jks$/i,
  /(^|[\\/])id_rsa$/i,
  /(^|[\\/])id_ed25519$/i,
  /(^|[\\/])\.netrc$/i,
  /(^|[\\/])\.npmrc$/i,
  /(^|[\\/])\.pypirc$/i,
  /(^|[\\/])credentials(\.json)?$/i,
  /(^|[\\/])secrets?(\.json)?$/i,
  /(^|[\\/])accounts\.json$/i,
  /(^|[\\/])service[_-]?account[\w.-]*\.json$/i,
  /(^|[\\/])(auth|access|refresh|api)[_-]?tokens?\.json$/i,
];

const SECRET_DIR_PATTERNS = [
  /(^|[\\/])\.ssh([\\/]|$)/i,
  /(^|[\\/])\.aws([\\/]|$)/i,
  /(^|[\\/])\.gnupg([\\/]|$)/i,
  /(^|[\\/])secrets([\\/]|$)/i,
  /(^|[\\/])keystore([\\/]|$)/i,
];

const GIT_RISK_PATTERNS = [
  { re: /\bgit\s+add\s+(-A|--all)\b/i, why: '整目录 add 会把 .env / 密钥 / 大文件一起纳入版本控制' },
  { re: /\bgit\s+add\s+[^\n]*(\s-f\b|--force)\b/i, why: '--force 会绕过 .gitignore，把已排除的敏感文件加进仓库' },
  { re: /\bgit\s+add\s+[^\n]*\.env\b/i, why: '直接 add .env 会把明文密钥提交进历史（一旦推送无法撤回）' },
  { re: /\bgit\s+commit\s+[^\n]*--no-verify\b/i, why: '跳过 pre-commit 钩子会绕过 gitleaks 等密钥扫描' },
  { re: /\bgit\s+push\s+[^\n]*--no-verify\b/i, why: '跳过 pre-push 钩子会绕过测试与密钥扫描门禁' },
];

function classifyTarget(target) {
  if (!target) return null;
  const normalized = String(target).replace(/\\/g, '/');
  if (SECRET_FILE_PATTERNS.some((re) => re.test(normalized))) return '凭据/密钥文件';
  if (SECRET_DIR_PATTERNS.some((re) => re.test(normalized))) return '凭据目录';
  return null;
}

function checkGitCommand(cmd) {
  const hit = GIT_RISK_PATTERNS.filter((r) => r.re.test(cmd));
  if (!hit.length) return null;
  return hit.map((h) => '· ' + h.why).join('\n');
}

module.exports = { classifyTarget, checkGitCommand, SECRET_FILE_PATTERNS, SECRET_DIR_PATTERNS };
