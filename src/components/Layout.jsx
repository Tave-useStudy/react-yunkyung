import { NavLink, Outlet } from 'react-router-dom';

// 모든 페이지가 공유하는 헤더. <Outlet/> 자리에 현재 라우트의 페이지가 렌더링된다.
function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>To-Do-List</h1>
        <nav className="app-nav">
          <NavLink to="/" end>
            달력
          </NavLink>
          <NavLink to="/settings">설정</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default Layout;
