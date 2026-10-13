import { lazy, Suspense } from 'react';
import Board from '../components/board/Board';
import * as Column from '../components/board/Column';
import AddCardForm from '../components/board/AddCardForm';
import BoardSearch from '../components/board/BoardSearch';
import BoardProvider from '../components/board/BoardProvider';
import { useBoardState } from '../components/board/BoardContext';

// 5주차: 카드 모달은 카드를 처음 눌렀을 때 불러온다 (컴포넌트 단위 코드 스플리팅).
// 모달 + 수정 폼(TaskEditForm)은 보드를 처음 볼 때는 필요 없다.
const CardModal = lazy(() => import('../components/board/CardModal'));

// Kanban 보드: Board → Column → Card.
// 각 컬럼을 어떤 조각으로 구성할지는 이 페이지가 children으로 조립한다.
// '할 일' 컬럼에만 카드 추가 폼이 있지만, 그걸 위한 prop은 없다 — Footer를 넣느냐 마느냐일 뿐.
function BoardPage() {
  return (
    <BoardProvider>
      <div className="board-head">
        <h2>보드</h2>
        <p className="board-hint">
          <strong>카드 제목</strong>을 누르면 상세 보기 · <strong>버튼</strong>으로 다음 단계로 이동
        </p>
      </div>
      <BoardSearch />
      <Board>
        <Column.Root status="todo">
          <Column.Header />
          <Column.Cards />
          <Column.Footer>
            <AddCardForm />
          </Column.Footer>
        </Column.Root>

        <Column.Root status="doing">
          <Column.Header />
          <Column.Cards />
        </Column.Root>

        <Column.Root status="done">
          <Column.Header />
          <Column.Cards />
        </Column.Root>
      </Board>
      <CardModalSlot />
    </BoardProvider>
  );
}

// 카드를 골랐을 때만 모달 코드를 불러와서 그린다
function CardModalSlot() {
  const { selectedId } = useBoardState();
  if (selectedId === null) return null;
  return (
    <Suspense fallback={null}>
      <CardModal />
    </Suspense>
  );
}

export default BoardPage;
