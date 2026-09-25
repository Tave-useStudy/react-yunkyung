import { useSearchParams } from 'react-router-dom';
import Calendar from '../components/Calendar';
import DayTodos from '../components/DayTodos';
import { addMonths, parseDateKey, parseMonthKey, toDateKey, toMonthKey } from '../utils/date';
import { countByDate } from '../utils/todo';

// 첫 화면: 위에는 달력, 아래에는 선택한 날의 할 일.
// 선택한 날짜 / 보고 있는 달은 state가 아니라 URL(?date=2026-09-25&month=2026-10)에 둔다
// → 새로고침하거나 상세 페이지에서 뒤로 와도 같은 화면이 유지된다.
function MainPage({ todos, settings, onAdd, onToggle, onDelete }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // 날짜를 아직 안 골랐거나 잘못된 값이면 selected는 null → 아래 할 일 영역을 숨긴다
  const selected = parseDateKey(searchParams.get('date'));
  const selectedKey = selected ? toDateKey(selected) : null;
  const month =
    parseMonthKey(searchParams.get('month')) ?? addMonths(selected ?? new Date(), 0);
  const countMap = countByDate(todos);

  // 날짜/달 이동은 방문 기록을 쌓지 않도록 replace
  const selectDate = (key) => setSearchParams({ date: key }, { replace: true });
  const moveMonth = (n) => {
    const next = { month: toMonthKey(addMonths(month, n)) };
    if (selectedKey) next.date = selectedKey;
    setSearchParams(next, { replace: true });
  };
  const goToday = () => selectDate(toDateKey(new Date()));

  return (
    <>
      <Calendar
        month={month}
        selectedKey={selectedKey}
        countMap={countMap}
        onSelectDate={selectDate}
        onMoveMonth={moveMonth}
        onToday={goToday}
      />
      {selected ? (
        <DayTodos
          key={selectedKey}
          date={selected}
          dateKey={selectedKey}
          todos={todos}
          settings={settings}
          onAdd={onAdd}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ) : (
        <p className="empty">날짜를 눌러 할 일을 적어 보세요.</p>
      )}
    </>
  );
}

export default MainPage;
