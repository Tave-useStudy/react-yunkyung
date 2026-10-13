import { useState } from 'react';
import { useBoardActions } from './BoardContext';
import { CATEGORIES, CATEGORY_ALL, EMPTY_FILTER } from '../../constants';

// 보드 검색 / 카테고리 필터.
// 입력창에 보이는 값(draft)은 여기서 바로(급하게) 바꾸고,
// 카드 목록에 적용하는 건 applyFilter(= startTransition)로 미룬다 — 급하지 않은 업데이트.
// 카드가 많아져도 글자가 입력창에 바로 찍히고, 목록은 React가 여유 있을 때 따라온다.
function BoardSearch() {
  const [draft, setDraft] = useState(EMPTY_FILTER);
  const { applyFilter } = useBoardActions();

  const update = (field, value) => {
    const next = { ...draft, [field]: value };
    setDraft(next); // 급함: 입력창
    applyFilter(next); // 급하지 않음: 카드 목록
  };

  return (
    <div className="board-search" role="search">
      <input
        type="text"
        value={draft.text}
        onChange={(e) => update('text', e.target.value)}
        placeholder="카드 검색"
        aria-label="카드 검색"
      />
      <select
        value={draft.category}
        onChange={(e) => update('category', e.target.value)}
        aria-label="카테고리 필터"
      >
        <option value={CATEGORY_ALL}>전체 카테고리</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BoardSearch;
