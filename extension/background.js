const API_BASE = 'https://trustellix-backend.onrender.com/api';
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 30;

async function scanJob(text, companyName) {
  const cacheKey = (companyName + text).slice(0, 150).trim();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }

  const response = await fetch(API_BASE + '/quickscan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text, companyName: companyName }),
  });

  if (!response.ok) throw new Error('API error ' + response.status);

  const result = await response.json();
  cache.set(cacheKey, { result: result, timestamp: Date.now() });
  if (cache.size > 200) {
    var firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  return result;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'SCAN_JOB') {
    scanJob(message.text, message.companyName)
      .then(function(result) { sendResponse({ success: true, data: result }); })
      .catch(function(err) { sendResponse({ success: false, error: err.message }); });
    return true;
  }
});