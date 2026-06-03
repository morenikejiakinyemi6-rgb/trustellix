import { useHover } from '../hooks/useHover.js';
import { NAVY, BLUE_L, FONT } from '../constants/theme.js';
import AnalysisForm from './AnalysisForm.jsx';
import ResultsDashboard from './ResultsDashboard.jsx';

export default function ScanPage({ uiState, results, error, onScan, onBack }) {
  const [backH, backHH] = useHover();
  const [scanH, scanHH] = useHover();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: FONT }}>
      <div style={{ background: 'white', borderBottom: '1.5px solid #E2E8F0', padding: '0 6%' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', height: '60px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onBack}
            {...backHH}
            style={{
              background: backH ? '#F1F5F9' : 'white',
              border: `1.5px solid ${backH ? '#CBD5E1' : '#E2E8F0'}`,
              cursor: 'pointer', fontSize: '14px', color: '#374151',
              display: 'flex', alignItems: 'center', gap: '8px',
              fontWeight: '700', padding: '8px 16px', borderRadius: '8px',
              fontFamily: FONT, transition: 'all 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to home
          </button>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ fontWeight: '800', fontSize: '15px', color: NAVY }}>Scan a job offer</span>
        </div>
      </div>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '44px 6%' }}>
        {uiState !== 'result' && (
          <div style={{
            background: 'white', borderRadius: '16px', padding: '36px',
            border: '1.5px solid #CBD5E1', marginBottom: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: NAVY, marginBottom: '8px', letterSpacing: '-0.3px' }}>
              Paste the job offer or recruiter message
            </h2>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '26px', lineHeight: '1.65' }}>
              We check domain infrastructure and run AI threat analysis. Results appear in seconds.
            </p>
            <AnalysisForm onSubmit={onScan} isLoading={uiState === 'loading'} />
            {error && (
              <div style={{
                marginTop: '16px', padding: '14px 16px', borderRadius: '9px',
                background: '#FEF2F2', border: '1.5px solid #FECACA',
                color: '#991B1B', fontSize: '14px', fontWeight: '600',
              }}>
                {error}
              </div>
            )}
          </div>
        )}

        {uiState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{
              width: '42px', height: '42px',
              border: '3px solid #E2E8F0',
              borderTop: `3px solid ${BLUE_L}`,
              borderRadius: '50%',
              animation: 'scanSpin 0.8s linear infinite',
              margin: '0 auto 18px',
            }} />
            <p style={{ color: NAVY, fontSize: '17px', fontWeight: '700', marginBottom: '6px', fontFamily: FONT }}>
              Running full analysis...
            </p>
            <p style={{ color: '#64748B', fontSize: '14px', fontFamily: FONT }}>
              Scanning infrastructure and running AI threat detection
            </p>
            <style>{`@keyframes scanSpin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {uiState === 'result' && results && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '900', color: NAVY, letterSpacing: '-0.3px', fontFamily: FONT }}>
                Analysis Result
              </h2>
              <button
                {...scanHH}
                onClick={onBack}
                style={{
                  padding: '9px 20px',
                  background: scanH ? '#F1F5F9' : 'white',
                  color: '#374151',
                  border: `1.5px solid ${scanH ? '#CBD5E1' : '#E2E8F0'}`,
                  borderRadius: '8px', fontWeight: '600',
                  fontSize: '14px', cursor: 'pointer',
                  fontFamily: FONT, transition: 'all 0.18s',
                }}
              >
                Scan another
              </button>
            </div>
            <ResultsDashboard data={results} />
          </div>
        )}
      </div>
    </div>
  );
}