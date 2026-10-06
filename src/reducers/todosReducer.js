// todos 배열의 모든 변경(CRUD)을 한곳에 모은 reducer.
// reducer는 순수 함수여야 하므로 id / 시간 같은 값은 여기서 만들지 않고 action으로 받는다.
// 바뀌는 게 없으면 기존 배열을 그대로 돌려줘서 불필요한 리렌더링과 저장을 막는다.
// 4주차: status('todo' | 'doing' | 'done')가 생겼다. 기존 화면(체크박스, 필터)이 쓰는 done은
// status === 'done'과 항상 같아야 하므로 둘을 바꾸는 곳은 이 reducer 한 곳뿐이다.

export function todosReducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, action.todo];

    case 'toggled':
      return todos.map((todo) =>
        todo.id === action.id
          ? { ...todo, done: !todo.done, status: todo.done ? 'todo' : 'done' }
          : todo
      );

    case 'moved': {
      const target = todos.find((todo) => todo.id === action.id);
      if (!target || target.status === action.status) return todos;
      return todos.map((todo) =>
        todo === target ? { ...todo, status: action.status, done: action.status === 'done' } : todo
      );
    }

    case 'updated':
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, ...action.changes } : todo
      );

    case 'deleted':
      return todos.filter((todo) => todo.id !== action.id);

    case 'cleared_done':
      if (!todos.some((todo) => todo.done)) return todos;
      return todos.filter((todo) => !todo.done);

    case 'cleared_all':
      return todos.length === 0 ? todos : [];

    case 'imported': {
      // 같은 API 항목이 두 번 들어오지 않도록 sourceId로 한 번 더 거른다 (Set: O(1) 조회)
      const importedIds = new Set(todos.map((todo) => todo.sourceId));
      const fresh = action.todos.filter((todo) => !importedIds.has(todo.sourceId));
      return fresh.length === 0 ? todos : [...todos, ...fresh];
    }

    default:
      throw new Error(`알 수 없는 액션: ${action.type}`);
  }
}
