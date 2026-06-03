import { useState } from 'react';
import { useHover } from '../hooks/useHover.js';
import { useWindowWidth } from '../hooks/useWindowWidth.js';
import { NAVY, BLUE_L, FONT } from '../constants/theme.js';

function NavLink({ href, children }) {
  const [h, hh] = useHover();
  return (
    <a href={href} {...hh} style={{
      textDecoration: 'none', fontSize: '14px',
      color: h ? BLUE_L : '#475569', fontWeight: '500',
      transition: 'color 0.15s', fontFamily: FONT,
    }}>
      {children}
    </a>
  );
}

export default function Header({ onScan, onInstall }) {
  const width = useWindowWidth();
  const mobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const [installH, installHH] = useHover();
  const [scanH, scanHH] = useHover();

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(248,250,252,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid #E2E8F0',
      padding: '0 6%', fontFamily: FONT,
    }}>
      <div style={{
        maxWidth: '1160px', margin: '0 auto',
        height: '64px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: BLUE_L,
            borderRadius: '9px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 28" fill="none">
              <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/>
              <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke={BLUE_L} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: '800', fontSize: '19px', letterSpacing: '-0.4px', color: NAVY }}>
            Trustellix
          </span>
        </div>

        {mobile ? (
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px',
          }}>
            {[0,1,2].map(i => (
              <span key={i} style={{ width: '22px', height: '2px', background: NAVY, borderRadius: '2px', display: 'block' }} />
            ))}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <NavLink href="#how-it-works">How it works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#reports">Reports</NavLink>
            <button onClick={onScan} {...scanHH} style={{
              padding: '9px 18px', background: scanH ? '#F1F5F9' : 'white',
              color: NAVY, border: `1.5px solid ${scanH ? '#CBD5E1' : '#E2E8F0'}`,
              borderRadius: '8px', fontWeight: '600', fontSize: '14px',
              cursor: 'pointer', fontFamily: FONT, transition: 'all 0.18s',
            }}>
              Scan a job offer
            </button>
            <button onClick={onInstall} {...installHH} style={{
              padding: '9px 18px',
              background: installH ? '#1D4ED8' : BLUE_L,
              color: 'white', border: 'none', borderRadius: '8px',
              fontWeight: '700', fontSize: '14px', cursor: 'pointer',
              fontFamily: FONT, transition: 'background 0.18s',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polyline points="8 17 12 21 16 17"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
              </svg>
              Add to Chrome
            </button>
          </div>
        )}
      </div>

      {mobile && menuOpen && (
        <div style={{
          padding: '16px 0 20px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {[['How it works', '#how-it-works'], ['Pricing', '#pricing'], ['Reports', '#reports']].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              textDecoration: 'none', fontSize: '15px', color: '#374151',
              fontWeight: '500', fontFamily: FONT, padding: '4px 0',
            }}>{label}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); onInstall(); }} style={{
            padding: '12px', background: BLUE_L, color: 'white',
            border: 'none', borderRadius: '8px', fontWeight: '700',
            fontSize: '15px', cursor: 'pointer', fontFamily: FONT,
          }}>
            Add to Chrome, it is free
          </button>
        </div>
      )}
    </nav>
  );
}