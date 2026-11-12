import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { GuideVideoSection } from './GuideDetailPage.js';

test('첫 진입과 영상 탭 전환 모두 큰 영상 크기로 불러온다', () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  const basicVideo = { youtubeId: 'Nn2Lv5eO4i8', title: '포식 기본편' };
  const advancedVideo = { youtubeId: 'tYYsCkZj7og', title: '포식 심화편' };
  const checkFrame = video => {
    const frame = container.querySelector('#guide-video iframe');
    expect(frame.getAttribute('width')).toBe('930');
    expect(frame.getAttribute('height')).toBe('523');
    expect(frame.getAttribute('loading')).toBe('lazy');
    expect(frame.getAttribute('src')).toBe(`https://www.youtube.com/embed/${video.youtubeId}?rel=0`);
    expect(frame.title).toBe(video.title);
    expect(container.querySelector('#guide-video a').href).toBe(`https://www.youtube.com/watch?v=${video.youtubeId}`);
    return frame;
  };
  try {
    act(() => root.render(
      <GuideVideoSection video={basicVideo} advancedVideo={advancedVideo} />
    ));
    const first = checkFrame(basicVideo);
    act(() => container.querySelector('[data-video-kind="advanced"]').click());
    expect(checkFrame(advancedVideo)).not.toBe(first);
    act(() => container.querySelector('[data-video-kind="basic"]').click());
    checkFrame(basicVideo);
  } finally {
    act(() => root.unmount());
    container.remove();
  }
});
