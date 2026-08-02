/* ==========================================================================
   GharSaz 360 — Application Logic
   Vanilla JS, zero external dependencies (fully offline-capable on first
   load). LocalStorage persistence with a versioned schema, custom modal
   forms, a generic CRUD engine reused across most modules, and dedicated
   logic for Rent, Udhar, Zakat, Vehicle, Solar and the encrypted Vault.
   ========================================================================== */

'use strict';

/* ---------------------------------------------------------------------- *
 * 1. ICONS  (inline SVG strings — no icon-font / CDN dependency)
 * ---------------------------------------------------------------------- */
const ICN = {
  menu:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
  sun:   `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  moon:  `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`,
  settings: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
  plus:  `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
  wa:    `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.2L2 22l4.9-1.3C8.5 21.6 10.2 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2zm5.1 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.7-2.7-1.1-4.4-3.8-4.6-4-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.8.8.3.1.4.2.5.3.1.2.1.9-.1 1.5z"/></svg>`,
  home:  `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>`,
  wallet:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-5a2 2 0 0 0 0 4h6"/></svg>`,
  key:   `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 20 3M15 8l3 3M18 5l3 3"/></svg>`,
  users: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  hammer:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5a2.1 2.1 0 1 1-3-3L12 9"/><path d="M17.6 3 22 7.4l-2 2-4.4-4.4Z"/><path d="m14.4 5.8 3.8 3.8"/></svg>`,
  box:   `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>`,
  wrench:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2.6-2.6z"/></svg>`,
  car:   `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M5 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm14 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/><path d="M3 17V11l2-5h14l2 5v6"/></svg>`,
  moonstar:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 3v4M17 5h4"/></svg>`,
  sunbolt:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`,
  basket:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 4-7M19 11l-4-7M2 11h20l-1.6 9.3a2 2 0 0 1-2 1.7H5.6a2 2 0 0 1-2-1.7L2 11Z"/><path d="M12 15v3M9 15v3M15 15v3"/></svg>`,
  shield:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z"/><path d="M9.5 12.5l1.8 1.8 3.2-3.6"/></svg>`,
  calendarheart:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M12 17.5s-2.5-1.5-2.5-3.2a1.6 1.6 0 0 1 2.9-1 1.6 1.6 0 0 1 2.9 1c0 1.7-2.5 3.2-3.3 3.2Z"/></svg>`,
  target:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>`,
  grid:  `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  chevron:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
  back:  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m18 6-12 12M6 6l12 12"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>`,
  edit:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
  down:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13m0 0-4-4m4 4 4-4M4 21h16"/></svg>`,
  up:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21h16M12 21V8m0 0 4 4m-4-4-4 4"/></svg>`,
  print: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  lock:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>`,
  phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.5 2.9.6a2 2 0 0 1 1.8 2.1Z"/></svg>`,
  droplet:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13Z"/></svg>`,
  bell:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
  search:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  briefcase:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><path d="M2 13h20"/></svg>`,
  hardhat:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-2a8 8 0 0 1 16 0v2"/><path d="M2 18h20"/><path d="M12 4v6"/><path d="M9 4h6"/></svg>`,
  checksquare:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/></svg>`,
  check:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  bank:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M4 21V9l8-6 8 6v12"/><path d="M9 21v-6h6v6"/></svg>`,
  repeat:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  umbrella:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2Z"/><path d="M12 12v8a2 2 0 0 1-4 0"/><path d="M12 2v2"/></svg>`,
  heartpulse:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.6 3-3.4 3-5.5A5.5 5.5 0 0 0 12 5.6 5.5 5.5 0 0 0 2 8.5C2 12 5 15 12 20c3-2 5-3.6 6.4-5"/><path d="M3.5 9h4l2-3 3 6 2-3h5"/></svg>`,
  gift:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M12 8c-1.5 0-3-1-3-2.5S10.3 3 12 4.5C13.7 3 15 4 15 5.5S13.5 8 12 8Z"/></svg>`,
  refresh:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/></svg>`,
};
function icon(name, color){ return `<span style="color:${color||'currentColor'};display:flex">${ICN[name]||''}</span>`; }

/* ---------------------------------------------------------------------- *
 * 2. UTILITIES
 * ---------------------------------------------------------------------- */
const $ = (sel, root) => (root||document).querySelector(sel);
const $$ = (sel, root) => Array.from((root||document).querySelectorAll(sel));
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
const CURRENCIES = {
  PKR:{symbol:'Rs',name:'Pakistani Rupee',locale:'en-PK'},
  INR:{symbol:'₹',name:'Indian Rupee',locale:'en-IN'},
  USD:{symbol:'$',name:'US Dollar',locale:'en-US'},
  GBP:{symbol:'£',name:'British Pound',locale:'en-GB'},
  EUR:{symbol:'€',name:'Euro',locale:'de-DE'},
  SAR:{symbol:'ر.س',name:'Saudi Riyal',locale:'ar-SA'},
  AED:{symbol:'د.إ',name:'UAE Dirham',locale:'ar-AE'},
  BDT:{symbol:'৳',name:'Bangladeshi Taka',locale:'bn-BD'},
  QAR:{symbol:'ر.ق',name:'Qatari Riyal',locale:'ar-QA'},
  KWD:{symbol:'د.ك',name:'Kuwaiti Dinar',locale:'ar-KW'},
  OMR:{symbol:'ر.ع.',name:'Omani Rial',locale:'ar-OM'},
  MYR:{symbol:'RM',name:'Malaysian Ringgit',locale:'ms-MY'},
  CAD:{symbol:'C$',name:'Canadian Dollar',locale:'en-CA'},
  AUD:{symbol:'A$',name:'Australian Dollar',locale:'en-AU'},
  TRY:{symbol:'₺',name:'Turkish Lira',locale:'tr-TR'},
};
function currentCurrency(){
  const code = (SETTINGS && SETTINGS.currency) ? SETTINGS.currency : 'PKR';
  return CURRENCIES[code] || CURRENCIES.PKR;
}
function fmtMoney(n){
  n = Number(n)||0;
  const c = currentCurrency();
  return c.symbol + ' ' + n.toLocaleString(c.locale, {maximumFractionDigits:0});
}
function sortByDateDesc(arr, field){
  return arr.slice().sort((a,b)=> String(b[field]||'').localeCompare(String(a[field]||'')));
}
function fmtDate(d){
  if(!d) return '—';
  const dt = new Date(d);
  if(isNaN(dt)) return d;
  return dt.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}
function daysUntil(d){
  if(!d) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(d); target.setHours(0,0,0,0);
  return Math.round((target-today)/86400000);
}
function todayISO(){ return new Date().toISOString().slice(0,10); }
function monthKey(d){ return (d||todayISO()).slice(0,7); }
let toastTimer;
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function escapeHtml(s){
  return String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function csvEscape(s){
  s = String(s??'');
  return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
}
/* ---------------------------------------------------------------------- *
 * REAL PDF GENERATOR — pure JavaScript, zero dependencies. Builds a
 * genuinely valid .pdf file directly per the PDF 1.4 spec (multi-page,
 * Helvetica base-14 font, no embedding needed). This is what powers the
 * actual "Download PDF" button, separate from window.print().
 * Note: only Latin/ASCII characters render (Helvetica has no Urdu/Arabic
 * glyphs without font embedding); non-ASCII characters are shown as '?'.
 * ---------------------------------------------------------------------- */
function pdfEscape(s){
  return String(s).replace(/[^\x20-\x7E]/g,'?').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
}
function pdfStringToBlob(body){
  // PDF byte offsets in the xref table are computed against body.length
  // (JS string length = number of UTF-16 code units). If we hand that
  // string straight to `new Blob([body])`, the browser re-encodes it as
  // UTF-8, and any non-ASCII character would shift every byte offset
  // after it — silently corrupting the file. Converting to a raw
  // Uint8Array (one byte per char code) guarantees 1 char = 1 byte, so
  // the offsets we calculated stay valid. All PDF syntax + pdfEscape'd
  // text is already restricted to the 0-255 range, so this is safe.
  const bytes = new Uint8Array(body.length);
  for(let i=0;i<body.length;i++) bytes[i] = body.charCodeAt(i) & 0xFF;
  return new Blob([bytes], {type:'application/pdf'});
}
function wrapLine(line, maxChars){
  if(line.length<=maxChars) return [line];
  const out = [];
  let remaining = line;
  while(remaining.length>maxChars){
    let cut = remaining.lastIndexOf(' ', maxChars);
    if(cut<=0) cut = maxChars;
    out.push(remaining.slice(0,cut));
    remaining = remaining.slice(cut).trim();
  }
  if(remaining) out.push(remaining);
  return out;
}
function hexToRgb01(hex){
  hex = hex.replace('#','');
  return [parseInt(hex.slice(0,2),16)/255, parseInt(hex.slice(2,4),16)/255, parseInt(hex.slice(4,6),16)/255];
}
function pdfTruncate(s, maxChars){
  s = String(s??'');
  if(s.length<=maxChars) return s;
  return maxChars>2 ? s.slice(0,maxChars-2)+'..' : s.slice(0,maxChars);
}

/* ---------------------------------------------------------------------- *
 * ADVANCED LEDGER PDF — colorful, statement-style PDF with a branded
 * header band, colored summary/total boxes, colored section headers and
 * alternating row shading. Pure JS, zero dependencies, multi-page with
 * automatic pagination and page numbers.
 * ---------------------------------------------------------------------- */
function buildLedgerPDF(data){
  const PAGE_W = 612, PAGE_H = 792, MARGIN = 36;
  const BOTTOM = 46;
  const GREEN = hexToRgb01('#059669'), GREEN_DARK = hexToRgb01('#065f46');
  const GRAY = [0.42,0.45,0.44], LGRAY = [0.95,0.96,0.95], WHITE = [1,1,1], BLACK = [0.12,0.14,0.13];

  function fillOp(c){ return `${c[0].toFixed(3)} ${c[1].toFixed(3)} ${c[2].toFixed(3)} rg`; }
  function rect(x,y,w,h,color){ return `${fillOp(color)}\n${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re f\n`; }
  function text(x,y,str,font,size,color){
    return `BT ${fillOp(color)} /${font} ${size} Tf 1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm (${pdfEscape(str)}) Tj ET\n`;
  }
  function lightTint(color){ return color.map(c=> c + (1-c)*0.87); }

  const pagesOps = [];
  let ops = '';
  let y = 0;
  let pageIndex = 0;

  function startFirstPage(){
    ops = '';
    ops += rect(0, PAGE_H-78, PAGE_W, 78, GREEN);
    ops += text(MARGIN, PAGE_H-40, data.title, 'F2', 17, WHITE);
    ops += text(MARGIN, PAGE_H-58, `GharSaz 360  -  Generated ${fmtDate(todayISO())}`, 'F1', 9, WHITE);
    y = PAGE_H-100;
  }
  function startNewPage(){
    pagesOps.push(ops);
    pageIndex++;
    ops = '';
    ops += rect(0, PAGE_H-40, PAGE_W, 40, GREEN_DARK);
    ops += text(MARGIN, PAGE_H-26, `${data.title} (continued)`, 'F2', 11, WHITE);
    y = PAGE_H-58;
  }
  function ensure(h){ if(y-h < BOTTOM) startNewPage(); }

  startFirstPage();

  // Summary boxes (max 3 per row)
  if(data.summary && data.summary.length){
    ensure(64);
    const items = data.summary.slice(0,3);
    const n = items.length;
    const gap = 10;
    const boxW = (PAGE_W - 2*MARGIN - (n-1)*gap)/n;
    const boxH = 48;
    const by = y - boxH;
    items.forEach((s,i)=>{
      const bx = MARGIN + i*(boxW+gap);
      const color = hexToRgb01(s.color||'#059669');
      ops += rect(bx, by, boxW, boxH, lightTint(color));
      ops += text(bx+8, by+boxH-15, pdfTruncate(s.label, Math.floor(boxW/4.2)), 'F1', 7.5, GRAY);
      ops += text(bx+8, by+10, pdfTruncate(s.value, Math.floor(boxW/6)), 'F2', 13, color);
    });
    y -= (boxH + 16);
  }

  if(data.note){
    ensure(16);
    ops += text(MARGIN, y-10, pdfTruncate(data.note, 110), 'F1', 8, GRAY);
    y -= 20;
  }

  data.sections.forEach(sec=>{
    ensure(22);
    ops += rect(MARGIN, y-17, PAGE_W-2*MARGIN, 19, GREEN_DARK);
    ops += text(MARGIN+7, y-12, sec.title, 'F2', 10, WHITE);
    y -= 23;

    if(!sec.rows.length){
      ensure(16);
      ops += text(MARGIN+4, y-10, 'Koi record nahi mila.', 'F1', 8.5, GRAY);
      y -= 20;
      return;
    }

    const cols = sec.headers.length;
    const tableW = PAGE_W - 2*MARGIN;
    const colW = tableW/cols;
    const rowH = 15;
    const maxChars = Math.max(4, Math.floor(colW/3.9));

    ensure(rowH+2);
    ops += rect(MARGIN, y-rowH, tableW, rowH, LGRAY);
    sec.headers.forEach((h,ci)=>{
      ops += text(MARGIN+ci*colW+5, y-rowH+5, pdfTruncate(h,maxChars), 'F2', 7.5, GREEN_DARK);
    });
    y -= rowH;

    sec.rows.forEach((row,ri)=>{
      ensure(rowH);
      if(ri%2===1) ops += rect(MARGIN, y-rowH, tableW, rowH, LGRAY);
      row.forEach((cell,ci)=>{
        ops += text(MARGIN+ci*colW+5, y-rowH+5, pdfTruncate(cell,maxChars), 'F1', 7.5, BLACK);
      });
      y -= rowH;
    });
    y -= 12;
  });

  pagesOps.push(ops);
  const totalPages = pagesOps.length;

  // Footer with page numbers on every page
  pagesOps.forEach((pageOps, idx)=>{
    pagesOps[idx] = pageOps
      + rect(MARGIN, 30, PAGE_W-2*MARGIN, 0.75, [0.85,0.87,0.86])
      + text(PAGE_W/2-70, 18, `Generated by GharSaz 360 - 100% Offline App`, 'F1', 7, GRAY)
      + text(PAGE_W-MARGIN-42, 18, `Page ${idx+1} of ${totalPages}`, 'F1', 7, GRAY);
  });

  // ---- Assemble PDF object structure ----
  const pageObjIds = [], contentObjIds = [];
  let nextId = 3;
  pagesOps.forEach(()=>{ pageObjIds.push(nextId++); contentObjIds.push(nextId++); });
  const fontRegId = nextId++, fontBoldId = nextId++;

  let body = '%PDF-1.4\n';
  const offsets = {};
  function addObj(id, content){ offsets[id] = body.length; body += `${id} 0 obj\n${content}\nendobj\n`; }

  addObj(1, `<< /Type /Catalog /Pages 2 0 R >>`);
  addObj(2, `<< /Type /Pages /Kids [${pageObjIds.map(id=>id+' 0 R').join(' ')}] /Count ${pagesOps.length} >>`);

  pagesOps.forEach((pageOps, idx)=>{
    const pid = pageObjIds[idx], cid = contentObjIds[idx];
    addObj(pid, `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${fontRegId} 0 R /F2 ${fontBoldId} 0 R >> >> /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Contents ${cid} 0 R >>`);
    addObj(cid, `<< /Length ${pageOps.length} >>\nstream\n${pageOps}\nendstream`);
  });

  addObj(fontRegId, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  addObj(fontBoldId, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  const xrefStart = body.length;
  const totalObjs = fontBoldId;
  let xref = `xref\n0 ${totalObjs+1}\n0000000000 65535 f \n`;
  for(let id=1; id<=totalObjs; id++) xref += String(offsets[id]||0).padStart(10,'0') + ' 00000 n \n';
  body += xref;
  body += `trailer\n<< /Size ${totalObjs+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdfStringToBlob(body);
}
function buildSimplePDF(title, bodyText){
  const rawLines = (title ? [title, ''] : []).concat(bodyText.split('\n'));
  let lines = [];
  rawLines.forEach(l=> lines.push(...wrapLine(l, 100)));
  if(!lines.length) lines = ['(no data)'];

  const linesPerPage = 58;
  const pages = [];
  for(let i=0;i<lines.length;i+=linesPerPage) pages.push(lines.slice(i,i+linesPerPage));

  const pageObjIds = [], contentObjIds = [];
  let nextId = 3;
  pages.forEach(()=>{ pageObjIds.push(nextId++); contentObjIds.push(nextId++); });
  const fontObjId = nextId++;

  let body = '%PDF-1.4\n';
  const offsets = {};
  function addObj(id, content){
    offsets[id] = body.length;
    body += `${id} 0 obj\n${content}\nendobj\n`;
  }

  addObj(1, `<< /Type /Catalog /Pages 2 0 R >>`);
  addObj(2, `<< /Type /Pages /Kids [${pageObjIds.map(id=>id+' 0 R').join(' ')}] /Count ${pages.length} >>`);

  pages.forEach((pageLines, idx)=>{
    const pid = pageObjIds[idx], cid = contentObjIds[idx];
    addObj(pid, `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${fontObjId} 0 R >> >> /MediaBox [0 0 612 792] /Contents ${cid} 0 R >>`);
    let stream = 'BT /F1 9 Tf 40 760 Td 12 TL\n';
    pageLines.forEach(line=>{ stream += `(${pdfEscape(line)}) Tj T*\n`; });
    stream += 'ET';
    addObj(cid, `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  addObj(fontObjId, `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  const xrefStart = body.length;
  const totalObjs = fontObjId;
  let xref = `xref\n0 ${totalObjs+1}\n0000000000 65535 f \n`;
  for(let id=1; id<=totalObjs; id++){
    xref += String(offsets[id]||0).padStart(10,'0') + ' 00000 n \n';
  }
  body += xref;
  body += `trailer\n<< /Size ${totalObjs+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return pdfStringToBlob(body);
}

function blobToBase64(blob){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=>{
      const dataUrl = reader.result;
      const base64 = dataUrl.slice(dataUrl.indexOf(',')+1);
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
function isStandaloneApp(){
  try{
    return window.matchMedia('(display-mode: standalone)').matches
        || window.matchMedia('(display-mode: fullscreen)').matches
        || window.navigator.standalone === true
        || document.referrer.indexOf('android-app://') === 0;
  }catch(e){ return false; }
}
async function copyTextUniversal(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(e){ /* fall through to legacy method */ }
  try{
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.left = '-9999px'; ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }catch(e){
    return false;
  }
}
function showCopyFallback(filename, content){
  openSheet(`${sheetHeader(filename)}
    <div class="help-text" style="margin-bottom:10px">Is app mein direct file save/download support nahi hai. Neeche wale text ko copy kar ke kisi bhi jagah (WhatsApp, Email, Notes) paste kar dein.</div>
    <textarea readonly onclick="this.select()" style="width:100%;min-height:320px;font-family:monospace;font-size:12px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface-2)">${escapeHtml(content)}</textarea>
    <button class="btn btn-primary btn-block" style="margin-top:12px" id="copyNowBtn">Copy Karein</button>`,
    (root)=>{
      $('#copyNowBtn', root).addEventListener('click', async ()=>{
        const ok = await copyTextUniversal(content);
        toast(ok ? 'Copy ho gaya' : 'Text ko manually select karke copy karein (upar tap karein)');
      });
    });
}
async function downloadBlob(filename, blob, textFallback){
  const mime = blob.type || 'application/octet-stream';
  const standalone = isStandaloneApp();

  // 0. Native Android bridge — if this app was built in Android Studio
  // with the AndroidBridge JavaScript interface (see the provided
  // MainActivity.kt), this saves the file directly to the device's
  // Downloads folder using native code. This is the most reliable path
  // for an installed app since it doesn't depend on any web-platform
  // download/share API working inside the WebView at all.
  if(window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function'){
    try{
      const base64 = await blobToBase64(blob);
      const ok = window.AndroidBridge.saveFile(filename, base64, mime);
      if(ok !== false){ toast(filename+' Downloads folder mein save ho gaya'); return; }
    }catch(e){ console.warn('AndroidBridge.saveFile failed:', e); }
  }

  // 1. Web Share API — works well even inside installed apps when supported.
  try{
    const file = new File([blob], filename, {type:mime});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({files:[file], title:filename});
      return;
    }
  }catch(e){
    if(e && e.name === 'AbortError') return; // user closed the share sheet — not an error
    console.warn('Share failed:', e);
  }

  // 2. data: URI download. Different delivery mechanism than blob: — some
  // installed WebView shells that reject blob: URIs with "Can not handle
  // uri" will still accept data: URIs since they're self-contained and
  // don't need to be resolved back against the page context.
  try{
    const dataUrl = await new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=>resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const a = document.createElement('a');
    a.href = dataUrl; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    if(!standalone) return; // in a real browser tab this reliably works — stop here
    // Inside an installed app we can't detect success, so we still fall
    // through to also offer the guaranteed fallback below.
  }catch(e){
    console.warn('data: URI download failed:', e);
  }

  // 3. Classic blob: URI anchor download — normal browser tabs only
  // (proven unreliable inside some installed WebView shells).
  if(!standalone){
    try{
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; document.body.appendChild(a); a.click();
      a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 2000);
      return;
    }catch(e){
      console.warn('Blob download failed:', e);
    }
  }

  // 4. Last resort — only meaningful for text content (a PDF/binary can't
  // usefully be "copied" as text).
  if(typeof textFallback === 'string'){
    const ok = await copyTextUniversal(textFallback);
    if(ok){ toast(filename+' clipboard par copy ho gaya'); return; }
    showCopyFallback(filename, textFallback);
    return;
  }
  toast('Is app mein file save nahi ho saki — is APK ka WebView downloads ko block kar raha hai. Chrome browser mein (site ke URL par) try karein, ya app dobara TWA tool (PWABuilder) se banayen.');
}
async function downloadFile(filename, content, mime){
  const blob = new Blob([content], {type:mime||'application/octet-stream'});
  await downloadBlob(filename, blob, typeof content==='string'?content:undefined);
}
async function downloadPDF(filename, title, bodyText){
  const blob = buildSimplePDF(title, bodyText);
  await downloadBlob(filename, blob, bodyText);
}
async function downloadLedgerPDF(filename, printData){
  let blob;
  try{
    blob = buildLedgerPDF(printData);
  }catch(e){
    console.error('buildLedgerPDF failed:', e);
    toast('PDF banane mein masla aaya — text copy ho rahi hai');
    showCopyFallback(filename, printDataToText(printData));
    return;
  }
  try{
    await downloadBlob(filename, blob, printDataToText(printData));
  }catch(e){
    console.error('downloadBlob failed for PDF:', e);
    toast('Save karne mein masla aaya: '+(e && e.message ? e.message : 'unknown error'));
  }
}

/* ---------------------------------------------------------------------- *
 * 3. STATE  (persisted to localStorage — offline-first single source)
 * ---------------------------------------------------------------------- */
const STORAGE_KEY = 'gharsaz360_data_v1';
const SETTINGS_KEY = 'gharsaz360_settings_v1';

function defaultState(){
  return {
    budgets: [], incomes: [], expenses: [],
    properties: [], tenants: [], rentPayments: [],
    udhars: [], udharTx: [],
    constructionProjects: [], materials: [], labourers: [], attendance: [],
    assets: [], maintenanceLogs: [],
    vehicles: [], fuelLogs: [],
    zakatRecords: [], charityRecords: [],
    solarLogs: [],
    pantryItems: [],
    vaultMeta: null, vaultItems: [], emergencyContacts: [],
    events: [], eventItems: [],
    goals: [], goalTx: [],
    employees: [], staffAttendance: [], salaryAdvances: [], salaryPayments: [],
    labourWorkers: [], labourAttendance: [], labourAdvances: [], labourPayments: [],
    todos: [], bills: [], familyMembers: [], loans: [], loanPayments: [],
    subscriptions: [], insurancePolicies: [], healthRecords: [], importantDates: [],
  };
}
let DATA = loadData();
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){ console.error('load error', e); return defaultState(); }
}
function saveData(){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  }catch(e){
    console.error('save error', e);
    showErrorScreen('Data Save Nahi Ho Saka',
      'Aapke device par storage full hai ya browser ne local storage block kar diya hai (kabhi kabhi "Incognito/Private" mode mein aisa hota hai). Kripya normal browsing mode mein app kholein, ya kuch purana data export/delete kar ke jagah banayen.');
  }
}
function showErrorScreen(title, msg){
  const scr = $('#errorScreen');
  $('#errorTitle').textContent = title || 'Kuch Ghalat Ho Gaya';
  $('#errorMsg').textContent = msg || 'Ek unexpected error aa gayi hai. Aapka data mehfooz hai — app reload karke dobara try karein.';
  scr.style.display = 'flex';
}
function hideErrorScreen(){ $('#errorScreen').style.display = 'none'; }
window.addEventListener('error', (e)=>{
  console.error('Uncaught error:', e.error||e.message);
  showErrorScreen('Kuch Ghalat Ho Gaya', 'Ek unexpected technical error aa gayi hai. Aapka data mehfooz hai (locally saved) — "Reload App" dabayen.');
});
window.addEventListener('unhandledrejection', (e)=>{
  console.error('Unhandled promise rejection:', e.reason);
});
let SETTINGS = loadSettings();
function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    return Object.assign({theme:'light', whatsapp:'+923065772734', currency:'PKR', language:'en'}, raw?JSON.parse(raw):{});
  }catch(e){ return {theme:'light', whatsapp:'+923065772734', currency:'PKR', language:'en'}; }
}
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }

/* ---------------------------------------------------------------------- *
 * 4. EXPENSE CATEGORY TREE (preset, deeply nested)
 * ---------------------------------------------------------------------- */
const CATEGORY_TREE = {
  'Grocery & Pantry': ['Vegetables','Fruits','Milk/Dairy','Eggs','Meat/Chicken/Fish','Grains/Flour/Rice','Pulses/Daal','Spices/Oils','Sugar/Salt/Tea','Bakery Items','Frozen Food','Dry Fruits/Nuts','Beverages','Snacks','Pickles/Sauces','Baby Food/Formula','Cleaning Supplies','Toiletries'],
  'Health & Medical': ['Doctor Consultations','Medicines','Lab Tests/Reports','Emergency/Hospitalization','Dental','Vaccinations','Physiotherapy','Optical/Eyewear','Vitamins/Supplements','Mental Health/Therapy','Ambulance','Pharmacy Items'],
  'Utilities & Bills': ['Electricity Bill','Gas Bill','Water/Sewerage','Internet/Wifi','Mobile Load/Packages','Cable/DTH','Society/Maintenance Charges','Security/Guard Fee'],
  'Transport & Vehicle': ['Fuel/Petrol','Vehicle Repair/Servicing','Public Transport','Rickshaw/Taxi','Ride-hailing (Careem/Uber)','Parking Fee','Toll Tax','Vehicle Token Tax/Documents'],
  'Home & Domestic Staff': ['Maid/Servant Salary','Driver Salary','Cook Salary','Guard Salary','Home Maintenance/Repair','Furniture','Home Décor','Kitchenware/Utensils'],
  'Education': ['School/College Fees','Tuition/Coaching','Books/Stationery','University Fees','Exam/Admission Fees','Uniform','Kids Pocket Money','Educational Trips'],
  'Personal Care & Habits': ['Salon/Barber','Cosmetics/Makeup','Perfume','Cigarettes','Naswar/Paan/Gutka','Vaping/E-cigarette','Skincare Products','Haircare Products'],
  'Insurance & Financial': ['Life Insurance','Health Insurance','Vehicle Insurance','Home/Property Insurance','Bank Charges/Fees','Loan Installment','Investment/Savings','Credit Card Payment'],
  'Leisure & Entertainment': ['Dining Out','Movies/Cinema','Sports/Gym Membership','Hobbies','Clothes','Footwear','Electronics/Gadgets','Travel/Vacation','Games/App Subscriptions'],
  'Religious & Social': ['Zakat','Sadqah/Charity','Mosque Donation','Wedding/Function Gifts','Funeral Expenses','Aqiqah/Qurbani','Umrah/Hajj Savings'],
  'Pets': ['Pet Food','Vet Charges','Pet Accessories/Grooming'],
  'Miscellaneous': ['Stationery/Printing','Courier/Postage','Legal Fees','General Gifts','Fine/Penalty','Lost/Stolen','Other'],
};
const CATEGORY_COLORS = {
  'Grocery & Pantry':'#10b981','Health & Medical':'#ef4444','Utilities & Bills':'#0ea5e9',
  'Transport & Vehicle':'#f59e0b','Home & Domestic Staff':'#8b5cf6','Education':'#3b82f6',
  'Personal Care & Habits':'#ec4899','Insurance & Financial':'#14b8a6','Leisure & Entertainment':'#a855f7',
  'Religious & Social':'#059669','Pets':'#f97316','Miscellaneous':'#6b7280',
};

/* ---------------------------------------------------------------------- *
 * 4B. TRANSLATIONS — English / Urdu / Hindi. Covers navigation, module
 * names, and common Settings/Dashboard strings. (Deeper per-field form
 * labels throughout the 24 modules stay in English/Roman-Urdu for now —
 * translating every field across the whole app is a much larger,
 * separate effort; this covers the highest-visibility text so the app
 * reads naturally in all three languages at a glance.)
 * ---------------------------------------------------------------------- */
const LANGUAGES = {
  en:{name:'English', native:'English'},
  ur:{name:'Urdu', native:'اردو'},
  hi:{name:'Hindi', native:'हिन्दी'},
};
const MODULE_TRANSLATIONS = {
  dashboard:{ur:'ڈیش بورڈ', hi:'डैशबोर्ड'},
  more:{ur:'مزید', hi:'और'},
  budgets:{ur:'بجٹ اور آمدنی', hi:'बजट और आय'},
  expenses:{ur:'اخراجات', hi:'खर्च'},
  rent:{ur:'کرایہ', hi:'किराया'},
  udhar:{ur:'ادھار کھاتہ', hi:'उधार खाता'},
  construction:{ur:'تعمیرات', hi:'निर्माण'},
  salary:{ur:'تنخواہ کا انتظام', hi:'वेतन प्रबंधन'},
  labour:{ur:'مزدور کا انتظام', hi:'मज़दूर प्रबंधन'},
  todos:{ur:'کرنے کے کام', hi:'कार्य सूची'},
  bills:{ur:'بلوں کی یاد دہانی', hi:'बिल रिमाइंडर'},
  familyMembers:{ur:'خاندان کے افراد', hi:'परिवार के सदस्य'},
  loans:{ur:'قرض / قسط', hi:'ऋण / ईएमआई'},
  subscriptions:{ur:'سبسکرپشنز', hi:'सदस्यता'},
  insurancePolicies:{ur:'انشورنس پالیسیاں', hi:'बीमा पॉलिसी'},
  healthRecords:{ur:'صحت کا ریکارڈ', hi:'स्वास्थ्य रिकॉर्ड'},
  importantDates:{ur:'اہم تاریخیں', hi:'महत्वपूर्ण तिथियाँ'},
  assets:{ur:'اثاثے اور وارنٹی', hi:'संपत्ति और वारंटी'},
  maintenance:{ur:'دیکھ بھال', hi:'रखरखाव'},
  vehicle:{ur:'گاڑی کا ریکارڈ', hi:'वाहन लॉग'},
  zakat:{ur:'زکوٰۃ اور خیرات', hi:'ज़कात और दान'},
  solar:{ur:'سولر اور یوٹیلیٹی', hi:'सोलर और यूटिलिटी'},
  pantry:{ur:'کچن اسٹور', hi:'पेंट्री प्लानर'},
  vault:{ur:'دستاویز والٹ', hi:'दस्तावेज़ वॉल्ट'},
  events:{ur:'تقریب کا بجٹ', hi:'कार्यक्रम बजट'},
  goals:{ur:'بچت کے اہداف', hi:'बचत लक्ष्य'},
  settings:{ur:'ترتیبات', hi:'सेटिंग्स'},
};
function moduleLabel(m){
  if(!m) return '';
  const lang = (SETTINGS && SETTINGS.language) || 'en';
  if(lang==='en') return m.label;
  const tr = MODULE_TRANSLATIONS[m.id];
  return (tr && tr[lang]) ? tr[lang] : m.label;
}
const UI_STRINGS = {
  currency:{en:'Currency', ur:'کرنسی', hi:'मुद्रा'},
  language:{en:'Language', ur:'زبان', hi:'भाषा'},
  save:{en:'Save', ur:'محفوظ کریں', hi:'सेव करें'},
  cancel:{en:'Cancel', ur:'منسوخ کریں', hi:'रद्द करें'},
  delete:{en:'Delete', ur:'حذف کریں', hi:'हटाएं'},
  edit:{en:'Edit', ur:'ترمیم', hi:'संपादित करें'},
  thisMonthExpense:{en:'This Month Expense', ur:'اس مہینے کا خرچ', hi:'इस महीने का खर्च'},
  thisMonthIncome:{en:'This Month Income', ur:'اس مہینے کی آمدنی', hi:'इस महीने की आय'},
  rentPending:{en:'Rent Pending', ur:'کرایہ باقی', hi:'किराया बकाया'},
  udharOpen:{en:'Udhar Open', ur:'کھلا ادھار', hi:'खुला उधार'},
  reminders:{en:'Reminders', ur:'یاد دہانیاں', hi:'रिमाइंडर'},
  budgetsOverview:{en:'Budgets Overview', ur:'بجٹ کا جائزہ', hi:'बजट अवलोकन'},
  quickAccess:{en:'Quick Access', ur:'فوری رسائی', hi:'त्वरित पहुँच'},
  financialOverview:{en:'Financial Overview', ur:'مالی جائزہ', hi:'वित्तीय अवलोकन'},
  overallProfit:{en:'Overall Profit', ur:'کل منافع', hi:'कुल लाभ'},
  overallLoss:{en:'Overall Loss', ur:'کل نقصان', hi:'कुल हानि'},
  darkMode:{en:'Dark Mode', ur:'ڈارک موڈ', hi:'डार्क मोड'},
  backupRestore:{en:'Backup & Restore', ur:'بیک اپ اور بحالی', hi:'बैकअप और पुनर्स्थापना'},
  appearance:{en:'Appearance', ur:'ظاہری شکل', hi:'रूप-रंग'},
  support:{en:'Support', ur:'مدد', hi:'सहायता'},
  dangerZone:{en:'Danger Zone', ur:'خطرناک علاقہ', hi:'खतरनाक क्षेत्र'},
};
function t(key){
  const lang = (SETTINGS && SETTINGS.language) || 'en';
  const entry = UI_STRINGS[key];
  if(!entry) return key;
  return entry[lang] || entry.en || key;
}

/* ---------------------------------------------------------------------- *
 * 5. NAVIGATION
 * ---------------------------------------------------------------------- */
const BOTTOM_NAV = [
  {id:'dashboard', label:'Home', icon:'home'},
  {id:'expenses', label:'Expenses', icon:'wallet'},
  {id:'rent', label:'Rent', icon:'key'},
  {id:'udhar', label:'Udhar', icon:'users'},
  {id:'more', label:'More', icon:'grid'},
];
const ALL_MODULES = [
  {id:'dashboard', label:'Dashboard', icon:'home', color:'#059669'},
  {id:'budgets', label:'Budgets & Income', icon:'wallet', color:'#0d9488'},
  {id:'expenses', label:'Expense Tracker', icon:'wallet', color:'#10b981'},
  {id:'rent', label:'House Rent', icon:'key', color:'#0ea5e9'},
  {id:'udhar', label:'Udhar Khata', icon:'users', color:'#8b5cf6'},
  {id:'construction', label:'Construction', icon:'hammer', color:'#b45309'},
  {id:'salary', label:'Salary Management', icon:'briefcase', color:'#4f46e5'},
  {id:'labour', label:'Labour Management', icon:'hardhat', color:'#c2410c'},
  {id:'todos', label:'To-Do / Tasks', icon:'checksquare', color:'#0e7490'},
  {id:'bills', label:'Bill Reminders', icon:'bell', color:'#b45309'},
  {id:'familyMembers', label:'Family Members', icon:'users', color:'#db2777'},
  {id:'loans', label:'Loan / EMI Tracker', icon:'bank', color:'#1d4ed8'},
  {id:'subscriptions', label:'Subscriptions', icon:'repeat', color:'#7c3aed'},
  {id:'insurancePolicies', label:'Insurance Policies', icon:'umbrella', color:'#0369a1'},
  {id:'healthRecords', label:'Health Records', icon:'heartpulse', color:'#dc2626'},
  {id:'importantDates', label:'Important Dates', icon:'gift', color:'#be185d'},
  {id:'assets', label:'Assets & Warranty', icon:'box', color:'#0369a1'},
  {id:'maintenance', label:'Maintenance', icon:'wrench', color:'#475569'},
  {id:'vehicle', label:'Vehicle Log', icon:'car', color:'#dc2626'},
  {id:'zakat', label:'Zakat & Charity', icon:'moonstar', color:'#0f766e'},
  {id:'solar', label:'Solar & Utility', icon:'sunbolt', color:'#f59e0b'},
  {id:'pantry', label:'Pantry Planner', icon:'basket', color:'#65a30d'},
  {id:'vault', label:'Document Vault', icon:'shield', color:'#7c3aed'},
  {id:'events', label:'Event Budgeter', icon:'calendarheart', color:'#db2777'},
  {id:'goals', label:'Savings Goals', icon:'target', color:'#0891b2'},
  {id:'settings', label:'Settings & Backup', icon:'settings', color:'#334155'},
];
let ROUTE = 'dashboard';
let ROUTE_PARAM = null;

function navigate(route, param){
  ROUTE = route; ROUTE_PARAM = param || null;
  window.location.hash = route;
  renderRoute();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', ()=>{
  const r = location.hash.replace('#','') || 'dashboard';
  ROUTE = r; renderRoute();
});
function renderNotFound(){
  $('#viewRoot').innerHTML = `
    <div class="empty" style="padding-top:60px">
      <div style="font-size:56px;font-weight:800;color:var(--border);line-height:1;margin-bottom:10px">404</div>
      <div style="font-weight:800;font-size:16px;color:var(--text)">Ye Page Nahi Mila</div>
      <div style="font-size:13px;margin:8px 0 20px">Jo link ya section aap dhoond rahe hain wo mojood nahi hai. Shayad link purana ho ya galat ho.</div>
      <button class="btn btn-primary" onclick="navigate('dashboard')">Home Par Wapis Jayen</button>
    </div>`;
}

function renderTopbar(){
  const mod = ALL_MODULES.find(m=>m.id===ROUTE) || ALL_MODULES[0];
  $('#pageTitle').textContent = moduleLabel(mod);
  const subs = {
    dashboard:'Aaj ka khulasa', budgets:'Estimated vs actual', expenses:'Sab kharchay ek jaga',
    rent:'Properties, tenants, receipts', udhar:'Udhar len-den ledger', construction:'Material & labour',
    salary:'Staff, attendance & payroll',
    labour:'Daily/monthly wage & payments',
    todos:'Aaj ke kaam', bills:'Utility bills & due dates', familyMembers:'Ghar ke afraad',
    loans:'Bank loans & EMI tracking', subscriptions:'Recurring memberships',
    insurancePolicies:'Policies & premiums', healthRecords:'Prescriptions & appointments',
    importantDates:'Birthdays & anniversaries',
    assets:'Warranty tracker', maintenance:'Servicing reminders', vehicle:'Fuel & mileage',
    zakat:'Calculator & charity', solar:'Generation & bill estimate', pantry:'Ration ka hisaab',
    vault:'Encrypted local vault', events:'Occasion budgets', goals:'Apke targets', settings:'Backup & preferences',
    more:'Sab modules'
  };
  $('#pageSub').textContent = subs[ROUTE] || '';
  const pdfBtn = $('#pdfBtn');
  const noPdfRoutes = ['dashboard','more','settings'];
  pdfBtn.style.display = noPdfRoutes.includes(ROUTE) ? 'none' : 'flex';
}
function renderBottomNav(){
  const nav = $('#bottomNav');
  nav.innerHTML = BOTTOM_NAV.map(n=>{
    const active = (ROUTE===n.id) || (n.id==='more' && !BOTTOM_NAV.some(b=>b.id===ROUTE) && ROUTE!=='dashboard' && ROUTE!=='expenses' && ROUTE!=='rent' && ROUTE!=='udhar');
    return `<button class="nav-item ${active?'active':''}" data-nav="${n.id}">
      ${icon(n.icon)}<span class="dot"></span>${moduleLabel(n)}
    </button>`;
  }).join('');
  $$('.nav-item', nav).forEach(btn=>btn.addEventListener('click', ()=>navigate(btn.dataset.nav)));
}
function renderFab(){
  const map = {
    budgets:'budgets', expenses:'expenses', rent:'rent-picker', udhar:'udhars',
    construction:'construction-picker', assets:'assets', maintenance:'maintenanceLogs',
    salary:'salary-picker',
    labour:'labour-picker',
    todos:'todos', bills:'bills', familyMembers:'familyMembers', loans:'loans',
    subscriptions:'subscriptions', insurancePolicies:'insurancePolicies',
    healthRecords:'healthRecords', importantDates:'importantDates',
    vehicle:'vehicle-picker', zakat:'zakat-picker', solar:'solarLogs', pantry:'pantryItems',
    vault:'vault-picker', events:'events-picker', goals:'goals',
  };
  const fab = $('#fabAdd');
  if(map[ROUTE]){
    fab.style.display='flex';
    fab.onclick = ()=> handleFab(map[ROUTE]);
  } else {
    fab.style.display='none';
  }
}

/* ---------------------------------------------------------------------- *
 * 6. MODAL / SHEET ENGINE
 * ---------------------------------------------------------------------- */
function openSheet(html, onOpen){
  $('#sheet').innerHTML = `<div class="sheet-handle"></div>${html}`;
  $('#overlay').classList.add('show');
  document.body.style.overflow='hidden';
  if(onOpen) onOpen($('#sheet'));
}
function closeSheet(){
  $('#overlay').classList.remove('show');
  document.body.style.overflow='';
}
$('#overlay').addEventListener('click', (e)=>{ if(e.target.id==='overlay') closeSheet(); });

function sheetHeader(title){
  return `<div class="sheet-header"><h2>${escapeHtml(title)}</h2>
    <button class="icon-btn" onclick="closeSheet()">${ICN.close}</button></div>`;
}

/* Custom in-app confirmation dialog — used everywhere instead of the
 * native confirm(). Android WebViews do NOT show anything for
 * window.confirm() unless the host app explicitly implements
 * WebChromeClient.onJsConfirm(); by default it silently returns false,
 * which made every "Delete" button and the paste-restore flow appear to
 * do nothing. This dialog is pure in-page UI, so it works identically in
 * every environment: browser, TWA, or a bare installed WebView. */
function confirmDialog(message, onConfirm, onCancel){
  openSheet(`${sheetHeader('Please Confirm')}
    <div style="font-size:14px;color:var(--text);line-height:1.6;margin-bottom:22px">${escapeHtml(message)}</div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-outline btn-block" id="confirmCancelBtn">Cancel</button>
      <button class="btn btn-danger btn-block" id="confirmOkBtn">Confirm</button>
    </div>`,
    (root)=>{
      $('#confirmCancelBtn', root).addEventListener('click', ()=>{ closeSheet(); if(onCancel) onCancel(); });
      $('#confirmOkBtn', root).addEventListener('click', ()=>{ closeSheet(); if(onConfirm) onConfirm(); });
    });
}

/* Generic field renderer used by every simple CRUD module */
function renderField(f, val){
  val = val===undefined||val===null ? '' : val;
  const req = f.required ? 'required' : '';
  if(f.type==='select'){
    return `<div class="field"><label>${f.label}${f.required?' *':''}</label>
      <select name="${f.key}" ${req}>
        ${(f.options||[]).map(o=>`<option value="${escapeHtml(o)}" ${o===val?'selected':''}>${escapeHtml(o)}</option>`).join('')}
      </select></div>`;
  }
  if(f.type==='textarea'){
    return `<div class="field"><label>${f.label}${f.required?' *':''}</label>
      <textarea name="${f.key}" ${req} placeholder="${f.placeholder||''}">${escapeHtml(val)}</textarea></div>`;
  }
  return `<div class="field"><label>${f.label}${f.required?' *':''}</label>
    <input type="${f.type||'text'}" name="${f.key}" value="${escapeHtml(val)}" ${req}
      ${f.step?`step="${f.step}"`:''} ${f.min!==undefined?`min="${f.min}"`:''} placeholder="${f.placeholder||''}"></div>`;
}
function readForm(form, fields){
  const out = {};
  fields.forEach(f=>{
    const el = form.elements[f.key];
    if(!el) return;
    out[f.key] = f.type==='number' ? (el.value===''?'':Number(el.value)) : el.value;
  });
  return out;
}

/* ---------------------------------------------------------------------- *
 * 7. GENERIC CRUD SCHEMAS  (reused for straightforward list modules)
 * ---------------------------------------------------------------------- */
const SCHEMAS = {
  materials: {
    title:'Material Expense', arrayKey:'materials', color:'#b45309', icon:'box',
    fields:[
      {key:'projectId', label:'Project', type:'select', options:[]},
      {key:'item', label:'Material', type:'select', options:['Cement','Steel/Rods','Bricks','Sand/Crush','Plumbing','Electrical','Paints','Tiles','Hardware','Other']},
      {key:'qty', label:'Quantity', type:'text', placeholder:'e.g. 50 bags'},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'date', label:'Date', type:'date'},
      {key:'vendor', label:'Vendor/Shop', type:'text'},
    ]
  },
  assets: {
    title:'Home Asset', arrayKey:'assets', color:'#0369a1', icon:'box',
    fields:[
      {key:'name', label:'Asset Name', type:'select', options:['AC','Refrigerator','Washing Machine','Generator/UPS','Solar System','TV','Water Pump','Other'], required:true},
      {key:'vendor', label:'Vendor/Shop Name', type:'text'},
      {key:'price', label:'Price (Rs)', type:'number'},
      {key:'purchaseDate', label:'Purchase Date', type:'date'},
      {key:'serial', label:'Serial Number', type:'text'},
      {key:'warrantyExpiry', label:'Warranty Expiry Date', type:'date'},
    ]
  },
  maintenanceLogs: {
    title:'Maintenance Log', arrayKey:'maintenanceLogs', color:'#475569', icon:'wrench',
    fields:[
      {key:'task', label:'Task', type:'select', options:['AC Servicing','Water Tank Cleaning','Solar Panel Washing','RO Filter Replacement','UPS Battery Maintenance','Other'], required:true},
      {key:'lastDate', label:'Last Serviced', type:'date'},
      {key:'nextDate', label:'Next Due Date', type:'date'},
      {key:'cost', label:'Cost Incurred (Rs)', type:'number'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  pantryItems: {
    title:'Pantry Item', arrayKey:'pantryItems', color:'#65a30d', icon:'basket',
    fields:[
      {key:'name', label:'Item Name', type:'text', required:true, placeholder:'e.g. Flour (Atta)'},
      {key:'qty', label:'Current Quantity', type:'number', required:true},
      {key:'unit', label:'Unit', type:'select', options:['KG','Liters','Packets','Pieces']},
      {key:'threshold', label:'Minimum Threshold', type:'number'},
    ]
  },
  charityRecords: {
    title:'Charity / Sadqah', arrayKey:'charityRecords', color:'#0f766e', icon:'moonstar',
    fields:[
      {key:'type', label:'Type', type:'select', options:['Sadqah','Fitrana','Zakat Payment','Donation']},
      {key:'recipient', label:'Given To (Person/Org)', type:'text'},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'date', label:'Date', type:'date'},
    ]
  },
  solarLogs: {
    title:'Solar Log', arrayKey:'solarLogs', color:'#f59e0b', icon:'sunbolt',
    fields:[
      {key:'month', label:'Month', type:'text', placeholder:'e.g. 2026-07'},
      {key:'generated', label:'Units Generated', type:'number'},
      {key:'exported', label:'Units Exported to Grid', type:'number'},
      {key:'peakUnits', label:'Peak Units Consumed', type:'number'},
      {key:'offPeakUnits', label:'Off-Peak Units Consumed', type:'number'},
      {key:'tariff', label:'Avg Tariff (Rs/unit)', type:'number', step:'0.01'},
    ]
  },
  events: {
    title:'Event / Occasion', arrayKey:'events', color:'#db2777', icon:'calendarheart',
    fields:[
      {key:'name', label:'Event Name', type:'text', required:true, placeholder:'e.g. Eid-ul-Adha Qurbani'},
      {key:'date', label:'Event Date', type:'date'},
      {key:'budget', label:'Total Budget (Rs)', type:'number'},
    ]
  },
  goals: {
    title:'Savings Goal', arrayKey:'goals', color:'#0891b2', icon:'target',
    fields:[
      {key:'name', label:'Goal Name', type:'text', required:true, placeholder:'e.g. Umrah Fund'},
      {key:'target', label:'Target Amount (Rs)', type:'number', required:true},
      {key:'saved', label:'Already Saved (Rs)', type:'number'},
      {key:'targetDate', label:'Target Date', type:'date'},
      {key:'monthly', label:'Planned Monthly Saving (Rs)', type:'number'},
    ]
  },
  vehicles: {
    title:'Vehicle', arrayKey:'vehicles', color:'#dc2626', icon:'car',
    fields:[
      {key:'name', label:'Vehicle Name', type:'text', required:true, placeholder:'e.g. Honda Civic'},
      {key:'plate', label:'Number Plate', type:'text'},
      {key:'odometer', label:'Current Odometer (km)', type:'number'},
    ]
  },
  todos: {
    title:'Task', arrayKey:'todos', color:'#0e7490', icon:'checksquare', defaults:{status:'Pending'},
    fields:[
      {key:'title', label:'Task', type:'text', required:true, placeholder:'e.g. Bijli ka bill jama karwana'},
      {key:'category', label:'Category', type:'select', options:['Home','Work','Shopping','Personal','Other']},
      {key:'dueDate', label:'Due Date', type:'date'},
      {key:'priority', label:'Priority', type:'select', options:['Low','Medium','High']},
    ]
  },
  bills: {
    title:'Bill', arrayKey:'bills', color:'#b45309', icon:'bell', defaults:{status:'Unpaid'},
    fields:[
      {key:'name', label:'Bill', type:'select', options:['Electricity Bill','Gas Bill','Water Bill','Internet/Wifi','Mobile Bill','Cable/DTH','School Fee','House Rent','Other'], required:true},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'dueDate', label:'Due Date', type:'date', required:true},
      {key:'recurring', label:'Recurring', type:'select', options:['Monthly','Yearly','One-time']},
    ]
  },
  familyMembers: {
    title:'Family Member', arrayKey:'familyMembers', color:'#db2777', icon:'users',
    fields:[
      {key:'name', label:'Name', type:'text', required:true},
      {key:'relation', label:'Relation', type:'select', options:['Self','Spouse','Son','Daughter','Father','Mother','Brother','Sister','Other']},
      {key:'dob', label:'Date of Birth', type:'date'},
      {key:'bloodGroup', label:'Blood Group', type:'select', options:['A+','A-','B+','B-','O+','O-','AB+','AB-','Unknown']},
      {key:'cnic', label:'CNIC / ID', type:'text'},
      {key:'phone', label:'Phone Number', type:'text'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  loans: {
    title:'Loan / EMI', arrayKey:'loans', color:'#1d4ed8', icon:'bank',
    fields:[
      {key:'name', label:'Loan Name', type:'text', required:true, placeholder:'e.g. Car Loan - Meezan Bank'},
      {key:'lender', label:'Lender / Bank', type:'text'},
      {key:'principal', label:'Total Loan Amount (Rs)', type:'number', required:true},
      {key:'monthlyEMI', label:'Monthly EMI (Rs)', type:'number', required:true},
      {key:'startDate', label:'Start Date', type:'date'},
      {key:'tenureMonths', label:'Tenure (Months)', type:'number'},
      {key:'nextDueDate', label:'Next EMI Due Date', type:'date'},
    ]
  },
  subscriptions: {
    title:'Subscription', arrayKey:'subscriptions', color:'#7c3aed', icon:'repeat', defaults:{status:'Active'},
    fields:[
      {key:'name', label:'Service Name', type:'text', required:true, placeholder:'e.g. Netflix, Jazz Postpaid'},
      {key:'category', label:'Category', type:'select', options:['Streaming','Mobile Plan','Internet','Membership','Software','Other']},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'billingCycle', label:'Billing Cycle', type:'select', options:['Monthly','Yearly']},
      {key:'nextRenewalDate', label:'Next Renewal Date', type:'date'},
      {key:'status', label:'Status', type:'select', options:['Active','Cancelled']},
    ]
  },
  insurancePolicies: {
    title:'Insurance Policy', arrayKey:'insurancePolicies', color:'#0369a1', icon:'umbrella',
    fields:[
      {key:'type', label:'Policy Type', type:'select', options:['Life','Health','Vehicle','Home','Other'], required:true},
      {key:'provider', label:'Insurance Provider', type:'text'},
      {key:'policyNumber', label:'Policy Number', type:'text'},
      {key:'premiumAmount', label:'Premium Amount (Rs)', type:'number'},
      {key:'premiumCycle', label:'Premium Cycle', type:'select', options:['Monthly','Yearly']},
      {key:'coverageAmount', label:'Coverage Amount (Rs)', type:'number'},
      {key:'expiryDate', label:'Expiry Date', type:'date'},
    ]
  },
  healthRecords: {
    title:'Health Record', arrayKey:'healthRecords', color:'#dc2626', icon:'heartpulse',
    fields:[
      {key:'memberName', label:'Family Member', type:'text', required:true, placeholder:'e.g. Ali, Ammi'},
      {key:'recordType', label:'Record Type', type:'select', options:['Prescription','Appointment','Lab Test','Vaccination','Other']},
      {key:'doctor', label:'Doctor / Clinic', type:'text'},
      {key:'date', label:'Date', type:'date'},
      {key:'nextAppointment', label:'Next Appointment (if any)', type:'date'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  importantDates: {
    title:'Important Date', arrayKey:'importantDates', color:'#be185d', icon:'gift',
    fields:[
      {key:'title', label:'Title', type:'text', required:true, placeholder:'e.g. Ammi ki Birthday'},
      {key:'type', label:'Type', type:'select', options:['Birthday','Anniversary','Religious','Other']},
      {key:'date', label:'Date', type:'date', required:true},
      {key:'notes', label:'Notes', type:'text'},
    ]
  },
};

function handleFab(route){
  const pickers = {
    'rent-picker': [['Add Property','properties'],['Add Tenant','tenants'],['Record Payment','rentPayments']],
    'construction-picker': [['New Project','constructionProjects'],['Add Material Expense','materials'],['Add Labourer','labourers']],
    'salary-picker': [['Add Employee','employees'],['Give Advance/Loan','salaryAdvances'],['Record Salary Payment','salaryPayments']],
    'labour-picker': [['Add Worker','labourWorkers'],['Give Advance','labourAdvances'],['Record Payment','labourPayments']],
    'vehicle-picker': [['Add Vehicle','vehicles'],['Add Fuel Entry','fuelLogs']],
    'zakat-picker': [['Zakat Calculator','zakatCalc'],['Add Charity Record','charityRecords']],
    'vault-picker': [['Add Vault Item','vaultItems'],['Add Emergency Contact','emergencyContacts']],
    'events-picker': [['New Event','events'],['Add Line Item','eventItems']],
  };
  if(pickers[route]){
    openSheet(`${sheetHeader('Choose Action')}
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
        ${pickers[route].map(([label,key])=>`<button class="btn btn-outline btn-block" data-open="${key}">${label}</button>`).join('')}
      </div>`, (root)=>{
        $$('[data-open]', root).forEach(b=>b.addEventListener('click', ()=>{
          const key = b.dataset.open;
          if(key==='zakatCalc') openZakatCalculator();
          else openGenericForm(key);
        }));
      });
    return;
  }
  openGenericForm(route);
}

function openGenericForm(arrayKey, editId){
  if(arrayKey==='budgets') return openBudgetForm(editId);
  if(arrayKey==='expenses') return openExpenseForm(editId);
  if(arrayKey==='udhars') return openUdharForm(editId);
  if(arrayKey==='properties') return openPropertyForm(editId);
  if(arrayKey==='tenants') return openTenantForm(editId);
  if(arrayKey==='rentPayments') return openRentPaymentForm(editId);
  if(arrayKey==='constructionProjects') return openProjectForm(editId);
  if(arrayKey==='labourers') return openLabourerForm(editId);
  if(arrayKey==='fuelLogs') return openFuelForm(editId);
  if(arrayKey==='vaultItems') return openVaultItemForm(editId);
  if(arrayKey==='emergencyContacts') return openEmergencyContactForm(editId);
  if(arrayKey==='eventItems') return openEventItemForm(editId);
  if(arrayKey==='goalTx') return openGoalTxForm(editId);
  if(arrayKey==='employees') return openEmployeeForm(editId);
  if(arrayKey==='salaryAdvances') return openSalaryAdvanceForm(editId);
  if(arrayKey==='salaryPayments') return openSalaryPaymentForm(editId);
  if(arrayKey==='labourWorkers') return openLabourWorkerForm(editId);
  if(arrayKey==='labourAdvances') return openLabourAdvanceForm(editId);
  if(arrayKey==='labourPayments') return openLabourPaymentForm(editId);

  const schema = SCHEMAS[arrayKey];
  if(!schema) return;
  const editItem = editId ? DATA[arrayKey].find(x=>x.id===editId) : null;
  let fields = schema.fields;
  if(arrayKey==='materials'){
    fields = fields.map(f=> f.key==='projectId' ? {...f, options: DATA.constructionProjects.map(p=>p.name)} : f);
  }
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+schema.title)}
    <form id="genForm">
      ${fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='date'||f.key==='purchaseDate'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px;margin-top:6px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delBtn">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div>
    </form>`, (root)=>{
      const form = $('#genForm', root);
      if(arrayKey==='materials' && editItem){
        const sel = form.elements['projectId'];
        const proj = DATA.constructionProjects.find(p=>p.id===editItem.projectId);
        if(proj) sel.value = proj.name;
      }
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const vals = readForm(form, fields);
        if(arrayKey==='materials'){
          const proj = DATA.constructionProjects.find(p=>p.name===vals.projectId);
          vals.projectId = proj? proj.id : null;
        }
        if(editItem) Object.assign(editItem, vals);
        else DATA[arrayKey].push({id:uid(), ...(schema.defaults||{}), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem){
        $('#delBtn', root).addEventListener('click', ()=>{
          confirmDialog('Delete this entry?', ()=>{
            DATA[arrayKey] = DATA[arrayKey].filter(x=>x.id!==editId);
            saveData(); closeSheet(); toast('Deleted'); renderRoute();
          });
        });
      }
    });
}

/* ---------------------------------------------------------------------- *
 * 8. DASHBOARD
 * ---------------------------------------------------------------------- */
function computeMonthTotals(mKey){
  mKey = mKey || monthKey();
  const exp = DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((s,e)=>s+Number(e.amount||0),0);
  const inc = DATA.incomes.filter(i=>monthKey(i.date)===mKey).reduce((s,i)=>s+Number(i.amount||0),0);
  return {exp, inc};
}
const DEFAULT_QUICK_ACCESS = ['expenses','rent','udhar','salary','zakat','vehicle','goals','vault'];
let dashboardTab = 'home';
function renderDashboard(){
  let tabsHtml = `<div class="chip-row">
    <div class="chip ${dashboardTab==='home'?'active':''}" data-dtab="home">${moduleLabel({id:'dashboard',label:'Dashboard'})}</div>
    <div class="chip ${dashboardTab==='overview'?'active':''}" data-dtab="overview">${t('financialOverview')}</div>
  </div>`;

  if(dashboardTab==='overview'){
    $('#viewRoot').innerHTML = tabsHtml + renderFinancialOverviewHTML();
    $$('.chip[data-dtab]').forEach(c=>c.addEventListener('click', ()=>{ dashboardTab = c.dataset.dtab; renderDashboard(); }));
    return;
  }

  const {exp, inc} = computeMonthTotals();
  const pendingRent = DATA.rentPayments.filter(p=>p.status!=='Paid').length;
  const pendingUdhar = DATA.udhars.filter(u=>udharBalance(u)!==0).length;
  const upcomingMaint = DATA.maintenanceLogs.filter(m=>{
    const d = daysUntil(m.nextDate); return d!==null && d<=14 && d>=0;
  }).length;
  const warrantySoon = DATA.assets.filter(a=>{
    const d = daysUntil(a.warrantyExpiry); return d!==null && d<=30 && d>=0;
  }).length;
  const billsDue = DATA.bills.filter(b=>{
    if(b.status==='Paid') return false;
    const d = daysUntil(b.dueDate); return d!==null && d<=5 && d>=0;
  }).length;
  const overdueTasks = DATA.todos.filter(t=>{
    if(t.status==='Done') return false;
    const d = daysUntil(t.dueDate); return d!==null && d<0;
  }).length;
  const emiDue = DATA.loans.filter(l=>{
    const d = daysUntil(l.nextDueDate); return d!==null && d<=7 && d>=0;
  }).length;
  const subsRenewing = DATA.subscriptions.filter(s=>{
    if(s.status==='Cancelled') return false;
    const d = daysUntil(s.nextRenewalDate); return d!==null && d<=7 && d>=0;
  }).length;
  const policiesExpiring = DATA.insurancePolicies.filter(p=>{
    const d = daysUntil(p.expiryDate); return d!==null && d<=30 && d>=0;
  }).length;
  const birthdaysSoon = DATA.familyMembers.filter(m=>{
    const next = nextYearlyOccurrence(m.dob); const d = next?daysUntil(next):null;
    return d!==null && d<=7;
  }).length;

  let html = tabsHtml + `
  <div class="grid-2">
    <div class="stat-card">
      <div class="stat-label">${t('thisMonthExpense')}</div>
      <div class="stat-value">${fmtMoney(exp)}</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-label">${t('thisMonthIncome')}</div>
      <div class="stat-value">${fmtMoney(inc)}</div>
    </div>
  </div>
  <div class="grid-2" style="margin-top:12px">
    <div class="stat-card ${pendingRent?'warn':''}">
      <div class="stat-label">${t('rentPending')}</div>
      <div class="stat-value">${pendingRent}</div>
    </div>
    <div class="stat-card ${pendingUdhar?'danger':''}">
      <div class="stat-label">${t('udharOpen')}</div>
      <div class="stat-value">${pendingUdhar}</div>
    </div>
  </div>`;

  if(upcomingMaint || warrantySoon || billsDue || overdueTasks || emiDue || subsRenewing || policiesExpiring || birthdaysSoon){
    html += `<div class="section-title">${t('reminders')}</div><div class="card">`;
    if(overdueTasks) html += reminderRow('checksquare','#0e7490', overdueTasks+' task(s) overdue', ()=>navigate('todos'));
    if(billsDue) html += reminderRow('bell','#b45309', billsDue+' bill(s) due in 5 days', ()=>navigate('bills'));
    if(emiDue) html += reminderRow('bank','#1d4ed8', emiDue+' EMI(s) due in 7 days', ()=>navigate('loans'));
    if(birthdaysSoon) html += reminderRow('gift','#be185d', birthdaysSoon+' birthday(s) in next 7 days', ()=>navigate('familyMembers'));
    if(subsRenewing) html += reminderRow('repeat','#7c3aed', subsRenewing+' subscription(s) renewing soon', ()=>navigate('subscriptions'));
    if(policiesExpiring) html += reminderRow('umbrella','#0369a1', policiesExpiring+' insurance policy(ies) expiring in 30 days', ()=>navigate('insurancePolicies'));
    if(upcomingMaint) html += reminderRow('wrench','#475569', upcomingMaint+' maintenance task(s) due in 14 days', ()=>navigate('maintenance'));
    if(warrantySoon) html += reminderRow('box','#0369a1', warrantySoon+' warranty(ies) expiring in 30 days', ()=>navigate('assets'));
    html += `</div>`;
  }

  html += `<div class="section-title">${t('budgetsOverview')}</div>`;
  if(!DATA.budgets.length){
    html += emptyState('wallet','Koi budget nahi bana', 'Apna pehla budget banayen taake kharche track ho sakein', 'budgets');
  } else {
    html += `<div class="card">` + DATA.budgets.slice(0,3).map(budgetRow).join('') + `</div>`;
  }

  const qa = (SETTINGS.quickAccess && SETTINGS.quickAccess.length) ? SETTINGS.quickAccess : DEFAULT_QUICK_ACCESS;
  html += `<div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
    <span>${t('quickAccess')}</span>
    <button class="icon-btn" style="width:30px;height:30px" onclick="openQuickAccessEditor()">${ICN.edit}</button>
  </div><div class="grid-4">`;
  qa.forEach(id=>{
    const m = ALL_MODULES.find(x=>x.id===id);
    if(m) html += moduleTile(m);
  });
  html += `</div>`;

  $('#viewRoot').innerHTML = html;
  $$('.chip[data-dtab]').forEach(c=>c.addEventListener('click', ()=>{ dashboardTab = c.dataset.dtab; renderDashboard(); }));
}
function openQuickAccessEditor(){
  const current = (SETTINGS.quickAccess && SETTINGS.quickAccess.length) ? SETTINGS.quickAccess : DEFAULT_QUICK_ACCESS;
  const selectable = ALL_MODULES.filter(m=>m.id!=='dashboard' && m.id!=='more');
  openSheet(`${sheetHeader('Customize Quick Access')}
    <div class="help-text" style="margin-bottom:12px">Jo modules Dashboard ke Quick Access mein dikhne chahiye unhe select karein (max 8).</div>
    <div style="display:flex;flex-direction:column;gap:8px;max-height:52vh;overflow-y:auto">
      ${selectable.map(m=>`
        <label class="card-row" style="padding:10px 12px;border:1.5px solid var(--border);border-radius:12px;cursor:pointer">
          <input type="checkbox" value="${m.id}" ${current.includes(m.id)?'checked':''} class="qaCheck" style="width:18px;height:18px;flex:none">
          <div class="ic" style="background:${m.color}20;color:${m.color};width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex:none">${icon(m.icon)}</div>
          <span style="font-size:13px;font-weight:600">${moduleLabel(m)}</span>
        </label>`).join('')}
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:14px" id="saveQABtn">Save</button>`,
    (root)=>{
      $('#saveQABtn', root).addEventListener('click', ()=>{
        const checked = $$('.qaCheck:checked', root).map(el=>el.value);
        if(!checked.length){ toast('Kam az kam 1 module select karein'); return; }
        if(checked.length>8){ toast('Zyada se zyada 8 modules select karein'); return; }
        SETTINGS.quickAccess = checked;
        saveSettings(); closeSheet(); toast('Quick Access update ho gaya'); renderRoute();
      });
    });
}
function reminderRow(ic,color,text,onclick){
  return `<div class="card-row" style="padding:6px 0;cursor:pointer" onclick="(${onclick.toString()})()">
    <div class="list-item .avatar" style="width:36px;height:36px;border-radius:11px;background:${color}22;color:${color};display:flex;align-items:center;justify-content:center">${icon('bell',color)}</div>
    <div style="flex:1;font-size:13px;font-weight:600">${text}</div>${icon('chevron')}
  </div>`;
}
function emptyState(ic,title,sub,route){
  return `<div class="empty">
    <div class="ic">${ICN[ic]}</div>
    <div style="font-weight:800;font-size:15px;color:var(--text)">${title}</div>
    <div style="font-size:13px;margin:6px 0 14px">${sub}</div>
    ${route?`<button class="btn btn-primary" onclick="handleFab('${route}')">+ Add Now</button>`:''}
  </div>`;
}
/* ---------------------------------------------------------------------- *
 * FINANCIAL OVERVIEW — section-wise In/Out/Net summary across every
 * financial module, with an overall profit/loss headline.
 * ---------------------------------------------------------------------- */
function computeModuleFinancials(){
  const results = [];
  const mKey = monthKey();

  const incThis = DATA.incomes.filter(i=>monthKey(i.date)===mKey).reduce((s,i)=>s+Number(i.amount||0),0);
  const expThis = DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((s,e)=>s+Number(e.amount||0),0);
  if(DATA.incomes.length || DATA.expenses.length)
    results.push({id:'expenses', label:'Expenses & Income', icon:'wallet', color:'#10b981', in:incThis, out:expThis, net:incThis-expThis, inLabel:'Income (mo)', outLabel:'Expense (mo)'});

  if(DATA.budgets.length){
    const totalEst = DATA.budgets.reduce((s,b)=>s+budgetEffective(b),0);
    const totalSpentB = DATA.budgets.reduce((s,b)=>s+budgetSpent(b),0);
    results.push({id:'budgets', label:'Budgets', icon:'wallet', color:'#0d9488', in:totalEst, out:totalSpentB, net:totalEst-totalSpentB, inLabel:'Effective Budget', outLabel:'Spent'});
  }

  if(DATA.rentPayments.length){
    const totalRent = DATA.rentPayments.reduce((s,p)=>s+Number(p.amount||0),0);
    const paidRent = DATA.rentPayments.filter(p=>p.status==='Paid').reduce((s,p)=>s+Number(p.amount||0),0);
    results.push({id:'rent', label:'House Rent', icon:'key', color:'#0ea5e9', in:paidRent, out:totalRent-paidRent, net:paidRent-(totalRent-paidRent), inLabel:'Collected', outLabel:'Pending'});
  }

  if(DATA.udhars.length){
    const receivable = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
    const payable = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
    results.push({id:'udhar', label:'Udhar Khata', icon:'users', color:'#8b5cf6', in:receivable, out:payable, net:receivable-payable, inLabel:'Receivable', outLabel:'Payable'});
  }

  if(DATA.constructionProjects.length || DATA.materials.length){
    const budget = DATA.constructionProjects.reduce((s,p)=>s+Number(p.budget||0),0);
    const spend = DATA.materials.reduce((s,m)=>s+Number(m.amount||0),0) + DATA.labourers.reduce((s,l)=>s+labourerPayout(l),0);
    results.push({id:'construction', label:'Construction', icon:'hammer', color:'#b45309', in:budget, out:spend, net:budget-spend, inLabel:'Budget', outLabel:'Spend'});
  }

  if(DATA.employees.length){
    const payroll = DATA.employees.filter(e=>e.status!=='Inactive').reduce((s,e)=>s+Number(e.monthlySalary||0),0);
    const advOut = DATA.salaryAdvances.filter(a=>!a.settled).reduce((s,a)=>s+Number(a.amount||0),0);
    results.push({id:'salary', label:'Salary Management', icon:'briefcase', color:'#4f46e5', in:payroll, out:advOut, net:payroll-advOut, inLabel:'Payroll', outLabel:'Advances Out'});
  }

  if(DATA.labourWorkers.length){
    const paidOut = DATA.labourPayments.reduce((s,p)=>s+Number(p.net||0),0);
    const advOut = DATA.labourAdvances.filter(a=>!a.settled).reduce((s,a)=>s+Number(a.amount||0),0);
    results.push({id:'labour', label:'Labour Management', icon:'hardhat', color:'#c2410c', in:paidOut, out:advOut, net:paidOut-advOut, inLabel:'Paid Out', outLabel:'Advances'});
  }

  if(DATA.loans.length){
    const principal = DATA.loans.reduce((s,l)=>s+Number(l.principal||0),0);
    const remaining = DATA.loans.reduce((s,l)=>s+Number(l.remaining!==undefined?l.remaining:l.principal||0),0);
    results.push({id:'loans', label:'Loan / EMI', icon:'bank', color:'#1d4ed8', in:principal-remaining, out:remaining, net:(principal-remaining)-remaining, inLabel:'Paid Off', outLabel:'Remaining'});
  }

  if(DATA.bills.length){
    const paid = DATA.bills.filter(b=>b.status==='Paid').reduce((s,b)=>s+Number(b.amount||0),0);
    const unpaid = DATA.bills.filter(b=>b.status!=='Paid').reduce((s,b)=>s+Number(b.amount||0),0);
    results.push({id:'bills', label:'Bill Reminders', icon:'bell', color:'#b45309', in:paid, out:unpaid, net:paid-unpaid, inLabel:'Paid', outLabel:'Unpaid'});
  }

  if(DATA.subscriptions.length){
    const active = DATA.subscriptions.filter(s=>s.status!=='Cancelled');
    const monthlyCost = active.reduce((s,x)=>s+Number(x.amount||0)/(x.billingCycle==='Yearly'?12:1),0);
    results.push({id:'subscriptions', label:'Subscriptions', icon:'repeat', color:'#7c3aed', in:0, out:monthlyCost, net:-monthlyCost, inLabel:'—', outLabel:'Monthly Cost'});
  }

  if(DATA.insurancePolicies.length){
    const premium = DATA.insurancePolicies.reduce((s,p)=>s+Number(p.premiumAmount||0),0);
    const coverage = DATA.insurancePolicies.reduce((s,p)=>s+Number(p.coverageAmount||0),0);
    results.push({id:'insurancePolicies', label:'Insurance', icon:'umbrella', color:'#0369a1', in:coverage, out:premium, net:coverage-premium, inLabel:'Coverage', outLabel:'Premium'});
  }

  if(DATA.charityRecords.length){
    const given = DATA.charityRecords.reduce((s,c)=>s+Number(c.amount||0),0);
    results.push({id:'zakat', label:'Zakat & Charity', icon:'moonstar', color:'#0f766e', in:0, out:given, net:-given, inLabel:'—', outLabel:'Given'});
  }

  if(DATA.events.length){
    const budget = DATA.events.reduce((s,e)=>s+Number(e.budget||0),0);
    const spend = DATA.eventItems.reduce((s,i)=>s+Number(i.amount||0),0);
    results.push({id:'events', label:'Event Budgeter', icon:'calendarheart', color:'#db2777', in:budget, out:spend, net:budget-spend, inLabel:'Budget', outLabel:'Spent'});
  }

  if(DATA.goals.length){
    const target = DATA.goals.reduce((s,g)=>s+Number(g.target||0),0);
    const saved = DATA.goals.reduce((s,g)=>s+Number(g.saved||0),0);
    results.push({id:'goals', label:'Savings Goals', icon:'target', color:'#0891b2', in:saved, out:Math.max(0,target-saved), net:saved-target, inLabel:'Saved', outLabel:'Remaining'});
  }

  if(DATA.fuelLogs.length){
    const fuelCost = DATA.fuelLogs.reduce((s,f)=>s+Number(f.liters||0)*Number(f.rate||0),0);
    results.push({id:'vehicle', label:'Vehicle Log', icon:'car', color:'#dc2626', in:0, out:fuelCost, net:-fuelCost, inLabel:'—', outLabel:'Fuel Cost'});
  }

  return results;
}
function renderFinancialOverviewHTML(){
  const items = computeModuleFinancials();
  const totalIn = items.reduce((s,i)=>s+i.in,0);
  const totalOut = items.reduce((s,i)=>s+i.out,0);
  const totalNet = totalIn-totalOut;

  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Total In (all modules)</div><div class="stat-value">${fmtMoney(totalIn)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Total Out (all modules)</div><div class="stat-value">${fmtMoney(totalOut)}</div></div>
  </div>`;
  html += `<div class="stat-card" style="background:linear-gradient(135deg,${totalNet>=0?'#065f46,#10b981':'#991b1b,#ef4444'});margin-top:12px">
    <div class="stat-label">${totalNet>=0?t('overallProfit'):t('overallLoss')}</div>
    <div class="stat-value">${fmtMoney(Math.abs(totalNet))}</div>
  </div>`;

  html += `<div class="section-title">Section-wise Summary</div>`;
  if(!items.length){
    html += emptyState('wallet','Abhi koi financial data nahi','Kisi bhi module mein entry add karein to yahan summary dikhegi','');
  } else {
    html += `<div class="card">` + items.map(it=>{
      const profit = it.net>=0;
      return `<div style="padding:12px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="navigate('${it.id}')">
        <div class="card-row" style="justify-content:space-between;margin-bottom:8px">
          <div class="card-row">
            <div class="avatar" style="background:${it.color}20;color:${it.color};width:34px;height:34px;border-radius:10px">${icon(it.icon)}</div>
            <div style="font-weight:700;font-size:13.5px">${it.label}</div>
          </div>
          <span class="badge ${profit?'green':'red'}">${profit?'+':'-'}${fmtMoney(Math.abs(it.net))}</span>
        </div>
        <div class="grid-2" style="gap:8px">
          <div style="background:var(--surface-2);padding:8px 10px;border-radius:8px">
            <div style="font-size:10px;color:var(--text-dim)">${it.inLabel||'In'}</div>
            <div style="font-size:13px;font-weight:700;color:#059669">${fmtMoney(it.in)}</div>
          </div>
          <div style="background:var(--surface-2);padding:8px 10px;border-radius:8px">
            <div style="font-size:10px;color:var(--text-dim)">${it.outLabel||'Out'}</div>
            <div style="font-size:13px;font-weight:700;color:#dc2626">${fmtMoney(it.out)}</div>
          </div>
        </div>
      </div>`;
    }).join('') + `</div>`;
  }
  return html;
}
function moduleTile(m){
  return `<div class="module-tile" onclick="navigate('${m.id}')">
    <div class="ic" style="background:${m.color}20;color:${m.color}">${icon(m.icon)}</div>
    <span>${moduleLabel(m)}</span>
  </div>`;
}
function moreGrid(){
  return `<div class="grid-3">${ALL_MODULES.filter(m=>m.id!=='dashboard').map(moduleTile).join('')}</div>`;
}

/* ---------------------------------------------------------------------- *
 * 9. BUDGETS & INCOME
 * ---------------------------------------------------------------------- */
function budgetMonthSpent(b, mKey){
  mKey = mKey || monthKey();
  return DATA.expenses.filter(e=>e.budgetId===b.id && monthKey(e.date)===mKey)
    .reduce((s,e)=>s+Number(e.amount||0),0);
}
function budgetSpent(b){
  // Monthly budgets show THIS MONTH's spend (so the progress bar resets
  // each month, matching how a monthly budget should behave). Yearly and
  // One-time budgets keep a lifetime running total.
  if(b.period === 'Monthly') return budgetMonthSpent(b, monthKey());
  return DATA.expenses.filter(e=>e.budgetId===b.id).reduce((s,e)=>s+Number(e.amount||0),0);
}
function previousMonthKey(mKey){
  const parts = (mKey||monthKey()).split('-').map(Number);
  const d = new Date(parts[0], parts[1]-2, 1);
  return d.toISOString().slice(0,7);
}
function budgetCarryAmount(b){
  if(b.carryForward !== 'Yes' || b.period !== 'Monthly') return 0;
  const prevSpent = budgetMonthSpent(b, previousMonthKey(monthKey()));
  return Number(b.estimated||0) - prevSpent; // positive = saved & carried in; negative = overspent, reduces this month
}
function budgetEffective(b){
  return Number(b.estimated||0) + budgetCarryAmount(b);
}
function budgetRow(b){
  const spent = budgetSpent(b);
  const carry = budgetCarryAmount(b);
  const effective = budgetEffective(b);
  const pct = effective>0 ? Math.min(100, Math.round(spent/effective*100)) : 0;
  const level = pct>90?'red':pct>=70?'amber':'green';
  return `<div style="padding:10px 0;border-bottom:1px solid var(--border)" onclick="openGenericBudget('${b.id}')">
    <div class="card-row" style="justify-content:space-between;margin-bottom:8px">
      <div>
        <div class="card-title">${escapeHtml(b.name)}</div>
        <div class="card-sub">${escapeHtml(b.category||'')} · ${escapeHtml(b.period||'')}</div>
      </div>
      <div class="badge ${level}">${pct}%</div>
    </div>
    <div class="progress ${level}"><div style="width:${pct}%"></div></div>
    <div class="card-sub" style="margin-top:6px">${fmtMoney(spent)} spent of ${fmtMoney(effective)}</div>
    ${carry!==0?`<div class="card-sub" style="margin-top:2px;color:${carry>0?'#059669':'#dc2626'};font-weight:700">${carry>0?'+':'-'}${fmtMoney(Math.abs(carry))} carried from last month (${carry>0?'aap ne bachaya tha':'overspend hua tha'})</div>`:''}
  </div>`;
}
function openGenericBudget(id){ openBudgetForm(id); }
function openBudgetForm(editId){
  const editItem = editId ? DATA.budgets.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Budget Name', type:'text', required:true},
    {key:'category', label:'Type', type:'select', options:['Monthly Home','Special Event','Emergency Fund','Other']},
    {key:'estimated', label:'Estimated Amount (Rs)', type:'number', required:true},
    {key:'period', label:'Period', type:'select', options:['Monthly','Yearly','One-time']},
    {key:'carryForward', label:'Carry Forward Savings/Overspend? (sirf Monthly ke liye)', type:'select', options:['No','Yes']},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'New ')+'Budget')}
    <form id="bForm">
      ${fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='carryForward'?'No':''))).join('')}
      <div class="help-text" style="margin-top:-8px;margin-bottom:12px">Agar "Yes" karein, to pichle mahine ki bachat agle mahine ke budget mein add ho jayegi (ya overspend hone par kam ho jayegi).</div>
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delB">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Create Budget'}</button>
      </div>
    </form>`, (root)=>{
      $('#bForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.budgets.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Budget saved'); renderRoute();
      });
      if(editItem) $('#delB', root).addEventListener('click', ()=>{
        confirmDialog('Delete budget?', ()=>{ DATA.budgets = DATA.budgets.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function openIncomeForm(editId){
  const editItem = editId ? DATA.incomes.find(x=>x.id===editId) : null;
  const fields = [
    {key:'source', label:'Source', type:'select', options:['Salary','Business','Rental Income','Freelance','Side Hustle','Other']},
    {key:'amount', label:'Amount (Rs)', type:'number', required:true},
    {key:'date', label:'Date', type:'date'},
    {key:'notes', label:'Notes', type:'text'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Income')}
    <form id="iForm">
      ${fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='date'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delI">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div>
    </form>`, (root)=>{
      $('#iForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.incomes.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Income saved'); renderRoute();
      });
      if(editItem) $('#delI', root).addEventListener('click', ()=>{
        confirmDialog('Delete?', ()=>{ DATA.incomes = DATA.incomes.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function renderBudgets(){
  const {exp, inc} = computeMonthTotals();
  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Total Income (mo)</div><div class="stat-value">${fmtMoney(inc)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Total Expense (mo)</div><div class="stat-value">${fmtMoney(exp)}</div></div>
  </div>`;
  html += `<div class="section-title">Budgets</div>`;
  html += DATA.budgets.length ? `<div class="card">${DATA.budgets.map(budgetRow).join('')}</div>` : emptyState('wallet','Koi budget nahi','Naya budget shamil karein');
  html += `<div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
    <span>Income Sources</span>
    <button class="btn btn-sm btn-outline" onclick="openIncomeForm()">+ Income</button>
  </div>`;
  if(!DATA.incomes.length){
    html += emptyState('wallet','Koi income record nahi','Salary, rent ya business income add karein');
  } else {
    html += `<div class="card">` + sortByDateDesc(DATA.incomes, 'date').map(i=>`
      <div class="list-item" onclick="openIncomeForm('${i.id}')">
        <div class="avatar" style="background:#d1fae5;color:#065f46">${icon('wallet')}</div>
        <div class="meta"><div class="t">${escapeHtml(i.source)}</div><div class="s">${fmtDate(i.date)} ${i.notes?'· '+escapeHtml(i.notes):''}</div></div>
        <div class="amt" style="color:#059669">+${fmtMoney(i.amount)}</div>
      </div>`).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 10. EXPENSE TRACKER  (nested categories + aggregation)
 * ---------------------------------------------------------------------- */
let expenseFilter = 'All';
function openExpenseForm(editId){
  const editItem = editId ? DATA.expenses.find(x=>x.id===editId) : null;
  const mainCats = Object.keys(CATEGORY_TREE);
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Expense')}
    <form id="eForm">
      <div class="field"><label>Main Category *</label>
        <select name="category" id="mainCat" required>
          ${mainCats.map(c=>`<option value="${c}" ${editItem&&editItem.category===c?'selected':''}>${c}</option>`).join('')}
        </select></div>
      <div class="field"><label>Sub Category *</label>
        <select name="subcategory" id="subCat" required></select></div>
      <div class="field-row">
        <div class="field"><label>Amount (Rs) *</label><input type="number" name="amount" required value="${editItem?editItem.amount:''}"></div>
        <div class="field"><label>Date</label><input type="date" name="date" value="${editItem?editItem.date:todayISO()}"></div>
      </div>
      <div class="field"><label>Link to Budget (optional)</label>
        <select name="budgetId"><option value="">— None —</option>
          ${DATA.budgets.map(b=>`<option value="${b.id}" ${editItem&&editItem.budgetId===b.id?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}
        </select></div>
      <div class="field"><label>Note</label><input type="text" name="note" value="${editItem?escapeHtml(editItem.note||''):''}" placeholder="optional"></div>
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delE">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Expense'}</button>
      </div>
    </form>`, (root)=>{
      const mainSel = $('#mainCat', root), subSel = $('#subCat', root);
      function fillSub(){
        subSel.innerHTML = CATEGORY_TREE[mainSel.value].map(s=>`<option value="${s}">${s}</option>`).join('');
        if(editItem && editItem.category===mainSel.value) subSel.value = editItem.subcategory;
      }
      mainSel.addEventListener('change', fillSub); fillSub();
      $('#eForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const f = e.target;
        const vals = {
          category:f.category.value, subcategory:f.subcategory.value,
          amount:Number(f.amount.value), date:f.date.value,
          budgetId:f.budgetId.value||null, note:f.note.value,
        };
        if(editItem) Object.assign(editItem, vals);
        else DATA.expenses.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Expense saved'); renderRoute();
      });
      if(editItem) $('#delE', root).addEventListener('click', ()=>{
        confirmDialog('Delete expense?', ()=>{ DATA.expenses = DATA.expenses.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function renderExpenses(){
  const mKey = monthKey();
  const monthExpenses = DATA.expenses.filter(e=>monthKey(e.date)===mKey);
  const byCat = {};
  monthExpenses.forEach(e=>{ byCat[e.category] = (byCat[e.category]||0) + Number(e.amount||0); });
  const total = monthExpenses.reduce((s,e)=>s+Number(e.amount||0),0);

  let html = `<div class="stat-card"><div class="stat-label">This Month Total</div><div class="stat-value">${fmtMoney(total)}</div></div>`;

  html += `<div class="section-title">By Category</div><div class="card">`;
  if(!Object.keys(byCat).length){
    html += `<div style="font-size:13px;color:var(--text-dim);padding:6px 0">Is mahine koi kharcha darj nahi.</div>`;
  } else {
    Object.entries(byCat).sort((a,b)=>b[1]-a[1]).forEach(([cat,amt])=>{
      const pct = total? Math.round(amt/total*100):0;
      html += `<div style="padding:8px 0">
        <div class="card-row" style="justify-content:space-between;margin-bottom:6px">
          <span style="font-size:13px;font-weight:700">${cat}</span>
          <span style="font-size:12px;color:var(--text-dim)">${fmtMoney(amt)} (${pct}%)</span>
        </div>
        <div class="progress"><div style="width:${pct}%;background:${CATEGORY_COLORS[cat]}"></div></div>
      </div>`;
    });
  }
  html += `</div>`;

  html += `<div class="chip-row">
    <div class="chip ${expenseFilter==='All'?'active':''}" data-f="All">All</div>
    ${Object.keys(CATEGORY_TREE).map(c=>`<div class="chip ${expenseFilter===c?'active':''}" data-f="${c}">${c}</div>`).join('')}
  </div>`;

  const list = monthExpenses.filter(e=>expenseFilter==='All'||e.category===expenseFilter).sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
  html += `<div class="section-title">Recent Entries</div>`;
  html += list.length ? `<div class="card">${list.map(e=>`
      <div class="list-item" onclick="openExpenseForm('${e.id}')">
        <div class="avatar" style="background:${CATEGORY_COLORS[e.category]}20;color:${CATEGORY_COLORS[e.category]}">${icon('wallet')}</div>
        <div class="meta"><div class="t">${escapeHtml(e.subcategory)}</div><div class="s">${e.category} · ${fmtDate(e.date)}</div></div>
        <div class="amt">-${fmtMoney(e.amount)}</div>
      </div>`).join('')}</div>` : emptyState('wallet','Koi entry nahi mili','');

  $('#viewRoot').innerHTML = html;
  $$('.chip[data-f]').forEach(c=>c.addEventListener('click', ()=>{ expenseFilter = c.dataset.f; renderExpenses(); }));
}

/* ---------------------------------------------------------------------- *
 * 11. RENT MANAGEMENT  (properties, tenants, sub-meter, receipts)
 * ---------------------------------------------------------------------- */
function openPropertyForm(editId){
  const editItem = editId ? DATA.properties.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Property Name', type:'text', required:true, placeholder:'e.g. Portion 2, Model Town House'},
    {key:'type', label:'Type', type:'select', options:['Portion','Flat','Shop','House']},
    {key:'address', label:'Address', type:'text'},
    {key:'unitRate', label:'Sub-Meter Electricity Rate (Rs/unit)', type:'number', step:'0.01'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Property')}
    <form id="pForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delP">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Property'}</button>
      </div></form>`, (root)=>{
      $('#pForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.properties.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Property saved'); renderRoute();
      });
      if(editItem) $('#delP', root).addEventListener('click', ()=>{
        confirmDialog('Delete property? Linked tenants will remain but unlinked.', ()=>{
          DATA.properties = DATA.properties.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
        });
      });
    });
}
function openTenantForm(editId){
  const editItem = editId ? DATA.tenants.find(x=>x.id===editId) : null;
  const fields = [
    {key:'propertyId', label:'Property', type:'select', options: DATA.properties.map(p=>p.name), required:true},
    {key:'name', label:'Tenant Name', type:'text', required:true},
    {key:'phone', label:'Phone Number', type:'text'},
    {key:'cnic', label:'CNIC / ID', type:'text'},
    {key:'agreementStart', label:'Agreement Start', type:'date'},
    {key:'agreementEnd', label:'Agreement End', type:'date'},
    {key:'monthlyRent', label:'Monthly Rent (Rs)', type:'number', required:true},
    {key:'securityDeposit', label:'Security Deposit Received (Rs)', type:'number'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Tenant')}
    <form id="tForm">${fields.map(f=>renderField(f, editItem? (f.key==='propertyId'? (DATA.properties.find(p=>p.id===editItem.propertyId)||{}).name : editItem[f.key]) :'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delT">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Tenant'}</button>
      </div></form>`, (root)=>{
      $('#tForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        const prop = DATA.properties.find(p=>p.name===vals.propertyId);
        vals.propertyId = prop? prop.id : null;
        if(editItem) Object.assign(editItem, vals);
        else DATA.tenants.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Tenant saved'); renderRoute();
      });
      if(editItem) $('#delT', root).addEventListener('click', ()=>{
        confirmDialog('Delete tenant?', ()=>{ DATA.tenants = DATA.tenants.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function openRentPaymentForm(editId){
  const editItem = editId ? DATA.rentPayments.find(x=>x.id===editId) : null;
  if(!DATA.tenants.length){ toast('Pehle tenant add karein'); return; }
  const tenantNames = DATA.tenants.map(t=>t.name);
  let html = `${sheetHeader((editItem?'Edit ':'Record ')+'Rent Payment')}
    <form id="rpForm">
      <div class="field"><label>Tenant *</label><select name="tenantId" required id="tenSel">
        ${DATA.tenants.map(t=>`<option value="${t.id}" ${editItem&&editItem.tenantId===t.id?'selected':''}>${escapeHtml(t.name)}</option>`).join('')}
      </select></div>
      <div class="field-row">
        <div class="field"><label>Month</label><input type="text" name="month" placeholder="2026-07" value="${editItem?editItem.month:monthKey()}"></div>
        <div class="field"><label>Amount (Rs) *</label><input type="number" name="amount" required id="rpAmt" value="${editItem?editItem.amount:''}"></div>
      </div>
      <div class="field"><label>Status</label><select name="status">
        ${['Paid','Pending','Partial'].map(s=>`<option ${editItem&&editItem.status===s?'selected':''}>${s}</option>`).join('')}
      </select></div>
      <div class="divider"></div>
      <div style="font-size:12px;font-weight:800;color:var(--text-dim);margin-bottom:8px">SUB-METER ELECTRICITY CALCULATOR</div>
      <div class="field-row">
        <div class="field"><label>Previous Reading</label><input type="number" name="prevReading" value="${editItem?editItem.prevReading||'':''}"></div>
        <div class="field"><label>Current Reading</label><input type="number" name="currReading" value="${editItem?editItem.currReading||'':''}"></div>
      </div>
      <div class="field"><label>Unit Rate (Rs/unit)</label><input type="number" step="0.01" name="unitRate" id="unitRate" value="${editItem?editItem.unitRate||'':''}"></div>
      <div class="card" style="background:var(--surface-2);box-shadow:none;margin-top:4px">
        <div class="card-row" style="justify-content:space-between"><span style="font-size:12px">Units Consumed</span><b id="unitsOut">0</b></div>
        <div class="card-row" style="justify-content:space-between;margin-top:4px"><span style="font-size:12px">Electricity Charge</span><b id="chargeOut">Rs 0</b></div>
      </div>
      <div class="field" style="margin-top:12px"><label>Maintenance Deduction (Rs)</label><input type="number" name="maintDeduction" value="${editItem?editItem.maintDeduction||'':''}"></div>
      <div style="display:flex;gap:10px;margin-top:6px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delRP">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Payment'}</button>
      </div>
    </form>`;
  openSheet(html, (root)=>{
    function recalc(){
      const prev = Number($('input[name=prevReading]', root).value)||0;
      const curr = Number($('input[name=currReading]', root).value)||0;
      const rate = Number($('#unitRate', root).value)||0;
      const units = Math.max(0, curr-prev);
      $('#unitsOut', root).textContent = units;
      $('#chargeOut', root).textContent = fmtMoney(units*rate);
    }
    $$('input[name=prevReading],input[name=currReading],#unitRate', root).forEach(el=>el.addEventListener('input', recalc));
    recalc();
    $('#rpForm', root).addEventListener('submit', e=>{
      e.preventDefault();
      const f = e.target;
      const vals = {
        tenantId:f.tenantId.value, month:f.month.value, amount:Number(f.amount.value), status:f.status.value,
        prevReading:Number(f.prevReading.value)||0, currReading:Number(f.currReading.value)||0,
        unitRate:Number(f.unitRate.value)||0, maintDeduction:Number(f.maintDeduction.value)||0,
      };
      if(editItem) Object.assign(editItem, vals);
      else DATA.rentPayments.push({id:uid(), ...vals});
      saveData(); closeSheet(); toast('Payment saved'); renderRoute();
    });
    if(editItem) $('#delRP', root).addEventListener('click', ()=>{
      confirmDialog('Delete this payment record?', ()=>{ DATA.rentPayments = DATA.rentPayments.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
    });
  });
}
function generateReceipt(paymentId){
  const p = DATA.rentPayments.find(x=>x.id===paymentId);
  const t = DATA.tenants.find(x=>x.id===p.tenantId);
  const prop = t ? DATA.properties.find(x=>x.id===t.propertyId) : null;
  const units = Math.max(0,(p.currReading||0)-(p.prevReading||0));
  const elecCharge = units*(p.unitRate||0);
  const receiptHtml = `<div style="font-family:Arial,sans-serif;padding:6px">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:20px;font-weight:800;color:#059669">GharSaz 360</div>
      <div style="font-size:12px;color:#666">Digital Rent Receipt</div>
    </div>
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <tr><td style="padding:5px 0;color:#666">Tenant</td><td style="text-align:right;font-weight:700">${escapeHtml(t?t.name:'—')}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Property</td><td style="text-align:right">${escapeHtml(prop?prop.name:'—')}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Month</td><td style="text-align:right">${escapeHtml(p.month)}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Rent Amount</td><td style="text-align:right">${fmtMoney(p.amount)}</td></tr>
      ${units?`<tr><td style="padding:5px 0;color:#666">Electricity (${units} units)</td><td style="text-align:right">${fmtMoney(elecCharge)}</td></tr>`:''}
      ${p.maintDeduction?`<tr><td style="padding:5px 0;color:#666">Maintenance Deduction</td><td style="text-align:right">-${fmtMoney(p.maintDeduction)}</td></tr>`:''}
      <tr><td style="padding:8px 0;font-weight:800;border-top:1px solid #ddd">Total</td><td style="text-align:right;font-weight:800;border-top:1px solid #ddd">${fmtMoney(Number(p.amount)+elecCharge-(p.maintDeduction||0))}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Status</td><td style="text-align:right">${p.status}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Date Issued</td><td style="text-align:right">${fmtDate(todayISO())}</td></tr>
    </table>
    <div style="text-align:center;margin-top:16px;font-size:11px;color:#999">Generated by GharSaz 360 · 100% Offline App</div>
  </div>`;
  openSheet(`${sheetHeader('Rent Receipt')}
    <div class="card" id="receiptBox" style="box-shadow:none">${receiptHtml}</div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="btn btn-outline btn-block" id="waShare">Share on WhatsApp</button>
      <button class="btn btn-primary btn-block" id="dlReceipt">${ICN.down} Download</button>
    </div>`, (root)=>{
      $('#dlReceipt', root).addEventListener('click', ()=>{
        const text = `GharSaz 360 - Rent Receipt\nTenant: ${t?t.name:''}\nProperty: ${prop?prop.name:''}\nMonth: ${p.month}\nAmount: ${fmtMoney(p.amount)}\nStatus: ${p.status}\nDate: ${fmtDate(todayISO())}`;
        downloadFile(`Receipt-${t?t.name:'tenant'}-${p.month}.txt`, text, 'text/plain');
      });
      $('#waShare', root).addEventListener('click', ()=>{
        const text = encodeURIComponent(`GharSaz 360 Rent Receipt\nTenant: ${t?t.name:''}\nMonth: ${p.month}\nAmount: ${fmtMoney(p.amount)}\nStatus: ${p.status}`);
        window.open(`https://wa.me/${(t&&t.phone)?t.phone.replace(/\D/g,''):''}?text=${text}`, '_blank');
      });
    });
}
function udharBalance(){ return 0; } // placeholder redefined later
function renderRent(){
  let html = '';
  if(!DATA.properties.length){
    html += emptyState('key','Koi property nahi', 'Apni pehli property/portion add karein', 'rent-picker');
    $('#viewRoot').innerHTML = html; return;
  }
  html += `<div class="section-title">Properties</div><div class="card">` +
    DATA.properties.map(p=>{
      const tCount = DATA.tenants.filter(t=>t.propertyId===p.id).length;
      return `<div class="list-item" onclick="openPropertyForm('${p.id}')">
        <div class="avatar" style="background:#e0f2fe;color:#0369a1">${icon('key')}</div>
        <div class="meta"><div class="t">${escapeHtml(p.name)}</div><div class="s">${escapeHtml(p.type||'')} · ${tCount} tenant(s)</div></div>
        ${icon('chevron')}
      </div>`;
    }).join('') + `</div>`;

  html += `<div class="section-title">Tenants &amp; Rent Status</div>`;
  if(!DATA.tenants.length){
    html += emptyState('users','Koi tenant nahi','Tenant add karein');
  } else {
    html += `<div class="card">` + DATA.tenants.map(t=>{
      const prop = DATA.properties.find(p=>p.id===t.propertyId);
      const latest = DATA.rentPayments.filter(p=>p.tenantId===t.id).sort((a,b)=>b.month.localeCompare(a.month))[0];
      const level = latest? (latest.status==='Paid'?'green':latest.status==='Partial'?'amber':'red') : 'amber';
      return `<div class="list-item" onclick="openTenantForm('${t.id}')">
        <div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('users')}</div>
        <div class="meta"><div class="t">${escapeHtml(t.name)}</div><div class="s">${prop?escapeHtml(prop.name):''} · Rs ${Number(t.monthlyRent||0).toLocaleString()}/mo</div></div>
        <div class="badge ${level}">${latest?latest.status:'No record'}</div>
      </div>`;
    }).join('') + `</div>`;
  }

  html += `<div class="section-title">Recent Payments</div>`;
  const pays = sortByDateDesc(DATA.rentPayments, 'month');
  if(!pays.length){
    html += emptyState('key','Koi payment record nahi','');
  } else {
    html += `<div class="card">` + pays.slice(0,15).map(p=>{
      const t = DATA.tenants.find(x=>x.id===p.tenantId);
      const level = p.status==='Paid'?'green':p.status==='Partial'?'amber':'red';
      return `<div class="list-item">
        <div class="avatar" style="background:#d1fae5;color:#065f46">${icon('key')}</div>
        <div class="meta" onclick="openRentPaymentForm('${p.id}')"><div class="t">${escapeHtml(t?t.name:'—')} · ${p.month}</div><div class="s">${fmtMoney(p.amount)}</div></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="badge ${level}">${p.status}</span>
          <button class="btn btn-sm btn-outline" onclick="generateReceipt('${p.id}')">${ICN.print} Receipt</button>
        </div>
      </div>`;
    }).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 12. UDHAR KHATA (Credit/Debit Ledger)
 * ---------------------------------------------------------------------- */
function udharTxList(uId){ return DATA.udharTx.filter(t=>t.udharId===uId); }
function udharBalance(u){
  return udharTxList(u.id).reduce((s,t)=> s + (t.type==='Given'? Number(t.amount) : -Number(t.amount)), 0);
}
function openUdharForm(editId){
  const editItem = editId ? DATA.udhars.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Contact Name', type:'text', required:true},
    {key:'phone', label:'Phone Number', type:'text'},
    {key:'notes', label:'Notes', type:'textarea'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Contact')}
    <form id="uForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delU">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Contact'}</button>
      </div></form>`, (root)=>{
      $('#uForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.udhars.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem) $('#delU', root).addEventListener('click', ()=>{
        confirmDialog('Delete this contact and all its transactions?', ()=>{
          DATA.udhars = DATA.udhars.filter(x=>x.id!==editId);
          DATA.udharTx = DATA.udharTx.filter(x=>x.udharId!==editId);
          saveData(); closeSheet(); renderRoute();
        });
      });
    });
}
function openUdharTxForm(udharId){
  const u = DATA.udhars.find(x=>x.id===udharId);
  openSheet(`${sheetHeader('Add Transaction — '+u.name)}
    <form id="txForm">
      <div class="field"><label>Type *</label><select name="type" required>
        <option value="Given">Given (Maine diye)</option><option value="Taken">Taken (Maine liye)</option>
      </select></div>
      <div class="field-row">
        <div class="field"><label>Amount (Rs) *</label><input type="number" name="amount" required></div>
        <div class="field"><label>Date</label><input type="date" name="date" value="${todayISO()}"></div>
      </div>
      <div class="field"><label>Due Date</label><input type="date" name="dueDate"></div>
      <div class="field"><label>Status</label><select name="status">
        <option>Pending</option><option>Partial</option><option>Settled</option></select></div>
      <div class="field"><label>Note</label><input type="text" name="note"></div>
      <button type="submit" class="btn btn-primary btn-block">Save Transaction</button>
    </form>`, (root)=>{
      $('#txForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const f = e.target;
        DATA.udharTx.push({
          id:uid(), udharId, type:f.type.value, amount:Number(f.amount.value),
          date:f.date.value, dueDate:f.dueDate.value, status:f.status.value, note:f.note.value
        });
        saveData(); closeSheet(); toast('Transaction saved'); renderRoute();
      });
    });
}
function openUdharDetail(udharId){
  const u = DATA.udhars.find(x=>x.id===udharId);
  const txs = sortByDateDesc(udharTxList(udharId), 'date');
  const bal = udharBalance(u);
  const balLabel = bal>0? `${fmtMoney(bal)} receivable (aapko milne hain)` : bal<0? `${fmtMoney(-bal)} payable (aapko dene hain)` : 'Settled';
  let html = `${sheetHeader(u.name)}
    <div class="card" style="background:var(--surface-2);box-shadow:none">
      <div class="card-row" style="justify-content:space-between">
        <div><div class="card-sub">Phone</div><div style="font-weight:700">${escapeHtml(u.phone||'—')}</div></div>
        <div style="text-align:right"><div class="card-sub">Balance</div><div style="font-weight:800;color:${bal>0?'#059669':bal<0?'#dc2626':'inherit'}">${balLabel}</div></div>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin:12px 0">
      <button class="btn btn-primary btn-block" id="addTx">+ Transaction</button>
      <button class="btn btn-outline btn-block" id="remindWa">${ICN.wa} Remind</button>
    </div>
    <div class="section-title">History</div>`;
  html += txs.length ? txs.map(t=>`
    <div class="list-item">
      <div class="avatar" style="background:${t.type==='Given'?'#d1fae5':'#fee2e2'};color:${t.type==='Given'?'#065f46':'#991b1b'}">${icon('wallet')}</div>
      <div class="meta"><div class="t">${t.type} · ${fmtMoney(t.amount)}</div><div class="s">${fmtDate(t.date)} ${t.dueDate?'· Due '+fmtDate(t.dueDate):''} · ${t.status}</div></div>
    </div>`).join('') : `<div class="card-sub" style="padding:10px 0">Koi transaction nahi</div>`;

  openSheet(html, (root)=>{
    $('#addTx', root).addEventListener('click', ()=>openUdharTxForm(udharId));
    $('#remindWa', root).addEventListener('click', ()=>{
      const msg = encodeURIComponent(`Assalam-o-Alaikum ${u.name}, GharSaz 360 ledger ke mutabiq aapka ${balLabel.includes('receivable')?'':''} balance ${fmtMoney(Math.abs(bal))} hai. Barae meherbani jald adayegi karein. Shukriya.`);
      window.open(`https://wa.me/${(u.phone||'').replace(/\D/g,'')}?text=${msg}`, '_blank');
    });
  });
}
function renderUdhar(){
  if(!DATA.udhars.length){
    $('#viewRoot').innerHTML = emptyState('users','Koi udhar contact nahi','Naya contact shamil karein', 'udhars');
    return;
  }
  const totalReceivable = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
  const totalPayable = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Receivable (Milne hain)</div><div class="stat-value">${fmtMoney(totalReceivable)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Payable (Dene hain)</div><div class="stat-value">${fmtMoney(totalPayable)}</div></div>
  </div>`;
  html += `<div class="section-title">Contacts</div><div class="card">` +
    DATA.udhars.map(u=>{
      const bal = udharBalance(u);
      const level = bal>0?'green':bal<0?'red':'amber';
      return `<div class="list-item" onclick="openUdharDetail('${u.id}')">
        <div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('users')}</div>
        <div class="meta"><div class="t">${escapeHtml(u.name)}</div><div class="s">${escapeHtml(u.phone||'')}</div></div>
        <span class="badge ${level}">${bal===0?'Settled':fmtMoney(Math.abs(bal))}</span>
      </div>`;
    }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13. CONSTRUCTION (projects, materials, labour + attendance)
 * ---------------------------------------------------------------------- */
function openProjectForm(editId){
  const editItem = editId ? DATA.constructionProjects.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Project Name', type:'text', required:true, placeholder:'e.g. Ground Floor Renovation'},
    {key:'startDate', label:'Start Date', type:'date'},
    {key:'budget', label:'Estimated Budget (Rs)', type:'number'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'New ')+'Project')}
    <form id="cpForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delCP">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Create'}</button>
      </div></form>`, (root)=>{
      $('#cpForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.constructionProjects.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Project saved'); renderRoute();
      });
      if(editItem) $('#delCP', root).addEventListener('click', ()=>{
        confirmDialog('Delete project?', ()=>{ DATA.constructionProjects = DATA.constructionProjects.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function openLabourerForm(editId){
  const editItem = editId ? DATA.labourers.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Worker Name', type:'text', required:true},
    {key:'role', label:'Role', type:'select', options:['Mason/Karigar','Helper/Mazdoor','Electrician','Plumber','Other']},
    {key:'dailyWage', label:'Daily Wage Rate (Rs)', type:'number', required:true},
    {key:'advance', label:'Advance Given (Rs)', type:'number'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Labourer')}
    <form id="lForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delL">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div></form>`, (root)=>{
      $('#lForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.labourers.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem) $('#delL', root).addEventListener('click', ()=>{
        confirmDialog('Delete worker?', ()=>{ DATA.labourers = DATA.labourers.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function markAttendance(labourerId, status){
  DATA.attendance.push({id:uid(), labourerId, date:todayISO(), status});
  saveData(); toast('Attendance marked: '+status); renderRoute();
}
function labourerPayout(l){
  const att = DATA.attendance.filter(a=>a.labourerId===l.id);
  const present = att.filter(a=>a.status==='Present').length;
  const half = att.filter(a=>a.status==='Half-Day').length;
  const earned = present*Number(l.dailyWage||0) + half*Number(l.dailyWage||0)/2;
  return earned - Number(l.advance||0);
}
function renderConstruction(){
  let html = '';
  if(!DATA.constructionProjects.length){
    html += emptyState('hammer','Koi construction project nahi','Naya project banayen', 'construction-picker');
  } else {
    const totalMat = DATA.materials.reduce((s,m)=>s+Number(m.amount||0),0);
    html += `<div class="stat-card" style="background:linear-gradient(135deg,#92400e,#f59e0b)"><div class="stat-label">Total Material Spend</div><div class="stat-value">${fmtMoney(totalMat)}</div></div>`;
    html += `<div class="section-title">Projects</div><div class="card">` + DATA.constructionProjects.map(p=>{
      const spend = DATA.materials.filter(m=>m.projectId===p.id).reduce((s,m)=>s+Number(m.amount||0),0);
      return `<div class="list-item" onclick="openProjectForm('${p.id}')">
        <div class="avatar" style="background:#fef3c7;color:#92400e">${icon('hammer')}</div>
        <div class="meta"><div class="t">${escapeHtml(p.name)}</div><div class="s">Started ${fmtDate(p.startDate)}</div></div>
        <div class="amt">${fmtMoney(spend)}</div>
      </div>`;
    }).join('') + `</div>`;

    html += `<div class="section-title">Material Expenses</div>`;
    const mats = sortByDateDesc(DATA.materials, 'date');
    html += mats.length ? `<div class="card">` + mats.slice(0,10).map(m=>`
      <div class="list-item" onclick="openGenericForm('materials','${m.id}')">
        <div class="avatar" style="background:#fef3c7;color:#92400e">${icon('box')}</div>
        <div class="meta"><div class="t">${escapeHtml(m.item)}</div><div class="s">${escapeHtml(m.qty||'')} · ${fmtDate(m.date)}</div></div>
        <div class="amt">${fmtMoney(m.amount)}</div>
      </div>`).join('') + `</div>` : emptyState('box','Koi material entry nahi','');
  }

  html += `<div class="section-title" style="display:flex;justify-content:space-between;align-items:center">
    <span>Labour Register</span>
    <button class="btn btn-sm btn-outline" onclick="openLabourerForm()">+ Worker</button>
  </div>`;
  if(!DATA.labourers.length){
    html += emptyState('users','Koi worker register nahi','');
  } else {
    html += `<div class="card">` + DATA.labourers.map(l=>{
      const payout = labourerPayout(l);
      return `<div style="padding:10px 0;border-bottom:1px solid var(--border)">
        <div class="card-row" style="justify-content:space-between">
          <div class="card-row" onclick="openLabourerForm('${l.id}')" style="cursor:pointer">
            <div class="avatar" style="background:#e0e7ff;color:#4338ca;width:36px;height:36px;border-radius:11px">${icon('users')}</div>
            <div><div style="font-weight:700;font-size:13px">${escapeHtml(l.name)}</div><div class="card-sub">${escapeHtml(l.role)} · Rs ${l.dailyWage}/day</div></div>
          </div>
          <div style="text-align:right"><div class="card-sub">Net Payout</div><div style="font-weight:800">${fmtMoney(payout)}</div></div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="btn btn-sm btn-ghost" onclick="markAttendance('${l.id}','Present')">Present</button>
          <button class="btn btn-sm btn-ghost" onclick="markAttendance('${l.id}','Half-Day')">Half-Day</button>
          <button class="btn btn-sm btn-ghost" onclick="markAttendance('${l.id}','Absent')">Absent</button>
        </div>
      </div>`;
    }).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13B. SALARY MANAGEMENT  (staff, attendance, advances, payroll, payslips)
 * ---------------------------------------------------------------------- */
function openEmployeeForm(editId){
  const editItem = editId ? DATA.employees.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Employee Name', type:'text', required:true},
    {key:'designation', label:'Designation', type:'select', options:['Domestic Help/Maid','Driver','Security Guard','Cook','Gardener','Office Staff','Manager','Other']},
    {key:'phone', label:'Phone Number', type:'text'},
    {key:'cnic', label:'CNIC / ID', type:'text'},
    {key:'joiningDate', label:'Joining Date', type:'date'},
    {key:'monthlySalary', label:'Monthly Salary (Rs)', type:'number', required:true},
    {key:'status', label:'Status', type:'select', options:['Active','Inactive']},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Employee')}
    <form id="empForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='joiningDate'?todayISO():(f.key==='status'?'Active':'')))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delEmp">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Employee'}</button>
      </div></form>`, (root)=>{
      $('#empForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.employees.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Employee saved'); renderRoute();
      });
      if(editItem) $('#delEmp', root).addEventListener('click', ()=>{
        confirmDialog('Delete this employee? Their attendance/advance/payment history will remain but unlinked.', ()=>{
          DATA.employees = DATA.employees.filter(x=>x.id!==editId);
          saveData(); closeSheet(); renderRoute();
        });
      });
    });
}
function markStaffAttendance(employeeId, status){
  DATA.staffAttendance.push({id:uid(), employeeId, date:todayISO(), status});
  saveData(); toast('Attendance marked: '+status); renderRoute();
}
function staffAdvanceOutstanding(empId){
  return DATA.salaryAdvances.filter(a=>a.employeeId===empId && !a.settled)
    .reduce((s,a)=>s+Number(a.amount||0),0);
}
function staffMonthAttendance(empId, mKey){
  return DATA.staffAttendance.filter(a=>a.employeeId===empId && monthKey(a.date)===mKey);
}
function staffEstimatedNetSalary(emp){
  const mKey = monthKey();
  const att = staffMonthAttendance(emp.id, mKey);
  const perDay = Number(emp.monthlySalary||0)/30;
  let gross = Number(emp.monthlySalary||0);
  if(att.length){
    const absent = att.filter(a=>a.status==='Absent').length;
    const half = att.filter(a=>a.status==='Half-Day').length;
    gross = gross - (absent*perDay) - (half*perDay/2);
  }
  const outstandingAdvance = staffAdvanceOutstanding(emp.id);
  return Math.max(0, gross - outstandingAdvance);
}
function openSalaryAdvanceForm(editId){
  if(!DATA.employees.length){ toast('Pehle employee add karein'); return; }
  const editItem = editId ? DATA.salaryAdvances.find(x=>x.id===editId) : null;
  const fields = [
    {key:'employeeId', label:'Employee', type:'select', options: DATA.employees.map(e=>e.name), required:true},
    {key:'amount', label:'Advance Amount (Rs)', type:'number', required:true},
    {key:'date', label:'Date', type:'date'},
    {key:'note', label:'Reason / Note', type:'text'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Give ')+'Advance / Loan')}
    <form id="advForm">${fields.map(f=>renderField(f, editItem? (f.key==='employeeId'? (DATA.employees.find(e=>e.id===editItem.employeeId)||{}).name : editItem[f.key]) : (f.key==='date'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delAdv">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Advance'}</button>
      </div></form>`, (root)=>{
      $('#advForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        const emp = DATA.employees.find(x=>x.name===vals.employeeId);
        vals.employeeId = emp ? emp.id : null;
        if(editItem) Object.assign(editItem, vals);
        else DATA.salaryAdvances.push({id:uid(), settled:false, ...vals});
        saveData(); closeSheet(); toast('Advance saved'); renderRoute();
      });
      if(editItem) $('#delAdv', root).addEventListener('click', ()=>{
        DATA.salaryAdvances = DATA.salaryAdvances.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
      });
    });
}
function openSalaryPaymentForm(editId){
  if(!DATA.employees.length){ toast('Pehle employee add karein'); return; }
  const editItem = editId ? DATA.salaryPayments.find(x=>x.id===editId) : null;
  let html = `${sheetHeader((editItem?'Edit ':'Record ')+'Salary Payment')}
    <form id="spForm">
      <div class="field"><label>Employee *</label><select name="employeeId" required id="empSel">
        ${DATA.employees.map(e=>`<option value="${e.id}" ${editItem&&editItem.employeeId===e.id?'selected':''}>${escapeHtml(e.name)}</option>`).join('')}
      </select></div>
      <div class="field-row">
        <div class="field"><label>Month</label><input type="text" name="month" placeholder="2026-07" value="${editItem?editItem.month:monthKey()}"></div>
        <div class="field"><label>Basic Salary (Rs)</label><input type="number" name="basic" id="basicIn" value="${editItem?editItem.basic:''}"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Bonus (Rs)</label><input type="number" name="bonus" id="bonusIn" value="${editItem?editItem.bonus||0:0}"></div>
        <div class="field"><label>Absent Deduction (Rs)</label><input type="number" name="absentDeduction" id="absIn" value="${editItem?editItem.absentDeduction||0:0}"></div>
      </div>
      <div class="field"><label>Advance Deduction (Rs)</label><input type="number" name="advanceDeduction" id="advIn" value="${editItem?editItem.advanceDeduction||0:0}"></div>
      <div class="card" style="background:var(--surface-2);box-shadow:none">
        <div class="card-row" style="justify-content:space-between"><span style="font-size:12px">Net Payable</span><b id="netOut" style="font-size:16px">Rs 0</b></div>
      </div>
      <div class="field" style="margin-top:12px"><label>Status</label><select name="status">
        ${['Paid','Pending','Partial'].map(s=>`<option ${editItem&&editItem.status===s?'selected':''}>${s}</option>`).join('')}
      </select></div>
      <div class="field"><label>Payment Date</label><input type="date" name="paymentDate" value="${editItem?editItem.paymentDate:todayISO()}"></div>
      <div style="display:flex;gap:10px;margin-top:6px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delSP">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Payment'}</button>
      </div>
    </form>`;
  openSheet(html, (root)=>{
    const empSel = $('#empSel', root);
    function prefillBasic(){
      const emp = DATA.employees.find(x=>x.id===empSel.value);
      if(emp && !editItem) $('#basicIn', root).value = emp.monthlySalary;
      if(emp && !editItem) $('#advIn', root).value = staffAdvanceOutstanding(emp.id);
      recalc();
    }
    function recalc(){
      const basic = Number($('#basicIn', root).value)||0;
      const bonus = Number($('#bonusIn', root).value)||0;
      const absD = Number($('#absIn', root).value)||0;
      const advD = Number($('#advIn', root).value)||0;
      $('#netOut', root).textContent = fmtMoney(basic+bonus-absD-advD);
    }
    empSel.addEventListener('change', prefillBasic);
    $$('#basicIn,#bonusIn,#absIn,#advIn', root).forEach(el=>el.addEventListener('input', recalc));
    prefillBasic();
    $('#spForm', root).addEventListener('submit', e=>{
      e.preventDefault();
      const f = e.target;
      const vals = {
        employeeId:f.employeeId.value, month:f.month.value,
        basic:Number(f.basic.value)||0, bonus:Number(f.bonus.value)||0,
        absentDeduction:Number(f.absentDeduction.value)||0, advanceDeduction:Number(f.advanceDeduction.value)||0,
        status:f.status.value, paymentDate:f.paymentDate.value,
      };
      vals.net = vals.basic+vals.bonus-vals.absentDeduction-vals.advanceDeduction;
      if(editItem) Object.assign(editItem, vals);
      else DATA.salaryPayments.push({id:uid(), ...vals});
      if(vals.advanceDeduction>0){
        DATA.salaryAdvances.filter(a=>a.employeeId===vals.employeeId && !a.settled).forEach(a=>a.settled=true);
      }
      saveData(); closeSheet(); toast('Salary payment saved'); renderRoute();
    });
    if(editItem) $('#delSP', root).addEventListener('click', ()=>{
      confirmDialog('Delete this payment record?', ()=>{ DATA.salaryPayments = DATA.salaryPayments.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
    });
  });
}
function generatePayslip(paymentId){
  const p = DATA.salaryPayments.find(x=>x.id===paymentId);
  const emp = DATA.employees.find(x=>x.id===p.employeeId);
  const receiptHtml = `<div style="font-family:Arial,sans-serif;padding:6px">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:20px;font-weight:800;color:#4f46e5">GharSaz 360</div>
      <div style="font-size:12px;color:#666">Salary Payslip</div>
    </div>
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <tr><td style="padding:5px 0;color:#666">Employee</td><td style="text-align:right;font-weight:700">${escapeHtml(emp?emp.name:'—')}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Designation</td><td style="text-align:right">${escapeHtml(emp?emp.designation:'—')}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Month</td><td style="text-align:right">${escapeHtml(p.month)}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Basic Salary</td><td style="text-align:right">${fmtMoney(p.basic)}</td></tr>
      ${p.bonus?`<tr><td style="padding:5px 0;color:#666">Bonus</td><td style="text-align:right">+${fmtMoney(p.bonus)}</td></tr>`:''}
      ${p.absentDeduction?`<tr><td style="padding:5px 0;color:#666">Absent Deduction</td><td style="text-align:right">-${fmtMoney(p.absentDeduction)}</td></tr>`:''}
      ${p.advanceDeduction?`<tr><td style="padding:5px 0;color:#666">Advance Deduction</td><td style="text-align:right">-${fmtMoney(p.advanceDeduction)}</td></tr>`:''}
      <tr><td style="padding:8px 0;font-weight:800;border-top:1px solid #ddd">Net Payable</td><td style="text-align:right;font-weight:800;border-top:1px solid #ddd">${fmtMoney(p.net)}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Status</td><td style="text-align:right">${p.status}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Date Issued</td><td style="text-align:right">${fmtDate(todayISO())}</td></tr>
    </table>
    <div style="text-align:center;margin-top:16px;font-size:11px;color:#999">Generated by GharSaz 360 · 100% Offline App</div>
  </div>`;
  openSheet(`${sheetHeader('Salary Payslip')}
    <div class="card" style="box-shadow:none">${receiptHtml}</div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="btn btn-outline btn-block" id="waSlip">Share on WhatsApp</button>
      <button class="btn btn-primary btn-block" id="dlSlip">${ICN.down} Download</button>
    </div>`, (root)=>{
      $('#dlSlip', root).addEventListener('click', ()=>{
        const text = `GharSaz 360 - Salary Payslip\nEmployee: ${emp?emp.name:''}\nMonth: ${p.month}\nBasic: ${fmtMoney(p.basic)}\nNet Payable: ${fmtMoney(p.net)}\nStatus: ${p.status}\nDate: ${fmtDate(todayISO())}`;
        downloadFile(`Payslip-${emp?emp.name:'employee'}-${p.month}.txt`, text, 'text/plain');
      });
      $('#waSlip', root).addEventListener('click', ()=>{
        const text = encodeURIComponent(`GharSaz 360 Salary Payslip\nEmployee: ${emp?emp.name:''}\nMonth: ${p.month}\nNet Payable: ${fmtMoney(p.net)}\nStatus: ${p.status}`);
        window.open(`https://wa.me/${(emp&&emp.phone)?emp.phone.replace(/\D/g,''):''}?text=${text}`, '_blank');
      });
    });
}
function renderSalary(){
  if(!DATA.employees.length){
    $('#viewRoot').innerHTML = emptyState('briefcase','Koi employee register nahi','Ghar ya office staff add karein', 'salary-picker');
    return;
  }
  const activeEmployees = DATA.employees.filter(e=>e.status!=='Inactive');
  const totalPayroll = activeEmployees.reduce((s,e)=>s+Number(e.monthlySalary||0),0);
  const totalAdvances = DATA.employees.reduce((s,e)=>s+staffAdvanceOutstanding(e.id),0);

  let html = `<div class="grid-2">
    <div class="stat-card" style="background:linear-gradient(135deg,#4338ca,#818cf8)"><div class="stat-label">Monthly Payroll</div><div class="stat-value">${fmtMoney(totalPayroll)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Advances Outstanding</div><div class="stat-value">${fmtMoney(totalAdvances)}</div></div>
  </div>`;

  html += `<div class="section-title">Staff &amp; Attendance</div><div class="card">` +
    DATA.employees.map(e=>{
      const est = staffEstimatedNetSalary(e);
      const outstanding = staffAdvanceOutstanding(e.id);
      return `<div style="padding:10px 0;border-bottom:1px solid var(--border)">
        <div class="card-row" style="justify-content:space-between">
          <div class="card-row" onclick="openEmployeeForm('${e.id}')" style="cursor:pointer">
            <div class="avatar" style="background:#e0e7ff;color:#4338ca;width:36px;height:36px;border-radius:11px">${icon('briefcase')}</div>
            <div><div style="font-weight:700;font-size:13px">${escapeHtml(e.name)}</div><div class="card-sub">${escapeHtml(e.designation||'')} · ${fmtMoney(e.monthlySalary)}/mo ${e.status==='Inactive'?'· Inactive':''}</div></div>
          </div>
          <div style="text-align:right"><div class="card-sub">Est. Net (this month)</div><div style="font-weight:800">${fmtMoney(est)}</div>
            ${outstanding?`<div class="card-sub" style="color:#dc2626">Advance: ${fmtMoney(outstanding)}</div>`:''}
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <button class="btn btn-sm btn-ghost" onclick="markStaffAttendance('${e.id}','Present')">Present</button>
          <button class="btn btn-sm btn-ghost" onclick="markStaffAttendance('${e.id}','Half-Day')">Half-Day</button>
          <button class="btn btn-sm btn-ghost" onclick="markStaffAttendance('${e.id}','Absent')">Absent</button>
          <button class="btn btn-sm btn-outline" onclick="openSalaryAdvanceForm(null)">+ Advance</button>
        </div>
      </div>`;
    }).join('') + `</div>`;

  html += `<div class="section-title">Advances / Loans</div>`;
  const advs = sortByDateDesc(DATA.salaryAdvances, 'date');
  html += advs.length ? `<div class="card">` + advs.slice(0,10).map(a=>{
    const emp = DATA.employees.find(x=>x.id===a.employeeId);
    return `<div class="list-item" onclick="openSalaryAdvanceForm('${a.id}')">
      <div class="avatar" style="background:#fee2e2;color:#991b1b">${icon('wallet')}</div>
      <div class="meta"><div class="t">${escapeHtml(emp?emp.name:'—')}</div><div class="s">${fmtDate(a.date)} ${a.settled?'· Settled':'· Outstanding'}</div></div>
      <div class="amt">${fmtMoney(a.amount)}</div>
    </div>`;
  }).join('') + `</div>` : emptyState('wallet','Koi advance record nahi','');

  html += `<div class="section-title">Salary Payments</div>`;
  const pays = sortByDateDesc(DATA.salaryPayments, 'month');
  html += pays.length ? `<div class="card">` + pays.slice(0,10).map(p=>{
    const emp = DATA.employees.find(x=>x.id===p.employeeId);
    const level = p.status==='Paid'?'green':p.status==='Partial'?'amber':'red';
    return `<div class="list-item">
      <div class="avatar" style="background:#e0e7ff;color:#4338ca">${icon('briefcase')}</div>
      <div class="meta" onclick="openSalaryPaymentForm('${p.id}')"><div class="t">${escapeHtml(emp?emp.name:'—')} · ${p.month}</div><div class="s">${fmtMoney(p.net)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <span class="badge ${level}">${p.status}</span>
        <button class="btn btn-sm btn-outline" onclick="generatePayslip('${p.id}')">${ICN.print} Slip</button>
      </div>
    </div>`;
  }).join('') + `</div>` : emptyState('briefcase','Koi salary payment record nahi','');

  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13C. LABOUR MANAGEMENT  (general daily/monthly wage workers — separate
 *      from Construction's project-linked labour, and from Salary
 *      Management's fixed monthly staff. Covers casual/daily labour with
 *      either daily-wage or monthly-wage settlement and a clear
 *      Sent / Pending / Partial payment ledger.)
 * ---------------------------------------------------------------------- */
function openLabourWorkerForm(editId){
  const editItem = editId ? DATA.labourWorkers.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Worker Name', type:'text', required:true},
    {key:'role', label:'Role / Trade', type:'select', options:['Mason/Karigar','Helper/Mazdoor','Electrician','Plumber','Painter','Carpenter','Gardener/Mali','Farm Worker','Cleaner','Other']},
    {key:'wageType', label:'Wage Type', type:'select', options:['Daily','Monthly']},
    {key:'wageRate', label:'Wage Rate (Rs) — per day or per month', type:'number', required:true},
    {key:'phone', label:'Phone Number', type:'text'},
    {key:'joiningDate', label:'Start Date', type:'date'},
    {key:'status', label:'Status', type:'select', options:['Active','Inactive']},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Worker')}
    <form id="lwForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='joiningDate'?todayISO():(f.key==='status'?'Active':(f.key==='wageType'?'Daily':''))))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delLW">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Worker'}</button>
      </div></form>`, (root)=>{
      $('#lwForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.labourWorkers.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Worker saved'); renderRoute();
      });
      if(editItem) $('#delLW', root).addEventListener('click', ()=>{
        confirmDialog('Delete this worker? Their history will remain but unlinked.', ()=>{
          DATA.labourWorkers = DATA.labourWorkers.filter(x=>x.id!==editId);
          saveData(); closeSheet(); renderRoute();
        });
      });
    });
}
function markLabourAttendance(workerId, status){
  DATA.labourAttendance.push({id:uid(), workerId, date:todayISO(), status});
  saveData(); toast('Attendance marked: '+status); renderRoute();
}
function labourAdvanceOutstanding(workerId){
  return DATA.labourAdvances.filter(a=>a.workerId===workerId && !a.settled)
    .reduce((s,a)=>s+Number(a.amount||0),0);
}
function labourMonthAttendance(workerId, mKey){
  return DATA.labourAttendance.filter(a=>a.workerId===workerId && monthKey(a.date)===mKey);
}
function labourEstimatedDue(w){
  const mKey = monthKey();
  const att = labourMonthAttendance(w.id, mKey);
  const rate = Number(w.wageRate||0);
  let gross = 0;
  if(w.wageType==='Daily'){
    const present = att.filter(a=>a.status==='Present').length;
    const half = att.filter(a=>a.status==='Half-Day').length;
    gross = present*rate + half*(rate/2);
  } else {
    const perDay = rate/30;
    const absent = att.filter(a=>a.status==='Absent').length;
    const half = att.filter(a=>a.status==='Half-Day').length;
    gross = rate - (absent*perDay) - (half*perDay/2);
  }
  const outstanding = labourAdvanceOutstanding(w.id);
  return Math.max(0, gross - outstanding);
}
function openLabourAdvanceForm(editId){
  if(!DATA.labourWorkers.length){ toast('Pehle worker add karein'); return; }
  const editItem = editId ? DATA.labourAdvances.find(x=>x.id===editId) : null;
  const fields = [
    {key:'workerId', label:'Worker', type:'select', options: DATA.labourWorkers.map(w=>w.name), required:true},
    {key:'amount', label:'Advance Amount (Rs)', type:'number', required:true},
    {key:'date', label:'Date', type:'date'},
    {key:'note', label:'Reason / Note', type:'text'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Give ')+'Advance')}
    <form id="laForm">${fields.map(f=>renderField(f, editItem? (f.key==='workerId'? (DATA.labourWorkers.find(w=>w.id===editItem.workerId)||{}).name : editItem[f.key]) : (f.key==='date'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delLA">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Advance'}</button>
      </div></form>`, (root)=>{
      $('#laForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        const w = DATA.labourWorkers.find(x=>x.name===vals.workerId);
        vals.workerId = w ? w.id : null;
        if(editItem) Object.assign(editItem, vals);
        else DATA.labourAdvances.push({id:uid(), settled:false, ...vals});
        saveData(); closeSheet(); toast('Advance saved'); renderRoute();
      });
      if(editItem) $('#delLA', root).addEventListener('click', ()=>{
        DATA.labourAdvances = DATA.labourAdvances.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
      });
    });
}
function openLabourPaymentForm(editId){
  if(!DATA.labourWorkers.length){ toast('Pehle worker add karein'); return; }
  const editItem = editId ? DATA.labourPayments.find(x=>x.id===editId) : null;
  let html = `${sheetHeader((editItem?'Edit ':'Record ')+'Payment')}
    <form id="lpForm">
      <div class="field"><label>Worker *</label><select name="workerId" required id="lwSel">
        ${DATA.labourWorkers.map(w=>`<option value="${w.id}" ${editItem&&editItem.workerId===w.id?'selected':''}>${escapeHtml(w.name)} (${w.wageType})</option>`).join('')}
      </select></div>
      <div class="field-row">
        <div class="field"><label>Period</label><input type="text" name="period" placeholder="e.g. 2026-07 or 21-27 Jul" value="${editItem?editItem.period:monthKey()}"></div>
        <div class="field"><label>Gross Amount (Rs)</label><input type="number" name="gross" id="grossIn" value="${editItem?editItem.gross:''}"></div>
      </div>
      <div class="field"><label>Advance Deducted (Rs)</label><input type="number" name="advanceDeduction" id="lpAdvIn" value="${editItem?editItem.advanceDeduction||0:0}"></div>
      <div class="card" style="background:var(--surface-2);box-shadow:none">
        <div class="card-row" style="justify-content:space-between"><span style="font-size:12px">Net Payment</span><b id="lpNetOut" style="font-size:16px">Rs 0</b></div>
      </div>
      <div class="field" style="margin-top:12px"><label>Payment Status *</label><select name="status" required>
        ${['Sent','Pending','Partial'].map(s=>`<option ${editItem&&editItem.status===s?'selected':''}>${s}</option>`).join('')}
      </select></div>
      <div class="field"><label>Payment Date</label><input type="date" name="paymentDate" value="${editItem?editItem.paymentDate:todayISO()}"></div>
      <div class="field"><label>Note</label><input type="text" name="note" value="${editItem?escapeHtml(editItem.note||''):''}"></div>
      <div style="display:flex;gap:10px;margin-top:6px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delLP">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save Payment'}</button>
      </div>
    </form>`;
  openSheet(html, (root)=>{
    const workerSel = $('#lwSel', root);
    function prefill(){
      const w = DATA.labourWorkers.find(x=>x.id===workerSel.value);
      if(w && !editItem){
        $('#grossIn', root).value = w.wageType==='Monthly' ? w.wageRate : Math.round(labourEstimatedDue(w) + labourAdvanceOutstanding(w.id));
        $('#lpAdvIn', root).value = labourAdvanceOutstanding(w.id);
      }
      recalc();
    }
    function recalc(){
      const gross = Number($('#grossIn', root).value)||0;
      const advD = Number($('#lpAdvIn', root).value)||0;
      $('#lpNetOut', root).textContent = fmtMoney(gross-advD);
    }
    workerSel.addEventListener('change', prefill);
    $$('#grossIn,#lpAdvIn', root).forEach(el=>el.addEventListener('input', recalc));
    prefill();
    $('#lpForm', root).addEventListener('submit', e=>{
      e.preventDefault();
      const f = e.target;
      const vals = {
        workerId:f.workerId.value, period:f.period.value, gross:Number(f.gross.value)||0,
        advanceDeduction:Number(f.advanceDeduction.value)||0, status:f.status.value,
        paymentDate:f.paymentDate.value, note:f.note.value,
      };
      vals.net = vals.gross - vals.advanceDeduction;
      if(editItem) Object.assign(editItem, vals);
      else DATA.labourPayments.push({id:uid(), ...vals});
      if(vals.advanceDeduction>0){
        DATA.labourAdvances.filter(a=>a.workerId===vals.workerId && !a.settled).forEach(a=>a.settled=true);
      }
      saveData(); closeSheet(); toast('Payment saved'); renderRoute();
    });
    if(editItem) $('#delLP', root).addEventListener('click', ()=>{
      confirmDialog('Delete this payment record?', ()=>{ DATA.labourPayments = DATA.labourPayments.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
    });
  });
}
function generateLabourSlip(paymentId){
  const p = DATA.labourPayments.find(x=>x.id===paymentId);
  const w = DATA.labourWorkers.find(x=>x.id===p.workerId);
  const receiptHtml = `<div style="font-family:Arial,sans-serif;padding:6px">
    <div style="text-align:center;margin-bottom:14px">
      <div style="font-size:20px;font-weight:800;color:#c2410c">GharSaz 360</div>
      <div style="font-size:12px;color:#666">Labour Payment Slip</div>
    </div>
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <tr><td style="padding:5px 0;color:#666">Worker</td><td style="text-align:right;font-weight:700">${escapeHtml(w?w.name:'—')}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Role</td><td style="text-align:right">${escapeHtml(w?w.role:'—')} (${w?w.wageType:''})</td></tr>
      <tr><td style="padding:5px 0;color:#666">Period</td><td style="text-align:right">${escapeHtml(p.period)}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Gross Amount</td><td style="text-align:right">${fmtMoney(p.gross)}</td></tr>
      ${p.advanceDeduction?`<tr><td style="padding:5px 0;color:#666">Advance Deducted</td><td style="text-align:right">-${fmtMoney(p.advanceDeduction)}</td></tr>`:''}
      <tr><td style="padding:8px 0;font-weight:800;border-top:1px solid #ddd">Net Payment</td><td style="text-align:right;font-weight:800;border-top:1px solid #ddd">${fmtMoney(p.net)}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Status</td><td style="text-align:right">${p.status}</td></tr>
      <tr><td style="padding:5px 0;color:#666">Date</td><td style="text-align:right">${fmtDate(p.paymentDate)}</td></tr>
    </table>
    <div style="text-align:center;margin-top:16px;font-size:11px;color:#999">Generated by GharSaz 360 · 100% Offline App</div>
  </div>`;
  openSheet(`${sheetHeader('Labour Payment Slip')}
    <div class="card" style="box-shadow:none">${receiptHtml}</div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="btn btn-outline btn-block" id="waLSlip">Share on WhatsApp</button>
      <button class="btn btn-primary btn-block" id="dlLSlip">${ICN.down} Download</button>
    </div>`, (root)=>{
      $('#dlLSlip', root).addEventListener('click', ()=>{
        const text = `GharSaz 360 - Labour Payment Slip\nWorker: ${w?w.name:''}\nPeriod: ${p.period}\nNet Payment: ${fmtMoney(p.net)}\nStatus: ${p.status}\nDate: ${fmtDate(p.paymentDate)}`;
        downloadFile(`Labour-Slip-${w?w.name:'worker'}-${p.period}.txt`, text, 'text/plain');
      });
      $('#waLSlip', root).addEventListener('click', ()=>{
        const text = encodeURIComponent(`GharSaz 360 Labour Payment Slip\nWorker: ${w?w.name:''}\nPeriod: ${p.period}\nNet Payment: ${fmtMoney(p.net)}\nStatus: ${p.status}`);
        window.open(`https://wa.me/${(w&&w.phone)?w.phone.replace(/\D/g,''):''}?text=${text}`, '_blank');
      });
    });
}
function renderLabour(){
  if(!DATA.labourWorkers.length){
    $('#viewRoot').innerHTML = emptyState('hardhat','Koi labour worker register nahi','Daily ya monthly wage worker add karein', 'labour-picker');
    return;
  }
  const activeWorkers = DATA.labourWorkers.filter(w=>w.status!=='Inactive');
  const totalDue = activeWorkers.reduce((s,w)=>s+labourEstimatedDue(w),0);
  const pendingPayments = DATA.labourPayments.filter(p=>p.status!=='Sent').length;

  let html = `<div class="grid-2">
    <div class="stat-card" style="background:linear-gradient(135deg,#9a3412,#f97316)"><div class="stat-label">Estimated Dues (this month)</div><div class="stat-value">${fmtMoney(totalDue)}</div></div>
    <div class="stat-card ${pendingPayments?'danger':''}"><div class="stat-label">Payments Pending</div><div class="stat-value">${pendingPayments}</div></div>
  </div>`;

  html += `<div class="section-title">Workers &amp; Attendance</div><div class="card">` +
    DATA.labourWorkers.map(w=>{
      const due = labourEstimatedDue(w);
      const outstanding = labourAdvanceOutstanding(w.id);
      return `<div style="padding:10px 0;border-bottom:1px solid var(--border)">
        <div class="card-row" style="justify-content:space-between">
          <div class="card-row" onclick="openLabourWorkerForm('${w.id}')" style="cursor:pointer">
            <div class="avatar" style="background:#ffedd5;color:#c2410c;width:36px;height:36px;border-radius:11px">${icon('hardhat')}</div>
            <div><div style="font-weight:700;font-size:13px">${escapeHtml(w.name)}</div><div class="card-sub">${escapeHtml(w.role||'')} · ${w.wageType} · ${fmtMoney(w.wageRate)}${w.wageType==='Daily'?'/day':'/mo'} ${w.status==='Inactive'?'· Inactive':''}</div></div>
          </div>
          <div style="text-align:right"><div class="card-sub">Est. Due</div><div style="font-weight:800">${fmtMoney(due)}</div>
            ${outstanding?`<div class="card-sub" style="color:#dc2626">Advance: ${fmtMoney(outstanding)}</div>`:''}
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
          <button class="btn btn-sm btn-ghost" onclick="markLabourAttendance('${w.id}','Present')">Present</button>
          <button class="btn btn-sm btn-ghost" onclick="markLabourAttendance('${w.id}','Half-Day')">Half-Day</button>
          <button class="btn btn-sm btn-ghost" onclick="markLabourAttendance('${w.id}','Absent')">Absent</button>
          <button class="btn btn-sm btn-outline" onclick="openLabourAdvanceForm(null)">+ Advance</button>
        </div>
      </div>`;
    }).join('') + `</div>`;

  html += `<div class="section-title">Advances</div>`;
  const advs = sortByDateDesc(DATA.labourAdvances, 'date');
  html += advs.length ? `<div class="card">` + advs.slice(0,10).map(a=>{
    const w = DATA.labourWorkers.find(x=>x.id===a.workerId);
    return `<div class="list-item" onclick="openLabourAdvanceForm('${a.id}')">
      <div class="avatar" style="background:#fee2e2;color:#991b1b">${icon('wallet')}</div>
      <div class="meta"><div class="t">${escapeHtml(w?w.name:'—')}</div><div class="s">${fmtDate(a.date)} ${a.settled?'· Settled':'· Outstanding'}</div></div>
      <div class="amt">${fmtMoney(a.amount)}</div>
    </div>`;
  }).join('') + `</div>` : emptyState('wallet','Koi advance record nahi','');

  html += `<div class="section-title">Payments — Sent / Pending</div>`;
  const pays = sortByDateDesc(DATA.labourPayments, 'paymentDate');
  html += pays.length ? `<div class="card">` + pays.slice(0,12).map(p=>{
    const w = DATA.labourWorkers.find(x=>x.id===p.workerId);
    const level = p.status==='Sent'?'green':p.status==='Partial'?'amber':'red';
    return `<div class="list-item">
      <div class="avatar" style="background:#ffedd5;color:#c2410c">${icon('hardhat')}</div>
      <div class="meta" onclick="openLabourPaymentForm('${p.id}')"><div class="t">${escapeHtml(w?w.name:'—')} · ${escapeHtml(p.period)}</div><div class="s">${fmtMoney(p.net)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <span class="badge ${level}">${p.status}</span>
        <button class="btn btn-sm btn-outline" onclick="generateLabourSlip('${p.id}')">${ICN.print} Slip</button>
      </div>
    </div>`;
  }).join('') + `</div>` : emptyState('hardhat','Koi payment record nahi','');

  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13D. SHARED DATE HELPERS  (used by Bills, Loans, Subscriptions,
 *      Insurance, Family birthdays, Important Dates, To-Do)
 * ---------------------------------------------------------------------- */
function dueBadge(dateStr, warnDays){
  warnDays = warnDays||7;
  const d = daysUntil(dateStr);
  if(d===null) return '';
  if(d<0) return `<span class="badge red">Overdue ${Math.abs(d)}d</span>`;
  if(d===0) return `<span class="badge red">Due Today</span>`;
  if(d<=warnDays) return `<span class="badge amber">${d}d left</span>`;
  return `<span class="badge green">${d}d left</span>`;
}
function nextYearlyOccurrence(dateStr){
  if(!dateStr) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const d = new Date(dateStr);
  if(isNaN(d)) return null;
  let next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if(next < now) next = new Date(now.getFullYear()+1, d.getMonth(), d.getDate());
  return next.toISOString().slice(0,10);
}
function ageFromDob(dateStr){
  if(!dateStr) return null;
  const d = new Date(dateStr); if(isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear()-d.getFullYear();
  const m = now.getMonth()-d.getMonth();
  if(m<0 || (m===0 && now.getDate()<d.getDate())) age--;
  return age;
}

/* ---------------------------------------------------------------------- *
 * 13E. TO-DO / DAILY TASKS
 * ---------------------------------------------------------------------- */
function toggleTodoStatus(id){
  const t = DATA.todos.find(x=>x.id===id);
  t.status = t.status==='Done' ? 'Pending' : 'Done';
  saveData(); renderRoute();
}
function renderTodos(){
  if(!DATA.todos.length){ $('#viewRoot').innerHTML = emptyState('checksquare','Koi task nahi','Naya task add karein','todos'); return; }
  const pending = DATA.todos.filter(t=>t.status!=='Done').sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999'));
  const done = DATA.todos.filter(t=>t.status==='Done');
  let html = `<div class="stat-card" style="background:linear-gradient(135deg,#0e7490,#22d3ee)"><div class="stat-label">Pending Tasks</div><div class="stat-value">${pending.length}</div></div>`;
  html += `<div class="section-title">All Tasks</div><div class="card">` + pending.concat(done).map(t=>{
    const pr = {Low:'green',Medium:'amber',High:'red'}[t.priority]||'';
    const isDone = t.status==='Done';
    return `<div class="list-item">
      <div class="avatar" style="background:${isDone?'#d1fae5':'#e0f2fe'};color:${isDone?'#065f46':'#0369a1'};cursor:pointer" onclick="toggleTodoStatus('${t.id}')">${isDone?icon('check'):''}</div>
      <div class="meta" onclick="openGenericForm('todos','${t.id}')" style="cursor:pointer;${isDone?'opacity:.55;text-decoration:line-through':''}"><div class="t">${escapeHtml(t.title)}</div><div class="s">${escapeHtml(t.category||'')} ${t.dueDate?'· '+fmtDate(t.dueDate):''}</div></div>
      ${isDone?'<span class="badge green">Done</span>':(t.priority?`<span class="badge ${pr}">${t.priority}</span>`:'')}
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13F. BILL REMINDERS
 * ---------------------------------------------------------------------- */
function toggleBillPaid(id){
  const b = DATA.bills.find(x=>x.id===id);
  if(b.status==='Paid'){
    b.status = 'Unpaid';
  } else {
    b.status = 'Paid';
    if(b.recurring==='Monthly'){
      const d = new Date(b.dueDate||todayISO()); d.setMonth(d.getMonth()+1);
      b.dueDate = d.toISOString().slice(0,10); b.status='Unpaid';
    } else if(b.recurring==='Yearly'){
      const d = new Date(b.dueDate||todayISO()); d.setFullYear(d.getFullYear()+1);
      b.dueDate = d.toISOString().slice(0,10); b.status='Unpaid';
    }
  }
  saveData(); toast('Bill updated'); renderRoute();
}
function renderBills(){
  if(!DATA.bills.length){ $('#viewRoot').innerHTML = emptyState('bell','Koi bill nahi','Utility bill add karein','bills'); return; }
  const unpaid = DATA.bills.filter(b=>b.status!=='Paid');
  const totalDue = unpaid.reduce((s,b)=>s+Number(b.amount||0),0);
  let html = `<div class="stat-card danger"><div class="stat-label">Unpaid Bills Total</div><div class="stat-value">${fmtMoney(totalDue)}</div></div>`;
  const sorted = DATA.bills.slice().sort((a,b)=>(a.dueDate||'').localeCompare(b.dueDate||''));
  html += `<div class="section-title">All Bills</div><div class="card">` + sorted.map(b=>`
    <div class="list-item">
      <div class="avatar" style="background:#fef3c7;color:#b45309">${icon('bell')}</div>
      <div class="meta" onclick="openGenericForm('bills','${b.id}')" style="cursor:pointer"><div class="t">${escapeHtml(b.name)}</div><div class="s">${fmtMoney(b.amount)} · ${fmtDate(b.dueDate)}</div></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        ${b.status==='Paid'?'<span class="badge green">Paid</span>':dueBadge(b.dueDate,5)}
        <button class="btn btn-sm btn-outline" onclick="toggleBillPaid('${b.id}')">${b.status==='Paid'?'Mark Unpaid':'Mark Paid'}</button>
      </div>
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13G. FAMILY MEMBERS PROFILE
 * ---------------------------------------------------------------------- */
function renderFamily(){
  if(!DATA.familyMembers.length){ $('#viewRoot').innerHTML = emptyState('users','Koi family member nahi','Family member add karein','familyMembers'); return; }
  let html = `<div class="card">` + DATA.familyMembers.map(m=>{
    const age = ageFromDob(m.dob);
    const nextBday = nextYearlyOccurrence(m.dob);
    const d = nextBday ? daysUntil(nextBday) : null;
    return `<div class="list-item" onclick="openGenericForm('familyMembers','${m.id}')">
      <div class="avatar" style="background:#fce7f3;color:#db2777">${icon('users')}</div>
      <div class="meta"><div class="t">${escapeHtml(m.name)}</div><div class="s">${escapeHtml(m.relation||'')} ${age!==null?'· '+age+' yrs':''} ${m.bloodGroup&&m.bloodGroup!=='Unknown'?'· '+m.bloodGroup:''}</div></div>
      ${d!==null && d<=30?`<span class="badge amber">🎂 ${d}d</span>`:''}
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13H. LOAN / EMI TRACKER
 * ---------------------------------------------------------------------- */
function markEMIPaid(loanId){
  const l = DATA.loans.find(x=>x.id===loanId);
  const remaining = l.remaining!==undefined ? l.remaining : Number(l.principal||0);
  l.remaining = Math.max(0, remaining - Number(l.monthlyEMI||0));
  DATA.loanPayments.push({id:uid(), loanId, amount:l.monthlyEMI, date:todayISO()});
  const d = new Date(l.nextDueDate||todayISO()); d.setMonth(d.getMonth()+1);
  l.nextDueDate = d.toISOString().slice(0,10);
  saveData(); toast('EMI payment recorded'); renderRoute();
}
function renderLoans(){
  if(!DATA.loans.length){ $('#viewRoot').innerHTML = emptyState('bank','Koi loan nahi','Loan/EMI add karein','loans'); return; }
  const totalRemaining = DATA.loans.reduce((s,l)=>s+Number(l.remaining!==undefined?l.remaining:l.principal||0),0);
  let html = `<div class="stat-card danger"><div class="stat-label">Total Remaining</div><div class="stat-value">${fmtMoney(totalRemaining)}</div></div>`;
  html += `<div class="section-title">Loans</div><div class="card">` + DATA.loans.map(l=>{
    const remaining = l.remaining!==undefined ? l.remaining : l.principal;
    return `<div style="padding:10px 0;border-bottom:1px solid var(--border)">
      <div class="card-row" style="justify-content:space-between">
        <div onclick="openGenericForm('loans','${l.id}')" style="cursor:pointer"><div style="font-weight:700;font-size:13px">${escapeHtml(l.name)}</div><div class="card-sub">${escapeHtml(l.lender||'')} · EMI ${fmtMoney(l.monthlyEMI)}</div></div>
        <div style="text-align:right">${dueBadge(l.nextDueDate,7)}<div class="card-sub" style="margin-top:4px">Remaining: ${fmtMoney(remaining)}</div></div>
      </div>
      <button class="btn btn-sm btn-primary" style="margin-top:8px" onclick="markEMIPaid('${l.id}')">Mark EMI Paid</button>
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13I. SUBSCRIPTION TRACKER
 * ---------------------------------------------------------------------- */
function renderSubscriptions(){
  if(!DATA.subscriptions.length){ $('#viewRoot').innerHTML = emptyState('repeat','Koi subscription nahi','Subscription add karein','subscriptions'); return; }
  const active = DATA.subscriptions.filter(s=>s.status!=='Cancelled');
  const monthlyTotal = active.reduce((s,x)=>s+Number(x.amount||0)/(x.billingCycle==='Yearly'?12:1),0);
  let html = `<div class="stat-card" style="background:linear-gradient(135deg,#6d28d9,#a78bfa)"><div class="stat-label">Est. Monthly Cost</div><div class="stat-value">${fmtMoney(monthlyTotal)}</div></div>`;
  html += `<div class="section-title">Subscriptions</div><div class="card">` + DATA.subscriptions.map(s=>`
    <div class="list-item" onclick="openGenericForm('subscriptions','${s.id}')">
      <div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('repeat')}</div>
      <div class="meta"><div class="t">${escapeHtml(s.name)}</div><div class="s">${escapeHtml(s.category||'')} · ${fmtMoney(s.amount)}/${s.billingCycle==='Yearly'?'yr':'mo'}</div></div>
      ${s.status==='Cancelled'?'<span class="badge red">Cancelled</span>':dueBadge(s.nextRenewalDate,7)}
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13J. INSURANCE POLICY TRACKER
 * ---------------------------------------------------------------------- */
function renderInsurance(){
  if(!DATA.insurancePolicies.length){ $('#viewRoot').innerHTML = emptyState('umbrella','Koi policy nahi','Insurance policy add karein','insurancePolicies'); return; }
  let html = `<div class="card">` + DATA.insurancePolicies.map(p=>`
    <div class="list-item" onclick="openGenericForm('insurancePolicies','${p.id}')">
      <div class="avatar" style="background:#e0f2fe;color:#0369a1">${icon('umbrella')}</div>
      <div class="meta"><div class="t">${escapeHtml(p.type)} — ${escapeHtml(p.provider||'')}</div><div class="s">Premium ${fmtMoney(p.premiumAmount)}/${p.premiumCycle==='Yearly'?'yr':'mo'} ${p.policyNumber?'· #'+escapeHtml(p.policyNumber):''}</div></div>
      ${dueBadge(p.expiryDate,30)}
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13K. HEALTH RECORDS
 * ---------------------------------------------------------------------- */
function renderHealth(){
  if(!DATA.healthRecords.length){ $('#viewRoot').innerHTML = emptyState('heartpulse','Koi health record nahi','Prescription/appointment add karein','healthRecords'); return; }
  const sorted = DATA.healthRecords.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  let html = `<div class="card">` + sorted.map(r=>`
    <div class="list-item" onclick="openGenericForm('healthRecords','${r.id}')">
      <div class="avatar" style="background:#fee2e2;color:#dc2626">${icon('heartpulse')}</div>
      <div class="meta"><div class="t">${escapeHtml(r.memberName||'')} · ${escapeHtml(r.recordType||'')}</div><div class="s">${escapeHtml(r.doctor||'')} · ${fmtDate(r.date)}</div></div>
      ${r.nextAppointment?dueBadge(r.nextAppointment,7):''}
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 13L. IMPORTANT DATES & ANNIVERSARY REMINDERS
 * ---------------------------------------------------------------------- */
function renderImportantDates(){
  if(!DATA.importantDates.length){ $('#viewRoot').innerHTML = emptyState('gift','Koi important date nahi','Birthday/anniversary add karein','importantDates'); return; }
  const withNext = DATA.importantDates.map(e=>({...e, _next: nextYearlyOccurrence(e.date)}));
  withNext.sort((a,b)=>(a._next||'').localeCompare(b._next||''));
  let html = `<div class="card">` + withNext.map(e=>`
    <div class="list-item" onclick="openGenericForm('importantDates','${e.id}')">
      <div class="avatar" style="background:#fce7f3;color:#be185d">${icon('gift')}</div>
      <div class="meta"><div class="t">${escapeHtml(e.title)}</div><div class="s">${escapeHtml(e.type||'')} · ${fmtDate(e.date)}</div></div>
      ${dueBadge(e._next,14)}
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 14. ASSETS & WARRANTY / MAINTENANCE SCHEDULER
 * ---------------------------------------------------------------------- */
function renderAssets(){
  let html = '';
  if(!DATA.assets.length){ html = emptyState('box','Koi asset record nahi','Appliance ya asset add karein', 'assets'); $('#viewRoot').innerHTML = html; return; }
  html += `<div class="card">` + DATA.assets.map(a=>{
    const d = daysUntil(a.warrantyExpiry);
    let badge = '';
    if(d!==null){
      if(d<0) badge = `<span class="badge red">Expired</span>`;
      else if(d<=30) badge = `<span class="badge amber">${d}d left</span>`;
      else badge = `<span class="badge green">${Math.round(d/30)}mo left</span>`;
    }
    return `<div class="list-item" onclick="openGenericForm('assets','${a.id}')">
      <div class="avatar" style="background:#dbeafe;color:#0369a1">${icon('box')}</div>
      <div class="meta"><div class="t">${escapeHtml(a.name)}</div><div class="s">${escapeHtml(a.vendor||'')} · ${fmtMoney(a.price)}</div></div>
      ${badge}
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}
function renderMaintenance(){
  if(!DATA.maintenanceLogs.length){ $('#viewRoot').innerHTML = emptyState('wrench','Koi maintenance schedule nahi','Servicing task add karein', 'maintenanceLogs'); return; }
  const sorted = DATA.maintenanceLogs.slice().sort((a,b)=>(a.nextDate||'').localeCompare(b.nextDate||''));
  let html = `<div class="card">` + sorted.map(m=>{
    const d = daysUntil(m.nextDate);
    let badge = '<span class="badge">No date</span>';
    if(d!==null){
      if(d<0) badge = `<span class="badge red">Overdue</span>`;
      else if(d<=14) badge = `<span class="badge amber">${d}d left</span>`;
      else badge = `<span class="badge green">${d}d left</span>`;
    }
    return `<div class="list-item" onclick="openGenericForm('maintenanceLogs','${m.id}')">
      <div class="avatar" style="background:#f1f5f9;color:#475569">${icon('wrench')}</div>
      <div class="meta"><div class="t">${escapeHtml(m.task)}</div><div class="s">Next: ${fmtDate(m.nextDate)} · Cost ${fmtMoney(m.cost)}</div></div>
      ${badge}
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 15. VEHICLE FUEL & MAINTENANCE
 * ---------------------------------------------------------------------- */
function openFuelForm(editId){
  const editItem = editId ? DATA.fuelLogs.find(x=>x.id===editId) : null;
  if(!DATA.vehicles.length){ toast('Pehle vehicle add karein'); return; }
  const fields = [
    {key:'vehicleId', label:'Vehicle', type:'select', options: DATA.vehicles.map(v=>v.name), required:true},
    {key:'date', label:'Date', type:'date'},
    {key:'liters', label:'Liters', type:'number', required:true},
    {key:'rate', label:'Rate (Rs/liter)', type:'number', required:true},
    {key:'odometer', label:'Odometer Reading (km)', type:'number', required:true},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Fuel Entry')}
    <form id="fForm">${fields.map(f=>renderField(f, editItem? (f.key==='vehicleId'? (DATA.vehicles.find(v=>v.id===editItem.vehicleId)||{}).name : editItem[f.key]) : (f.key==='date'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delF">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div></form>`, (root)=>{
      $('#fForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        const v = DATA.vehicles.find(x=>x.name===vals.vehicleId);
        vals.vehicleId = v ? v.id : null;
        if(editItem) Object.assign(editItem, vals);
        else DATA.fuelLogs.push({id:uid(), ...vals});
        if(v && vals.odometer > Number(v.odometer||0)) v.odometer = vals.odometer;
        saveData(); closeSheet(); toast('Fuel entry saved'); renderRoute();
      });
      if(editItem) $('#delF', root).addEventListener('click', ()=>{
        confirmDialog('Delete entry?', ()=>{ DATA.fuelLogs = DATA.fuelLogs.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); });
      });
    });
}
function renderVehicle(){
  if(!DATA.vehicles.length){ $('#viewRoot').innerHTML = emptyState('car','Koi vehicle nahi','Vehicle add karein', 'vehicle-picker'); return; }
  let html = `<div class="card">` + DATA.vehicles.map(v=>`
    <div class="list-item" onclick="openGenericForm('vehicles','${v.id}')">
      <div class="avatar" style="background:#fee2e2;color:#dc2626">${icon('car')}</div>
      <div class="meta"><div class="t">${escapeHtml(v.name)}</div><div class="s">${escapeHtml(v.plate||'')} · ${v.odometer||0} km</div></div>
    </div>`).join('') + `</div>`;

  html += `<div class="section-title">Fuel Log &amp; Mileage</div>`;
  const logs = DATA.fuelLogs.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
  if(!logs.length){ html += emptyState('droplet','Koi fuel entry nahi',''); }
  else {
    const rows = [];
    DATA.vehicles.forEach(v=>{
      const vLogs = logs.filter(l=>l.vehicleId===v.id);
      for(let i=1;i<vLogs.length;i++){
        const distance = vLogs[i].odometer - vLogs[i-1].odometer;
        const mileage = distance>0 && vLogs[i].liters>0 ? (distance/vLogs[i].liters).toFixed(1) : '—';
        rows.push({v, log:vLogs[i], mileage});
      }
      if(vLogs.length===1) rows.push({v, log:vLogs[0], mileage:'—'});
    });
    rows.reverse();
    html += `<div class="card">` + rows.slice(0,12).map(r=>`
      <div class="list-item" onclick="openFuelForm('${r.log.id}')">
        <div class="avatar" style="background:#fef3c7;color:#b45309">${icon('droplet')}</div>
        <div class="meta"><div class="t">${escapeHtml(r.v.name)} · ${r.log.liters}L</div><div class="s">${fmtDate(r.log.date)} · ${r.mileage} km/L</div></div>
        <div class="amt">${fmtMoney(r.log.liters*r.log.rate)}</div>
      </div>`).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 16. ZAKAT CALCULATOR & CHARITY LEDGER
 * ---------------------------------------------------------------------- */
function openZakatCalculator(){
  openSheet(`${sheetHeader('Zakat Calculator')}
    <div class="help-text" style="margin-bottom:12px">Nisab: 7.5 tola (87.48g) sona ya 52.5 tola (612.36g) chandi ki maujooda market value. Zakat rate: 2.5% (1/40) saal-bhar rakhi gayi wealth par.</div>
    <form id="zForm">
      <div class="field"><label>Cash in Hand / Bank (Rs)</label><input type="number" name="cash" value="0"></div>
      <div class="field-row">
        <div class="field"><label>Gold (grams)</label><input type="number" name="goldGrams" value="0"></div>
        <div class="field"><label>Gold Price (Rs/gram)</label><input type="number" name="goldPrice" value="0"></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Silver (grams)</label><input type="number" name="silverGrams" value="0"></div>
        <div class="field"><label>Silver Price (Rs/gram)</label><input type="number" name="silverPrice" value="0"></div>
      </div>
      <div class="field"><label>Commercial / Business Assets (Rs)</label><input type="number" name="commercial" value="0"></div>
      <div class="field"><label>Liabilities / Debts Payable (Rs)</label><input type="number" name="liabilities" value="0"></div>
      <div class="card" id="zResult" style="background:var(--surface-2);box-shadow:none;margin-top:6px"></div>
      <button type="button" class="btn btn-primary btn-block" id="zSave" style="margin-top:12px">Save as Charity Record</button>
    </form>`, (root)=>{
      const form = $('#zForm', root);
      function calc(){
        const v = Object.fromEntries(new FormData(form));
        const cash = Number(v.cash)||0, gold = (Number(v.goldGrams)||0)*(Number(v.goldPrice)||0),
          silver = (Number(v.silverGrams)||0)*(Number(v.silverPrice)||0), comm = Number(v.commercial)||0,
          liab = Number(v.liabilities)||0;
        const totalWealth = cash+gold+silver+comm-liab;
        const nisabSilver = 612.36*(Number(v.silverPrice)||0);
        const eligible = totalWealth >= nisabSilver && nisabSilver>0;
        const zakatDue = eligible ? totalWealth*0.025 : 0;
        $('#zResult', root).innerHTML = `
          <div class="card-row" style="justify-content:space-between"><span style="font-size:12px">Net Zakatable Wealth</span><b>${fmtMoney(totalWealth)}</b></div>
          <div class="card-row" style="justify-content:space-between;margin-top:6px"><span style="font-size:12px">Nisab (Silver basis)</span><b>${fmtMoney(nisabSilver)}</b></div>
          <div class="divider"></div>
          <div class="card-row" style="justify-content:space-between"><span style="font-weight:700">Zakat Due (2.5%)</span><b style="font-size:18px;color:#059669">${eligible?fmtMoney(zakatDue):'Not applicable'}</b></div>
          ${!eligible?'<div class="help-text">Wealth Nisab se kam hai, is liye Zakat wajib nahi.</div>':''}`;
        return zakatDue;
      }
      form.addEventListener('input', calc);
      calc();
      $('#zSave', root).addEventListener('click', ()=>{
        const due = calc();
        if(due<=0){ toast('Zakat wajib nahi'); return; }
        DATA.charityRecords.push({id:uid(), type:'Zakat Payment', recipient:'', amount:due, date:todayISO()});
        saveData(); closeSheet(); toast('Zakat record saved'); renderRoute();
      });
    });
}
function renderZakat(){
  const totalCharity = DATA.charityRecords.reduce((s,c)=>s+Number(c.amount||0),0);
  let html = `<div class="stat-card" style="background:linear-gradient(135deg,#0f766e,#34d399)"><div class="stat-label">Total Given (All Time)</div><div class="stat-value">${fmtMoney(totalCharity)}</div></div>`;
  html += `<button class="btn btn-primary btn-block" style="margin-top:14px" onclick="openZakatCalculator()">Open Zakat Calculator</button>`;
  html += `<div class="section-title">Charity Ledger</div>`;
  if(!DATA.charityRecords.length){ html += emptyState('moonstar','Koi record nahi',''); }
  else {
    html += `<div class="card">` + sortByDateDesc(DATA.charityRecords, 'date').map(c=>`
      <div class="list-item" onclick="openGenericForm('charityRecords','${c.id}')">
        <div class="avatar" style="background:#ccfbf1;color:#0f766e">${icon('moonstar')}</div>
        <div class="meta"><div class="t">${escapeHtml(c.type)}</div><div class="s">${escapeHtml(c.recipient||'')} · ${fmtDate(c.date)}</div></div>
        <div class="amt">${fmtMoney(c.amount)}</div>
      </div>`).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 17. SOLAR & UTILITY ESTIMATOR
 * ---------------------------------------------------------------------- */
function renderSolar(){
  if(!DATA.solarLogs.length){ $('#viewRoot').innerHTML = emptyState('sunbolt','Koi solar log nahi','Monthly generation add karein', 'solarLogs'); return; }
  const logs = DATA.solarLogs.slice().sort((a,b)=>(a.month||'').localeCompare(b.month||''));
  const last = logs[logs.length-1];
  const estBill = ((Number(last.peakUnits)||0)+(Number(last.offPeakUnits)||0))*(Number(last.tariff)||0);
  const savings = (Number(last.generated)||0)*(Number(last.tariff)||0);
  let html = `<div class="grid-2">
    <div class="stat-card" style="background:linear-gradient(135deg,#b45309,#f59e0b)"><div class="stat-label">Est. Monthly Bill</div><div class="stat-value">${fmtMoney(estBill)}</div></div>
    <div class="stat-card" style="background:linear-gradient(135deg,#065f46,#10b981)"><div class="stat-label">Est. Savings</div><div class="stat-value">${fmtMoney(savings)}</div></div>
  </div>`;
  html += `<div class="section-title">Monthly Logs</div><div class="card">` + logs.slice().reverse().map(l=>`
    <div class="list-item" onclick="openGenericForm('solarLogs','${l.id}')">
      <div class="avatar" style="background:#fef3c7;color:#b45309">${icon('sunbolt')}</div>
      <div class="meta"><div class="t">${escapeHtml(l.month)}</div><div class="s">Generated ${l.generated||0} · Exported ${l.exported||0} units</div></div>
      <div class="amt">Peak ${l.peakUnits||0}u</div>
    </div>`).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 18. PANTRY & RATION AUTO-PLANNER
 * ---------------------------------------------------------------------- */
function renderPantry(){
  if(!DATA.pantryItems.length){ $('#viewRoot').innerHTML = emptyState('basket','Pantry khali hai','Ration items add karein', 'pantryItems'); return; }
  const low = DATA.pantryItems.filter(p=>Number(p.qty) <= Number(p.threshold||0));
  let html = '';
  if(low.length){
    html += `<div class="section-title">Shopping Checklist (Low Stock)</div><div class="card">` + low.map(p=>`
      <div class="list-item"><div class="avatar" style="background:#fee2e2;color:#991b1b">${icon('basket')}</div>
      <div class="meta"><div class="t">${escapeHtml(p.name)}</div><div class="s">Only ${p.qty} ${p.unit} left</div></div>
      <span class="badge red">Buy</span></div>`).join('') + `</div>
      <button class="btn btn-outline btn-block" id="dlChecklist">${ICN.down} Download Checklist</button>`;
  }
  html += `<div class="section-title">All Items</div><div class="card">` + DATA.pantryItems.map(p=>{
    const isLow = Number(p.qty) <= Number(p.threshold||0);
    return `<div class="list-item" onclick="openGenericForm('pantryItems','${p.id}')">
      <div class="avatar" style="background:#ecfccb;color:#65a30d">${icon('basket')}</div>
      <div class="meta"><div class="t">${escapeHtml(p.name)}</div><div class="s">Threshold: ${p.threshold||0} ${p.unit||''}</div></div>
      <span class="badge ${isLow?'red':'green'}">${p.qty} ${p.unit||''}</span>
    </div>`;
  }).join('') + `</div>`;
  $('#viewRoot').innerHTML = html;
  const dlBtn = $('#dlChecklist');
  if(dlBtn){
    dlBtn.addEventListener('click', ()=>{
      const text = 'Ration Shopping List:\n' + low.map(p=>'- '+p.name+' ('+p.qty+' '+(p.unit||'')+' left)').join('\n');
      downloadFile('ration-list.txt', text, 'text/plain');
    });
  }
}

/* ---------------------------------------------------------------------- *
 * 19. FAMILY EMERGENCY & DOCUMENT VAULT (AES-GCM encrypted)
 * ---------------------------------------------------------------------- */
let VAULT_KEY = null; // CryptoKey held only in memory for the session
async function deriveKey(pin, saltB64){
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(saltB64), c=>c.charCodeAt(0));
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {name:'PBKDF2', salt, iterations:150000, hash:'SHA-256'},
    baseKey, {name:'AES-GCM', length:256}, false, ['encrypt','decrypt']
  );
}
async function vaultEncrypt(plainObj){
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = enc.encode(JSON.stringify(plainObj));
  const cipher = await crypto.subtle.encrypt({name:'AES-GCM', iv}, VAULT_KEY, data);
  return {iv:btoa(String.fromCharCode(...iv)), data:btoa(String.fromCharCode(...new Uint8Array(cipher)))};
}
async function vaultDecrypt(rec){
  const iv = Uint8Array.from(atob(rec.iv), c=>c.charCodeAt(0));
  const data = Uint8Array.from(atob(rec.data), c=>c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({name:'AES-GCM', iv}, VAULT_KEY, data);
  return JSON.parse(new TextDecoder().decode(plain));
}
function setupVaultPin(){
  openSheet(`${sheetHeader('Set Vault PIN')}
    <div class="help-text" style="margin-bottom:12px">Ye PIN sirf aapke paas hai — kahin save nahi hota. PIN bhool jayen to vault data recover nahi ho sakta, is liye yaad rakhein.</div>
    <form id="pinForm">
      <div class="field"><label>Choose a PIN (min 4 digits) *</label><input type="password" inputmode="numeric" name="pin" required minlength="4"></div>
      <div class="field"><label>Confirm PIN *</label><input type="password" inputmode="numeric" name="pin2" required minlength="4"></div>
      <button type="submit" class="btn btn-primary btn-block">Create Vault</button>
    </form>`, (root)=>{
      $('#pinForm', root).addEventListener('submit', async (e)=>{
        e.preventDefault();
        const f = e.target;
        if(f.pin.value !== f.pin2.value){ toast('PIN match nahi hua'); return; }
        const salt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
        DATA.vaultMeta = {salt, verifier:null};
        VAULT_KEY = await deriveKey(f.pin.value, salt);
        const v = await vaultEncrypt({check:'ok'});
        DATA.vaultMeta.verifier = v;
        saveData(); closeSheet(); toast('Vault ready'); renderRoute();
      });
    });
}
function unlockVault(){
  openSheet(`${sheetHeader('Unlock Vault')}
    <form id="unlockForm">
      <div class="field"><label>Enter PIN</label><input type="password" inputmode="numeric" name="pin" required autofocus></div>
      <button type="submit" class="btn btn-primary btn-block">Unlock</button>
    </form>`, (root)=>{
      $('#unlockForm', root).addEventListener('submit', async (e)=>{
        e.preventDefault();
        const pin = e.target.pin.value;
        try{
          const key = await deriveKey(pin, DATA.vaultMeta.salt);
          VAULT_KEY = key;
          await vaultDecrypt(DATA.vaultMeta.verifier);
          closeSheet(); toast('Vault unlocked'); renderRoute();
        }catch(err){ toast('Ghalat PIN'); VAULT_KEY = null; }
      });
    });
}
function openVaultItemForm(editId){
  if(!VAULT_KEY){ toast('Pehle vault unlock karein'); return; }
  const editItem = editId ? DATA.vaultItems.find(x=>x.id===editId) : null;
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Vault Item')}
    <form id="vForm">
      <div class="field"><label>Label *</label><input type="text" name="label" required placeholder="e.g. CNIC Number"></div>
      <div class="field"><label>Value *</label><textarea name="value" required placeholder="Sensitive value..."></textarea></div>
      <button type="submit" class="btn btn-primary btn-block">Save Encrypted</button>
    </form>`, (root)=>{
      $('#vForm', root).addEventListener('submit', async (e)=>{
        e.preventDefault();
        const f = e.target;
        const enc = await vaultEncrypt({label:f.label.value, value:f.value.value});
        if(editItem) Object.assign(editItem, enc, {label:undefined});
        else DATA.vaultItems.push({id:uid(), ...enc});
        saveData(); closeSheet(); toast('Encrypted & saved'); renderRoute();
      });
    });
}
async function viewVaultItem(id){
  const rec = DATA.vaultItems.find(x=>x.id===id);
  try{
    const plain = await vaultDecrypt(rec);
    openSheet(`${sheetHeader(plain.label)}
      <div class="card" style="background:var(--surface-2);box-shadow:none;word-break:break-word">${escapeHtml(plain.value)}</div>
      <div style="display:flex;gap:10px;margin-top:12px">
        <button class="btn btn-danger" id="delVault">${ICN.trash}</button>
        <button class="btn btn-primary btn-block" onclick="closeSheet()">Close</button>
      </div>`, (root)=>{
        $('#delVault', root).addEventListener('click', ()=>{
          confirmDialog('Delete this vault item?', ()=>{
            DATA.vaultItems = DATA.vaultItems.filter(x=>x.id!==id);
            saveData(); closeSheet(); renderRoute();
          });
        });
      });
  }catch(e){ toast('Decrypt fail — vault re-unlock karein'); VAULT_KEY=null; renderRoute(); }
}
function openEmergencyContactForm(editId){
  const editItem = editId ? DATA.emergencyContacts.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Name', type:'text', required:true, placeholder:'e.g. Family Doctor'},
    {key:'category', label:'Category', type:'select', options:['Family Doctor','Nearby Hospital','Electrician','Plumber','Gas Leakage Helpline','Other']},
    {key:'phone', label:'Phone Number', type:'text', required:true},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Emergency Contact')}
    <form id="ecForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delEC">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div></form>`, (root)=>{
      $('#ecForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        if(editItem) Object.assign(editItem, vals);
        else DATA.emergencyContacts.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem) $('#delEC', root).addEventListener('click', ()=>{
        DATA.emergencyContacts = DATA.emergencyContacts.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
      });
    });
}
function renderVault(){
  let html = '';
  html += `<div class="section-title">Emergency Contacts</div>`;
  html += `<div class="chip-row"><div class="chip active" style="cursor:default">Fast Access</div></div>`;
  if(!DATA.emergencyContacts.length){ html += emptyState('phone','Koi emergency contact nahi','', 'emergencyContacts'); }
  else{
    html += `<div class="card">` + DATA.emergencyContacts.map(c=>`
      <div class="list-item">
        <div class="avatar" style="background:#fee2e2;color:#991b1b">${icon('phone')}</div>
        <div class="meta" onclick="openEmergencyContactForm('${c.id}')"><div class="t">${escapeHtml(c.name)}</div><div class="s">${escapeHtml(c.category)}</div></div>
        <a class="btn btn-sm btn-outline" href="tel:${escapeHtml(c.phone)}">Call</a>
      </div>`).join('') + `</div>`;
  }

  html += `<div class="section-title">Encrypted Document Vault</div>`;
  if(!DATA.vaultMeta){
    html += `<div class="card">
      <div style="text-align:center;padding:10px 0">
        ${icon('lock','#7c3aed')}
        <div style="font-weight:800;margin-top:10px">Vault Locked Setup Required</div>
        <div class="card-sub" style="margin:8px 0 14px">CNIC, IBAN, policy numbers waghera AES-256 encryption ke saath is device par mehfooz rakhein.</div>
        <button class="btn btn-primary" onclick="setupVaultPin()">Create Vault PIN</button>
      </div></div>`;
  } else if(!VAULT_KEY){
    html += `<div class="card">
      <div style="text-align:center;padding:10px 0">
        ${icon('lock','#7c3aed')}
        <div style="font-weight:800;margin-top:10px">Vault is locked</div>
        <button class="btn btn-primary" style="margin-top:12px" onclick="unlockVault()">Unlock</button>
      </div></div>`;
  } else {
    html += !DATA.vaultItems.length ? emptyState('lock','Vault khali hai','', 'vaultItems') :
      `<div class="card">` + DATA.vaultItems.map(v=>`
        <div class="list-item" onclick="viewVaultItem('${v.id}')">
          <div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('lock')}</div>
          <div class="meta"><div class="t">•••• Encrypted Item</div><div class="s">Tap to decrypt &amp; view</div></div>
          ${icon('chevron')}
        </div>`).join('') + `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 20. EVENT / OCCASION BUDGETER
 * ---------------------------------------------------------------------- */
function openEventItemForm(editId){
  if(!DATA.events.length){ toast('Pehle event banayen'); return; }
  const editItem = editId ? DATA.eventItems.find(x=>x.id===editId) : null;
  const fields = [
    {key:'eventId', label:'Event', type:'select', options: DATA.events.map(e=>e.name), required:true},
    {key:'item', label:'Line Item', type:'text', required:true, placeholder:'e.g. Qurbani Animal / Caterer'},
    {key:'vendor', label:'Vendor', type:'text'},
    {key:'amount', label:'Cost (Rs)', type:'number', required:true},
    {key:'advance', label:'Advance Paid (Rs)', type:'number'},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Line Item')}
    <form id="evForm">${fields.map(f=>renderField(f, editItem? (f.key==='eventId'? (DATA.events.find(e=>e.id===editItem.eventId)||{}).name : editItem[f.key]) : '')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delEV">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div></form>`, (root)=>{
      $('#evForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const vals = readForm(e.target, fields);
        const ev = DATA.events.find(x=>x.name===vals.eventId);
        vals.eventId = ev? ev.id : null;
        if(editItem) Object.assign(editItem, vals);
        else DATA.eventItems.push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem) $('#delEV', root).addEventListener('click', ()=>{
        DATA.eventItems = DATA.eventItems.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
      });
    });
}
function renderEvents(){
  if(!DATA.events.length){ $('#viewRoot').innerHTML = emptyState('calendarheart','Koi event nahi','Naya event banayen', 'events-picker'); return; }
  let html = `<div class="card">` + DATA.events.map(ev=>{
    const spend = DATA.eventItems.filter(i=>i.eventId===ev.id).reduce((s,i)=>s+Number(i.amount||0),0);
    const pct = ev.budget? Math.min(100, Math.round(spend/ev.budget*100)) : 0;
    const level = pct>90?'red':pct>=70?'amber':'green';
    return `<div style="padding:10px 0;border-bottom:1px solid var(--border)" onclick="openGenericForm('events','${ev.id}')">
      <div class="card-row" style="justify-content:space-between;margin-bottom:8px">
        <div><div class="card-title">${escapeHtml(ev.name)}</div><div class="card-sub">${fmtDate(ev.date)}</div></div>
        <div class="badge ${level}">${pct}%</div>
      </div>
      <div class="progress ${level}"><div style="width:${pct}%"></div></div>
      <div class="card-sub" style="margin-top:6px">${fmtMoney(spend)} of ${fmtMoney(ev.budget)}</div>
    </div>`;
  }).join('') + `</div>`;

  html += `<div class="section-title">Line Items</div>`;
  const items = DATA.eventItems.slice().reverse();
  html += items.length ? `<div class="card">` + items.map(i=>{
    const ev = DATA.events.find(e=>e.id===i.eventId);
    return `<div class="list-item" onclick="openEventItemForm('${i.id}')">
      <div class="avatar" style="background:#fce7f3;color:#db2777">${icon('calendarheart')}</div>
      <div class="meta"><div class="t">${escapeHtml(i.item)}</div><div class="s">${ev?escapeHtml(ev.name):''} · ${escapeHtml(i.vendor||'')}</div></div>
      <div class="amt">${fmtMoney(i.amount)}</div>
    </div>`;
  }).join('') + `</div>` : emptyState('calendarheart','Koi line item nahi','');
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 21. SAVINGS GOALS & TARGET VAULT
 * ---------------------------------------------------------------------- */
function openGoalTxForm(goalId){
  openSheet(`${sheetHeader('Add Savings')}
    <form id="gtForm">
      <div class="field"><label>Amount Saved (Rs) *</label><input type="number" name="amount" required></div>
      <div class="field"><label>Date</label><input type="date" name="date" value="${todayISO()}"></div>
      <button type="submit" class="btn btn-primary btn-block">Add</button>
    </form>`, (root)=>{
      $('#gtForm', root).addEventListener('submit', e=>{
        e.preventDefault();
        const f = e.target;
        const g = DATA.goals.find(x=>x.id===goalId);
        g.saved = Number(g.saved||0) + Number(f.amount.value);
        DATA.goalTx.push({id:uid(), goalId, amount:Number(f.amount.value), date:f.date.value});
        saveData(); closeSheet(); toast('Savings added'); renderRoute();
      });
    });
}
function ringSvg(pct, color){
  const r = 36, c = 2*Math.PI*r;
  const off = c - (Math.min(100,pct)/100)*c;
  return `<div class="ring-wrap">
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="8"/>
      <circle cx="44" cy="44" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
    </svg>
    <div class="ring-label">${pct}%</div>
  </div>`;
}
function renderGoals(){
  if(!DATA.goals.length){ $('#viewRoot').innerHTML = emptyState('target','Koi savings goal nahi','Naya target banayen', 'goals'); return; }
  let html = DATA.goals.map(g=>{
    const pct = g.target? Math.min(100, Math.round(Number(g.saved||0)/g.target*100)) : 0;
    const d = daysUntil(g.targetDate);
    return `<div class="card card-row" style="align-items:center;gap:16px">
      ${ringSvg(pct, '#0891b2')}
      <div style="flex:1">
        <div class="card-title" onclick="openGenericForm('goals','${g.id}')" style="cursor:pointer">${escapeHtml(g.name)}</div>
        <div class="card-sub">${fmtMoney(g.saved)} of ${fmtMoney(g.target)}</div>
        ${d!==null?`<div class="card-sub">${d>=0?d+' days left':'Target date passed'}</div>`:''}
        <button class="btn btn-sm btn-primary" style="margin-top:8px" onclick="openGoalTxForm('${g.id}')">+ Add Savings</button>
      </div>
    </div>`;
  }).join('');
  $('#viewRoot').innerHTML = html;
}

/* ---------------------------------------------------------------------- *
 * 22. SETTINGS, BACKUP & DATA SECURITY
 * ---------------------------------------------------------------------- */
function exportJSON(){
  downloadFile(`gharsaz360-backup-${todayISO()}.json`, JSON.stringify(DATA, null, 2), 'application/json');
}
function exportCSV(){
  const rows = [['Type','Date','Category/Name','Amount','Notes']];
  DATA.expenses.forEach(e=>rows.push(['Expense', e.date, `${e.category} / ${e.subcategory}`, e.amount, e.note||'']));
  DATA.incomes.forEach(i=>rows.push(['Income', i.date, i.source, i.amount, i.notes||'']));
  DATA.rentPayments.forEach(p=>{
    const t = DATA.tenants.find(x=>x.id===p.tenantId);
    rows.push(['Rent', p.month, t?t.name:'', p.amount, p.status]);
  });
  DATA.udharTx.forEach(t=>{
    const u = DATA.udhars.find(x=>x.id===t.udharId);
    rows.push(['Udhar-'+t.type, t.date, u?u.name:'', t.amount, t.note||'']);
  });
  DATA.materials.forEach(m=>rows.push(['Construction Material', m.date, m.item, m.amount, m.vendor||'']));
  DATA.charityRecords.forEach(c=>rows.push(['Charity', c.date, c.type, c.amount, c.recipient||'']));
  const csv = rows.map(r=>r.map(csvEscape).join(',')).join('\n');
  downloadFile(`gharsaz360-export-${todayISO()}.csv`, csv, 'text/csv');
}
function restoreFromJSON(jsonText){
  try{
    const parsed = JSON.parse(jsonText);
    if(typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
    DATA = Object.assign(defaultState(), parsed);
    saveData(); toast('Data imported successfully'); renderRoute();
    return true;
  }catch(err){
    toast('Invalid backup data');
    return false;
  }
}
function importJSON(file){
  const reader = new FileReader();
  reader.onload = (e)=> restoreFromJSON(e.target.result);
  reader.readAsText(file);
}
function openPasteRestore(){
  openSheet(`${sheetHeader('Paste Backup to Restore')}
    <div class="help-text" style="margin-bottom:10px">Agar aapke paas file ki bajaye copy-kiya hua JSON backup text hai, to yahan paste karein.</div>
    <textarea id="pasteArea" placeholder="Yahan JSON backup paste karein..." style="width:100%;min-height:220px;font-family:monospace;font-size:12px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface-2)"></textarea>
    <button class="btn btn-primary btn-block" style="margin-top:12px" id="pasteRestoreBtn">Restore From Pasted Text</button>`,
    (root)=>{
      $('#pasteRestoreBtn', root).addEventListener('click', ()=>{
        const text = $('#pasteArea', root).value.trim();
        if(!text){ toast('Pehle backup text paste karein'); return; }
        confirmDialog('Ye mojooda data ko overwrite kar dega. Aage badhein?', ()=>{
          if(restoreFromJSON(text)) closeSheet();
        });
      });
    });
}
function wipeAllData(){
  confirmDialog('Yeh permanent hai — sab data delete ho jayega. Pakka?', ()=>{
    confirmDialog('Aakhri tasdeeq: Sab kuch delete karna hai?', ()=>{
      DATA = defaultState(); VAULT_KEY = null; saveData(); toast('All data cleared'); renderRoute();
    });
  });
}
function renderSettings(){
  const dataSize = new Blob([JSON.stringify(DATA)]).size;
  const hasBridge = !!(window.AndroidBridge && typeof window.AndroidBridge.saveFile === 'function');
  const bridgeStatus = hasBridge
    ? `<div class="badge green">Connected</div>`
    : `<div class="badge amber">Not Connected (using web fallback)</div>`;
  let isLive = null;
  if(hasBridge && typeof window.AndroidBridge.isLiveMode === 'function'){
    try{ isLive = window.AndroidBridge.isLiveMode(); }catch(e){}
  }
  let html = `
  <div class="card">
    <div class="card-title">Storage Used</div>
    <div class="card-sub" style="margin-top:4px">${(dataSize/1024).toFixed(1)} KB stored locally on this device — nothing leaves your phone.</div>
  </div>

  <div class="card card-row" style="justify-content:space-between">
    <div>
      <div class="card-title">Native Android Bridge</div>
      <div class="card-sub" style="margin-top:2px">${hasBridge ? 'File save/import Android code se ho raha hai (sab se pukhta).' : 'MainActivity.kt bridge detect nahi hui — download/import web-fallback (Share/Copy) se ho rahe hain.'}</div>
    </div>
    ${bridgeStatus}
  </div>
  ${isLive!==null?`
  <div class="card card-row" style="justify-content:space-between">
    <div>
      <div class="card-title">Connection Mode</div>
      <div class="card-sub" style="margin-top:2px">${isLive ? 'Live website se chal rahi hai — updates turant milte hain.' : 'Internet nahi hai — offline bundled copy se chal rahi hai.'}</div>
    </div>
    <div class="badge ${isLive?'green':'amber'}">${isLive?'Live':'Offline'}</div>
  </div>`:''}

  <div class="section-title">${t('backupRestore')}</div>
  <div class="card">
    <button class="btn btn-outline btn-block" id="checkUpdatesBtn">${ICN.refresh} Check for Updates / Refresh App</button>
    <div class="help-text">Ya app ke andar sab se upar se neeche ki taraf swipe (pull-to-refresh) karein.</div>
    <div class="divider"></div>
    <button class="btn btn-primary btn-block" onclick="exportJSON()">${ICN.down} Export JSON Backup</button>
    <div style="height:10px"></div>
    <button class="btn btn-outline btn-block" id="copyBackupBtn">Copy Backup as Text (Guaranteed)</button>
    <div style="height:10px"></div>
    <button class="btn btn-outline btn-block" onclick="exportCSV()">${ICN.down} Export CSV</button>
    <div style="height:10px"></div>
    <button class="btn btn-ghost btn-block" id="importFileBtn">${ICN.up} Import JSON Backup (File)</button>
    <input type="file" accept="application/json" style="display:none" id="importFile">
    <div style="height:10px"></div>
    <button class="btn btn-outline btn-block" id="pasteRestoreOpenBtn">Paste Backup Text to Restore</button>
    <div class="help-text">Import se pehle current data ka backup zaroor le lein — import mojooda data ko overwrite karta hai.</div>
  </div>

  <div class="section-title">Google Drive Sync</div>
  <div class="card">
    <div class="card-sub">Google Drive API se personal backup sync karne ka feature is version mein shamil nahi hai. Iske ilawa aap "Export JSON Backup" istemal kar ke apna data manually kahin bhi (Google Drive, WhatsApp, Email) save/share kar sakte hain — koi bhi data external server ko nahi jata.</div>
  </div>

  <div class="section-title">${t('appearance')}</div>
  <div class="card card-row" style="justify-content:space-between">
    <div class="card-title">${t('darkMode')}</div>
    <button class="btn btn-sm btn-outline" id="toggleThemeSettings">${document.documentElement.classList.contains('dark')?'Switch to Light':'Switch to Dark'}</button>
  </div>
  <div class="card">
    <div class="field" style="margin-bottom:12px">
      <label>${t('currency')}</label>
      <select id="currencySelect">
        ${Object.entries(CURRENCIES).map(([code,c])=>`<option value="${code}" ${SETTINGS.currency===code?'selected':''}>${c.symbol} — ${c.name} (${code})</option>`).join('')}
      </select>
    </div>
    <div class="field" style="margin-bottom:0">
      <label>${t('language')}</label>
      <select id="languageSelect">
        ${Object.entries(LANGUAGES).map(([code,l])=>`<option value="${code}" ${SETTINGS.language===code?'selected':''}>${l.native} (${l.name})</option>`).join('')}
      </select>
    </div>
  </div>

  <div class="section-title">${t('support')}</div>
  <div class="card">
    <button class="btn btn-block" style="background:#25D366;color:#fff" onclick="openWhatsAppChatPanel()">${ICN.wa} Contact Developer on WhatsApp</button>
    <div style="height:10px"></div>
    <button class="btn btn-outline btn-block" id="shareAppBtn">${ICN.repeat} Share This App</button>
  </div>

  <div class="section-title">${t('dangerZone')}</div>
  <div class="card">
    <button class="btn btn-danger btn-block" onclick="wipeAllData()">${ICN.trash} Erase All App Data</button>
  </div>

  <div style="text-align:center;margin-top:24px;font-size:11px;color:var(--text-dim)">
    GharSaz 360 · v1.0 · 100% Offline · <a href="privacy-policy.html" target="_blank" style="text-decoration:underline">Privacy Policy</a>
  </div>`;
  $('#viewRoot').innerHTML = html;
// Called by the native Android bridge (see MainActivity.kt) after the
// user picks a file through the native file chooser — used as a more
// reliable alternative to the HTML <input type="file"> picker, which
// needs WebChromeClient.onShowFileChooser implemented natively to work
// inside a WebView at all.
window.onNativeFilePicked = function(content){
  restoreFromJSON(content);
};
function importJSONFile(){
  if(window.AndroidBridge && typeof window.AndroidBridge.pickJSONFile === 'function'){
    window.AndroidBridge.pickJSONFile();
    return;
  }
  $('#importFile').click();
}
  $('#pasteRestoreOpenBtn').addEventListener('click', openPasteRestore);
  $('#importFileBtn').addEventListener('click', importJSONFile);
  $('#importFile').addEventListener('change', (e)=>{ if(e.target.files[0]) importJSON(e.target.files[0]); });
  $('#copyBackupBtn').addEventListener('click', async ()=>{
    const text = JSON.stringify(DATA, null, 2);
    const ok = await copyTextUniversal(text);
    if(ok) toast('Backup clipboard par copy ho gaya — kahin bhi paste kar ke mehfooz rakh lein');
    else showCopyFallback(`gharsaz360-backup-${todayISO()}`, text);
  });
  $('#toggleThemeSettings').addEventListener('click', toggleTheme);
  $('#currencySelect').addEventListener('change', (e)=>{
    SETTINGS.currency = e.target.value; saveSettings(); toast('Currency updated'); renderRoute();
  });
  $('#languageSelect').addEventListener('change', (e)=>{
    SETTINGS.language = e.target.value; saveSettings(); toast('Language updated'); renderRoute();
  });
  $('#checkUpdatesBtn').addEventListener('click', doRefresh);
  $('#shareAppBtn').addEventListener('click', shareApp);
}

/* ---------------------------------------------------------------------- *
 * 23. THEME / WHATSAPP FAB / ROUTER DISPATCH
 * ---------------------------------------------------------------------- */
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle('dark');
  SETTINGS.theme = isDark ? 'dark' : 'light';
  saveSettings();
  renderRoute();
}
function openWhatsAppSupport(){
  const msg = encodeURIComponent('Hello, I need assistance with GharSaz 360 App');
  window.open(`https://wa.me/${SETTINGS.whatsapp.replace(/\D/g,'')}?text=${msg}`, '_blank');
}
function openWhatsAppChatPanel(){
  openSheet(`
    <div style="background:linear-gradient(135deg,#128C7E,#25D366);margin:-10px -18px 0;padding:20px 20px 16px;border-radius:24px 24px 0 0;color:#fff">
      <div style="display:flex;align-items:center;gap:12px">
        <div style="width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex:none">${icon('wa')}</div>
        <div>
          <div style="font-weight:800;font-size:15px">GharSaz 360 Support</div>
          <div style="font-size:12px;opacity:.9;display:flex;align-items:center;gap:5px"><span style="width:7px;height:7px;border-radius:50%;background:#a7f3d0;display:inline-block"></span> Typically replies quickly</div>
        </div>
      </div>
    </div>
    <div style="padding:20px 4px 4px">
      <div style="display:flex;gap:8px;align-items:flex-end;margin-bottom:18px">
        <div style="width:30px;height:30px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;flex:none;color:#fff">${icon('wa')}</div>
        <div style="background:var(--surface-2);padding:12px 14px;border-radius:16px 16px 16px 4px;font-size:13.5px;max-width:82%;line-height:1.5">
          Assalam-o-Alaikum! 👋 GharSaz 360 mein kisi bhi masle, sawal, ya suggestion ke liye humein WhatsApp par message karein — hum jald jawab dene ki koshish karte hain.
        </div>
      </div>
      <button class="btn btn-block" style="background:#25D366;color:#fff" id="startChatBtn">${ICN.wa} Start Chat on WhatsApp</button>
    </div>`,
    (root)=>{
      $('#startChatBtn', root).addEventListener('click', ()=>{
        closeSheet();
        openWhatsAppSupport();
      });
    });
}
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.digitalspot.gharsaz360';
function getShareUrl(){
  // Prefer the native bridge (single source of truth on the Android
  // side), fall back to the hardcoded Play Store link. Never share the
  // internal file:// or GitHub Pages URL — nobody should see that.
  if(window.AndroidBridge && typeof window.AndroidBridge.getPlayStoreUrl === 'function'){
    try{ const u = window.AndroidBridge.getPlayStoreUrl(); if(u) return u; }catch(e){}
  }
  return PLAY_STORE_URL;
}
async function shareApp(){
  const url = getShareUrl();
  const text = 'GharSaz 360 — Smart Home, Property & Life Suite. Ek behtareen offline app ghar, property, aur rozmara zindagi manage karne ke liye!';
  try{
    if(window.AndroidBridge && typeof window.AndroidBridge.shareText === 'function'){
      window.AndroidBridge.shareText(`${text}\n${url}`);
      return;
    }
  }catch(e){ console.warn('Native share failed:', e); }
  try{
    if(navigator.share){
      await navigator.share({title:'GharSaz 360', text, url});
      return;
    }
  }catch(e){ if(e && e.name==='AbortError') return; }
  const ok = await copyTextUniversal(`${text}\n${url}`);
  if(ok) toast('Link copy ho gaya — kahin bhi paste kar dein');
  else toast('Share available nahi is app mein');
}

const ROUTE_RENDERERS = {
  dashboard: renderDashboard,
  budgets: renderBudgets,
  expenses: renderExpenses,
  rent: renderRent,
  udhar: renderUdhar,
  construction: renderConstruction,
  salary: renderSalary,
  labour: renderLabour,
  todos: renderTodos, bills: renderBills, familyMembers: renderFamily,
  loans: renderLoans, subscriptions: renderSubscriptions,
  insurancePolicies: renderInsurance, healthRecords: renderHealth,
  importantDates: renderImportantDates,
  assets: renderAssets,
  maintenance: renderMaintenance,
  vehicle: renderVehicle,
  zakat: renderZakat,
  solar: renderSolar,
  pantry: renderPantry,
  vault: renderVault,
  events: renderEvents,
  goals: renderGoals,
  settings: renderSettings,
  more: ()=>{ $('#viewRoot').innerHTML = moreGrid(); },
};
function renderRoute(){
  const knownRoutes = Object.keys(ROUTE_RENDERERS);
  if(!knownRoutes.includes(ROUTE)){
    renderTopbarSafe();
    renderBottomNav();
    $('#fabAdd').style.display = 'none';
    renderNotFound();
    return;
  }
  renderTopbar();
  renderBottomNav();
  renderFab();
  const fn = ROUTE_RENDERERS[ROUTE] || renderDashboard;
  try{
    fn();
  }catch(e){
    console.error('Render error on route', ROUTE, e);
    showErrorScreen('Ye Page Load Nahi Ho Saka', 'Is section ko dikhane mein masla aa raha hai. "Reload App" dabayen ya Home par wapis jayen.');
  }
}
function renderTopbarSafe(){
  $('#pageTitle').textContent = 'Page Not Found';
  $('#pageSub').textContent = '';
  $('#pdfBtn').style.display = 'none';
}

/* ---------------------------------------------------------------------- *
 * 24. APP INIT — splash screen, theme, service worker
 * ---------------------------------------------------------------------- */
function initTheme(){
  if(SETTINGS.theme==='dark') document.documentElement.classList.add('dark');
}
function initTopbarButtons(){
  $('#menuBtn').innerHTML = ICN.menu;
  $('#menuBtn').addEventListener('click', ()=>navigate('more'));
  $('#pdfBtn').innerHTML = ICN.print;
  $('#pdfBtn').addEventListener('click', exportPDF);
  $('#settingsBtn').innerHTML = ICN.settings;
  $('#settingsBtn').addEventListener('click', ()=>navigate('settings'));
  $('#themeBtn').innerHTML = document.documentElement.classList.contains('dark') ? ICN.sun : ICN.moon;
  $('#themeBtn').addEventListener('click', ()=>{
    toggleTheme();
    $('#themeBtn').innerHTML = document.documentElement.classList.contains('dark') ? ICN.sun : ICN.moon;
  });
  $('#fabAdd').innerHTML = ICN.plus;
  $('#fabWa').innerHTML = ICN.wa;
  $('#fabWa').addEventListener('click', openWhatsAppChatPanel);
}
function initApp(){
  try{
    initTheme();
    initTopbarButtons();
    initPullToRefresh();
    const initialRoute = location.hash.replace('#','');
    ROUTE = ALL_MODULES.some(m=>m.id===initialRoute) ? initialRoute : 'dashboard';
    renderRoute();
    $('#app').classList.add('ready');

    setTimeout(()=>{
      $('#splash').classList.add('hide');
      setTimeout(()=>$('#splash').remove(), 700);
    }, 3000);
  }catch(e){
    console.error('App failed to start:', e);
    $('#splash').classList.add('hide');
    $('#app').classList.add('ready');
    showErrorScreen('App Start Nahi Ho Saki', 'Kuch technical masla aa gaya hai. Browser ko update karein ya doosra browser (Chrome recommended) try karein.');
  }
}
document.addEventListener('DOMContentLoaded', initApp);

/* ---------------------------------------------------------------------- *
 * PULL TO REFRESH — swipe down from the top of the app to refresh.
 * Clears any cached service-worker files (so hosted GitHub Pages users
 * actually receive updates) and reloads the app. On the standalone
 * file:// build there's no service worker/cache to clear, so this simply
 * reloads the page, which is harmless — all data stays in localStorage.
 * ---------------------------------------------------------------------- */
function initPullToRefresh(){
  const indicator = $('#pullIndicator');
  if(!indicator) return;
  const THRESHOLD = 68;
  const MAX_PULL = 105;
  let startY = 0, pulling = false, currentPull = 0, refreshing = false;

  function resetIndicator(){
    indicator.style.transform = 'translate(-50%, -60px) rotate(0deg)';
    indicator.classList.remove('visible');
  }
  function onTouchStart(e){
    if(refreshing) return;
    if(window.scrollY > 0) return;
    if($('#overlay').classList.contains('show')) return; // don't fight with open modal sheets
    startY = e.touches[0].clientY;
    pulling = true;
    currentPull = 0;
  }
  function onTouchMove(e){
    if(!pulling || refreshing) return;
    const dy = e.touches[0].clientY - startY;
    if(dy <= 0 || window.scrollY > 0){ resetIndicator(); pulling = false; return; }
    currentPull = Math.min(MAX_PULL, dy * 0.5);
    const translateY = -60 + currentPull;
    indicator.style.transform = `translate(-50%, ${translateY}px) rotate(${currentPull*3}deg)`;
    indicator.classList.add('visible');
    if(currentPull > 8) e.preventDefault();
  }
  function onTouchEnd(){
    if(!pulling || refreshing) return;
    pulling = false;
    if(currentPull >= THRESHOLD) triggerRefresh();
    else resetIndicator();
    currentPull = 0;
  }
  document.addEventListener('touchstart', onTouchStart, {passive:true});
  document.addEventListener('touchmove', onTouchMove, {passive:false});
  document.addEventListener('touchend', onTouchEnd, {passive:true});

  function triggerRefresh(){
    refreshing = true;
    indicator.style.transform = 'translate(-50%, 16px) rotate(0deg)';
    indicator.classList.add('visible', 'spinning');
    doRefresh();
  }
}
async function doRefresh(){
  // Native bridge (Android app): checks connectivity itself and either
  // reloads the LIVE site or the offline copy, whichever is right.
  if(window.AndroidBridge && typeof window.AndroidBridge.refreshFromServer === 'function'){
    toast('App refresh ho rahi hai...');
    try{ window.AndroidBridge.refreshFromServer(); return; }
    catch(e){ console.warn('Native refresh failed, falling back:', e); }
  }
  toast('App refresh ho rahi hai...');
  try{
    if('serviceWorker' in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      for(const reg of regs){ await reg.update(); }
    }
    if('caches' in window){
      const keys = await caches.keys();
      await Promise.all(keys.map(k=>caches.delete(k)));
    }
  }catch(e){ console.warn('Refresh cache-clear failed:', e); }
  setTimeout(()=>{ location.reload(); }, 350);
}

/* Register service worker for offline caching (GitHub Pages / TWA ready).
   Skipped automatically on file:// (standalone single-file usage) since
   service workers cannot run outside http/https origins. */
if('serviceWorker' in navigator && (location.protocol==='https:' || location.protocol==='http:')){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW registration failed:', err));
  });
}

/* ---------------------------------------------------------------------- *
 * 25. PDF EXPORT (native browser print-to-PDF — no external library,
 *     works fully offline on every device that has a print/share sheet)
 * ---------------------------------------------------------------------- */
function pdfSection(title, headers, rows){
  const cleanRows = rows.map(r => r.map(c => c===undefined||c===null ? '' : String(c)));
  return {title, headers, rows: cleanRows};
}
function getPrintData(route){
  switch(route){
    case 'budgets':
      return { title:'Budgets & Income Report',
        summary:[
          {label:'Total Estimated', value:fmtMoney(DATA.budgets.reduce((s,b)=>s+Number(b.estimated||0),0)), color:'#0d9488'},
          {label:'Total Spent', value:fmtMoney(DATA.budgets.reduce((s,b)=>s+budgetSpent(b),0)), color:'#dc2626'},
          {label:'Total Income', value:fmtMoney(DATA.incomes.reduce((s,i)=>s+Number(i.amount||0),0)), color:'#059669'},
        ],
        sections: [
        pdfSection('Budgets', ['Name','Category','Period','Estimated','Spent'],
          DATA.budgets.map(b=>[b.name,b.category,b.period,fmtMoney(b.estimated),fmtMoney(budgetSpent(b))])),
        pdfSection('Income', ['Source','Date','Amount','Notes'],
          DATA.incomes.map(i=>[i.source,fmtDate(i.date),fmtMoney(i.amount),i.notes||''])),
      ]};
    case 'expenses': {
      const totalExp = DATA.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
      const totalInc = DATA.incomes.reduce((s,i)=>s+Number(i.amount||0),0);
      const net = totalInc - totalExp;
      return { title:'Expense Report',
        summary:[
          {label:'Total Income', value:fmtMoney(totalInc), color:'#059669'},
          {label:'Total Expense', value:fmtMoney(totalExp), color:'#dc2626'},
          {label: net>=0?'Net Savings':'Net Loss', value:fmtMoney(Math.abs(net)), color: net>=0?'#059669':'#dc2626'},
        ],
        sections: [
        pdfSection('All Expenses', ['Date','Category','Sub-category','Amount','Note'],
          DATA.expenses.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''))
            .map(e=>[fmtDate(e.date),e.category,e.subcategory,fmtMoney(e.amount),e.note||''])),
      ]};
    }
    case 'rent': {
      const totalRent = DATA.rentPayments.reduce((s,p)=>s+Number(p.amount||0),0);
      const paidRent = DATA.rentPayments.filter(p=>p.status==='Paid').reduce((s,p)=>s+Number(p.amount||0),0);
      const pendingRent = totalRent - paidRent;
      return { title:'House Rent Report',
        summary:[
          {label:'Total Rent Recorded', value:fmtMoney(totalRent), color:'#0369a1'},
          {label:'Collected (Paid)', value:fmtMoney(paidRent), color:'#059669'},
          {label:'Pending', value:fmtMoney(pendingRent), color: pendingRent>0?'#dc2626':'#059669'},
        ],
        sections: [
        pdfSection('Properties', ['Name','Type','Address'],
          DATA.properties.map(p=>[p.name,p.type||'',p.address||''])),
        pdfSection('Tenants', ['Name','Property','Phone','Monthly Rent','Security Deposit'],
          DATA.tenants.map(t=>{
            const p = DATA.properties.find(x=>x.id===t.propertyId);
            return [t.name, p?p.name:'', t.phone||'', fmtMoney(t.monthlyRent), fmtMoney(t.securityDeposit)];
          })),
        pdfSection('Rent Payments', ['Tenant','Month','Amount','Status'],
          sortByDateDesc(DATA.rentPayments, 'month').map(pay=>{
            const t = DATA.tenants.find(x=>x.id===pay.tenantId);
            return [t?t.name:'', pay.month, fmtMoney(pay.amount), pay.status];
          })),
      ]};
    }
    case 'udhar': {
      const totalReceivable = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
      const totalPayable = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
      const net = totalReceivable - totalPayable;
      return { title:'Udhar Khata Ledger',
        summary:[
          {label:'Total Receivable', value:fmtMoney(totalReceivable), color:'#059669'},
          {label:'Total Payable', value:fmtMoney(totalPayable), color:'#dc2626'},
          {label:'Net Position', value:fmtMoney(Math.abs(net)), color: net>=0?'#059669':'#dc2626'},
        ],
        sections: [
        pdfSection('Contacts & Balance', ['Name','Phone','Balance'],
          DATA.udhars.map(u=>{
            const bal = udharBalance(u);
            return [u.name, u.phone||'', bal===0?'Settled':(bal>0?fmtMoney(bal)+' receivable':fmtMoney(-bal)+' payable')];
          })),
        pdfSection('All Transactions', ['Contact','Type','Amount','Date','Status'],
          sortByDateDesc(DATA.udharTx, 'date').map(t=>{
            const u = DATA.udhars.find(x=>x.id===t.udharId);
            return [u?u.name:'', t.type, fmtMoney(t.amount), fmtDate(t.date), t.status];
          })),
      ]};
    }
    case 'todos':
      return { title:'To-Do / Task Report', sections: [
        pdfSection('Tasks', ['Title','Category','Due Date','Priority','Status'],
          DATA.todos.map(t=>[t.title,t.category||'',fmtDate(t.dueDate),t.priority||'',t.status||''])),
      ]};
    case 'bills': {
      const unpaidTotal = DATA.bills.filter(b=>b.status!=='Paid').reduce((s,b)=>s+Number(b.amount||0),0);
      const paidTotal = DATA.bills.filter(b=>b.status==='Paid').reduce((s,b)=>s+Number(b.amount||0),0);
      return { title:'Bill Reminders Report',
        summary:[
          {label:'Unpaid Total', value:fmtMoney(unpaidTotal), color: unpaidTotal>0?'#dc2626':'#059669'},
          {label:'Paid Total', value:fmtMoney(paidTotal), color:'#059669'},
        ],
        sections: [
        pdfSection('Bills', ['Name','Amount','Due Date','Recurring','Status'],
          DATA.bills.map(b=>[b.name,fmtMoney(b.amount),fmtDate(b.dueDate),b.recurring||'',b.status||''])),
      ]};
    }
    case 'familyMembers':
      return { title:'Family Members', sections: [
        pdfSection('Members', ['Name','Relation','DOB','Blood Group','CNIC','Phone'],
          DATA.familyMembers.map(m=>[m.name,m.relation||'',fmtDate(m.dob),m.bloodGroup||'',m.cnic||'',m.phone||''])),
      ]};
    case 'loans': {
      const totalPrincipal = DATA.loans.reduce((s,l)=>s+Number(l.principal||0),0);
      const totalRemaining = DATA.loans.reduce((s,l)=>s+Number(l.remaining!==undefined?l.remaining:l.principal||0),0);
      const totalPaid = totalPrincipal - totalRemaining;
      return { title:'Loan / EMI Report',
        summary:[
          {label:'Total Borrowed', value:fmtMoney(totalPrincipal), color:'#1d4ed8'},
          {label:'Paid So Far', value:fmtMoney(totalPaid), color:'#059669'},
          {label:'Remaining', value:fmtMoney(totalRemaining), color: totalRemaining>0?'#dc2626':'#059669'},
        ],
        sections: [
        pdfSection('Loans', ['Name','Lender','Principal','Monthly EMI','Remaining','Next Due'],
          DATA.loans.map(l=>[l.name,l.lender||'',fmtMoney(l.principal),fmtMoney(l.monthlyEMI),fmtMoney(l.remaining!==undefined?l.remaining:l.principal),fmtDate(l.nextDueDate)])),
      ]};
    }
    case 'subscriptions': {
      const activeSubs = DATA.subscriptions.filter(s=>s.status!=='Cancelled');
      const monthlyTotal = activeSubs.reduce((s,x)=>s+Number(x.amount||0)/(x.billingCycle==='Yearly'?12:1),0);
      return { title:'Subscriptions Report',
        summary:[
          {label:'Active Subscriptions', value:String(activeSubs.length), color:'#7c3aed'},
          {label:'Est. Monthly Cost', value:fmtMoney(monthlyTotal), color:'#dc2626'},
          {label:'Est. Yearly Cost', value:fmtMoney(monthlyTotal*12), color:'#dc2626'},
        ],
        sections: [
        pdfSection('Subscriptions', ['Name','Category','Amount','Cycle','Next Renewal','Status'],
          DATA.subscriptions.map(s=>[s.name,s.category||'',fmtMoney(s.amount),s.billingCycle||'',fmtDate(s.nextRenewalDate),s.status||''])),
      ]};
    }
    case 'insurancePolicies': {
      const totalPremium = DATA.insurancePolicies.reduce((s,p)=>s+Number(p.premiumAmount||0),0);
      const totalCoverage = DATA.insurancePolicies.reduce((s,p)=>s+Number(p.coverageAmount||0),0);
      return { title:'Insurance Policies Report',
        summary:[
          {label:'Total Premium', value:fmtMoney(totalPremium), color:'#0369a1'},
          {label:'Total Coverage', value:fmtMoney(totalCoverage), color:'#059669'},
        ],
        sections: [
        pdfSection('Policies', ['Type','Provider','Policy #','Premium','Coverage','Expiry'],
          DATA.insurancePolicies.map(p=>[p.type,p.provider||'',p.policyNumber||'',fmtMoney(p.premiumAmount),fmtMoney(p.coverageAmount),fmtDate(p.expiryDate)])),
      ]};
    }
    case 'healthRecords':
      return { title:'Health Records Report', sections: [
        pdfSection('Records', ['Member','Type','Doctor','Date','Next Appointment'],
          DATA.healthRecords.map(r=>[r.memberName||'',r.recordType||'',r.doctor||'',fmtDate(r.date),fmtDate(r.nextAppointment)])),
      ]};
    case 'importantDates':
      return { title:'Important Dates Report', sections: [
        pdfSection('Dates', ['Title','Type','Date','Notes'],
          DATA.importantDates.map(e=>[e.title,e.type||'',fmtDate(e.date),e.notes||''])),
      ]};
    case 'labour': {
      const totalGross = DATA.labourPayments.reduce((s,p)=>s+Number(p.gross||0),0);
      const totalNet = DATA.labourPayments.reduce((s,p)=>s+Number(p.net||0),0);
      const outstandingAdv = DATA.labourAdvances.filter(a=>!a.settled).reduce((s,a)=>s+Number(a.amount||0),0);
      return { title:'Labour Management Report',
        summary:[
          {label:'Total Paid Out', value:fmtMoney(totalNet), color:'#c2410c'},
          {label:'Advances Outstanding', value:fmtMoney(outstandingAdv), color: outstandingAdv>0?'#dc2626':'#059669'},
        ],
        sections: [
        pdfSection('Workers', ['Name','Role','Wage Type','Rate','Status'],
          DATA.labourWorkers.map(w=>[w.name,w.role||'',w.wageType,fmtMoney(w.wageRate),w.status||''])),
        pdfSection('Advances', ['Worker','Amount','Date','Settled'],
          sortByDateDesc(DATA.labourAdvances, 'date').map(a=>{
            const w = DATA.labourWorkers.find(x=>x.id===a.workerId);
            return [w?w.name:'', fmtMoney(a.amount), fmtDate(a.date), a.settled?'Yes':'No'];
          })),
        pdfSection('Payments', ['Worker','Period','Gross','Advance Deducted','Net','Status'],
          sortByDateDesc(DATA.labourPayments, 'paymentDate').map(p=>{
            const w = DATA.labourWorkers.find(x=>x.id===p.workerId);
            return [w?w.name:'', p.period, fmtMoney(p.gross), fmtMoney(p.advanceDeduction), fmtMoney(p.net), p.status];
          })),
      ]};
    }
    case 'salary': {
      const activeEmp = DATA.employees.filter(e=>e.status!=='Inactive');
      const totalPayroll = activeEmp.reduce((s,e)=>s+Number(e.monthlySalary||0),0);
      const outstandingAdv = DATA.salaryAdvances.filter(a=>!a.settled).reduce((s,a)=>s+Number(a.amount||0),0);
      return { title:'Salary Management Report',
        summary:[
          {label:'Monthly Payroll', value:fmtMoney(totalPayroll), color:'#4f46e5'},
          {label:'Advances Outstanding', value:fmtMoney(outstandingAdv), color: outstandingAdv>0?'#dc2626':'#059669'},
        ],
        sections: [
        pdfSection('Employees', ['Name','Designation','Phone','Monthly Salary','Status'],
          DATA.employees.map(e=>[e.name,e.designation||'',e.phone||'',fmtMoney(e.monthlySalary),e.status||'Active'])),
        pdfSection('Advances / Loans', ['Employee','Amount','Date','Settled'],
          sortByDateDesc(DATA.salaryAdvances, 'date').map(a=>{
            const emp = DATA.employees.find(x=>x.id===a.employeeId);
            return [emp?emp.name:'', fmtMoney(a.amount), fmtDate(a.date), a.settled?'Yes':'No'];
          })),
        pdfSection('Salary Payments', ['Employee','Month','Basic','Bonus','Deductions','Net Payable','Status'],
          sortByDateDesc(DATA.salaryPayments, 'month').map(p=>{
            const emp = DATA.employees.find(x=>x.id===p.employeeId);
            return [emp?emp.name:'', p.month, fmtMoney(p.basic), fmtMoney(p.bonus), fmtMoney((p.absentDeduction||0)+(p.advanceDeduction||0)), fmtMoney(p.net), p.status];
          })),
      ]};
    }
    case 'construction': {
      const totalBudget = DATA.constructionProjects.reduce((s,p)=>s+Number(p.budget||0),0);
      const totalMaterial = DATA.materials.reduce((s,m)=>s+Number(m.amount||0),0);
      const totalLabour = DATA.labourers.reduce((s,l)=>s+labourerPayout(l),0);
      const totalSpend = totalMaterial+totalLabour;
      return { title:'Construction Report',
        summary:[
          {label:'Total Budget', value:fmtMoney(totalBudget), color:'#0369a1'},
          {label:'Total Spend', value:fmtMoney(totalSpend), color: totalSpend>totalBudget && totalBudget>0 ?'#dc2626':'#b45309'},
          {label:'Remaining', value:fmtMoney(totalBudget-totalSpend), color: (totalBudget-totalSpend)>=0?'#059669':'#dc2626'},
        ],
        sections: [
        pdfSection('Projects', ['Name','Start Date','Budget'],
          DATA.constructionProjects.map(p=>[p.name,fmtDate(p.startDate),fmtMoney(p.budget)])),
        pdfSection('Material Expenses', ['Item','Qty','Amount','Date','Vendor'],
          sortByDateDesc(DATA.materials, 'date').map(m=>[m.item,m.qty||'',fmtMoney(m.amount),fmtDate(m.date),m.vendor||''])),
        pdfSection('Labour Register', ['Name','Role','Daily Wage','Advance','Net Payout'],
          DATA.labourers.map(l=>[l.name,l.role,fmtMoney(l.dailyWage),fmtMoney(l.advance),fmtMoney(labourerPayout(l))])),
      ]};
    }
    case 'assets':
      return { title:'Assets & Warranty Report', sections: [
        pdfSection('Assets', ['Name','Vendor','Price','Purchase Date','Warranty Expiry'],
          DATA.assets.map(a=>[a.name,a.vendor||'',fmtMoney(a.price),fmtDate(a.purchaseDate),fmtDate(a.warrantyExpiry)])),
      ]};
    case 'maintenance':
      return { title:'Maintenance Schedule', sections: [
        pdfSection('Maintenance Log', ['Task','Last Serviced','Next Due','Cost'],
          DATA.maintenanceLogs.map(m=>[m.task,fmtDate(m.lastDate),fmtDate(m.nextDate),fmtMoney(m.cost)])),
      ]};
    case 'vehicle': {
      const totalFuelCost = DATA.fuelLogs.reduce((s,f)=>s+Number(f.liters||0)*Number(f.rate||0),0);
      return { title:'Vehicle Log Report',
        summary:[{label:'Total Fuel Cost', value:fmtMoney(totalFuelCost), color:'#dc2626'}],
        sections: [
        pdfSection('Vehicles', ['Name','Plate','Odometer'],
          DATA.vehicles.map(v=>[v.name,v.plate||'',(v.odometer||0)+' km'])),
        pdfSection('Fuel Log', ['Vehicle','Date','Liters','Rate','Odometer','Cost'],
          sortByDateDesc(DATA.fuelLogs, 'date').map(f=>{
            const v = DATA.vehicles.find(x=>x.id===f.vehicleId);
            return [v?v.name:'',fmtDate(f.date),f.liters,f.rate,f.odometer,fmtMoney(f.liters*f.rate)];
          })),
      ]};
    }
    case 'zakat': {
      const totalCharity = DATA.charityRecords.reduce((s,c)=>s+Number(c.amount||0),0);
      return { title:'Zakat & Charity Report',
        summary:[{label:'Total Given (All Time)', value:fmtMoney(totalCharity), color:'#0f766e'}],
        sections: [
        pdfSection('Charity Ledger', ['Type','Recipient','Amount','Date'],
          sortByDateDesc(DATA.charityRecords, 'date').map(c=>[c.type,c.recipient||'',fmtMoney(c.amount),fmtDate(c.date)])),
      ]};
    }
    case 'solar':
      return { title:'Solar & Utility Report', sections: [
        pdfSection('Monthly Solar Logs', ['Month','Generated','Exported','Peak Units','Off-Peak Units','Tariff'],
          DATA.solarLogs.map(l=>[l.month,l.generated,l.exported,l.peakUnits,l.offPeakUnits,l.tariff])),
      ]};
    case 'pantry':
      return { title:'Pantry & Ration Report', sections: [
        pdfSection('Pantry Items', ['Item','Quantity','Unit','Threshold'],
          DATA.pantryItems.map(p=>[p.name,p.qty,p.unit||'',p.threshold||''])),
      ]};
    case 'vault':
      return { title:'Emergency Contacts', sections: [
        pdfSection('Emergency Contacts', ['Name','Category','Phone'],
          DATA.emergencyContacts.map(c=>[c.name,c.category,c.phone])),
      ], note:'Encrypted vault item values are never included in PDF exports for your security.' };
    case 'events': {
      const totalBudget = DATA.events.reduce((s,e)=>s+Number(e.budget||0),0);
      const totalSpend = DATA.eventItems.reduce((s,i)=>s+Number(i.amount||0),0);
      return { title:'Event Budget Report',
        summary:[
          {label:'Total Budget', value:fmtMoney(totalBudget), color:'#db2777'},
          {label:'Total Spent', value:fmtMoney(totalSpend), color: totalSpend>totalBudget && totalBudget>0?'#dc2626':'#b45309'},
          {label:'Remaining', value:fmtMoney(totalBudget-totalSpend), color:(totalBudget-totalSpend)>=0?'#059669':'#dc2626'},
        ],
        sections: [
        pdfSection('Events', ['Name','Date','Budget'],
          DATA.events.map(e=>[e.name,fmtDate(e.date),fmtMoney(e.budget)])),
        pdfSection('Line Items', ['Event','Item','Vendor','Amount','Advance'],
          DATA.eventItems.slice().reverse().map(i=>{
            const ev = DATA.events.find(x=>x.id===i.eventId);
            return [ev?ev.name:'',i.item,i.vendor||'',fmtMoney(i.amount),fmtMoney(i.advance)];
          })),
      ]};
    }
    case 'goals': {
      const totalTarget = DATA.goals.reduce((s,g)=>s+Number(g.target||0),0);
      const totalSaved = DATA.goals.reduce((s,g)=>s+Number(g.saved||0),0);
      return { title:'Savings Goals Report',
        summary:[
          {label:'Total Target', value:fmtMoney(totalTarget), color:'#0891b2'},
          {label:'Total Saved', value:fmtMoney(totalSaved), color:'#059669'},
        ],
        sections: [
        pdfSection('Goals', ['Name','Target','Saved','Target Date'],
          DATA.goals.map(g=>[g.name,fmtMoney(g.target),fmtMoney(g.saved),fmtDate(g.targetDate)])),
      ]};
    }
    default:
      return null;
  }
}
function sectionToHTML(sec){
  let html = `<h2>${escapeHtml(sec.title)}</h2>`;
  if(!sec.rows.length){ html += `<p class="print-empty">Koi record nahi mila.</p>`; return html; }
  html += `<table><thead><tr>${sec.headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>`;
  html += sec.rows.map(r=>`<tr>${r.map(c=>`<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('');
  html += `</tbody></table>`;
  return html;
}
function summaryToHTML(summary){
  return `<div style="display:flex;gap:10px;flex-wrap:wrap;margin:16px 0">
    ${summary.map(s=>`<div style="flex:1;min-width:150px;padding:12px 14px;border-radius:10px;background:${s.color}18;border:1.5px solid ${s.color}55">
      <div style="font-size:10.5px;color:#666;font-weight:600;text-transform:uppercase">${escapeHtml(s.label)}</div>
      <div style="font-size:19px;font-weight:800;color:${s.color};margin-top:2px">${escapeHtml(s.value)}</div>
    </div>`).join('')}
  </div>`;
}
function renderPrintArea(data){
  const area = $('#printArea');
  area.innerHTML = `<h1>GharSaz 360 — ${escapeHtml(data.title)}</h1>
    <div class="print-date">Generated on ${fmtDate(todayISO())}</div>
    ${data.summary ? summaryToHTML(data.summary) : ''}
    ${data.note?`<p class="print-empty">${escapeHtml(data.note)}</p>`:''}
    ${data.sections.map(sectionToHTML).join('')}
    <div class="print-footer">Generated by GharSaz 360 · 100% Offline App</div>`;
}
function printDataToText(data){
  let out = `GharSaz 360 — ${data.title}\nGenerated: ${fmtDate(todayISO())}\n`;
  if(data.summary){
    out += '\n' + data.summary.map(s=>`${s.label}: ${s.value}`).join('   |   ') + '\n';
  }
  if(data.note) out += `\n${data.note}\n`;
  data.sections.forEach(sec=>{
    out += `\n${sec.title}\n${'-'.repeat(30)}\n`;
    if(!sec.rows.length){ out += 'Koi record nahi mila.\n'; return; }
    out += sec.headers.join('  |  ') + '\n';
    sec.rows.forEach(r=>{ out += r.join('  |  ') + '\n'; });
  });
  return out;
}
function exportPDF(){
  const data = getPrintData(ROUTE);
  if(!data){ toast('Is tab ke liye export available nahi'); return; }
  const pdfBtn = `<button class="btn btn-primary btn-block" id="doPdfBtn">${ICN.down} Download PDF File</button>`;
  const printBtn = `<button class="btn btn-outline btn-block" id="doPrintBtn">${ICN.print} Print / Save as PDF (browser)</button>`;
  const copyBtn = `<button class="btn btn-ghost btn-block" id="doCopyBtn">Copy Data (Clipboard)</button>`;
  openSheet(`${sheetHeader('Export: '+data.title)}
    <div style="display:flex;flex-direction:column;gap:10px">${pdfBtn}${printBtn}${copyBtn}</div>
    <div class="help-text" style="margin-top:12px">"Download PDF File" ek asli .pdf file banati hai. Agar ye is app mein bhi save na ho (kuch purane installed-app builders download block karte hain), to "Copy" hamesha kaam karega.</div>`,
    (root)=>{
      $('#doPdfBtn', root).addEventListener('click', async ()=>{
        try{
          await downloadLedgerPDF(`GharSaz360-${data.title.replace(/\s+/g,'-')}-${todayISO()}.pdf`, data);
        }catch(e){
          console.error('PDF export failed:', e);
          toast('PDF export mein masla aaya: '+(e && e.message ? e.message : 'unknown error'));
        }
      });
      $('#doPrintBtn', root).addEventListener('click', ()=>{
        closeSheet();
        renderPrintArea(data);
        setTimeout(()=>{
          // Native print (Android's PrintManager) — works even inside a
          // bare WebView, unlike window.print() which needs the browser's
          // own print UI that most installed-app shells don't have.
          if(window.AndroidBridge && typeof window.AndroidBridge.printPage === 'function'){
            try{ window.AndroidBridge.printPage(); return; }
            catch(e){ console.warn('Native print failed:', e); }
          }
          try{ window.print(); }
          catch(e){ toast('Print is app mein available nahi — "Download PDF" ya "Copy" try karein'); }
        }, 150);
      });
      $('#doCopyBtn', root).addEventListener('click', async ()=>{
        const text = printDataToText(data);
        const ok = await copyTextUniversal(text);
        closeSheet();
        if(ok) toast('Copy ho gaya');
        else showCopyFallback(data.title, text);
      });
    });
}
