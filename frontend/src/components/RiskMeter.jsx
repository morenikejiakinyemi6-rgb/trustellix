export default function RiskMeter({ score }) {
  const risk = Math.min(Math.max(score, 0), 100);
  const safety = 100 - risk;
  const color = risk >= 61 ? '#EF4444' : risk >= 31 ? '#F97316' : '#10B981';
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (risk / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
      <svg width="120" height="120" viewBox="0 0 108 108">
        <circle cx="54" cy="54" r="48" fill="none" stroke="#E2E8F0" strokeWidth="8"/>
        <circle cx="54" cy="54" r="48" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 54 54)"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.3s ease' }}
        />
        <text x="54" y="49" textAnchor="middle" fill={color} fontSize="22" fontWeight="900"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">{safety}%</text>
        <text x="54" y="64" textAnchor="middle" fill="#64748B" fontSize="9"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          letterSpacing="1" fontWeight="600">SAFETY</text>
      </svg>
    </div>
  );
}