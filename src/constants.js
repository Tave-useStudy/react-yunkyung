// 카테고리 / 정렬 / 필터 탭의 "정답 목록"을 한 곳에서 관리한다.
// select 옵션, 필터, 정렬이 전부 이 값을 기준으로 동작한다.

export const CATEGORIES = ['공부', '일정', '시험'];

export const SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'oldest', label: '오래된순' },
  { value: 'text', label: '가나다순' },
];

export const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '미완료' },
  { value: 'done', label: '완료' },
];

export const CATEGORY_ALL = 'all';

export const DEFAULT_SETTINGS = {
  defaultCategory: CATEGORIES[0],
  defaultSort: 'latest',
};

export const MAX_TEXT_LENGTH = 20;

export const MAX_MEMO_LENGTH = 500;

// 4주차: Kanban 보드의 컬럼 = 할 일의 진행 상태. 배열 순서가 곧 이동 순서(할 일 → 진행 중 → 완료)다.
export const STATUSES = [
  { value: 'todo', label: '할 일' },
  { value: 'doing', label: '진행 중' },
  { value: 'done', label: '완료' },
];

export const STATUS_LABEL = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));
