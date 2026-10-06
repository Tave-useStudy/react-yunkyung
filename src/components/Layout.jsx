import { NavLink, Outlet } from 'react-router-dom';
import { useTodosContext } from '../state/TodosContext';

// 모든 페이지가 공유하는 헤더. <Outlet/> 자리에 현재 라우트의 페이지가 렌더링된다.
function Layout() {
  const { implementation } = useTodosContext().meta;

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
      <Outlet />
      <footer className="app-footer">상태 관리: {implementation}</footer>
    </div>
  );
}

export default Layout;
