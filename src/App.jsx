import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import BoardPage from './pages/BoardPage';
import TodoDetailPage from './pages/TodoDetailPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

// 4주차: 데이터는 Provider(main.jsx)가 갖고, 페이지는 필요한 것을 Context에서 직접 꺼낸다.
// → App은 이제 "어떤 주소에 어떤 페이지"만 담당하고 props를 넘기지 않는다.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="board" element={<BoardPage />} />
        <Route path="todos/:id" element={<TodoDetailPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
