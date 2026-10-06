import { createContext, use } from 'react';

// Column.Root가 내려주는 값: { status, label, cards }
export const ColumnContext = createContext(null);

export function useColumn() {
  const context = use(ColumnContext);
  if (context === null) throw new Error('Column.* 컴포넌트는 <Column.Root> 안에서만 쓸 수 있습니다.');
  return context;
}
