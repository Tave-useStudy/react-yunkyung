import { readStorage, writeStorage } from '../utils/storage';
import { toDateKey } from '../utils/date';
import { CATEGORIES } from '../constants';

// 할 일을 localStorage에서 읽고 쓰는 부분.
// Context(useReducer) 버전과 Zustand 버전이 같은 저장 형식을 쓰도록 Hook 밖으로 뺐다.

const STORAGE_KEY = 'todos';
// v1: 버전 없이 배열만 저장 / v2: { version: 2, data: [...] } / v3: 할 일마다 status 추가
const STORAGE_VERSION = 3;

const VALID_CATEGORIES = new Set(CATEGORIES);

// 예전에 저장된 할 일에 없는 필드를 채운다
function normalizeTodo(todo) {
  return {
    ...todo,
    memo: todo.memo ?? '', // 세부사항 기능 이전
    date: todo.date ?? toDateKey(new Date(todo.createdAt)), // 날짜 기능 이전
    category: VALID_CATEGORIES.has(todo.category) ? todo.category : '일정', // 카테고리 변경 이전
    status: todo.status ?? (todo.done ? 'done' : 'todo'), // Kanban 기능 이전
  };
}

// v1(배열만) / v2({ version: 2, data }) → v3
function migrateTodos(saved) {
  if (Array.isArray(saved)) return saved.map(normalizeTodo);
  if (saved?.version === 2 && Array.isArray(saved.data)) return saved.data.map(normalizeTodo);
  return undefined;
}

export function loadTodos() {
  return readStorage(STORAGE_KEY, {
    version: STORAGE_VERSION,
    fallback: [],
    migrate: migrateTodos,
  });
}

export function saveTodos(todos) {
  writeStorage(STORAGE_KEY, STORAGE_VERSION, todos);
}
