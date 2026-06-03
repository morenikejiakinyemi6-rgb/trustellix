import { useHover } from '../hooks/useHover.js';
import { NAVY, BLUE_L, FONT } from '../constants/theme.js';

export default function InstallModal({ onClose }) {
  const [closeH, closeHH] = useHover();
  const [dlH, dlHH] = useHover();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15,23,42,0.75)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '24px',
        fontFamily: FONT,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: '16px',
          padding: '36px', maxWidth: '500px', width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{
            width: '48px', height: '48px', background: BLUE_L,
            borderRadius: '12px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 28" fill="none">
              <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/>
              <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke={BLUE_L} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: NAVY, margin: 0, letterSpacing: '-0.3px' }}>
              Install Trustellix
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '3px 0 0' }}>
              Developer preview — Chrome setup guide
            </p>
          </div>
        </div>

        <div style={{
          background: '#DBEAFE', border: '1px solid #BFDBFE',
          borderRadius: '10px', padding: '14px 16px', marginBottom: '24px',
        }}>
          <p style={{ fontSize: '13.5px', color: '#1E40AF', margin: 0, fontWeight: '600', lineHeight: '1.6' }}>
            Trustellix is currently in developer preview. It will be available on the Chrome Web Store after the public launch.
            For now, install it manually using the steps below.
          </p>
        </div>

        {[
          'Download the Trustellix extension folder from our GitHub repository using the button below.',
          'Open Chrome and type chrome://extensions in the address bar, then press Enter.',
          'Turn on Developer Mode using the toggle in the top right corner of the extensions page.',
          'Click Load Unpacked and select the extension folder you just downloaded.',
          'The Trustellix shield icon will appear in your Chrome toolbar. You are now protected on every job site you visit.',
        ].map((text, i) => (
          <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '28px', height: '28px', background: BLUE_L,
              borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '1px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'white' }}>{i + 1}</span>
            </div>
            <p style={{ fontSize: '14px', color: '#374151', margin: 0, lineHeight: '1.65', paddingTop: '4px' }}>
              {text}
            </p>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '10px', marginTop: '28px' }}>
          <button {...dlHH} style={{
            flex: 1, padding: '13px',
            background: dlH ? '#1D4ED8' : BLUE_L,
            color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: '700', fontSize: '14px', cursor: 'pointer',
            fontFamily: FONT, transition: 'background 0.18s',
          }}>
            Download from GitHub
          </button>
          <button onClick={onClose} {...closeHH} style={{
            padding: '13px 20px',
            background: closeH ? '#F1F5F9' : 'white',
            color: '#374151',
            border: `1.5px solid ${closeH ? '#CBD5E1' : '#E2E8F0'}`,
            borderRadius: '8px', fontWeight: '600', fontSize: '14px',
            cursor: 'pointer', fontFamily: FONT, transition: 'all 0.18s',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}