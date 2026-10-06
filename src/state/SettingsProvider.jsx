import { useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SettingsContext } from './SettingsContext';
import { DEFAULT_SETTINGS } from '../constants';

// 설정은 App → MainPage → DayTodos → TextInput까지 내려가야 했다 → Context로 바로 꺼내 쓴다
function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage('settings', DEFAULT_SETTINGS);
  const value = useMemo(() => ({ settings, setSettings }), [settings, setSettings]);
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export default SettingsProvider;
