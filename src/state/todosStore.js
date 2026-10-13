import { create } from 'zustand';
import { todosReducer } from '../reducers/todosReducer';
import { loadTodos } from './todosStorage';

// 구현 2: Zustand store.
// store는 React 트리 밖(모듈)에 있는 전역 객체라 Provider 없이 어느 컴포넌트에서든 꺼내 쓸 수 있다.
// 변경 규칙은 Context 버전과 똑같은 todosReducer를 재사용한다 → 차이는 "state를 어디에 두느냐"뿐.
//
// 5주차: 이 파일에는 import 하자마자 실행되는 코드(side effect)를 두지 않는다.
// 예전에는 여기서 store.subscribe()로 저장을 걸어 뒀는데, 그러면 번들러가 이 파일을 "지우면 안 되는 코드"로 보고
// Context 버전(npm run dev)으로 빌드해도 zustand가 번들에 들어갔다 (bundle analyzer로 확인).
// /* @__PURE__ */: 결과를 쓰지 않으면 지워도 되는 호출이라고 번들러에 알려 준다.
export const useTodosStore = /* @__PURE__ */ create((set) => ({
  todos: loadTodos(),
  dispatch: (action) => set((store) => ({ todos: todosReducer(store.todos, action) })),
}));
