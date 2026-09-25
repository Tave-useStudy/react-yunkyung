// React 19: ref를 forwardRef 없이 일반 prop으로 받는다.
function TextField({ ref, maxLength, value, onChange, ...rest }) {
  const isOverLimit = value.length > maxLength;

  return (
    <div className="text-field">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      <p className={isOverLimit ? 'count over' : 'count'}>
        {value.length} / {maxLength}
      </p>
      {isOverLimit ? (
        <p className="warning">최대 {maxLength}자까지 입력할 수 있습니다.</p>
      ) : null}
    </div>
  );
}

export default TextField;
