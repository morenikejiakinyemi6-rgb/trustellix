import express from 'express';
import { auditDomain } from '../services/dnsService.js';

const router = express.Router();

const DOMAIN_REGEX = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]{1,256}\.[a-zA-Z]{2,6})/gi;

function extractUniqueDomains(text) {
  const matches = [...text.matchAll(DOMAIN_REGEX)];
  const domains = matches.map(match => match[1].toLowerCase());
  return [...new Set(domains)];
}

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length < 5) {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'A text payload containing at least one domain or email is required.',
    });
  }

  const domains = extractUniqueDomains(text);

  if (domains.length === 0) {
    return res.status(400).json({
      error: 'NO_DOMAINS_FOUND',
      message: 'No extractable domains or URLs were found in the submitted text.',
    });
  }

  if (domains.length > 5) {
    return res.status(400).json({
      error: 'TOO_MANY_DOMAINS',
      message: 'Maximum of 5 domains per request to prevent abuse.',
    });
  }

  try {
    const auditResults = await Promise.all(domains.map(domain => auditDomain(domain)));

    const overallRisk = Math.max(...auditResults.map(r => r.riskScore));

    return res.status(200).json({
      success: true,
      domainsAudited: domains.length,
      overallRisk,
      results: auditResults,
    });
  } catch (error) {
    console.error('[Trustellix Infrastructure Error]', error.message);
    return res.status(500).json({
      error: 'AUDIT_FAILED',
      message: 'Infrastructure audit encountered an error. Please try again.',
    });
  }
});

export default router;