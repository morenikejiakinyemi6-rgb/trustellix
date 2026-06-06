import { useState } from 'react';
import { useHover } from '../hooks/useHover.js';
import { NAVY, BLUE_L, GREEN, FONT } from '../constants/theme.js';

const REAL_REPORTS = [
  {
    id: 1,
    platform: 'Reddit',
    source: 'r/Nigeria',
    link: 'https://www.reddit.com/r/Nigeria/search/?q=job+scam&sort=new',
    time: 'Ongoing thread',
    text: 'Multiple users on r/Nigeria report receiving fake recruitment emails claiming to be from Shell SPDC and TotalEnergies Nigeria. The emails request NIN and BVN before any interview, and use domains like shell-spdc-recruitment.com registered within the last 30 days.',
    verdict: 'CONFIRMED SCAM',
    verdictColor: '#991B1B',
    verdictBg: '#FEF2F2',
    verdictBorder: '#FECACA',
  },
  {
    id: 2,
    platform: 'Nairaland',
    source: 'Jobs Section',
    link: 'https://www.nairaland.com/jobs',
    time: 'Active discussion',
    text: 'A widely discussed thread on Nairaland documents how scammers post fake remote developer roles offering 400k to 800k monthly with no experience required. Victims are asked to complete a 2 week paid project before receiving an offer letter, then ghosted after submitting work.',
    verdict: 'FREE LABOR SCAM',
    verdictColor: '#9A3412',
    verdictBg: '#FFF7ED',
    verdictBorder: '#FED7AA',
  },
  {
    id: 3,
    platform: 'Twitter / X',
    source: '#JobScamNigeria',
    link: 'https://twitter.com/search?q=job+scam+Nigeria&f=live',
    time: 'Live feed',
    text: 'Trending reports on Twitter show a wave of fake Dangote Group and MTN Nigeria recruitment campaigns targeting 2023 and 2024 graduates. Applicants are asked to pay a 5,000 naira processing fee to receive an interview slot. No interview ever comes.',
    verdict: 'IDENTITY HARVEST',
    verdictColor: '#991B1B',
    verdictBg: '#FEF2F2',
    verdictBorder: '#FECACA',
  },
];

function ReportCard({ report }) {
  const [h, hh] = useHover();
  const [linkH, linkHH] = useHover();

  return (
    <div
      {...hh}
      style={{
        background: 'white', borderRadius: '14px', padding: '20px',
        border: '1.5px solid #CBD5E1', marginBottom: '14px',
        boxShadow: h ? '0 4px 18px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.2s, transform 0.2s',
        transform: h ? 'translateY(-2px)' : 'translateY(0)',
        fontFamily: FONT,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            padding: '4px 10px', background: '#EFF6FF',
            borderRadius: '6px', border: '1px solid #BFDBFE',
            fontSize: '12px', fontWeight: '700', color: '#1E40AF',
          }}>
            {report.platform}
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: NAVY }}>{report.source}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>{report.time}</div>
          </div>
        </div>
        <span style={{
          padding: '3px 10px', borderRadius: '20px',
          background: report.verdictBg, color: report.verdictColor,
          fontSize: '11px', fontWeight: '800',
          border: `1px solid ${report.verdictBorder}`,
          flexShrink: 0, marginLeft: '8px',
        }}>
          {report.verdict}
        </span>
      </div>

      <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: '1.7', margin: '0 0 12px' }}>
        {report.text}
      </p>

      <a href={report.link}
        target="_blank"
        rel="noreferrer"
        {...linkHH}
        style={{
          fontSize: '13px', color: linkH ? '#1D4ED8' : BLUE_L,
          textDecoration: linkH ? 'underline' : 'none',
          fontWeight: '600', display: 'inline-flex',
          alignItems: 'center', gap: '5px', transition: 'color 0.15s',
        }}
      >
        View community discussion
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
  );
}

function ReportForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [btnH, btnHH] = useHover();

  const handleSubmit = () => {
    if (text.trim().length > 20) {
      onSubmit(text);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setText('');
      }, 3000);
    }
  };

  if (submitted) {
    return (
      <div style={{
        background: '#ECFDF5', border: '1.5px solid #6EE7B7',
        borderRadius: '12px', padding: '28px', textAlign: 'center',
        fontFamily: FONT,
      }}>
        <div style={{
          width: '48px', height: '48px', background: GREEN,
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 14px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontWeight: '800', color: '#065F46', fontSize: '16px', marginBottom: '6px' }}>
          Report submitted
        </div>
        <div style={{ fontSize: '13px', color: '#059669' }}>
          Thank you for helping protect other job seekers. Returning shortly...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'white', borderRadius: '14px', padding: '24px',
      border: '1.5px solid #CBD5E1', fontFamily: FONT,
    }}>
      <div style={{ fontSize: '14px', fontWeight: '800', color: NAVY, marginBottom: '14px' }}>
        Report a scam you experienced
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe the job offer, who contacted you, what they asked for, and where you saw it..."
        rows={5}
        style={{
          width: '100%', padding: '13px', borderRadius: '8px',
          border: '1.5px solid #CBD5E1', fontSize: '14px',
          fontFamily: FONT, resize: 'vertical', outline: 'none',
          color: NAVY, lineHeight: '1.65',
          transition: 'border-color 0.15s', boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = BLUE_L}
        onBlur={e => e.target.style.borderColor = '#CBD5E1'}
      />
      <button
        onClick={handleSubmit}
        {...btnHH}
        style={{
          marginTop: '12px', padding: '12px 24px',
          background: text.trim().length > 20
            ? (btnH ? '#1D4ED8' : BLUE_L) : '#E2E8F0',
          color: text.trim().length > 20 ? 'white' : '#94A3B8',
          border: 'none', borderRadius: '8px',
          fontWeight: '700', fontSize: '14px',
          cursor: text.trim().length > 20 ? 'pointer' : 'not-allowed',
          fontFamily: FONT, transition: 'all 0.18s',
        }}
      >
        Submit Report
      </button>
    </div>
  );
}

function ArrowBtn({ dir, onClick }) {
  const [h, hh] = useHover();
  return (
    <button onClick={onClick} {...hh} style={{
      width: '36px', height: '36px', borderRadius: '50%',
      border: `1.5px solid ${h ? BLUE_L : '#CBD5E1'}`,
      background: h ? BLUE_L : 'white',
      color: h ? 'white' : '#374151',
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.15s',
      padding: 0,
    }}>
      {dir === -1 ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      )}
    </button>
  );
}

function ReportsCarousel({ userReports }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [linkH, linkHH] = useHover();

  const allReports = [...userReports, ...REAL_REPORTS];

  const go = (dir) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(prev => (prev + dir + allReports.length) % allReports.length);
      setAnimating(false);
    }, 200);
  };

  const report = allReports[current];

  return (
    <div>
      <div style={{
        fontSize: '12px', fontWeight: '700', color: '#64748B',
        marginBottom: '16px', textTransform: 'uppercase',
        letterSpacing: '0.08em', fontFamily: FONT,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>Active Scam Patterns From Real Communities</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {allReports.map((_, i) => (
            <span key={i} onClick={() => setCurrent(i)} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: i === current ? BLUE_L : '#CBD5E1',
              cursor: 'pointer', transition: 'background 0.2s', display: 'block',
            }} />
          ))}
        </div>
      </div>

      <div style={{
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateX(20px)' : 'translateX(0)',
        transition: 'all 0.2s ease',
      }}>
        <div style={{
          background: 'white', borderRadius: '14px', padding: '24px',
          border: '1.5px solid #CBD5E1', fontFamily: FONT, minHeight: '220px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                padding: '4px 10px', background: '#EFF6FF',
                borderRadius: '6px', border: '1px solid #BFDBFE',
                fontSize: '12px', fontWeight: '700', color: '#1E40AF',
              }}>
                {report.platform}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: NAVY }}>{report.source}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '1px' }}>{report.time}</div>
              </div>
            </div>
            <span style={{
              padding: '3px 10px', borderRadius: '20px',
              background: report.verdictBg, color: report.verdictColor,
              fontSize: '11px', fontWeight: '800',
              border: `1px solid ${report.verdictBorder}`,
              flexShrink: 0,
            }}>
              {report.verdict}
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: '#374151', lineHeight: '1.7', margin: '0 0 14px' }}>
            {report.text}
          </p>

          {report.link && (
            <a href={report.link} target="_blank" rel="noreferrer" {...linkHH} style={{
              fontSize: '13px', color: linkH ? '#1D4ED8' : BLUE_L,
              textDecoration: linkH ? 'underline' : 'none',
              fontWeight: '600', display: 'inline-flex',
              alignItems: 'center', gap: '5px', transition: 'color 0.15s',
            }}>
              View community discussion
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '14px', justifyContent: 'flex-end' }}>
        <ArrowBtn dir={-1} onClick={() => go(-1)} />
        <ArrowBtn dir={1} onClick={() => go(1)} />
      </div>
    </div>
  );
}

export default function ReportsSection() {
  const [userReports, setUserReports] = useState([]);

  const handleNewReport = (text) => {
    const newReport = {
      id: Date.now(),
      platform: 'Community',
      source: 'Anonymous',
      link: null,
      time: 'Just now',
      text,
      verdict: 'REPORTED',
      verdictColor: '#374151',
      verdictBg: '#F1F5F9',
      verdictBorder: '#CBD5E1',
    };
    setUserReports(prev => [newReport, ...prev]);
  };

  return (
    <section
      id="reports"
      style={{ padding: '70px 6%', background: '#F8FAFC' }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: NAVY, marginBottom: '14px', letterSpacing: '-0.5px', fontFamily: FONT }}>
            Community Scam Reports
          </h2>
          <p style={{ fontSize: '16px', color: '#374151', maxWidth: '540px', margin: '0 auto', lineHeight: '1.75', fontFamily: FONT }}>
            Real scam patterns actively discussed across Nigerian job seeker communities.
            Report one you encountered and earn Pro credits.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px', alignItems: 'flex-start',
        }}>
          <div>
            <div style={{
              background: '#DBEAFE', borderRadius: '12px',
              padding: '20px', border: '1.5px solid #BFDBFE', marginBottom: '24px',
              fontFamily: FONT,
            }}>
              <div style={{ fontWeight: '800', fontSize: '15px', color: '#1E40AF', marginBottom: '8px' }}>
                Earn rewards for reporting
              </div>
              <p style={{ fontSize: '14px', color: '#1E40AF', lineHeight: '1.7', margin: 0 }}>
                50 points per verified scam report. 500 points unlocks one month of Pro for free.
                Your identity stays completely anonymous.
              </p>
            </div>
            <ReportForm onSubmit={handleNewReport} />
          </div>

          <div>
            <ReportsCarousel userReports={userReports} />
          </div>
        </div>
      </div>
    </section>
  );
}