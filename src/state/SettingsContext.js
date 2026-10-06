import { createContext, use } from 'react';

// 설정: { settings, setSettings }
export const SettingsContext = createContext(null);

export function useSettings() {
  const context = use(SettingsContext);
  if (context === null) {
    throw new Error('useSettings는 <SettingsProvider> 안에서만 쓸 수 있습니다.');
  }
  return context;
}
