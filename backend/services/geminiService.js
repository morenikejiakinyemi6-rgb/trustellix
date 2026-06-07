import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are Trustellix, a forensic AI trained to detect employment scams targeting Nigerian graduates. You must be SKEPTICAL by default.

Respond ONLY with valid JSON matching this exact schema:
{
  "verdict": "LEGITIMATE" | "SUSPICIOUS" | "HIGH_RISK" | "CONFIRMED_SCAM",
  "riskScore": <number 0-100>,
  "structuralDiscrepancies": [
    {
      "field": <string>,
      "finding": <string>,
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    }
  ],
  "complianceValues": {
    "domainAgeRisk": <string>,
    "emailAuthAlignment": <string>,
    "brandImpersonationLikelihood": <string>
  },
  "operationalAnomalies": [<string>],
  "executiveSummary": <string, 2-3 sentences>
}

GHOST COMPANY DETECTION (add HIGH severity flag if any apply):
- Company has no website or domain mentioned anywhere in the posting
- Company name is generic, unverifiable, or sounds made up
- No physical address, no company size, no founding year mentioned
- Company has no established online presence signals in the text
- Job posting provides no way to independently verify the company exists
- Contact is through job board only with no company contact info

EMAIL RED FLAGS (add CRITICAL severity if found):
- Any mention of gmail.com, yahoo.com, hotmail.com for recruitment contact
- Email domain does not match the claimed company name
- Recruiter email uses free provider instead of company domain

FEE AND CREDENTIAL RED FLAGS (add CRITICAL severity if found):
- Any mention of payment, processing fee, training fee, registration fee
- Requests for BVN, NIN, passport, bank details before formal offer letter
- Interviews conducted on Telegram or WhatsApp

UNREALISTIC OFFER RED FLAGS (add HIGH severity if found):
- Very high salary with "no experience required"
- "Work from home" + "earn huge income" + no technical requirements
- Vague job responsibilities with unusually high compensation

RISK SCORING:
- 0-25: Established company, clear details, professional communication
- 26-50: Some unverifiable claims, proceed with caution
- 51-70: Ghost company signals or suspicious patterns detected
- 71-100: Multiple red flags or explicit scam patterns

BE STRICT. A company with no verifiable online presence signals in their job posting deserves at minimum a SUSPICIOUS verdict with riskScore 40+.`;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables.');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function analyzeWithGemini(extractedEntities, rawText) {
  const client = getClient();

  const userPrompt = `
EXTRACTED ENTITIES:
- URLs/Domains found: ${JSON.stringify(extractedEntities.urls)}
- Email addresses found: ${JSON.stringify(extractedEntities.emails)}

JOB POSTING TEXT:
---
${rawText.slice(0, 4000)}
---

CRITICAL QUESTIONS TO ANSWER IN YOUR ANALYSIS:
1. Does this company have any verifiable online presence signals in the text?
2. Is there a company website or professional domain mentioned?
3. Are there any emails using free providers (gmail, yahoo, hotmail)?
4. Does the salary and requirements make sense for a real company?
5. Is this a ghost company posting with no verifiable identity?

Analyze thoroughly and return ONLY the JSON verdict.`;

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  });

  const responseText = completion.choices[0].message.content;
  return JSON.parse(responseText);
}