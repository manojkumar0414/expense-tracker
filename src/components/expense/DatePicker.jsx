import { today, addDays, formatDateShort } from '../../utils/date.js';

export default function DatePicker({ value, onChange }) {
  const todayDate = today();
  const yesterdayDate = addDays(todayDate, -1);

  return (
    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
      <label
        style={{
          display: 'block',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-md)',
          fontWeight: '500',
        }}
      >
        Date
      </label>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
        <button
          onClick={() => onChange(todayDate)}
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: value === todayDate ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
            color: value === todayDate ? '#fff' : 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
          }}
        >
          Today
        </button>
        <button
          onClick={() => onChange(yesterdayDate)}
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: value === yesterdayDate ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
            color: value === yesterdayDate ? '#fff' : 'var(--color-text)',
            border: 'none',
            borderRadius: 'var(--border-radius)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
          }}
        >
          Yesterday
        </button>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--border-radius)',
            border: `1px solid var(--color-border)`,
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
          }}
        />
      </div>
    </div>
  );
}
