const BASE_URL = 'http://localhost:5001/api';

export async function runVerification(text) {
  const response = await fetch(`${BASE_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Verification request failed.');
  }

  return response.json();
}

export async function runInfrastructureAudit(text) {
  const response = await fetch(`${BASE_URL}/infrastructure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Infrastructure audit failed.');
  }

  return response.json();
}