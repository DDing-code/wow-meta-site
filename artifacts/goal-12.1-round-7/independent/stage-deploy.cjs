const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const stage = path.join(__dirname, 'deploy-final');
assert(stage.startsWith(root + path.sep));
assert(!fs.existsSync(stage), 'Use a fresh deployment directory');
const project = JSON.parse(fs.readFileSync(path.join(root, '.vercel/project.json'), 'utf8'));
assert.equal(project.projectId, 'prj_TRqXQXZMlBPP3Bpl1SxceXtDqytV');
const output = path.join(stage, '.vercel/output');
const target = path.join(output, 'static');
fs.mkdirSync(target, {recursive:true});
let count = 0;
function copy(dir, dest) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    assert(!/^\.env/i.test(entry.name) && !/\.map$/i.test(entry.name), 'Private input or source map');
    assert(!/^(credentials|secrets|token)\./i.test(entry.name), 'Private file');
    const from = path.join(dir, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) { fs.mkdirSync(to); copy(from, to); }
    else {
      assert(entry.isFile(), 'Unexpected symlink or file type');
      if (/\.(js|json|html)$/i.test(entry.name)) {
        const text = fs.readFileSync(from, 'utf8');
        assert(!/sk-(?:proj-|live_)[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(text), 'Credential-shaped content');
      }
      fs.copyFileSync(from, to); count++;
    }
  }
}
copy(path.join(root, 'build'), target);
assert(fs.existsSync(path.join(target, 'assets/spec-icons-white-v1.png')));
fs.writeFileSync(path.join(output, 'config.json'), JSON.stringify({version:3,routes:[{handle:'filesystem'},{src:'/(.*)',dest:'/index.html'}]}, null, 2));
fs.writeFileSync(path.join(stage, '.vercel/project.json'), JSON.stringify(project, null, 2));
const manifest = JSON.parse(fs.readFileSync(path.join(target, 'asset-manifest.json'), 'utf8'));
console.log(JSON.stringify({files:count,bundle:manifest.files['main.js'],stage}));
