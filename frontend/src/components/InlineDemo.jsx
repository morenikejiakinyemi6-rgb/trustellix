import { useState } from 'react';
import { NAVY, BLUE_L, GREEN, ORANGE, RED, FONT } from '../constants/theme.js';

const VERDICT_STYLES = {
  GREEN:  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', dot: GREEN,  label: 'Safe' },
  YELLOW: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', dot: ORANGE, label: 'Proceed with Caution' },
  RED:    { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: RED,    label: 'High Risk Detected' },
};

export default function InlineDemo() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isValid = text.trim().length >= 20;

  const handleScan = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/quickscan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Make sure the Trustellix backend is running on port 5001.');
    }
    setLoading(false);
  };

  const reset = () => { setResult(null); setText(''); setError(null); };

  const getVerdict = (riskScore) => {
    if (riskScore >= 61) return 'RED';
    if (riskScore >= 31) return 'YELLOW';
    return 'GREEN';
  };

  const verdict = result ? getVerdict(result.riskScore) : null;
  const safety = result ? Math.max(0, 100 - result.riskScore) : null;
  const vc = verdict ? VERDICT_STYLES[verdict] : null;

  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      padding: '28px', border: '1.5px solid #CBD5E1',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      fontFamily: FONT,
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          fontSize: '11px', fontWeight: '700', color: BLUE_L,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px',
        }}>
          Live Demo
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: NAVY, margin: 0, letterSpacing: '-0.2px' }}>
          Paste a job offer and see it analyzed
        </h3>
      </div>

      {!result && (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste any job offer, recruiter message, or suspicious email here..."
            rows={5}
            style={{
              width: '100%', padding: '14px', borderRadius: '8px',
              border: `1.5px solid ${text.length > 0 ? BLUE_L : '#E2E8F0'}`,
              fontSize: '14px', fontFamily: FONT, resize: 'none',
              outline: 'none', color: NAVY, lineHeight: '1.65',
              transition: 'border-color 0.15s', background: '#FAFBFC',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = BLUE_L}
            onBlur={e => e.target.style.borderColor = text.length > 0 ? BLUE_L : '#E2E8F0'}
          />
          <button
            onClick={handleScan}
            disabled={!isValid || loading}
            style={{
              marginTop: '12px', width: '100%', padding: '13px',
              background: isValid && !loading ? BLUE_L : '#E2E8F0',
              color: isValid && !loading ? 'white' : '#94A3B8',
              border: 'none', borderRadius: '8px',
              fontWeight: '700', fontSize: '15px',
              cursor: isValid && !loading ? 'pointer' : 'not-allowed',
              fontFamily: FONT, transition: 'all 0.18s',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'tsxSpin 0.7s linear infinite',
                }} />
                Analyzing...
              </>
            ) : 'Run Free Analysis'}
          </button>
          {error && (
            <p style={{ marginTop: '10px', fontSize: '13px', color: '#991B1B', lineHeight: '1.6' }}>
              {error}
            </p>
          )}
          <style>{`@keyframes tsxSpin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}

      {result && vc && (
        <div style={{
          padding: '20px', borderRadius: '12px',
          background: vc.bg, border: `1.5px solid ${vc.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: vc.dot, display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {verdict === 'GREEN' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {verdict === 'YELLOW' && (
                  <span style={{ color: 'white', fontWeight: '900', fontSize: '18px', lineHeight: 1 }}>!</span>
                )}
                {verdict === 'RED' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '16px', color: vc.text }}>{vc.label}</div>
                <div style={{ fontSize: '12px', color: vc.text, opacity: 0.7 }}>Trustellix Analysis</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '30px', fontWeight: '900', color: vc.dot, lineHeight: 1 }}>
                {safety}%
              </div>
              <div style={{
                fontSize: '10px', color: vc.text, opacity: 0.7,
                fontWeight: '700', letterSpacing: '0.06em',
              }}>
                SAFETY SCORE
              </div>
            </div>
          </div>

          {result.summary && (
            <p style={{
              fontSize: '13px', color: vc.text, opacity: 0.85,
              margin: '0 0 12px', lineHeight: '1.65',
            }}>
              {result.summary.replace(/-/g, ' ')}
            </p>
          )}

          {result.reasons?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {result.reasons.slice(0, 3).map((r, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '8px',
                  fontSize: '12.5px', color: vc.text,
                  opacity: 0.8, alignItems: 'flex-start',
                }}>
                  <span style={{ flexShrink: 0, color: vc.dot, fontWeight: '700', marginTop: '2px' }}>•</span>
                  <span>{r.replace(/-/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={reset}
            style={{
              width: '100%', padding: '10px',
              background: 'white', border: `1.5px solid ${vc.border}`,
              borderRadius: '7px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
              color: vc.text, fontFamily: FONT,
            }}
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}