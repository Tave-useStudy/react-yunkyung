import { useBoardState } from './BoardContext';

// 컬럼들을 가로로 늘어놓는 틀. 어떤 컬럼이 몇 개 들어올지는 모르고 children을 그대로 배치만 한다.
// 검색 결과를 계산하는 동안(isPending)은 이전 목록을 흐리게 보여 준다.
function Board({ children }) {
  const { isPending } = useBoardState();
  return (
    <div className="board" aria-busy={isPending}>
      {children}
    </div>
  );
}

export default Board;
