import { CATEGORY_ALL } from '../constants';

// 각 정렬 기준의 비교 함수. 여기서 새 기준을 추가하면 UI(SORT_OPTIONS)와 같이 확장된다.
const COMPARATORS = {
  latest: (a, b) => b.createdAt - a.createdAt,
  oldest: (a, b) => a.createdAt - b.createdAt,
  text: (a, b) => a.text.localeCompare(b.text, 'ko'),
};

// 탭 / 카테고리 필터를 순수 함수로 분리 → 컴포넌트에서는 derived state로 계산만 한다.
export function filterTodos(todos, { tab, category }) {
  return todos.filter((todo) => {
    if (tab === 'active' && todo.done) return false;
    if (tab === 'done' && !todo.done) return false;
    if (category !== CATEGORY_ALL && todo.category !== category) return false;
    return true;
  });
}

// .sort()는 원본 배열을 변경(mutate)하므로 state를 직접 바꾸게 된다.
// .toSorted()는 정렬된 새 배열을 돌려주므로 state 불변성이 지켜진다.
export function sortTodos(todos, sortBy) {
  const compare = COMPARATORS[sortBy];
  if (!compare) return todos;
  return todos.toSorted(compare);
}

// 달력 칸마다 개수를 찾기 쉽게 { 'YYYY-MM-DD': { all, done } } 형태로 모은다
export function countByDate(todos) {
  const map = {};
  for (const todo of todos) {
    map[todo.date] ??= { all: 0, done: 0 };
    map[todo.date].all += 1;
    if (todo.done) map[todo.date].done += 1;
  }
  return map;
}

export function countByStatus(todos) {
  const done = todos.filter((todo) => todo.done).length;
  return { all: todos.length, done, active: todos.length - done };
}
