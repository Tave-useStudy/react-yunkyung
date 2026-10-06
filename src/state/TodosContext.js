import { createContext, use } from 'react';

// 컴포넌트가 아는 것은 이 "모양"뿐이다.
//   state   : { todos }
//   actions : { addTodo, importTodos, toggleTodo, moveTodo, updateTodo, deleteTodo, clearDone, clearAll }
//   meta    : { implementation } — 지금 어떤 상태 관리 방식으로 동작하는지 (화면 표시용)
// 실제로 useReducer로 관리하는지 Zustand로 관리하는지는 Provider만 안다.
export const TodosContext = createContext(null);

export function useTodosContext() {
  // React 19의 use()는 useContext와 같은 일을 한다 (조건문 안에서도 부를 수 있다는 점만 다르다)
  const context = use(TodosContext);
  if (context === null) {
    throw new Error('useTodosContext는 <TodosProvider> 안에서만 쓸 수 있습니다.');
  }
  return context;
}
