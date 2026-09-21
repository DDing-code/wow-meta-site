import { useId } from 'react';
import styled from 'styled-components';
import { guideSpecIcons } from '../data/guideSpecIcons.js';

const Icon = styled.svg`
  display: block;
  flex: 0 0 var(--spec-icon-size, 32px);
  width: var(--spec-icon-size, 32px);
  height: var(--spec-icon-size, 32px);
  overflow: hidden;
  opacity: 0.58;
  transition: opacity 160ms ease;
`;

export default function SpecializationIcon({ $specId, className }) {
  const maskId = `spec-icon-${useId().replace(/:/g, '')}`;
  const crop = guideSpecIcons[$specId];
  if (!crop) return null;
  return (
    <Icon className={className} aria-hidden="true" focusable="false" data-spec-icon={$specId} viewBox="0 0 176 176">
      <defs>
        {/* SVG luminance masks do not depend on mobile CSS mask-mode support. */}
        <mask id={maskId} x="0" y="0" width="176" height="176" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style={{ maskType: 'luminance' }}>
          <image href="/assets/spec-icons-white-v1.png" x={-crop[0]} y={-crop[1]} width="1586" height="992" />
        </mask>
      </defs>
      <rect width="176" height="176" fill="white" mask={`url(#${maskId})`} />
    </Icon>
  );
}
