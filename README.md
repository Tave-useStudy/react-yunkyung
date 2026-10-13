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

# TAVE React 스터디 3주차 과제

To-Do-List를 **데이터 기반 구조**로 개선 — useReducer, 데이터 영속화, Custom Hook, API 연동, 로딩/에러 처리

## 요구사항 체크

| 요구사항 | 구현 | 위치 |
|---|---|---|
| useState → useReducer 전환 | ✅ `useState` + 조작 함수 6개 → `todosReducer` 하나 | `src/reducers/todosReducer.js` |
| CRUD 액션 통합 | ✅ `added` / `toggled` / `updated` / `deleted` / `cleared_done` / `cleared_all` / `imported` | 〃 |
| localStorage 저장 / 불러오기 | ✅ `{ version, data }` 형식, 예전 형식(v1) 자동 변환 | `src/utils/storage.js` |
| 새로고침 유지 | ✅ 할 일 + **설정도** 유지 (2주차에는 설정이 새로고침하면 초기화됐음) | `useTodos`, `useLocalStorage` |
| useLocalStorage 구현 | ✅ `useState`처럼 쓰는 저장 Hook | `src/hooks/useLocalStorage.js` |
| 로직 분리 | ✅ 할 일 데이터 → `useTodos`, API 요청 상태 → `useApiTodos` | `src/hooks/` |
| API 연동 | ✅ JSONPlaceholder `/todos` + `/users` | `src/api/todos.js` |
| 로딩 스피너 | ✅ | `src/components/ApiImport.jsx` |
| 에러 메시지 | ✅ 네트워크 오류 / 서버 응답 오류 구분 | 〃 |
| 재시도 버튼 | ✅ | 〃 |
| (선택) TanStack Query | — 이번에는 하지 않음 | |

## 화면에서 달라진 점

- 날짜를 누르면 보라색 **할 일 입력하기** 버튼 아래에 **API에서 할 일 10개 불러오기** 버튼이 생긴다
- 누르면 → 스피너 + "할 일을 불러오는 중..." → 선택한 날짜에 10개 추가 + "10개를 가져왔어요."
- 다시 누르면 **이미 가져온 항목은 빼고 다음 10개**를 가져온다. 200개를 다 가져오면 "더 가져올 할 일이 없어요."
- 실패하면 "불러오지 못했어요. 네트워크에 연결할 수 없어요." + **다시 시도** 버튼
- API 할 일은 카테고리 `일정`, 제목이 길면 20자로 줄이고 **전체 제목 · 작성자 이름 · 출처**는 세부사항에 저장

## 구조

```
src/
├── App.jsx                     라우팅만 (useTodos / useLocalStorage 호출)
├── api/
│   └── todos.js                fetchApiTodos — 요청, res.ok 확인, 응답 → 앱 데이터 모양으로 변환
├── reducers/
│   └── todosReducer.js         todos의 모든 변경(CRUD + import)을 한곳에서
├── hooks/
│   ├── useTodos.js             useReducer + localStorage 저장 + 액션 함수 (id·시간 생성)
│   ├── useLocalStorage.js      useState처럼 쓰는 저장 Hook (설정에 사용)
│   └── useApiTodos.js          API 요청 상태 (idle / loading / success / error) + 요청 취소
├── utils/
│   └── storage.js              readStorage / writeStorage — { version, data } 형식, 예전 형식 변환
└── components/
    └── ApiImport.jsx           불러오기 버튼 / 스피너 / 결과 / 에러 + 다시 시도
```

```
Component (화면)          →  Custom Hook (로직)          →  State / 외부 시스템
─────────────────────────────────────────────────────────────────────────────
App                       →  useTodos                    →  useReducer(todosReducer) + localStorage
App                       →  useLocalStorage('settings') →  useState + localStorage
ApiImport                 →  useApiTodos                 →  useState(status) + fetch(api/todos.js)
```

### 데이터 모델

```js
{ id, text, memo, done, category, date, createdAt, sourceId? }
// id: crypto.randomUUID() (2주차까지 만든 할 일은 숫자 id 그대로)
// sourceId: API에서 가져온 할 일만 — JSONPlaceholder의 id (중복 방지용)
```

## 과제 예시 코드를 그대로 쓰면 안 되는 이유와 바꾼 방법

```jsx
// 과제의 "이렇게 하면 안 되는" 예시
useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/todos')
    .then((res) => res.json())
    .then((data) => setTodos(data.slice(0, 10)));
}, []);
```

| 문제 | 무슨 일이 생기나 | 바꾼 방법 |
|---|---|---|
| 로딩 / 에러 상태 없음 | 요청 중엔 빈 화면, 실패하면 그대로 멈춤 | `status: 'idle' \| 'loading' \| 'success' \| 'error'` → 스피너 / 에러 + 재시도 |
| `res.ok` 확인 없음 | 404·500 응답도 `.json()`으로 넘어가 이상한 데이터가 들어감 | `if (!res.ok) throw new Error(...)` |
| 취소 / 경쟁 처리 없음 | 먼저 보낸 요청이 늦게 오면 최신 결과를 덮어씀, StrictMode에선 두 번 요청 | `AbortController` — 새 요청 전 이전 요청 취소, 화면에서 사라지면 취소 |
| `setTodos(data)` 로 덮어쓰기 | 저장해 둔 내 할 일이 전부 사라짐 | `imported` 액션으로 **기존 목록에 추가**, `sourceId`로 중복 제거 |
| 응답 모양 그대로 사용 | `title` / `completed` ↔ 앱은 `text` / `done` / `date` / `category` | `api/todos.js`에서 변환, `useTodos.importTodos`에서 앱 데이터로 |
| effect에서 요청 | "화면이 뜨면 무조건 요청" — 사용자가 원하지 않아도 매번 호출 | **버튼 클릭(이벤트)** 에서 요청 |
| 컴포넌트 안에 fetch + state | 다른 곳에서 재사용 불가, 컴포넌트가 비대해짐 | `api/`(요청) · `useApiTodos`(상태) · `ApiImport`(화면)로 분리 |

---

## 과제 룰 체크

- **Effect 남용 금지** — effect는 3개뿐이고 모두 외부 시스템과의 동기화다: 할 일 저장(`useTodos`), 설정 저장(`useLocalStorage`), 화면에서 사라질 때 요청 취소(`useApiTodos`). API 요청은 effect가 아니라 **버튼 클릭**에서 보낸다
- **파생 상태 금지** — 결과 문구, 날짜별 목록, 탭 개수, 달력 뱃지 모두 렌더링 중 계산. 로딩/에러는 `status` 하나로
- **불변성 유지** — reducer의 모든 분기가 `map` / `filter` / spread로 새 배열을 만들고, 변화가 없으면 기존 배열을 그대로 반환
- **custom hook 분리** — `useTodos`(데이터), `useLocalStorage`(저장), `useApiTodos`(요청 상태). reducer는 순수 함수라 `id` / `Date.now()`는 Hook에서 만들어 action에 담는다
- **검증** — `npm run build` / `npm run lint` 통과. reducer 분기, v1 → v2 저장 형식 변환, 깨진 JSON, 실제 API 호출(이어서 가져오기 / 전부 가져온 경우 / 요청 취소)을 Node에서 직접 실행해 확인



---

# TAVE React 스터디 4주차 과제

To-Do-List에 **Kanban 보드**를 추가하면서 컴포넌트 구조 설계와 상태 관리 방식을 개선 — Context, Composition(compound component), Modal, Zustand 비교

## 실행

```bash
npm run dev          # Context + useReducer (기본)
npm run dev:zustand  # Zustand로 교체 — 화면 아래에 "상태 관리: Zustand" 표시
```

## 요구사항 체크

| 요구사항 | 구현 | 위치 |
|---|---|---|
| 프로젝트 선택 | ✅ Kanban 보드 (기존 투두리스트에 `/board` 페이지 추가) | `src/pages/BoardPage.jsx` |
| Board / Column / Card 구조 설계 | ✅ `Board`(배치) → `Column`(상태별 묶음) → `Card`(한 장) | `src/components/board/` |
| 역할 기반 컴포넌트 분리 / 계층 구조 | ✅ 데이터(`state/`) · 보드 UI 상태(`BoardProvider`) · 화면 조각(`Column.*`, `Card.*`) 분리 | 〃 |
| children 활용 | ✅ `Board`, `Column.Footer`, `Card.Actions`, `Modal.Body` / `Modal.Footer` | 〃, `src/components/Modal.jsx` |
| compound component 설계 | ✅ `Column.*`, `Card.*`, `Modal.*` — Root가 Context로 값 공유 | `Column.jsx`, `Card.jsx`, `Modal.jsx` |
| 재사용 가능한 구조 | ✅ 범용 `Modal`, 기존 `TaskEditForm` / `TextInput`을 모달·보드에서 재사용 | |
| Context API로 먼저 구현 | ✅ `TodosContext` + `useReducer` | `src/state/ReducerTodosProvider.jsx` |
| Zustand 또는 Jotai로 리팩토링 | ✅ Zustand — 컴포넌트 수정 없이 Provider만 교체 | `src/state/todosStore.js`, `ZustandTodosProvider.jsx` |
| 상태 공유 구조 비교 | ✅ 아래 [Context vs Zustand vs Jotai](#context-vs-zustand-vs-jotai) | `실습 코드 정리.md` 4주차 7번 |
| props drilling 해결 | ✅ `TodosContext` / `SettingsContext` — `App`이 페이지에 넘기는 props 0개 | `src/state/` |
| 카드 상태 이동 | ✅ 할 일 → 진행 중 → 완료 (`← 이전` / `다음 →` 버튼, 모달의 상태 버튼) | `Card.MoveBack` / `Card.MoveForward`, reducer `moved` |
| Modal 상세 보기 / 수정 | ✅ 카드 제목 클릭 → 상세, 수정 / 삭제 / 상태 변경 | `src/components/board/CardModal.jsx` |
| 열기 / 닫기 상태 관리 | ✅ 열린 카드 id 하나(`selectedId`)로 관리, ESC / 바깥 클릭 / 닫기 버튼 | `src/components/board/BoardProvider.jsx` |
| React Router / 멀티 페이지 | ✅ `/board` 추가 (달력 / 보드 / 상세 / 설정) | `src/App.jsx`, `src/components/Layout.jsx` |

## 화면에서 달라진 점

- 상단 메뉴에 **보드**가 생겼다. 할 일 / 진행 중 / 완료 3개 컬럼에 모든 할 일이 카드로 나온다
- 카드의 **`진행 중 →`**, **`← 할 일`** 버튼으로 옆 컬럼으로 옮긴다 (첫 / 마지막 컬럼에서는 한쪽 버튼만)
- **할 일** 컬럼 아래 **+ 카드 추가**로 오늘 날짜의 할 일을 바로 추가한다
- 카드 제목을 누르면 **모달**이 열린다 — 상태 변경 버튼, 날짜 / 카테고리 / 세부사항, **수정** / **삭제** / **상세 페이지** / **닫기**
- 모달에서 수정하면 기존 상세 페이지와 같은 수정 폼이 나온다. 수정 중 ESC는 모달을 닫지 않고 수정만 취소한다
- 달력 화면에서 체크한 할 일은 보드의 **완료**로, 보드에서 완료로 옮긴 카드는 달력에서 체크된 상태로 보인다 (같은 데이터)
- 화면 맨 아래에 지금 쓰는 상태 관리 방식이 표시된다 (`Context + useReducer` / `Zustand`)

## 구조

```
src/
├── main.jsx                        TodosProvider > SettingsProvider > App
├── App.jsx                         라우팅만 — 페이지에 props를 넘기지 않는다
├── state/
│   ├── TodosContext.js             createContext + useTodosContext()  — { state, actions, meta }
│   ├── TodosProvider.jsx           VITE_STATE에 따라 아래 둘 중 하나를 고른다
│   ├── ReducerTodosProvider.jsx    구현 1: useTodos(useReducer) → Context
│   ├── ZustandTodosProvider.jsx    구현 2: useTodosStore → Context
│   ├── todosStore.js               Zustand store (todosReducer 재사용, subscribe로 저장)
│   ├── todoActions.js              createTodoActions(dispatch) — 두 구현이 공유
│   ├── todosStorage.js             loadTodos / saveTodos — 저장 형식 v3 + 마이그레이션
│   ├── SettingsContext.js          createContext + useSettings()
│   └── SettingsProvider.jsx        useLocalStorage('settings') → Context
├── pages/
│   └── BoardPage.jsx               Board / Column / Card 조립 + CardModal
└── components/
    ├── Modal.jsx                   범용 모달 (Root / Title / Body / Footer / Close), <dialog> 사용
    └── board/
        ├── Board.jsx               컬럼 배치 틀 (children)
        ├── BoardContext.js         useBoard() — { selectedId, openCard, closeCard }
        ├── BoardProvider.jsx       모달 열린 카드 id state
        ├── Column.jsx              Root / Header / Cards / Footer
        ├── ColumnContext.js        useColumn() — { status, label, cards }
        ├── Card.jsx                Root / Title / Meta / Actions / MoveBack / MoveForward
        ├── AddCardForm.jsx         컬럼에 카드 추가 (TextInput 재사용)
        └── CardModal.jsx           CardDetailView / CardEditView
```

```
BoardPage
 └─ BoardProvider                         (selectedId)
     ├─ Board
     │   ├─ Column.Root status="todo"     (ColumnContext: 이 상태의 cards)
     │   │   ├─ Column.Header             제목 + 개수
     │   │   ├─ Column.Cards
     │   │   │   └─ Card.Root ×N          (CardContext: todo)
     │   │   │       ├─ Card.Title        → openCard(id)
     │   │   │       ├─ Card.Meta
     │   │   │       └─ Card.Actions
     │   │   │           ├─ Card.MoveBack
     │   │   │           └─ Card.MoveForward
     │   │   └─ Column.Footer
     │   │       └─ AddCardForm
     │   ├─ Column.Root status="doing"    (Footer 없음)
     │   └─ Column.Root status="done"     (Footer 없음)
     └─ CardModal
         └─ Modal.Root open={선택된 카드가 있나}
             └─ CardDetailView | CardEditView
```

### 데이터 모델

```js
{ id, text, memo, done, status, category, date, createdAt, sourceId? }
// status: 'todo' | 'doing' | 'done'  ← 4주차 추가
// done은 기존 화면(체크박스, 완료 필터, 달력 ✓)용 — 항상 status === 'done'과 같다
```

- 상태가 3개라 `done`(true / false)만으로는 표현할 수 없어 `status`를 추가했다
- `done`과 `status`를 함께 바꾸는 곳은 reducer(`toggled`, `moved`) 한 곳뿐이다
- 저장 형식을 **v3**로 올렸다. 3주차에 저장한 데이터(v2)와 그 이전 데이터(v1)는 처음 불러올 때 `done`을 보고 `status`를 채운다

### props drilling — 전 / 후

```
3주차                                              4주차
App (useTodos)                                     main.jsx: <TodosProvider><SettingsProvider><App/>
 └─ MainPage   todos settings onAdd onImport        App          (props 없음)
               onToggle onDelete                     └─ MainPage  useTodosContext().state
     └─ DayTodos  (같은 6개)                              └─ DayTodos  useTodosContext(), useSettings()
         └─ TaskList   onToggle onDelete  ← 전달만            └─ TaskList  todos만
             └─ TaskItem  onToggle onDelete                      └─ TaskItem  useTodosContext().actions
```

### Context vs Zustand vs Jotai

| | Context + useReducer | Zustand | Jotai |
|---|---|---|---|
| state 위치 | React 트리 안 (Provider) | React 밖 store 하나 | atom 여러 개 |
| Provider | 필요 | 필요 없음 | 선택 |
| 구독 단위 | Context 값 전체 | selector로 고른 값 | atom 하나 |
| 값이 바뀌면 | 그 Context를 쓰는 컴포넌트 **전부** 리렌더 | 고른 값이 바뀐 컴포넌트만 | 그 atom을 쓰는 컴포넌트만 |
| 잘 맞는 상황 | 자주 안 바뀌는 값 (설정, 테마) | 큰 state 하나 + action들 | 독립적인 작은 state가 많을 때 |

- 할 일 데이터는 "배열 하나 + 그걸 바꾸는 action들"이라 **store 하나에 3주차 `todosReducer`를 그대로 쓸 수 있는 Zustand**를 골랐다 (Jotai는 비교만)
- 두 구현이 `todosReducer` · `createTodoActions` · `todosStorage`를 공유한다 → 달라지는 건 **state를 어디에 두느냐**뿐
- 이번 Zustand 버전은 컴포넌트를 바꾸지 않으려고 store를 다시 Context로 감쌌기 때문에 **리렌더링 범위는 Context 버전과 같다.** selector의 이점을 쓰려면 컴포넌트가 `useTodosStore`를 직접 구독해야 하고, 그러면 컴포넌트가 Zustand에 묶인다 — **교체 쉬움 vs 세밀한 구독**의 트레이드오프

---

## 과제 룰 체크

- **Context API 먼저** — `ReducerTodosProvider`가 기본 구현이고, Zustand는 같은 인터페이스로 교체한 두 번째 구현이다
- **props drilling 제거** — `App`이 페이지에 넘기는 props 0개. `TaskList`처럼 전달만 하던 컴포넌트는 더 이상 조작 함수를 받지 않는다
- **Context 범위 최소화** — 앱 전체가 쓰는 할 일 / 설정만 `main.jsx`에, 보드 UI state는 `BoardPage`에만
- **state 최소화** — 모달 열림 여부와 선택된 카드를 따로 두지 않고 `selectedId` 하나로 표현. 컬럼별 카드 목록은 `todos`에서 렌더링 중 계산
- **불변성 유지** — 새 `moved` 액션도 `map`으로 새 배열을 만들고, 이미 그 상태면 기존 배열을 그대로 반환
- **재사용** — 수정 폼(`TaskEditForm`), 입력 폼(`TextInput`), reducer / 저장 로직을 새 화면과 Zustand 구현이 그대로 쓴다
- **검증** — `npm run lint` / `npm run build`(두 모드) 통과. Context / Zustand 모드 각각에서 v2 → v3 저장 형식 변환, reducer `moved` / `toggled`의 `done`·`status` 동기화, 보드의 컬럼·카드 배치, 기존 달력 / 상세 / 설정 페이지 렌더링을 Node에서 직접 실행해 확인


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
