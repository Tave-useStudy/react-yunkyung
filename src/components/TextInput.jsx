import { useRef, useState } from 'react';
import TextField from './TextField';
import { CATEGORIES, MAX_TEXT_LENGTH } from '../constants';

// 새 할 일 입력 폼. 기본 카테고리는 설정 페이지의 값(settings)을 따른다.
// '할 일 입력하기' 버튼으로 열리므로 열리자마자 입력창에 포커스하고, 닫기는 부모가 처리한다.
function TextInput({ onAdd, onClose, settings }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState(settings.defaultCategory);
  const inputRef = useRef(null);

  const trimmed = text.trim();
  const isDisabled = trimmed === '' || text.length > MAX_TEXT_LENGTH;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isDisabled) return;

    onAdd({ text: trimmed, category });
    setText('');
    inputRef.current?.focus(); // 버튼 클릭으로 추가해도 다시 입력창에 포커스
  };

  return (
    <form className="text-input" onSubmit={handleSubmit}>
      <TextField
        ref={inputRef}
        value={text}
        onChange={setText}
        maxLength={MAX_TEXT_LENGTH}
        placeholder="할 일을 입력하세요"
        aria-label="할 일"
        autoFocus
      />
      <div className="text-input-options">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="카테고리"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isDisabled}>
          추가
        </button>
        <button type="button" onClick={onClose}>
          닫기
        </button>
      </div>
    </form>
  );
}

export default TextInput;
