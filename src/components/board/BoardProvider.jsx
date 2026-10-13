import { useMemo, useState, useTransition } from 'react';
import { BoardActionsContext, BoardFilterContext, BoardStateContext } from './BoardContext';
import { EMPTY_FILTER } from '../../constants';

// 할 일 데이터(TodosContext)와 달리 모달 / 필터 state는 보드 페이지 안에서만 필요하므로 BoardPage에서만 감싼다.
function BoardProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  // 카드 목록에 적용되는 필터. 입력창의 글자(급한 업데이트)는 BoardSearch가 따로 갖고,
  // 여기는 startTransition 안에서만 바꾼다 → 목록 다시 그리기가 입력을 막지 않는다
  const [filter, setFilter] = useState(EMPTY_FILTER);
  const [isPending, startTransition] = useTransition();

  // setState / startTransition은 항상 같은 함수라 actions는 처음 한 번만 만들어진다
  const actions = useMemo(
    () => ({
      openCard: (id) => setSelectedId(id),
      closeCard: () => setSelectedId(null),
      applyFilter: (next) => startTransition(() => setFilter(next)),
    }),
    []
  );

  // Context value는 새 객체가 되는 순간 소비자가 전부 다시 렌더링되므로, 안의 값이 바뀔 때만 새로 만든다
  const state = useMemo(() => ({ selectedId, isPending }), [selectedId, isPending]);
  const filterValue = useMemo(() => ({ filter }), [filter]);

  return (
    <BoardActionsContext value={actions}>
      <BoardStateContext value={state}>
        <BoardFilterContext value={filterValue}>{children}</BoardFilterContext>
      </BoardStateContext>
    </BoardActionsContext>
  );
}

export default BoardProvider;
