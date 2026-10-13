import { memo } from 'react';
import { Link } from 'react-router';
import TrashIcon from './TrashIcon';
import { useTodoActions } from '../state/TodosContext';

// 한 줄짜리 할 일. 수정은 제목을 눌러 들어가는 상세 페이지에서 한다.
// 4주차: onToggle / onDelete를 App → MainPage → DayTodos → TaskList → TaskItem으로 내려받던 것을 Context로 바꿨다.
function TaskItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodoActions();
  return (
    <li className={todo.done ? 'task done' : 'task'}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => toggleTodo(todo.id)}
        aria-label={todo.done ? '미완료로 변경' : '완료로 변경'}
      />
      <Link to={`/todos/${todo.id}`} className="task-text">
        {todo.text}
      </Link>
      <span className="badge category">{todo.category}</span>
      {/* 아이콘만 있는 버튼이라 스크린리더용 이름(aria-label)과 툴팁(title)을 붙인다 */}
      <button
        type="button"
        className="icon-btn delete"
        onClick={() => deleteTodo(todo.id)}
        aria-label="삭제"
        title="삭제"
      >
        <TrashIcon />
      </button>
    </li>
  );
}

// 5주차: 할 일 하나를 체크하면 목록의 TaskItem이 전부(11개) 다시 렌더링됐다 (Profiler).
// todo prop이 그대로면(= 바뀌지 않은 할 일) 건너뛰도록 memo. 조작 함수는 바뀌지 않는 actions Context에서 꺼내므로
// props는 todo 하나뿐이고, reducer가 바뀐 할 일만 새 객체로 만들기 때문에 memo가 제대로 동작한다.
export default memo(TaskItem);
