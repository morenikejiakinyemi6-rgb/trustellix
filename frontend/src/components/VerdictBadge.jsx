const CONFIG = {
  CONFIRMED_SCAM: { label: 'Confirmed Scam',  color: '#991B1B', bg: '#FEF2F2', border: '#FECACA', dot: '#EF4444' },
  HIGH_RISK:      { label: 'High Risk',        color: '#9A3412', bg: '#FFF7ED', border: '#FED7AA', dot: '#F97316' },
  SUSPICIOUS:     { label: 'Suspicious',       color: '#854D0E', bg: '#FEFCE8', border: '#FDE68A', dot: '#EAB308' },
  LEGITIMATE:     { label: 'Legitimate',       color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', dot: '#10B981' },
};

export default function VerdictBadge({ verdict }) {
  const c = CONFIG[verdict] || CONFIG['SUSPICIOUS'];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '8px', background: c.bg, border: `1.5px solid ${c.border}`, color: c.color, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '15px', fontWeight: '800', letterSpacing: '0.01em' }}>
      <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: c.dot, flexShrink: 0, display: 'block' }}></span>
      {c.label}
    </div>
  );
}