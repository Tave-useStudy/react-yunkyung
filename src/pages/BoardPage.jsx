import Board from '../components/board/Board';
import * as Column from '../components/board/Column';
import AddCardForm from '../components/board/AddCardForm';
import CardModal from '../components/board/CardModal';
import BoardProvider from '../components/board/BoardProvider';

// Kanban 보드: Board → Column → Card.
// 각 컬럼을 어떤 조각으로 구성할지는 이 페이지가 children으로 조립한다.
// '할 일' 컬럼에만 카드 추가 폼이 있지만, 그걸 위한 prop은 없다 — Footer를 넣느냐 마느냐일 뿐.
function BoardPage() {
  return (
    <BoardProvider>
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
      <CardModal />
    </BoardProvider>
  );
}

export default BoardPage;
