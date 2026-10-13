import KanbanCard from './KanbanCard';
import { ColumnContext, useColumn } from './ColumnContext';
import { useBoardFilter } from './BoardContext';
import { useTodosState } from '../../state/TodosContext';
import { useSettings } from '../../state/SettingsContext';
import { STATUS_LABEL } from '../../constants';
import { searchTodos, sortTodos } from '../../utils/todo';

// 상태 하나(할 일 / 진행 중 / 완료)의 컬럼 (compound component).
// Column.Root가 자기 상태의 카드만 골라 Context로 내려주고, 조각들은 필요한 것만 꺼내 쓴다.
export function Root({ status, children }) {
  const { todos } = useTodosState();
  const { settings } = useSettings();
  const { filter } = useBoardFilter();
  // 카드 목록은 todos에서 계산되는 derived state (따로 state로 들고 있지 않는다)
  // useMemo는 쓰지 않았다: 이 컴포넌트가 다시 렌더링되는 건 거의 todos / filter가 바뀌었을 때라
  // 어차피 다시 계산해야 하고, 할 일 수십 개를 거르는 비용은 Profiler에서 무시할 만큼 작았다.
  const cards = sortTodos(
    searchTodos(
      todos.filter((todo) => todo.status === status),
      filter
    ),
    settings.defaultSort
  );

  return (
    <ColumnContext value={{ status, label: STATUS_LABEL[status], cards }}>
      <section className={`column column-${status}`} aria-label={STATUS_LABEL[status]}>
        {children}
      </section>
    </ColumnContext>
  );
}

export function Header() {
  const { label, cards } = useColumn();
  return (
    <header className="column-header">
      <h3>{label}</h3>
      <span className="tab-count">{cards.length}</span>
    </header>
  );
}

export function Cards() {
  const { cards } = useColumn();
  if (cards.length === 0) return <p className="column-empty">카드가 없어요.</p>;

  return (
    <ul className="column-cards">
      {cards.map((todo) => (
        <li key={todo.id}>
          <KanbanCard todo={todo} />
        </li>
      ))}
    </ul>
  );
}

// 컬럼 아래쪽 빈 자리. 무엇을 넣을지는 쓰는 쪽이 children으로 정한다.
// (showAddButton 같은 boolean prop을 두지 않는다)
export function Footer({ children }) {
  return <footer className="column-footer">{children}</footer>;
}
