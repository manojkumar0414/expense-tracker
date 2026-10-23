export default function AmountInput({ value, onChange, autoFocus = false }) {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue === '' || inputValue === '.') {
      onChange(0);
    } else {
      const amount = Math.round(parseFloat(inputValue));
      if (!isNaN(amount) && amount >= 0) {
        onChange(amount);
      }
    }
  };

  return (
    <>
      <style>{`
        .amount-input::-webkit-outer-spin-button,
        .amount-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .amount-input {
          -moz-appearance: textfield;
        }
      `}</style>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontSize: 'var(--font-size-md)',
            fontWeight: '500',
          }}
        >
          Amount
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}
        >
          <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>₹</span>
          <input
            className="amount-input"
            type="number"
            inputMode="decimal"
            value={value || ''}
            onChange={handleChange}
            autoFocus={autoFocus}
            placeholder="0"
            style={{
              flex: 1,
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '600',
              border: 'none',
              borderBottom: `2px solid var(--color-primary)`,
              padding: 'var(--spacing-md) var(--spacing-sm)',
              backgroundColor: 'transparent',
              color: 'var(--color-text)',
              minHeight: '48px',
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </>
  );
}
