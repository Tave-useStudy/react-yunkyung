import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import './App.css';
import './theme.css';

// 5주차: 라우트 단위 코드 스플리팅.
// 첫 화면(달력)만 바로 불러오고, 나머지 페이지는 그 주소로 처음 들어갈 때 따로 받는다 (페이지별 번들).
// 로딩 중 화면은 Layout의 <Suspense>가 보여 준다.
const BoardPage = lazy(() => import('./pages/BoardPage'));
const TodoDetailPage = lazy(() => import('./pages/TodoDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

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
