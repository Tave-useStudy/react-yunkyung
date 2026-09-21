import { useState } from 'react';

const MAX_LENGTH = 20;

function TextInput({ onAdd }) {
  const [text, setText] = useState('');

  const isOverLimit = text.length > MAX_LENGTH;
  const isEmpty = text.trim() === '';
  const isDisabled = isEmpty || isOverLimit;

  const handleSubmit = (e) => {
    e.preventDefault(); // form 기본 제출(새로고침) 방지
    if (isDisabled) return;
    onAdd(text.trim());
    setText('');
  };

  // form 안의 input에서 Enter를 누르면 submit 이벤트가 발생한다
  return (
    <form className="text-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button type="submit" disabled={isDisabled}>
        추가
      </button>
      <p className={isOverLimit ? 'count over' : 'count'}>
        {text.length} / {MAX_LENGTH}
      </p>
      {isOverLimit && (
        <p className="warning">최대 {MAX_LENGTH}자까지 입력할 수 있습니다.</p>
      )}
    </form>
  );
}

export default TextInput;
