import useApiTodos from '../hooks/useApiTodos';
import { API_PAGE_SIZE } from '../api/todos';
import { useTodosContext } from '../state/TodosContext';

// JSONPlaceholder에서 할 일을 가져와 선택한 날짜에 추가한다.
// 버튼 → (로딩 스피너) → 결과 문구 / (에러 메시지 + 다시 시도)
function ApiImport({ onImport }) {
  const { todos } = useTodosContext().state;
  const { status, count, message, load } = useApiTodos();

  const handleLoad = async () => {
    // 이미 가져온 API 항목 id는 클릭했을 때만 필요하므로 렌더링마다 계산하지 않고 여기서 만든다
    const importedIds = new Set(
      todos.filter((todo) => todo.sourceId !== undefined).map((todo) => todo.sourceId)
    );
    const items = await load(importedIds);
    if (items?.length) onImport(items);
  };

  if (status === 'loading') {
    return (
      <div className="api-import" role="status">
        <span className="spinner" aria-hidden="true" />
        할 일을 불러오는 중...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="api-import" role="alert">
        <span className="warning">불러오지 못했어요. {message}</span>
        <button type="button" className="secondary-btn" onClick={handleLoad}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="api-import">
      <button type="button" className="secondary-btn" onClick={handleLoad}>
        API에서 할 일 {API_PAGE_SIZE}개 불러오기
      </button>
      {status === 'success' ? (
        <span className="api-result">
          {count > 0 ? `${count}개를 가져왔어요.` : '더 가져올 할 일이 없어요.'}
        </span>
      ) : null}
    </div>
  );
}

export default ApiImport;
