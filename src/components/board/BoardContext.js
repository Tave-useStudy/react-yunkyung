import { createContext, use } from 'react';

// 보드 화면 전용 UI state.
// 5주차: Context 값이 바뀌면 그 Context를 읽는 컴포넌트는 전부 다시 렌더링되므로,
// "언제 바뀌는지"가 다른 값끼리 나눴다 (Profiler로 확인하며 나눔).
//   BoardStateContext   — { selectedId, isPending } : 모달을 열 때 / 검색 계산 중일 때 바뀐다
//   BoardFilterContext  — { filter }                 : 검색 결과를 적용할 때만 바뀐다 (컬럼이 읽음)
//   BoardActionsContext — { openCard, closeCard, applyFilter } : 바뀌지 않는다 (카드 제목이 읽음)
// 하나로 묶여 있을 때는 모달을 열 때마다 카드 40장의 제목이 전부 다시 렌더링됐다.
export const BoardStateContext = createContext(null);
export const BoardFilterContext = createContext(null);
export const BoardActionsContext = createContext(null);

function useRequired(context, hookName) {
  const value = use(context);
  if (value === null) throw new Error(`${hookName}는 <BoardProvider> 안에서만 쓸 수 있습니다.`);
  return value;
}

export function useBoardState() {
  return useRequired(BoardStateContext, 'useBoardState');
}

export function useBoardFilter() {
  return useRequired(BoardFilterContext, 'useBoardFilter');
}

export function useBoardActions() {
  return useRequired(BoardActionsContext, 'useBoardActions');
}
