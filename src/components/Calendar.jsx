import CalendarDay from './CalendarDay';
import { WEEKDAYS, buildMonthGrid, toDateKey, todayKey } from '../utils/date';

// 월 달력. 어떤 달을 보고 있는지 / 어떤 날이 선택됐는지는 부모(MainPage)가 정한다.
function Calendar({ month, selectedKey, countMap, onSelectDate, onMoveMonth, onToday }) {
  const cells = buildMonthGrid(month);
  const today = todayKey();

  return (
    <section className="calendar">
      <div className="calendar-head">
        <button type="button" className="nav-btn" onClick={() => onMoveMonth(-1)} aria-label="이전 달">
          ‹
        </button>
        <h2>
          {month.getFullYear()}년 {month.getMonth() + 1}월
        </h2>
        <button type="button" className="nav-btn" onClick={() => onMoveMonth(1)} aria-label="다음 달">
          ›
        </button>
        <button type="button" onClick={onToday}>
          오늘
        </button>
      </div>

      <div className="calendar-grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="calendar-weekday">
            {w}
          </div>
        ))}
        {cells.map((date, i) => {
          if (date === null) return <div key={`empty-${i}`} />;
          const key = toDateKey(date);
          return (
            <CalendarDay
              key={key}
              date={date}
              isToday={key === today}
              isSelected={key === selectedKey}
              count={countMap[key]}
              onSelect={() => onSelectDate(key)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default Calendar;
