import { useState, useRef, useCallback } from 'react';
import { NAVY, BLUE_L, GREEN, ORANGE, RED, FONT } from '../constants/theme.js';

const VERDICT_CONFIG = {
  LEGITIMATE:     { label: 'Safe',         dot: GREEN,  bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' },
  SUSPICIOUS:     { label: 'Caution',        dot: ORANGE, bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
  HIGH_RISK:      { label: 'High Risk',      dot: RED,    bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
  CONFIRMED_SCAM: { label: 'Confirmed Scam', dot: RED,    bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
};

function getConfigFromScore(riskScore) {
  if (riskScore >= 61) return { label: 'High Risk', dot: RED, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' };
  if (riskScore >= 31) return { label: 'Caution', dot: ORANGE, bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' };
  return { label: 'Safe', dot: GREEN, bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46' };
}

// Fixed: Now securely points to your Render backend to leverage your Groq key
async function extractTextFromImage(base64Image) {
  const response = await fetch('https://trustellix-backend.onrender.com/api/extract-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });
  
  if (!response.ok) throw new Error('Extraction route failed');
  const data = await response.json();
  if (data.text) return data.text;
  throw new Error('Could not extract text from image');
}

export default function InlineDemo() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractingImage, setExtractingImage] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' or 'image'
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);

  const isValid = text.trim().length >= 20;

  const handleImageFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(',')[1];
      setExtractingImage(true);
      setError(null);
      try {
        const extracted = await extractTextFromImage(base64);
        setText(extracted);
        setActiveTab('text');
      } catch {
        setError('Could not extract text from image. Please paste the job description as text instead.');
      }
      setExtractingImage(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        handleImageFile(file);
        return;
      }
    }
  }, [handleImageFile]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  }, [handleImageFile]);

  const handleScan = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
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

  const reset = () => { setResult(null); setText(''); setError(null); setImagePreview(null); };

  let displayData = null;
  if (result) {
    const analysis = result.analysis || {};
    const riskScore = analysis.riskScore ?? 0;
    const verdictKey = analysis.verdict || 'LEGITIMATE';
    const cfg = VERDICT_CONFIG[verdictKey] || getConfigFromScore(riskScore);
    const safety = Math.max(0, 100 - riskScore);
    const flags = analysis.structuralDiscrepancies || [];
    const anomalies = analysis.operationalAnomalies || [];
    const summary = analysis.executiveSummary || '';
    const cv = analysis.complianceValues || {};
    const positives = [];
    if (cv.domainAgeRisk === 'LOW') positives.push('Domain appears well-established');
    if (cv.emailAuthAlignment === 'ALIGNED') positives.push('Email domain matches company');
    if (cv.brandImpersonationLikelihood === 'LOW' && riskScore < 40) positives.push('No brand impersonation patterns detected');
    if (flags.length === 0) positives.push('No structural red flags found in this posting');
    if (riskScore < 20) positives.push('Job description is detailed and professional');
    displayData = { cfg, safety, riskScore, flags, anomalies, summary, positives, verdictKey };
  }

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1.5px solid #CBD5E1', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', fontFamily: FONT }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: BLUE_L, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
          Live Demo
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: NAVY, margin: 0, letterSpacing: '-0.2px' }}>
          Paste a job offer and see it analyzed
        </h3>
      </div>

      {!result && (
        <>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '14px', background: '#F1F5F9', borderRadius: '8px', padding: '4px' }}>
            {[['text', 'Paste Text'], ['image', 'Screenshot / Image']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                flex: 1, padding: '8px', borderRadius: '6px', border: 'none',
                background: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? NAVY : '#64748B',
                fontWeight: activeTab === tab ? '700' : '500',
                fontSize: '13px', cursor: 'pointer', fontFamily: FONT,
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s',
              }}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'text' && (
            <>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onPaste={handlePaste}
                placeholder="Paste any job offer, recruiter message, or suspicious email here... You can also paste a screenshot directly with Ctrl+V"
                rows={5}
                style={{
                  width: '100%', padding: '14px', borderRadius: '8px',
                  border: `1.5px solid ${text.length > 0 ? BLUE_L : '#E2E8F0'}`,
                  fontSize: '14px', fontFamily: FONT, resize: 'none',
                  outline: 'none', color: NAVY, lineHeight: '1.65',
                  transition: 'border-color 0.15s', background: '#FAFBFC', boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = BLUE_L}
                onBlur={e => e.target.style.borderColor = text.length > 0 ? BLUE_L : '#E2E8F0'}
              />
              {text.length === 0 && (
                <p style={{ fontSize: '12px', color: '#94A3B8', margin: '6px 0 0', textAlign: 'center' }}>
                  💡 You can also paste a screenshot directly — Ctrl+V while in the text box
                </p>
              )}
            </>
          )}

          {activeTab === 'image' && (
            <div
              ref={dropRef}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #CBD5E1', borderRadius: '10px',
                padding: '32px 20px', textAlign: 'center', cursor: 'pointer',
                background: '#F8FAFC', transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = BLUE_L}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleImageFile(e.target.files[0])}
              />
              {extractingImage ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                  <p style={{ fontSize: '14px', color: BLUE_L, fontWeight: '600', margin: 0 }}>
                    Extracting job details from screenshot...
                  </p>
                </div>
              ) : imagePreview ? (
                <div>
                  <img src={imagePreview} alt="Job screenshot" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '6px', marginBottom: '8px' }} />
                  <p style={{ fontSize: '13px', color: GREEN, fontWeight: '600', margin: 0 }}>
                    ✓ Text extracted. Switching to text tab...
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>📸</div>
                  <p style={{ fontSize: '14px', color: NAVY, fontWeight: '700', margin: '0 0 6px' }}>
                    Drop a job screenshot here
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 14px' }}>
                    or click to browse, or paste with Ctrl+V
                  </p>
                  <div style={{ display: 'inline-block', padding: '6px 16px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', fontSize: '12px', color: BLUE_L, fontWeight: '600' }}>
                    Upload Screenshot
                  </div>
                </div>
              )}
            </div>
          )}

          {text.length > 0 && (
            <button
              onClick={handleScan}
              disabled={!isValid || loading}
              style={{
                marginTop: '12px', width: '100%', padding: '13px',
                background: isValid && !loading ? BLUE_L : '#E2E8F0',
                color: isValid && !loading ? 'white' : '#94A3B8',
                border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '15px',
                cursor: isValid && !loading ? 'pointer' : 'not-allowed',
                fontFamily: FONT, transition: 'all 0.18s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid white', borderRadius: '50%', animation: 'tsxSpin 0.7s linear infinite' }} />
                  Analyzing with AI...
                </>
              ) : 'Run Free Analysis'}
            </button>
          )}

          {error && <p style={{ marginTop: '10px', fontSize: '13px', color: '#991B1B' }}>{error}</p>}
          <style>{`@keyframes tsxSpin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}

      {result && displayData && (
        <div>
          {/* Verdict header */}
          <div style={{ padding: '16px 18px', borderRadius: '12px', background: displayData.cfg.bg, border: `1.5px solid ${displayData.cfg.border}`, marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: displayData.summary ? '10px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: displayData.cfg.dot, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {displayData.safety >= 70
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span style={{ color: 'white', fontWeight: '900', fontSize: '16px' }}>!</span>}
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '15px', color: displayData.cfg.text }}>{displayData.cfg.label}</div>
                  <div style={{ fontSize: '11px', color: displayData.cfg.text, opacity: 0.7 }}>Trustellix AI Analysis</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: displayData.cfg.dot, lineHeight: 1 }}>{displayData.safety}%</div>
                <div style={{ fontSize: '9px', color: displayData.cfg.text, opacity: 0.7, fontWeight: '700', letterSpacing: '0.06em' }}>SAFETY SCORE</div>
              </div>
            </div>
            {displayData.summary && (
              <p style={{ fontSize: '13px', color: displayData.cfg.text, opacity: 0.9, margin: 0, lineHeight: '1.65' }}>
                {displayData.summary}
              </p>
            )}
          </div>

          {/* Positive indicators */}
          {displayData.positives.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#065F46', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✓ Positive Indicators
              </div>
              {displayData.positives.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '4px', fontSize: '12.5px', color: '#065F46', alignItems: 'flex-start' }}>
                  <span style={{ color: GREEN, flexShrink: 0 }}>●</span><span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {/* Red flags */}
          {displayData.flags.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#991B1B', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                ⚑ Red Flags Detected
              </div>
              {displayData.flags.slice(0, 4).map((f, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#991B1B' }}>{f.field}</span>
                    <span style={{ fontSize: '9px', fontWeight: '700', color: '#991B1B', background: '#FEE2E2', padding: '1px 6px', borderRadius: '3px', letterSpacing: '0.04em' }}>{f.severity}</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#7F1D1D' }}>{f.finding}</div>
                </div>
              ))}
            </div>
          )}

          {displayData.anomalies.length > 0 && displayData.flags.length === 0 && (
            <div style={{ marginBottom: '12px' }}>
              {displayData.anomalies.slice(0, 3).map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '4px', fontSize: '12.5px', color: '#9A3412' }}>
                  <span style={{ color: ORANGE, flexShrink: 0 }}>●</span><span>{a}</span>
                </div>
              ))}
            </div>
          )}

          {displayData.flags.length === 0 && displayData.anomalies.length === 0 && displayData.safety >= 80 && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12.5px', color: '#065F46', marginBottom: '12px' }}>
              No scam patterns, fee requests, or identity harvesting signals detected in this posting.
            </div>
          )}

          <button onClick={reset} style={{ width: '100%', padding: '10px', background: 'white', border: '1.5px solid #E2E8F0', borderRadius: '7px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: '#374151', fontFamily: FONT }}>
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
}