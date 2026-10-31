const {loadGuideManuscripts} = require('C:/wowmeta/site/scripts/lib/guideManuscripts.cjs');
const all = loadGuideManuscripts();
const strings = (v, path, out) => { if (typeof v === 'string') out.push([path, v]); else if (Array.isArray(v)) v.forEach((x, i) => strings(x, path + '[' + i + ']', out)); else if (v && typeof v === 'object') for (const k of Object.keys(v)) strings(v[k], path + '.' + k, out); return out; };
const Q = {'monk-windwalker': /단일·레이드 음영파|단일[^.]{0,15}음영파 견본/, 'rogue-subtlety': /죽음추적자 단일 견본|단일 견본을 유지/, 'druid-balance': /엘룬 견본은 기본|엘룬의 대행자로 시작|기존 엘룬의 대행자 견본 유지/, 'demonhunter-devourer': /단일·쐐기·레이드 모두 궤멸자|모든 콘텐츠에 궤멸자/};
const VIS = ['summary','evidence','caveats','book','tips','heroBranches','priority','opener','playstyle','sources','sourceNote','sourceStatus','logReview'];
for (const [id, re] of Object.entries(Q)) { const m = all[id]; for (const f of VIS) for (const [p, s] of strings(m[f], f, [])) if (re.test(s)) console.log(id, '|', p, '|', s.slice(0, 150)); }
