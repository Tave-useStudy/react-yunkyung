import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router';
import { useTodosMeta } from '../state/TodosContext';

// 모든 페이지가 공유하는 헤더. <Outlet/> 자리에 현재 라우트의 페이지가 렌더링된다.
function Layout() {
  const { implementation } = useTodosMeta();

  return (
    <div className="app">
      <header className="app-header">
        <h1>To-Do-List</h1>
        <nav className="app-nav">
          <NavLink to="/" end>
            달력
          </NavLink>
          <NavLink to="/board">보드</NavLink>
          <NavLink to="/settings">설정</NavLink>
        </nav>
      </header>
      {/* 5주차: 페이지 코드를 불러오는 동안 헤더는 그대로 두고 본문 자리에만 로딩 표시 */}
      <Suspense fallback={<p className="page-loading" role="status">불러오는 중…</p>}>
        <Outlet />
      </Suspense>
      <footer className="app-footer">상태 관리: {implementation}</footer>
    </div>
  );
}

export default Layout;
