// localStorage에는 { version, data } 형태로 저장한다.
// 저장 형식이 바뀌면 version을 올리고, 예전 형식은 migrate로 새 형식에 맞춰 읽는다.

export function readStorage(key, { version, fallback, migrate }) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return fallback;

    const parsed = JSON.parse(saved);
    if (parsed?.version === version) return parsed.data;

    // 버전이 없거나 다르면 예전 형식 → 옮길 수 있으면 옮기고, 아니면 기본값
    return migrate?.(parsed) ?? fallback;
  } catch {
    // JSON이 깨졌거나 localStorage 접근이 막힌 경우에도 앱은 기본값으로 동작
    return fallback;
  }
}

export function writeStorage(key, version, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ version, data }));
  } catch {
    // 저장 공간 부족 / 시크릿 모드 등: 저장만 실패하고 화면은 그대로 동작
  }
}
