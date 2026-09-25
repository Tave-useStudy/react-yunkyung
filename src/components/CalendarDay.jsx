// 달력 한 칸. count는 그날의 { all, done } (할 일이 없으면 undefined)
function CalendarDay({ date, isToday, isSelected, count, onSelect }) {
  const day = date.getDay();
  const classNames = ['calendar-day'];
  if (isToday) classNames.push('today');
  if (isSelected) classNames.push('selected');
  if (day === 0) classNames.push('sun');
  if (day === 6) classNames.push('sat');

  const allDone = count !== undefined && count.done === count.all;

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일${count ? `, 할 일 ${count.all}개` : ''}`}
    >
      <span className="day-num">{date.getDate()}</span>
      {count ? (
        <span className={allDone ? 'day-count all-done' : 'day-count'}>
          {allDone ? '✓' : count.all - count.done}
        </span>
      ) : null}
    </button>
  );
}

export default CalendarDay;
