# react_yunkyung

TAVE React 스터디 1주차 과제 — React 투두리스트

## 실행

```bash
npm install
npm run dev   # http://localhost:5173
```

## 구조

```
src/
├── App.jsx                  todos 상태 관리, 자식에게 props로 전달
└── components/
    ├── TextInput.jsx        할 일 입력 (글자 수 표시, 20자 제한, Enter/버튼으로 추가)
    ├── TaskList.jsx         할 일 목록 (완료 토글 → 취소선, 삭제)
    └── UserProfile.jsx      Random User API 호출 + 새로고침
```

---

# TAVE React 스터디 2주차 과제

React 투두리스트 → **To-Do-List** (달력 기반)

- 1주차: 추가 / 완료 토글 / 삭제, 글자 수 제한
- 2주차: 수정 모드, 카테고리, 정렬, 필터 탭, React Router 페이지 분리
- 추가: 달력 첫 화면, 날짜별 할 일, 세부사항(메모)

## 화면 흐름

1. **첫 화면(`/`)** — 월 달력. 오늘은 배경색, 선택한 날은 테두리로 강조되고, 할 일이 있는 날은 남은 개수(다 끝냈으면 ✓)가 표시된다.
2. **날짜 클릭** — 달력 아래에 그날 제목과 보라색 **할 일 입력하기** 버튼이 나타난다.
3. **할 일 입력하기** — 버튼 자리에 입력 폼(내용 + 카테고리 + 추가 / 닫기)이 열린다. 추가 후에도 폼이 열려 있어 연속 입력 가능.
4. **목록** — 버튼 아래에 그날의 할 일이 쌓인다. 
   - 한 줄: 체크박스 / 제목 / 카테고리 뱃지 / 휴지통 아이콘
   - 전체 / 미완료 / 완료 탭으로 걸러 보기
5. **제목 클릭 → 상세(`/todos/:id`)** — 날짜·상태·카테고리·생성일·**세부사항**을 보고, `수정`으로 내용/세부사항/날짜/카테고리를 고친다.
6. **설정(`/settings`)** — 새 할 일의 기본 카테고리, 목록 기본 정렬, 완료 항목/전체 삭제.

## 구조

```
src/
├── main.jsx                    BrowserRouter로 App 감싸기
├── App.jsx                     todos / settings 상태 관리 + Routes 정의
├── constants.js                카테고리·정렬·탭 목록, 기본 설정값
├── utils/
│   ├── todo.js                 filterTodos / sortTodos / countByStatus / countByDate (순수 함수)
│   └── date.js                 'YYYY-MM-DD' 변환·검증, 달력 칸 계산
├── pages/
│   ├── MainPage.jsx            /            달력 + 선택한 날의 할 일 (?date=YYYY-MM-DD&month=YYYY-MM)
│   ├── TodoDetailPage.jsx      /todos/:id   useParams로 개별 todo 조회, useNavigate로 이동
│   └── SettingsPage.jsx        /settings    새 할 일 기본값, 완료 항목/전체 삭제
└── components/
    ├── Layout.jsx              공통 헤더(NavLink) + <Outlet/>
    ├── Calendar.jsx            월 달력 (이전/다음 달, 오늘)
    ├── CalendarDay.jsx         달력 한 칸 (오늘/선택/주말 표시, 남은 개수 뱃지)
    ├── DayTodos.jsx            선택한 날: 입력하기 버튼 ↔ 입력 폼, 탭 + 목록 (정렬은 설정의 기본 정렬)
    ├── TextField.jsx           글자 수 카운트가 붙은 input (ref를 prop으로 받음)
    ├── TextInput.jsx           새 할 일 입력 폼 (텍스트 + 카테고리, 닫기)
    ├── FilterTabs.jsx          전체 / 미완료 / 완료 탭
    ├── TodoToolbar.jsx         카테고리 필터 + 정렬 select (현재 화면에서는 사용하지 않음)
    ├── TaskList.jsx            목록 (비어 있으면 안내 문구)
    ├── TaskItem.jsx            한 줄 항목 (체크 / 제목 → 상세 / 휴지통 아이콘 삭제)
    ├── TrashIcon.jsx           휴지통 SVG 아이콘
    └── TaskEditForm.jsx        편집 폼 (내용·세부사항·날짜·카테고리, 저장 / 취소 / Esc)
```

### 데이터 모델

```js
{ id, text, memo, done, category, date, createdAt }
// memo: 세부사항 (여러 줄, 최대 500자, 상세 페이지에서 작성)
// date: 'YYYY-MM-DD' (로컬 기준, toISOString()은 UTC라 쓰지 않음)
// category: '공부' | '일정' | '시험'
```

### 상태는 어디에 두었나

| 상태 | 위치 | 이유 |
|---|---|---|
| `todos`, `settings` | `App` | 메인/상세/설정 세 페이지가 모두 같은 데이터를 봐야 해서 `Routes` 위로 올림 |
| 선택한 날짜 / 보고 있는 달 | URL `?date=` `&month=` (`useSearchParams`) | 새로고침하거나 상세 페이지에서 뒤로 와도 같은 날짜·달이 유지됨 |
| `isAdding` (입력 폼 열림) | `DayTodos` | 버튼 ↔ 폼 전환은 그 영역만의 관심사. `key={dateKey}`라 날짜를 바꾸면 자동으로 닫힘 |
| `tab` | `DayTodos` | "어떻게 보여줄지"는 목록 영역만의 관심사 |
| `isEditing` | `TodoDetailPage` | 항목 하나가 편집 중인지는 그 항목만 알면 됨 |
| `draft` (편집 중 임시값) | `TaskEditForm` | 저장 전엔 todos에 반영하면 안 되고, 취소 시 컴포넌트가 언마운트되며 자연스럽게 버려짐 |

필터링/정렬된 목록(`visibleTodos`)과 탭별 개수(`counts`)는 state로 두지 않고 `todos`에서 매 렌더마다 계산하는 **derived state**다. state로 뒀다면 todos가 바뀔 때마다 동기화하는 effect가 필요했을 것이다.

## 기능

### 달력 & 날짜별 할 일
- `utils/date.js`: 날짜는 `'YYYY-MM-DD'` 문자열로 저장/비교하고, 계산할 때만 `Date`로 바꾼다. `toISOString()`은 UTC라 한국 시간 새벽에 하루 전 날짜가 나오므로 로컬 기준으로 직접 만든다
- `buildMonthGrid()`: 1일 앞/말일 뒤 빈칸을 `null`로 채운 7의 배수 길이 배열 → `grid-template-columns: repeat(7, 1fr)`로 그대로 렌더링
- 달력 칸의 개수 뱃지는 `countByDate(todos)`로 매 렌더 계산 (derived state)
- 선택한 날짜 / 보고 있는 달은 `useSearchParams`로 URL에 둔다 → 새로고침·뒤로가기에도 유지. 달/날짜 이동은 `{ replace: true }`로 방문 기록을 쌓지 않음
- `<DayTodos key={dateKey} />` — 날짜가 바뀌면 컴포넌트가 새로 마운트되어 입력 폼/탭 state가 자동 초기화 (effect로 리셋하지 않음)

### 할 일 입력하기
- `isAdding` state로 보라색 버튼 ↔ 입력 폼을 조건부 렌더링
- 폼이 열리면 `autoFocus`, 추가 후에는 `inputRef.current.focus()`로 연속 입력

### 수정 & 세부사항
- 목록에서 제목 클릭 → 상세 페이지 → `수정` 버튼 → `isEditing = true` → `TaskEditForm`으로 교체 (input ↔ text 조건부 렌더링)
- 폼에서 내용(20자) / 세부사항(`textarea`, 500자) / 날짜 / 카테고리 수정. 글자 수 초과 시 저장 버튼 비활성화
- 저장: 유효성 검사 통과 시 `onUpdate(id, changes)` 호출 후 편집 모드 종료
- 취소 / Esc: 편집 모드만 종료 (draft는 컴포넌트와 함께 사라짐)
- 세부사항은 `white-space: pre-wrap`으로 줄바꿈을 그대로 보여주고, 비어 있으면 흐린 안내 문구

### 카테고리
- 공부 / 일정 / 시험. 입력 폼의 `select`로 고르고 todo에 `category` 필드로 저장, 목록에 뱃지로 표시
- `filterTodos()`는 카테고리 조건도 지원하지만(`filter()` 사용), 현재 화면에서는 카테고리 필터 UI(`TodoToolbar`)를 쓰지 않는다

### 목록 한 줄
- 체크 / 제목 / 카테고리 / 휴지통 아이콘만 두어 간결하게 유지
- 휴지통은 `TrashIcon.jsx` 인라인 SVG(`stroke="currentColor"`) — 라이브러리 없이 버튼 색을 따라가고, 아이콘만 있는 버튼이라 `aria-label` / `title`로 이름을 붙임
- 미완료 항목은 `.task:not(.done) .task-text`에 `var(--text-h)` → 다크 모드 흰색 / 라이트 모드 진한 검정

### 정렬
- 정렬 기준: 최신순 / 오래된순 / 가나다순 (설정 페이지의 기본 정렬)
- `sortTodos()`가 `.toSorted()`로 **새 배열**을 만들어 반환 (원본 todos 불변)

### 필터 탭
- 전체 / 미완료 / 완료 탭, 활성 탭은 `tab` state
- 각 탭에 개수 표시 (`countByStatus`)

### React Router
```jsx
<Routes>
  <Route element={<Layout />}>          {/* 헤더 공유, <Outlet/> */}
    <Route index element={<MainPage />} />
    <Route path="todos/:id" element={<TodoDetailPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```
- `useParams()`로 받은 `id`는 **문자열**이라 `Number(id)`로 변환해서 `find`
- 없는 id면 "찾을 수 없습니다" 안내 + 목록 링크
- 달력 칸 클릭 → `setSearchParams({ date })`로 URL만 바꾸고 아래 목록이 그날로 바뀜 (날짜를 안 골랐거나 잘못된 날짜 `2026-02-30`이면 목록 영역을 숨김)
- 상세에서 삭제하면 `useNavigate()`로 그날 목록(`/?date=...`)으로 이동, `뒤로` 버튼은 `navigate(-1)`
- 헤더는 `NavLink`라 현재 페이지에 자동으로 `active` 클래스가 붙음
- 새로고침해도 상세 페이지가 비지 않도록 todos를 localStorage에 저장 (lazy initializer로 읽고, effect로 씀 — 외부 시스템 동기화라 effect가 맞는 자리)

---

## 과제 룰 체크

- **DOM 직접 조작 금지** — `document.querySelector`, `classList` 없음. 유일한 DOM 접근은 `inputRef.current.focus()`이며 ref를 통해 React가 관리하는 노드에 접근
- **상태 기반 선언형 UI** — 달력 선택, 입력 폼 열림, 편집/보기, 탭, 정렬, 빈 목록 전부 state(또는 URL) → 렌더로 표현
- **컴포넌트 분리** — 페이지 3개 + 컴포넌트 12개, 필터/정렬 로직은 `utils/todo.js` 순수 함수로 분리
- **불변성** — 모든 todos 업데이트는 `map` / `filter` / spread / `toSorted`로 새 값 생성



---

# TAVE React 스터디 5주차 과제

To-Do-List **성능 최적화** — Profiler로 리렌더링 측정, memo / useMemo / useCallback, 코드 스플리팅(lazy + Suspense), useTransition, 번들 분석

## 실행

```bash
npm run dev       # 개발 서버 — React DevTools Profiler로 측정
npm run analyze   # 빌드 + dist/stats.html (번들 트리맵)
```

## 요구사항 체크

| 요구사항 | 구현 | 위치 |
|---|---|---|
| Profiler로 리렌더 원인 확인 | ✅ 상호작용 5가지 측정, 원인별 정리 | 아래 [측정 결과](#측정-결과) |
| 불필요한 렌더링 찾기 | ✅ TaskItem 11개 / 달력 31칸 / 카드 40장 / 카드 제목 40개 | 〃 |
| React.memo 적용 | ✅ 측정에서 낭비가 보인 3곳만 | `TaskItem`, `CalendarDay`, `board/KanbanCard` |
| useMemo 적용 | ✅ Context value (state / actions / filter 분리) | `state/*Provider.jsx`, `board/BoardProvider.jsx` |
| useCallback 적용 | ✅ memo(CalendarDay) 31칸에 넘기는 `selectDate` | `pages/MainPage.jsx` |
| React.lazy로 컴포넌트 분리 | ✅ 카드 모달 — 카드를 처음 누를 때 로드 | `pages/BoardPage.jsx` |
| Suspense 적용 | ✅ `Layout`의 `<Outlet />`(헤더 유지), 모달 자리 | `components/Layout.jsx`, `pages/BoardPage.jsx` |
| 페이지별 번들 분리 | ✅ 보드 / 상세 / 설정 페이지 lazy (첫 화면 달력은 바로) | `App.jsx` |
| useTransition — 검색 / 필터 | ✅ 보드 검색창 + 카테고리 필터 | `board/BoardSearch.jsx`, `board/BoardProvider.jsx` |
| non-urgent 업데이트 분리 | ✅ 입력창 값(급함) ↔ 카드 목록 필터(transition) | 〃 |
| bundle analyzer 사용 | ✅ `rollup-plugin-visualizer` → 쓰지 않는 zustand 발견 / 제거 | `vite.config.js` |
| barrel import 제거 | ✅ `react-router-dom`(= `export * from "react-router"`) → `react-router` | 8개 파일, `package.json` |
| (선택) TanStack Query | — 이번에는 하지 않음 | |

## 화면에서 달라진 점

- 보드 위에 **카드 검색창**과 **카테고리 필터**가 생겼다. 제목 / 세부사항에서 찾고, 계산 중에는 보드가 살짝 흐려진다
- 보드 / 상세 / 설정 페이지에 처음 들어갈 때 잠깐 "불러오는 중…"이 보일 수 있다 (페이지 코드를 그때 받아 옴). 헤더는 그대로
- 그 밖의 동작은 4주차와 같다 — 최적화는 **보이는 결과는 그대로, 렌더링 횟수만** 줄이는 작업

## 측정 결과

할 일 40개(오늘 10개)를 넣고, 상호작용 하나에 **렌더링된 컴포넌트 수**를 셌다 (Profiler와 같은 방식: React가 커밋할 때 실제로 렌더링된 컴포넌트).

| 상호작용 | 전 | 후 | 원인 → 해결 |
|---|---|---|---|
| 메인: 할 일 1개 체크 | 79회 (TaskItem 11, CalendarDay 31) | **11회** (TaskItem 1, CalendarDay 1) | todos가 든 Context를 버튼까지 구독 → Context 분리 + `memo(TaskItem)` / 달력 칸에 새 객체·새 함수 → 원시값 props + `memo` + `useCallback` |
| 메인: 날짜 선택 | 47회 (CalendarDay 31) | **18회** (CalendarDay 2) | 부모 렌더링 + 칸마다 새 `onSelect` 함수 → `memo(CalendarDay)` + `useCallback` |
| 메인: 입력창에 한 글자 | 2회 | 2회 | 이미 최소 — 손대지 않음 |
| 보드: 카드 1장 이동 | 261회 (카드 40장 × 조각 5개) | **18회** (카드 1장) | `moveTodo`만 쓰는 버튼이 todos Context 구독 → Context 분리 + `memo(KanbanCard)` |
| 보드: 모달 열기 | 50회 (Card.Title 40) | **12회** (Card.Title 0) | `openCard`만 쓰는 카드 제목이 `selectedId` Context 구독 → Board Context 3개로 분리 |

**과정에서 찾은 것**
- memo를 건 뒤 다시 측정했더니 할 일 체크 시 **달력 20칸이 여전히 렌더링**됐다. `countByDate`가 날짜마다 새 `{ all, done }` 객체를 만들기 때문 → 객체 대신 숫자 두 개(`total`, `done`)를 넘겨 해결
- 그러자 `countMap`을 감쌌던 `useMemo`가 필요 없어져서 **뺐다** (숫자 props라 Map이 새로 생겨도 memo가 동작)
- `setSearchParams`는 URL이 바뀔 때마다 새 함수라 `useCallback`이 소용없었다 → 같은 페이지에서 바뀌지 않는 `navigate` 사용

**직접 확인하기 (React DevTools Profiler)**
1. ⚙ → Profiler → "Record why each component rendered while profiling" 켜기
2. 녹화 → 위 상호작용 하나 → 정지 → Flamegraph에서 칠해진 `TaskItem` / `CalendarDay` / `KanbanCard` 수와 "Why did this render?" 확인

## 번들 결과

```
전 (chunk 1개)                               후 (chunk 6개)
index.js  285.35 kB │ gzip 90.31 kB          index.js           275.64 kB │ gzip 88.31 kB  ← 첫 화면
                                             BoardPage.js         5.22 kB │ gzip  1.89 kB
                                             CardModal.js         2.80 kB │ gzip  1.21 kB
                                             TodoDetailPage.js    1.92 kB │ gzip  0.86 kB
                                             TaskEditForm.js      1.43 kB │ gzip  0.80 kB  ← 모달·상세 공용
                                             SettingsPage.js      1.24 kB │ gzip  0.63 kB
```

| analyzer로 본 것 | 전 | 후 |
|---|---|---|
| zustand (Context 모드 빌드) | 포함 1.7 kB | **빠짐** — `todosStore.js`의 top-level `subscribe()`(side effect) 때문에 번들러가 못 지웠음 → 구독을 Provider의 `useEffect`로 옮기고 `create`에 `/* @__PURE__ */` |
| react-router | 92.7 kB | 92.6 kB — barrel 제거로 크기는 거의 그대로 (빌드 시 트리 셰이킹이 이미 처리). 개발 서버 로딩과 import 명확성 개선 |
| react-dom | 524.2 kB | 524.2 kB — 첫 화면 JS의 대부분. 앱 코드가 작아 스플리팅으로 줄어든 양(약 10 kB)은 크지 않다 |

(analyzer 표의 크기는 minify 전 크기)

## 구조

```
src/
├── App.jsx                         MainPage만 바로, Board / TodoDetail / Settings는 lazy
├── state/
│   ├── TodosContext.js             TodosStateContext({ todos }) + TodosActionsContext({ actions, meta })
│   │                               useTodosState() / useTodoActions() / useTodosMeta() / useTodosContext()
│   ├── ReducerTodosProvider.jsx    두 Context에 각각 useMemo한 value
│   ├── ZustandTodosProvider.jsx    〃 + 저장 구독을 useEffect 안에서
│   └── todosStore.js               side effect 없음 (/* @__PURE__ */ create)
├── pages/
│   ├── MainPage.jsx                selectDate = useCallback(navigate …)
│   └── BoardPage.jsx               BoardSearch + lazy(CardModal) + CardModalSlot
└── components/
    ├── Layout.jsx                  <Suspense>로 <Outlet /> 감싸기
    ├── TaskItem.jsx                memo, useTodoActions()
    ├── CalendarDay.jsx             memo, props = dateKey / total / done / onSelect
    └── board/
        ├── BoardContext.js         BoardState({ selectedId, isPending }) / BoardFilter({ filter }) / BoardActions
        ├── BoardProvider.jsx       useTransition — applyFilter = startTransition(setFilter)
        ├── BoardSearch.jsx         입력창 값(draft)은 바로, 목록 필터는 applyFilter로
        ├── KanbanCard.jsx          memo — Card 조각 조립
        └── Column.jsx              useBoardFilter()로 검색 결과 적용
```

## 과제 룰 체크

- **무분별한 memo 사용 금지** — memo는 측정에서 낭비가 보인 `TaskItem`, `CalendarDay`, `KanbanCard` 3곳만. 입력창(이미 2회), 컬럼(3개, 매번 실제로 바뀜)에는 걸지 않았고, 필요 없어진 `countMap`의 useMemo는 뺐다
- **Profiler 기반으로 최적화** — 측정 → 원인 → 수정 → 재측정. 재측정으로 "memo를 걸었는데도 20칸이 렌더링되는" 문제를 찾아 고쳤다
- **코드 스플리팅 최소 1회 적용** — 라우트 3개 + 컴포넌트 1개 → chunk 6개
- **barrel import 금지** — `react-router-dom` 제거, 프로젝트에 재수출(`index.js`) 파일 없음
- **검증** — `npm run lint` / `npm run build` 통과 (Context / Zustand 두 모드). 헤드리스 Chrome에서 카드 이동, lazy 모달 열기 / 수정 / ESC / 바깥 클릭, 검색 + 카테고리 필터, lazy 페이지(설정 / 상세) 진입, Zustand 모드 저장 / 새로고침 유지를 직접 실행해 확인
