#!/usr/bin/env node
// 조용한 검증: npm run validate 가 도는 단계를 같은 순서·같은 명령으로 돌리되 단계마다 한 줄만 보여 준다.
// 실패한 단계만 그 출력의 끝 60줄을 보여 주고, 전체 출력은 logs/validate-last.log 에 남긴다.
//
// 사용: npm run validate:quiet                              전체
//       npm run validate:quiet -- guide-copy guide-manuscripts   그 단계만(이름 앞의 validate: 는 빼도 된다)
//       npm run validate:quiet -- --bail                    첫 실패에서 멈춤(npm run validate 와 똑같이)
// 단계 목록은 package.json 의 "validate" 에서 읽는다. 종료 코드는 처음 실패한 단계의 종료 코드(모두 통과면 0).
// 기본은 실패해도 나머지 단계를 마저 돌려 한 번에 모든 실패를 보여 준다.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SITE_ROOT = path.resolve(__dirname, '..');
const LOG_DIR = path.join(SITE_ROOT, 'logs');
const LOG_PATH = path.join(LOG_DIR, 'validate-last.log');
const TAIL_LINES = 60;
const LINE_LIMIT = 300;

function validateSteps() {
  const scripts = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, 'package.json'), 'utf8')).scripts || {};
  if (!scripts.validate) throw new Error('package.json 에 "validate" 스크립트가 없음');
  return scripts.validate.split('&&').map(part => part.trim()).filter(Boolean).map(command => {
    const npmRun = command.match(/^npm run ([^\s]+)$/);
    return { command, name: npmRun ? npmRun[1] : command };
  });
}

const stripAnsi = text => text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
const clip = text => (text.length > LINE_LIMIT ? `${text.slice(0, LINE_LIMIT)}… (줄임, 전체는 로그)` : text);
const isNoise = text => !text.trim() || /^npm (warn|notice)\b/.test(text) || /^> /.test(text);

// 실패한 단계의 출력에서 보여 줄 줄: 끝 60줄 + (그 앞에 있어서 안 보이는) 오류 이름 줄과 스크립트 위치 줄 몇 개.
function failureLines(output) {
  const lines = stripAnsi(output).split(/\r?\n/).filter(text => !isNoise(text));
  const tailStart = Math.max(0, lines.length - TAIL_LINES);
  const early = [];
  for (let index = 0; index < tailStart && early.length < 4; index++) {
    const text = lines[index];
    if (/\b[A-Z][A-Za-z]*Error\b.*:|\bfailed\b.*:/.test(text) || /^\s+at .*[\\/]scripts[\\/][^\\/]+:\d+:\d+\)?$/.test(text)) early.push(text);
  }
  const shown = [];
  if (early.length) shown.push(`(끝 ${TAIL_LINES}줄보다 앞에 있는 오류 줄)`, ...early, '(… 가운데 생략, 전체는 로그 …)');
  else if (tailStart > 0) shown.push(`(… 앞쪽 ${tailStart}줄 생략, 전체는 로그 …)`);
  shown.push(...lines.slice(tailStart));
  return shown.map(text => `    ${clip(text)}`);
}

function main() {
  const args = process.argv.slice(2);
  const bail = args.includes('--bail');
  const unknownOptions = args.filter(arg => arg.startsWith('--') && arg !== '--bail');
  const steps = validateSteps();
  const wanted = args.filter(arg => !arg.startsWith('--'));
  const pick = name => steps.find(step => step.name === name || step.name === `validate:${name}`);
  const missing = wanted.filter(name => !pick(name));
  if (unknownOptions.length || missing.length) {
    console.error(`모르는 ${unknownOptions.length ? `옵션: ${unknownOptions.join(' ')}` : `단계: ${missing.join(' ')}`}`);
    console.error(`단계: ${steps.map(step => step.name.replace(/^validate:/, '')).join(' ')} · 옵션: --bail`);
    process.exit(2);
  }
  const selected = wanted.length ? steps.filter(step => wanted.some(name => pick(name) === step)) : steps;

  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.writeFileSync(LOG_PATH, `# validate:quiet ${new Date().toISOString()} — ${selected.map(step => step.name).join(', ')}\n`);

  const started = Date.now();
  const failed = [];
  let exitCode = 0;
  let skipped = 0;
  for (const step of selected) {
    if (bail && failed.length) { skipped++; continue; }
    const stepStarted = Date.now();
    // 표준 출력과 오류 출력을 나온 순서대로 한 줄기로 받는다.
    const run = spawnSync(`${step.command} 2>&1`, { cwd: SITE_ROOT, shell: true, encoding: 'utf8', maxBuffer: 1024 * 1024 * 1024, env: process.env });
    const seconds = ((Date.now() - stepStarted) / 1000).toFixed(1);
    const output = `${run.stdout || ''}${run.stderr || ''}${run.error ? `\n${run.error.message}\n` : ''}`;
    const status = run.status === null || run.error ? 1 : run.status;
    fs.appendFileSync(LOG_PATH, `\n===== ${step.name} — ${status === 0 ? '통과' : `실패(종료 코드 ${status})`} ${seconds}초 — ${step.command}\n${output}`);
    if (status === 0) {
      console.log(`통과 ${seconds.padStart(5)}초 ${step.name}`);
      continue;
    }
    if (!failed.length) exitCode = status;
    failed.push(step.name);
    console.log(`실패 ${seconds.padStart(5)}초 ${step.name} (종료 코드 ${status})`);
    console.log(failureLines(output).join('\n'));
  }

  const total = ((Date.now() - started) / 1000).toFixed(1);
  const logShown = path.relative(SITE_ROOT, LOG_PATH).replace(/\\/g, '/');
  const scope = selected.length === steps.length ? '' : ` (고른 ${selected.length}단계만 — 끝낼 때는 전체를 한 번 돌린다)`;
  if (failed.length) console.log(`검증 실패: ${selected.length}단계 중 ${failed.length}단계 실패(${failed.join(', ')})${skipped ? `, ${skipped}단계 건너뜀` : ''} · ${total}초 · 전체 출력 ${logShown}`);
  else console.log(`검증 통과: ${selected.length}단계 · ${total}초${scope} · 전체 출력 ${logShown}`);
  process.exit(exitCode);
}

main();
