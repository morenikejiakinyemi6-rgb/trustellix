const DETAIL_BADGE_CLASS = 'tsx-detail-badge';



const COLORS = {

  GREEN:  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', dot: '#10B981', label: 'Safe' },

  YELLOW: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', dot: '#F97316', label: 'Caution' },

  RED:    { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#EF4444', label: 'High Risk' },

};



// ─── SITE CONFIGS ────────────────────────────────────────────────────────────



const SITE_CONFIGS = {

  'linkedin.com': {

    isDetailPage: () => /currentJobId|\/jobs\/view\//.test(location.href),

    getTitle: () => {

      const el = document.querySelector('h1');

      return el ? el.innerText.trim() : '';

    },

    getCompany: () => {

      const sels = [

        '.job-details-jobs-unified-top-card__company-name a',

        '.jobs-unified-top-card__company-name a',

        '.topcard__org-name-link',

        '.t-black--light a',

      ];

      for (const s of sels) {

        const el = document.querySelector(s);

        if (el && el.innerText.trim()) return el.innerText.trim();

      }

      return '';

    },

    getDescription: () => {

      const sels = ['#job-details', '.jobs-description', '.jobs-description-content', '.jobs-box__html-content'];

      for (const s of sels) {

        const el = document.querySelector(s);

        if (el && el.innerText.trim().length > 50) return el.innerText.trim().slice(0, 3000);

      }

      return '';

    },

    getInsertTarget: () => {

      const sels = [

        '.job-details-jobs-unified-top-card__primary-description-container',

        '.jobs-unified-top-card__primary-description',

        '.jobs-unified-top-card__content--two-pane',

        '.job-details-jobs-unified-top-card__top-buttons',

        'h1',

      ];

      for (const s of sels) {

        const el = document.querySelector(s);

        if (el) return el;

      }

      return null;

    },

  },



  'jobberman.com': {

    isDetailPage: () => /\/listings\//.test(location.href),

    getTitle: () => { const el = document.querySelector('h1, .job-title'); return el ? el.innerText.trim() : ''; },

    getCompany: () => {

      const el = document.querySelector('.company-name a, .company-name, .employer-name, [class*="company"] a');

      return el ? el.innerText.trim() : '';

    },

    getDescription: () => {

      const sels = ['.job-detail-container', '.section-body', '.job-description', '.job-detail-body', 'article.job', 'main'];

      for (const s of sels) {

        const el = document.querySelector(s);

        if (el && el.innerText.trim().length > 100) return el.innerText.trim().slice(0, 3000);

      }

      const parts = [];

      document.querySelectorAll('p, li').forEach(el => { const t = el.innerText.trim(); if (t.length > 20) parts.push(t); });

      return parts.join(' ').slice(0, 3000);

    },

    getInsertTarget: () => document.querySelector('h1, .job-title, .company-name') || null,

  },



  'indeed.com': {

    isDetailPage: () => /\/viewjob|\/jobs\?/.test(location.href) || document.querySelector('#jobDescriptionText') !== null,

    getTitle: () => { const el = document.querySelector('h1[data-testid="jobsearch-JobInfoHeader-title"], h1'); return el ? el.innerText.trim() : ''; },

    getCompany: () => {

      const el = document.querySelector('[data-testid="inlineHeader-companyName"] a, [data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating a');

      return el ? el.innerText.trim() : '';

    },

    getDescription: () => {

      const el = document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText');

      return el ? el.innerText.trim().slice(0, 3000) : '';

    },

    getInsertTarget: () => document.querySelector('[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating, h1') || null,

  },



  'myjobmag.com': {

    isDetailPage: () => /\/job\//.test(location.href),

    getTitle: () => {

      const el = document.querySelector('h1, h2.job-title, .job-title');

      if (!el) return '';

      const text = el.innerText.trim();

      const atIdx = text.toLowerCase().lastIndexOf(' at ');

      return atIdx > 0 ? text.slice(0, atIdx).trim() : text;

    },

    getCompany: () => {

      const titleEl = document.querySelector('h1, h2');

      if (titleEl) { const m = titleEl.innerText.match(/ at (.+)$/i); if (m) return m[1].trim(); }

      const el = document.querySelector('.company-name, [class*="company"], .employer, a[href*="/company/"]');

      return el ? el.innerText.trim() : '';

    },

    getDescription: () => {

      const parts = [];

      document.querySelectorAll('.job-detail-table tr, .job-info td, .field-item').forEach(el => parts.push(el.innerText.trim()));

      const body = document.querySelector('.job-description, .entry-content, .single-job-description, main article, main');

      if (body) parts.push(body.innerText.trim());

      if (parts.join(' ').length < 100) {

        document.querySelectorAll('p, li, h3, h4').forEach(el => { const t = el.innerText.trim(); if (t.length > 20) parts.push(t); });

      }

      return parts.join(' ').slice(0, 3000);

    },

    getInsertTarget: () => document.querySelector('h1, .job-title, h2') || null,

  },



  'hotnigerianjobs.com': {

    isDetailPage: () => /\/hotjobs\/|\/job\//.test(location.href),

    getTitle: () => {

      const el = document.querySelector('h1.entry-title, h1, .post-title');

      if (!el) return '';

      const text = el.innerText.trim();

      const atIdx = text.toLowerCase().lastIndexOf(' at ');

      return atIdx > 0 ? text.slice(0, atIdx).trim() : text;

    },

    getCompany: () => {

      const el = document.querySelector('h1.entry-title, h1, .post-title');

      if (el) { const m = el.innerText.match(/ at (.+)$/i); if (m) return m[1].trim(); }

      return '';

    },

    getDescription: () => {

      const parts = [];

      const content = document.querySelector('.entry-content, .post-content, .job-content, article');

      if (content) content.querySelectorAll('p, li, h3, h4, strong').forEach(el => { const t = el.innerText.trim(); if (t.length > 15) parts.push(t); });

      return parts.join(' ').slice(0, 3000);

    },

    getInsertTarget: () => document.querySelector('h1.entry-title, h1') || null,

  },

};



function getSiteConfig() {

  const host = window.location.hostname;

  for (const [key, cfg] of Object.entries(SITE_CONFIGS)) {

    if (host.includes(key)) return { key, cfg };

  }

  return null;

}



// ─── SHIELD SVG ───────────────────────────────────────────────────────────────



function shieldSVG(color, verdict) {

  const inner = verdict === 'GREEN'

    ? `<path d="M8.5 13.5l2.5 2.5 4.5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`

    : verdict === 'RED'

    ? `<path d="M9 11l6 6M15 11l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>`

    : `<text x="12" y="17" text-anchor="middle" fill="white" font-size="11" font-weight="800" font-family="Arial">!</text>`;

  return `<svg width="13" height="14" viewBox="0 0 24 28" fill="none" style="display:block;flex-shrink:0;">

    <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="${color}"/>

    ${inner}

  </svg>`;

}



// ─── DETAIL BADGE ─────────────────────────────────────────────────────────────



function createDetailBadge(verdict, riskScore, reasons, summary, rawData) {

  const corrected = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';

  const safety = Math.max(0, 100 - riskScore);

  const c = COLORS[corrected];



  const card = document.createElement('div');

  card.className = DETAIL_BADGE_CLASS;

  card.style.cssText = `

    margin: 14px 0; padding: 16px 18px;

    border-radius: 10px; background: ${c.bg};

    border: 1.5px solid ${c.border};

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;

    max-width: 100%; box-sizing: border-box;

  `;



  // Header

  const header = document.createElement('div');

  header.style.cssText = `display:flex;align-items:center;gap:10px;margin-bottom:${summary ? '10px' : '0'};`;

  header.innerHTML = `

    ${shieldSVG(c.dot, corrected)}

    <span style="font-weight:800;font-size:14px;color:${c.text};">Trustellix: ${c.label}</span>

    <span style="margin-left:auto;font-size:13px;color:${c.text};font-weight:700;">${safety}% Safe</span>

  `;

  card.appendChild(header);



  // Summary

  if (summary) {

    const s = document.createElement('p');

    s.style.cssText = `font-size:12.5px;color:${c.text};opacity:0.9;margin:0 0 10px;line-height:1.65;`;

    s.textContent = summary.replace(/-/g, ' ');

    card.appendChild(s);

  }



  // Build reasons from raw AI data if available

  const allReasons = [];



  if (rawData) {

    // Positive indicators

    const positives = [];

    const cv = rawData.complianceValues || {};

    if (cv.domainAgeRisk === 'LOW') positives.push('Domain appears established');

    if (cv.emailAuthAlignment === 'ALIGNED') positives.push('Email matches company domain');

    if (cv.brandImpersonationLikelihood === 'LOW' && corrected === 'GREEN') positives.push('No brand impersonation detected');

    const discrepancies = rawData.structuralDiscrepancies || [];

    const anomalies = rawData.operationalAnomalies || [];

    if (discrepancies.length === 0 && anomalies.length === 0) positives.push('No structural issues detected');



    if (positives.length > 0) {

      const posSection = document.createElement('div');

      posSection.style.cssText = `margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid ${c.border};`;

      const posLabel = document.createElement('div');

      posLabel.style.cssText = `font-size:9px;font-weight:700;color:${c.text};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;opacity:0.7;`;

      posLabel.textContent = '✓ POSITIVE INDICATORS';

      posSection.appendChild(posLabel);

      positives.forEach(p => {

        const row = document.createElement('div');

        row.style.cssText = `display:flex;gap:6px;font-size:11.5px;color:${c.text};opacity:0.85;margin-bottom:3px;`;

        row.innerHTML = `<span style="color:#10B981;flex-shrink:0;">●</span><span>${p}</span>`;

        posSection.appendChild(row);

      });

      card.appendChild(posSection);

    }



    // Red flags from AI

    if (discrepancies.length > 0 || anomalies.length > 0) {

      const flagSection = document.createElement('div');

      flagSection.style.cssText = `margin-bottom:6px;`;

      const flagLabel = document.createElement('div');

      flagLabel.style.cssText = `font-size:9px;font-weight:700;color:${c.text};letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;opacity:0.7;`;

      flagLabel.textContent = discrepancies.length > 0 ? '⚑ RED FLAGS DETECTED' : '⚐ OBSERVATIONS';

      flagSection.appendChild(flagLabel);



      discrepancies.slice(0, 3).forEach(f => {

        const row = document.createElement('div');

        row.style.cssText = `

          padding:7px 10px;border-radius:6px;

          background:rgba(0,0,0,0.04);margin-bottom:5px;

        `;

        row.innerHTML = `

          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">

            <span style="font-size:11.5px;font-weight:700;color:${c.text};">${f.field}</span>

            <span style="font-size:9px;font-weight:700;color:${c.dot};letter-spacing:0.04em;">${f.severity}</span>

          </div>

          <div style="font-size:11px;color:${c.text};opacity:0.8;">${f.finding}</div>

        `;

        flagSection.appendChild(row);

      });



      anomalies.slice(0, 2).forEach(a => {

        const row = document.createElement('div');

        row.style.cssText = `display:flex;gap:6px;font-size:11.5px;color:${c.text};opacity:0.85;margin-bottom:4px;`;

        row.innerHTML = `<span style="color:${c.dot};flex-shrink:0;">●</span><span>${a}</span>`;

        flagSection.appendChild(row);

      });



      card.appendChild(flagSection);

    }

  } else if (reasons && reasons.length > 0) {

    // Fallback to simple reasons array

    const list = document.createElement('div');

    list.style.cssText = `display:flex;flex-direction:column;gap:4px;margin-top:6px;`;

    reasons.slice(0, 4).forEach(r => {

      const row = document.createElement('div');

      row.style.cssText = `display:flex;gap:8px;font-size:11.5px;color:${c.text};opacity:0.9;`;

      row.innerHTML = `<span style="color:${c.dot};flex-shrink:0;margin-top:2px;">●</span><span>${r.replace(/-/g, ' ')}</span>`;

      list.appendChild(row);

    });

    card.appendChild(list);

  } else if (corrected === 'GREEN') {

    const msg = document.createElement('p');

    msg.style.cssText = `font-size:11.5px;color:${c.text};opacity:0.75;margin:6px 0 0;`;

    msg.textContent = safety >= 90

      ? 'No scam signals detected. Company appears verifiable and job description is professional.'

      : 'No explicit scam keywords found. Company online presence is limited — verify independently before applying.';

    card.appendChild(msg);

  }



  // Footer

  const footer = document.createElement('div');

  footer.style.cssText = `margin-top:10px;padding-top:8px;border-top:1px solid ${c.border};font-size:10px;color:${c.text};opacity:0.5;`;

  footer.textContent = 'Trustellix Job Safety Engine · AI analysis of full job description';

  card.appendChild(footer);



  return card;

}



// ─── FLOATING INDICATOR ───────────────────────────────────────────────────────



function addFloatingIndicator() {

  if (document.getElementById('tsx-float')) return;



  // Tooltip that shows on hover

  const tooltip = document.createElement('div');

  tooltip.style.cssText = `

    position:fixed;bottom:68px;right:16px;z-index:2147483645;

    background:#0F172A;color:#F1F5F9;

    border-radius:8px;padding:10px 14px;

    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;

    font-size:12px;line-height:1.5;

    box-shadow:0 8px 24px rgba(0,0,0,0.4);

    white-space:nowrap;display:none;

    border:1px solid rgba(255,255,255,0.08);

  `;

  tooltip.innerHTML = `

    <div style="font-weight:700;color:#2563EB;margin-bottom:3px;">Trustellix Active</div>

    <div style="color:#94A3B8;">Click a job to see safety analysis</div>

  `;

  document.body.appendChild(tooltip);



  const float = document.createElement('div');

  float.id = 'tsx-float';

  float.style.cssText = `

    position:fixed; bottom:20px; right:20px; z-index:2147483646;

    width:40px; height:40px; border-radius:50%;

    background:#2563EB; box-shadow:0 4px 16px rgba(37,99,235,0.4);

    display:flex; align-items:center; justify-content:center;

    cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;

    border:2px solid rgba(255,255,255,0.3);

  `;

  float.innerHTML = `

    <svg width="18" height="18" viewBox="0 0 24 28" fill="none">

      <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/>

      <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

    </svg>

    <span id="tsx-float-pulse" style="position:absolute;top:0;right:0;width:10px;height:10px;border-radius:50%;background:#10B981;border:2px solid white;"></span>

  `;



  float.addEventListener('mouseenter', () => {

    float.style.transform = 'scale(1.1)';

    tooltip.style.display = 'block';

  });

  float.addEventListener('mouseleave', () => {

    float.style.transform = 'scale(1)';

    tooltip.style.display = 'none';

  });

  float.addEventListener('click', () => {

    // Scroll to badge if exists, otherwise open site

    const badge = document.querySelector('.' + DETAIL_BADGE_CLASS);

    if (badge) {

      badge.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } else {

      chrome.runtime.sendMessage({ type: 'OPEN_SITE' });

    }

  });



  document.body.appendChild(float);

}



function updateFloatingIndicator(verdict) {

  const pulse = document.getElementById('tsx-float-pulse');

  const float = document.getElementById('tsx-float');

  if (!pulse || !float) return;



  if (verdict === 'RED') {

    pulse.style.background = '#EF4444';

    float.style.background = '#EF4444';

    float.style.boxShadow = '0 4px 16px rgba(239,68,68,0.4)';

  } else if (verdict === 'YELLOW') {

    pulse.style.background = '#F97316';

    float.style.background = '#2563EB';

    float.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';

  } else {

    pulse.style.background = '#10B981';

    float.style.background = '#2563EB';

    float.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';

  }

}



// ─── SCAN LOGIC ──────────────────────────────────────────────────────────────



async function callVerify(text, companyName) {

  return new Promise((resolve, reject) => {

    chrome.runtime.sendMessage(

      { type: 'SCAN_JOB', text, companyName, fullScan: true },

      (res) => {

        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));

        if (!res) return reject(new Error('No response'));

        resolve(res);

      }

    );

  });

}



let lastScannedUrl = '';

let isScanning = false;



async function scanDetailPage(siteObj) {

  const { cfg } = siteObj;

  if (!cfg.isDetailPage()) return;



  const currentUrl = location.href;

  if (currentUrl === lastScannedUrl || isScanning) return;



  const title = cfg.getTitle();

  const company = cfg.getCompany();

  const description = cfg.getDescription();



  if (description.length < 50) return;



  lastScannedUrl = currentUrl;

  isScanning = true;



  const insertTarget = cfg.getInsertTarget();

  if (!insertTarget) { isScanning = false; return; }



  document.querySelectorAll('.' + DETAIL_BADGE_CLASS).forEach(el => el.remove());



  const loading = document.createElement('div');

  loading.className = DETAIL_BADGE_CLASS;

  loading.style.cssText = `

    display:inline-flex;align-items:center;gap:10px;

    margin:12px 0;padding:12px 16px;border-radius:8px;

    background:#EFF6FF;border:1.5px solid #BFDBFE;

    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;

    font-size:13px;color:#1E40AF;

  `;

  loading.innerHTML = `

    <svg width="13" height="14" viewBox="0 0 24 28" fill="none" style="flex-shrink:0;animation:tsxRotate 1.5s linear infinite;">

      <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="#2563EB"/>

      <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke="white" stroke-width="2" stroke-linecap="round"/>

    </svg>

    <span><strong>Trustellix</strong> is analyzing this job with AI...</span>

    <style>@keyframes tsxRotate{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}</style>

  `;

  insertTarget.insertAdjacentElement('afterend', loading);



  try {

    const fullText = [title, company, description].filter(Boolean).join('\n\n');

    const result = await callVerify(fullText, company);

    loading.remove();

    isScanning = false;



    if (!result.success) return;



    const data = result.data;

    const riskScore = data.riskScore ?? 0;

    const verdict = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';



    // Build rawData for detailed display from quickscan response

    const rawData = {

      structuralDiscrepancies: (data.reasons || []).map(r => ({ field: 'Signal', finding: r, severity: 'HIGH' })),

      operationalAnomalies: [],

      complianceValues: { domainAgeRisk: riskScore < 20 ? 'LOW' : 'UNKNOWN', emailAuthAlignment: 'NOT_APPLICABLE', brandImpersonationLikelihood: riskScore < 20 ? 'LOW' : 'MEDIUM' },

    };



    const badge = createDetailBadge(verdict, riskScore, data.reasons || [], data.summary || '', rawData);

    insertTarget.insertAdjacentElement('afterend', badge);

    updateFloatingIndicator(verdict);



  } catch (err) {

    loading.remove();

    isScanning = false;

  }

}



// ─── KEEP ALIVE ──────────────────────────────────────────────────────────────



function pingBackground() {

  try {

    chrome.runtime.sendMessage({ type: 'PING' }, () => { void chrome.runtime.lastError; });

  } catch (e) {}

}



// ─── INIT ────────────────────────────────────────────────────────────────────



function init() {

  const siteObj = getSiteConfig();

  if (!siteObj) return;



  addFloatingIndicator();

  setInterval(pingBackground, 25000);



  setTimeout(() => scanDetailPage(siteObj), 2000);



  let lastHref = location.href;

  const urlWatcher = new MutationObserver(() => {

    if (location.href !== lastHref) {

      lastHref = location.href;

      lastScannedUrl = '';

      isScanning = false;

      document.querySelectorAll('.' + DETAIL_BADGE_CLASS).forEach(el => el.remove());

      setTimeout(() => scanDetailPage(siteObj), 2000);

      setTimeout(() => scanDetailPage(siteObj), 4500);

    }

  });

  urlWatcher.observe(document.body, { childList: true, subtree: true });

}



if (document.readyState === 'loading') {

  document.addEventListener('DOMContentLoaded', init);

} else {

  setTimeout(init, 800);

}