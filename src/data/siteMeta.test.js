import { getPageMeta, SITE_ORIGIN } from './siteMeta.js';
import { getAllGuideSpecs } from './guideRegistry.js';

test('every guide page gets its own indexable title and canonical URL', () => {
  const titles = new Set();
  for (const guide of getAllGuideSpecs()) {
    const meta = getPageMeta(guide.path);
    expect(meta.index).toBe(true);
    expect(meta.canonical).toBe(`${SITE_ORIGIN}${guide.path}`);
    expect(meta.title).toContain(`${guide.spec} ${guide.className}`);
    titles.add(meta.title);
  }
  expect(titles.size).toBe(getAllGuideSpecs().length);
});

test('raid episodes, query strings and log reports', () => {
  expect(getPageMeta('/raid/ulatek').title).toContain('울라텍');
  expect(getPageMeta('/guide/?role=tanks').canonical).toBe(`${SITE_ORIGIN}/guide`);
  expect(getPageMeta('/').canonical).toBe(`${SITE_ORIGIN}/`);
  expect(getPageMeta('/guide/priest/holy/log-analysis').title).toBeNull();
  expect(getPageMeta('/mockups').index).toBe(false);
});
