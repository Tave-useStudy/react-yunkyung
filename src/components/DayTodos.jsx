import { useState } from 'react';
import TextInput from './TextInput';
import FilterTabs from './FilterTabs';
import TaskList from './TaskList';
import { CATEGORY_ALL } from '../constants';
import { filterTodos, sortTodos, countByStatus } from '../utils/todo';
import { formatDateKo } from '../utils/date';

// 달력 아래에 붙는 "선택한 날의 할 일" 영역.
// 부모가 key={dateKey}로 렌더링하므로 날짜를 바꾸면 입력창/탭 state가 초기화된다.
function DayTodos({ date, dateKey, todos, settings, onAdd, onToggle, onDelete }) {
  const [isAdding, setIsAdding] = useState(false);
  // 어떤 탭을 보고 있는지만 이 컴포넌트의 state로 관리 (정렬은 설정의 기본 정렬을 따른다)
  const [tab, setTab] = useState('all');

  // 그날의 할 일 → 탭 필터 → 정렬. 전부 todos에서 계산되는 derived state
  const dayTodos = todos.filter((todo) => todo.date === dateKey);
  const visibleTodos = sortTodos(
    filterTodos(dayTodos, { tab, category: CATEGORY_ALL }),
    settings.defaultSort
  );
  const counts = countByStatus(dayTodos);

  return (
    <section className="day-todos">
      <h2 className="day-title">{formatDateKo(date)}</h2>

      {isAdding ? (
        <TextInput
          key={settings.defaultCategory}
          onAdd={(input) => onAdd({ ...input, date: dateKey })}
          onClose={() => setIsAdding(false)}
          settings={settings}
        />
      ) : (
        <button type="button" className="primary-btn" onClick={() => setIsAdding(true)}>
          할 일 입력하기
        </button>
      )}

      {dayTodos.length === 0 ? (
        <p className="empty">첫 할 일을 추가해 보세요.</p>
      ) : (
        <>
          <FilterTabs active={tab} counts={counts} onChange={setTab} />
          <TaskList
            todos={visibleTodos}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </>
      )}
    </section>
  );
}

export default DayTodos;
