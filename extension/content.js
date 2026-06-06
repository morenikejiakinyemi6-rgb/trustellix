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
    cards: '.jobs-search-results-list__list-item, .job-card-container, .jobs-search-results__list-item',
    title: '.job-card-list__title--link, .job-card-container__link, h3 a, h3',
    company: '.job-card-container__primary-description, .artdeco-entity-lockup__subtitle span',
    description: '.job-card-container__metadata-item',
    insertAfter: '.job-card-container__primary-description, .artdeco-entity-lockup__subtitle, .job-card-list__title',
    detailPanel: '.jobs-search__job-details, [data-view-name="job-details"], .jobs-details, .job-view-layout',
    detailTitle: 'h1, h2',
    detailCompany: '.job-details-jobs-unified-top-card__company-name a, .jobs-unified-top-card__company-name a, .t-black--light a, .jobs-details-top-card__company-url',
    detailDescription: '.jobs-description__container, .jobs-description, .jobs-box__html-content, #job-details, .jobs-description-content',
    detailInsert: '.job-details-jobs-unified-top-card__primary-description-container, .jobs-unified-top-card__primary-description, .jobs-details-top-card__company-info, h1',
  },
  'jobberman.com': {
    cards: 'article.job-card, .job-list-item, .job-card, [class*="job-item"], .flex.flex-col.rounded-md',
    title: 'h2, h3, .job-title a, [class*="job-title"], a.text-brand-linked',
    company: '.company-name, .employer, [class*="company"], .text-brand-gray-dark font',
    description: '.job-description, .summary, [class*="description"], .text-brand-gray',
    insertAfter: '.company-name, .employer, h3, h2, .text-brand-gray-dark',
    detailPanel: '.job-overview__summary, .job-detail-container, .single-job, .job-detail, [class*="job-detail"]',
    detailTitle: 'h1, h2.title, .text-brand-black-dark',
    detailCompany: '.company-name, .employer-name, [class*="company"], .text-brand-linked-dark',
    detailDescription: '.job-overview__description, .job-description, .description-body, [class*="description"]',
    detailInsert: '.job-overview__summary-info, .company-name, .employer-name, h1',
  },
  'ngcareers.com': {
    cards: '.job-item, .job-listing, article',
    title: 'h2 a, h3 a, .job-title',
    company: '.company, .employer, [class*="company"]',
    description: '.description, .summary',
    insertAfter: '.company, .employer, h3',
    detailPanel: '.job-detail, .single-job',
    detailTitle: 'h1',
    detailCompany: '.company-name',
    detailDescription: '.job-description',
    detailInsert: '.company-name',
  },
  'hotnigerianjobs.com': {
    cards: 'article, .job-item, .entry',
    title: 'h2 a, h3 a, .entry-title a',
    company: '.company, [class*="company"]',
    description: 'p, .summary',
    insertAfter: 'h2, h3, .entry-title',
    detailPanel: '.entry-content, .job-content, article',
    detailTitle: 'h1, h2',
    detailCompany: '.company',
    detailDescription: '.entry-content p',
    detailInsert: 'h1',
  },
  'indeed.com': {
    cards: '.job_seen_beacon, .tapItem, [data-jk]',
    title: 'h2.jobTitle span, .jobTitle a span',
    company: '.companyName, [data-testid="company-name"]',
    description: '.job-snippet',
    insertAfter: '.companyName, [data-testid="company-name"]',
    detailPanel: '.jobsearch-JobComponent, [data-testid="jobsearch-ViewJobLayout"], #jobDescriptionText',
    detailTitle: 'h1',
    detailCompany: '[data-testid="inlineHeader-companyName"] a',
    detailDescription: '#jobDescriptionText',
    detailInsert: '[data-testid="inlineHeader-companyName"]',
  },
  'myjobmag.com': {
    cards: '.job-listing, article, .job-item',
    title: 'h2 a, h3 a',
    company: '.company, .employer',
    description: '.description',
    insertAfter: '.company, .employer',
    detailPanel: '.job-detail, .single-job',
    detailTitle: 'h1',
    detailCompany: '.company-name',
    detailDescription: '.job-description',
    detailInsert: '.company-name',
  },
};

function getConfig() {
  const host = window.location.hostname;
  for (const [key, cfg] of Object.entries(CONFIGS)) {
    if (host.includes(key)) return cfg;
  }
  return null;
}

function getText(el, selector) {
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

function shieldIcon(verdict) {
  const c = COLORS[verdict];
  if (verdict === 'GREEN') {
    return `<svg width="13" height="14" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;">
      <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="${c.dot}"/>
      <path d="M8.5 13.5l2.5 2.5 4.5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  if (verdict === 'YELLOW') {
    return `<svg width="13" height="14" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;">
      <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="${c.dot}"/>
      <text x="12" y="17" text-anchor="middle" fill="white" font-size="11" font-weight="800" font-family="Arial">!</text>
    </svg>`;
  }
  return `<svg width="13" height="14" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;">
    <path d="M12 2L3 6.5v7c0 5.5 3.9 10.65 9 11.9 5.1-1.25 9-6.4 9-11.9v-7L12 2z" fill="${c.dot}"/>
    <path d="M9 11l6 6M15 11l-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function buildTooltipContent(verdict, safetyPct, reasons, summary) {
  const c = COLORS[verdict];
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    display: none; position: fixed; z-index: 2147483647;
    background: ${NAVY}; color: #F1F5F9;
    border-radius: 12px; padding: 16px;
    max-width: 300px; min-width: 240px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    font-size: 12.5px; line-height: 1.55;
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
    pointer-events: none; box-sizing: border-box;
    border: 1px solid rgba(255,255,255,0.08);
  `;

  const headerRow = document.createElement('div');
  headerRow.style.cssText = `display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);`;
  headerRow.innerHTML = `
    ${shieldIcon(verdict)}
    <div style="flex:1;">
      <div style="font-weight:800;font-size:13px;color:${c.dot};">Trustellix</div>
      <div style="font-size:10px;color:#94A3B8;letter-spacing:0.04em;">JOB SAFETY ENGINE</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:18px;font-weight:800;color:${c.dot};line-height:1;">${safetyPct}%</div>
      <div style="font-size:9px;color:#94A3B8;letter-spacing:0.04em;">SAFETY</div>
    </div>
  `;
  tooltip.appendChild(headerRow);

  const statusBadge = document.createElement('div');
  statusBadge.style.cssText = `
    display:inline-flex;align-items:center;gap:6px;
    padding:4px 10px;border-radius:5px;
    background:${c.bg};border:1px solid ${c.border};
    font-size:11px;color:${c.text};font-weight:700;
    margin-bottom:${reasons?.length || summary ? '12px' : '0'};
  `;
  statusBadge.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:${c.dot};display:block;"></span>${c.label}`;
  tooltip.appendChild(statusBadge);

  if (summary && verdict !== 'GREEN') {
    const sumEl = document.createElement('p');
    sumEl.style.cssText = `font-size:12px;color:#CBD5E1;margin:0 0 ${reasons?.length ? '10px' : '0'} 0;line-height:1.6;`;
    sumEl.textContent = summary.replace(/-/g, ' ');
    tooltip.appendChild(sumEl);
  }

  if (verdict === 'GREEN' && (!reasons || reasons.length === 0)) {
    const clean = document.createElement('p');
    clean.style.cssText = `font-size:12px;color:#94A3B8;margin:0;line-height:1.6;`;
    clean.textContent = 'No threat signals detected. This listing appears clean based on available data.';
    tooltip.appendChild(clean);
  }

  if (reasons?.length && verdict !== 'GREEN') {
    const list = document.createElement('div');
    list.style.cssText = `display:flex;flex-direction:column;gap:0;`;
    reasons.slice(0, 4).forEach((r, i) => {
      const row = document.createElement('div');
      row.style.cssText = `display:flex;gap:8px;padding:6px 0;border-top:1px solid rgba(255,255,255,0.06);align-items:flex-start;font-size:12px;`;
      row.innerHTML = `
        <span style="color:${c.dot};font-weight:800;flex-shrink:0;font-size:10px;margin-top:2px;min-width:16px;">${String(i+1).padStart(2,'0')}</span>
        <span style="color:#CBD5E1;">${r.replace(/-/g, ' ')}</span>
      `;
      list.appendChild(row);
    });
    tooltip.appendChild(list);
  }

  const footer = document.createElement('div');
  footer.style.cssText = `
    margin-top:12px;padding-top:10px;
    border-top:1px solid rgba(255,255,255,0.07);
    display:flex;align-items:center;gap:6px;
  `;
  footer.innerHTML = `
    ${shieldIcon(verdict)}
    <span style="font-size:10px;color:#475569;letter-spacing:0.03em;">Trustellix Job Safety Engine</span>
  `;
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
    display: inline-flex; align-items: center; gap: 5px;
    margin: 5px 0 2px 0; padding: 3px 8px 3px 5px;
    border-radius: 5px; background: ${c.bg};
    border: 1px solid ${c.border};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    font-size: 11px; color: ${c.text}; cursor: pointer;
    width: fit-content; position: relative; line-height: 1.2;
    vertical-align: middle; box-sizing: border-box;
    transition: opacity 0.15s;
  `;

  wrap.innerHTML = `
    ${shieldIcon(correctedVerdict)}
    <span style="font-weight:700;font-size:10.5px;letter-spacing:0.01em;">${safety}%</span>
    <span style="font-size:10px;opacity:0.8;font-weight:600;">${c.label}</span>
  `;

  const tooltip = buildTooltipContent(correctedVerdict, safety, reasons, summary);

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

async function callScan(text, companyName) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'SCAN_JOB', text, companyName },
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
  if (target.nextSibling?.classList?.contains(BADGE_CLASS)) { card.setAttribute(ATTR, 'done'); return; }

  const loading = document.createElement('span');
  loading.className = BADGE_CLASS;
  loading.style.cssText = `
    display:inline-flex;align-items:center;gap:5px;
    margin:5px 0 2px 0;padding:3px 8px;border-radius:5px;
    background:#F8FAFC;border:1px solid #E2E8F0;
    font-family:-apple-system,sans-serif;font-size:10px;
    color:#94A3B8;width:fit-content;
  `;
  loading.innerHTML = `${shieldIcon('GREEN')}<span>Checking...</span>`;
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

async function processDetailPanel(cfg) {
  const panelSelectors = cfg.detailPanel.split(', ');
  let panel = null;
  for (const sel of panelSelectors) {
    panel = document.querySelector(sel.trim());
    if (panel) break;
  }
  if (!panel) return;

  const title   = getText(panel, cfg.detailTitle);
  const company = getText(panel, cfg.detailCompany);
  const desc    = getText(panel, cfg.detailDescription);
  const combined = [title, company, desc].filter(Boolean).join(' ');
  const fingerprint = (company + title).slice(0, 80);

  if (fingerprint === detailScanned || combined.length < 15) return;
  detailScanned = fingerprint;

  const insertSelectors = cfg.detailInsert.split(', ');
  let insertTarget = null;
  for (const sel of insertSelectors) {
    insertTarget = panel.querySelector(sel.trim());
    if (insertTarget) break;
  }

  if (!insertTarget) {
    const fallback = panel.querySelector('h1, h2');
    if (fallback) insertTarget = fallback;
    else return;
  }

  document.querySelectorAll('.tsx-detail-badge').forEach(el => el.remove());

  const loading = document.createElement('div');
  loading.className = 'tsx-detail-badge';
  loading.style.cssText = `
    display:inline-flex;align-items:center;gap:8px;
    margin:12px 0;padding:10px 16px;border-radius:8px;
    background:#F8FAFC;border:1.5px solid #E2E8F0;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;
    font-size:13px;color:#94A3B8;
  `;
  loading.innerHTML = `${shieldIcon('GREEN')}<span>Trustellix is analyzing this job...</span>`;
  insertTarget.insertAdjacentElement('afterend', loading);

  try {
    const result = await callScan(combined, company);
    loading.remove();
    if (!result.success) return;

    const { verdict, riskScore, reasons, summary } = result.data;
    const correctedVerdict = getVerdictFromScore(riskScore);
    const safety = safetyPercent(riskScore);
    const c = COLORS[correctedVerdict];

    const card = document.createElement('div');
    card.className = 'tsx-detail-badge';
    card.style.cssText = `
      margin: 14px 0; padding: 16px 18px;
      border-radius: 10px; background: ${c.bg};
      border: 1.5px solid ${c.border};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      max-width: 100%; box-sizing: border-box;
    `;

    const topRow = document.createElement('div');
    topRow.style.cssText = `display:flex;align-items:center;gap:10px;margin-bottom:${summary || reasons?.length ? '12px' : '0'};`;
    topRow.innerHTML = `
      ${shieldIcon(correctedVerdict)}
      <span style="font-weight:800;font-size:14px;color:${c.text};">Trustellix: ${c.label}</span>
      <span style="margin-left:auto;font-size:13px;color:${c.text};font-weight:700;">${safety}% Safe</span>
    `;
    card.appendChild(topRow);

    if (summary && correctedVerdict !== 'GREEN') {
      const sumEl = document.createElement('p');
      sumEl.style.cssText = `font-size:13px;color:${c.text};opacity:0.85;margin:0 0 ${reasons?.length ? '12px' : '0'} 0;line-height:1.65;`;
      sumEl.textContent = summary.replace(/-/g, ' ');
      card.appendChild(sumEl);
    }

    if (correctedVerdict === 'GREEN') {
      const cleanMsg = document.createElement('p');
      cleanMsg.style.cssText = `font-size:13px;color:${c.text};opacity:0.8;margin:0;line-height:1.65;`;
      cleanMsg.textContent = 'No threat signals detected. This listing appears legitimate based on our analysis.';
      card.appendChild(cleanMsg);
    }

    if (reasons?.length && correctedVerdict !== 'GREEN') {
      reasons.slice(0, 3).forEach(r => {
        const row = document.createElement('div');
        row.style.cssText = `display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:${c.text};opacity:0.85;margin-top:7px;`;
        row.innerHTML = `<span style="flex-shrink:0;margin-top:3px;font-size:8px;color:${c.dot};">●</span><span>${r.replace(/-/g, ' ')}</span>`;
        card.appendChild(row);
      });
    }

    insertTarget.insertAdjacentElement('afterend', card);
  } catch {
    loading.remove();
  }
}

function scanPage(cfg) {
  document.querySelectorAll(cfg.cards).forEach(card => {
    if (card.getAttribute(ATTR)) return;
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight + 600 && rect.bottom > -200) {
      processCard(card, cfg);
    }
  });
  if (cfg.detailPanel) processDetailPanel(cfg);
}

function init() {
  const cfg = getConfig();
  if (!cfg) return;

  setTimeout(() => scanPage(cfg), 1200);

  let scrollT;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(() => scanPage(cfg), 400);
  }, { passive: true });

  let mutationT;
  const observer = new MutationObserver((mutations) => {
    const hasNew = mutations.some(m => m.addedNodes.length > 0);
    if (!hasNew) return;
    const isOwn = mutations.some(m =>
      [...m.addedNodes].some(n =>
        n.nodeType === 1 &&
        (n.classList?.contains(BADGE_CLASS) ||
          n.classList?.contains('tsx-detail-badge') ||
          n.querySelector?.('.' + BADGE_CLASS))
      )
    );
    if (isOwn) return;
    clearTimeout(mutationT);
    mutationT = setTimeout(() => scanPage(cfg), 800);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 600);
}