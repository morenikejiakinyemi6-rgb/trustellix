import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import InstallModal from './components/InstallModal.jsx';
import InlineDemo from './components/InlineDemo.jsx';
import PricingSection from './components/PricingSection.jsx';
import ReportsSection from './components/ReportsSection.jsx';
import ScanPage from './components/ScanPage.jsx';
import { useHover } from './hooks/useHover.js';
import { useWindowWidth } from './hooks/useWindowWidth.js';
import { NAVY, BLUE_L, GREEN, ORANGE, RED, FONT } from './constants/theme.js';
import { runVerification, runInfrastructureAudit } from './services/api.js';

export default function App() {
  const [page, setPage] = useState('home');
  const [uiState, setUiState] = useState('idle');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleScan = async (text) => {
    setUiState('loading');
    setError(null);
    setResults(null);
    try {
      const [verifyData, infraData] = await Promise.allSettled([
        runVerification(text),
        runInfrastructureAudit(text),
      ]);
      if (verifyData.status === 'rejected') {
        throw new Error(verifyData.reason?.message || 'Analysis failed.');
      }
      setResults({
        analysis: verifyData.value.analysis,
        extractedEntities: verifyData.value.extractedEntities,
        infrastructureData: infraData.status === 'fulfilled' ? infraData.value : null,
      });
      setUiState('result');
    } catch (err) {
      setError(err.message);
      setUiState('idle');
    }
  };

  if (page === 'scan') {
    return (
      <ScanPage
        uiState={uiState}
        results={results}
        error={error}
        onScan={handleScan}
        onBack={() => {
          setPage('home');
          setUiState('idle');
          setResults(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <>
      {showModal && <InstallModal onClose={() => setShowModal(false)} />}
      <Header onScan={() => setPage('scan')} onInstall={() => setShowModal(true)} />
      <LandingPage onStartScan={() => setPage('scan')} onInstall={() => setShowModal(true)} />
      <Footer />
    </>
  );
}

function LiveBadge({ verdict, safety, label, company, title, delay }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const colors = {
    GREEN:  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', dot: GREEN },
    YELLOW: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', dot: ORANGE },
    RED:    { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: RED },
  };
  const C = colors[verdict] || colors.YELLOW;

  return (
    <div style={{
      background: 'white', borderRadius: '8px', padding: '12px 14px',
      marginBottom: '8px', border: '1px solid #E2E8F0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(8px)',
      transition: 'all 0.5s ease',
      fontFamily: FONT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px', background: '#EFF6FF',
          borderRadius: '7px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          fontWeight: '800', fontSize: '13px', color: BLUE_L,
        }}>
          {company.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px', fontWeight: '700', color: '#1D4ED8',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>{company}</div>
        </div>
      </div>
      {show && (
        <div style={{
          marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '3px 9px', borderRadius: '5px',
          background: C.bg, border: `1px solid ${C.border}`,
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: C.dot, display: 'block', flexShrink: 0,
          }}></span>
          <span style={{ fontSize: '11.5px', fontWeight: '700', color: C.text }}>
            {safety}% Safe
          </span>
          <span style={{ fontSize: '11px', color: C.text, opacity: 0.75 }}>{label}</span>
        </div>
      )}
    </div>
  );
}

function HowItWorksCard({ item }) {
  const [h, hh] = useHover();
  return (
    <div
      {...hh}
      style={{
        display: 'flex', gap: '14px', padding: '18px',
        background: 'white', borderRadius: '12px',
        border: '1.5px solid #E2E8F0',
        boxShadow: h ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.2s',
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        alignItems: 'flex-start', fontFamily: FONT,
      }}
    >
      <div style={{
        width: '36px', height: '36px', background: item.bg,
        border: `1.5px solid ${item.border}`, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <span style={{
          width: '10px', height: '10px',
          borderRadius: '50%', background: item.dot, display: 'block',
        }}></span>
      </div>
      <div>
        <div style={{ fontWeight: '800', fontSize: '15px', color: item.text, marginBottom: '4px' }}>
          {item.title}
        </div>
        <p style={{ fontSize: '13.5px', color: '#374151', margin: 0, lineHeight: '1.65' }}>
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function LandingPage({ onStartScan, onInstall }) {
  const width = useWindowWidth();
  const mobile = width < 768;
  const [installH, installHH] = useHover();
  const [tryH, tryHH] = useHover();

  const mockJobs = [
    { verdict: 'GREEN',  safety: 98, label: 'Safe',      company: 'Flutterwave',           title: 'Backend Engineer, Payments',         delay: 500  },
    { verdict: 'RED',    safety: 12, label: 'High Risk',  company: 'Microsofft Solutions',  title: 'Remote Developer, Earn 500k Monthly', delay: 1100 },
    { verdict: 'YELLOW', safety: 62, label: 'Caution',    company: 'Didii Technologies',    title: 'Frontend Product Engineer',          delay: 1700 },
  ];

  const platforms = [
    'LinkedIn', 'Jobberman', 'Indeed Nigeria', 'MyJobMag',
    'NGCareers', 'HotNigerianJobs', 'NaijaJobs', 'Graduate Jobs Nigeria',
  ];

  const howItWorksItems = [
    {
      dot: GREEN, bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46',
      title: 'Safe',
      desc: 'Established company with clean domain infrastructure and no threat signals. Apply with confidence.',
    },
    {
      dot: ORANGE, bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412',
      title: 'Caution',
      desc: 'New or unverified company. No active scam signals found but limited history. Research before applying.',
    },
    {
      dot: RED, bg: '#FEF2F2', border: '#FECACA', text: '#991B1B',
      title: 'High Risk',
      desc: 'Active threat signals detected. This matches known scam patterns. Do not share any personal information.',
    },
  ];

  return (
    <div style={{ fontFamily: FONT, background: '#F8FAFC', color: NAVY }}>
      <style>{`
        @keyframes badgeFadeIn { from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);} }
        @keyframes marquee { 0%{transform:translateX(0);}100%{transform:translateX(-50%);} }
        @keyframes pulse { 0%,100%{transform:scale(1);}50%{transform:scale(1.05);} }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      <section style={{ padding: mobile ? '48px 6% 40px' : '80px 6% 60px', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: mobile ? '40px' : '72px',
          alignItems: 'center',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: '#DBEAFE', color: '#1E40AF', fontSize: '12.5px',
              fontWeight: '700', padding: '5px 14px', borderRadius: '20px',
              marginBottom: '22px', border: '1px solid #BFDBFE',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: BLUE_L, display: 'block', animation: 'pulse 2s infinite',
              }}></span>
              Free for Nigerian job seekers, always
            </div>

            <h1 style={{
              fontSize: mobile ? '34px' : 'clamp(34px, 4vw, 56px)',
              fontWeight: '900', lineHeight: '1.1',
              letterSpacing: '-0.8px', marginBottom: '20px', color: NAVY,
            }}>
              Know if a job is real<br />
              <span style={{ color: BLUE_L }}>before you apply</span>
            </h1>

            <p style={{
              fontSize: mobile ? '15px' : '17px',
              color: '#374151', lineHeight: '1.8', marginBottom: '32px',
            }}>
              Trustellix scans every job listing you browse automatically,
              checking domain age, email infrastructure, and AI threat patterns.
              Green means safe. Orange means check twice. Red means stay away.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '22px' }}>
              <button
                onClick={onInstall}
                {...installHH}
                style={{
                  padding: '13px 26px',
                  background: installH ? '#1D4ED8' : BLUE_L,
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontWeight: '700', fontSize: '15px', cursor: 'pointer',
                  fontFamily: FONT, transition: 'background 0.18s',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="8 17 12 21 16 17"/>
                  <line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
                </svg>
                Add to Chrome, it is free
              </button>

              <button
                onClick={onStartScan}
                {...tryHH}
                style={{
                  padding: '13px 26px',
                  background: tryH ? '#F1F5F9' : 'white',
                  color: NAVY,
                  border: `1.5px solid ${tryH ? '#CBD5E1' : '#E2E8F0'}`,
                  borderRadius: '8px', fontWeight: '600', fontSize: '15px',
                  cursor: 'pointer', fontFamily: FONT, transition: 'all 0.18s',
                }}
              >
                Try the scanner
              </button>
            </div>

            <div style={{ display: 'flex', gap: mobile ? '12px' : '20px', flexWrap: 'wrap' }}>
              {['No account needed', 'Works in 60 seconds', 'Free forever'].map(t => (
                <div key={t} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', color: '#1E40AF', fontWeight: '700',
                }}>
                  <span style={{
                    width: '18px', height: '18px', background: '#DBEAFE',
                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '10px', fontWeight: '900', flexShrink: 0,
                  }}>✓</span>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <InlineDemo />
        </div>
      </section>

      <div style={{
        overflow: 'hidden',
        borderTop: '1.5px solid #E2E8F0',
        borderBottom: '1.5px solid #E2E8F0',
        background: 'white', padding: '14px 0',
      }}>
        <div style={{
          display: 'flex', width: 'max-content',
          animation: 'marquee 22s linear infinite',
        }}>
          {[...platforms, ...platforms].map((p, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '0 28px', fontSize: '13px', fontWeight: '600',
              color: '#475569', whiteSpace: 'nowrap', fontFamily: FONT,
            }}>
              <span style={{
                width: '5px', height: '5px', borderRadius: '50%',
                background: BLUE_L, display: 'block', flexShrink: 0,
              }}></span>
              {p}
            </span>
          ))}
        </div>
      </div>

      <section id="how-it-works" style={{ padding: '70px 6%', maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{
            fontSize: mobile ? '28px' : '36px', fontWeight: '900',
            color: NAVY, marginBottom: '14px', letterSpacing: '-0.5px', fontFamily: FONT,
          }}>
            How it looks on your feed
          </h2>
          <p style={{
            fontSize: '16px', color: '#374151',
            maxWidth: '520px', margin: '0 auto', lineHeight: '1.75', fontFamily: FONT,
          }}>
            Trustellix injects safety badges directly onto job listings as you scroll. No clicks. No extra windows.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: '48px', alignItems: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: '14px', overflow: 'hidden',
            border: '1.5px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              background: '#0A66C2', padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                background: 'white', borderRadius: '4px', padding: '3px 7px',
                fontWeight: '900', fontSize: '13px', color: '#0A66C2',
              }}>in</div>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
                Job listings on any platform
              </span>
            </div>
            <div style={{ padding: '14px 16px 10px' }}>
              {mockJobs.map((j, i) => <LiveBadge key={i} {...j} />)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {howItWorksItems.map(item => (
              <HowItWorksCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <ReportsSection />

      <section style={{ background: NAVY, padding: mobile ? '60px 6%' : '80px 6%', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            width: '60px', height: '60px', background: BLUE_L,
            borderRadius: '16px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/>
              <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke={BLUE_L} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={{
            fontSize: mobile ? '28px' : '38px', fontWeight: '900',
            color: 'white', marginBottom: '18px', letterSpacing: '-0.6px',
            lineHeight: '1.15', fontFamily: FONT,
          }}>
            Stop letting scammers steal your time, your data, and your confidence
          </h2>
          <p style={{ fontSize: '17px', color: '#94A3B8', marginBottom: '36px', lineHeight: '1.8', fontFamily: FONT }}>
            Thousands of Nigerian graduates apply to fake jobs every week. One install changes that for you permanently.
          </p>
          <CtaButton onClick={onInstall} />
          <div style={{
            marginTop: '20px', display: 'flex',
            gap: mobile ? '12px' : '24px', justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {['No account required', 'Works in 60 seconds', 'Free forever for job seekers'].map(t => (
              <span key={t} style={{ fontSize: '13.5px', color: '#64748B', fontWeight: '500', fontFamily: FONT }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CtaButton({ onClick }) {
  const [h, hh] = useHover();
  return (
    <button
      onClick={onClick}
      {...hh}
      style={{
        padding: '16px 36px',
        background: h ? '#1D4ED8' : BLUE_L,
        color: 'white', border: 'none', borderRadius: '9px',
        fontWeight: '700', fontSize: '16px', cursor: 'pointer',
        fontFamily: FONT, transition: 'background 0.18s',
      }}
    >
      Add to Chrome, it is free
    </button>
  );
}