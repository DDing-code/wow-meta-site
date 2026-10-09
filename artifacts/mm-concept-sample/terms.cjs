// 사용자 고정 용어: 보스는 "네임드", 잡몹·추가로 나오는 적은 "쫄".
// 졸개(받침 없음) → 쫄(받침 있음)이라 조사를 함께 바꾼다.
const RULES = [
  [/졸개가/g, '쫄이'], [/졸개를/g, '쫄을'], [/졸개는/g, '쫄은'], [/졸개와/g, '쫄과'],
  [/졸개야/g, '쫄이야'], [/졸개/g, '쫄'],
  [/우두머리/g, '네임드'],
];
const fixText = text => RULES.reduce((value, [pattern, to]) => value.replace(pattern, to), text);
function fixDeep(value) {
  if (typeof value === 'string') return /^https?:\/\//.test(value) ? value : fixText(value);
  if (Array.isArray(value)) return value.map(fixDeep);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fixDeep(v)]));
  return value;
}
module.exports = { fixText, fixDeep, RULES };
