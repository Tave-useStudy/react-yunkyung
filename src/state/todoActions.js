import { MAX_TEXT_LENGTH } from '../constants';

// API 제목은 길어서 목록용 text는 글자 수 제한에 맞춰 줄이고, 전체 제목은 세부사항에 남긴다
const shorten = (text) =>
  text.length > MAX_TEXT_LENGTH ? `${text.slice(0, MAX_TEXT_LENGTH - 1)}…` : text;

// dispatch를 받아 컴포넌트가 부를 조작 함수 묶음을 만든다.
// dispatch가 useReducer의 것이든 Zustand store의 것이든 상관없다 → 두 구현이 이 파일을 같이 쓴다.
// id / 시간처럼 매번 달라지는 값은 reducer 밖(여기)에서 만들어 action에 담는다.
export function createTodoActions(dispatch) {
  return {
    addTodo: ({ text, category, date, status = 'todo' }) => {
      dispatch({
        type: 'added',
        todo: {
          id: crypto.randomUUID(),
          text,
          memo: '',
          done: status === 'done',
          status,
          category,
          date,
          createdAt: Date.now(),
        },
      });
    },

    importTodos: (items, date) => {
      const now = Date.now();
      dispatch({
        type: 'imported',
        todos: items.map((item, i) => ({
          id: crypto.randomUUID(),
          sourceId: item.sourceId,
          text: shorten(item.title),
          memo: `${item.title}\n\n작성자: ${item.author}\n출처: JSONPlaceholder #${item.sourceId}`,
          done: item.done,
          status: item.done ? 'done' : 'todo',
          category: '일정',
          date,
          createdAt: now + i,
        })),
      });
    },

    toggleTodo: (id) => dispatch({ type: 'toggled', id }),
    moveTodo: (id, status) => dispatch({ type: 'moved', id, status }),
    updateTodo: (id, changes) => dispatch({ type: 'updated', id, changes }),
    deleteTodo: (id) => dispatch({ type: 'deleted', id }),
    clearDone: () => dispatch({ type: 'cleared_done' }),
    clearAll: () => dispatch({ type: 'cleared_all' }),
  };
}
