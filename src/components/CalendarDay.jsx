import { memo } from 'react';
import { parseDateKey } from '../utils/date';

// 달력 한 칸. total / done은 그날 할 일 수 / 완료한 수 (할 일이 없으면 total = 0)
// 5주차: 날짜를 하나 고르거나 할 일 하나를 체크하면 한 달 31칸이 전부 다시 렌더링됐다 (Profiler).
// 실제로 바뀌는 칸은 1~2개라 memo로 나머지를 건너뛴다. memo는 props를 ===로 비교하므로
//   - Date 객체 대신 'YYYY-MM-DD' 문자열(dateKey)을 받는다 (Date는 렌더링마다 새 객체)
//   - { all, done } 객체 대신 숫자 두 개를 받는다 (countByDate가 매번 새 객체를 만든다)
//   - onSelect는 부모가 useCallback으로 고정한 함수를 그대로 받는다 (칸마다 화살표 함수를 만들지 않는다)
function CalendarDay({ dateKey, isToday, isSelected, total, done, onSelect }) {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  const classNames = ['calendar-day'];
  if (isToday) classNames.push('today');
  if (isSelected) classNames.push('selected');
  if (day === 0) classNames.push('sun');
  if (day === 6) classNames.push('sat');

  const allDone = total > 0 && done === total;

  return (
    <button
      type="button"
      className={classNames.join(' ')}
      onClick={() => onSelect(dateKey)}
      aria-pressed={isSelected}
      aria-label={`${date.getMonth() + 1}월 ${date.getDate()}일${total ? `, 할 일 ${total}개` : ''}`}
    >
      <span className="day-num">{date.getDate()}</span>
      {total ? (
        <span className={allDone ? 'day-count all-done' : 'day-count'}>
          {allDone ? '✓' : total - done}
        </span>
      ) : null}
    </button>
  );
}

export default memo(CalendarDay);
