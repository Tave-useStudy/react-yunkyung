import { useMemo } from 'react';
import useTodos from '../hooks/useTodos';
import { TodosContext } from './TodosContext';

const meta = { implementation: 'Context + useReducer' };

// 구현 1: useReducer로 만든 state를 Context로 내려준다.
function ReducerTodosProvider({ children }) {
  const { todos, actions } = useTodos();

  // value 객체를 렌더링마다 새로 만들면 todos가 그대로여도 모든 소비자가 다시 렌더링된다
  const value = useMemo(() => ({ state: { todos }, actions, meta }), [todos, actions]);

  // React 19: <TodosContext.Provider> 대신 <TodosContext>를 바로 Provider로 쓸 수 있다
  return <TodosContext value={value}>{children}</TodosContext>;
}

export default ReducerTodosProvider;
