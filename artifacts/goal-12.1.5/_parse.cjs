const fs = require('fs');
function section(file, start) {
  const L = fs.readFileSync(file, 'utf8').replace(/\r/g, '').split('\n');
  const a = L.findIndex(l => l.trim() === start);
  const b = L.findIndex((l, i) => i > a && l.startsWith('## '));
  return L.slice(a + 1, b);
}
function tree(lines) {
  const root = { children: [], depth: -1 };
  const stack = [root];
  let last = null;
  for (const raw of lines) {
    const ind = raw.match(/^ */)[0].length;
    const rest = raw.slice(ind);
    const isLi = rest.startsWith('- ');
    const text = isLi ? rest.slice(2) : rest;
    const d = ind / 2;
    if (!isLi) { if (last) last.text += '\n' + text; continue; }
    const node = { text, depth: d, children: [] };
    while (stack[stack.length - 1].depth >= d) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
    last = node;
  }
  return root;
}
function flat(n, path, out) {
  for (const c of n.children) {
    out.push({ path, text: c.text, depth: c.depth, nchild: c.children.length, node: c });
    flat(c, path.concat(c.text.split('\n')[0]), out);
  }
  return out;
}
module.exports = { section, tree, flat };
if (require.main === module) {
  const en = tree(section('notes-en.txt', '## CLASSES')), ko = tree(section('notes-ko.txt', '## 직업'));
  const a = flat(en, [], []), b = flat(ko, [], []);
  console.log(a.length, b.length);
  a.forEach((x, i) => {
    const y = b[i] || {};
    const flag = (x.depth !== y.depth || x.nchild !== y.nchild) ? 'MISMATCH ' : '';
    console.log(flag + i + ' d' + x.depth + ' c' + x.nchild + ' | ' + x.text.split('\n')[0].slice(0, 70) + ' || ' + (y.text || '').split('\n')[0].slice(0, 40));
  });
}
