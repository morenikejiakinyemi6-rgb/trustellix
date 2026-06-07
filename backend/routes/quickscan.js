import express from 'express';
import { auditDomain } from '../services/dnsService.js';
import { analyzeWithGemini } from '../services/geminiService.js';

const router = express.Router();

const VERIFIED_EMPLOYERS = new Set([
  'flutterwave.com', 'paystack.com', 'interswitch.com',
  'mtn.com', 'airtel.com.ng', 'glo.com', '9mobile.com.ng',
  'gtbank.com', 'zenithbank.com', 'accessbankplc.com',
  'firstbanknigeria.com', 'uba.com', 'sterlingbank.com',
  'konga.com', 'jumia.com.ng', 'andela.com',
  'microsoft.com', 'google.com', 'amazon.com',
  'apple.com', 'meta.com', 'netflix.com',
  'shell.com', 'chevron.com', 'totalenergies.com',
]);

const SCAM_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'ymail.com', 'mail.com',
]);

const HIGH_RISK_KEYWORDS = [
  '\\bbvn\\b', '\\bnin\\b', 'national identity', 'national id',
  'send your passport', 'upload your passport',
  'training fee', 'registration fee', 'resume fee',
  'pay before', 'payment required', 'processing fee',
  'telegram interview', 'whatsapp interview',
  'interview on telegram', 'interview on whatsapp',
  'wire transfer', 'western union', 'moneygram',
  'send money', 'transfer funds',
  'work from home earn', 'earn from home',
];

const MEDIUM_RISK_KEYWORDS = [
  'specially selected', 'you have been chosen',
  'urgent recruitment', 'immediate employment',
  'limited slots', 'do not share', 'keep confidential',
  'test project', 'trial project',
  'forward your cv to whatsapp', 'send your cv to whatsapp',
];

const DOMAIN_REGEX = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]{2,256}\.[a-zA-Z]{2,})/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

function extractDomains(text) {
  const domains = new Set();
  let m;
  DOMAIN_REGEX.lastIndex = 0;
  while ((m = DOMAIN_REGEX.exec(text)) !== null) {
    domains.add(m[1].toLowerCase());
  }
  EMAIL_REGEX.lastIndex = 0;
  while ((m = EMAIL_REGEX.exec(text)) !== null) {
    domains.add(m[1].toLowerCase());
  }
  return [...domains];
}

function runLocalKeywordScan(text) {
  const lower = text.toLowerCase();
  const triggeredHigh = HIGH_RISK_KEYWORDS.filter(k => {
    try {
      return new RegExp(k, 'i').test(lower);
    } catch {
      return lower.includes(k);
    }
  });
  const triggeredMedium = MEDIUM_RISK_KEYWORDS.filter(k => {
    try {
      return new RegExp('\\b' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(lower);
    } catch {
      return lower.includes(k);
    }
  });
  return { triggeredHigh, triggeredMedium };
}

function buildQuickVerdict(domains, keywordResult, dnsResults) {
  const flags = [];
  let riskScore = 0;

  keywordResult.triggeredHigh.forEach(k => {
    riskScore += 20;
    flags.push({
      signal: 'HIGH_RISK_KEYWORD',
      severity: 'HIGH',
      detail: 'High risk pattern detected: ' + k,
    });
  });

  keywordResult.triggeredMedium.forEach(k => {
    riskScore += 8;
    flags.push({
      signal: 'MEDIUM_RISK_KEYWORD',
      severity: 'MEDIUM',
      detail: 'Suspicious phrase detected: ' + k,
    });
  });

  const verifiedDomains = domains.filter(d => VERIFIED_EMPLOYERS.has(d));
  const freeEmailDomains = domains.filter(d => SCAM_DOMAINS.has(d));
  const unknownDomains = domains.filter(d => !VERIFIED_EMPLOYERS.has(d) && !SCAM_DOMAINS.has(d));

  if (freeEmailDomains.length > 0) {
    riskScore += 25;
    flags.push({
      signal: 'FREE_EMAIL_PROVIDER',
      severity: 'HIGH',
      detail: 'Corporate recruiter using free email: ' + freeEmailDomains.join(', '),
    });
  }

  dnsResults.forEach(dns => {
    if (dns.riskScore >= 70) {
      riskScore += 30;
      dns.flags.forEach(f => flags.push({ ...f, detail: '[' + dns.domain + '] ' + f.detail }));
    } else if (dns.riskScore >= 40) {
      riskScore += 15;
      dns.flags.forEach(f => flags.push({ ...f, detail: '[' + dns.domain + '] ' + f.detail }));
    }
  });

  riskScore = Math.min(riskScore, 100);

  let verdict;
  if (riskScore >= 61) verdict = 'RED';
  else if (riskScore >= 31) verdict = 'YELLOW';
  else verdict = 'GREEN';

  const needsDeepAI = riskScore >= 40 || keywordResult.triggeredHigh.length >= 2;

  return { verdict, riskScore, flags, needsDeepAI, verifiedDomains, unknownDomains };
}

router.post('/', async (req, res) => {
  const { text, companyName, fullScan } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length < 10) {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Text must be at least 10 characters.',
    });
  }

  const trimmedText = text.slice(0, 3000);
  const domains = extractDomains(trimmedText);
  const keywordResult = runLocalKeywordScan(trimmedText);

  const suspiciousDomains = domains
    .filter(d => !VERIFIED_EMPLOYERS.has(d) && !SCAM_DOMAINS.has(d))
    .slice(0, 2);

  let dnsResults = [];
  if (suspiciousDomains.length > 0) {
    dnsResults = await Promise.all(
      suspiciousDomains.map(d =>
        auditDomain(d).catch(() => ({ domain: d, riskScore: 0, flags: [] }))
      )
    );
  }

  const quickVerdict = buildQuickVerdict(domains, keywordResult, dnsResults);

  const shouldRunAI = fullScan === true || quickVerdict.needsDeepAI;

  let deepAnalysis = null;
  if (shouldRunAI) {
    try {
      const emailEntities = domains
        .filter(d => SCAM_DOMAINS.has(d))
        .map(d => ({ full: d, domain: d }));
      deepAnalysis = await analyzeWithGemini(
        { urls: domains.filter(d => !SCAM_DOMAINS.has(d)), emails: emailEntities },
        trimmedText
      );
    } catch (err) {
      console.error('[QuickScan AI Error]', err.message);
      deepAnalysis = null;
    }
  }

  const finalRiskScore = deepAnalysis
    ? Math.round((quickVerdict.riskScore + deepAnalysis.riskScore) / 2)
    : quickVerdict.riskScore;

  let finalVerdict = quickVerdict.verdict;
  if (deepAnalysis) {
    if (deepAnalysis.verdict === 'CONFIRMED_SCAM') finalVerdict = 'RED';
    else if (deepAnalysis.verdict === 'HIGH_RISK' && finalVerdict !== 'RED') finalVerdict = 'RED';
    else if (deepAnalysis.verdict === 'SUSPICIOUS' && finalVerdict === 'GREEN') finalVerdict = 'YELLOW';
  }

  const allFlags = [
    ...quickVerdict.flags,
    ...(deepAnalysis?.structuralDiscrepancies?.map(d => ({
      signal: d.field,
      severity: d.severity,
      detail: d.finding,
    })) || []),
  ];

  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const topReasons = allFlags
    .sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4))
    .slice(0, 4)
    .map(f => f.detail);

  const summary = deepAnalysis?.executiveSummary
    || (finalVerdict === 'RED'
      ? 'Multiple high risk signals detected. Do not proceed without verification.'
      : finalVerdict === 'YELLOW'
      ? 'Some unverified signals found. Research this company before applying.'
      : 'No significant threats detected. This appears to be a legitimate listing.');

  return res.status(200).json({
    verdict: finalVerdict,
    riskScore: finalRiskScore,
    reasons: topReasons,
    summary,
    verifiedEmployer: quickVerdict.verifiedDomains.length > 0,
    domainsFound: domains,
    deepAnalysisUsed: !!deepAnalysis,
  });
});

export default router;