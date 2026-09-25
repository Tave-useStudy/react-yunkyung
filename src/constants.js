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
