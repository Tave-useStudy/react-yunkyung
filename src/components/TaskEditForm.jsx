import { useState } from 'react';
import TextField from './TextField';
import { CATEGORIES, MAX_MEMO_LENGTH, MAX_TEXT_LENGTH } from '../constants';

// 편집 모드 전용 폼. 저장 전까지의 임시값(draft)은 이 컴포넌트가 로컬 state로 가진다.
// 취소하면 컴포넌트가 사라지면서 draft도 같이 버려진다.
function TaskEditForm({ todo, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    text: todo.text,
    category: todo.category,
    date: todo.date,
    memo: todo.memo,
  });

  const trimmed = draft.text.trim();
  const isInvalid =
    trimmed === '' ||
    draft.text.length > MAX_TEXT_LENGTH ||
    draft.memo.length > MAX_MEMO_LENGTH ||
    !draft.date;

  const updateDraft = (field, value) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;
    onSave({ ...draft, text: trimmed, memo: draft.memo.trim() });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancel();
  };

  return (
    <form className="task-edit" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <TextField
        value={draft.text}
        onChange={(value) => updateDraft('text', value)}
        maxLength={MAX_TEXT_LENGTH}
        aria-label="할 일 수정"
        autoFocus
      />
      <label className="memo-field">
        세부사항
        <textarea
          value={draft.memo}
          onChange={(e) => updateDraft('memo', e.target.value)}
          rows={6}
          placeholder="준비물, 범위, 장소 등 자세한 내용을 적어 보세요"
        />
        <span className={draft.memo.length > MAX_MEMO_LENGTH ? 'count over' : 'count'}>
          {draft.memo.length} / {MAX_MEMO_LENGTH}
        </span>
      </label>
      <div className="task-edit-options">
        <input
          type="date"
          value={draft.date}
          onChange={(e) => updateDraft('date', e.target.value)}
          aria-label="날짜"
        />
        <select
          value={draft.category}
          onChange={(e) => updateDraft('category', e.target.value)}
          aria-label="카테고리"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isInvalid}>
          저장
        </button>
        <button type="button" onClick={onCancel}>
          취소
        </button>
      </div>
    </form>
  );
}

export default TaskEditForm;
