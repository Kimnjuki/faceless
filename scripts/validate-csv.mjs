import fs from 'fs';

const files = [
  'Critical issues.csv',
  'Non-critical issues.csv',
  'Chart.csv',
  'Metadata.csv',
  'contentanonymity_05-sep-2026_pages_2026-09-05_05-01-39.csv',
];

/** Parse one CSV line into fields (RFC-4180 quoting). Returns null if unbalanced. */
function parseLine(l) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let j = 0; j < l.length; j++) {
    const c = l[j];
    if (c === '"') {
      if (inQuotes && l[j + 1] === '"') { cur += '"'; j++; continue; }
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      fields.push(cur); cur = '';
    } else {
      cur += c;
    }
  }
  if (inQuotes) return null;
  fields.push(cur);
  return fields;
}

let exitCode = 0;
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const lines = t.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = parseLine(lines[0]);
  if (!header) { console.log(`❌ ${f}: header unbalanced`); exitCode = 1; continue; }
  const badRows = [];
  lines.forEach((l, i) => {
    const fields = parseLine(l);
    if (!fields) { badRows.push(i + 1); return; }
    if (l !== lines[0] && fields.length !== header.length) badRows.push(i + 1);
  });
  if (badRows.length > 0) {
    console.log(`❌ ${f}: bad rows ${badRows.join(', ')} (expected ${header.length} cols)`);
    exitCode = 1;
  } else {
    console.log(`✅ ${f}: ${lines.length} rows, ${header.length} cols, well-formed`);
  }
}
process.exit(exitCode);