import { useState } from 'react';
import { NAVY, BLUE_L, GREEN, ORANGE, RED, FONT } from '../constants/theme.js';

const VERDICT_CONFIG = {
  LEGITIMATE: { verdict: 'GREEN', label: 'Safe', dot: GREEN, bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  SUSPICIOUS:  { verdict: 'YELLOW', label: 'Caution', dot: ORANGE, bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
  HIGH_RISK:   { verdict: 'RED', label: 'High Risk', dot: RED, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  CONFIRMED_SCAM: { verdict: 'RED', label: 'Confirmed Scam', dot: RED, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
};

// Also handle quickscan-style verdicts
const SCORE_CONFIG = (riskScore) => {
  if (riskScore >= 61) return { label: 'High Risk', dot: RED, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' };
  if (riskScore >= 31) return { label: 'Caution', dot: ORANGE, bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' };
  return { label: 'Safe', dot: GREEN, bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' };
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
      // Always use /verify for consistent, detailed AI results
      const res = await fetch('https://trustellix-backend.onrender.com/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Analysis failed. Please try again in a moment.');
    }
    setLoading(false);
  };

  const reset = () => { setResult(null); setText(''); setError(null); };

  // Parse result — /api/verify returns { analysis: {...}, extractedEntities: {...} }
  let displayData = null;
  if (result) {
    const analysis = result.analysis || {};
    const riskScore = analysis.riskScore ?? 0;
    const verdictKey = analysis.verdict || 'LEGITIMATE';
    const cfg = VERDICT_CONFIG[verdictKey] || SCORE_CONFIG(riskScore);
    const safety = Math.max(0, 100 - riskScore);
    const flags = analysis.structuralDiscrepancies || [];
    const anomalies = analysis.operationalAnomalies || [];
    const summary = analysis.executiveSummary || '';

    // Build positive indicators from compliance values
    const positives = [];
    const cv = analysis.complianceValues || {};
    if (cv.domainAgeRisk === 'LOW') positives.push('Domain appears established');
    if (cv.emailAuthAlignment === 'ALIGNED') positives.push('Email domain matches company');
    if (cv.brandImpersonationLikelihood === 'LOW') positives.push('No brand impersonation detected');
    if (flags.length === 0 && anomalies.length === 0) positives.push('No structural issues found');
    if (verdictKey === 'LEGITIMATE' && riskScore < 20) {
      positives.push('Job description appears professional');
      positives.push('Requirements are clear and specific');
    }

    displayData = { cfg, safety, riskScore, flags, anomalies, summary, positives, verdictKey };
  }

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
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTop: '2px solid white', borderRadius: '50%',
                  animation: 'tsxSpin 0.7s linear infinite',
                }} />
                Analyzing with AI...
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

      {result && displayData && (
        <div>
          {/* Verdict header */}
          <div style={{
            padding: '16px 18px', borderRadius: '12px',
            background: displayData.cfg.bg,
            border: `1.5px solid ${displayData.cfg.border}`,
            marginBottom: '14px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: displayData.cfg.dot,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {displayData.safety >= 70 ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{ color: 'white', fontWeight: '900', fontSize: '16px' }}>!</span>
                  )}
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: displayData.cfg.text }}>
                    {displayData.cfg.label}
                  </div>
                  <div style={{ fontSize: '11px', color: displayData.cfg.text, opacity: 0.7 }}>
                    Trustellix AI Analysis
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: displayData.cfg.dot, lineHeight: 1 }}>
                  {displayData.safety}%
                </div>
                <div style={{ fontSize: '9px', color: displayData.cfg.text, opacity: 0.7, fontWeight: '700', letterSpacing: '0.06em' }}>
                  SAFETY SCORE
                </div>
              </div>
            </div>
            {displayData.summary && (
              <p style={{ fontSize: '13px', color: displayData.cfg.text, opacity: 0.85, margin: 0, lineHeight: '1.65' }}>
                {displayData.summary}
              </p>
            )}
          </div>

          {/* Positive indicators */}
          {displayData.positives.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '10px', fontWeight: '700', color: '#065F46',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: GREEN }}>✓</span> Positive Indicators
              </div>
              {displayData.positives.map((p, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '8px', marginBottom: '5px',
                  fontSize: '12.5px', color: '#065F46', alignItems: 'flex-start',
                }}>
                  <span style={{ color: GREEN, flexShrink: 0, fontWeight: '700' }}>●</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {/* Red flags */}
          {(displayData.flags.length > 0 || displayData.anomalies.length > 0) && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{
                fontSize: '10px', fontWeight: '700', color: '#991B1B',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: RED }}>⚑</span> Red Flags Detected
              </div>
              {displayData.flags.slice(0, 4).map((f, i) => (
                <div key={i} style={{
                  padding: '8px 12px', borderRadius: '6px',
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  marginBottom: '6px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#991B1B' }}>{f.field}</span>
                    <span style={{
                      fontSize: '9px', fontWeight: '700', color: '#991B1B',
                      background: '#FEE2E2', padding: '1px 6px', borderRadius: '3px',
                      letterSpacing: '0.04em',
                    }}>
                      {f.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#7F1D1D' }}>{f.finding}</div>
                </div>
              ))}
              {displayData.anomalies.slice(0, 3).map((a, i) => (
                <div key={`a${i}`} style={{
                  display: 'flex', gap: '8px', marginBottom: '5px',
                  fontSize: '12px', color: '#9A3412', alignItems: 'flex-start',
                }}>
                  <span style={{ color: ORANGE, flexShrink: 0 }}>●</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          )}

          {/* No flags message */}
          {displayData.flags.length === 0 && displayData.anomalies.length === 0 && displayData.safety >= 80 && (
            <div style={{
              padding: '10px 14px', borderRadius: '8px',
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              fontSize: '12.5px', color: '#065F46', marginBottom: '12px',
            }}>
              No structural issues, fee requests, or scam patterns detected in this posting.
            </div>
          )}

          <button onClick={reset} style={{
            width: '100%', padding: '10px',
            background: 'white', border: '1.5px solid #E2E8F0',
            borderRadius: '7px', fontSize: '14px',
            fontWeight: '600', cursor: 'pointer',
            color: '#374151', fontFamily: FONT,
          }}>
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}

