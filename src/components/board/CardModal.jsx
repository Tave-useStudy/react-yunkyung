import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Modal from '../Modal';
import TaskEditForm from '../TaskEditForm';
import { useBoard } from './BoardContext';
import { useTodosContext } from '../../state/TodosContext';
import { STATUSES, STATUS_LABEL } from '../../constants';

// 선택된 카드의 상세 / 수정 모달.
// 열기 / 닫기는 BoardContext의 selectedId 하나로 관리한다 (null이면 닫힘).
function CardModal() {
  const { selectedId, closeCard } = useBoard();
  const { todos } = useTodosContext().state;
  // 카드가 삭제되면 todo가 undefined → 모달이 저절로 닫힌다
  const todo = todos.find((t) => t.id === selectedId);

  return (
    <Modal.Root open={todo !== undefined} onClose={closeCard}>
      {/* key: 다른 카드를 열면 수정 모드 state가 초기화된다 */}
      {todo ? <CardModalContent key={todo.id} todo={todo} /> : null}
    </Modal.Root>
  );
}

// 한 컴포넌트 안에서 isEditing으로 여기저기 분기하지 않고, 화면을 두 컴포넌트로 나눈다
function CardModalContent({ todo }) {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <CardEditView todo={todo} onDone={() => setIsEditing(false)} />
  ) : (
    <CardDetailView todo={todo} onEdit={() => setIsEditing(true)} />
  );
}

function CardDetailView({ todo, onEdit }) {
  const { closeCard } = useBoard();
  const { moveTodo, deleteTodo } = useTodosContext().actions;

  const handleDelete = () => {
    deleteTodo(todo.id);
    closeCard();
  };

  return (
    <>
      <Modal.Title>{todo.text}</Modal.Title>
      <Modal.Body>
        <div className="status-picker" role="group" aria-label="상태 변경">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={todo.status === s.value ? 'tab active' : 'tab'}
              aria-pressed={todo.status === s.value}
              onClick={() => moveTodo(todo.id, s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <dl className="detail-info">
          <dt>상태</dt>
          <dd>{STATUS_LABEL[todo.status]}</dd>
          <dt>날짜</dt>
          <dd>{todo.date}</dd>
          <dt>카테고리</dt>
          <dd>{todo.category}</dd>
        </dl>
        {todo.memo ? (
          <p className="memo">{todo.memo}</p>
        ) : (
          <p className="memo empty">세부사항이 없어요.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" onClick={onEdit}>
          수정
        </button>
        <button type="button" onClick={handleDelete}>
          삭제
        </button>
        <Link to={`/todos/${todo.id}`}>상세 페이지</Link>
        <Modal.Close />
      </Modal.Footer>
    </>
  );
}

function CardEditView({ todo, onDone }) {
  const { updateTodo } = useTodosContext().actions;

  const handleSave = (changes) => {
    updateTodo(todo.id, changes);
    onDone();
  };

  return (
    <>
      <Modal.Title>카드 수정</Modal.Title>
      <Modal.Body>
        <TaskEditForm todo={todo} onSave={handleSave} onCancel={onDone} />
      </Modal.Body>
    </>
  );
}

export default CardModal;
