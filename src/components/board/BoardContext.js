import { createContext, use } from 'react';

// 보드 화면 전용 UI state: { selectedId, openCard, closeCard } — 지금 어떤 카드의 모달이 열려 있는지.
export const BoardContext = createContext(null);

export function useBoard() {
  const context = use(BoardContext);
  if (context === null) throw new Error('useBoard는 <BoardProvider> 안에서만 쓸 수 있습니다.');
  return context;
}
