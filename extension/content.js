const DETAIL_BADGE_CLASS = 'tsx-inline-container';

const COLORS = {
  GREEN:  { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981', label: 'Verified Safe' },
  YELLOW: { bg: '#FFF7ED', border: '#F97316', text: '#9A3412', dot: '#F97316', label: 'Caution Advised' },
  RED:    { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444', label: 'High Risk Threat' },
};

const SITE_CONFIGS = {
  'linkedin.com': {
    isDetailPage: () => /currentJobId|\/jobs\/view\//.test(location.href),
    getTitle: () => document.querySelector('h1')?.innerText.trim() || '',
    getCompany: () => {
      const sels = ['.job-details-jobs-unified-top-card__company-name a', '.jobs-unified-top-card__company-name a', '.topcard__org-name-link', '.t-black--light a'];
      for (const s of sels) {
        const txt = document.querySelector(s)?.innerText.trim();
        if (txt) return txt;
      }
      return '';
    },
    getDescription: () => {
      const sels = ['#job-details', '.jobs-description', '.jobs-description-content', '.jobs-box__html-content'];
      for (const s of sels) {
        const txt = document.querySelector(s)?.innerText.trim();
        if (txt && txt.length > 50) return txt.slice(0, 3000);
      }
      return '';
    },
    getInsertTarget: () => document.querySelector('.job-details-jobs-unified-top-card__primary-description-container, .jobs-unified-top-card__primary-description, h1') || null,
  },
  'jobberman.com': {
    isDetailPage: () => /\/listings\//.test(location.href),
    getTitle: () => document.querySelector('h1, .job-title')?.innerText.trim() || '',
    getCompany: () => document.querySelector('.company-name a, .company-name, .employer-name')?.innerText.trim() || '',
    getDescription: () => document.querySelector('.job-detail-container, .section-body, .job-description')?.innerText.trim().slice(0, 3000) || '',
    getInsertTarget: () => document.querySelector('h1, .job-title, .company-name') || null,
  },
  'indeed.com': {
    isDetailPage: () => /\/viewjob|\/jobs\?/.test(location.href) || document.querySelector('#jobDescriptionText') !== null,
    getTitle: () => document.querySelector('h1[data-testid="jobsearch-JobInfoHeader-title"], h1')?.innerText.trim() || '',
    getCompany: () => document.querySelector('[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating a')?.innerText.trim() || '',
    getDescription: () => document.querySelector('#jobDescriptionText, .jobsearch-jobDescriptionText')?.innerText.trim().slice(0, 3000) || '',
    getInsertTarget: () => document.querySelector('[data-testid="inlineHeader-companyName"], h1') || null,
  },
  'myjobmag.com': {
    isDetailPage: () => /\/job\//.test(location.href),
    getTitle: () => document.querySelector('h1, h2.job-title')?.innerText.trim().split(' at ') || '',
    getCompany: () => {
      const m = document.querySelector('h1, h2')?.innerText.match(/ at (.+)$/i);
      return m ? m.trim() : document.querySelector('.company-name, .employer')?.innerText.trim() || '';
    },
    getDescription: () => document.querySelector('.job-description, .entry-content, #job-details')?.innerText.trim().slice(0, 3000) || '',
    getInsertTarget: () => document.querySelector('h1, .job-title') || null,
  }
};

function getSiteConfig() {
  const host = window.location.hostname;
  for (const [key, cfg] of Object.entries(SITE_CONFIGS)) {
    if (host.includes(key)) return { key, cfg };
  }
  return null;
}

function shieldSVG(color) {
  return `<svg width="12" height="12" viewBox="0 0 24 28" fill="none" style="display:inline-block;vertical-align:middle;">
    <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="${color}"/>
  </svg>`;
}

function createInteractiveBadge(verdict, riskScore, reasons, summary, companyName) {
  const corrected = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';
  const safety = Math.max(0, 100 - riskScore);
  const c = COLORS[corrected];

  const container = document.createElement('div');
  container.className = DETAIL_BADGE_CLASS;
  container.style.cssText = 'position:relative; display:inline-block; margin: 8px 0; vertical-align:middle; z-index:9999;';

  // Minimized trigger badge (Mirroring ApplySafe style)
  const pill = document.createElement('div');
  pill.style.cssText = `
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    background: ${c.bg}; border: 1px solid ${c.border};
    cursor: pointer; font-family: -apple-system, sans-serif;
    font-size: 11px; font-weight: 700; color: ${c.text};
    box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.15s ease;
  `;
  pill.innerHTML = `${shieldSVG(c.dot)} <span>Trustellix: ${safety}% Safe</span>`;
  container.appendChild(pill);

  // Hidden Forensic Hover Modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: absolute; top: calc(100% + 6px); left: 0;
    width: 320px; background: #FFFFFF; border: 1px solid #E2E8F0;
    border-radius: 12px; padding: 14px; display: none;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #1E293B;
  `;

  // Context Header
  let contentHtml = `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
      <span style="font-weight:800; font-size:13px; color:${c.text};">${c.label}</span>
      <span style="margin-left:auto; font-size:12px; font-weight:800; background:${c.bg}; padding:2px 6px; border-radius:4px; color:${c.text};">${safety}% Score</span>
    </div>
    <div style="font-size:11px; color:#64748B; margin-bottom:8px; font-weight:500;">ENTITY: <span style="color:#1E293B; font-weight:700;">${companyName || 'Unknown Entity'}</span></div>
  `;

  if (summary) {
    contentHtml += `<p style="font-size:11.5px; color:#334155; margin:0 0 10px; line-height:1.5; background:#F8FAFC; padding:8px; border-radius:6px;">${summary}</p>`;
  }

  // Inject Context-Specific Metrics from AI Findings
  if (reasons && reasons.length > 0) {
    contentHtml += `<div style="font-size:10px; font-weight:700; color:#94A3B8; letter-spacing:0.05em; text-transform:uppercase; margin-bottom:6px;">VERIFICATION ENGINE ANALYSIS</div>
                    <div style="display:flex; flex-direction:column; gap:6px;">`;
    reasons.forEach(r => {
      contentHtml += `
        <div style="display:flex; gap:6px; font-size:11px; line-height:1.4; color:#334155;">
          <span style="color:${c.dot}; flex-shrink:0; margin-top:2px;">●</span>
          <span>${r}</span>
        </div>`;
    });
    contentHtml += `</div>`;
  } else {
    contentHtml += `<div style="font-size:11px; color:#64748B;">Linguistic integrity intact. Infrastructure alignment verified standard.</div>`;
  }

  contentHtml += `
    <div style="margin-top:10px; padding-top:6px; border-top:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:9px; color:#94A3B8; font-weight:600;">TRUSTELLIX FORENSICS V1.0</span>
      <span style="font-size:9px; color:#2563EB; font-weight:700; cursor:pointer;" id="tsx-learn-more">Deep Audit Hub →</span>
    </div>`;

  modal.innerHTML = contentHtml;
  container.appendChild(modal);

  // Dynamic Position adjustment prevents overflow cutoff near margins
  function adjustModalPosition() {
    const rect = modal.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      modal.style.left = 'auto';
      modal.style.right = '0';
    }
  }

  // Trigger bindings matching execution goals
  container.addEventListener('mouseenter', () => {
    pill.style.transform = 'scale(1.02)';
    modal.style.display = 'block';
    adjustModalPosition();
  });

  container.addEventListener('mouseleave', () => {
    pill.style.transform = 'scale(1)';
    modal.style.display = 'none';
  });

  modal.querySelector('#tsx-learn-more')?.addEventListener('click', (e) => {
    e.stopPropagation();
    chrome.runtime.sendMessage({ type: 'OPEN_SITE' });
  });

  return container;
}

// ─── RUNTIME PIPELINE ORCHESTRATION ───────────────────────────────────────────

async function callVerify(text, companyName) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SCAN_JOB', text, companyName, fullScan: true },
      (res) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!res) return reject(new Error('Payload collection dropped'));
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

  if (!description || description.length < 40) return;

  lastScannedUrl = currentUrl;
  isScanning = true;

  const insertTarget = cfg.getInsertTarget();
  if (!insertTarget) { isScanning = false; return; }

  document.querySelectorAll('.' + DETAIL_BADGE_CLASS).forEach(el => el.remove());

  // Compact Minimal Loading State
  const loading = document.createElement('div');
  loading.className = DETAIL_BADGE_CLASS;
  loading.style.cssText = `
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    background: #EFF6FF; border: 1px solid #BFDBFE;
    font-family: -apple-system, sans-serif; font-size: 11px; font-weight:600; color: #1E40AF;
  `;
  loading.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#2563EB; animation: pulse 1s infinite alternate;"></span> Scanning metrics...`;
  insertTarget.insertAdjacentElement('afterend', loading);

  try {
    // Structural Payload Packing Strategy passed cleanly down the stream
    const combinedDataStream = `COMPANY_CONTEXT: ${company}\nPOSITION_TITLE: ${title}\n\nRAW_DESCRIPTION_BODY:\n${description}`;
    const result = await callVerify(combinedDataStream, company);
    
    loading.remove();
    isScanning = false;

    if (!result || !result.success) return;

    const data = result.data;
    const riskScore = data.riskScore ?? 0;
    const verdict = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';

    const cleanBadge = createInteractiveBadge(verdict, riskScore, data.reasons || [], data.summary || '', company);
    insertTarget.insertAdjacentElement('afterend', cleanBadge);

  } catch (err) {
    loading.remove();
    isScanning = false;
  }
}

// ─── INITIALIZATION BOOTSTRAP ────────────────────────────────────────────────

function init() {
  const siteObj = getSiteConfig();
  if (!siteObj) return;

  setTimeout(() => scanDetailPage(siteObj), 1500);

  let lastHref = location.href;
  const watcher = new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      lastScannedUrl = '';
      isScanning = false;
      document.querySelectorAll('.' + DETAIL_BADGE_CLASS).forEach(el => el.remove());
      setTimeout(() => scanDetailPage(siteObj), 1500);
    }
  });
  watcher.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 400);
}