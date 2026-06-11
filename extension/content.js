const DETAIL_BADGE_CLASS = 'tsx-inline-container';

const COLORS = {
  GREEN:  { bg: '#ECFDF5', border: '#10B981', text: '#065F46', dot: '#10B981', label: 'Verified Safe' },
  YELLOW: { bg: '#FFF7ED', border: '#F97316', text: '#9A3412', dot: '#F97316', label: 'Caution Advised' },
  RED:    { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', dot: '#EF4444', label: 'High Risk Threat' },
};

// ─── SITE CONFIGS ────────────────────────────────────────────────────────────

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

// ─── SHIELD SVG FUNCTION ──────────────────────────────────────────────────────

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

// ─── INTERACTIVE HOVER CONTAINER ─────────────────────────────────────────────

function createInteractiveBadge(verdict, riskScore, reasons, summary, companyName, rawData) {
  const corrected = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';
  const safety = Math.max(0, 100 - riskScore);
  const c = COLORS[corrected];

  const container = document.createElement('div');
  container.className = DETAIL_BADGE_CLASS;
  container.style.cssText = 'position:relative; display:inline-block; margin: 12px 0; vertical-align:middle; z-index:99999;';

  // The small trigger pill that stays anchored inline
  const pill = document.createElement('div');
  pill.style.cssText = `
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 20px;
    background: ${c.bg}; border: 1.5px solid ${c.border};
    cursor: pointer; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px; font-weight: 700; color: ${c.text};
    box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: transform 0.15s ease;
  `;
  pill.innerHTML = `${shieldSVG(c.dot, corrected)} <span>Trustellix: ${safety}% Safe</span>`;
  container.appendChild(pill);

  // Hidden Detailed Forensic Hover Modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: absolute; top: calc(100% + 6px); left: 0;
    width: 340px; background: #FFFFFF; border: 1px solid #CBD5E1;
    border-radius: 12px; padding: 16px; display: none;
    box-shadow: 0 12px 28px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1E293B;
  `;

  // Context Header
  let contentHtml = `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
      ${shieldSVG(c.dot, corrected)}
      <span style="font-weight:800; font-size:13px; color:${c.text};">Trustellix: ${c.label}</span>
      <span style="margin-left:auto; font-size:12px; font-weight:800; background:${c.bg}; padding:2px 6px; border-radius:4px; color:${c.text};">${safety}% Safe</span>
    </div>
    <div style="font-size:11px; color:#64748B; margin-bottom:8px; font-weight:600;">TARGET ENTITY: <span style="color:#1E293B; font-weight:800; text-transform:uppercase;">${companyName || 'Unknown Entity'}</span></div>
  `;

  // Summary Statement Section
  if (summary) {
    contentHtml += `<p style="font-size:12px; color:${c.text}; opacity:0.95; margin:0 0 12px; line-height:1.5; background:${c.bg}; padding:10px; border-radius:6px; border-left: 3px solid ${c.dot};">${summary.replace(/-/g, ' ')}</p>`;
  }

  // Inject Structural Indicators
  if (rawData && (rawData.structuralDiscrepancies?.length > 0 || rawData.operationalAnomalies?.length > 0)) {
    contentHtml += `<div style="font-size:9.5px; font-weight:700; color:#64748B; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:6px;">⚑ DETECTED THREAT SIGNALS</div>`;
    
    rawData.structuralDiscrepancies.forEach(f => {
      contentHtml += `
        <div style="padding:6px 10px; border-radius:6px; background:#FEF2F2; border: 1px solid #FECACA; margin-bottom:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1px;">
            <span style="font-size:11px; font-weight:700; color:#991B1B;">${f.field}</span>
            <span style="font-size:8.5px; font-weight:700; color:#EF4444; background:#FEE2E2; padding:1px 4px; border-radius:3px;">${f.severity}</span>
          </div>
          <div style="font-size:10.5px; color:#7F1D1D; opacity:0.9;">${f.finding}</div>
        </div>`;
    });
  } else if (reasons && reasons.length > 0) {
    contentHtml += `<div style="font-size:9.5px; font-weight:700; color:#64748B; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:6px;">VERIFICATION FINDINGS</div>
                    <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:10px;">`;
    reasons.forEach(r => {
      contentHtml += `
        <div style="display:flex; gap:6px; font-size:11.5px; line-height:1.4; color:#334155;">
          <span style="color:${c.dot}; flex-shrink:0; margin-top:2px;">●</span>
          <span>${r.replace(/-/g, ' ')}</span>
        </div>`;
    });
    contentHtml += `</div>`;
  } else {
    // Tailored legitimate indicator displaying company context
    contentHtml += `
      <div style="margin-bottom:8px; padding:8px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:6px; display:flex; gap:6px; align-items:start;">
        <span style="color:#10B981; font-size:12px;">✓</span>
        <span style="font-size:11px; color:#065F46; line-height:1.4;">Linguistic verification intact. <strong>${companyName || 'The recruiter profile'}</strong> aligns completely with verifiable structural recruitment patterns.</span>
      </div>`;
  }

  // Footer Actions
  contentHtml += `
    <div style="margin-top:12px; padding-top:8px; border-top:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-size:9px; color:#94A3B8; font-weight:600;">TRUSTELLIX ENGINE V1.0</span>
      <span style="font-size:9.5px; color:#2563EB; font-weight:700; cursor:pointer;" id="tsx-learn-more">Deep Audit Dashboard →</span>
    </div>`;

  modal.innerHTML = contentHtml;
  container.appendChild(modal);

  function adjustModalPosition() {
    const rect = modal.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      modal.style.left = 'auto';
      modal.style.right = '0';
    }
  }

  container.addEventListener('mouseenter', () => {
    pill.style.transform = 'scale(1.03)';
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

// ─── FLOATING CONTROL ICON (RESTORED) ─────────────────────────────────────────

function addFloatingIndicator() {
  if (document.getElementById('tsx-float')) return;

  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position:fixed; bottom:68px; right:16px; z-index:2147483645;
    background:#0F172A; color:#F1F5F9; border-radius:8px; padding:10px 14px;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
    font-size:12px; line-height:1.5; box-shadow:0 8px 24px rgba(0,0,0,0.3);
    white-space:nowrap; display:none; border:1px solid rgba(255,255,255,0.08);
  `;
  tooltip.innerHTML = `
    <div style="font-weight:700; color:#38BDF8; margin-bottom:2px;">Trustellix Guard Active</div>
    <div style="color:#94A3B8;">Reviewing layout descriptions automatically</div>
  `;
  document.body.appendChild(tooltip);

  const float = document.createElement('div');
  float.id = 'tsx-float';
  float.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:2147483646;
    width:42px; height:42px; border-radius:50%;
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
    <span id="tsx-float-pulse" style="position:absolute; top:0; right:0; width:10px; height:10px; border-radius:50%; background:#10B981; border:2px solid white;"></span>
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
    float.style.background = '#F97316';
    float.style.boxShadow = '0 4px 16px rgba(249,115,22,0.4)';
  } else {
    pulse.style.background = '#10B981';
    float.style.background = '#2563EB';
    float.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';
  }
}

// ─── RUNTIME SCAN PIPELINE ───────────────────────────────────────────────────

async function callVerify(text, companyName) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SCAN_JOB', text, companyName, fullScan: true },
      { id: 'tsx-call' },
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

  if (description.length < 50) return;

  lastScannedUrl = currentUrl;
  isScanning = true;

  const insertTarget = cfg.getInsertTarget();
  if (!insertTarget) { isScanning = false; return; }

  document.querySelectorAll('.' + DETAIL_BADGE_CLASS).forEach(el => el.remove());

  // Loading text element anchored locally
  const loading = document.createElement('div');
  loading.className = DETAIL_BADGE_CLASS;
  loading.style.cssText = `
    display:inline-flex; align-items:center; gap:8px;
    margin:8px 0; padding:6px 12px; border-radius:20px;
    background:#EFF6FF; border:1.5px solid #BFDBFE;
    font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    font-size:11px; color:#1E40AF; font-weight:600;
  `;
  loading.innerHTML = `<span>🛡️ Trustellix is auditing ${company || 'listing'}...</span>`;
  insertTarget.insertAdjacentElement('afterend', loading);

  try {
    const fullText = [title, company, description].filter(Boolean).join('\n\n');
    const result = await callVerify(fullText, company);
    loading.remove();
    isScanning = false;

    if (!result || !result.success) return;

    const data = result.data;
    const riskScore = data.riskScore ?? 0;
    const verdict = riskScore >= 61 ? 'RED' : riskScore >= 31 ? 'YELLOW' : 'GREEN';

    // Map rich structured parameters cleanly for our forensic hover module
    const rawData = {
      structuralDiscrepancies: (data.reasons || []).map(r => ({ field: 'Audit Alert', finding: r, severity: riskScore >= 61 ? 'HIGH' : 'MEDIUM' })),
      operationalAnomalies: [],
      complianceValues: { domainAgeRisk: 'UNKNOWN', emailAuthAlignment: 'NOT_APPLICABLE' }
    };

    const badge = createInteractiveBadge(verdict, riskScore, data.reasons || [], data.summary || '', company, rawData);
    insertTarget.insertAdjacentElement('afterend', badge);
    updateFloatingIndicator(verdict);

  } catch (err) {
    console.error("Analysis Pipeline Exception:", err);
    loading.remove();
    isScanning = false;
  }
}

function pingBackground() {
  try {
    chrome.runtime.sendMessage({ type: 'PING' }, () => { void chrome.runtime.lastError; });
  } catch (e) {}
}

// ─── INITIALIZATION ORCHESTRATOR ──────────────────────────────────────────────

function init() {
  const siteObj = getSiteConfig();
  if (!siteObj) return;

  // Restore floating controls immediately
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
    }
  });
  urlWatcher.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 500);
}