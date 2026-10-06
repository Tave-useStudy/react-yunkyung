import { createContext, use } from 'react';
import { useTodosContext } from '../../state/TodosContext';
import { useBoard } from './BoardContext';
import { STATUSES } from '../../constants';
import { getAdjacentStatus } from '../../utils/todo';

// 카드 한 장 (compound component).
// import * as Card from './Card' 로 불러서 Card.Root, Card.Title ... 처럼 쓴다.
// Card.Root가 todo를 Context로 들고 있어서, 안쪽 조각들은 todo를 props로 받지 않는다.
//   <Card.Root todo={todo}>
//     <Card.Title />
//     <Card.Meta />
//     <Card.Actions>
//       <Card.MoveBack />
//       <Card.MoveForward />
//     </Card.Actions>
//   </Card.Root>
const CardContext = createContext(null);

function useCard() {
  const todo = use(CardContext);
  if (todo === null) throw new Error('Card.* 컴포넌트는 <Card.Root> 안에서만 쓸 수 있습니다.');
  return todo;
}

export function Root({ todo, children }) {
  return (
    <CardContext value={todo}>
      <article className={`card card-${todo.status}`}>{children}</article>
    </CardContext>
  );
}

// 제목을 누르면 상세 모달이 열린다
export function Title() {
  const todo = useCard();
  const { openCard } = useBoard();
  return (
    <button type="button" className="card-title" onClick={() => openCard(todo.id)}>
      {todo.text}
    </button>
  );
}

export function Meta() {
  const todo = useCard();
  return (
    <div className="card-meta">
      <span className="badge category">{todo.category}</span>
      <span className="card-date">{todo.date}</span>
    </div>
  );
}

export function Actions({ children }) {
  return <div className="card-actions">{children}</div>;
}

// <MoveButton direction="back" /> 하나로 만들지 않고 방향마다 컴포넌트를 따로 둔다 (explicit variants).
// 쓰는 쪽에서 무엇이 렌더링되는지 이름만 보고 알 수 있고, 한쪽만 빼는 것도 쉽다.
export function MoveBack() {
  const todo = useCard();
  const { moveTodo } = useTodosContext().actions;
  const prev = getAdjacentStatus(STATUSES, todo.status, -1);
  if (!prev) return null;
  return (
    <button type="button" className="move-btn" onClick={() => moveTodo(todo.id, prev.value)}>
      ← {prev.label}
    </button>
  );
}

export function MoveForward() {
  const todo = useCard();
  const { moveTodo } = useTodosContext().actions;
  const next = getAdjacentStatus(STATUSES, todo.status, 1);
  if (!next) return null;
  return (
    <button type="button" className="move-btn" onClick={() => moveTodo(todo.id, next.value)}>
      {next.label} →
    </button>
  );
}
