import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMeta, SITE_NAME } from '../data/siteMeta.js';

function setHeadTag(selector, create, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function setMeta(key, keyAttribute, content) {
  setHeadTag(`meta[${keyAttribute}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(keyAttribute, key);
    return meta;
  }, 'content', content);
}

// 주소가 바뀔 때마다 검색 엔진이 읽는 제목·설명·대표 주소를 맞춘다.
export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    if (meta.title) document.title = meta.title;
    setMeta('description', 'name', meta.description);
    setMeta('robots', 'name', meta.index ? 'index, follow' : 'noindex, follow');
    setMeta('og:site_name', 'property', SITE_NAME);
    setMeta('og:title', 'property', meta.title || document.title);
    setMeta('og:description', 'property', meta.description);
    setMeta('og:url', 'property', meta.canonical);
    setHeadTag('link[rel="canonical"]', () => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      return link;
    }, 'href', meta.canonical);
  }, [pathname]);

  return null;
}
