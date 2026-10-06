import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import TaskEditForm from '../components/TaskEditForm';
import { useTodosContext } from '../state/TodosContext';
import { STATUS_LABEL } from '../constants';

function TodoDetailPage() {
  const {
    state: { todos },
    actions: { toggleTodo, deleteTodo, updateTodo },
  } = useTodosContext();
  const { id } = useParams(); // URL 파라미터는 항상 문자열
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 예전 할 일의 id는 숫자(Date.now()), 새 할 일은 문자열(UUID) → 문자열로 맞춰 비교
  const todo = todos.find((t) => String(t.id) === id);

  // 없는 id로 접근한 경우 먼저 걸러낸다
  if (!todo) {
    return (
      <section className="detail">
        <p className="empty">해당 할 일을 찾을 수 없습니다. (id: {id})</p>
        <Link to="/">목록으로</Link>
      </section>
    );
  }

  const handleDelete = () => {
    deleteTodo(todo.id);
    navigate(`/?date=${todo.date}`); // 삭제한 항목의 상세 페이지에 머무를 이유가 없으므로 그날 목록으로 이동
  };

  const handleSave = (changes) => {
    updateTodo(todo.id, changes);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <section className="detail">
        <h2>할 일 수정</h2>
        <TaskEditForm
          todo={todo}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      </section>
    );
  }

  return (
    <section className="detail">
      <h2 className={todo.done ? 'done' : ''}>{todo.text}</h2>
      <dl className="detail-info">
        <dt>날짜</dt>
        <dd>
          <Link to={`/?date=${todo.date}`}>{todo.date}</Link>
        </dd>
        <dt>상태</dt>
        <dd>{STATUS_LABEL[todo.status]}</dd>
        <dt>카테고리</dt>
        <dd>{todo.category}</dd>
        <dt>생성일</dt>
        <dd>{new Date(todo.createdAt).toLocaleString('ko-KR')}</dd>
      </dl>
      <h3 className="memo-title">세부사항</h3>
      {todo.memo ? (
        <p className="memo">{todo.memo}</p>
      ) : (
        <p className="memo empty">아직 세부사항이 없어요. 수정을 눌러 적어 보세요.</p>
      )}
      <div className="detail-actions">
        <button type="button" onClick={() => toggleTodo(todo.id)}>
          {todo.done ? '미완료로 변경' : '완료로 변경'}
        </button>
        <button type="button" onClick={() => setIsEditing(true)}>
          수정
        </button>
        <button type="button" onClick={handleDelete}>
          삭제
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          뒤로
        </button>
      </div>
    </section>
  );
}

export default TodoDetailPage;
