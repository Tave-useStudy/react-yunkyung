import TaskItem from './TaskItem';

function TaskList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty">표시할 할 일이 없습니다.</p>;
  }

  return (
    <ul className="task-list">
      {todos.map((todo) => (
        <TaskItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
