import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

// useState처럼 쓰되, 값이 localStorage에 저장되어 새로고침해도 유지된다.
// const [settings, setSettings] = useLocalStorage('settings', DEFAULT_SETTINGS);
function useLocalStorage(key, initialValue, { version = 1, migrate } = {}) {
  // 함수로 넘겨서 첫 렌더에만 localStorage를 읽는다 (lazy init)
  const [value, setValue] = useState(() =>
    readStorage(key, { version, fallback: initialValue, migrate })
  );

  // localStorage(외부 시스템)와 동기화 — 값이 실제로 바뀐 경우에만 실행된다
  useEffect(() => {
    writeStorage(key, version, value);
  }, [key, version, value]);

  return [value, setValue];
}

export default useLocalStorage;
