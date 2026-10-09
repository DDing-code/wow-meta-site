# 12.1 update status

## 2026-10-10 7라운드 — 한국 점검 후 로그·영웅 추천·툴팁 재대조

- 취소된 6라운드의 미커밋 원고를 이어 검수했습니다. 담당은 가이드 원고·가이드 화면·KB 정본·생성 DB·검증기·진행 기록이며, 다른 담당의 파일과 이전 검수 산출물은 유지합니다.
- 한국어 공식 긴급 수정은 10월 7일판으로 갱신되었습니다. 미국 공식 안내는 지역별 주간 점검 적용을 명시하며, 한국 고객지원의 한밤 본 서버 점검 일정은 10월 8일 05:00~06:00입니다. 06:00은 공식 예정 종료 시각입니다. 게시 시각·예정 종료를 개별 서버에서 실측한 적용 순간으로 바꾸지 않으며 `KoreaAppliedAt`는 null을 유지합니다.
- 한국 시간 10월 8일 21시 이후의 한국 공개 랭킹에서 40개 전문화 모두 신화 레이드와 쐐기의 실제 전투를 확인했습니다. 최초 조회는 우두머리·던전 각 1종의 첫 100위이며, 빈 콘텐츠 5개는 다른 우두머리·던전을 조회했습니다. 총 96건(레이드 44·쐐기 52)의 지역·난이도·플레이어·전문화·영웅 선택 노드·실제 시작/종료·시전·버프를 확인했습니다. 트리 선택 노드가 없는 원자료 4행은 선택 사례에서 제외했습니다. 전수 사용률 또는 같은 조건의 영웅 성능 비교로 해석하지 않습니다.
- 40개 공개 저자 가이드의 영웅 특성 80개를 다시 읽고, 추천과 대안·콘텐츠 조건을 각 원고에 기록했습니다. 서로 다른 추천이나 본문/견본의 충돌은 별도로 표시했습니다. 추가 저자 9개도 대조했으나 대부분 조정 전 자료이므로 새 확정 순위의 근거로 승격하지 않습니다. 한국 최근 사례가 없는 영웅 분기는 24개입니다. 사례 부재를 사용률 0 또는 열세로 바꾸지 않습니다.
- 남은 수치 충돌 3건은 본 서버 한국어 툴팁을 브라우저에서 직접 확인해 해결했습니다. 역병내림 시전 1271967·선택 특성 1271974의 남은 피해 계수는 100%, 빠른 한 모금 388505는 3초마다 8% 정화, 허초 393516은 8초 동안 회피 10%입니다. 한국어 공식 10월 7일 조정과 일치합니다. KB 설명 원문·현재 빌드·시너지·검수 이력을 수정한 뒤 생성 DB를 동기화했습니다. 이전 200%/5%/5초 확인 기록은 당시 자료라는 문맥으로 보존합니다.
- 가이드 원고와 KB 정본 40개가 일치하며, 특성 견본 120개·영웅별 상황 240개·기존 미국 조건 비교 160건의 검수 근거를 유지합니다. 한국 사례와 공개 저자의 추천은 성능 비교와 구별해 표시합니다. 기존 완료 4개·부분 검수 36개 상태를 유지하며, 모든 가이드 최신 메타 확정·미검증 0이라는 최종 목표는 아직 충족하지 못했습니다.
- 전체 검증과 최종 빌드가 통과했습니다. 온라인 KB 툴팁 2,988개·가이드 아이콘 711개는 오류·경고 0이며, 공식 설명 164개도 원문과 일치합니다. 의도적인 과거 주문 경고 6개와 기존 린트·번들 크기 경고는 남습니다. 최종 번들·화면 검사·커밋·배포 결과는 아래 완료 기록과 `artifacts/goal-12.1-round-7/`에 추가합니다.
- 최종 빌드 `main.5fa3fb51.js`(SHA256 `6cdd44a85d1bb576ff96c9bd242dfcbd2c14f8bfea698776deb0a877a9f3540d`)에서 40개 가이드 × 320·390·1440px의 120화면, 영웅별 상황 선택 720건, 특성 펼침 360건이 통과했습니다. 본 담당이 딜사이클·특성·비교 근거 화면 모음 45장도 직접 열어 확인했습니다. 이 검사는 별도 독립 검수로 계산하지 않습니다. 관련 KB 원본 48개는 로컬 커밋 `82bf1ce`로 보존했습니다.
- 사이트 내용과 생성 DB는 같은 커밋 `df833379`로 푸시했고, 정적 빌드 파일 6개만 운영에 배포했습니다. Vercel `dpl_JBfqBj3m2SHkYvXTwqCCadVCCPiK`가 Ready이며 `https://wowmeta.vercel.app`에서 공개 파일 6개의 해시와 40개 가이드 경로의 최종 번들이 일치합니다. 공개 보호 기사·양조·부정·풍운·사격·수양·운무 7개 가이드 × 세 화면 크기의 21화면, 영웅별 상황 선택 126건, 특성 펼침 63건도 통과했습니다. 이 공개 화면 검사는 40개 전수 검사로 해석하지 않습니다. 공개 화면 9장을 본 담당이 직접 열어 다시 확인했습니다. `.env`·소스맵은 배포물에 없습니다.
- 별도 허브 t1v의 독립 검수와 소유 파일 `guideUpdates.js`의 Git 날짜·출처 갱신은 인계합니다. 원고 40개·영웅 80개별 결론을 기록했어도, 공식 실측 한국 적용 순간·추천 충돌·한국 미관측 분기 24개의 성능 우열이 확인되지 않았으므로 완료 4개·부분 검수 36개를 유지합니다.
- 근거: `korean-official-review.json`, `korean-maintenance-review.json`, `korean-tooltip-review.json`, `hero-review.json`, `author-source-review.json`, `additional-author-check.json`, `completion-evidence.json`, `korea-combats.json`, `missing-mode-review.json`, `exact-tooltip-check.json`, `local-verification.json`, `primary-visual-review.json`, `validate.log`, `kb-online.log`, `icons-online.log`, `build.log`.

## 2026-10-08 5라운드 독립 육안 검수

- t1v는 전달 원본 64개의 해시 일치를 확인하고, 40개 가이드 × 320·390·1440px × 딜사이클·특성·비교 설명의 화면 모음 45장(360개 화면 영역)을 직접 열어 보았습니다. 추가로 변경 영향이 큰 7개 가이드에서 21화면·영웅별 상황 선택 126건·특성 펼침 63건을 ODDIN 브라우저로 독립 실행했습니다.
- 신성 사제의 핵심 스킬에 제거된 치유의 마법진(204883)이 남은 것을 발견했습니다. 11.1 공식 제거 공지와 12.1 SimC 트리 부재를 대조해 KB를 과거 기록으로 정정하고, 공식 한국어 설명을 보존했습니다. 생성 DB를 동기화했으며 현행 자동 수집과 수동 순서에 재등장하지 않도록 회귀 검사를 보완했습니다. 320·390·1440px 수정 화면에서 추천 제외·아이콘·줄바꿈을 확인했습니다.
- KB 동기화·전체 검증·수정 빌드 main.cbb0028f.js가 통과했습니다. 의도적인 과거 주문 경고는 기존 5개에 치유의 마법진을 더한 6개입니다. 한국 적용 시각·전체 최신 메타 결론·수치 충돌 3건은 이번 육안 검수로 해결된 것으로 보지 않습니다.
- Git 갱신 근거 반영 후 전체 검증·최종 빌드 main.a221aab6.js를 통과했습니다. 이 최종 번들에서 40개 가이드 × 320·390·1440px의 120화면, 영웅별 상황 선택 720건, 특성 펼침 360건, 새 전투 링크 480건이 모두 통과했습니다. 과거 주문 6개 추천 제외·가로 넘침·보이는 아이콘·버튼 선택 유지도 검사했습니다. 공식 설명 162개 원문 일치를 재확인했으며, 선행 온라인 툴팁 2,988개·아이콘 711개 검사 이후 공식 설명은 바꾸지 않았습니다. 기존 린트 및 번들 크기 경고는 남습니다.
- 사이트 내용 a151222d, Git 표시 479cfd37, 최종 검증 015b04f1을 푸시했습니다. 관련 KB 원본 58개는 로컬 저장소 b3f42ec에 보존했습니다. Vercel 운영 배포 dpl_9uU2cXnXq3Xn4ceX6MkcYSG4rGhf는 Ready이며 wowmeta.vercel.app에서 main.a221aab6.js와 공개 파일 6개가 로컬 검증 파일과 바이트 단위로 일치했습니다. 배포물에 환경 파일·소스맵은 없습니다. 공개 7개 가이드 × 세 화면 크기의 21화면·영웅별 상황 선택 126건·특성 펼침 63건도 통과했습니다. 공개 신성·운무·황폐 화면을 직접 열어 다시 확인했습니다. 이 배포 완료는 한국 서버 최신 메타 확정을 뜻하지 않으며 기존 완료 4개·부분 검수 36개 상태를 유지합니다.
- 근거: `artifacts/goal-12.1-round-5/independent/`. 최종 Git 갱신 후 빌드·전수 화면·배포 결과는 해당 폴더의 `review.json`, `final-local.json`, `public-deploy.json`에 별도로 기록합니다.

## 2026-10-08 5라운드 — 조건 비교 반영·보류 분류 정정

- 4라운드의 미국 개별 전투 원자료를 이어 검수했습니다. 레이드·쐐기 각 40쌍을 같은 전투·난이도, 장비 평균 차이 1 이내, 실제 전투 길이 차이 5% 이내, 증강 인원 일치로 대조했습니다. 쐐기는 단수·어픽스도 일치합니다. 전투 길이 차이는 절대 차이를 두 전투 중 긴 실제 시간으로 나눈 값입니다. 쐐기 순위의 완료 시간 대신 개별 전투의 시작·종료를 사용하며, 기준을 벗어난 복수·증강·운무 3쌍을 교체했습니다.
- 160개 전투의 시전·버프 근거를 40개 가이드와 관련 KB 정본에 반영했습니다. 120개 특성 코드와 240개 영웅별 전투 흐름은 변경하지 않았습니다. 미국 사례는 운용 참고이며, 장비 세부 구성·외부 강화·치유/파티 구성까지 통제한 영웅별 성능 우열이나 한국 적용을 확정하는 비교가 아닙니다.
- 보류 스킬 8개는 분류를 정정했습니다. 위안의 숨결 343737은 위론 322118의 치유 효과, 기 고치 406139는 천신의 조화 343655의 보호막, 약화의 역병 1271748은 선택 주문 1265799의 활성 주문입니다. 나머지 5개는 현재 선택·대체·활성 주문 열에서 확인되지 않는 과거 설명으로 보존하고 현재 추천에서 제외했습니다. 기도의 마법진·신성한 회복·이루어진 기원·비취불꽃 진각은 공식 제거 목록도 확인했습니다. 공명의 권능의 정확한 제거 시점은 단정하지 않습니다. 과거 기록 5개의 이전 패치 경고는 의도적으로 남깁니다. 가이드 페이지의 자동 수집 대상은 현재 패치로 제한해 과거 주문이 핵심 스킬·시너지 그래프에 다시 나타나지 않게 했습니다.
- 보류 시너지 8개의 참가 번호·연결·운용을 정정하고 12.1로 동기화했습니다. 천신합일은 천신의 대행자 빌드에만 배정하며, 위안의 숨결·기 고치를 직접 누르는 선택 버튼으로 보지 않습니다. 신성의 과거 치유의 마법진·기도의 마법진·공명의 권능·이루어진 기원 추천을 제거했습니다. 기존 파일 경로와 시너지 ID는 연결을 보존하기 위해 유지했습니다.
- 포용의 안개의 30% 비교 페이지는 판다리아 클래식이었음을 정정했습니다. 본 서버 한국어 설명의 10%와 특성별 지속시간은 원문 그대로입니다. 역병내림 200%/미국 공식 100%, 빠른 한 모금 5%/8%, 가식 5초/8초의 나머지 3건은 한국어 원문을 임의 수정하지 않고 출처·지역 차이로 보류합니다.
- 공식 한국어 긴급 수정 페이지를 2026-10-08 16:39 KST에 확인했으나 최신 제목은 10월 2일판입니다. 10월 6일 미국 조정의 한국 서버 적용 시각을 확인하지 못해 KoreaAppliedAt는 null입니다. 미국 주간 점검 안내나 게시 날짜를 한국 실제 적용 시각으로 바꾸지 않습니다. 기존 완료 4개·부분 검수 36개를 유지합니다.
- KB 동기화·전체 검증, 공식 설명 162개 일치, 온라인 KB 툴팁 2,988개 및 가이드 아이콘 711개가 오류·경고 0으로 통과했습니다. 생성 데이터의 경고 5건은 위 과거 주문입니다. 새 빌드 main.2b1c8779.js가 성공했으며 기존 린트·번들 크기 경고는 남습니다. 새 번들에서 320·390·1440px 40개 가이드의 120화면·720개 영웅별 상황 선택·360개 특성 펼침이 통과했습니다. 로그 근거 링크 480개 표시도 정본과 일치합니다. 본 담당은 딜사이클·특성·비교 설명 화면 모음 45장을 직접 확인했으며, 이를 독립 육안 검수로 계산하지 않습니다. 독립 육안 검수는 허브 t1v 후속 작업에서 수행되므로 추가 커밋·푸시·배포는 그 결과 뒤에 진행합니다.
- 근거: artifacts/goal-12.1-round-5/completion-evidence.json, kb-review.json, official-removals.json, korean-official-review.json, remaining-review.json, validate.log, kb-online.log, icons-online.log, build.log, local-release.json. 개별 전투 원자료는 artifacts/goal-12.1-round-4/raid-combats.json과 mythic-combats.json에 있습니다.

| 가이드 | 특성 견본 | 레이드/쐐기 전투 | 장비 평균 차이 레이드/쐐기 | 실제 길이 차이 레이드/쐐기 | 증강 인원 레이드/쐐기 | 결론 |
|---|---:|---:|---|---|---|---|
| 전사 방어 | 3 | 2/2 | 0.56/0.88 | 1.77%/3.16% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 성기사 보호 | 3 | 2/2 | 1.00/1.00 | 3.84%/3.37% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 죽음의 기사 혈기 | 3 | 2/2 | 0.44/0.81 | 1.60%/3.55% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 수도사 양조 | 3 | 2/2 | 1.00/0.38 | 1.14%/1.49% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 드루이드 수호 | 3 | 2/2 | 0.44/0.38 | 4.16%/0.22% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 악마사냥꾼 복수 | 3 | 2/2 | 1.00/0.00 | 4.63%/1.11% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 전사 무기 | 3 | 2/2 | 0.81/0.25 | 2.82%/3.60% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 전사 분노 | 3 | 2/2 | 0.63/0.00 | 2.04%/2.11% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 성기사 징벌 | 3 | 2/2 | 0.81/0.75 | 3.11%/3.92% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 도적 암살 | 3 | 2/2 | 0.44/0.44 | 2.70%/3.54% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 도적 무법 | 3 | 2/2 | 0.63/0.19 | 2.86%/2.51% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 도적 잠행 | 3 | 2/2 | 0.63/0.00 | 1.66%/2.46% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 죽음의 기사 냉기 | 3 | 2/2 | 0.56/1.00 | 3.91%/1.18% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 죽음의 기사 부정 | 3 | 2/2 | 0.75/0.00 | 2.45%/4.97% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 수도사 풍운 | 3 | 2/2 | 0.63/0.81 | 4.09%/0.85% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 드루이드 야성 | 3 | 2/2 | 0.00/0.44 | 2.15%/0.47% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 악마사냥꾼 파멸 | 3 | 2/2 | 0.63/0.63 | 1.11%/3.47% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 주술사 고양 | 3 | 2/2 | 0.63/0.00 | 4.26%/3.36% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사냥꾼 생존 | 3 | 2/2 | 0.81/0.63 | 3.20%/1.25% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사냥꾼 야수 | 3 | 2/2 | 0.25/0.63 | 2.63%/4.61% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사냥꾼 사격 | 3 | 2/2 | 0.81/0.00 | 3.13%/4.83% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사제 암흑 | 3 | 2/2 | 0.63/0.38 | 1.93%/0.54% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 악마사냥꾼 포식 | 3 | 2/2 | 0.63/1.00 | 1.26%/3.18% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 주술사 정기 | 3 | 2/2 | 0.63/0.25 | 2.33%/3.17% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 마법사 비전 | 3 | 2/2 | 0.63/0.81 | 2.43%/0.51% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 마법사 화염 | 3 | 2/2 | 0.19/0.00 | 1.44%/1.38% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 마법사 냉기 | 3 | 2/2 | 0.81/0.19 | 0.75%/1.11% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 흑마법사 고통 | 3 | 2/2 | 1.00/0.63 | 0.14%/1.03% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 흑마법사 악마 | 3 | 2/2 | 1.00/0.81 | 2.74%/0.58% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 흑마법사 파괴 | 3 | 2/2 | 0.00/0.19 | 4.49%/4.76% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 드루이드 조화 | 3 | 2/2 | 0.19/0.19 | 3.25%/0.60% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 기원사 황폐 | 3 | 2/2 | 0.44/0.63 | 1.26%/2.77% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 기원사 증강 | 3 | 2/2 | 1.00/0.56 | 2.96%/1.65% | 1/1 | 미국 사례 반영·한국 최신 메타 미확정 |
| 성기사 신성 | 3 | 2/2 | 0.19/0.38 | 1.29%/3.67% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사제 수양 | 3 | 2/2 | 0.81/0.25 | 2.49%/0.47% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 사제 신성 | 3 | 2/2 | 1.00/0.38 | 2.93%/3.94% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 주술사 복원 | 3 | 2/2 | 0.81/0.81 | 2.20%/1.32% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 수도사 운무 | 3 | 2/2 | 0.81/0.75 | 1.76%/4.88% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 드루이드 회복 | 3 | 2/2 | 1.00/0.88 | 3.10%/3.46% | 1/0 | 미국 사례 반영·한국 최신 메타 미확정 |
| 기원사 보존 | 3 | 2/2 | 0.44/0.44 | 3.24%/0.42% | 0/0 | 미국 사례 반영·한국 최신 메타 미확정 |

## 2026-10-08 3라운드 — 개별 로그·원자 효과 대조

- 황폐 1440px 선택 실패는 숨겨진 링크에 남은 ODDIN 번호와 현재 버튼 번호가 중복된 검사 문제였습니다. 검사 번호를 초기화하고 고유 번호를 확인해 남은 9건을 통과했습니다. 기존 111건과 합해 320·390·1440px 120화면, 720개 영웅별 상황 선택이 통과했습니다.
- 한국어 본 서버 툴팁 160개를 직접 대조했습니다. 현재 트리·기본 주문 또는 상위 특성 효과를 확인한 152개를 갱신했습니다. 시너지 42개 중 34개를 대조·갱신했고, 스킬 8개·시너지 8개는 같은 번호의 현재 선택 노드가 확인되지 않아 이전 패치와 보류 근거를 보존했습니다.
- 에테르 조율은 과거 453600 대신 현재 1243307로 수정했습니다. 역병내림의 시전 1271967과 특성 1271974 설명에는 한국어 원문을 보존하고 미국 공식 100%와의 차이를 기록했습니다. 필멸의 고리·포용의 안개의 주문 페이지와 툴팁 API 표시 차이도 기록했습니다.
- 40개 전문화의 조정 이후 미국 신화 개별 전투 920건을 탐색하고, 전문화·전투 시각·시전·버프까지 확인한 80건을 가이드와 KB 정본에 통합했습니다. 같은 보스·난이도·장비 구간 및 전투 길이 차이 5% 이내인 비교는 39개입니다. 증강 구성까지 같은 것은 24개이며 외부 강화·세트·치유 구성까지 일치한 영웅 특성 우열 비교로 보지 않습니다.
- 미국 공식 공지는 해당 지역 10월 6일 주간 점검 적용을 명시합니다. 한국어 공식 새소식은 10월 2일판이고 한국 적용 시각을 확인하지 못했습니다. 한국의 조정 대상 6개 전문화에서 해당 우두머리의 한국 시간 10월 8일 11시 이후 공개 상위 로그를 탐색했지만 검색한 524건 중 해당 기록은 없었습니다. 이 검색 문턱은 실제 적용 시각이 아닙니다.
- 특성 120개(고유 코드 90개)의 한국어 계산기 34/34/13포인트와 부모 연결 검수 근거를 유지합니다. 기존 완료 4개·부분 검수 36개 표시도 유지합니다. 최신 한국 로그·쐐기 비교·독립 육안 검수는 전체 완료의 남은 조건입니다.
- 공식 설명 교체 중 남은 이전 문장을 정리하고, 동기화 생성기가 명시적 설명을 300자에서 자르던 제한을 제거했습니다. 검수한 원자 노트 160개와 역병내림 2개, 총 162개 설명이 브라우저 원문과 생성 DB에서 일치합니다. 회귀 검사에는 긴 설명의 마지막 효과까지 보존하는 조건을 추가했습니다. 생성기 원본은 site 저장소 밖의 F:/01_프로젝트/90_개발/wowmeta/scripts/kb-sync/frontmatter-parser.js에 보존합니다.
- 동기화·전체 검증, 한국어 공식 KB 툴팁 2,988개 및 가이드 아이콘 711개 온라인 대조가 통과했습니다. 온라인 오류·경고는 0이며, 생성 데이터의 혼합 패치 경고 16건은 위 보류 항목입니다. 공개 소스만으로 빌드했으며 기존 린트 경고와 번들 크기 경고는 남아 있습니다.
- 새 내용 번들 main.c39bb0cc.js에서 320·390·1440px의 40개 가이드, 총 120화면·720개 영웅별 상황 선택·360개 특성 펼침을 다시 통과했습니다. 모든 화면의 코드가 검수한 정본과 일치합니다. 본 담당이 딜사이클·특성 화면 30개 모음과 황폐 1440px 원본을 직접 확인했습니다. 독립 육안 검수는 허브 t1v 결과를 기다리며 별도 완료로 계산하지 않습니다.
- 근거: artifacts/goal-12.1-round-3/completion-evidence.json, individual-combats.json, korean-tooltip-review.json, kb-atomic-review.json, kb-synergy-review.json, exact-tooltip-check.json, local-release.json, local-verification.json, remaining-review.json. 업데이트 날짜·커밋 출처 반영 후의 운영 빌드와 공개 확인 근거는 같은 폴더의 public-deploy.json, public-final.json에 기록합니다. 모든 가이드의 한국 적용 후 최신 메타 확정은 아직 완료되지 않았습니다.

| 가이드 | 특성 견본 | 영웅별 상황 | 미국 개별 전투 | 장비·전투 길이 비교 | 증강 인원 두 전투 | 이번 판정 |
|---|---:|---:|---:|---|---|---|
| 전사 방어 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 성기사 보호 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 죽음의 기사 혈기 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/2 | 부분 검수 |
| 수도사 양조 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/1 | 부분 검수 |
| 드루이드 수호 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 악마사냥꾼 복수 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 전사 무기 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 전사 분노 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 성기사 징벌 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 도적 암살 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 도적 무법 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/1 | 부분 검수 |
| 도적 잠행 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 죽음의 기사 냉기 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 죽음의 기사 부정 | 3 | 6 | 2 | 장비 구간·전투 길이 불일치 | 0/0 | 부분 검수 |
| 수도사 풍운 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 2/0 | 부분 검수 |
| 드루이드 야성 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/1 | 부분 검수 |
| 악마사냥꾼 파멸 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 주술사 고양 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 사냥꾼 생존 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 사냥꾼 야수 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 사냥꾼 사격 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 사제 암흑 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 악마사냥꾼 포식 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 주술사 정기 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 마법사 비전 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 마법사 화염 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 마법사 냉기 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 흑마법사 고통 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 흑마법사 악마 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 흑마법사 파괴 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 드루이드 조화 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 기원사 황폐 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 기원사 증강 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/1 | 부분 검수 |
| 성기사 신성 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 사제 수양 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 2/1 | 부분 검수 |
| 사제 신성 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 주술사 복원 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/1 | 부분 검수 |
| 수도사 운무 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |
| 드루이드 회복 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 1/0 | 부분 검수 |
| 기원사 보존 | 3 | 6 | 2 | 같은 장비 구간·길이 차이 5% 이내 | 0/0 | 부분 검수 |


## 2026-10-08 2라운드: 특성 견본·로그 집계 전수 대조

- **부분 완료를 유지한다.** 아래의 특성 견본·공개 집계·영웅별 상황 구조 검수는 완료했다. 모든 원자 노트의 효과나 조정 후 동일 조건 WCL 이벤트 비교가 끝났다는 뜻은 아니다. 이 절이 이전 기록의 현황을 대체하며, 아래 과거의 ‘미확보·미완료’ 문장은 당시 기록이다.
- 수호 드루이드·정기·비전·복원 주술사의 두 영웅별 오프닝·단일·광역, 총 24개 상황을 작성했다. 수호는 무료 발동과 생존 자원을 구별하고, 비전은 영웅별 명석함·구슬·세트 조건을 분리했다. 정기는 선조의 신속함과 폭풍 발동을 구별한다. 복원은 선견자의 치유의 비와 토템술사의 쇄도하는 토템, 폭우의 선택·16초 사용 조건, 양자택일 치유 쿨다운을 분리했다.
- 단일·쐐기·레이드 **120개 견본**을 현재 한국어 Wowhead 계산기에 가져와 직업/전문화/영웅 34/34/13점, 선택 노드 존재, 부모 연결을 확인했다. 중복을 제외하면 90개 코드다. SimC 고정 커밋 db768b52b425db274e4ebd3ce3d5efc26c8882b5 / 12.1.0.69933 데이터로 전문화·등급·선택 노드도 대조했다. 힐러의 단일 견본은 단일 우두머리 전투용이며 단일 대상만 치유하라는 뜻이 아니다.
- 사격 Wowhead 원문은 영웅 14/13점 코드여서 그대로 채택하지 않았다. 현재 Archon 13/13점 견본으로 대체하고 각 견본의 원출처·보류 사유를 표시했다. 전체 우두머리 레이드 집계를 순수 단일 최적화나 개인 장비의 최적값으로 부르지 않는다.
- 레이드·쐐기 **80개 최신 공개 집계**에 직접 접근하고 코드·로그 수·실제 기간·대표 WCL 링크를 기록했다. 실제 화면의 기간은 최근 14일, 레이드는 전문화별 상위 50% 또는 상위 1,000처치, 쐐기는 7단 이상이다. 주소의 ‘10/this-week’를 실제 집계 조건으로 사용하지 않았다. 10월 6일 조정 전 자료가 섞일 수 있어 조정 후 확정 성능 순위를 주장하지 않는다.
- 40개 원고와 KB 정본이 일치하며, 모든 두 영웅×세 상황 **240개**가 존재한다. 사냥꾼 정본을 악마사냥꾼 폴더로 잘못 찾던 접미사 일치 검사를 직업명 전체 일치로 고쳤다. 이번 작업이 만든 잘못된 위치의 정본만 정리했다.
- KB 경고 **38건을 해결**했다. 공식 한국어 URL, 수도사 공용 후려차기 링크와 비전 Meta의 깨진 과거 링크·낡은 채택률을 정리했다. KB 온라인 2,988개와 가이드 아이콘 711개 대조는 오류·경고 0이다. 원본 설명의 공식 수치 충돌은 임의로 고치지 않았다.
- 생성기와 사이트 검사기의 데이터셋 기준은 12.1로 맞췄다. 개별 원본의 **스킬 160개·시너지 42개는 12.0.5 검수 시점을 보존**했으며 모든 효과의 12.1 대조가 남아 있다. 단순 라벨 치환으로 경고를 숨기지 않았다. 목록과 가이드별 출처·주의 사항은 artifacts/goal-12.1-round-2/remaining-review.json에 있다.
- 가이드별 세 견본의 출처·코드 해시·포인트·연결, 두 집계의 로그 수와 대표 링크, 정본 경로는 artifacts/goal-12.1-round-2/completion-evidence.json에 있다. 계산기 직접 확인 결과는 calculator-final.json, 원집계 화면 근거는 archon-audit.json, KB 변경 근거는 kb-cleanup.json에 저장했다.
- KB는 로컬 정본이며 site 저장소 밖에 있다. 동기화 설정의 currentPatch 수정은 F:/01_프로젝트/90_개발/wowmeta/scripts/kb-sync/config.js에 별도로 보존했다. 다른 환경으로 옮길 때 원본 KB와 이 설정을 함께 옮겨야 한다.

| 가이드 | 식별자 | 검증한 특성 견본 | 레이드 / 쐐기 로그 수 | 영웅별 상황 수 |
| --- | --- | ---: | ---: | ---: |
| 전사 방어 | warrior-protection | 3 | 5,606 / 87,413 | 6 |
| 성기사 보호 | paladin-protection | 3 | 9,095 / 208,992 | 6 |
| 죽음의 기사 혈기 | deathknight-blood | 3 | 25,980 / 300,149 | 6 |
| 수도사 양조 | monk-brewmaster | 3 | 6,677 / 49,771 | 6 |
| 드루이드 수호 | druid-guardian | 3 | 5,578 / 215,600 | 6 |
| 악마사냥꾼 복수 | demonhunter-vengeance | 3 | 4,874 / 86,736 | 6 |
| 전사 무기 | warrior-arms | 3 | 29,539 / 265,638 | 6 |
| 전사 분노 | warrior-fury | 3 | 3,278 / 31,700 | 6 |
| 성기사 징벌 | paladin-retribution | 3 | 21,961 / 251,360 | 6 |
| 도적 암살 | rogue-assassination | 3 | 13,589 / 157,348 | 6 |
| 도적 무법 | rogue-outlaw | 3 | 3,165 / 18,677 | 6 |
| 도적 잠행 | rogue-subtlety | 3 | 8,872 / 34,304 | 6 |
| 죽음의 기사 냉기 | deathknight-frost | 3 | 9,685 / 63,743 | 6 |
| 죽음의 기사 부정 | deathknight-unholy | 3 | 15,350 / 142,078 | 6 |
| 수도사 풍운 | monk-windwalker | 3 | 11,821 / 75,016 | 6 |
| 드루이드 야성 | druid-feral | 3 | 3,817 / 37,804 | 6 |
| 악마사냥꾼 파멸 | demonhunter-havoc | 3 | 15,584 / 94,562 | 6 |
| 주술사 고양 | shaman-enhancement | 3 | 5,508 / 47,172 | 6 |
| 사냥꾼 생존 | hunter-survival | 3 | 2,187 / 16,648 | 6 |
| 사냥꾼 야수 | hunter-beastmastery | 3 | 21,259 / 283,053 | 6 |
| 사냥꾼 사격 | hunter-marksmanship | 3 | 18,076 / 26,487 | 6 |
| 사제 암흑 | priest-shadow | 3 | 13,261 / 64,702 | 6 |
| 악마사냥꾼 포식 | demonhunter-devourer | 3 | 10,513 / 71,863 | 6 |
| 주술사 정기 | shaman-elemental | 3 | 22,506 / 274,270 | 6 |
| 마법사 비전 | mage-arcane | 3 | 46,370 / 424,078 | 6 |
| 마법사 화염 | mage-fire | 3 | 677 / 9,799 | 6 |
| 마법사 냉기 | mage-frost | 3 | 6,150 / 27,962 | 6 |
| 흑마법사 고통 | warlock-affliction | 3 | 4,816 / 19,819 | 6 |
| 흑마법사 악마 | warlock-demonology | 3 | 27,616 / 258,852 | 6 |
| 흑마법사 파괴 | warlock-destruction | 3 | 7,296 / 17,064 | 6 |
| 드루이드 조화 | druid-balance | 3 | 22,239 / 82,056 | 6 |
| 기원사 황폐 | evoker-devastation | 3 | 7,197 / 30,921 | 6 |
| 기원사 증강 | evoker-augmentation | 3 | 6,969 / 11,638 | 6 |
| 성기사 신성 | paladin-holy | 3 | 20,909 / 299,552 | 6 |
| 사제 수양 | priest-discipline | 3 | 2,867 / 48,358 | 6 |
| 사제 신성 | priest-holy | 3 | 26,672 / 189,667 | 6 |
| 주술사 복원 | shaman-restoration | 3 | 21,824 / 226,248 | 6 |
| 수도사 운무 | monk-mistweaver | 3 | 7,337 / 66,526 | 6 |
| 드루이드 회복 | druid-restoration | 3 | 11,449 / 76,044 | 6 |
| 기원사 보존 | evoker-preservation | 3 | 15,025 / 42,154 | 6 |

### 이전 작업 기록

### Rogue baseline utility and ranged-skill scope, 2026-09-21

- Replaced six title-only descriptions: Stealth, Shadowstep, Shuriken Toss, Shroud of Concealment, Distract and Safe Fall. Separated conditional tooltip additions from baseline effects, corrected Stealth's two-second cooldown, Shroud's six-minute cooldown and passive Safe Fall.
- Fixed SimC class/specialization spell rows restrict Shuriken Toss 114014 to Subtlety 261; its KB/DB scope now matches. It is a 40-Energy, 30-yard, one-point ranged attack, not a movement skill. Shadowstep specialization availability still requires further tree/spell replacement review; no broader availability claim is made from the tooltip alone.

### Rogue control casts and conflict cross-check, 2026-09-21

- Rewrote Cheap Shot, Kidney Shot and Gouge from Korean/English tooltips: real instant-cast fields, Energy costs, cooldowns, stun/incapacitate durations, combo-point behavior and positional/stealth requirements. Removed unsupported generic hero-package links.
- Fixed 12.1 sc_spell_data rows for Airborne Irritant contain -50/-70 modifiers, agreeing with the served tooltip rather than launch notes. This improves numeric evidence but does not independently verify live target scope or later server hotfixes; the disagreement remains documented.

### Rogue retired-talent correction, 2026-09-21

- Blizzard's Midnight pre-expansion notes explicitly remove Shadowheart 455131 and Rushed Setup 378803. Neither exists in fixed 12.1 trait_data. Removed both canonical notes, sync-state entries and the Shadowheart incoming relation; regenerated DB excludes both.
- This corrects the earlier Rushed Setup refresh: an accessible tooltip was insufficient availability evidence. Replaced its positive effect assertion with absence/relationship regression checks. The same official page also disagrees with the currently served Airborne Irritant tooltip (80%/80%, no extra targets versus 50%/70%, nearby targets); its current mechanics require a separate source-resolution pass.

### Rogue movement scope correction, 2026-09-21

- Restricted Acrobatic Strikes 455143 to Outlaw using its fixed 12.1 spec-tree row (spec 260); authored its three-second, ten-stack auto-attack/movement effect from Korean/English tooltips. Storage remains in the existing common directory; explicit specialization scope is authoritative.
- Rebuilt the common movement relationship with six actual movement participants. Removed Outlaw-only Acrobatic Strikes and unrelated Blind, defensive-cost, Agility, attack-speed and ranged-attack nodes. Shadowheart retirement and the older common overview/control relationships remain pending.

### Rogue offensive modifiers and scope findings, 2026-09-21

- Compared live Korean/English effects and fixed trait rows for seven common talents: Deadly Precision, Lethality, Cold Blooded Killer, Thrill Seeking, Forced Induction, Quick Fingers and Deep Cuts. Replaced generic text, separated crit chance from crit damage, clarified Lethality's two ranks and spec-specific mobility charges, and linked actual conditions instead of poison/stealth placeholders.
- The same audit found Acrobatic Strikes 455143 only in Outlaw's specialization tree while the KB still marks it common. Shadowheart 455131 was absent from the fixed trait list despite its tooltip being accessible. Their scope/retirement and incoming links remain an explicit next audit item; neither was simply relabeled current.

### Rogue ten shared talent effects, 2026-09-21

- Individually compared Korean/English tooltips for Airborne Irritant, Deadened Nerves, Nimble Fingers, Shadowrunner, Fleet Footed, Recuperator, Blackjack, Improved Ambush, Tight Spender and Swift Slasher. All ten also appear as one-rank class nodes in fixed SimC 774babde5ddc7c5fc9f1abb129b473f8a076df70.
- Replaced title-only DB descriptions and unrelated movement links with actual effects. Distinguished post-control Blackjack, fixed energy discounts, conditional movement, periodic healing, Haste-scaled attack speed and Ambush versus Shadowstrike bonuses. Improved Ambush and Tight Spender share choice node 90692, so their benefits must not be combined.
- Added mechanic assertions and synced canonical changes to DB. Thirty-three Subtlety-associated records remain labeled older than 12.1; labels and these focused assertions are not a complete availability or gameplay audit.

### Rogue movement base versus talent modifiers, 2026-09-21

- Live Korean/English tooltips confirm Sprint's base cooldown is two minutes, not the previously stored one-minute talented value. Improved Sprint subtracts 60 seconds; Featherfoot adds 30% movement speed and four seconds of duration. Unbreakable Stride reduces slow duration by 30%, not slow strength or all control effects.
- Rewrote four canonical notes and synced their real descriptions to DB. Conditional water-walking text is not presented as a baseline guarantee. Added focused base/modifier assertions; this does not complete the remaining class-wide audit.

### Subterfuge scope and rank follow-up, 2026-09-21

- Fixed SimC commit 774babde5ddc7c5fc9f1abb129b473f8a076df70 lists Subterfuge as a class-tree node with no specialization restriction and two maximum ranks; the field order was checked against trait_data.hpp. Its implementation selects effect 4 for Subtlety and effect 2 otherwise. Retained Outlaw scope and documented that basic tooltip durations are not a verified maximum-rank duration.
- Danger Sense is explicitly unimplemented in that simulator, so it cannot settle the Korean/English damage-scope disagreement. No new live-game verification is claimed.

### Rogue stealth versus defensive-charge effects, 2026-09-21

- Rechecked live Korean/English tooltips and replaced generic Subterfuge, Stillshroud and Graceful Guile notes. Subterfuge explicitly distinguishes Subtlety's two seconds and Assassination's three; the tooltip omits Outlaw, whose current selection scope is not established by this check.
- Stillshroud reduces Shroud of Concealment's cooldown by 50%; Graceful Guile adds one Feint charge. Removed misleading stealth-package links and linked each note to its actual affected cast. KB/DB checks preserve these distinctions; remaining class-tree availability and older relationship audits are still open.

### Rogue control costs and conflicting defensive tooltip, 2026-09-21

- Replaced generic Rushed Setup and Without a Trace notes with verified energy-cost and Vanish-charge effects. Changed their links to the actual affected skills instead of generic defensive relationships.
- Danger Sense's live Korean tooltip says magic damage; English says any damage. Both agree on 20% chance and 20% reduction. Recorded this unresolved scope conflict in canonical KB and DB rather than presenting physical coverage as verified. Added focused assertions for all three descriptions.

### Rogue shared defensive talents, 2026-09-21

- Compared current Korean/English Wowhead tooltips for Elusiveness 79008, Iron Stomach 193546 and Soothing Darkness 393970. Replaced generic descriptions with their actual effects and limitations. Elusiveness distinguishes Evasion's added reduction from Feint's non-AoE reduction; Iron Stomach applies only to its named healing sources; Soothing Darkness triggers from Vanish, not every stealth or Dance.
- Rewrote the shared defensive relationship with nine relevant participants, removing Vigor/Alacrity as direct defensive effects. Canonical KB and generated descriptions now agree. Remaining common talents, fresh log evidence and whole-guide deployment are still open.

### Subtlety canonical build and graph correction, 2026-09-21

- Rechecked Eleem's Icy Veins talent recommendations and fuu1's Wowhead rotation page. Replaced the May current-build note with scoped 12.1 author recommendations, not current usage statistics. Removed the stale graph's fixed center/degree claims and Deathstalker-only-single-target framing.
- Made the generated AoE relationship explicit: two targets without Potent Powder use Eviscerate by default; three or more use Black Powder, with empowered-finisher exceptions. Current log aggregates, import-code validation and remaining common talents are still outstanding.

### Subtlety manuscript and unsupported chart cleanup, 2026-09-21

- Rewrote the remaining eight manuscript subjects and eight shared Rogue utility records, synced the generated DB and pushed 3af7a5e4. All three Rogue focused checks and full prebuild passed; local 1440/390px checks loaded the updated text without page overflow or runtime errors.
- Removed Subtlety's specialist cooldown chart: its bars were computed from array indices, not measured casts or an authored rotation. Removed the unused hardcoded timeline rows and unsupported Trickster/Deathstalker popularity claims too. The two heroes' six authored rotation views and synergy graph remain available.
- Remaining common talents, advanced gameplay review, current log evidence, whole-guide patch metadata and production rollout are still pending. No current popularity or measured timeline is claimed.

### Subtlety hero-specific rotation rewrite, 2026-09-21

- Replaced outdated June hero rankings with current public guide recommendations, explicitly not fresh usage statistics. Manually authored separate opener/single-target/AoE views for Deathstalker and Trickster using the existing UI; rewrote the hero and opener sections and practical tips.
- Added a canonical hero-entry relationship, corrected Unseen Blade's missing Subtlety description, and synced DB. Blizzard's official indexed hotfix text confirms the 4pc 60% change, manual Dance cancellation restriction, and Lingering Darkness resets; exact individual hotfix dates remain unverified because the full article was blocked.
- Archon raid and Mythic+ access failed; the browser presented a human-verification gate. Links are explicitly marked unverified and excluded from quantitative recommendations. A passing structural source validator does not establish current log coverage.
- Focused checks cover 60 local/18 Deathstalker records, 13 relationships and six hero views; Outlaw regression and prebuild passed. Browser checks exercised both heroes and all three modes at 1440/390px without horizontal overflow or page errors; inspected the mobile screenshot. Sanitized compilation passed before the final tooltip/backlink sync.
- Whole-guide 12.1 labeling and production rollout remain pending: common utility, remaining body/editorial prose, advanced cases and live log evidence still need review.

### Subtlety Season 2 set data, 2026-09-21

- Added manually researched 2pc/4pc canonical notes and their Lingering Shadow relationship, updated the base talent's set exception, synced generated DB, and replaced the public guide's repetitive final section with set-dependent gameplay.
- Current Korean/English 1296593 tooltips and spell detail say 60% effectiveness; the September 2 Wowhead gearing article still says 100%. Used the direct spell data and documented the conflict without inventing a hotfix date. Verified Gloomblade inclusion in the 2pc effect target lists.
- Focused checks passed for 60 local records, 18 shared Deathstalker records and 12 relationships. Online name/icon validation passed for 60 Subtlety notes. Prebuild passed (23 pre-existing general offline warnings); sanitized production compilation passed with bundle main.e03be110.js.
- Full manuscript, remaining common utility and current build/log review are pending. Kept the whole-guide patch label unchanged; no production deployment is claimed for this partial update.

### Shared Deathstalker effects, 2026-09-21

- Manually replaced 12 generic shared hero descriptions using live Korean/English tooltips. Split Assassination/Subtlety conditions for Mass Casualty, Follow the Blood, Corrupt the Blood, Symbolic Victory and Lingering Darkness; corrected defensive/utility effects and critical-damage versus critical-chance wording.
- Rebuilt the shared and Subtlety mark relationships. Removed unsupported old meta rankings and incorrect defensive classification of Unshakeable Drive. Its unresolved blank tooltip spell remains explicitly unknown rather than guessed.
- Generated-data diff is limited to those 12 skills and two relationships. Focused checks now cover 58 local skills, 18 shared Deathstalker skills and 11 relationships; Assassination regression checks and prebuild passed. General offline validation still reports 23 warnings.
- Canonical KB and generated DB updated together. Season 2 sets, remaining common utility, fresh build/log evidence and the full Subtlety manuscript are still pending. No production deployment or whole-guide completion is claimed.

### Subtlety remaining local talents, 2026-09-21

- Manually rewrote 27 remaining local talents from Korean/English tooltips and fixed-SHA trait data. Corrected active Gloomblade, current Finality/Danse Macabre/Shadow Focus/The Rotten effects, two-rank Death Perception/Finality/Dark Shadow and five mutually exclusive choice pairs.
- Resolved Improved Backstab's Gloomblade condition using the actual Gloomblade tooltip plus SimC impact implementation. Clarified Fade to Nothing's movement increase against ambiguous Korean wording. Replaced unrelated generic backlinks with actual effect links.
- Rebuilt the Dance/builder relationship and added clone-damage and defensive-choice relationships. Focused checks cover 58 local records/nine relationships; the 58-note official name/icon online check passed without errors or warnings.
- Cross-checked all 48 Subtlety specialization-tree records at SimC SHA 774babde5ddc7c5fc9f1abb129b473f8a076df70 against generated IDs/spec membership: zero missing. Prebuild passed; general offline validation still has 23 warnings.
- Shared Deathstalker, Season 2 data, remaining common utility, subsequent live changes, build/log evidence and full manuscript remain unfinished. This is not a production rollout or a claim of complete Subtlety validation.

### Subtlety builders, finishers and support effects, 2026-09-21

- Manually checked 17 additional Korean/English tooltips, bringing local reviewed records to 31. Separated active Shuriken Storm 197835 from passive rank-2 1279401; corrected passive Shuriken Tornado, Premeditation and gradual Master of Shadows Energy.
- Retired old Slice and Dice 5171 from generated skills while preserving a canonical redirect note. Current 315496 grants attack speed, not direct Energy regeneration; Cut to the Chase grants Slice and Dice through Eviscerate. Removed two obsolete public cast steps and the corresponding Energy claim.
- Rebuilt three relationships (six reviewed total), separating armor ignore, extra Shadow damage and the two-target Potent Powder condition. Full manuscript, remaining talents/Deathstalker/Season 2 data, current build and log evidence still require review. No production deployment is claimed for this partial batch.
- Validation: focused 31-record/six-relationship checks and prebuild passed. Online official-tooltip check covered 58 Subtlety notes with zero errors/warnings; this confirms the validator's name/icon checks, not all gameplay claims. The general offline check still reports 23 warnings, and 27 local talents remain on the old patch.

### Subtlety core data audit, 2026-09-21

- Manually rechecked 14 Korean/English tooltip records. Fixed active Goremaw's Bite, Shadow Techniques storage/Energy, Relentless Strikes Energy, Shadowcraft frequency, conditional First Dance duration, Lingering Shadow AoE coverage and the three Ancient Arts nodes.
- Replaced generic/title-only descriptions, rebuilt two relationships and added Goremaw's finisher relationship. The middle Ancient Arts node has two ranks in fixed 12.1 trait data; the default tooltip is not the complete-build value.
- Added a focused generated-data check. Remaining local records, Deathstalker, Season 2 sets, live build/log evidence and full Subtlety manuscript remain pending. The public guide still carries its old patch label; this is not a completed guide rollout.

### Outlaw manuscript rewrite, 2026-09-21

- Rebuilt 14 gameplay sections and both heroes' opener/single-target/AoE flows; canonical manuscript and site data match. Removed the unmeasured Outlaw uptime timeline.
- Distinguished Gravedigger's Energy waiver from free Season 2 Dispatch, effective combo points from actual spending, and the heroes' normal Dispatch thresholds. Refreshed opener and utility relationships.
- Current log samples, imported build validation and full cross-spec coverage remain unfinished. This entry does not claim production deployment or complete factual validation.
- Release verification: prebuild and focused Outlaw checks passed; desktop six-mode switching and 390/320px mobile views showed no document overflow or broken images. Clean production build passed with no environment files, source maps or detected secret values.
- Deployed to wowmeta.vercel.app: dpl_2oKEmor8EqLM7dQZB5MCLaaibPZP (Ready), bundle main.c623e64d.js. Live page shows 14 authored sections and the 2026-09-21 update. Deployment does not resolve the remaining log/build evidence gaps.

### Common resource mechanics and free Dispatch evidence, 2026-09-21

- Reviewed Slice and Dice, Cut to the Chase, Deeper Stratagem, Vigor, Alacrity and Supercharger. Corrected Cut to the Chase to passive and kept each spec's triggering finisher/cooldown distinct. Fixed 12.1 trait data marks Vigor, Alacrity and Supercharger as two-rank talents.
- Rebuilt the common finisher/resource relationship. Slice and Dice is 25 Energy plus combo points, 50% attack speed and 12/18/24/30/36 seconds at 1–5 points; Cut to the Chase grants 3 seconds per point through Envenom/Dispatch/Eviscerate respectively.
- Fixed-SHA SimulationCraft inspection shows free Season 2 Dispatch sets actual CP loss to zero but snapshots maximum effective CP; Restless Blades and Hand of Fate use effective CP. Recorded this as implementation evidence, not fresh live-log proof. Ruthlessness still contains a dated PTR/bugs branch, so do not generalize every downstream proc.
- Regression scope: 54 local Outlaw, 35 shared hero, six common records and 11 relationships. Full Outlaw manuscript, current build/log evidence and remaining common utility coverage are still pending; no production rollout.

### Shared Fatebound effect audit, 2026-09-21

- Rechecked 17 Fatebound effects in Korean/English tooltips; preserved three already-reviewed notes and manually replaced 14 generic descriptions. Outlaw/Assassination differ in Overflowing Purse (4%/15%), Rush to the Inevitable (2/10 vs 5/15 Energy), Edge Case triggers and generator modifiers.
- Rewrote common and Outlaw coin relationships, including Lucky Coin's count exclusion while active. Removed Controlled Chaos's reverse link to Trickster and Delivered Doom's unrelated Deathstalker link.
- Regression scope is now 54 local Outlaw records, 18 shared Trickster records, 17 shared Fatebound records and ten relationships. This does not prove the complete manuscript, current build popularity, fresh log evidence or all common skills. Those remain unfinished; no production rollout in this batch.

### Shared Trickster and Outlaw Season 2 data, 2026-09-21

- Replaced 18 shared Trickster placeholders using current Korean/English tooltips. Preserved Outlaw/Subtlety differences: Flawless Form 4%/2%, Nimble Flurry's distinct AoE effects, Cloud Cover's different cooldowns and additional stack limits, and Clever Combatant's Pistol Shot/Shuriken Storm split.
- Rewrote common, Outlaw and Subtlety hero relationships. Removed stale popularity claims and the unrelated Fatebound Controlled Chaos node from Trickster. Coup de Grace is a transformation of Dispatch/Eviscerate after four Unseen Blade strikes, not a separate button.
- Added Outlaw Season 2 2pc/4pc records 1296588/1296589 and a finisher relationship. Kept official internal names/icons and added Korean search aliases. Damage-equivalent combo points are not assumed to be actual resource spending.
- Regression coverage: 54 local records, 18 shared Trickster records and eight relationships. Fatebound, remaining common skills, tier execution details, current build/log evidence and the complete Outlaw manuscript still need work. No production rollout is claimed.

### Outlaw remaining local talent effects, 2026-09-21

- Manually reviewed 30 more local records against Korean/English tooltips and fixed 12.1 SimulationCraft trait rows. Coverage is now 52 records and four relationships; shared skills, heroes, tier sets and the full manuscript still require work.
- Keep It Rolling is an active six-minute cooldown extending the current Roll the Bones result by 30 seconds. Removed it and Preparation from the manuscript validator's incorrect passive-node blacklist.
- Distinguished Loaded Dice's next-roll upgrade from Sleight of Hand's probability modifier and Dragon-Bone Dice's stronger bonuses. Added Improved Adrenaline Rush's immediate combo-point refill to the cooldown relationship.
- Added Audacity/Hidden Opportunity's return from Pistol Shot to Ambush, and rank-aware Ace Up Your Sleeve, Heavy Hitter and Summarily Dispatched descriptions. Hidden Opportunity's 100% refers to Sinister Strike's proc chance, not a guaranteed proc.
- Recorded mutually exclusive utility/generator choices. Mastery tooltip damage coefficient remains unverified and is not used as a damage formula. This batch does not claim fresh log/build validation or a production guide deployment.

### Outlaw generator and cleave audit, 2026-09-21

- Added ten manually reviewed records and two rewritten relationships. Reviewed coverage is now 22 records and four relationships, not the whole specialization.
- Resolved Sinister Strike's embedded 30%/30% Opportunity text against the dedicated talent and actual buff 195627: 50% cost reduction and 100% damage increase. Fan the Hammer's rank-one tooltip is not treated as the full two-rank build.
- Separated Blade Flurry's initial damage and replication, Deft Maneuvers' 45-energy total, Dancing Steel's 13-second duration, Grand Melee's 36% replication and Blade Rush's separate non-primary-target modifier. Blade Rush is baseline one minute and restores 25 energy over five seconds.
- Generator relationships now route cooldown reduction through combo points spent on finishers, not directly from Pistol Shot. The manuscript remains 12.0.5 pending remaining talent, hero and tier research; this batch is not a production guide rollout.

### Outlaw core-data audit started, 2026-09-21

- Manually replaced 12 generic skill/talent descriptions with current effects; checked Fast Action, Preparation and three Gravedigger nodes against fixed 12.1 trait data. Online checks also caught Menacing Rush's Korean name: 위협적인 촉진, with its 20% generator/finisher modifier during Adrenaline Rush.
- Corrected Preparation's Korean name to 마음가짐 and its active four-minute cooldown; Restless Blades is passive and does not reduce Preparation. Rewrote two cooldown relationships with explicit reset inclusions/exclusions.
- The Outlaw manuscript remains 12.0.5 until generator/hero/tier coverage and a full authored rewrite are complete. June usage rates and conflicting public rotation examples are not current build proof. Canonical audit details are in Outlaw Meta/review-12.1.md.

### Assassination common skills and Season 2, 2026-09-21

- Rechecked Feint and Vanish against Korean/English tooltips and fixed title-only generated descriptions. Feint is baseline 35 energy, 6 seconds and 40% AoE reduction; Vanish's first 3 seconds prevent damage from breaking stealth, not damage itself.
- Added passive Season 2 set records 1296590/1296591 with exact source names/icons and descriptive Korean aliases. Authored the set/poison/bleed relationship and a guide section distinguishing set damage modifiers from rotation changes.
- Reviewed-subset regression coverage is now 70 records and 11 relationships. Shared/hero coverage, latest build/log evidence and the seven remaining 12.0.5 manuscripts are still unfinished. This is not a completion claim for all classes.

### Assassination core guide rollout, 2026-09-21

- Reviewed Shiv 5938, Toxic Stiletto 1267182 and automatic Thistle Tea effect 381623 against current Korean tooltips. Added separate automatic talent 469779 and manual talent 1298826; the fixed 12.1 SimulationCraft trait table places both talents in choice node 90756.
- Corrected Shiv to baseline 30 energy/30 seconds, reduced to 10 energy/15 seconds by Toxic Stiletto. Replaced the old poison-dispel and mandatory 7-point trigger wording in its relationship.
- Replaced the runtime manuscript with a manually authored canonical 12.1 guide: 12 practical sections, both heroes' opener/single-target/AoE modes, resource choices and explicit access limitations. Removed June popularity claims and the separate stale specialist chart.
- Regression scope is now 66 reviewed records and all ten Assassination relationships. Added three Deathstalker generator traits, kept cross-specialization effects separate, and removed an unrelated Fatebound link. Automatic/manual tea aliases resolve to distinct tooltip targets.
- Full prebuild checks and sanitized production build passed. Desktop hero/mode switching, 390px and 320px layouts had no document overflow or broken loaded images; the 320px opener wraps without horizontal dragging.
- Vercel deployment `dpl_BcC43fBCymZS5H1aNcsgaRgqoHiB` is Ready. The public Assassination route serves `main.14f13066.js` and the new guide. No environment files, sourcemaps or matched local credential values were in the uploaded output.
- Remaining Assassination work: finish shared/hero/tier-set coverage and current build/log evidence; inspect the broader skill list for old generic common records. This core rollout is not a claim that all Rogue data or every 12.1 build has been fully audited.

Checked against the runtime manuscript map on 2026-09-21. The objective remains all 40 specializations, including canonical KB notes, generated spell/synergy data, authored guide text and charts. A patch label or a passing structural test alone is not completion evidence. There are 33 manuscripts labeled 12.1 and 7 still labeled 12.0.5; the older 12.1 manuscripts and the explicit Assassination follow-up gates still require review.

## Updated in this rollout

### Blood Death Knight

- Manually reviewed Wowhead, Icy Veins, Method Reholy and current Korean tooltip effects. Source dates and access limits are recorded in the manuscript.
- Replaced the 12.0.5 manuscript in place; canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/혈기/Meta/guide-12.1.json`.
- Added Season 2 Blood Debt, Bloodshot, Ebon Blade Endurance, Blood-Soaked Ground and Blood Shield KB records and relationships; corrected Consumption empower stages, Gift of the San'layn, Vampiric Aura and Blood/Frost Exterminate scope.
- Bone Shield is stored as a buff, not a separately cast defensive. The Blood Shield shorthand resolves to the official mastery icon/tooltip.
- The opener uses actual cast buttons with conditional hero/tier steps. The defensive chart uses authored damage-type/recovery conditions, not arbitrary spell ordering.
- The canonical synergy builder now preserves an optional manually authored frontmatter `description`; the guide displays it before generic relationship text. The builder remains in the existing parent `scripts/kb-sync` directory, outside this site repository.
- Manuscript/KB equality and regression checks pass. Online icon/name checks passed for 21 explicitly referenced spells. Desktop, 390px and 320px opener layouts and hero switching were inspected; no document overflow or broken image was found in these checks.
- Final production build and its prebuild checks passed on 2026-09-12. Existing global KB link warnings (87), mixed-patch warnings and the large bundle warning remain; these checks are not evidence that all 40 guides are current.
- Limits: Archon M+ values were available only in search results; current raid aggregate data and the Blizzard patch-note body were inaccessible. Consumption rank advice differs between guide authors and remains conditional. This is not a claim that every older Blood/common atomic note or every graph layout has completed a full re-audit.

### Frost Death Knight

- Replaced the old manuscript in place with 15 manually authored sections. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/냉기/Meta/guide-12.1.json`.
- Reviewed current Wowhead Korean tooltips, Wowhead Khazak, Icy Veins Bicepspump, Method Taeznak and the available Mythicstats M+ sample. Access limits and conflicting source advice remain explicit.
- Removed the obsolete draining Breath ID 152279 from the current DB and replaced it with 1249658. Updated Empower Rune Weapon, Obliteration, Rime, Frozen Dominion, Frostwyrm cast/recall, apex nodes and Season 2 effects in original KB notes and generated data.
- Current live set values are 1% attack speed and 2% Icy Death Torrent damage per stack, not the older PTR 2%/4% values. The graph uses the actual Freezing Tempest buff instead of an internal 4-piece placeholder icon; the internal effect still has a separate DB record.
- Authored eight synergy notes with explicit participants and explanations. Fixed the shared graph renderer so a synergy without the center spell no longer receives an invented center edge; a runnable regression check covers this behavior.
- Rider raid and Deathbringer non-Breath AoE openers use actual cast buttons. Passive Exterminate, automatic Winter and tier procs are conditions, not cast steps. Removed the old illustrative cooldown chart.
- Canonical manuscript equality, gameplay regression checks, prebuild validation and production build passed on 2026-09-12. Online icon/name checks passed for 16 explicitly referenced spell IDs. Desktop, 390px and 320px opener layouts and hero switching were checked, with no page overflow or broken images found in those checks.
- Limits: current raid aggregate/event data and the Blizzard patch-note body were inaccessible. Mythicstats covers 800 top +17-20 logs from 226 characters, not all players. Shared older DK notes and the dense graph's node/label layout still require re-audit; native anchor navigation worked on a fresh desktop render. Existing global KB link warnings (87) and the bundle-size warning remain.

### Unholy Death Knight

- Replaced the old manuscript in place with 15 manually authored practical sections, role-specific summaries, tips, a default opener and separate Rider/Sanlayn combat flows. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/01-죽음의기사/부정/Meta/guide-12.1.json`.
- Updated 40 Unholy atomic notes and ten authored synergies, then regenerated the spell/synergy DB. The site diff also corrects two shared Rider records; unrelated manuscripts are unchanged.
- Corrected Army 90s/30s/eight-ghoul orders, Soul Reaper ghoul-ready stack consumption, Putrid Echoes multi-charge consumption, Lord of the Dead, specialization apex nodes, Season 2 pet spells and execute effects.
- Separated actual casts from effects/talents: Dark Transformation 1233448/63560, Festering Scythe 458128/455397, Blightfall 1271967/1271974. Pet spells and passive buffs never appear as opener buttons.
- Added current passive Clawing Shadows 1241567/1241569 (live 10% chain reduction, not the cached 20% or old active 207311), Harbinger of Doom and Menacing Magus. Apocalypse Now now resolves for both Frost and Unholy; its missing scope had suppressed Unholy inline icons.
- Read SimC APL commit `8de87ce5b2bf373ea36be556afd1481557dc3fe0` (2026-09-07). The normal three-target/apex four-target baseline is labeled as a model, not collected WCL evidence. Old June usage percentages were removed.
- Removed the placeholder cooldown chart. The graph uses Putrefy and five actual direct synergy connections. Fixed shared relation cards that had inserted an unrelated center spell, and classified buffs as effects. Added runnable regression checks for these cases and for patch-version headings being incorrectly stripped as chapter numbers.
- Canonical equality, scoped gameplay assertions, all prebuild checks and production build passed on 2026-09-13. Online atomic tooltip/metadata/link checks passed for 40 notes; explicit guide spell-name/icon checks passed for 19 IDs, both with zero errors/warnings.
- Desktop, 390px and 320px opener/hero-flow checks found no page overflow or broken images. Hero switching and the final production bundle `main.50e2d332.js` were verified in the browser. The Sanlayn relation no longer invents Putrefy participation.
- Limits: latest raid/M+ aggregate data, personal simulations, the Blizzard 12.1 patch-note body and private Acherus messages were not obtained. The guide states these limits instead of inventing usage rates or DPS. Dense graph labels, older shared DK notes, 87 global KB link warnings, mixed-patch metadata and the large bundle still require work. Original Markdown remains outside the site Git repository; this commit preserves generated DB and site content.

### Havoc Demon Hunter

- Replaced the old manuscript in place with 13 manually authored sections and separate Fel-Scarred/Aldrachi explanations, resource conditions, practical tips and log-review criteria. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/02-악마사냥꾼/파멸/Meta/guide-12.1.json`.
- Reviewed Wowhead Shadarek, Icy Veins Wordup, Method Hype, current Korean spell effects and SimC APL commit `7606c71c1c44f7a501929b634debc58cb5a5f123` (2026-09-08). Differences between author recommendations remain explicit; no current WCL usage percentages were invented.
- Rewrote 27 existing atomic notes, added 27, removed obsolete Sigil of Doom, and authored 11 synergies. The current Havoc scope contains 54 numeric atomic notes. Corrected seven shared spell/hero records and two hero-tree notes, then regenerated DB and sync-state metadata.
- Replaced covenant Hunt 323639 with current cast 370965, and Fury of the Aldrachi damage effect 444806 with talent 442718. Corrected base cooldowns/costs, passive versus active classification, apex next-cast reset, Season 2 set effects, movement talents and Aldrachi consumption order.
- Fixed title-only DB descriptions by using the existing canonical parser's description heading. Regression checks now require real descriptions for all 54 Havoc notes and seven referenced shared records. Added aliases so references to the middle/last Eternal Hunt node resolve to the correct tooltip.
- Fel-Scarred's 15-step flow and Aldrachi's 12-step AoE flow contain only real player casts; automatic procs remain conditions. Removed the old placeholder cooldown chart.
- Fixed shared rendering that truncated manually authored openers at 12 steps: both chart variants now reuse the full authored flow mapper. Removed note line-clamping so step conditions remain readable. Non-numeric hero-tree IDs no longer become broken Wowhead spell links in guide text/cards/graphs. Runnable checks cover the step limit and invalid IDs.
- Online atomic tooltip/metadata/link validation passed for 54 notes with zero errors/warnings; explicit guide name/icon validation passed for 24 IDs. Canonical equality, scoped mechanic assertions, all prebuild checks and production build passed on 2026-09-13.
- Inspected desktop, 390px and 320px flows and hero switching. Final bundle `main.4ec850af.js` renders 15/12 steps, no clipped step paragraphs, no document overflow, no broken loaded images and no non-numeric spell links in these checks. The graph centers on Eye Beam with six direct synergy connections.
- Limits: Blizzard patch-note body, latest raid/M+ aggregates and private Fel Hammer messages were unavailable. Inertia duration and adjusted Immolation Aura generation differ between live tooltips and guides and remain flagged. Dense graph labels still overlap in places; old shared DH notes and the other DH manuscripts need separate re-audits. Global 87 KB link warnings, mixed-patch metadata and the large bundle remain. Original Markdown is outside the site Git repository; the commit contains the generated DB and site changes.

### Vengeance Demon Hunter

- Replaced the old manuscript in place with 15 manually authored sections, practical tips, Annihilator/Aldrachi explanations, separate 14/12-step openers and conditional 16/18-row priorities. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/02-악마사냥꾼/복수/Meta/guide-12.1.json`.
- Reviewed current Korean tooltips, Wowhead Itamae, Icy Veins Meyra and Method Meyra/Fel Hammer public guides. The available SimC Vengeance file was last changed in April; it is explicitly historical, not proof of the current optimal rotation.
- Manually authored 44 local atomic notes and 12 synergy notes, corrected shared Aldrachi/Annihilator scopes and specialization-dependent effects, updated canonical source/sync metadata, and regenerated spell/synergy JSON.
- Corrected personal Fiery Brand damage reduction, Spirit Bomb cooldown/cost, manual Untethered Rage activation, passive Soul Barrier, Fury-based Feed the Demon, Meteoric Fall stack consumption, Worldkiller cooldown reduction and target-specific Season 2 bonuses. Openers contain actual casts, with passives and selected talents represented as conditions.
- Re-audited seven shared DH utility notes and three common relationships. Blur is limited to Havoc/Devourer, Chaos Brand is a passive debuff, and unrelated shared skills no longer appear in every common synergy. Other older shared notes were not bulk relabeled.
- The existing priority renderer now uses an authored selected-hero priority when present, with the same hero state as the opener. Priority and specialist-chart sections use the existing full-width layout instead of the narrow sidebar track. Shared-spell labels use the displayed specialization instead of the original storage folder name.
- Canonical equality, scoped mechanic/scope assertions, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link validation passed for all 44 local atomic notes and 16 numeric shared notes; explicit guide name/icon validation passed for 26 IDs. Shared metadata validation is not a claim that all 16 shared mechanics were fully re-audited.
- Inspected desktop, 390px and 320px flow, priority switching and defensive-chart layouts. Final production bundle `main.ea1b4a00.js` displays the correct specialization label, no Blur links, no broken loaded images and no document overflow in these checks. All 443 rendered spell href attributes are numeric, including SVG graph links. The graph centers on Spirit Bomb with six actual direct synergy connections.
- Limits: Blizzard patch-note body, latest raid/M+ aggregate data, personal simulations and private Fel Hammer messages were not obtained. Source disagreements remain explicit; no usage percentages or guaranteed DPS gain were invented. Dense graph labels, older shared records, 87 global KB link warnings, mixed-patch metadata and the large bundle remain. Original KB Markdown/JSON is outside the site Git repository; this commit preserves generated DB and site changes.

### Guardian Druid

- Replaced the old manuscript in place with 16 manually authored subjects, practical tips, separate Elune/Claw explanations, 12-step hero openers and conditional 14/15-row priorities. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/03-드루이드/수호/Meta/guide-12.1.json`.
- Recovered and read the Blizzard 12.1 update body and September 9 Guardian hotfix. Compared current Korean/English tooltips, Pumps' Wowhead/Icy Veins guides, Tactyks' September 3 Method guides and SimC implementation commit `c8352dd12b9d57a9f510f29860969160e83653cc`.
- Manually updated/added 66 atomic records (41 local Guardian, 19 shared hero, six common) and authored 17 Guardian synergies. Removed legacy Berserk node 343240 and used current cast 50334. Generated DB changes are confined to Druid records.
- Corrected fixed Lunation cooldown reduction, redesigned Gory Fur/Wild Guardian, Tooth and Claw spenders, apex ranks versus the actual cast, Guardian Ravage, Red Moon, conditional Frenzied Regeneration, manual/automatic Regrowth and Season 2 effects. Persistence is Guardian-only; shared hero scopes distinguish Balance/Feral effects.
- Apex-node aliases now connect descriptions to their own official tooltips instead of the identically named cast. Removed a dead Flourish link from shared Ursol's Vortex and verified its current effect. Set-effect names/icons retain the official API values even where the API remains English.
- The defensive chart uses six manually authored damage/recovery choices, not a generic ordered spell pool. Its regression checks verify actual casts and use conditions instead of requiring internal chart-writing terminology on the page.
- Canonical equality, mechanic/scope assertions, prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for all 41 local notes and 47 numeric shared notes; guide name/icon checks passed for 24 explicitly referenced IDs. Shared metadata validation is not a claim that all 47 common mechanics were re-audited.
- Inspected desktop, 390px and 320px layouts, hero switching, priorities and defensive conditions. Bundle `main.4ad586c4.js` displays 12-step hero flows, separate apex tooltip targets, no page overflow and no broken loaded images in these checks. The graph centers on Thrash with seven actual direct relationships.
- Limits: current raid/M+ WCL/Archon aggregates, personal simulations and private Dreamgrove messages were not obtained. Harnessed Rage localization and some trait-rank values remain explicitly qualified. Dense graph-label overlaps, older common records, 86 global KB link warnings, mixed-patch metadata and the large bundle remain. Original KB Markdown/JSON is outside the site Git repository; the commit preserves generated DB and site changes.

### Feral Druid

- Replaced the old manuscript in place with 14 manually authored practical subjects, role-specific summaries, ten tips and separate Claw/Wildstalker explanations. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/03-드루이드/야성/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 update and September hotfixes, current Korean tooltips, Method Drufearr, Dreamgrove Crazymeow, Wowhead Guiltyas and Icy Veins Wordup. Source dates and conflicting recommendations remain explicit. No current WCL aggregate, personal simulation or private Discord evidence was obtained.
- Completed the manual review of all 51 local atomic records, nine shared Wildstalker records and Convoke; authored 12 synergies. Removed obsolete cat Thrash 106830 without removing Guardian cast 77758. Generated DB changes remain confined to Druid records.
- Corrected current cast/passive identities, Chomp conditions, resource costs and talent-adjusted cooldowns, three separate apex nodes, free Bite, Cat's Cunning, AoE Rake/build conditions, Rampant Ferocity, automatic vine effects and Season 2 effective-combo-point duration. SimC commit `c8352dd12b9d57a9f510f29860969160e83653cc` is implementation evidence, not a measured WCL result.
- Added separately authored opener, single-target and AoE modes for each hero using existing compact flow and priority renderers. Claw AoE's Incarnation example does not also require Convoke; Wildstalker does not borrow Ravage. Passive procs remain conditions, not cast buttons. Removed the fabricated uptime timeline.
- Synergies center on Ferocious Bite with nine direct authored relationships. The tier relationship displays the actual Halazzi's Wrath buff rather than internal set-effect icons; internal effect records remain in the DB.
- Fixed shared hero anchors that duplicated icons and re-resolved identical names to the wrong tooltip. Explicit spell IDs now keep their own icon/name link; invalid, removed and non-numeric references remain plain text. Added runnable regression checks. Generic overview fallbacks no longer prescribe healing to damage dealers or substitute source caveats for log-review advice.
- Canonical equality, scoped gameplay assertions, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for 51 local notes, 54 numeric shared notes and Convoke; explicit guide name/icon checks passed for 25 IDs with zero errors/warnings. Shared metadata validation is not a full mechanics re-audit of all 54 notes.
- Inspected desktop, 390px and 320px combat modes, hero switching, native condition disclosure and exact Ravage/apex tooltip IDs. No document/rail overflow, broken loaded icons or console errors were found in these checks.
- Limits: live aggregate usage/DPS, ambiguous apex tooltip values, older shared mechanics, generic featured-skill ranking and dense graph-label layout still need work. Existing 86 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical KB is outside the site Git repository; the commit contains generated DB and site content.

### Augmentation Evoker

- Replaced the 12.0.5 manuscript in place with 14 manually authored subjects, ten tips and separate Chronowarden/Scalecommander opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/04-기원사/증강/Meta/guide-12.1.json`.
- Read Blizzard's 12.1 update and September hotfixes; compared Jereico's Wowhead, Saeldur's Icy Veins, Daylea's Method guides and current Korean/English spell effects. Inspected Icy Veins' actual conditional rotation switches rather than merging hidden alternative-build rows.
- Manually updated 78 atomic records: 42 local Augmentation, 34 common and two shared records stored under Devastation. Added 23 records and authored 14 specialization relationships. Restricted the old common Essence Burst relationship to Devastation. Generated DB changes are confined to Evoker.
- Separated Augmentation Essence Burst 396187 from Devastation 359618, Chrono Flame talent/cast 431442/431443, Double-time talent/buff 431874/460688, all three Duplicate nodes and its actual buff. Corrected scopes, base costs/cooldowns, Wingleader's 1.5-second reduction per Augmentation target hit, Mass Eruption targets and conditional resource effects.
- Season 2 notes distinguish Upheaval's 10-second cooldown reduction from the eight-second Fate Mirror damage-copy amount of 45%, not proc chance or healing-copy amount. Official internal set names/icons remain unchanged, with explanatory Korean headings; set effects are passive.
- Hero flows retain different Ebon/Eons opening order. The selected Breath of Eons examples do not also prescribe Deep Breath. Chronowarden's optional Time Skip is not inserted into Scalecommander's Interwoven Threads build. Filler disagreements remain explicit rather than merged.
- Removed the fabricated Augmentation uptime chart. The page reuses the compact wrapping flow and priority renderers, with detailed conditions in native disclosure. The graph centers on Ebon Might with seven actual direct synergy connections.
- Canonical equality, scoped mechanics/identity checks, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for all 42 local notes, 42 numeric common notes and two shared Devastation-path records; explicit guide name/icon checks passed for 22 IDs. Validation of the eight other common notes is not a full mechanics re-audit.
- Verified production bundle `main.3c5ef0ee.js`: both heroes and all three modes at 1440px, 390px and 320px. No page/flow overflow, broken loaded images or console errors appeared in these checks. Native detail disclosure preserves conditions. Spell links are numeric and no Devastation Essence Burst link appears on the Augmentation page.
- Limits: current WCL/Archon aggregates, personal simulations and private Wyrmrest Temple messages were not obtained. Old June usage/DPS values were removed from current metadata. SimC commit `3a32d8195787b3bc098ec7dbf4bcdea542522175` is implementation evidence only. Dense graph labels, generic featured-skill ranking, older common mechanics, 86 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical Markdown/JSON is outside the site Git repository; the commit preserves generated DB and site content.

### Beast Mastery Hunter

- Replaced the 12.0.5 manuscript in place with 14 manually authored subjects, ten tips and separate Pack Leader/Dark Ranger opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/05-사냥꾼/야수/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 update and September hotfixes, current Korean/English tooltips, Wowhead, Azortharion's Icy Veins and Qenjua's Method guides. Used live SimC files at commit `616c7cde89888480dc4e5fb1755567ef97356dfd`, not the PTR APL or a personal simulation result.
- Manually reviewed 87 atomic records: all 42 local Beast Mastery notes and 45 related common notes. Replaced obsolete Bloodshed 321530 with current passive 1272099; separated all three Nature's Ally talents and buff 1276720, Howl talent 471876/effect 471878, actual Wailing Arrow and Death's Wail talent, and Season 2 talent/buff/automatic damage records. Only Hunter spell records changed.
- Corrected base versus talent-adjusted cooldowns/costs, War Orders versus Master Handler reductions, 10-second/70% Beast Cleave versus 20% Kill Cleave, conditional S2 Cobra consumption, passive Frenzy, hero-specific Deathblow and Hunter's Mark. Kill Shot remains Marksmanship-only; Black Arrow retains its actual shared cast ID.
- Authored 14 local synergies and rewrote four relevant common relationships. Removed old June usage/DPS claims and the fabricated uptime chart. The graph centers on Bestial Wrath with six direct authored relationships; internal set icons are not used as cast buttons.
- Fixed the existing canonical synergy builder to preserve `specs`. Non-Hunter synergy changes only add their existing canonical scope field; this is not a re-audit of those mechanics. The existing guide filter now excludes the Sentinel relationship from Beast Mastery.
- Fixed shared `getSynergySkills` so explicit participant IDs remain authoritative. Name-based fallback no longer adds a different Nature's Ally record or cross-spec participants. Runnable checks cover both identical names and an entirely out-of-scope participant list.
- Online strict metadata/name/link checks passed for 42 local and 55 numeric common records, with zero errors/warnings. Ten of the common records received metadata validation only, not a full mechanics re-audit. Explicit guide name/icon checks passed for 17 IDs. Canonical equality, mechanic/scope assertions, all prebuild checks and production build passed on 2026-09-13.
- Inspected both heroes and all three modes at 1440px, 390px and 320px: no document/flow overflow or broken loaded icons appeared. Native condition disclosure works. Final bundle `main.9099c62d.js` was verified; the apex relationship contains six intended participants, Sentinel is absent, spell links are numeric and no console errors appeared.
- Limits: Archon raid and high-key requests returned 403; no current usage/DPS aggregates, personal simulation or private Trueshot Lodge messages were obtained. Wild Thrash's two-target boundary and source disagreements about apex damage and 3/4-stack Cobra consumption remain explicit. Dense graph-label overlaps, older common mechanics, 86 global KB link warnings, mixed-patch metadata and the large bundle still need work. Canonical KB and its builder remain outside the site Git repository; the site commit contains generated DB, guide, renderer and regression changes.

### Marksmanship Hunter

- Replaced the old manuscript in place with 15 manually authored subjects, ten practical tips and separate Sentinel/Dark Ranger opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/05-사냥꾼/사격/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 changes and September hotfixes, current Korean/English tooltips, Azortharion's Wowhead/Icy Veins guides, Qenjua's Method guides and live SimC commit `616c7cde89888480dc4e5fb1755567ef97356dfd`. Wowhead and Icy Veins are not counted as independent authors; author disagreements and access limits remain explicit.
- Manually reviewed 83 atomic records: 58 local Marksmanship and 25 related common records. Removed Double Tap 473370 and unavailable old traits 264198/473379; separated Precise Shots, Trick Shots and Bulletstorm talents from their buffs. Corrected Accuracy By Volume's additional Aimed Shot, Unstable Trigger, all three Take Aim nodes, separate Rapid Fire mark, Death Bringer preparation and Season 2 periodic-event cooldown reduction.
- Moved the actual Moonlight Chakram cast 1264949 to the shared Hunter skill folder, scoped to Marksmanship/Survival, and repaired Survival links without relabeling Survival's old mechanics. Sentinel/common effects retain specialization-specific values and trigger conditions. Removed Pack Leader's Lethal Barbs from the Sentinel relationship.
- Authored 15 local relationships and rewrote the common Sentinel relationship. Removed old June usage/DPS claims and the illustrative uptime chart. Only Hunter records changed in the generated spell/synergy DB.
- Fixed five newly authored set/automatic effects being skipped by using the existing supported Talents/Procs folders, rather than extending the importer. Added runnable checks for all 58 local records, those five passive effects, current spell identities, real hero-specific casts, conditional double Explosive Shot and all 15 relationships.
- Canonical equality, gameplay/scope checks, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for 58 local and 67 common records; explicit guide icon/name checks passed for 24 IDs, all with zero errors/warnings. Common metadata validation is not a full review of all common mechanics.
- Inspected both heroes and all three modes at 1440px, 390px and 320px: no document/flow overflow or broken loaded icons. Native details retain the full use conditions. Final production bundle `main.146c4d1d.js` was verified after removing a duplicate Chakram chip and tightening a patch attribution; all spell hrefs are numeric and no console errors appeared. The graph centers on Aimed Shot with 13 actual authored relationships.
- Limits: current WCL/Archon aggregates, personal simulations and private Trueshot Lodge messages were not obtained. Dense graph-label overlaps (including internal set labels), generic featured-skill selection, older common mechanics, 86 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical KB is outside the site Git repository; the site commit preserves generated DB and authored guide content.

### Survival Hunter

- Replaced the old manuscript in place with 14 manually authored subjects, ten practical tips and separate Sentinel/Pack Leader opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/05-사냥꾼/생존/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 update and September hotfixes, DoolB's Wowhead guide, Azortharion's actual Icy Veins hero/talent/target presets, current Korean/English tooltips and live SimC commit `616c7cde89888480dc4e5fb1755567ef97356dfd`. Method's dated page still prescribed removed Flamefang Pitch; those instructions were explicitly excluded.
- Manually reviewed all 58 local atomic records and authored 16 relationships. Added Survival links to 12 existing shared Hunter notes, with specialization-specific Hogstrider/mark/Chakram explanations. Only Hunter records changed in the generated DB.
- Removed Flamefang Pitch 1251592; separated actual Raptor Swipe 1262293 from all three apex nodes and prepared buff 1273155, Tip talent 260285 from buff 260286, Mongoose Fury and automatic Strike as One effects. Corrected base costs/cooldowns, redesigned traits, current reductions and mastery range.
- Season 2 2pc is 1296636 despite its stale internal 4pc name. The 4pc's fixed 10% effect increase is separate from each Boomstick blast's one-second duration extension. Both remain passive DB records; the graph uses actual Mongoose Fury, not internal set icons.
- Sentinel's short S2 opener and non-Twin-Fangs Pack Leader preparation remain separate. Pack Leader executes its prepared summon with Kill Command after Takedown; Sentinel has its own mark/Chakram conditions. Real casts only, no passive buttons. Removed the illustrative resource/uptime chart.
- Fixed shared text cleanup rewriting preset into a malformed word by matching reset only at a word start; added a runnable regression check. Added Survival canonical equality, spell identity, removed-spell, set-effect, hero-mode and synergy checks.
- All prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for 58 local and 67 shared numeric notes; explicit guide icon/name checks passed for 17 IDs, all with zero errors/warnings. Shared metadata validation is not a full mechanics review of all 67 common notes.
- Verified both heroes and all three modes at 1440px, 390px and 320px: no document/flow overflow or broken loaded icons, and native detail disclosure retains complete conditions. Final bundle `main.6855ff4e.js` was checked after the last wording fixes; spell links are numeric, no console errors appeared, and Wildfire Bomb has nine actual direct synergy connections.
- Limits: current WCL/Archon aggregates, personal simulations and private Trueshot Lodge messages were not obtained. Author/build-specific opener differences remain explicit. Dense graph labels, generic featured-skill duplication, older common mechanics, 86 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical KB is outside the site Git repository; the site commit preserves generated DB and authored guide content.

### Fire Mage

- Replaced the old manuscript in place with 14 manually authored sections, ten practical tips and separate Sunfury/Frostfire opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/06-마법사/화염/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 update and September hotfixes, Preheat's Wowhead guide, Dutchmagoz's actual Icy Veins hero/target presets, Tamir's Method guide and current Korean/English spell tooltips. SimC implementation commit `330bb6ffacb5e8887a0a02c2d8704389c85b59e6` is not a personal simulation result.
- Manually reviewed 53 local atomic notes and 35 related shared notes. Removed obsolete Hyperthermia 383860, added current Al'ar buff 383874, separated Pyroclasm/Heat Shimmer/Fired Up buffs from their talent IDs and retained all three Fired Up nodes. Added passive S2 effects and current barrier talents. Only Mage records changed in the generated DB.
- Rewrote 18 local relationships and two common hero hubs. Corrected Rondurmancy's three-sphere limit, Phoenix-to-Mana-Cascade triggers, Sunfury Meteor's Pyroclasm grant and Frostfire's automatic Comet Storm/Glacial Spike versus real casts. Removed old June usage claims and the fabricated Fire uptime/cooldown chart.
- Retained source differences: current S2 4pc tooltip bonus 25% versus August guide 20%; pure-total AoE at three targets versus practical priority-target compromise at four; Method's inconsistent four/five-target text; August 31 set fix versus older queue-bug warnings. PvP-only nerfs were not applied to PvE.
- Canonical equality, spell identity/mechanics assertions, all prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for 53 local and 64 shared numeric records; explicit guide icon/name checks passed for 19 IDs, with zero errors/warnings. The other shared notes received metadata validation, not a complete mechanics re-audit.
- Verified production bundle `main.9e682b57.js`: both heroes and all three modes at 1440px, 390px and 320px, with no document/flow overflow or broken loaded icons. Native detail disclosure retained complete conditions. The graph centers on Combustion with seven actual direct relationships; no removed Hyperthermia link or console error appeared.
- Limits: current WCL/Archon usage/DPS aggregates, personal simulations and private Altered Time messages were not obtained. Dense graph-label overlaps and similar shared/local hubs, generic featured-skill selection, older common mechanics, 77 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical KB is outside the site Git repository; the site commit preserves generated DB and authored guide content.

### Frost Mage

- Replaced the old manuscript in place with 14 manually authored practical sections, ten tips and separate Spellslinger/Frostfire opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/06-마법사/냉기/Meta/guide-12.1.json`.
- Compared Blizzard's 12.1 update and August 25 hotfixes, Dorovon's current Wowhead rotation/talents, Kuni's Icy Veins, Khaelt's Method and current Korean/English tooltips. Wowhead's stale 11.2.7 hero page was excluded despite its 12.1 navigation label. The Frostfire-specific Ray clipping footnote was checked in the source markup; no rendered guide preset was inspected this turn.
- Manually reviewed all 63 local atomic notes and 17 shared Spellslinger notes. Removed Icy Veins 12472; separated target Freezing, Fingers/Brain Freeze buffs, timed Icicles, prepared Spike/Comet, all three Hand of Frost nodes and its damage buff. Corrected defensive talent ownership, current PvE barrier values and shared specialization-specific effects. Generated spell changes are confined to Mage.
- Authored 18 local relationships and rewrote the common Spellslinger hub. The graph centers on Ice Lance with seven actual direct relationships. Tier relationships show real Icicles/Rapid Refreezing effects instead of internal set icons; passive set records retain official names/icons in the DB. Removed the fabricated Frost uptime chart and old June usage claims.
- Preserved different hero opening orders, no-apex Frostfire's single Ray charge, conditional two-target-plus channel shortening, Rapid Refreezing timing and real proc consumption. The Wowhead 12-stack versus Icy Veins FAQ 10-stack recommendation remains explicit, not merged into a universal threshold. No fixed 4pc proc chance was invented.
- Fixed the shared inline matcher so Korean copulas in names such as Ice Barrier talent descriptions do not link only the shorter base spell. Runnable checks cover complete-name matching, unrelated-word rejection, canonical equality, current spell identities, hero-specific conditions and all 18 relationships.
- All prebuild checks and production build passed on 2026-09-13. Online strict metadata/name/link checks passed for 63 local and 64 numeric common notes; explicit guide icon/name checks passed for 20 IDs, with zero errors/warnings. Other common records received metadata validation only, not a full mechanics re-audit.
- Verified production bundle `main.9ff8fb3b.js` with installed Playwright after the app browser tool failed to initialize: both heroes and three modes at 1440px, 390px and 320px, 18 combinations total. No document/flow overflow or page errors appeared; 18px flow icons and numeric tooltip links remain, native disclosure retains full conditions, and the exact Ice Barrier talent link resolves correctly. Inspected desktop/mobile screenshots; dense graph-label overlaps remain.
- Limits: current WCL/Archon aggregates, personal simulations and private Altered Time messages were not obtained. SimC commit `330bb6ffacb5e8887a0a02c2d8704389c85b59e6` is implementation evidence only. Generic featured-skill selection, older common mechanics, 71 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical KB is outside the site Git repository; the site commit preserves generated DB and authored guide content.

### Brewmaster Monk

- Finished the pending manually authored 15-section guide, with practical defensive decisions, ten tips and separate Shado-Pan/Master of Harmony opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/07-수도사/양조/Meta/guide-12.1.json`.
- Rechecked Blizzard 12.1, the hotfix document through September 17, Wowhead, Icy Veins, Peak of Serenity and Method on September 21. Sinzhu's three publications are one author, not three independent confirmations. Archon raid and M+ remain inaccessible; no current usage/DPS numbers were invented.
- Reviewed 74 local records and related common Monk records, authored 18 local synergies, and regenerated both DB files. The generated changes are confined to Monk. Removed the incorrectly scoped Druid Ironfur record; separated Brewmaster energy Detox from Mistweaver magic Detox and preserved Windwalker's recently updated shared records.
- Corrected 90-second base Celestial Brew/Infusion cooldowns, 4-second Blackout Kick, Stagger versus purification, the three apex nodes, prepared drink versus damage-triggered healing, Season 2 effects and the separate Harmony vitality/Potential Energy resources. Passives, procs and pet damage are not cast steps.
- Replaced the fabricated uptime chart and color-only purification rules with eight authored defensive situations. Existing Stagger ticks can be absorbed; light Stagger is not an unconditional ban on purification when charges would cap.
- Compared current name/icon/tooltip/buff payloads for all 74 local records with the September 13 research capture: no changes. Online strict metadata/name/link checks passed for 74 local and 74 common notes; the guide's 23 explicitly referenced spells passed name/icon checks. Common metadata checks do not imply a fresh mechanics review of every common ability.
- Canonical manuscript equality, gameplay regressions, full prebuild validation and a production build passed on September 21. `node scripts/verify-brewmaster-guide.cjs` passed all 18 hero/mode/viewport combinations at 1440px, 390px and 320px, including keyboard disclosure, numeric tooltip links, loaded icons and horizontal overflow checks.
- Limits: latest WCL/Archon aggregates, personal simulations and private Discord messages were not obtained. Dense graph labels still overlap; 71 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical Markdown/JSON is outside the site Git repository; the site commit includes authored guide content and generated data, not a remote backup of the vault.

### Windwalker Monk

- Updated in commit `54603c63` on September 20, including its canonical guide/KB, generated DB, both hero branches and opener/single-target/AoE modes. The canonical change record distinguishes Season 2 records, all apex nodes, Windwalker-specific Dance of the Wind, specialization resource costs and shared Celestial Conduit/Rushing Wind Kick.
- Removed obsolete Storm, Earth, and Fire and mixed old synergies. The September 1 PvE hotfix remains separate from the 12.1 release changes. Shared Monk changes are preserved by the Brewmaster sync; this status entry does not replace the remaining all-class audit.

### Affliction Warlock

- Replaced the old manuscript in place with 16 manually authored subjects, ten practical tips and separate Soul Harvester/Hellcaller opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/12-흑마법사/고통/Meta/guide-12.1.json`.
- Compared Blizzard 12.1 and September hotfixes, Kalamazi's Wowhead, Motoko's Icy Veins, Ross's Method, current Korean/English tooltips and fixed SimC commit `91eb5c1ea2bba740438e8aa90abf33bdf3474367`. The actual Icy Veins Soul Harvester preset was inspected. Different published opener orders and tooltip/patch-note proc rates remain explicit.
- Manually reviewed 91 atomic notes: all 52 local Affliction records and 39 related shared records, including Shadow Bolt stored under Demonology. Replaced old Unstable Affliction, Seed and Harvest IDs; removed Night's Benefaction/Patient Zero; separated passive Siphon Life, Malefic Grasp talent/cast, apex nodes/damage, Nightfall/Shard Instability buffs and Season 2 effects. Corrected multi-rank values, Gorefiend's class-talent scope and Create Soulwell's current numeric icon.
- Authored 15 local relationships and rewrote the two relevant common hero relationships. Fixed the newly authored participant names to the existing numeric-ID contract after visual inspection exposed missing edges. Unstable Affliction now has ten actual direct relationships; both DB diffs are confined to Warlock. Removed the fabricated uptime chart, old Darkglare extension claims and June usage rates.
- Preserved Soul Harvester's Harvest resource/proc conditions, targeted Hellcaller Wither stacks, conditional Season 2 single-target Seed and separate two-target behavior. Set-triggered Unstable Affliction is not a second paid cast or a second Cull the Weak reduction. Automatic effects are not flow buttons.
- Online strict metadata/name/link checks passed for 52 local and 106 common records, with zero errors/warnings. The other 68 common records received metadata validation only, not a complete mechanics review. Explicit guide name/icon checks passed for 24 IDs. Canonical equality, current cast/proc identities, 15 relationship records and full prebuild validation passed.
- The production build succeeded. `node scripts/verify-affliction-guide.cjs` passed all 18 hero/mode/viewport combinations at 1440px, 390px and 320px, including keyboard disclosure, 16px opener icons, numeric links, current graph center, ten center relationships and horizontal overflow. Reused the existing shared community-source matcher instead of retaining a narrower duplicated regex that rejected the Korean label.
- Limits: current WCL/Archon aggregates, personal simulations and private class Discord messages were not obtained. Graph labels still overlap in dense groups; 57 global KB link warnings, mixed-patch metadata and the large bundle remain. Canonical Markdown/JSON is outside the site Git repository; the site commit contains authored guide content and generated data, not a remote vault backup.

## Demonology Warlock: updated 2026-09-21

- Replaced the old manuscript in place with 14 manually authored subjects, ten practical tips and distinct Soul Harvester/Diabolist opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/12-흑마법사/악마/Meta/guide-12.1.json`.
- Compared Blizzard 12.1 and the September 17 hotfix collection, current Korean/English tooltips, NotWarlock's Wowhead, Motoko's Icy Veins, Sjeletyven's Method and fixed SimC commit `91eb5c1ea2bba740438e8aa90abf33bdf3474367`. Inspected the actual Icy Veins hero presets; did not claim the target toggle was successfully exercised. Author recommendations and later tuning are distinguished from live aggregate statistics.
- Reviewed 85 atomic notes in this change, including 27 additions and 21 shared records. The local Demonology set now contains 65 records, including the Shadow Bolt record already reviewed with Affliction. Removed NPC Demonic Sacrifice 186185. Separated Core buff/passive, Vilefiend and Doom talents, apex nodes/buff, actual Infernal Bolt/Ruination casts, pet commands and automatic Season 2 explosions.
- Preserved fixed three-shard Hand of Guldan, two-shard Demonbolt, hero-specific shard generation, apex rank duration/refund, Tyrant's Dreadstalker extension and current purge/interrupt distinctions. Soul Harvester prepares at most two shards; Diabolist prepares five. Implosion and Power Siphon never share one selected-build flow. Single-target Implosion requires To Hell and Back in these examples.
- Authored 18 local numeric-ID relationships and rewrote the shared Diabolist relationship with correct spec scopes. Hand of Guldan participates in twelve local relationships and is the graph center. Replaced old current-build/source/graph metadata; preserved historical Ragereaver report data. Removed fabricated uptime segments and June usage/DPS claims.
- Strict online name/icon/metadata/link checks passed for all 65 local and 108 common records; the unedited common records received metadata checks, not a fresh full mechanics audit. Explicit guide icon/name checks passed for 24 IDs. Canonical equality, actual cast identity, choice exclusivity, hero preparation and all 18 relationships have regression assertions.
- Full prebuild and sanitized production build passed. `node scripts/verify-demonology-guide.cjs` passed all 18 hero/mode/viewport combinations at 1440px, 390px and 320px, including keyboard disclosure, 16px opener icons, real spell links, twelve center relationships and no horizontal overflow. The browser test distinguishes action labels from explanatory mentions of alternative talents.
- Limits: current WCL/Archon aggregates, personal simulations and private Discord messages were not obtained. Dense graph labels still overlap; 41 global KB link warnings, mixed-patch metadata and the 1.59 MB gzip bundle remain. Canonical Markdown/JSON remains outside the site Git repository; the commit contains the generated DB and site content, not a remote vault backup.

## Destruction Warlock: updated 2026-09-21

- Replaced the old manuscript in place with 15 manually authored subjects, ten practical tips and separate Hellcaller/Diabolist opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/12-흑마법사/파괴/Meta/guide-12.1.json`.
- Compared Blizzard 12.1 and September hotfixes, Loozy's Wowhead, Motoko's actual Icy Veins hero/content/rotation selections, Omnithic's Method, current Korean/English tooltips and fixed SimC commit `91eb5c1ea2bba740438e8aa90abf33bdf3474367`. The current 3-target Diabolist and 4-target Hellcaller Rain of Fire starting points are conditional model/guide advice after the August 25 buff, not measured log thresholds.
- Reviewed all 66 local atomic records, including 22 additions; added five common records and amended eleven existing common notes. Both generated DB diffs are confined to Warlock: 82 changed spell records including 27 additions, and 18 authored local relationships including twelve additions. Usage-only Markdown changes are not all exported by the existing builder.
- Corrected 50% baseline Havoc, guaranteed Conflagration of Chaos crits, passive Dimensional Rift, Soul Fire/Rift choice, Shadowburn execute/free conditions, three apex nodes, Season 2 effects and shared Crashing Chaos charges. Buffs, pet attacks and automatic effects are not player-cast flow steps. Preserved Demonology/Affliction specialization-specific common behavior.
- Cross-check caught and corrected Ruination's summon being confused with Avatar's Overfiend: both live tooltips and the fixed implementation specify a Diabolic Imp. Separate aliases distinguish the crit passive Ruination from the hero cast and the Overfiend's Chaos Bolt from the player's cast. Regression assertions preserve these identities.
- Authored eighteen numeric-ID relationships; Chaos Bolt has twelve actual direct relationships and is the center. Removed the old fabricated resource/uptime chart and June usage claims. Historical Ragereaver reports were not rewritten.
- Online strict name/icon/metadata/link checks passed for 66 local and 113 common notes; explicit guide icon/name checks passed for 22 IDs. Unedited common records received metadata validation, not a fresh full mechanics review. Full prebuild, canonical equality and scoped gameplay assertions passed.
- Sanitized production build succeeded as `main.5e2633e0.js`; credential and forbidden-file output scans passed. `node scripts/verify-destruction-guide.cjs` passed all eighteen hero/mode/viewport combinations locally and again on https://wowmeta.vercel.app at 1440px, 390px and 320px, including keyboard disclosure, 16px opener icons, correctly scoped real casts, inline aliases, graph center and no horizontal overflow. Desktop/mobile screenshots were inspected. Production deployment `dpl_FqnHcKscvvpREiBz7AmF9nLDuae7` is Ready and the public route returns HTTP 200 with the expected bundle.
- Limits: current WCL/Archon aggregates, personal simulations and private Discord messages were not obtained; failed raid/M+ source access is labeled explicitly. Dense graph labels still overlap. There are 28 global KB link warnings, mixed-patch metadata and a 1.61 MB gzip bundle. Canonical KB remains outside the site repository; generated data and site content are committed, not a remote vault backup.

## Protection Paladin: updated 2026-09-21

- Replaced the old manuscript in place with 16 manually authored subjects, ten practical tips and distinct Templar/Lightsmith opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/08-성기사/보호/Meta/guide-12.1.json`.
- Compared Blizzard 12.1 and September hotfixes, Pumps' Wowhead, Panthea's actual Icy Veins hero/content presets, Tactyks' Method, current Korean/English tooltips and fixed SimC commit `3a24b834c907948dadbfab4e3a9883e4d767512a`. Preserved explicit disagreements about Hammer of Light cost, Zealot, Exaction and apex rank values rather than silently reconciling stale descriptions.
- Manually reviewed all 65 local atomic notes and 54 related common records, including 20 local additions. Removed obsolete Sanctified Wrath; separated Sentinel cast/buff, Protection Judgment/Hammer of Wrath, real Hammer of Light and Armament casts, automatic hero effects and Season 2 triggers. Corrected Divine Protection, Judgment, Cleanse Toxins and Spellwarding scopes. Generated spell changes are confined to Paladin.
- Both selected-build flows use Blessed Hammer, Sentinel and the full apex. Alternative Hammer of the Righteous is explained conditionally rather than mixed into those flows. Lightsmith's shared Armament charges, Sentinel-triggered Forge, Guidance spending and Templar generator-based extension have separate explanations. Defensive, healing and interrupt needs are not delayed until the end of a damage priority list.
- Authored eighteen local numeric-ID relationships and corrected three common relationships. Shield of the Righteous has eleven actual direct relationships and is the graph center. Replaced fabricated uptime segments with nine damage-type, recovery and immunity situations. Removed old June aggregate claims from current-build metadata without rewriting historical reports.
- Online strict name/icon/metadata/link checks passed for all 65 local and 72 common records; the other 18 common records received metadata checks only, not a fresh full mechanics review. Explicit guide icon/name validation passed for 22 IDs. Canonical equality, actual cast identity, selected-build exclusivity, defensive values, scopes and relationship counts have runnable assertions. Fixed the existing practical-tip matcher spelling of Korean Mythic+ and added a regression assertion.
- Full real-site prebuild validation and sanitized production build passed. Bundle `main.f07d9fee.js` contains no matched local credential values, source maps or environment files. `node scripts/verify-protection-paladin-guide.cjs` passed all eighteen hero/mode/viewport combinations locally and on https://wowmeta.vercel.app at 1440px, 390px and 320px, including keyboard disclosure, 16px opener icons, scoped casts, loaded flow images, eleven center relationships and no horizontal overflow. Deployment `dpl_7k2SesAc81g5pmpAN44WS2WnAXTY` is Ready.
- Limits: current WCL/Archon aggregates, personal simulations and private Discord messages were not obtained. Dense graph labels still overlap. There are 23 global KB link warnings, mixed-patch metadata and a 1.63 MB gzip bundle. Canonical Markdown/JSON remains outside the site Git repository; this commit contains generated DB and site content, not a remote vault backup.

## Retribution Paladin: updated 2026-09-21

- Replaced the old manuscript in place with 15 manually authored subjects, twelve practical tips and distinct Herald/Templar opener, single-target and AoE modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/08-성기사/징벌/Meta/guide-12.1.json`.
- Compared Blizzard 12.1 and hotfixes, Bolas' Wowhead and actual Icy Veins hero/content/rotation presets, Seqq's Method, current Korean/English tooltips and fixed SimC commit `e9a81d3415d317e1fadb961dfdcb0decd34c525f`. Wowhead and Icy Veins share an author and are not counted as independent evidence. Current aggregates and private Discord posts were not obtained.
- Manually reviewed all 69 local atomic records, including 22 additions and the Art of War replacement 267344 -> 406064. Rewrote seventeen shared Herald records and amended related common/Templar records while preserving Protection-specific values. Both generated DB diffs are confined to Paladin; the other 39 manuscripts are unchanged.
- Separated Shield of Vengeance's automatic buff from Divine Protection, Divine Purpose talent/buff, actual Hammer of Light from its damage event, three Arbiter spender buffs, Season 2 triggers and passive Crusading Strikes. Divine Toll now has its proper Retribution scope and Judgment modifier without pretending it unlocks Hammer of Light.
- Preserved Herald's opening Empyrean Legacy activation, Hammer of Wrath's automatic Blade, conditional four-piece spender alternation and Templar's Wake -> Hammer sequence. Execution Sentence and Radiant Glory are not falsely marked as an exclusive choice. Source disagreements about 60 versus 50 Deliverance stacks, tooltip attack-speed wording, Arbiter priorities and the effective Avenging Wrath cooldown remain explicit.
- Authored 23 scoped numeric-ID relationships, ten directly involving Final Verdict. Fixed their missing singular spec field to the existing builder contract before accepting the graph. Removed the fabricated cooldown/uptime charts; historical Coiled Altar report data remains unchanged.
- Online strict metadata/name/link checks passed for all 69 local and 72 common notes, with zero errors/warnings. Unedited common records received metadata checks, not a fresh mechanics audit. Explicit guide name/icon validation passed for 21 IDs. Canonical equality, cast/choice/set identities, all relationships and full real-site prebuild passed. Copy validation now excludes official names such as Empyrean Power without also hiding a genuinely awkward window translation on the same line; runnable assertions cover both cases.
- Sanitized production build succeeded as `main.46875866.js`; credential, environment-file and source-map scans passed. `node scripts/verify-retribution-guide.cjs` passed all eighteen hero/mode/viewport combinations locally and on https://wowmeta.vercel.app at 1440px, 390px and 320px, including seven-step openers, keyboard disclosure, 16px icons, numeric current casts, ten center relationships and no horizontal overflow. Desktop/mobile screenshots were inspected. Production deployment `dpl_GfbH5T5fa1Xutuz9wFQqhPZAQ29b` is Ready and the public route returns HTTP 200 with the expected bundle.
- Limits: current WCL/Archon aggregate data, personal simulations and private Discord messages were not obtained. Shared Holy Judgment still needs its own re-audit. Dense graph labels overlap; 23 global KB link warnings, mixed-patch metadata and the 1.65 MB gzip bundle remain. Canonical Markdown/JSON is outside the site repository; the commit contains generated DB and site content, not a remote vault backup.

## Discipline Priest: updated 2026-09-21

- Replaced the 12.0.5 manuscript in place with 17 manually authored subjects, twelve practical tips and separate Voidweaver/Oracle preparation, single-person rescue and group-healing modes. Canonical source: `../WoW-Meta-Knowledge/08-직업별-Knowledge-Base/09-사제/수양/Meta/guide-12.1.json`. The other 39 manuscripts are unchanged.
- Compared Blizzard's 12.1 update and August 18/September 1 hotfixes, AutomaticJak's Wowhead, Clandon's public Icy Veins and Grafe's Method guides, current Korean/English tooltips and fixed SimC commit `e9a81d3415d317e1fadb961dfdcb0decd34c525f`. Raid Voidweaver/M+ Oracle recommendations are author advice, not measured usage rates. Private Warcraft Priests discussions and current Archon aggregates were not obtained.
- Manually rewrote/reviewed all 62 local atomic notes and 62 related common records. Separated Shadow Mend's talent and real cast, Atonement's passive and applied buff, all three apex nodes, Void Shield uses/reflection, Season 2 effects and Discipline/Shadow Mindbender. Removed obsolete IDs 110744, 214621, 1252215 and 123040 from current data. Generated DB changes are confined to Priest; historical log reports remain unchanged.
- A mechanics review after metadata checks caught and corrected Inner Focus's critical-chance bonus, Occultist's Shadow damage/healing modifier, Greater Smite's Smite trigger, Blaze of Light's damage-only modifier, per-bolt Painful Punishment and Mass Dispel's allied dispel count. Name/icon checks alone did not establish these effects. Set-effect names/icons retain the official API's untranslated internal values, with Korean explanatory document headings.
- Authored 21 local numeric-ID relationships and five related common relationships. Atonement is the center with eleven actual direct relationships. Removed fabricated uptime segments and replaced the old specialist chart with eight authored healing/defensive situations; Barrier and Ultimate Penitence remain alternatives, not simultaneous casts. Added healing-specific tab labels using the existing renderer's fallback, and fixed narrow-screen tabs so they no longer require horizontal dragging.
- Online strict name/icon/metadata/link checks passed for 62 local and 75 common notes, plus a separate online name/icon check for eight referenced Class-Talents notes. Fixed the additional Resonant Energy icon mismatch found in common metadata; its older Holy/Shadow mechanics still need re-audit. Explicit guide icon/name checks passed for 25 spell IDs. Canonical equality, scope/identity/mechanic assertions, all 40-guide validations and the full real-site prebuild passed.
- Sanitized production build succeeded as `main.275c2d58.js`. The new deployment staging folder contains only the six generated public files, with no matched local credential values, environment files or source maps. Local and production browser checks passed all eighteen hero/mode/viewport combinations at 1440px, 390px and 320px, including 16px opener icons, mode/hero spell identity, no document/chart/tab overflow and no broken loaded chart images. Keyboard disclosure and the eleven-connection graph center were checked locally; desktop/mobile screenshots were inspected. Production deployment `dpl_BBjy1wTkCzLXyhjx5Qkg9DWj8QFP` is Ready and the public route and icon asset return HTTP 200.
- Limits: no current WCL/Archon aggregate, personal healing simulation or private Discord evidence is claimed. Dense graph-label layout, older shared Holy/Shadow mechanics, fifteen global broken-link warnings, eight non-Korean guide-URL warnings, mixed-patch metadata and the 1.67 MB gzip bundle remain. Canonical Markdown/JSON remains outside the site Git repository; this commit preserves generated DB and site content, not a remote vault backup.

## Shadow Priest: KB, manuscript and production updated 2026-09-21

- Manually rewrote 51 existing atomic records and added 17 records separating real casts, passives, automatic damage, buffs and Season 2 set effects. Removed obsolete local Mindbender 200174 and Phantom Menace 1242779; current passive Mindbender remains 1230339.
- Rewrote nineteen shared Archon notes with distinct Holy/Shadow effects, corrected Shadow's Void Torrent rift trigger, added Shadow to Death's Torment scope and removed retired Concentrated Infusion 453844. Corrected ten local relationships and removed Void Torrent from the shared Archon participants.
- Regenerated both DBs. Strict online name/icon/link validation passed for all 68 local Shadow and 74 common Priest records. The whole Priest check additionally found pre-existing Holy Last Word/Resonant Healing name and deleted Renew-link errors; these are not silently reported as passing.
- Replaced the manuscript in place with 14 subjects, twelve tips and separate Archon/Voidweaver opener/single-target/AoE modes. Canonical JSON equality and cast/hero-identity checks pass. Removed the fabricated resource and uptime charts. Fixed shared copy normalization that changed the official talent name Power Compression, with a runnable regression check.
- Local browser checks covered eighteen hero/mode/viewport combinations at 1440px, 390px and 320px with no document/control overflow or broken loaded images. Desktop and mobile screenshots were inspected; opener icons are 14px. These local checks are not production verification.
- Latest real-site prebuild passed after KB metadata revisions: all forty manuscript/chart/tooltip checks, translation checks and offline KB validation. Twenty-three existing KB warnings remain.
- Sanitized production build main.d6b7479c.js passed; the fresh deployment stage has six public files, no environment files/source maps and no matched local credential values. Deployment dpl_4Gr3RD9La1uoeq2p8y4uvvrFXKTb is Ready. Public browser checks passed eighteen hero/mode/viewport combinations at 1440px, 390px and 320px with correct selected modes, no page overflow or broken loaded chart images, and no captured console errors. Mobile rendering was inspected.
- Sources already inspected: Blizzard 12.1, current Korean/English tooltips, all four actual Icy Veins rotation presets, Method's August 27 guide and fixed SimC implementation. Current aggregate logs were inaccessible; June usage percentages were removed from current KB recommendations. Source disagreements about normal versus set-granted Volley priority and stale implementation values must remain explicit in the manuscript.
- Regression check: `node scripts/verify-shadow-kb.cjs`. Canonical KB is outside the site Git repository; the site commit preserves generated DB and site content, not a remote vault backup. Dense graph labels, older shared mechanics and the 1.69 MB gzip bundle remain separate work.

## Assassination Rogue: chronological review history, 2026-09-21

- Read current Wowhead Whispyr (September 6), Icy Veins rotation/overview and Method Whispyr guides. The direct Blizzard patch-note request returned 403; do not claim direct access from the guide's quotation.
- Manually checked Korean/English tooltips for Implacable 1265385/1265386/1265387 and Crimson Tempest 1247227. Replaced copied generic apex prose with the distinct effects and corrected Tempest's energy cost, radius, generator identity and two-secondary-target bleed copying.
- The old manuscript's deliberate Envenom-expiration energy advice contradicts the current first apex node. The full replacement is not yet written. Other open issues include Shiv hero/build conditions, Deathmark's current multiplier, direct versus copied Rupture/Internal Bleeding, and automatic versus manual Tea choice nodes.
- Online name/icon/link checks passed for 46 local atomic notes; this is not mechanics validation of all 46. The four manually reviewed records have a scoped runnable check in scripts/verify-assassination-kb.cjs. Source conflicts and remaining work are recorded in the canonical Meta/review-12.1.md.
- At the first pass, generated skill data was synchronized while the manuscript remained 12.0.5. The core guide has since been replaced and deployed as recorded at the top; the following passes are historical progress, not the current rollout status.
- Second pass: manually reviewed seven more core casts and four talents, bringing the reviewed atomic subset to fifteen. Corrected Garrote's base cooldown, cast energy costs/radii, Deathmark's 75% modifier versus double poison application, its gradual energy recovery, Kingsbane's stacking cap, Internal Bleeding's direct-cast trigger and Iron Wire's conditional silence.
- Dashing Scoundrel's current Korean and English tooltips agree on 8% weapon-poison critical chance, unlike the launch summary's 10%; the discrepancy is recorded instead of silently combining values. Rewrote the Deathmark/Kingsbane relationship with eight verified participants and an authored explanation.
- Used the existing explicit description-section convention so these fifteen effects, rather than only their Markdown headings, reach generated DB descriptions. Expanded runnable checks cover mechanics and that data transfer. The rest of the vault's title-only descriptions remain a global audit item.

- Third pass: independently checked Korean/English Poison Bomb, Path of Blood and Doomblade tooltips, replaced generic prose and narrowed note links to concrete interactions. Eighteen atomic effects now have scoped DB checks. Talent availability and build recommendations are separate unfinished checks: current tooltip existence is not sufficient evidence. The full manuscript and production deployment remain pending.

- Fourth pass: authored twelve further talent effects and shared Ambush (previously mislabeled Outlaw-only), bringing the reviewed subset to thirty Assassination notes plus one shared cast. Replaced the builder and Caustic Spatter relationships with seven and four grounded participants. Intent to Kill is movement cooldown reduction, not combo-point generation; Caustic Spatter is a ten-second one-target Nature splash, not bleed copying. Documented Sanguine Stratagem's Korean/English threshold wording conflict. Scoped regression checks now cover 31 records and three relationships; full hero flows, talent-tree availability and manuscript replacement remain open.

- Fifth pass: fixed SimC commit 774babde5ddc7c5fc9f1abb129b473f8a076df70 identifies game build 12.1.0.69875. Removed seven absent legacy talents and their relationship references. Reviewed nine further existing effects, corrected Deadly/Amplifying Poison to 1.5-second coating casts, distinguished rank-one values and resolved Improved Garrote's conditional damage and Dragon-Tempered Blades' multiplicative application reduction. The existing reviewed set is now 39 local notes plus shared Ambush; eleven newly identified spec-tree nodes and common/hero coverage still need authoring. Removed the obsolete Indiscriminate Carnage instruction from the old manuscript without falsely relabeling the rest as 12.1.

- Sixth pass: added eleven missing current spec talents with verified Korean names/icons and individually authored effects. Fixed-tree Assassination spec rows (45) now all resolve in the generated DB; this is coverage evidence, not proof of complete build/hero review. Rewrote Envenom's relationship to separate poison stacks, active-buff refresh rewards, mutually exclusive choices and Implacable energy. Current Motivated Murderer tooltips say 20%, not the launch summary's 30%. Scoped review covers 51 atomic records and four relationships. Common/hero nodes, full manuscript, flows and production rollout remain unfinished.

- Seventh pass: reviewed six shared hero effects and added Mark for Death 1293340 from the parent tooltip's direct link. Distinguished Darkest Night's five-point activation minimum from maximum-point recommendations, its Assassination/Subtlety modifiers, and Deal Fate's spec-specific triggers. Rewrote both Assassination hero relationships, removed the Fatebound-only Delivered Doom node from Deathstalker and stopped using June popularity as current advice. Scoped checks cover 58 atomic records and six relationships; remaining shared/hero notes and the full manuscript/production rollout are still open.

## Previously labeled 12.1, not yet re-audited in this rollout

Devourer Demon Hunter, Arcane Mage, Balance Druid, Devastation Evoker, Mistweaver Monk, Elemental Shaman, Holy Priest, Restoration Druid, Holy Paladin, Preservation Evoker.

## Still 12.0.5: 7 manuscripts

| Class | Specializations |
| --- | --- |
| Rogue | Outlaw, Subtlety |
| Shaman | Enhancement, Restoration |
| Warrior | Protection, Arms, Fury |

## Remaining gates

- Shared flow layout simplified on 2026-09-13: small inline icon/name/arrow steps wrap without dedicated numbered tiles; complete use conditions remain in native disclosure. Feral, Augmentation, Beast Mastery, Marksmanship, Survival, Fire and Frost Mage now have separately authored opener/single-target/AoE modes for both heroes; the other guides still need verified mode content, not copies of one priority list.
- Complete fresh manual research and KB/DB/guide updates for the 7 older manuscripts, and finish the outstanding Assassination coverage noted above.
- Re-audit the ten previously labeled 12.1 manuscripts against current sources rather than assuming their labels prove freshness.
- Recheck shared and older atomic notes, current talent availability, base versus talent-adjusted cooldowns, hero-specific flows and source disagreements.
- Replace any remaining placeholder chart content; inspect each specialization's rendered flow and graph rather than extrapolating from Blood.
- Resolve existing global KB link warnings and mixed-patch metadata when the underlying records are genuinely updated. Do not bulk relabel them to suppress warnings.
- Finish scoped visual checks, builds and commit/push for each verified batch. Production is now https://wowmeta.vercel.app; deployment uses sanitized static build output, not the source directory with local credentials. A Git push alone does not prove a new Vercel deployment, and wowmeta.xyz remains a separate domain.
## 2026-10-08 재개: 준비 원고 통합과 후속 조정

- 이전 t1~t3의 원고 25개를 사이트에 통합했다. 황폐·조화·정기 및 운무의 중복 정의를 제거해 최종 화면 내용과 검사 대상이 일치한다. 40개 가이드는 각각 한 번만 정의되고 정본 JSON 37개가 사이트와 일치한다.
- 미착수였던 t4의 12개는 공식 후속 조정·PvE/PvP 구분을 부분 갱신했다. 사격의 교묘한 사격 75%, 생존 폭탄의 주 대상 50%와 주기 피해 상향 누락 수정, 보호·징벌·풍운의 9월 조정을 포함한다. 최신 로그·모든 효과를 다시 검수한 완료본으로 승격하지 않았다.
- 미국 10월 6일 적용 공지를 반영했다. 부정 역병내림 100%, 포식·잠행·고양의 후속 상향과 양조·운무 조정을 구별한다. 한국어 공지는 10월 2일판까지 확인했으므로 한국 서버의 실제 적용 시각은 별도 확인 대상이다. 양조 빠른 한 모금·허초와 역병내림의 한국어 툴팁은 공식 적용값과 충돌하며 원문을 보존했다.
- 신성 성기사·운무는 각각 두 영웅의 준비·단일 구조·다중 회복, 총 12개 상황을 작성했다. 두 가이드의 extraSkills를 제거하고 정화·헌신의 오라를 정본에 추가했다. 공용 주문의 신성 범위와 운무 두 치유 효과를 교정했으며 신성 사제 로그의 낡은 특성 이름도 공식 ID 링크로 바꿨다.
- 전체 원고·차트·툴팁·번역 검사와 새 회귀 검사 통과. 온라인 가이드 아이콘 대조는 40개·721주문, 오류와 경고 모두 0. 기존 도적·암흑·고양·복원 검사에서 실제 평가 객체를 읽도록 취약한 형식·참조 동일성 검사를 고쳤다.
- 남은 필수 기준: 수호 드루이드·정기·비전·복원 주술사 영웅별 세 상황, 모든 가이드의 단일·쐐기·레이드 특성 견본 문자열과 현재 연결·포인트 검증, 조정 후 최신 로그 비교, 나머지 원자 노트·출처 충돌과 KB 링크 경고의 실질 검수. 구조 검사를 전체 최신 메타 검수 완료율로 환산하지 않는다.
- 검증 기록: `artifacts/goal-12.1-resume-20261008/`. 공식 근거: https://news.blizzard.com/en-gb/article/24296142/hotfixes-october-6-2026 , 현재 SimC `db768b52b425db274e4ebd3ce3d5efc26c8882b5` / 12.1.0.69933 / 핫픽스 2026-10-07.
- 최종 온라인 대조: KB 2,988개 오류 0, 기존 경고 38. 신성 성기사 세트 2개의 이름을 한국어 페이지의 공식 영어 표기로 교정하고 설명을 한국어 원문으로 맞춘 뒤 해당 전문화 45개도 오류·경고 0으로 재확인했다. 생성 DB에 제목이 설명으로 들어가는 문제는 KB의 `## 설명` 구획으로 고쳤고 회귀 검사로 보호한다. 혼합 패치 메타데이터 경고 3,401개는 원자 노트의 실제 검수 후 정리할 대상이며 라벨을 일괄 바꾸지 않았다.
- 공개 검증: https://wowmeta.vercel.app 에서 40개 전문화의 제목·아이콘·가로 넘침과 새 번들 `main.a9d185bb.js`를 직접 확인했다. 기존 목록 검사는 320/390/768/1024/1440px 통과, 경로·스크롤 검사는 390/1440px 통과, 보호 성기사의 두 영웅×세 상황은 320/390/1440px 통과. 신성 성기사·운무 영웅 선택과 단일·다중 회복 화면도 직접 확인했다. 일부 화면 검사를 전체 최신 로그·특성 검수 완료로 해석하지 않는다.
- 배포: `.env` 입력과 소스맵을 제외한 정적 파일 6개만 업로드한 Vercel 배포 `dpl_FpNiSo4w5pPfeTCci2LVTQNpc5WD`를 운영으로 승격했다. KB 정본을 저장하고 생성 DB와 사이트 변경을 함께 커밋·푸시했으며 기존 사용자 변경 파일은 커밋 범위에서 제외한다.
