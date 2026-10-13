import { useMemo } from 'react';
import useTodos from '../hooks/useTodos';
import { TodosActionsContext, TodosStateContext } from './TodosContext';

const meta = { implementation: 'Context + useReducer' };

// 구현 1: useReducer로 만든 state를 Context로 내려준다.
function ReducerTodosProvider({ children }) {
  const { todos, actions } = useTodos();

  // value 객체를 렌더링마다 새로 만들면 내용이 그대로여도 모든 소비자가 다시 렌더링된다
  const state = useMemo(() => ({ todos }), [todos]);
  const rest = useMemo(() => ({ actions, meta }), [actions]);

  // React 19: <TodosContext.Provider> 대신 <TodosContext>를 바로 Provider로 쓸 수 있다
  return (
    <TodosActionsContext value={rest}>
      <TodosStateContext value={state}>{children}</TodosStateContext>
    </TodosActionsContext>
  );
}

export default ReducerTodosProvider;
