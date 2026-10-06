// 컬럼들을 가로로 늘어놓는 틀. 어떤 컬럼이 몇 개 들어올지는 모르고 children을 그대로 배치만 한다.
function Board({ children }) {
  return <div className="board">{children}</div>;
}

export default Board;
