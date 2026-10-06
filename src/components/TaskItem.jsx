import { Link } from 'react-router-dom';
import TrashIcon from './TrashIcon';
import { useTodosContext } from '../state/TodosContext';

// 한 줄짜리 할 일. 수정은 제목을 눌러 들어가는 상세 페이지에서 한다.
// 4주차: onToggle / onDelete를 App → MainPage → DayTodos → TaskList → TaskItem으로 내려받던 것을 Context로 바꿨다.
function TaskItem({ todo }) {
  const { toggleTodo, deleteTodo } = useTodosContext().actions;
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

export default TaskItem;
