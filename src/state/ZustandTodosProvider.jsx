import { useEffect, useMemo } from 'react';
import { useTodosStore } from './todosStore';
import { createTodoActions } from './todoActions';
import { saveTodos } from './todosStorage';
import { TodosActionsContext, TodosStateContext } from './TodosContext';

const meta = { implementation: 'Zustand' };

// Zustand store를 Context 인터페이스({ state, actions, meta })에 맞춰 끼워 넣는 어댑터.
// 컴포넌트는 그대로 useTodosState() / useTodoActions()를 쓰므로 Provider만 바꾸면 구현이 교체된다.
function ZustandTodosProvider({ children }) {
  // selector로 필요한 값만 구독한다
  const todos = useTodosStore((store) => store.todos);
  const dispatch = useTodosStore((store) => store.dispatch);

  // useEffect 대신 store 구독으로 저장한다 (todos가 실제로 바뀐 경우에만). 화면에서 사라지면 구독 해제
  useEffect(
    () =>
      useTodosStore.subscribe((store, prevStore) => {
        if (store.todos !== prevStore.todos) saveTodos(store.todos);
      }),
    []
  );

  const actions = useMemo(() => createTodoActions(dispatch), [dispatch]);
  const state = useMemo(() => ({ todos }), [todos]);
  const rest = useMemo(() => ({ actions, meta }), [actions]);

  return (
    <TodosActionsContext value={rest}>
      <TodosStateContext value={state}>{children}</TodosStateContext>
    </TodosActionsContext>
  );
}

export default ZustandTodosProvider;
