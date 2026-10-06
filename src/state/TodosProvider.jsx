import ReducerTodosProvider from './ReducerTodosProvider';
import ZustandTodosProvider from './ZustandTodosProvider';

// 어떤 구현을 쓸지 여기서 한 번만 고른다.
//   npm run dev          → Context + useReducer
//   npm run dev:zustand  → Zustand (.env.zustand의 VITE_STATE=zustand)
const TodosProvider =
  import.meta.env.VITE_STATE === 'zustand' ? ZustandTodosProvider : ReducerTodosProvider;

export default TodosProvider;
