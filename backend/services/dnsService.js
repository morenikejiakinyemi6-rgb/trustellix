import dns from 'dns/promises';
import whois from 'whois-json';

async function getMXRecords(domain) {
  try {
    const records = await dns.resolveMx(domain);
    const sorted = records.sort((a, b) => a.priority - b.priority);
    return {
      found: true,
      records: sorted.map(r => ({ exchange: r.exchange, priority: r.priority })),
    };
  } catch {
    return { found: false, records: [] };
  }
}

async function getSPFRecord(domain) {
  try {
    const txtRecords = await dns.resolveTxt(domain);
    const flat = txtRecords.map(chunks => chunks.join(''));
    const spfEntry = flat.find(record => record.startsWith('v=spf1'));

    if (!spfEntry) return { found: false, record: null, strictness: 'NONE' };

    let strictness = 'WEAK';
    if (spfEntry.includes('-all')) strictness = 'STRICT';
    else if (spfEntry.includes('~all')) strictness = 'SOFT';

    return { found: true, record: spfEntry, strictness };
  } catch {
    return { found: false, record: null, strictness: 'NONE' };
  }
}

async function getDomainAge(domain) {
  try {
    const result = await whois(domain);

    const rawDate =
      result.creationDate ||
      result.created ||
      result.registrationDate ||
      result['Creation Date'] ||
      null;

    if (!rawDate) return { found: false, createdAt: null, ageInDays: null };

    const created = new Date(Array.isArray(rawDate) ? rawDate[0] : rawDate);
    const ageInDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

    return { found: true, createdAt: created.toISOString(), ageInDays };
  } catch {
    return { found: false, createdAt: null, ageInDays: null };
  }
}

function scoreDomain(mx, spf, age) {
  let riskScore = 0;
  const flags = [];

  if (!mx.found) {
    riskScore += 30;
    flags.push({ signal: 'NO_MX_RECORDS', severity: 'HIGH', detail: 'Domain has no mail server configured — cannot legitimately send email.' });
  }

  if (!spf.found) {
    riskScore += 25;
    flags.push({ signal: 'NO_SPF_RECORD', severity: 'HIGH', detail: 'No SPF policy found. Domain is fully open to email spoofing.' });
  } else if (spf.strictness === 'WEAK') {
    riskScore += 10;
    flags.push({ signal: 'WEAK_SPF_POLICY', severity: 'MEDIUM', detail: `SPF exists but uses ?all — neutrally weak, offers no real protection.` });
  }

  if (age.found && age.ageInDays !== null) {
    if (age.ageInDays < 30) {
      riskScore += 40;
      flags.push({ signal: 'VERY_NEW_DOMAIN', severity: 'CRITICAL', detail: `Domain registered only ${age.ageInDays} days ago. Consistent with fresh scam infrastructure.` });
    } else if (age.ageInDays < 180) {
      riskScore += 20;
      flags.push({ signal: 'RECENT_DOMAIN', severity: 'HIGH', detail: `Domain is only ${age.ageInDays} days old. Established companies have older domains.` });
    }
  } else if (!age.found) {
    riskScore += 15;
    flags.push({ signal: 'WHOIS_HIDDEN', severity: 'MEDIUM', detail: 'WHOIS data is private or blocked. Cannot verify domain age.' });
  }

  return { riskScore: Math.min(riskScore, 100), flags };
}

export async function auditDomain(domain) {
  const [mx, spf, age] = await Promise.all([
    getMXRecords(domain),
    getSPFRecord(domain),
    getDomainAge(domain),
  ]);

  const { riskScore, flags } = scoreDomain(mx, spf, age);

  return {
    domain,
    mx,
    spf,
    age,
    riskScore,
    flags,
  };
}