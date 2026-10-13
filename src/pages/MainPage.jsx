import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import Calendar from '../components/Calendar';
import DayTodos from '../components/DayTodos';
import { addMonths, parseDateKey, parseMonthKey, toDateKey, toMonthKey } from '../utils/date';
import { countByDate } from '../utils/todo';
import { useTodosState } from '../state/TodosContext';

// 첫 화면: 위에는 달력, 아래에는 선택한 날의 할 일.
// 선택한 날짜 / 보고 있는 달은 state가 아니라 URL(?date=2026-09-25&month=2026-10)에 둔다
// → 새로고침하거나 상세 페이지에서 뒤로 와도 같은 화면이 유지된다.
function MainPage() {
  const { todos } = useTodosState();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 날짜를 아직 안 골랐거나 잘못된 값이면 selected는 null → 아래 할 일 영역을 숨긴다
  const selected = parseDateKey(searchParams.get('date'));
  const selectedKey = selected ? toDateKey(selected) : null;
  const month =
    parseMonthKey(searchParams.get('month')) ?? addMonths(selected ?? new Date(), 0);

  // useMemo는 쓰지 않았다: CalendarDay는 숫자(total / done)만 받으므로 Map을 새로 만들어도 memo가 그대로 동작하고,
  // 할 일 수십 개를 세는 비용은 Profiler에서 보이지 않을 만큼 작다.
  const countMap = countByDate(todos);

  // 5주차 useCallback: memo(CalendarDay) 31칸에 그대로 내려가는 함수라 렌더링마다 같은 함수여야 한다.
  // setSearchParams는 URL이 바뀔 때마다 새 함수가 되므로, 같은 페이지 안에서는 바뀌지 않는 navigate를 쓴다.
  // 날짜/달 이동은 방문 기록을 쌓지 않도록 replace
  const selectDate = useCallback(
    (key) => navigate({ search: `?date=${key}` }, { replace: true }),
    [navigate]
  );
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
        />
      ) : (
        <p className="empty">날짜를 눌러 할 일을 적어 보세요.</p>
      )}
    </>
  );
}

export default MainPage;
