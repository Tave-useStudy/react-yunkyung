import { useMemo, useState } from 'react';
import { BoardContext } from './BoardContext';

// 할 일 데이터(TodosContext)와 달리 모달 열림 state는 보드 페이지 안에서만 필요하므로 BoardPage에서만 감싼다.
function BoardProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);

  const value = useMemo(
    () => ({
      selectedId,
      openCard: (id) => setSelectedId(id),
      closeCard: () => setSelectedId(null),
    }),
    [selectedId]
  );

  return <BoardContext value={value}>{children}</BoardContext>;
}

export default BoardProvider;
