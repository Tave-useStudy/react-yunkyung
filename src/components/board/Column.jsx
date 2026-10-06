import * as Card from './Card';
import { ColumnContext, useColumn } from './ColumnContext';
import { useTodosContext } from '../../state/TodosContext';
import { useSettings } from '../../state/SettingsContext';
import { STATUS_LABEL } from '../../constants';
import { sortTodos } from '../../utils/todo';

// 상태 하나(할 일 / 진행 중 / 완료)의 컬럼 (compound component).
// Column.Root가 자기 상태의 카드만 골라 Context로 내려주고, 조각들은 필요한 것만 꺼내 쓴다.
export function Root({ status, children }) {
  const { todos } = useTodosContext().state;
  const { settings } = useSettings();
  // 카드 목록은 todos에서 계산되는 derived state (따로 state로 들고 있지 않는다)
  const cards = sortTodos(
    todos.filter((todo) => todo.status === status),
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
          <Card.Root todo={todo}>
            <Card.Title />
            <Card.Meta />
            <Card.Actions>
              <Card.MoveBack />
              <Card.MoveForward />
            </Card.Actions>
          </Card.Root>
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
