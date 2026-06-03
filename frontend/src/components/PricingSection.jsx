import { useState } from 'react';
import { useHover } from '../hooks/useHover.js';
import { NAVY, BLUE_L, GREEN, FONT } from '../constants/theme.js';

const USER_PLANS = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    cta: 'Install now, it is free',
    features: [
      'Chrome extension on LinkedIn and Jobberman',
      'Safety badge while scrolling, zero clicks',
      'Basic verdict: Safe, Caution, or High Risk',
      'Up to 5 manual scans per day',
    ],
    highlight: false,
    badge: null,
  },
  {
    name: 'Pro',
    price: '1,500',
    period: 'per month',
    cta: 'Get full protection',
    features: [
      'Everything in Free',
      'Deep AI forensic report on any offer, full reasoning',
      'Email and WhatsApp message analysis',
      'Real time alerts when new jobs in your field post',
      'Contract and offer letter red flag scanner',
      'Unlimited manual scans, no daily cap',
      'Full scan history, exportable report for references',
      'Priority support within 24 hours',
    ],
    highlight: true,
    badge: 'Most Popular',
  },
];

const ORG_PLANS = [
  {
    name: 'Brand Shield',
    price: '150,000',
    target: 'Your company name is being used by scammers right now. We stop it.',
    features: [
      'Gold Verified badge on every one of your job listings across all platforms',
      'Instant alerts when a fake listing impersonating your brand is detected',
      'Monthly report of scam activity using your company name',
      'Your domain added to our permanent verified whitelist',
      'Top placement in our verified employer directory',
    ],
    highlight: false,
  },
  {
    name: 'Platform API',
    price: '300,000',
    target: 'Screen every listing before it goes live. One API call. No engineering team needed.',
    features: [
      '50,000 automated listing screenings per month',
      'Verdict returned in under 3 seconds per listing',
      'Full JSON payload: risk score, threat flags, domain data',
      'Webhook support for instant publish blocking',
      'Real time threat analytics dashboard',
      'Quarterly threat intelligence report for your market',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    target: 'Built around your infrastructure. Any scale, any platform.',
    features: [
      'Unlimited API calls with guaranteed uptime SLA',
      'White label: your brand, our engine',
      'Custom Nigerian threat model training on your data',
      'Dedicated integration engineer assigned to your team',
      'Legal and compliance documentation package included',
    ],
    highlight: false,
  },
];

function UserPlanCard({ plan }) {
  const [h, hh] = useHover();
  const [btnH, btnHH] = useHover();

  return (
    <div
      {...hh}
      style={{
        background: plan.highlight ? BLUE_L : 'white',
        borderRadius: '16px', padding: '32px',
        border: plan.highlight ? 'none' : '1.5px solid #CBD5E1',
        boxShadow: plan.highlight
          ? '0 8px 32px rgba(37,99,235,0.3)'
          : h ? '0 6px 24px rgba(0,0,0,0.1)' : 'none',
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: h ? 'translateY(-4px)' : 'translateY(0)',
        fontFamily: FONT,
      }}
    >
      <div style={{
        fontSize: '12px', fontWeight: '800',
        color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#64748B',
        marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>
        {plan.name}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '4px' }}>
        <span style={{ fontSize: '15px', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#64748B', fontWeight: '700' }}>₦</span>
        <span style={{ fontSize: '40px', fontWeight: '900', color: plan.highlight ? 'white' : NAVY, letterSpacing: '-1.5px', lineHeight: 1 }}>
          {plan.price}
        </span>
      </div>

      <div style={{ fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginBottom: '28px' }}>
        {plan.period}
      </div>

      {plan.features.map(f => (
        <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
          <span style={{ color: plan.highlight ? 'white' : GREEN, fontWeight: '900', fontSize: '13px', marginTop: '2px', flexShrink: 0 }}>✓</span>
          <span style={{ fontSize: '14px', color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#374151', lineHeight: '1.5' }}>{f}</span>
        </div>
      ))}

      <button
        {...btnHH}
        style={{
          marginTop: '22px', width: '100%', padding: '13px',
          borderRadius: '8px',
          border: plan.highlight ? '1.5px solid rgba(255,255,255,0.3)' : `1.5px solid ${BLUE_L}`,
          background: plan.highlight
            ? (btnH ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.12)')
            : (btnH ? BLUE_L : 'white'),
          color: plan.highlight ? 'white' : (btnH ? 'white' : BLUE_L),
          fontWeight: '700', fontSize: '14px', cursor: 'pointer',
          fontFamily: FONT, transition: 'all 0.18s',
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
}

function OrgPlanCard({ plan }) {
  const [h, hh] = useHover();

  return (
    <div
      {...hh}
      style={{
        background: plan.highlight ? BLUE_L : 'white',
        borderRadius: '16px', padding: '28px',
        border: plan.highlight ? 'none' : '1.5px solid #CBD5E1',
        boxShadow: plan.highlight
          ? '0 8px 32px rgba(37,99,235,0.3)'
          : h ? '0 6px 24px rgba(0,0,0,0.1)' : 'none',
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: h ? 'translateY(-4px)' : 'translateY(0)',
        display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      }}
    >
      <div style={{
        fontSize: '11px', fontWeight: '800',
        color: plan.highlight ? 'rgba(255,255,255,0.6)' : BLUE_L,
        marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>
        {plan.name}
      </div>

      <div style={{ marginBottom: '6px' }}>
        {plan.price !== 'Custom' && (
          <span style={{ fontSize: '13px', fontWeight: '700', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#64748B' }}>₦</span>
        )}
        <span style={{ fontSize: '28px', fontWeight: '900', color: plan.highlight ? 'white' : NAVY, letterSpacing: '-0.5px' }}>
          {' '}{plan.price}
        </span>
      </div>

      <div style={{ fontSize: '12px', color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#94A3B8', marginBottom: '10px' }}>
        per month
      </div>

      <div style={{
        fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#64748B',
        marginBottom: '22px', lineHeight: '1.65', flex: 1,
      }}>
        {plan.target}
      </div>

      {plan.features.map(f => (
        <div key={f} style={{ display: 'flex', gap: '9px', marginBottom: '10px', alignItems: 'flex-start' }}>
          <span style={{ color: plan.highlight ? 'white' : GREEN, fontSize: '12px', flexShrink: 0, fontWeight: '900', marginTop: '2px' }}>✓</span>
          <span style={{ fontSize: '13px', color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#374151', lineHeight: '1.5' }}>{f}</span>
        </div>
      ))}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  const [h, hh] = useHover();
  return (
    <button
      onClick={onClick}
      {...hh}
      style={{
        padding: '10px 28px', borderRadius: '8px',
        border: '1.5px solid',
        borderColor: active ? BLUE_L : '#CBD5E1',
        background: active ? BLUE_L : (h ? '#F1F5F9' : 'white'),
        color: active ? 'white' : '#374151',
        fontWeight: '700', fontSize: '14px', cursor: 'pointer',
        fontFamily: FONT, textTransform: 'capitalize',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

export default function PricingSection() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <section
      id="pricing"
      style={{ background: 'white', padding: '70px 6%', borderTop: '1.5px solid #E2E8F0', borderBottom: '1.5px solid #E2E8F0' }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '900', color: NAVY, marginBottom: '14px', letterSpacing: '-0.5px', fontFamily: FONT }}>
            Protection for everyone
          </h2>
          <p style={{ fontSize: '16px', color: '#374151', maxWidth: '500px', margin: '0 auto', lineHeight: '1.75', fontFamily: FONT }}>
            Free for job seekers, always. We charge organizations that benefit most from keeping their reputation clean.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
          <TabButton label="For Job Seekers" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <TabButton label="For Organizations" active={activeTab === 'organizations'} onClick={() => setActiveTab('organizations')} />
        </div>

        {activeTab === 'users' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px', maxWidth: '760px', margin: '0 auto',
          }}>
            {USER_PLANS.map(plan => <UserPlanCard key={plan.name} plan={plan} />)}
          </div>
        )}

        {activeTab === 'organizations' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
          }}>
            {ORG_PLANS.map(plan => <OrgPlanCard key={plan.name} plan={plan} />)}
          </div>
        )}
      </div>
    </section>
  );
}