import { FILTER_TABS } from '../constants';

// 전체 / 미완료 / 완료 탭. 활성 탭은 부모(DayTodos)의 state.
function FilterTabs({ active, counts, onChange }) {
  return (
    <div className="filter-tabs" role="tablist">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={active === tab.value}
          className={active === tab.value ? 'tab active' : 'tab'}
          onClick={() => onChange(tab.value)}
        >
          {tab.label} <span className="tab-count">{counts[tab.value]}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
