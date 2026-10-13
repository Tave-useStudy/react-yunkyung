import { createContext, use } from 'react';

// 컴포넌트가 아는 것은 이 "모양"뿐이다.
//   state   : { todos }
//   actions : { addTodo, importTodos, toggleTodo, moveTodo, updateTodo, deleteTodo, clearDone, clearAll }
//   meta    : { implementation } — 지금 어떤 상태 관리 방식으로 동작하는지 (화면 표시용)
// 실제로 useReducer로 관리하는지 Zustand로 관리하는지는 Provider만 안다.
//
// 5주차: Context를 두 개로 나눴다.
//   TodosStateContext   — todos. 할 일이 바뀔 때마다 새 값
//   TodosActionsContext — actions + meta. 처음 만든 뒤로 바뀌지 않는다
// Context 값이 바뀌면 그 Context를 읽는 컴포넌트는 전부 다시 렌더링된다.
// 하나로 묶여 있으면 버튼처럼 actions만 쓰는 컴포넌트도 할 일이 바뀔 때마다 다시 렌더링된다 (Profiler로 확인).
export const TodosStateContext = createContext(null);
export const TodosActionsContext = createContext(null);

function useRequired(context, hookName) {
  // React 19의 use()는 useContext와 같은 일을 한다 (조건문 안에서도 부를 수 있다는 점만 다르다)
  const value = use(context);
  if (value === null) {
    throw new Error(`${hookName}는 <TodosProvider> 안에서만 쓸 수 있습니다.`);
  }
  return value;
}

// 할 일 목록이 필요한 곳 — 할 일이 바뀌면 다시 렌더링된다
export function useTodosState() {
  return useRequired(TodosStateContext, 'useTodosState');
}

// 조작 함수만 필요한 곳 — 할 일이 바뀌어도 다시 렌더링되지 않는다
export function useTodoActions() {
  return useRequired(TodosActionsContext, 'useTodoActions').actions;
}

export function useTodosMeta() {
  return useRequired(TodosActionsContext, 'useTodosMeta').meta;
}

// 둘 다 필요한 곳 (4주차 인터페이스 그대로)
export function useTodosContext() {
  const state = useRequired(TodosStateContext, 'useTodosContext');
  const { actions, meta } = useRequired(TodosActionsContext, 'useTodosContext');
  return { state, actions, meta };
}
