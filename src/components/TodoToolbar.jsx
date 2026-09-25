import { CATEGORIES, CATEGORY_ALL, SORT_OPTIONS } from '../constants';

// 카테고리 필터 + 정렬 기준 select
function TodoToolbar({ category, sortBy, onCategoryChange, onSortChange }) {
  return (
    <div className="toolbar">
      <label>
        카테고리
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value={CATEGORY_ALL}>전체</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        정렬
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default TodoToolbar;
