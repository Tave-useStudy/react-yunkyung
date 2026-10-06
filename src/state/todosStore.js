import { create } from 'zustand';
import { todosReducer } from '../reducers/todosReducer';
import { loadTodos, saveTodos } from './todosStorage';

// 구현 2: Zustand store.
// store는 React 트리 밖(모듈)에 있는 전역 객체라 Provider 없이 어느 컴포넌트에서든 꺼내 쓸 수 있다.
// 변경 규칙은 Context 버전과 똑같은 todosReducer를 재사용한다 → 차이는 "state를 어디에 두느냐"뿐.
export const useTodosStore = create((set) => ({
  todos: loadTodos(),
  dispatch: (action) => set((store) => ({ todos: todosReducer(store.todos, action) })),
}));

// useEffect 대신 store 구독으로 저장한다 (todos가 실제로 바뀐 경우에만)
useTodosStore.subscribe((store, prevStore) => {
  if (store.todos !== prevStore.todos) saveTodos(store.todos);
});
