// 날짜는 state / URL 에 'YYYY-MM-DD' 문자열(dateKey)로 저장한다.
// Date 객체는 비교(===)가 안 되고 JSON 저장도 번거로워서, 계산할 때만 Date로 바꿔 쓴다.

export const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (n) => String(n).padStart(2, '0');

// toISOString()은 UTC 기준이라 한국 시간 자정~오전 9시에 하루 전 날짜가 나온다 → 로컬 기준으로 직접 만든다
export const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const toMonthKey = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const todayKey = () => toDateKey(new Date());

// URL에서 온 값은 믿을 수 없으므로 형식이 틀리거나 없는 날짜(2026-02-30)면 null
export function parseDateKey(key) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key ?? '')) return null;
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

export function parseMonthKey(key) {
  if (!/^\d{4}-\d{2}$/.test(key ?? '')) return null;
  const [y, m] = key.split('-').map(Number);
  if (m < 1 || m > 12) return null;
  return new Date(y, m - 1, 1);
}

export const addDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);

export const addMonths = (date, n) => new Date(date.getFullYear(), date.getMonth() + n, 1);

export const formatDateKo = (date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAYS[date.getDay()]})`;

// 달력 한 달치 칸. 1일 앞/말일 뒤의 빈칸은 null로 채워서 항상 7의 배수 길이가 된다.
export function buildMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const leading = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  const trailing = (7 - (cells.length % 7)) % 7;
  return [...cells, ...Array.from({ length: trailing }, () => null)];
}
