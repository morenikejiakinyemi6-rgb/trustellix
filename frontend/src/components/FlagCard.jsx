const SEVERITY = {
  CRITICAL: { color: 'var(--red)',    bg: 'var(--red-light)',    dot: '#c42b0a' },
  HIGH:     { color: '#b85c00',       bg: '#fff3e0',             dot: '#b85c00' },
  MEDIUM:   { color: 'var(--yellow)', bg: 'var(--yellow-light)', dot: '#c47d00' },
  LOW:      { color: 'var(--green)',  bg: 'var(--green-light)',  dot: '#1a7a4a' },
};

export default function FlagCard({ field, finding, severity }) {
  const s = SEVERITY[severity] || SEVERITY.MEDIUM;
  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      padding: '14px',
      borderRadius: '8px',
      backgroundColor: 'var(--bg)',
      border: '1px solid var(--border)',
      alignItems: 'flex-start',
    }}>
      <div style={{
        marginTop: '5px',
        width: '7px', height: '7px',
        borderRadius: '50%',
        backgroundColor: s.dot,
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontWeight: '500',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
          }}>
            {field}
          </span>
          <span style={{
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            color: s.color,
            backgroundColor: s.bg,
            padding: '2px 8px',
            borderRadius: '3px',
            flexShrink: 0,
          }}>
            {severity}
          </span>
        </div>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: '1.5',
        }}>
          {finding}
        </p>
      </div>
    </div>
  );
}