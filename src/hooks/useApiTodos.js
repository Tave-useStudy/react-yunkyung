import { useEffect, useRef, useState } from 'react';
import { fetchApiTodos } from '../api/todos';

function toErrorMessage(error) {
  // fetch 자체가 실패(오프라인, DNS 등)하면 TypeError
  if (error instanceof TypeError) return '네트워크에 연결할 수 없어요.';
  return error.message;
}

// API 할 일 불러오기 요청의 상태(idle / loading / success / error)를 관리하는 Hook.
// 요청은 effect가 아니라 사용자가 버튼을 눌렀을 때(load 호출) 보낸다.
function useApiTodos() {
  // 로딩 / 에러 / 결과를 boolean 여러 개로 두면 "로딩 중이면서 에러" 같은 불가능한 조합이 생긴다
  // → status 하나로 상태를 표현한다
  const [request, setRequest] = useState({ status: 'idle' });
  const controllerRef = useRef(null);

  // 화면에서 사라질 때 진행 중인 요청을 취소한다 (네트워크 = 외부 시스템 정리)
  useEffect(() => () => controllerRef.current?.abort(), []);

  const load = async (excludeIds) => {
    // 이전 요청이 남아 있으면 취소 → 늦게 도착한 응답이 결과를 덮어쓰지 않는다
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setRequest({ status: 'loading' });
    try {
      const items = await fetchApiTodos({ signal: controller.signal, excludeIds });
      setRequest({ status: 'success', count: items.length });
      return items;
    } catch (error) {
      // 취소된 요청은 에러가 아니다
      if (error.name === 'AbortError') return null;
      setRequest({ status: 'error', message: toErrorMessage(error) });
      return null;
    }
  };

  return { ...request, load };
}

export default useApiTodos;
