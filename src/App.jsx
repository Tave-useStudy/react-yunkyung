import { useState } from 'react';
import TextInput from './components/TextInput';
import TaskList from './components/TaskList';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  // 전체 할 일 상태는 App에서만 관리하고, 자식에게 props로 내려준다 (단방향 데이터 흐름)
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <h1>투두리스트</h1>
      <TextInput onAdd={addTodo} />
      <TaskList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <UserProfile />
    </div>
  );
}

export default App;
