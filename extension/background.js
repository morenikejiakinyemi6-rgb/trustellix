const API_BASE = 'https://trustellix-backend.onrender.com/api';
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 30;

async function scanJob(text, companyName, fullScan) {
  const cacheKey = (companyName + text).slice(0, 150).trim();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result;
  }
  const response = await fetch(API_BASE + '/quickscan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, companyName, fullScan: fullScan || false }),
  });
  if (!response.ok) throw new Error('API error ' + response.status);
  const result = await response.json();
  cache.set(cacheKey, { result, timestamp: Date.now() });
  if (cache.size > 200) cache.delete(cache.keys().next().value);
  return result;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'SCAN_JOB') {
    scanJob(message.text, message.companyName, message.fullScan)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
  if (message.type === 'OPEN_SITE') {
    chrome.tabs.create({ url: 'https://trustellix.vercel.app' });
    sendResponse({ done: true });
    return true;
  }
});
