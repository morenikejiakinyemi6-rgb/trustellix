import express from 'express';
import { analyzeWithGemini } from '../services/geminiService.js';

const router = express.Router();

const URL_REGEX = /https?:\/\/((?:www\.)?[a-zA-Z0-9-]{1,256}\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)/gi;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

function extractEntities(text) {
  const urls = [...text.matchAll(URL_REGEX)].map(match => match[0]);
  const emailMatches = [...text.matchAll(EMAIL_REGEX)];
  const emails = emailMatches.map(match => ({
    full: match[0],
    domain: match[1],
  }));

  return {
    urls: [...new Set(urls)],
    emails: [...new Set(emails.map(e => JSON.stringify(e)))].map(e => JSON.parse(e)),
  };
}

router.post('/', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    return res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Submission text must be a string with at least 20 characters.',
    });
  }

  if (text.length > 15000) {
    return res.status(400).json({
      error: 'INPUT_TOO_LARGE',
      message: 'Submission exceeds maximum allowed length of 15,000 characters.',
    });
  }

  const extractedEntities = extractEntities(text);

  try {
    const analysisResult = await analyzeWithGemini(extractedEntities, text);
    return res.status(200).json({
      success: true,
      extractedEntities,
      analysis: analysisResult,
    });
  } catch (error) {
    console.error('[Trustellix Verify Error]', error.message);
    return res.status(500).json({
      error: 'ANALYSIS_FAILED',
      message: 'The AI analysis engine encountered an error. Please try again.',
    });
  }
});

export default router;