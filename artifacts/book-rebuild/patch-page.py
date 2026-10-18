import io
p = r'C:\wowmeta\site\src\pages\GuideDetailPage.js'
s = io.open(p, encoding='utf8').read()


def rep(old, new):
    global s
    assert s.count(old) == 1, old[:100]
    s = s.replace(old, new, 1)


rep("""  quiz: '확인 문제',
  voices: '현장의 목소리',
};""", """  quiz: '확인 문제',
  voices: '현장의 목소리',
  skillGroups: '내 스킬',
  aside: '참고',
};""")

rep("""function hasBookChapterExtras(block) {""", """// 0부 "내 스킬 한눈에 보기": 스킬을 역할별 묶음으로 보여 준다. 아이콘·이름 모두 툴팁이 뜬다.
function BookSkillGroups({ groups, guide, inlineTerms, label }) {
  const rows = (groups || [])
    .map(group => ({ ...group, skills: (group.skillIds || []).map(skillFromBranchId).filter(Boolean) }))
    .filter(group => group.skills.length);
  if (!rows.length) return null;
  return (
    <BookSkillGroupFigure $color={guide.color} data-book-box="skill-groups" aria-label={label}>
      <BookDiagramHead>
        <BookBoxLabel>{label}</BookBoxLabel>
        <span>아이콘이나 이름에 마우스를 올리면 설명이 뜹니다</span>
      </BookDiagramHead>
      <BookSkillGroupGrid>
        {rows.map(group => (
          <BookSkillGroupItem key={group.label} $color={guide.color} data-skill-group>
            <strong>{displayGuideText(group.label)}</strong>
            <ul>
              {group.skills.map(skill => (
                <li key={`${group.label}-${skill.id}`}>
                  <InlineSkillTerm skill={skill}>{skillName(skill)}</InlineSkillTerm>
                </li>
              ))}
            </ul>
            {!!group.note && <p>{renderGuideText(group.note, inlineTerms)}</p>}
          </BookSkillGroupItem>
        ))}
      </BookSkillGroupGrid>
    </BookSkillGroupFigure>
  );
}

function hasBookChapterExtras(block) {""")

rep("""              {!!bookLayout && (!!getBlockDiagrams(block).length || !!getBlockTimelines(block).length) && (
                <BookDiagramStack>""", """              {!!bookLayout && !!block.skillGroups?.length && (
                <BookDiagramStack>
                  <BookSkillGroups groups={block.skillGroups} guide={guide} inlineTerms={inlineTerms} label={bookLayout.labels.skillGroups} />
                </BookDiagramStack>
              )}

              {!!bookLayout && (!!getBlockDiagrams(block).length || !!getBlockTimelines(block).length) && (
                <BookDiagramStack>""")

rep("""              {!!bookLayout && hasBookChapterExtras(block) && (""", """              {!!bookLayout && !!block.aside?.text && (
                <BookAside $color={guide.color} data-book-box="aside">
                  <BookBoxLabel>{block.aside.title || bookLayout.labels.aside}</BookBoxLabel>
                  <p>{renderGuideText(block.aside.text, inlineTerms)}</p>
                </BookAside>
              )}

              {!!bookLayout && hasBookChapterExtras(block) && (""")

rep("""          <span>조사 {manuscript.researchedAt}</span>
        </ManuscriptMeta>
      </PaperLead>
""", """          <span>조사 {manuscript.researchedAt}</span>
        </ManuscriptMeta>
      </PaperLead>

      {!!bookLayout?.book.start && (
        <BookStartFork $color={guide.color} aria-label="읽는 길 고르기" data-book-start>
          {[
            ['beginner', `#guide-part-${bookLayout.parts[0]?.id}`],
            ['expert', heroBranches.length ? '#guide-hero-branches' : '#guide-section-1'],
          ].map(([key, href]) => !!bookLayout.book.start[key] && (
            <a key={key} href={href} data-book-start-link={key}>
              <strong>{displayGuideText(bookLayout.book.start[key].label)}</strong>
              {!!bookLayout.book.start[key].text && <span>{renderGuideText(bookLayout.book.start[key].text, inlineTerms)}</span>}
              <ArrowDown size={14} aria-hidden="true" />
            </a>
          ))}
        </BookStartFork>
      )}
""")

rep("""        <HeroBranchSection $color={guide.color} data-guide-block="hero-branches">""", """        <HeroBranchSection id="guide-hero-branches" $color={guide.color} data-guide-block="hero-branches">""")
rep("""                <strong>영웅특성별 개별 운용 가이드</strong>
                <span>실제 빌드에 맞는 영웅 특성을 선택해 시작 흐름, 우선순위와 로그 확인 기준을 따로 읽습니다.</span>""", """                <strong>{bookLayout ? '영웅 특성별 딜사이클 빠른 참고' : '영웅특성별 개별 운용 가이드'}</strong>
                <span>{bookLayout
                  ? '해 본 사람을 위한 요약입니다. 처음이라면 아래 개념서의 0부부터 읽고 돌아와도 됩니다.'
                  : '실제 빌드에 맞는 영웅 특성을 선택해 시작 흐름, 우선순위와 로그 확인 기준을 따로 읽습니다.'}</span>""")

rep("""            ))}
          </BookContentsParts>
        </BookContents>""", """            ))}
          </BookContentsParts>
          <BookContentsAppendix aria-label="부록">
            <span>부록</span>
            {[
              ...(manuscript.talentBuilds?.length ? [['#guide-talents', '특성 견본']] : []),
              ...(manuscript.book?.voices?.length ? [['#guide-voices', bookLayout.labels.voices]] : []),
              ['#skills', '핵심 스킬'],
              ['#sources', '출처'],
            ].map(([href, text]) => <a key={href} href={href}>{text}</a>)}
          </BookContentsAppendix>
        </BookContents>""")

STYLES = """const BookStartFork = styled.div`
  order: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;

  a {
    position: relative;
    display: grid;
    gap: 4px;
    padding: 12px 40px 12px 14px;
    border: 1px solid rgba(168, 178, 188, 0.18);
    border-left: 3px solid ${props => props.$color};
    border-radius: 4px;
    background: rgba(11, 16, 20, 0.55);
    color: #eef1f3;
    text-decoration: none;
  }

  a[data-book-start-link='expert'] {
    border-left-color: rgba(168, 178, 188, 0.45);
  }

  a:hover,
  a:focus-visible {
    border-color: ${props => props.$color}88;
  }

  strong {
    font-size: 0.95rem;
  }

  span {
    color: #aeb8be;
    font-size: 0.85rem;
    line-height: 1.55;
    word-break: keep-all;
  }

  svg {
    position: absolute;
    top: 50%;
    right: 14px;
    color: #8d989f;
    transform: translateY(-50%);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BookAside = styled(BookBox)`
  grid-column: 1 / -1;
  min-width: 0;
  margin-top: 0;
  border-left-color: #b8915b;

  p {
    max-width: 74ch;
  }
`;

const BookSkillGroupFigure = styled.figure`
  min-width: 0;
  margin: 0;
  padding: 14px 16px 16px;
  border: 1px solid rgba(168, 178, 188, 0.14);
  background: rgba(11, 16, 20, 0.45);
`;

const BookSkillGroupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px 14px;
  margin-top: 12px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const BookSkillGroupItem = styled.section`
  min-width: 0;
  padding: 10px 12px;
  border-left: 3px solid ${props => props.$color};
  background: rgba(11, 16, 20, 0.6);

  strong {
    color: #eef1f3;
    font-size: 0.9rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
  }

  li {
    min-width: 0;
    font-size: 0.88rem;
  }

  p {
    margin-top: 8px;
    color: #aeb8be;
    font-size: 0.84rem;
    line-height: 1.6;
    word-break: keep-all;
  }
`;

const BookContentsAppendix = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(168, 178, 188, 0.12);

  span {
    color: #b8915b;
    font-size: 0.72rem;
    font-weight: 900;
  }

  a {
    color: #b7c0c6;
    font-size: 0.82rem;
    text-decoration: none;
  }

  a:hover {
    color: #eef1f3;
  }
`;

"""
rep("""const BookContents = styled.nav`""", STYLES + """const BookContents = styled.nav`""")
io.open(p, 'w', encoding='utf8', newline='').write(s)
print('ok')
