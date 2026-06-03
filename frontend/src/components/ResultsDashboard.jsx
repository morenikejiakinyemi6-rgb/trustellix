import VerdictBadge from './VerdictBadge.jsx';
import RiskMeter from './RiskMeter.jsx';
import FlagCard from './FlagCard.jsx';

const G = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export default function ResultsDashboard({ data }) {
  const { analysis, extractedEntities, infrastructureData } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: G }}>

      <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Verdict</div>
          <VerdictBadge verdict={analysis.verdict} />
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#374151', lineHeight: '1.75', maxWidth: '460px' }}>
            {analysis.executiveSummary?.replace(/-/g, ' ')}
          </p>
        </div>
        <RiskMeter score={analysis.riskScore} />
      </div>

      {analysis.structuralDiscrepancies?.length > 0 && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}>
            Structural Discrepancies — {analysis.structuralDiscrepancies.length} Found
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {analysis.structuralDiscrepancies.map((flag, i) => (
              <FlagCard key={i} {...flag} />
            ))}
          </div>
        </div>
      )}

      {analysis.operationalAnomalies?.length > 0 && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Operational Anomalies</div>
          {analysis.operationalAnomalies.map((anomaly, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#374151', padding: '10px 0', borderBottom: i < analysis.operationalAnomalies.length - 1 ? '1px solid #f3f4f6' : 'none', alignItems: 'flex-start' }}>
              <span style={{ color: '#ea580c', fontWeight: '700', fontSize: '12px', flexShrink: 0, marginTop: '2px', minWidth: '20px' }}>{String(i + 1).padStart(2, '0')}</span>
              {anomaly.replace(/-/g, ' ')}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {Object.entries(analysis.complianceValues).map(([key, value]) => (
          <div key={key} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '12px', padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#111' }}>
              {String(value).replace(/-/g, ' ')}
            </div>
          </div>
        ))}
      </div>

      {infrastructureData && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '18px' }}>
            Infrastructure Audit — {infrastructureData.domainsAudited} Domain(s) Checked
          </div>
          {infrastructureData.results?.map((r, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '13.5px', color: '#111', fontWeight: '600' }}>{r.domain}</span>
                <span style={{ fontSize: '12px', color: r.riskScore >= 60 ? '#b91c1c' : '#15803d', background: r.riskScore >= 60 ? '#fef2f2' : '#f0fdf4', border: `1px solid ${r.riskScore >= 60 ? '#fca5a5' : '#86efac'}`, padding: '3px 10px', borderRadius: '6px', fontWeight: '700' }}>
                  Risk score: {r.riskScore}
                </span>
              </div>
              {r.flags?.map((flag, j) => (
                <div key={j} style={{ fontSize: '13px', color: '#4b5563', padding: '5px 0 5px 14px', borderLeft: '3px solid #e5e7eb', marginBottom: '4px', lineHeight: '1.5' }}>
                  {flag.detail.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {extractedEntities?.emails?.length > 0 && (
        <div style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: '14px', padding: '20px 24px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Extracted Entities</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {extractedEntities.emails.map((email, i) => (
              <span key={i} style={{ padding: '5px 13px', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #e5e7eb', fontSize: '13px', color: '#374151', fontFamily: 'monospace' }}>
                {email.full}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}