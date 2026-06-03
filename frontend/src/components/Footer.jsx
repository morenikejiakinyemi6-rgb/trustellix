import { useHover } from '../hooks/useHover.js';
import { NAVY, BLUE_L, FONT } from '../constants/theme.js';

function FooterLink({ href, children }) {
  const [h, hh] = useHover();
  return (
    <a href={href} {...hh} style={{
      fontSize: '13px', color: h ? BLUE_L : '#64748B',
      textDecoration: 'none', fontWeight: '500',
      transition: 'color 0.15s', fontFamily: FONT,
    }}>
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer style={{
      padding: '36px 6%',
      borderTop: '1.5px solid #E2E8F0',
      background: 'white', fontFamily: FONT,
    }}>
      <div style={{
        maxWidth: '1160px', margin: '0 auto',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px', height: '30px', background: BLUE_L,
            borderRadius: '7px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 28" fill="none">
              <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/>
              <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke={BLUE_L} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: '800', fontSize: '16px', color: NAVY }}>Trustellix</span>
        </div>

        <div style={{ fontSize: '13px', color: '#64748B' }}>
          © 2026 Trustellix. Built for Nigerian job seekers.
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>
      </div>
    </footer>
  );
}