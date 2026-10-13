import { memo } from 'react';
import * as Card from './Card';

// 보드에 올라가는 카드 한 장 = Card 조각들을 조립한 것.
// 5주차: 카드 1장을 옮기면 보드의 카드 40장이 조각까지 전부 다시 렌더링됐다 (Profiler: 261회).
// todo가 그대로인 카드는 건너뛰도록 memo. 안쪽 조각들은 바뀌지 않는 actions Context만 읽으므로
// 이 카드의 todo가 바뀌지 않는 한 다시 렌더링될 이유가 없다.
function KanbanCard({ todo }) {
  return (
    <Card.Root todo={todo}>
      <Card.Title />
      <Card.Meta />
      <Card.Actions>
        <Card.MoveBack />
        <Card.MoveForward />
      </Card.Actions>
    </Card.Root>
  );
}

export default memo(KanbanCard);
