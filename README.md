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

## agent-skills 적용 정리

### 1. `rerender-functional-setstate.md` — 배열 state는 functional update로

**문제 (내 코드)**
설정 페이지의 "완료한 할 일 삭제"를 처음엔 이렇게 썼다.

```jsx
const clearDone = () => {
  setTodos(todos.filter((t) => !t.done));
};
```

`todos`를 클로저로 캡처하기 때문에, 한 핸들러 안에서 여러 번 호출되거나 비동기 콜백(`setTimeout`, fetch 이후)에서 호출되면 **오래된 todos를 기준으로** 계산해서 방금 추가된 항목이 사라질 수 있다. 예를 들어 `setTodos([...todos, a]); setTodos([...todos, b]);`는 `a`가 사라지고 `b`만 남는다.

**적용한 rule**
이전 값에 의존하는 업데이트는 전부 `setTodos((prev) => ...)`.

**결과**
```jsx
const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));
const updateTodo = (id, changes) =>
  setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
```
`App.jsx`의 add / toggle / update / delete / clearDone 모두 `prev` 기반. 어떤 순서로 호출돼도 항상 최신 배열에서 시작하고, 이 함수들이 `todos`에 의존하지 않으니 나중에 `useCallback`으로 감싸도 의존성이 비어 있어 안정적이다.

### 2. `rerender-move-effect-to-event.md` — 제출 로직은 effect가 아니라 이벤트에서

**문제 (내 코드)**
편집 저장을 "저장됨 플래그를 켜면 effect가 반응한다"는 식으로 짜봤다.

```jsx
const [submitted, setSubmitted] = useState(false);
useEffect(() => {
  if (!submitted) return;
  onSave(draft);
  setIsEditing(false);
  setSubmitted(false);
}, [submitted]);
```

렌더가 한 번 더 돌고 나서야 저장되고, `draft`가 effect 의존성에 빠져 있어 stale 값이 저장될 수 있으며, 무엇보다 "사용자가 저장 버튼을 눌렀다"는 명확한 이벤트가 있는데 state 변화로 우회하고 있다.

**적용한 rule**
사용자 행동에 대한 응답은 그 행동의 이벤트 핸들러에서 바로 처리. effect는 외부 시스템과 동기화할 때만.

**결과**
```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  if (isInvalid) return;
  onSave({ ...draft, text: trimmed, memo: draft.memo.trim() });   // TaskEditForm
};
```
같은 이유로 "상태가 바뀌면 다른 state를 리셋"하는 effect도 쓰지 않았다.
- 설정의 기본 카테고리를 입력 폼에 반영할 때 `useEffect(() => setCategory(settings.defaultCategory), [settings])` 대신 `<TextInput key={settings.defaultCategory} />`로 **key를 바꿔서 리셋**
- 달력에서 날짜를 바꿀 때 입력 폼/탭을 닫는 것도 `<DayTodos key={dateKey} />`로 처리

불필요한 렌더 한 번이 사라지고, 흐름이 "클릭 → 저장" 한 줄로 읽힌다. 남은 effect는 localStorage 동기화(`App.jsx`) 하나뿐이고 외부 시스템과의 동기화다.

### 3. `rendering-conditional-render.md` — `&&`의 함정과 올바른 분기

**문제 (내 코드)**
탭에 개수를 붙이면서 이렇게 썼다.

```jsx
{counts.done && <span className="tab-count">{counts.done}</span>}
```

완료 항목이 0개일 때 `0 && ...`은 `0`으로 평가되고, React는 `0`을 **텍스트로 렌더링**해서 화면에 `0`이 찍힌다. `false`/`null`/`undefined`만 무시되고 숫자 0과 빈 문자열은 무시되지 않는다.

**적용한 rule**
- 값이 boolean이 아닐 수 있으면 `&&` 대신 삼항(`? : null`) 사용
- 두 분기의 구조가 완전히 다르면 early return으로 컴포넌트 자체를 분기

**결과**
```jsx
// TextField.jsx — 삼항
{isOverLimit ? <p className="warning">...</p> : null}

// TodoDetailPage.jsx — 구조가 다른 분기는 early return
if (isEditing) {
  return <section className="detail"><TaskEditForm ... /></section>;
}
return <section className="detail">...상세 정보...</section>;
```
탭 개수는 항상 표시하는 게 UX상 낫다고 판단해 조건 자체를 없앴다. 목록/빈 안내, 입력하기 버튼/폼, 세부사항/빈 안내처럼 둘 중 하나를 보여주는 곳은 모두 삼항으로 처리했다. 편집/보기 모드를 early return으로 나누니 JSX 안에 중첩 삼항이 없어져서 각 모드가 어떤 마크업인지 한눈에 보인다.

### 4. `js-early-exit.md` — 유효성 검사와 분기 단순화

**문제 (내 코드)**
상세 페이지에서 todo를 못 찾은 경우와 편집 모드를 한 JSX 안에 중첩 삼항으로 처리하려 했다.

```jsx
return (
  <section>
    {todo ? (
      isEditing ? <TaskEditForm ... /> : <div>...상세...</div>
    ) : (
      <p>찾을 수 없습니다</p>
    )}
  </section>
);
```

들여쓰기가 깊어지고, 아래쪽 정상 케이스 코드가 `todo`가 있는지 확신하기 어렵다.

**적용한 rule**
예외/특수 케이스를 먼저 `return`으로 내보내고, 남은 코드는 정상 케이스만 다룬다. 필터 조건도 "해당 안 되면 바로 `return false`".

**결과**
```jsx
// TodoDetailPage.jsx
if (!todo) return <NotFound />;
if (isEditing) return <EditView />;
return <DetailView />;

// utils/todo.js
return todos.filter((todo) => {
  if (tab === 'active' && todo.done) return false;
  if (tab === 'done' && !todo.done) return false;
  if (category !== CATEGORY_ALL && todo.category !== category) return false;
  return true;
});
```
`handleSubmit`도 `if (isInvalid) return;` 한 줄로 시작해서 그 아래는 "유효한 입력"만 가정하고 쓴다. 조건이 늘어나도 `if ... return false` 한 줄씩만 추가하면 된다.

### 5. `js-tosorted-immutable.md` — `.sort()` vs `.toSorted()`

**문제 (내 코드)**
정렬 기능을 붙이면서 처음엔 `todos.sort(compare)`를 렌더 중에 호출했다.

```jsx
const sorted = todos.sort((a, b) => b.createdAt - a.createdAt);
```

`.sort()`는 **원본 배열을 제자리에서 정렬**한다. 즉 state로 들고 있는 `todos` 배열 자체가 렌더 중에 바뀐다. 참조는 그대로라 React는 변경을 감지하지 못하고, 정렬 기준을 바꿔도 이전 정렬 결과가 섞여 들어오는 등 예측하기 어려운 동작이 된다. 렌더 함수는 순수해야 한다는 원칙도 깨진다.

**적용한 rule**
정렬된 **새 배열**을 반환하는 `.toSorted()` 사용. (같은 계열: `.toReversed()`, `.toSpliced()`, `.with()`)

**결과**
```js
export function sortTodos(todos, sortBy) {
  const compare = COMPARATORS[sortBy];
  if (!compare) return todos;
  return todos.toSorted(compare);
}
```
`todos`는 절대 변하지 않고 `visibleTodos`만 새로 만들어진다. 정렬 기준을 바꿔도 필터/탭 결과에 영향이 없고, 상세 페이지에서 보는 `todos`도 항상 입력 순서 그대로다. (`[...todos].sort()`로도 되지만 복사 의도가 `.toSorted()`가 더 명확하다.)

### 6. `react19-no-forwardref.md` — ref를 일반 prop으로

**문제 (내 코드)**
"추가" 버튼을 클릭해서 할 일을 넣으면 포커스가 버튼에 남아서 연속 입력이 불편했다. 입력 폼 안의 `<input>`을 재사용 컴포넌트(`TextField`)로 뽑아내고 나니 부모에서 ref로 포커스를 줄 방법이 필요했고, 예전 방식대로 `forwardRef`를 쓰려 했다.

```jsx
const TextField = forwardRef(function TextField(props, ref) { ... });
```

**적용한 rule**
React 19부터 함수 컴포넌트는 `ref`를 다른 prop과 똑같이 받는다. `forwardRef`는 필요 없고, 앞으로 deprecated 예정.

**결과**
```jsx
// TextField.jsx
function TextField({ ref, maxLength, value, onChange, ...rest }) {
  return <input ref={ref} ... />;
}

// TextInput.jsx
const inputRef = useRef(null);
const handleSubmit = (e) => {
  ...
  onAdd({ text: trimmed, category });
  setText('');
  inputRef.current?.focus();   // 이벤트 핸들러 안에서 처리 (rule 2와 연결)
};
<TextField ref={inputRef} ... />
```
래퍼 함수와 import가 사라져 컴포넌트가 평범한 함수로 읽힌다. 포커스 이동도 effect가 아니라 submit 이벤트 안에서 끝낸다. 편집 폼은 마운트 시 한 번만 포커스하면 되므로 ref 대신 선언적인 `autoFocus`를 썼다.

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

## agent-skills 적용 정리

### 1. `async-parallel` — 서로 기다릴 필요 없는 요청은 동시에

**문제 (내 코드)**
할 일에 작성자 이름을 붙이려고 `/todos`와 `/users`를 차례로 불렀다.

```js
const todos = await fetchJson('/todos');
const users = await fetchJson('/users');   // todos가 끝나야 시작
```

두 요청은 서로의 결과가 필요 없는데도 순서대로 기다려서 **걸리는 시간이 두 요청의 합**이 된다.

**적용한 rule**
독립적인 비동기 작업은 한꺼번에 시작하고, 결과가 필요할 때 기다린다.

**결과**
```js
// src/api/todos.js
const usersPromise = fetchJson('/users', signal).catch(() => []);   // 먼저 시작만
const apiTodos = await fetchJson('/todos', signal);                 // 동시에 진행
...
const users = await usersPromise;
```
두 요청이 동시에 날아가서 전체 시간이 **둘 중 긴 쪽**으로 줄었다. 작성자 이름은 부가 정보라 `/users`가 실패해도 `.catch(() => [])`로 할 일 가져오기는 계속된다.

### 2. `async-defer-await` — 필요할 때까지 await를 미룬다

**문제 (내 코드)**
위처럼 동시에 시작한 뒤에도 `Promise.all`로 둘 다 기다리면, 이미 200개를 다 가져와서 **새로 추가할 게 없을 때도** 작성자 목록 응답을 기다린다.

```js
const [apiTodos, users] = await Promise.all([fetchJson('/todos'), fetchJson('/users')]);
const fresh = apiTodos.filter((t) => !excludeIds.has(t.id));
if (fresh.length === 0) return [];   // users는 쓰지도 않는데 기다렸다
```

**적용한 rule**
`await`는 그 값이 실제로 쓰이는 분기 안으로 옮긴다.

**결과**
```js
const fresh = apiTodos.filter((todo) => !excludeIds.has(todo.id)).slice(0, limit);
if (fresh.length === 0) return [];      // 여기서 끝나면 users는 기다리지 않는다

const users = await usersPromise;       // 정말 필요할 때만
```
"더 가져올 할 일이 없어요" 경우 응답이 `/todos` 하나만큼 빨라졌다. 이미 가져온 id 목록(`importedIds`)도 같은 생각으로, 매 렌더링이 아니라 **버튼을 눌렀을 때만** 만든다 (`ApiImport.jsx`).

### 3. `rerender-derived-state-no-effect` — 계산할 수 있는 값은 state + effect로 만들지 않는다

**문제 (내 코드)**
로딩 / 에러 상태를 처음엔 boolean 여러 개로 두고, 결과 문구를 effect로 맞추려 했다.

```jsx
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [resultText, setResultText] = useState('');

useEffect(() => {
  setResultText(count > 0 ? `${count}개를 가져왔어요.` : '더 가져올 할 일이 없어요.');
}, [count]);
```

`isLoading && error` 같은 **불가능한 조합**이 생길 수 있고, `resultText`는 `count`만 있으면 계산되는데 effect 때문에 렌더링이 한 번 더 돈다.

**적용한 rule**
props / state로 계산할 수 있는 값은 렌더링 중에 계산한다. 서로 배타적인 상태는 하나의 `status`로 표현한다.

**결과**
```jsx
// useApiTodos.js — 상태는 하나
const [request, setRequest] = useState({ status: 'idle' });
setRequest({ status: 'success', count: items.length });

// ApiImport.jsx — 문구는 렌더링 중 계산
{count > 0 ? `${count}개를 가져왔어요.` : '더 가져올 할 일이 없어요.'}
```
불가능한 조합이 사라지고 화면 분기가 `status`별 early return으로 정리됐다. 달력 개수 뱃지(`countByDate`), 날짜별 목록(`dayTodos`)도 2주차부터 계속 렌더링 중 계산한다.

### 4. `rerender-lazy-state-init` — 무거운 초기값은 함수로

**문제 (내 코드)**
useReducer로 바꾸면서 초기값을 이렇게 넘기면,

```jsx
const [todos, dispatch] = useReducer(todosReducer, loadTodos());
```

`loadTodos()`가 **매 렌더링마다** 실행된다 (localStorage 읽기 + `JSON.parse` + 예전 데이터 변환). 결과는 첫 렌더링에만 쓰이고 나머지는 버려진다.

**적용한 rule**
초기값 계산이 무거우면 함수 자체를 넘겨서 첫 렌더링에만 실행되게 한다.

**결과**
```jsx
// useTodos.js — useReducer는 세 번째 인자(init 함수)
const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos);

// useLocalStorage.js — useState는 함수 초기값
const [value, setValue] = useState(() => readStorage(key, { ... }));
```
할 일을 추가하거나 체크할 때마다 localStorage를 다시 읽고 파싱하던 비용이 없어졌다.

### 5. `client-localstorage-schema` — 저장 형식에 버전을 붙인다

**문제 (내 코드)**
2주차까지는 배열을 그대로 저장했다.

```js
localStorage.setItem('todos', JSON.stringify(todos));   // [ {...}, {...} ]
```

기능을 추가할 때마다(`date`, `memo`, 카테고리 변경) 불러오는 코드에 `todo.date ?? ...`, `todo.memo ?? ''`를 계속 덧붙였다. 지금 데이터가 **어느 시점 형식인지 알 방법이 없어서** 모든 경우를 매번 검사해야 했고, JSON이 깨져 있거나 저장 공간이 부족하면 앱이 멈출 수 있었다.

**적용한 rule**
저장 데이터에 버전을 넣고, 버전이 다르면 변환 함수(migrate)로 옮긴다. 읽기 / 쓰기는 `try / catch`로 감싼다.

**결과**
```js
// utils/storage.js
localStorage.setItem(key, JSON.stringify({ version, data }));

const parsed = JSON.parse(saved);
if (parsed?.version === version) return parsed.data;   // 현재 형식 → 그대로
return migrate?.(parsed) ?? fallback;                   // 예전 형식 → 변환

// hooks/useTodos.js — v1(버전 없는 배열) → v2
function migrateTodos(saved) {
  return Array.isArray(saved) ? saved.map(normalizeTodo) : undefined;
}
```
기존 사용자의 할 일은 첫 실행 때 자동으로 v2로 옮겨지고, 다음 형식 변경 때는 `version: 3` + 변환 함수 하나만 추가하면 된다. 읽기 / 쓰기 로직은 `readStorage` / `writeStorage` 하나로 모아 `useTodos`와 `useLocalStorage`가 같이 쓴다.

### 6. `rerender-dependencies` — 바뀐 게 없으면 참조도 그대로

**문제 (내 코드)**
reducer의 "완료한 할 일 삭제"를 처음엔 항상 `filter`로 돌려줬다.

```js
case 'cleared_done':
  return todos.filter((todo) => !todo.done);
```

완료한 할 일이 없어도 `filter`는 **새 배열**을 만든다. `todos`가 의존성인 저장 effect(`[todos]`)는 내용이 같아도 참조가 바뀌었으니 다시 실행되고, `todos`를 받는 페이지도 다시 렌더링된다.

**적용한 rule**
effect / 렌더링은 의존성의 **참조**가 바뀔 때 다시 실행된다. 실제로 바뀐 게 없으면 기존 값을 그대로 돌려준다.

**결과**
```js
case 'cleared_done':
  if (!todos.some((todo) => todo.done)) return todos;   // 같은 참조 → React가 렌더링 생략
  return todos.filter((todo) => !todo.done);

case 'cleared_all':
  return todos.length === 0 ? todos : [];

case 'imported':
  return fresh.length === 0 ? todos : [...todos, ...fresh];
```
변화 없는 액션에서는 리렌더링과 localStorage 쓰기가 모두 생략된다. `useLocalStorage`의 effect 의존성도 `[key, version, value]` — 값이 실제로 바뀐 경우에만 저장한다.

### 7. `js-set-map-lookups` — 반복 조회는 Set / Map으로

**문제 (내 코드)**
- API 할 일마다 작성자를 `users.find()`로 찾으면 할 일 수 × 유저 수만큼 돈다
- 이미 가져온 항목인지 `todos.some(t => t.sourceId === id)`로 확인하면 API 항목 수 × 내 할 일 수
- 달력 칸(최대 42개)마다 그날 할 일을 세면 칸 수 × 할 일 수

```js
author: users.find((u) => u.id === todo.userId)?.name
```

**적용한 rule**
같은 배열에서 여러 번 찾을 때는 한 번 Set / Map으로 만들어 두고 `has()` / `get()`(O(1))으로 조회한다.

**결과**
```js
// api/todos.js — userId → 이름
const nameById = new Map(users.map((user) => [user.id, user.name]));
author: nameById.get(todo.userId) ?? `사용자 ${todo.userId}`

// ApiImport.jsx / todosReducer.js — 이미 가져온 API id
const importedIds = new Set(todos.map((todo) => todo.sourceId));
apiTodos.filter((todo) => !importedIds.has(todo.id))

// utils/todo.js — 날짜 → 개수 (객체 → Map), Calendar.jsx에서 countMap.get(key)
// hooks/useTodos.js — 유효한 카테고리 확인 (CATEGORIES.includes → VALID_CATEGORIES.has)
```
할 일이 늘어나도 조회 비용이 늘지 않는다.

---

## 과제 룰 체크

- **Effect 남용 금지** — effect는 3개뿐이고 모두 외부 시스템과의 동기화다: 할 일 저장(`useTodos`), 설정 저장(`useLocalStorage`), 화면에서 사라질 때 요청 취소(`useApiTodos`). API 요청은 effect가 아니라 **버튼 클릭**에서 보낸다
- **파생 상태 금지** — 결과 문구, 날짜별 목록, 탭 개수, 달력 뱃지 모두 렌더링 중 계산. 로딩/에러는 `status` 하나로
- **불변성 유지** — reducer의 모든 분기가 `map` / `filter` / spread로 새 배열을 만들고, 변화가 없으면 기존 배열을 그대로 반환
- **custom hook 분리** — `useTodos`(데이터), `useLocalStorage`(저장), `useApiTodos`(요청 상태). reducer는 순수 함수라 `id` / `Date.now()`는 Hook에서 만들어 action에 담는다
- **검증** — `npm run build` / `npm run lint` 통과. reducer 분기, v1 → v2 저장 형식 변환, 깨진 JSON, 실제 API 호출(이어서 가져오기 / 전부 가져온 경우 / 요청 취소)을 Node에서 직접 실행해 확인
