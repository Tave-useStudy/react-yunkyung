import { useState } from 'react';
import TextInput from '../TextInput';
import { useColumn } from './ColumnContext';
import { useTodosContext } from '../../state/TodosContext';
import { todayKey } from '../../utils/date';

// 컬럼에 카드 추가. 어느 컬럼의 Footer에 넣느냐에 따라 그 상태로 추가된다.
// 기존 할 일 입력 폼(TextInput)을 그대로 재사용한다.
function AddCardForm() {
  const [isAdding, setIsAdding] = useState(false);
  const { status } = useColumn();
  const { addTodo } = useTodosContext().actions;

  if (!isAdding) {
    return (
      <button type="button" className="secondary-btn add-card-btn" onClick={() => setIsAdding(true)}>
        + 카드 추가
      </button>
    );
  }

  return (
    <TextInput
      onAdd={(input) => addTodo({ ...input, date: todayKey(), status })}
      onClose={() => setIsAdding(false)}
    />
  );
}

export default AddCardForm;
