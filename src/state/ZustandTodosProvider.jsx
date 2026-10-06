import { useMemo } from 'react';
import { useTodosStore } from './todosStore';
import { createTodoActions } from './todoActions';
import { TodosContext } from './TodosContext';

const meta = { implementation: 'Zustand' };

// Zustand store를 Context 인터페이스({ state, actions, meta })에 맞춰 끼워 넣는 어댑터.
// 컴포넌트는 그대로 useTodosContext()를 쓰므로 Provider만 바꾸면 구현이 교체된다.
function ZustandTodosProvider({ children }) {
  // selector로 필요한 값만 구독한다
  const todos = useTodosStore((store) => store.todos);
  const dispatch = useTodosStore((store) => store.dispatch);

  const actions = useMemo(() => createTodoActions(dispatch), [dispatch]);
  const value = useMemo(() => ({ state: { todos }, actions, meta }), [todos, actions]);

  return <TodosContext value={value}>{children}</TodosContext>;
}

export default ZustandTodosProvider;
