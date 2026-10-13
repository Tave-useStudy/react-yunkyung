# react_yunkyung

TAVE React 스터디 1~5주차 과제 — 달력 + Kanban 보드 To-Do-List

## 주차별 키워드

자세한 설명과 코드는 [`실습 코드 정리.md`](./실습%20코드%20정리.md)에 주차별로 정리했다.

### 1주차 — React 기초 Hooks

- React로 투두리스트를 처음 만들었다. 할 일 추가 / 완료 토글(취소선) / 삭제, 20자 글자 수 제한, Random User API로 프로필 불러오기.
- `useState`로 목록과 입력값을, `useEffect`로 localStorage 저장을, `useRef`로 추가 후 입력창 포커스를 처리했다.

| 키워드 | 한 줄 정리 | 투두리스트에서 |
|---|---|---|
| useState | 바뀌면 화면이 다시 그려지는 값 | 입력창 글자, 입력 폼 열림(`isAdding`) |
| useEffect | 렌더링 후 외부 시스템과 동기화 | 할 일을 localStorage에 저장 |
| useRef | 리렌더링 없이 값 기억 / DOM 접근 | 할 일 추가 후 입력창 `focus()` |
| ref prop (React 19) | `forwardRef` 없이 ref를 일반 prop으로 | `TextField({ ref })` |
| 조건부 렌더링 | 데이터 → 어떤 화면인지 선언 | `isAdding ? <TextInput /> : <button>` |

### 2주차 — React Router

- 달력 기반 To-Do-List로 확장했다. 날짜별 할 일, 카테고리 / 정렬 / 필터 탭, 수정 모드와 세부사항(메모)을 추가했다.
- React Router로 달력 / 상세(`/todos/:id`) / 설정 페이지를 나누고, 선택한 날짜는 URL(`?date=`)에 둬서 새로고침해도 유지된다.

| 키워드 | 한 줄 정리 | 투두리스트에서 |
|---|---|---|
| SPA 라우팅 | 새로고침 없이 URL마다 다른 화면 | 달력 / 상세 / 설정 페이지 |
| BrowserRouter · Routes · Route | 주소와 페이지 연결 | `main.jsx`, `App.jsx` |
| Link · NavLink | 페이지 이동 링크, 현재 메뉴 표시 | 할 일 제목 → 상세, 상단 메뉴 |
| useNavigate · useParams | 코드로 이동, URL 값 읽기 | `/todos/:id` 상세, 삭제 후 이동 |
| 중첩 라우트 · Outlet | 공통 레이아웃 안에 페이지 끼우기 | `Layout` 헤더 공유 |
| useSearchParams | 화면 상태를 URL 쿼리에 | 선택한 날짜 `?date=2026-10-12` |

### 3주차 — Custom Hook / 데이터

- `App.jsx`에 몰려 있던 로직을 Custom Hook(`useTodos`, `useLocalStorage`, `useApiTodos`)으로 분리하고, 할 일 변경은 `useReducer` 하나로 모았다.
- localStorage 저장 형식에 버전을 붙여 예전 데이터를 변환하고, JSONPlaceholder API에서 할 일을 불러오며 로딩 / 에러 / 재시도를 처리했다.

| 키워드 | 한 줄 정리 | 투두리스트에서 |
|---|---|---|
| Custom Hook | state + 로직을 `use…` 함수로 분리 | `useTodos`, `useApiTodos` |
| useLocalStorage | useState처럼 쓰는 저장 Hook | 설정 저장 |
| useReducer | 상태 변경을 reducer 하나로 모으기 | `todosReducer` (추가 / 완료 / 수정 / 삭제 …) |
| 데이터 영속화 | 저장 형식에 버전, 예전 데이터 변환 | `{ version, data }` + migrate |
| API 연동 | fetch, `res.ok` 확인, 요청 취소 | JSONPlaceholder 할 일 불러오기, `AbortController` |
| 로딩 / 에러 처리 | 상태를 `status` 하나로 | 스피너, 에러 메시지 + 다시 시도 |

### 4주차 — Context / Composition / 상태 관리

- Kanban 보드(`/board`)를 추가했다. 카드를 할 일 → 진행 중 → 완료로 옮기고, 카드를 누르면 상세 / 수정 모달이 열린다.
- Context로 props drilling을 없애고 Board / Column / Card를 compound component로 설계했으며, 같은 인터페이스로 Context ↔ Zustand를 교체해 비교했다.

| 키워드 | 한 줄 정리 | 투두리스트에서 |
|---|---|---|
| Context (createContext · use) | 중간을 건너뛰고 깊이 전달 → props drilling 제거 | `TodosContext`, `useTodosContext()` |
| children | 틀은 배치만, 내용은 쓰는 쪽이 | `Board`, `Column.Footer` |
| compound component | Root가 Context로 공유, 조각을 조립 | `Column.*`, `Card.*`, `Modal.*` |
| boolean prop 대신 조립 | 모드 prop 대신 이름 있는 컴포넌트 | `Card.MoveBack` / `MoveForward` |
| Zustand | React 밖 store + selector 구독 | Provider만 바꿔 교체 (`npm run dev:zustand`) |
| Modal | 열림 state는 부모, 모달은 닫기 요청만 | 카드 상세 / 수정, `selectedId` 하나로 |

### 5주차 — 성능 최적화

- Profiler로 리렌더링을 먼저 측정하고, Context 분리 + `memo` / `useCallback`으로 낭비를 줄였다 (카드 이동 261 → 18회, 할 일 체크 79 → 11회).
- 페이지와 카드 모달을 `lazy` + `Suspense`로 나눠 받고, 보드 검색에 `useTransition`을 적용했다. bundle analyzer로 쓰지 않는 zustand를 찾아 빼고 `react-router-dom` barrel import를 없앴다.

| 키워드 | 한 줄 정리 | 투두리스트에서 |
|---|---|---|
| React DevTools Profiler | 먼저 측정, 낭비가 보인 곳만 고친다 | 카드 이동 261 → 18회 렌더링 |
| memo | props가 같으면 렌더링 건너뛰기 | `TaskItem`, `CalendarDay`, `KanbanCard` |
| useMemo · useCallback | 참조를 유지해야 하는 곳에만 | Context value, `selectDate` |
| Context 나누기 | 언제 바뀌는지 다른 값은 다른 Context로 | `useTodosState` / `useTodoActions` |
| lazy · Suspense | 첫 화면에 필요 없는 코드는 나중에 | 보드 / 상세 / 설정 페이지, 카드 모달 |
| useTransition | 급한 입력과 급하지 않은 목록 분리 | 보드 검색 / 카테고리 필터 |
| bundle analyzer · barrel import | 번들 구성 확인, 다시 내보내기 파일 피하기 | `npm run analyze`, `react-router-dom` → `react-router` |
