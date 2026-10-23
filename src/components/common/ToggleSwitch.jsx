export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: '20px',
          height: '20px',
          cursor: 'pointer',
        }}
      />
      {label}
    </label>
  );
}
