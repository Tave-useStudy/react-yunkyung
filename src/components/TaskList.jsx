function TaskList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty">할 일이 없습니다.</p>;
  }

  return (
    <ul className="task-list">
      {todos.map((todo) => (
        <li key={todo.id} className={todo.done ? 'task done' : 'task'}>
          <span className="task-text">{todo.text}</span>
          <button type="button" onClick={() => onToggle(todo.id)}>
            {todo.done ? '취소' : '완료'}
          </button>
          <button type="button" onClick={() => onDelete(todo.id)}>
            삭제
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
