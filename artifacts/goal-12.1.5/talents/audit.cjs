// 40개 정본의 talentBuilds 120개를 12.1.5 trait_data 로 다시 판정한다. 결과: audit.json, audit-detail.json
const fs = require('node:fs');
const path = require('node:path');
const {makeDecoder} = require('./decode-talents.cjs');
const KB = 'C:/wowmeta/kb/08-직업별-Knowledge-Base';
const NEW = makeDecoder(path.join(__dirname, 'trait_data.inc'));
const OLD = makeDecoder(path.join(__dirname, '../../goal-12.1-resume-20261008/trait_data-oct7.inc'));
const diff = require('./trait-diff.json');
const changedNodes = new Map();
for (const c of diff) { if (!changedNodes.has(c.node)) changedNodes.set(c.node, []); changedNodes.get(c.node).push(c); }
const specs = {'warrior-protection':73,'warrior-arms':71,'warrior-fury':72,'paladin-holy':65,'paladin-protection':66,'paladin-retribution':70,'hunter-beastmastery':253,'hunter-marksmanship':254,'hunter-survival':255,'rogue-assassination':259,'rogue-outlaw':260,'rogue-subtlety':261,'deathknight-blood':250,'deathknight-frost':251,'deathknight-unholy':252,'priest-discipline':256,'priest-holy':257,'priest-shadow':258,'shaman-elemental':262,'shaman-enhancement':263,'shaman-restoration':264,'mage-arcane':62,'mage-fire':63,'mage-frost':64,'warlock-affliction':265,'warlock-demonology':266,'warlock-destruction':267,'monk-brewmaster':268,'monk-windwalker':269,'monk-mistweaver':270,'druid-balance':102,'druid-feral':103,'druid-guardian':104,'druid-restoration':105,'demonhunter-havoc':577,'demonhunter-vengeance':581,'demonhunter-devourer':1480,'evoker-devastation':1467,'evoker-preservation':1468,'evoker-augmentation':1473};
const bySpec = Object.fromEntries(Object.entries(specs).map(([k, v]) => [v, k]));

function guideFiles() {
  const out = [];
  for (const c of fs.readdirSync(KB)) {
    const cdir = path.join(KB, c);
    if (!fs.statSync(cdir).isDirectory()) continue;
    for (const s of fs.readdirSync(cdir)) {
      const f = path.join(cdir, s, 'Meta', 'guide-12.1.json');
      if (fs.existsSync(f)) out.push(f);
    }
  }
  return out;
}

const audit = [], detail = [];
for (const file of guideFiles()) {
  const g = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const b of g.talentBuilds || []) {
    const spec = b.validation?.specId;
    const guideId = bySpec[spec];
    const n = NEW.check(b.code, spec);
    let o; try { o = OLD.decode(b.code, spec); } catch (e) { o = null; }
    const touches = [];
    const sel = n.decoded ? n.decoded.selected : [];
    for (const t of sel) {
      const cs = changedNodes.get(t.node);
      if (!cs) continue;
      const oldT = o?.selected.find(x => x.node === t.node);
      for (const c of cs) {
        const isSelectedEntry = c.entry === t.entry || (oldT && c.entry === oldT.entry);
        if (!isSelectedEntry) continue;
        const what = Object.entries(c.diff || {}).map(([k, [a, z]]) => `${k} ${a}→${z}`).join(', ');
        touches.push({node: t.node, entry: c.entry, before: oldT ? `${oldT.name}(${oldT.spell})` : null, after: `${t.name}(${t.spell})`, change: what});
      }
    }
    // 같은 코드가 12.1.0 과 12.1.5 에서 다른 주문을 뜻하는지
    const meaning = [];
    if (o && n.decoded) {
      const key = t => `${t.node}:${t.spell}:${t.rank}`;
      const os = new Set(o.selected.map(key)), ns = new Set(n.decoded.selected.map(key));
      for (const t of o.selected) if (!ns.has(key(t))) meaning.push(`12.1.0: ${t.name}(${t.spell}) r${t.rank}`);
      for (const t of n.decoded.selected) if (!os.has(key(t))) meaning.push(`12.1.5: ${t.name}(${t.spell}) r${t.rank}`);
    }
    const problems = [...n.problems];
    if (meaning.length) problems.push('같은 코드의 뜻이 바뀜: ' + meaning.join(' / '));
    const row = {guideId, buildId: b.id, label: b.label, valid: n.ok, problems, touchesChangedNodes: touches.map(t => `${t.before && t.before !== t.after ? t.before + ' → ' : ''}${t.after} [node ${t.node}: ${t.change}]`)};
    audit.push(row);
    detail.push({...row, file: path.relative(KB, file), code: b.code, heroTreeId: n.decoded?.hero, oldHeroTreeId: b.validation?.heroTreeId, points: n.points, oldPoints: b.validation?.points, remainingBits: n.decoded?.remainingBits, touches});
  }
}
audit.sort((a, b) => a.guideId.localeCompare(b.guideId) || ['single-target', 'mythic-plus', 'raid'].indexOf(a.buildId) - ['single-target', 'mythic-plus', 'raid'].indexOf(b.buildId));
fs.writeFileSync(path.join(__dirname, 'audit.json'), JSON.stringify(audit, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'audit-detail.json'), JSON.stringify(detail, null, 2) + '\n');
console.log(JSON.stringify({builds: audit.length, guides: new Set(audit.map(a => a.guideId)).size, valid: audit.filter(a => a.valid).length, invalid: audit.filter(a => !a.valid).map(a => [a.guideId, a.buildId, a.problems]), touches: audit.filter(a => a.touchesChangedNodes.length).map(a => [a.guideId, a.buildId, a.touchesChangedNodes])}, null, 1));
