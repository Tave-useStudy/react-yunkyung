import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import TodoDetailPage from './pages/TodoDetailPage';
import SettingsPage from './pages/SettingsPage';
import { CATEGORIES, DEFAULT_SETTINGS } from './constants';
import { toDateKey } from './utils/date';
import './App.css';

const STORAGE_KEY = 'todos';

// 새로고침해도 목록이 유지되도록 localStorage에서 초기값을 읽어온다 (lazy initializer)
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    // 예전 형식으로 저장된 할 일 보정
    // - 날짜 기능 이전: date가 없으므로 생성일로 채운다
    // - 카테고리 변경 이전(업무/개인/기타): 지금 목록에 없으면 '일정'으로 옮긴다
    // - 세부사항 기능 이전: memo가 없으므로 빈 문자열
    return JSON.parse(saved).map((todo) => ({
      ...todo,
      memo: todo.memo ?? '',
      date: todo.date ?? toDateKey(new Date(todo.createdAt)),
      category: CATEGORIES.includes(todo.category) ? todo.category : '일정',
    }));
  } catch {
    return [];
  }
}

function App() {
  // 여러 페이지가 같은 todos를 봐야 하므로 Routes 위(App)에서 상태를 관리한다
  const [todos, setTodos] = useState(loadTodos);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // localStorage(외부 시스템)와 동기화 — 사용자 이벤트가 아니라 "todos가 바뀌었다"는
  // 사실 자체에 반응해야 하므로 여기서는 effect가 맞다
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // ---- todos 조작 함수: 전부 functional update + 새 배열/객체 생성 (불변성) ----

  const addTodo = ({ text, category, date }) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, memo: '', done: false, category, date, createdAt: Date.now() },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
  };

  const updateTodo = (id, changes) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearDone = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  const clearAll = () => setTodos([]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <MainPage
              todos={todos}
              settings={settings}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          }
        />
        <Route
          path="todos/:id"
          element={
            <TodoDetailPage
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onUpdate={updateTodo}
            />
          }
        />
        <Route
          path="settings"
          element={
            <SettingsPage
              settings={settings}
              todos={todos}
              onChangeSettings={setSettings}
              onClearDone={clearDone}
              onClearAll={clearAll}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
