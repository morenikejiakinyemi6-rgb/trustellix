import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are Trustellix, an elite forensic AI trained specifically to detect 
sophisticated employment scams targeting African youth — particularly final-year university 
students and recent graduates in Nigeria.

You MUST respond with a valid JSON object matching this EXACT schema, no extra text:
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
}`;

function getClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables.');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export async function analyzeWithGemini(extractedEntities, rawText) {
  const client = getClient();

  const userPrompt = `
    EXTRACTED ENTITIES from the submission:
    - Detected URLs/Domains: ${JSON.stringify(extractedEntities.urls)}
    - Detected Email Handles/Domains: ${JSON.stringify(extractedEntities.emails)}
    
    RAW SUBMISSION TEXT:
    ---
    ${rawText}
    ---
    
    THREAT MODELS TO ASSESS AGAINST:
    1. FREE LABOR EXPLOITATION: Does the text ask the candidate to build, code, design, or deliver 
       production-level work as part of an "interview" or "test"?
    2. CREDENTIAL & IDENTITY HARVESTING: Does it request BVN, NIN, passport data, API keys, 
       or bank details before an official offer letter?
    3. DOMAIN SPOOFING: Do detected email domains differ from the claimed company brand?
    4. RESUME FARMING: Is the posting vague or designed purely to harvest applicant data?
    5. MANIPULATION TACTICS: Artificial urgency, "you were specially selected", emotional pressure?
    
    Analyze with extreme rigor. Return ONLY the JSON verdict now.
  `;

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