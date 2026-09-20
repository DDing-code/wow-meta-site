import styled from 'styled-components';
import { guideSpecIcons } from '../data/guideSpecIcons.js';

const SpecializationIcon = styled.span.attrs(({ $specId }) => ({
  'aria-hidden': true,
  'data-spec-icon': $specId,
  style: { '--spec-icon-position': guideSpecIcons[$specId] },
}))`
  display: block;
  flex: 0 0 var(--spec-icon-size, 32px);
  width: var(--spec-icon-size, 32px);
  height: var(--spec-icon-size, 32px);
  background-color: #ffffff;
  mask-image: url('/assets/spec-icons-white-v1.png');
  mask-mode: luminance;
  mask-size: ${1586 / 176 * 100}% ${992 / 176 * 100}%;
  mask-position: var(--spec-icon-position);
  mask-repeat: no-repeat;
  opacity: 0.58;
  transition: opacity 160ms ease;
`;

export default SpecializationIcon;
