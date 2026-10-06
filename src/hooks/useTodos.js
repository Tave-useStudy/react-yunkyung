import { useEffect, useMemo, useReducer } from 'react';
import { todosReducer } from '../reducers/todosReducer';
import { loadTodos, saveTodos } from '../state/todosStorage';
import { createTodoActions } from '../state/todoActions';

// 할 일 데이터(state + 변경 로직 + 저장)를 담당하는 Hook.
// 컴포넌트는 화면만 그리고, 무엇을 어떻게 바꿀지는 여기서 정한다.
// 4주차: 이 Hook은 이제 TodosProvider 안에서 한 번만 호출되고, 컴포넌트는 Context로 결과를 받는다.
function useTodos() {
  // 세 번째 인자(init 함수)로 첫 렌더에만 localStorage를 읽는다
  const [todos, dispatch] = useReducer(todosReducer, undefined, loadTodos);

  // reducer가 같은 배열을 돌려주면(변경 없음) todos 참조가 그대로라 저장도 건너뛴다
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // dispatch는 항상 같은 함수라 actions도 처음 한 번만 만들어진다
  // → actions만 쓰는 컴포넌트에 매번 새 객체가 내려가지 않는다
  const actions = useMemo(() => createTodoActions(dispatch), []);

  return { todos, actions };
}

export default useTodos;
