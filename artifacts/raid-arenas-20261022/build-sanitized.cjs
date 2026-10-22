// 프로젝트 .env를 읽지 않고 공개 소스만 컴파일한다.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
for (const name of Object.keys(process.env)) if (/^REACT_APP_/i.test(name)) process.env[name] = '';
process.env.NODE_ENV = process.env.BABEL_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'false';
const paths = require('react-scripts/config/paths');
paths.dotenv = path.join(__dirname, 'disabled-env-input');
for (const suffix of ['', '.production', '.production.local', '.local']) assert(!fs.existsSync(paths.dotenv + suffix));
require('react-scripts/scripts/build');
