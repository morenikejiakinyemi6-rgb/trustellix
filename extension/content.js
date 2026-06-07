const ATTR = 'data-tsx';
const BADGE_CLASS = 'tsx-badge';

const NAVY = '#0F172A';
const COLORS = {
  GREEN:  { bg: '#ECFDF5', border: '#6EE7B7', text: '#065F46', dot: '#10B981', label: 'Safe' },
  YELLOW: { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412', dot: '#F97316', label: 'Caution' },
  RED:    { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#EF4444', label: 'High Risk' },
};

const CONFIGS = {
  'linkedin.com': {
    cards: '.job-card-container',
    title: '.job-card-list__title--link, h3 a, h3',
    company: '.job-card-container__primary-description, .artdeco-entity-lockup__subtitle span',
    description: '.job-card-container__metadata-item',
    insertAfter: '.job-card-container__primary-description, .artdeco-entity-lockup__subtitle',
    getDetailPanel: () => {
      const selectors = [
        '.jobs-details',
        '.job-view-layout',
        '.jobs-search__job-details--container',
        '[data-view-name="job-details"]',
        '.scaffold-layout__detail',
      ];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    },
    getDetailTitle: (panel) => {
      const h1 = panel.querySelector('h1');
      return h1 ? h1.innerText.trim() : '';
    },
    getDetailCompany: (panel) => {
      const selectors = [
        '.job-details-jobs-unified-top-card__company-name a',
        '.jobs-unified-top-card__company-name a',
        '.t-black--light a',
        '[data-test-app-aware-link]',
      ];
      for (const s of selectors) {
        const el = panel.querySelector(s);
        if (el) return el.innerText.trim();
      }
      return '';
    },
    getDetailDescription: (panel) => {
      const selectors = [
        '.jobs-description',
        '#job-details',
        '.jobs-box__html-content',
        '.jobs-description-content',
        '.jobs-description__content',
      ];
      for (const s of selectors) {
        const el = panel.querySelector(s);
        if (el) return el.innerText.trim().slice(0, 2000);
      }
      return '';
    },
    getDetailInsertTarget: (panel) => {
      const selectors = [
        '.job-details-jobs-unified-top-card__primary-description-container',
        '.jobs-unified-top-card__primary-description',
        '.jobs-details-top-card__company-info',
        '.jobs-unified-top-card__content--two-pane',
        'h1',
      ];
      for (const s of selectors) {
        const el = panel.querySelector(s);
        if (el) return el;
      }
      return null;
    },
  },
  'jobberman.com': {
    cards: 'article.job-card, .job-list-item, .job-card, [class*="job-item"], .jobs-block article',
    title: 'h2, h3, .job-title a, [class*="job-title"], a.title',
    company: '.company-name, .employer, [class*="company"], .job-company',
    description: '.job-description, .summary, [class*="description"], .job-info',
    insertAfter: '.company-name, .employer, h3, h2, [class*="company"]',
    getDetailPanel: () => {
      const selectors = [
        '.job-detail-container',
        '.single-job',
        '.job-detail',
        '[class*="job-detail"]',
        'article.job',
        '.job-content',
        'main article',
      ];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return document.querySelector('main') || document.querySelector('article');
    },
    getDetailTitle: (panel) => {
      const el = panel.querySelector('h1, h2.title, .job-title');
      return el ? el.innerText.trim() : '';
    },
    getDetailCompany: (panel) => {
      const el = panel.querySelector('.company-name, .employer-name, [class*="company"], a[class*="company"]');
      return el ? el.innerText.trim() : '';
    },
    getDetailDescription: (panel) => {  
      // Collect ALL text from the page relevant to the job  
      const parts = [];  
      const selectors = [    
        '.job-detail-container',    
        '.job-detail-body',    
        '.description-body',    
        '[class*="description"]',    
        '.job-summary',    
        '.responsibilities',    
        '.requirements',    
        'article',    
        'main',  
      ];  
      for (const s of selectors) {    
        const el = panel.querySelector(s) || document.querySelector(s);    
        if (el) {      
          parts.push(el.innerText.trim());      
          break;    
        }  
      }  
      if (parts.length === 0) {    
        (panel || document).querySelectorAll('p, li, h2, h3').forEach(el => {      
          parts.push(el.innerText.trim());    
        });  
      }  
      return parts.join(' ').slice(0, 2500);
    },
    getDetailInsertTarget: (panel) => {  
      // Try to insert after the job title h1 or h2  
      const title = panel.querySelector('h1, h2.title, [class*="job-title"]') || document.querySelector('h1, h2.title, [class*="job-title"]');  
      if (title) return title;  
      // Fallback: after the breadcrumb  
      return panel.querySelector('.breadcrumb, nav, .job-header') || document.querySelector('.breadcrumb, nav, .job-header') || null;
    },
  },
  'hotnigerianjobs.com': {
  cards: 'h2.entry-title, .entry-title, article h2',
  title: 'a',
  company: '.entry-meta, .posted-by',
  description: '.entry-summary, p',
  insertAfter: 'a',
  getDetailPanel: () => {
    return document.querySelector('.entry-content, .post-content, .single-post, main') || document.body;
  },
  getDetailTitle: (panel) => {
    const el = document.querySelector('h1.entry-title, h1, h2.entry-title');
    return el ? el.innerText.trim() : '';
  },
  getDetailCompany: (panel) => {
    // HotNigerianJobs embeds company name in the title: "Job Title at Company Name"
    const title = document.querySelector('h1.entry-title, h1');
    if (title) {
      const match = title.innerText.match(/ at (.+)$/i);
      if (match) return match[1].trim();
    }
    return '';
  },
  getDetailDescription: (panel) => {
    const allText = [];
    document.querySelectorAll('.entry-content p, .entry-content li, .entry-content h3, .entry-content h4').forEach(el => {
      allText.push(el.innerText.trim());
    });
    if (allText.length > 0) return allText.join(' ').slice(0, 2500);
    const content = document.querySelector('.entry-content, .post-content');
    return content ? content.innerText.trim().slice(0, 2500) : '';
  },
  getDetailInsertTarget: (panel) => {
    return document.querySelector('h1.entry-title, h1, h2.entry-title') || null;
  },
},
  'indeed.com': {
    cards: '.job_seen_beacon, .tapItem, [data-jk]',
    title: 'h2.jobTitle span, .jobTitle a span',
    company: '.companyName, [data-testid="company-name"]',
    description: '.job-snippet',
    insertAfter: '.companyName, [data-testid="company-name"]',
    getDetailPanel: () => {
      const selectors = [
        '.jobsearch-JobComponent',
        '[data-testid="jobsearch-ViewJobLayout"]',
        '.jobsearch-ViewJobLayout',
        '#jobDescriptionText',
      ];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el;
      }
      return null;
    },
    getDetailTitle: (panel) => {
      const el = panel.querySelector('h1') || document.querySelector('h1');
      return el ? el.innerText.trim() : '';
    },
    getDetailCompany: (panel) => {
      const selectors = [
        '[data-testid="inlineHeader-companyName"] a',
        '.jobsearch-InlineCompanyRating a',
        '.icl-u-lg-mr--sm',
      ];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return el.innerText.trim();
      }
      return '';
    },
    getDetailDescription: (panel) => {
      const el = document.querySelector('#jobDescriptionText');
      return el ? el.innerText.trim().slice(0, 2000) : '';
    },
    getDetailInsertTarget: (panel) => {
      return document.querySelector('[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating') || null;
    },
  },
  'myjobmag.com': {
  cards: '.job-listing-item, .single-job, article.job, [class*="job-list"] li',
  title: 'h2 a, h3 a, .job-title a, a.title',
  company: '.company-name, [class*="company"], .employer',
  description: 'p, .job-excerpt',
  insertAfter: '.company-name, [class*="company"], h3, h2',
  getDetailPanel: () => {
    return document.querySelector('.job-detail, .single-job-detail, main article, main, .content-area') || null;
  },
  getDetailTitle: (panel) => {
    const el = document.querySelector('h1, .job-title, h2.entry-title');
    return el ? el.innerText.trim() : '';
  },
  getDetailCompany: (panel) => {
    const selectors = ['.company-name', '[class*="company"]', '.employer', '.organization'];
    for (const s of selectors) {
      const el = document.querySelector(s);
      if (el) return el.innerText.trim();
    }
    return '';
  },
  getDetailDescription: (panel) => {
    const allText = [];
    document.querySelectorAll('main p, main li, .job-description p, .job-description li, .entry-content p').forEach(el => {
      allText.push(el.innerText.trim());
    });
    if (allText.length > 0) return allText.join(' ').slice(0, 2500);
    return panel ? panel.innerText.trim().slice(0, 2500) : '';
  },
  getDetailInsertTarget: (panel) => {
    return document.querySelector('h1, .job-title, .company-name') || null;
  },
},
};

function getConfig() {
  const host = window.location.hostname;
  for (const [key, cfg] of Object.entries(CONFIGS)) {
    if (host.includes(key)) return { key, cfg };
  }
  return null;
}

function getText(el, selector) {
  if (!selector) return '';
  const found = el.querySelector(selector);
  return found ? found.innerText.trim() : '';
}

function getVerdictFromScore(riskScore) {
  if (riskScore >= 61) return 'RED';
  if (riskScore >= 31) return 'YELLOW';
  return 'GREEN';
}

function safetyPercent(riskScore) {
  return Math.max(0, 100 - riskScore);
}

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

function createTooltip(verdict, safety, reasons, summary) {
  const c = COLORS[verdict];
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    display:none; position:fixed; z-index:2147483647;
    background:#0F172A; color:#F1F5F9;
    border-radius:12px; padding:16px;
    max-width:300px; min-width:240px;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
    font-size:12.5px; line-height:1.55;
    box-shadow:0 12px 40px rgba(0,0,0,0.4);
    pointer-events:none; box-sizing:border-box;
    border:1px solid rgba(255,255,255,0.08);
  `;

  const header = document.createElement('div');
  header.style.cssText = `display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);`;
  header.innerHTML = `
    ${shieldSVG(c.dot, verdict)}
    <div style="flex:1;">
      <div style="font-weight:800;font-size:13px;color:${c.dot};">Trustellix</div>
      <div style="font-size:10px;color:#94A3B8;letter-spacing:0.04em;">JOB SAFETY ENGINE</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:18px;font-weight:800;color:${c.dot};line-height:1;">${safety}%</div>
      <div style="font-size:9px;color:#94A3B8;letter-spacing:0.04em;">SAFETY</div>
    </div>
  `;
  tooltip.appendChild(header);

  const badge = document.createElement('div');
  badge.style.cssText = `display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:5px;background:${c.bg};border:1px solid ${c.border};font-size:11px;color:${c.text};font-weight:700;margin-bottom:10px;`;
  badge.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:${c.dot};display:block;"></span>${c.label}`;
  tooltip.appendChild(badge);

 if (verdict === 'GREEN') {
    const msg = document.createElement('p');
    msg.style.cssText = `font-size:12px;color:#94A3B8;margin:0;line-height:1.6;`;
    msg.textContent = safety >= 90
      ? 'No threat signals found. Domain and content appear clean.'
      : 'Minor unverifiable signals detected. No explicit scam patterns found but proceed with some caution.';
    tooltip.appendChild(msg);
  } else {
    if (summary) {
      const s = document.createElement('p');
      s.style.cssText = `font-size:12px;color:#CBD5E1;margin:0 0 10px;line-height:1.6;`;
      s.textContent = summary.replace(/-/g, ' ');
      tooltip.appendChild(s);
    }
    if (reasons && reasons.length > 0) {
      reasons.slice(0, 4).forEach((r, i) => {
        const row = document.createElement('div');
        row.style.cssText = `display:flex;gap:8px;padding:6px 0;border-top:1px solid rgba(255,255,255,0.06);align-items:flex-start;font-size:12px;`;
        row.innerHTML = `<span style="color:${c.dot};font-weight:800;flex-shrink:0;font-size:10px;margin-top:2px;min-width:16px;">${String(i+1).padStart(2,'0')}</span><span style="color:#CBD5E1;">${r.replace(/-/g, ' ')}</span>`;
        tooltip.appendChild(row);
      });
    }
  }

  const footer = document.createElement('div');
  footer.style.cssText = `margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.07);font-size:10px;color:#475569;`;
  footer.textContent = 'Trustellix Job Safety Engine';
  tooltip.appendChild(footer);

  document.body.appendChild(tooltip);
  return tooltip;
}

function createCompactBadge(verdict, riskScore, reasons, summary) {
  const correctedVerdict = getVerdictFromScore(riskScore);
  const c = COLORS[correctedVerdict];
  const safety = safetyPercent(riskScore);

  const wrap = document.createElement('span');
  wrap.className = BADGE_CLASS;
  wrap.style.cssText = `
    display:inline-flex;align-items:center;gap:5px;
    margin:5px 0 2px 0;padding:3px 8px 3px 5px;
    border-radius:5px;background:${c.bg};border:1px solid ${c.border};
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
    font-size:11px;color:${c.text};cursor:pointer;
    width:fit-content;position:relative;line-height:1.2;
    vertical-align:middle;box-sizing:border-box;
  `;
  wrap.innerHTML = `
    ${shieldSVG(c.dot, correctedVerdict)}
    <span style="font-weight:700;font-size:10.5px;">${safety}%</span>
    <span style="font-size:10px;opacity:0.8;font-weight:600;">${c.label}</span>
  `;

  const tooltip = createTooltip(correctedVerdict, safety, reasons, summary);

  wrap.addEventListener('mouseenter', () => {
    const rect = wrap.getBoundingClientRect();
    tooltip.style.display = 'block';
    let left = rect.left;
    let top = rect.bottom + 8;
    if (left + 300 > window.innerWidth - 12) left = window.innerWidth - 312;
    if (top + 260 > window.innerHeight) top = rect.top - 268;
    tooltip.style.left = `${Math.max(8, left)}px`;
    tooltip.style.top = `${Math.max(8, top)}px`;
  });
  wrap.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });

  return wrap;
}

async function callScan(text, companyName, fullScan) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SCAN_JOB', text, companyName, fullScan: fullScan || false },
      (res) => {
        if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message));
        if (!res) return reject(new Error('No response'));
        resolve(res);
      }
    );
  });
}

async function processCard(card, cfg) {
  if (card.getAttribute(ATTR)) return;
  card.setAttribute(ATTR, 'processing');

  const title   = getText(card, cfg.title);
  const company = getText(card, cfg.company);
  const desc    = getText(card, cfg.description);
  const combined = [title, company, desc].filter(Boolean).join(' ');

  if (combined.length < 8 || !company) { card.setAttribute(ATTR, 'skip'); return; }

  const target = card.querySelector(cfg.insertAfter);
  if (!target) { card.setAttribute(ATTR, 'skip'); return; }
  if (target.nextSibling && target.nextSibling.classList && target.nextSibling.classList.contains(BADGE_CLASS)) {
    card.setAttribute(ATTR, 'done'); return;
  }

  const loading = document.createElement('span');
  loading.className = BADGE_CLASS;
  loading.style.cssText = `display:inline-flex;align-items:center;gap:5px;margin:5px 0 2px 0;padding:3px 8px;border-radius:5px;background:#F8FAFC;border:1px solid #E2E8F0;font-family:-apple-system,sans-serif;font-size:10px;color:#94A3B8;width:fit-content;`;
  loading.textContent = 'Checking...';
  target.insertAdjacentElement('afterend', loading);

  try {
    const result = await callScan(combined, company);
    loading.remove();
    if (result.success) {
      const { verdict, riskScore, reasons, summary } = result.data;
      const badge = createCompactBadge(verdict, riskScore, reasons, summary);
      target.insertAdjacentElement('afterend', badge);
    }
    card.setAttribute(ATTR, 'done');
  } catch {
    loading.remove();
    card.setAttribute(ATTR, 'error');
  }
}

let detailScanned = '';
let detailScanning = false;

async function processDetailPanel(cfg) {
  if (detailScanning) return;

  const panel = cfg.getDetailPanel();
  if (!panel) return;

  const title   = cfg.getDetailTitle(panel);
  const company = cfg.getDetailCompany(panel);
  const desc    = cfg.getDetailDescription(panel);
  const combined = [title, company, desc].filter(Boolean).join(' ');
  const fingerprint = (company + title).slice(0, 80);

  if (!fingerprint.trim() || fingerprint === detailScanned || combined.length < 20) return;
  detailScanned = fingerprint;
  detailScanning = true;

  const insertTarget = cfg.getDetailInsertTarget(panel);
  if (!insertTarget) { detailScanning = false; return; }

  document.querySelectorAll('.tsx-detail-badge').forEach(el => el.remove());

  const loading = document.createElement('div');
  loading.className = 'tsx-detail-badge';
  loading.style.cssText = `display:inline-flex;align-items:center;gap:8px;margin:12px 0;padding:10px 16px;border-radius:8px;background:#F8FAFC;border:1.5px solid #E2E8F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:13px;color:#94A3B8;`;
  loading.innerHTML = `${shieldSVG('#94A3B8', 'GREEN')}<span>Trustellix is analyzing this job...</span>`;
  insertTarget.insertAdjacentElement('afterend', loading);

  try {
    const result = await callScan(combined, company, true);
    loading.remove();
    detailScanning = false;

    if (!result.success) return;

    const { verdict, riskScore, reasons, summary } = result.data;
    const correctedVerdict = getVerdictFromScore(riskScore);
    const safety = safetyPercent(riskScore);
    const c = COLORS[correctedVerdict];

    const card = document.createElement('div');
    card.className = 'tsx-detail-badge';
    card.style.cssText = `margin:14px 0;padding:16px 18px;border-radius:10px;background:${c.bg};border:1.5px solid ${c.border};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;max-width:100%;box-sizing:border-box;`;

    const topRow = document.createElement('div');
    topRow.style.cssText = `display:flex;align-items:center;gap:10px;margin-bottom:${summary || (reasons && reasons.length) ? '12px' : '0'};`;
    topRow.innerHTML = `${shieldSVG(c.dot, correctedVerdict)}<span style="font-weight:800;font-size:14px;color:${c.text};">Trustellix: ${c.label}</span><span style="margin-left:auto;font-size:13px;color:${c.text};font-weight:700;">${safety}% Safe</span>`;
    card.appendChild(topRow);

    if (correctedVerdict === 'GREEN') {
      const msg = document.createElement('p');
      msg.style.cssText = `font-size:13px;color:${c.text};opacity:0.8;margin:0;line-height:1.65;`;
      msg.textContent = safety >= 90
        ? 'No threat signals detected. This listing appears legitimate based on domain, content, and behavioral analysis.'
        : 'Some minor unverifiable signals detected. No explicit scam patterns found but the company presence is limited. Research before applying.';
      card.appendChild(msg);
    } else {
      if (summary) {
        const s = document.createElement('p');
        s.style.cssText = `font-size:13px;color:${c.text};opacity:0.85;margin:0 0 ${reasons && reasons.length ? '12px' : '0'};line-height:1.65;`;
        s.textContent = summary.replace(/-/g, ' ');
        card.appendChild(s);
      }
      if (reasons && reasons.length) {
        reasons.slice(0, 3).forEach(r => {
          const row = document.createElement('div');
          row.style.cssText = `display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:${c.text};opacity:0.85;margin-top:7px;`;
          row.innerHTML = `<span style="flex-shrink:0;margin-top:3px;font-size:8px;color:${c.dot};">●</span><span>${r.replace(/-/g, ' ')}</span>`;
          card.appendChild(row);
        });
      }
    }

    insertTarget.insertAdjacentElement('afterend', card);
  } catch {
    loading.remove();
    detailScanning = false;
  }
}

function addFloatingIndicator() {
  if (document.getElementById('tsx-float')) return;

  const float = document.createElement('div');
  float.id = 'tsx-float';
  float.title = 'Trustellix is active on this page';
  float.style.cssText = `
    position:fixed; bottom:20px; right:20px; z-index:2147483646;
    width:40px; height:40px; border-radius:50%;
    background:#2563EB; box-shadow:0 4px 16px rgba(37,99,235,0.4);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; transition:transform 0.2s, box-shadow 0.2s;
    border:2px solid rgba(255,255,255,0.3);
  `;
  float.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 28" fill="none"><path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="white"/><path d="M8.5 13.5l2.5 2.5 4.5-5" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const pulse = document.createElement('span');
  pulse.style.cssText = `position:absolute;top:0;right:0;width:10px;height:10px;border-radius:50%;background:#10B981;border:2px solid white;`;
  float.appendChild(pulse);

  float.addEventListener('mouseenter', () => {
    float.style.transform = 'scale(1.1)';
    float.style.boxShadow = '0 6px 24px rgba(37,99,235,0.5)';
  });
  float.addEventListener('mouseleave', () => {
    float.style.transform = 'scale(1)';
    float.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)';
  });

  document.body.appendChild(float);
}

function scanPage(cfgObj) {
  const { cfg } = cfgObj;
  document.querySelectorAll(cfg.cards).forEach(card => {
    if (card.getAttribute(ATTR)) return;
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight + 600 && rect.bottom > -200) {
      processCard(card, cfg);
    }
  });
  processDetailPanel(cfg);
}

function init() {
  const cfgObj = getConfig();
  if (!cfgObj) return;

  addFloatingIndicator();
  setInterval(() => {
  try {
    chrome.runtime.sendMessage({ type: 'PING' }, () => {
      void chrome.runtime.lastError;
    });
  } catch (e) {
    // context invalidated — extension was reloaded, ignore
  }
}, 25000);

  setTimeout(() => scanPage(cfgObj), 1200);

  let scrollT;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => scanPage(cfgObj), 400);
  }, { passive: true });

  let lastUrl = location.href;
  let urlT;
  const urlObserver = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      detailScanned = '';
      detailScanning = false;
      clearTimeout(urlT);
      urlT = setTimeout(() => {
  scanPage(cfgObj);
  // Try again after 3 seconds for slow-loading panels
  setTimeout(() => {
    detailScanned = '';
    scanPage(cfgObj);
  }, 3000);
}, 1000);
    }
  });
  urlObserver.observe(document.body, { childList: true, subtree: true });

  let mutationT;
  const observer = new MutationObserver((mutations) => {
    const hasNew = mutations.some(m => m.addedNodes.length > 0);
    if (!hasNew) return;
    const isOwn = mutations.some(m =>
      [...m.addedNodes].some(n =>
        n.nodeType === 1 &&
        (n.classList?.contains(BADGE_CLASS) ||
         n.classList?.contains('tsx-detail-badge') ||
         n.id === 'tsx-float' ||
         n.querySelector?.('.' + BADGE_CLASS))
      )
    );
    if (isOwn) return;
    clearTimeout(mutationT);
    mutationT = setTimeout(() => scanPage(cfgObj), 800);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 600);
}