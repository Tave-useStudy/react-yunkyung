import { useNavigate } from 'react-router-dom';
import { CATEGORIES, SORT_OPTIONS } from '../constants';

function SettingsPage({ settings, todos, onChangeSettings, onClearDone, onClearAll }) {
  const navigate = useNavigate();
  const doneCount = todos.filter((t) => t.done).length;

  // 객체 state는 spread로 새 객체를 만들어서 갱신
  const update = (field, value) =>
    onChangeSettings((prev) => ({ ...prev, [field]: value }));

  const handleClearAll = () => {
    if (!window.confirm(`할 일 ${todos.length}개를 모두 삭제할까요?`)) return;
    onClearAll();
    navigate('/');
  };

  return (
    <section className="settings">
      <h2>설정</h2>

      <h3>새 할 일 기본값</h3>
      <label>
        기본 카테고리
        <select
          value={settings.defaultCategory}
          onChange={(e) => update('defaultCategory', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label>
        기본 정렬
        <select
          value={settings.defaultSort}
          onChange={(e) => update('defaultSort', e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <h3>데이터 관리</h3>
      <div className="settings-actions">
        <button type="button" onClick={onClearDone} disabled={doneCount === 0}>
          완료한 할 일 삭제 ({doneCount})
        </button>
        <button type="button" onClick={handleClearAll} disabled={todos.length === 0}>
          전체 삭제
        </button>
      </div>
    </section>
  );
}

export default SettingsPage;
