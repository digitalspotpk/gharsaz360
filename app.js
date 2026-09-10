/* ==========================================================================
   GharSaz 360 — Enhanced Application Logic v4.0
   Features: Separate PDF per module, new modules, search, date filters,
   recurring expenses, CSV export, financial overview, and more.
   ========================================================================== */
'use strict';

/* ---- ICONS ---- */
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
  bell:  `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>`,
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
  search:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  droplet:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s7 8 7 13a7 7 0 1 1-14 0c0-5 7-13 7-13Z"/></svg>`,
  plant:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>`,
  gold:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
  shop:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9 2.45 3.72A1 1 0 0 1 3.44 3h17.12a1 1 0 0 1 .99.72L21 9"/><path d="M12 3v6"/></svg>`,
  chart:`<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
};
function icon(name, color){ return `<span style="color:${color||'currentColor'};display:flex">${ICN[name]||''}</span>`; }

/* ---- UTILITIES ---- */
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
function downloadFile(filename, content, type){
  const blob = new Blob([content], {type});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
function csvEscape(s){
  s = String(s??'');
  return /["\n,]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s;
}
function exportCSV(filename, headers, rows){
  const lines = [headers.join(',')];
  rows.forEach(r=> lines.push(r.map(csvEscape).join(',')));
  downloadFile(filename, lines.join('\n'), 'text/csv');
  toast('CSV downloaded');
}

/* ========================================================================
   PDF GENERATOR — Pure JS, zero dependencies
   Generates valid PDF 1.4 files with Helvetica font.
   ======================================================================== */
function pdfEscape(s){ return String(s).replace(/[^\x20-\x7E]/g,'?').replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)'); }
function pdfStringToBlob(body){
  const bytes = new Uint8Array(body.length);
  for(let i=0;i<body.length;i++) bytes[i] = body.charCodeAt(i);
  return new Blob([bytes], {type:'application/pdf'});
}
function wrapLine(text, maxChars){
  if(!text) return [''];
  const words = String(text).split(/\s+/);
  const out = []; let remaining = '';
  words.forEach(w=>{
    if(remaining.length + w.length + 1 <= maxChars){ remaining += (remaining?' ':'') + w; }
    else { if(remaining) out.push(remaining); remaining = w; }
  });
  if(remaining) out.push(remaining);
  return out.length ? out : [''];
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

/* Build a multi-page PDF from structured data */
function buildModulePDF(data){
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
    ops += text(MARGIN, PAGE_H-58, `GharSaz 360 - ${fmtDate(todayISO())}`, 'F1', 9, WHITE);
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

  // Summary boxes
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

  (data.sections||[]).forEach(sec=>{
    ensure(22);
    ops += rect(MARGIN, y-17, PAGE_W-2*MARGIN, 19, GREEN_DARK);
    ops += text(MARGIN+7, y-12, sec.title, 'F2', 10, WHITE);
    y -= 23;

    if(!sec.rows || !sec.rows.length){
      ensure(16);
      ops += text(MARGIN+4, y-10, 'No records found.', 'F1', 8.5, GRAY);
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

  // Footer
  pagesOps.forEach((pageOps, idx)=>{
    pagesOps[idx] = pageOps
      + rect(MARGIN, 30, PAGE_W-2*MARGIN, 0.75, [0.85,0.87,0.86])
      + text(PAGE_W/2-70, 18, `GharSaz 360 - 100% Offline`, 'F1', 7, GRAY)
      + text(PAGE_W-MARGIN-42, 18, `Page ${idx+1} of ${totalPages}`, 'F1', 7, GRAY);
  });

  // Assemble PDF
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

function downloadModulePDF(data, filename){
  const blob = buildModulePDF(data);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || `GharSaz360-${data.title.replace(/\s+/g,'-')}-${todayISO()}.pdf`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('PDF downloaded');
}

/* ---- STATE ---- */
const STORAGE_KEY = 'gharsaz360_data_v2';
const SETTINGS_KEY = 'gharsaz360_settings_v2';
function defaultState(){
  return {
    budgets: [], incomes: [], expenses: [],
    properties: [], tenants: [], rentPayments: [],
    udhars: [], udharTx: [],
    constructionProjects: [], materials: [], labourers: [], attendance: [],
    assets: [], maintenanceLogs: [],
    vehicles: [], fuelLogs: [],
    zakatRecords: [], charityRecords: [],
    solarLogs: [], pantryItems: [],
    vaultMeta: null, vaultItems: [], emergencyContacts: [],
    events: [], eventItems: [], goals: [], goalTx: [],
    employees: [], staffAttendance: [], salaryAdvances: [], salaryPayments: [],
    labourWorkers: [], labourAttendance: [], labourAdvances: [], labourPayments: [],
    todos: [], bills: [], familyMembers: [], loans: [], loanPayments: [],
    subscriptions: [], insurancePolicies: [], healthRecords: [], importantDates: [],
    // NEW MODULES
    goldInvestments: [],
    businessEntries: [],
    waterTanks: [],
    gardenPlants: [],
    guestExpenses: [],
    religiousExpenses: [],
  };
}
let DATA = loadData();
function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  }catch(e){ return defaultState(); }
}
function saveData(){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA)); }catch(e){}
}
function loadSettings(){
  const defaults = {theme:'light', whatsapp:'+923065772734', currency:'PKR', language:'en'};
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    return Object.assign(defaults, raw?JSON.parse(raw):{});
  }catch(e){ return defaults; }
}
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }
let SETTINGS = loadSettings();

/* ---- CATEGORIES ---- */
const CATEGORY_TREE = {
  'Grocery & Pantry': ['Vegetables','Fruits','Milk/Dairy','Eggs','Meat/Chicken/Fish','Grains/Flour/Rice','Pulses/Daal','Spices/Oils','Sugar/Salt/Tea','Bakery Items','Frozen Food','Dry Fruits/Nuts','Beverages','Snacks','Other'],
  'Health & Medical': ['Doctor Consultations','Medicines','Lab Tests','Emergency','Dental','Other'],
  'Utilities & Bills': ['Electricity Bill','Gas Bill','Water Bill','Internet/Wifi','Mobile Load','Other'],
  'Transport & Vehicle': ['Fuel/Petrol','Vehicle Repair','Public Transport','Rickshaw/Taxi','Parking Fee','Other'],
  'Home & Domestic Staff': ['Maid/Servant Salary','Driver Salary','Cook Salary','Home Maintenance','Other'],
  'Education': ['School/College Fees','Tuition','Books/Stationery','Other'],
  'Personal Care': ['Salon/Barber','Cosmetics','Perfume','Other'],
  'Leisure & Entertainment': ['Dining Out','Movies','Sports/Gym','Clothes','Travel','Other'],
  'Religious & Social': ['Zakat','Sadqah/Charity','Wedding Gifts','Other'],
  'Miscellaneous': ['Other'],
};
const CATEGORY_COLORS = {
  'Grocery & Pantry':'#10b981','Health & Medical':'#ef4444','Utilities & Bills':'#0ea5e9',
  'Transport & Vehicle':'#f59e0b','Home & Domestic Staff':'#8b5cf6','Education':'#3b82f6',
  'Personal Care':'#ec4899','Leisure & Entertainment':'#a855f7',
  'Religious & Social':'#059669','Miscellaneous':'#6b7280',
};

/* ---- MODULES ---- */
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
  // NEW MODULES
  {id:'goldInvestments', label:'Gold/Silver', icon:'gold', color:'#d97706'},
  {id:'businessEntries', label:'Business/Shop', icon:'shop', color:'#7c3aed'},
  {id:'waterTanks', label:'Water Tanks', icon:'droplet', color:'#0284c7'},
  {id:'gardenPlants', label:'Garden/Plants', icon:'plant', color:'#16a34a'},
  {id:'guestExpenses', label:'Guest/Hospitality', icon:'gift', color:'#e11d48'},
  {id:'religiousExpenses', label:'Religious (Hajj/Umrah)', icon:'moonstar', color:'#0f766e'},
  {id:'financialOverview', label:'Financial Overview', icon:'chart', color:'#059669'},
  {id:'settings', label:'Settings & Backup', icon:'settings', color:'#334155'},
];
let ROUTE = 'dashboard';
let ROUTE_PARAM = null;
let SEARCH_QUERY = '';
let DATE_FILTER = {from:'', to:''};

function navigate(route, param){
  ROUTE = route; ROUTE_PARAM = param || null;
  SEARCH_QUERY = '';
  DATE_FILTER = {from:'', to:''};
  window.location.hash = route;
  renderRoute();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', ()=>{
  const r = location.hash.replace('#','') || 'dashboard';
  ROUTE = r; renderRoute();
});

/* ---- UI HELPERS ---- */
function renderTopbar(){
  const mod = ALL_MODULES.find(m=>m.id===ROUTE) || ALL_MODULES[0];
  $('#pageTitle').textContent = mod.label;
  const subs = {
    dashboard:'Aaj ka khulasa', budgets:'Estimated vs actual', expenses:'Sab kharchay ek jaga',
    rent:'Properties, tenants, receipts', udhar:'Udhar len-den ledger', construction:'Material & labour',
    salary:'Staff, attendance & payroll', labour:'Daily/monthly wage & payments',
    todos:'Aaj ke kaam', bills:'Utility bills & due dates', familyMembers:'Ghar ke afraad',
    loans:'Bank loans & EMI tracking', subscriptions:'Recurring memberships',
    insurancePolicies:'Policies & premiums', healthRecords:'Prescriptions & appointments',
    importantDates:'Birthdays & anniversaries', assets:'Warranty tracker',
    maintenance:'Servicing reminders', vehicle:'Fuel & mileage',
    zakat:'Calculator & charity', solar:'Generation & bill estimate', pantry:'Ration ka hisaab',
    vault:'Encrypted local vault', events:'Occasion budgets', goals:'Apke targets',
    goldInvestments:'Gold & silver investments', businessEntries:'Shop/business ledger',
    waterTanks:'Water storage & refills', gardenPlants:'Plants & watering schedule',
    guestExpenses:'Mehman nawazi kharchay', religiousExpenses:'Hajj, Umrah, Aqiqa',
    financialOverview:'Complete financial summary',
    settings:'Backup & preferences', more:'Sab modules'
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
      ${icon(n.icon)}<span class="dot"></span>${n.label}
    </button>`;
  }).join('');
  $$('.nav-item', nav).forEach(btn=>btn.addEventListener('click', ()=>navigate(btn.dataset.nav)));
}
function renderFab(){
  const map = {
    budgets:'budgets', expenses:'expenses', rent:'rent-picker', udhar:'udhars',
    construction:'construction-picker', assets:'assets', maintenance:'maintenanceLogs',
    salary:'salary-picker', labour:'labour-picker',
    todos:'todos', bills:'bills', familyMembers:'familyMembers', loans:'loans',
    subscriptions:'subscriptions', insurancePolicies:'insurancePolicies',
    healthRecords:'healthRecords', importantDates:'importantDates',
    vehicle:'vehicle-picker', zakat:'zakat-picker', solar:'solarLogs', pantry:'pantryItems',
    vault:'vault-picker', events:'events-picker', goals:'goals',
    goldInvestments:'goldInvestments', businessEntries:'businessEntries',
    waterTanks:'waterTanks', gardenPlants:'gardenPlants',
    guestExpenses:'guestExpenses', religiousExpenses:'religiousExpenses',
  };
  const fab = $('#fabAdd');
  if(map[ROUTE]){ fab.style.display='flex'; fab.onclick = ()=> handleFab(map[ROUTE]); }
  else { fab.style.display='none'; }
}

/* ---- MODAL / SHEET ---- */
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
      ${f.step?`step="${f.step}"`:''} placeholder="${f.placeholder||''}"></div>`;
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

/* ---- SCHEMAS for generic CRUD ---- */
const SCHEMAS = {
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
      {key:'title', label:'Task', type:'text', required:true},
      {key:'category', label:'Category', type:'select', options:['Home','Work','Shopping','Personal','Other']},
      {key:'dueDate', label:'Due Date', type:'date'},
      {key:'priority', label:'Priority', type:'select', options:['Low','Medium','High']},
    ]
  },
  bills: {
    title:'Bill', arrayKey:'bills', color:'#b45309', icon:'bell', defaults:{status:'Unpaid'},
    fields:[
      {key:'name', label:'Bill', type:'select', options:['Electricity Bill','Gas Bill','Water Bill','Internet/Wifi','Mobile Bill','Other'], required:true},
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
      {key:'phone', label:'Phone Number', type:'text'},
    ]
  },
  goals: {
    title:'Savings Goal', arrayKey:'goals', color:'#0891b2', icon:'target',
    fields:[
      {key:'name', label:'Goal Name', type:'text', required:true},
      {key:'target', label:'Target Amount (Rs)', type:'number', required:true},
      {key:'saved', label:'Already Saved (Rs)', type:'number'},
      {key:'targetDate', label:'Target Date', type:'date'},
    ]
  },
  events: {
    title:'Event', arrayKey:'events', color:'#db2777', icon:'calendarheart',
    fields:[
      {key:'name', label:'Event Name', type:'text', required:true},
      {key:'date', label:'Event Date', type:'date'},
      {key:'budget', label:'Total Budget (Rs)', type:'number'},
    ]
  },
  subscriptions: {
    title:'Subscription', arrayKey:'subscriptions', color:'#7c3aed', icon:'repeat', defaults:{status:'Active'},
    fields:[
      {key:'name', label:'Service Name', type:'text', required:true},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'billingCycle', label:'Billing Cycle', type:'select', options:['Monthly','Yearly']},
      {key:'nextRenewalDate', label:'Next Renewal Date', type:'date'},
      {key:'status', label:'Status', type:'select', options:['Active','Cancelled']},
    ]
  },
  importantDates: {
    title:'Important Date', arrayKey:'importantDates', color:'#be185d', icon:'gift',
    fields:[
      {key:'title', label:'Title', type:'text', required:true},
      {key:'type', label:'Type', type:'select', options:['Birthday','Anniversary','Religious','Other']},
      {key:'date', label:'Date', type:'date', required:true},
    ]
  },
  // NEW MODULE SCHEMAS
  goldInvestments: {
    title:'Gold/Silver Investment', arrayKey:'goldInvestments', color:'#d97706', icon:'gold',
    fields:[
      {key:'type', label:'Metal Type', type:'select', options:['Gold','Silver'], required:true},
      {key:'weight', label:'Weight (grams)', type:'number', required:true, step:'0.01'},
      {key:'pricePerGram', label:'Price per Gram (Rs)', type:'number', required:true},
      {key:'purchaseDate', label:'Purchase Date', type:'date'},
      {key:'vendor', label:'Vendor/Shop', type:'text'},
      {key:'purity', label:'Purity/Karat', type:'select', options:['24K','22K','21K','18K','999 (Silver)','925 (Silver)','Other']},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  businessEntries: {
    title:'Business Entry', arrayKey:'businessEntries', color:'#7c3aed', icon:'shop',
    fields:[
      {key:'type', label:'Type', type:'select', options:['Sale','Purchase','Expense','Income'], required:true},
      {key:'description', label:'Description', type:'text', required:true},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'date', label:'Date', type:'date'},
      {key:'party', label:'Party/Customer Name', type:'text'},
      {key:'paymentMethod', label:'Payment Method', type:'select', options:['Cash','Bank Transfer','Cheque','Online','Other']},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  waterTanks: {
    title:'Water Tank', arrayKey:'waterTanks', color:'#0284c7', icon:'droplet',
    fields:[
      {key:'name', label:'Tank Name/Location', type:'text', required:true, placeholder:'e.g. Roof Tank'},
      {key:'capacity', label:'Capacity (Liters)', type:'number'},
      {key:'lastRefill', label:'Last Refill Date', type:'date'},
      {key:'refillCost', label:'Refill Cost (Rs)', type:'number'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  gardenPlants: {
    title:'Plant', arrayKey:'gardenPlants', color:'#16a34a', icon:'plant',
    fields:[
      {key:'name', label:'Plant Name', type:'text', required:true},
      {key:'type', label:'Type', type:'select', options:['Flower','Fruit','Vegetable','Herb','Tree','Indoor','Other']},
      {key:'plantedDate', label:'Planted Date', type:'date'},
      {key:'wateringFreq', label:'Watering Frequency', type:'select', options:['Daily','Every 2 Days','Weekly','Bi-weekly','Monthly']},
      {key:'lastWatered', label:'Last Watered', type:'date'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  guestExpenses: {
    title:'Guest Expense', arrayKey:'guestExpenses', color:'#e11d48', icon:'gift',
    fields:[
      {key:'occasion', label:'Occasion', type:'select', options:['Guest Visit','Dawat','Mehman Nawazi','Wedding','Other'], required:true},
      {key:'description', label:'Description', type:'text', required:true},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'date', label:'Date', type:'date'},
      {key:'guestName', label:'Guest Name', type:'text'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
  religiousExpenses: {
    title:'Religious Expense', arrayKey:'religiousExpenses', color:'#0f766e', icon:'moonstar',
    fields:[
      {key:'type', label:'Type', type:'select', options:['Hajj','Umrah','Aqiqa','Fitrana','Kaffara','Sadqah','Other'], required:true},
      {key:'description', label:'Description', type:'text', required:true},
      {key:'amount', label:'Amount (Rs)', type:'number', required:true},
      {key:'date', label:'Date', type:'date'},
      {key:'beneficiary', label:'Beneficiary', type:'text'},
      {key:'notes', label:'Notes', type:'textarea'},
    ]
  },
};

function handleFab(route){
  const pickers = {
    'rent-picker': [['Add Property','properties'],['Add Tenant','tenants'],['Record Payment','rentPayments']],
    'construction-picker': [['New Project','constructionProjects'],['Add Material Expense','materials'],['Add Labourer','labourers']],
    'vehicle-picker': [['Add Vehicle','vehicles'],['Add Fuel Entry','fuelLogs']],
    'zakat-picker': [['Add Charity Record','charityRecords']],
    'vault-picker': [['Add Vault Item','vaultItems'],['Add Emergency Contact','emergencyContacts']],
    'events-picker': [['New Event','events'],['Add Line Item','eventItems']],
  };
  if(pickers[route]){
    openSheet(`${sheetHeader('Choose Action')}
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px">
        ${pickers[route].map(([label,key])=>`<button class="btn btn-outline btn-block" data-open="${key}">${label}</button>`).join('')}
      </div>`, (root)=>{
        $$('[data-open]', root).forEach(b=>b.addEventListener('click', ()=>{ openGenericForm(b.dataset.open); }));
      });
    return;
  }
  openGenericForm(route);
}

function openGenericForm(arrayKey, editId){
  if(arrayKey==='budgets') return openBudgetForm(editId);
  if(arrayKey==='expenses') return openExpenseForm(editId);
  if(arrayKey==='udhars') return openUdharForm(editId);
  const schema = SCHEMAS[arrayKey];
  if(!schema) return;
  const editItem = editId ? DATA[arrayKey].find(x=>x.id===editId) : null;
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+schema.title)}
    <form id="genForm">
      ${schema.fields.map(f=>renderField(f, editItem?editItem[f.key]:(f.key==='date'||f.key==='purchaseDate'?todayISO():''))).join('')}
      <div style="display:flex;gap:10px;margin-top:6px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delBtn">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
      </div>
    </form>`, (root)=>{
      const form = $('#genForm', root);
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const vals = readForm(form, schema.fields);
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

/* ---- SEARCH & FILTER BAR ---- */
function renderSearchBar(){
  return `<div style="display:flex;gap:8px;margin-bottom:14px;align-items:center">
    <div style="flex:1;position:relative">
      <input type="text" id="searchInput" placeholder="Search..." value="${escapeHtml(SEARCH_QUERY)}"
        style="width:100%;padding:10px 10px 10px 36px;border-radius:12px;border:1.5px solid var(--border);background:var(--surface-2);font-size:13px;outline:none">
      <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-dim)">${icon('search')}</span>
    </div>
  </div>`;
}

/* ---- DASHBOARD ---- */
function computeMonthTotals(mKey){
  mKey = mKey || monthKey();
  const exp = DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((s,e)=>s+Number(e.amount||0),0);
  const inc = DATA.incomes.filter(i=>monthKey(i.date)===mKey).reduce((s,i)=>s+Number(i.amount||0),0);
  return {exp, inc};
}
function emptyState(ic,title,sub,route){
  return `<div class="empty">
    <div class="ic">${ICN[ic]}</div>
    <div style="font-weight:800;font-size:15px;color:var(--text)">${title}</div>
    <div style="font-size:13px;margin:6px 0 14px">${sub}</div>
    ${route?`<button class="btn btn-primary" onclick="handleFab('${route}')">+ Add Now</button>`:''}
  </div>`;
}
function moduleTile(m){
  return `<div class="module-tile" onclick="navigate('${m.id}')">
    <div class="ic" style="background:${m.color}20;color:${m.color}">${icon(m.icon)}</div>
    <span>${m.label}</span>
  </div>`;
}
function moreGrid(){
  return `<div class="grid-3">${ALL_MODULES.filter(m=>m.id!=='dashboard').map(moduleTile).join('')}</div>`;
}
function renderDashboard(){
  const {exp, inc} = computeMonthTotals();
  const pendingRent = DATA.rentPayments.filter(p=>p.status!=='Paid').length;
  const pendingUdhar = DATA.udhars.filter(u=>udharBalance(u)!==0).length;
  let html = `
  <div class="grid-2">
    <div class="stat-card"><div class="stat-label">This Month Expense</div><div class="stat-value">${fmtMoney(exp)}</div></div>
    <div class="stat-card blue"><div class="stat-label">This Month Income</div><div class="stat-value">${fmtMoney(inc)}</div></div>
  </div>
  <div class="grid-2" style="margin-top:12px">
    <div class="stat-card ${pendingRent?'warn':''}"><div class="stat-label">Rent Pending</div><div class="stat-value">${pendingRent}</div></div>
    <div class="stat-card ${pendingUdhar?'danger':''}"><div class="stat-label">Udhar Open</div><div class="stat-value">${pendingUdhar}</div></div>
  </div>`;
  html += `<div class="section-title">Quick Access</div><div class="grid-4">`;
  ['expenses','rent','udhar','salary','zakat','vehicle','goals','vault','goldInvestments','businessEntries','financialOverview'].forEach(id=>{
    const m = ALL_MODULES.find(x=>x.id===id);
    if(m) html += moduleTile(m);
  });
  html += `</div>`;
  // Due alerts
  const dueBills = DATA.bills.filter(b=>b.status!=='Paid' && daysUntil(b.dueDate)!==null && daysUntil(b.dueDate)<=7);
  const dueTodos = DATA.todos.filter(t=>t.status!=='Done' && t.dueDate && daysUntil(t.dueDate)!==null && daysUntil(t.dueDate)<=3);
  if(dueBills.length || dueTodos.length){
    html += `<div class="section-title">⚠️ Upcoming Alerts</div><div class="card">`;
    dueBills.forEach(b=>{
      html += `<div class="list-item" onclick="navigate('bills')"><div class="avatar" style="background:#fef3c7;color:#92400e">${icon('bell')}</div>
        <div class="meta"><div class="t">${escapeHtml(b.name)}</div><div class="s">Due ${fmtDate(b.dueDate)} · ${fmtMoney(b.amount)}</div></div></div>`;
    });
    dueTodos.forEach(t=>{
      html += `<div class="list-item" onclick="navigate('todos')"><div class="avatar" style="background:#fee2e2;color:#991b1b">${icon('checksquare')}</div>
        <div class="meta"><div class="t">${escapeHtml(t.title)}</div><div class="s">Due ${fmtDate(t.dueDate)}</div></div></div>`;
    });
    html += `</div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---- BUDGETS ---- */
function budgetSpent(b){
  if(b.period === 'Monthly') return DATA.expenses.filter(e=>e.budgetId===b.id && monthKey(e.date)===monthKey()).reduce((s,e)=>s+Number(e.amount||0),0);
  return DATA.expenses.filter(e=>e.budgetId===b.id).reduce((s,e)=>s+Number(e.amount||0),0);
}
function budgetEffective(b){ return Number(b.estimated||0); }
function budgetRow(b){
  const spent = budgetSpent(b);
  const effective = budgetEffective(b);
  const pct = effective>0 ? Math.min(100, Math.round(spent/effective*100)) : 0;
  const level = pct>90?'red':pct>=70?'amber':'green';
  return `<div style="padding:10px 0;border-bottom:1px solid var(--border)" onclick="openBudgetForm('${b.id}')">
    <div class="card-row" style="justify-content:space-between;margin-bottom:8px">
      <div><div class="card-title">${escapeHtml(b.name)}</div><div class="card-sub">${escapeHtml(b.category||'')} · ${escapeHtml(b.period||'')}</div></div>
      <div class="badge ${level}">${pct}%</div>
    </div>
    <div class="progress ${level}"><div style="width:${pct}%"></div></div>
    <div class="card-sub" style="margin-top:6px">${fmtMoney(spent)} spent of ${fmtMoney(effective)}</div>
  </div>`;
}
function openBudgetForm(editId){
  const editItem = editId ? DATA.budgets.find(x=>x.id===editId) : null;
  const fields = [
    {key:'name', label:'Budget Name', type:'text', required:true},
    {key:'category', label:'Type', type:'select', options:['Monthly Home','Special Event','Emergency Fund','Other']},
    {key:'estimated', label:'Estimated Amount (Rs)', type:'number', required:true},
    {key:'period', label:'Period', type:'select', options:['Monthly','Yearly','One-time']},
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'New ')+'Budget')}
    <form id="bForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
      <div style="display:flex;gap:10px">
        ${editItem?`<button type="button" class="btn btn-danger" id="delB">${ICN.trash}</button>`:''}
        <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Create Budget'}</button>
      </div></form>`, (root)=>{
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
function renderBudgets(){
  const {exp, inc} = computeMonthTotals();
  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Total Income (mo)</div><div class="stat-value">${fmtMoney(inc)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Total Expense (mo)</div><div class="stat-value">${fmtMoney(exp)}</div></div>
  </div>`;
  html += `<div class="section-title">Budgets</div>`;
  html += DATA.budgets.length ? `<div class="card">${DATA.budgets.map(budgetRow).join('')}</div>` : emptyState('wallet','Koi budget nahi','Naya budget shamil karein');
  // PDF & CSV buttons
  if(DATA.budgets.length){
    html += `<div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="exportBudgetsPDF()">${ICN.print} PDF</button>
      <button class="btn btn-outline btn-sm" onclick="exportBudgetsCSV()">${ICN.down} CSV</button>
    </div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---- EXPENSES ---- */
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
      <div class="field"><label>Budget (optional)</label>
        <select name="budgetId">
          <option value="">-- No Budget --</option>
          ${DATA.budgets.map(b=>`<option value="${b.id}" ${editItem&&editItem.budgetId===b.id?'selected':''}>${escapeHtml(b.name)}</option>`).join('')}
        </select></div>
      <div class="field"><label>Recurring</label>
        <select name="recurring">
          <option value="">None</option>
          <option value="Monthly" ${editItem&&editItem.recurring==='Monthly'?'selected':''}>Monthly</option>
          <option value="Weekly" ${editItem&&editItem.recurring==='Weekly'?'selected':''}>Weekly</option>
        </select></div>
      <div class="field"><label>Note</label><input type="text" name="note" value="${editItem?escapeHtml(editItem.note||''):''}"></div>
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
        const vals = { category:f.category.value, subcategory:f.subcategory.value, amount:Number(f.amount.value), date:f.date.value, note:f.note.value, budgetId:f.budgetId.value, recurring:f.recurring.value };
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
  let monthExpenses = DATA.expenses.filter(e=>monthKey(e.date)===mKey);
  // Search filter
  if(SEARCH_QUERY){
    const q = SEARCH_QUERY.toLowerCase();
    monthExpenses = monthExpenses.filter(e=> (e.category||'').toLowerCase().includes(q) || (e.subcategory||'').toLowerCase().includes(q) || (e.note||'').toLowerCase().includes(q));
  }
  const byCat = {};
  monthExpenses.forEach(e=>{ byCat[e.category] = (byCat[e.category]||0) + Number(e.amount||0); });
  const total = monthExpenses.reduce((s,e)=>s+Number(e.amount||0),0);
  let html = renderSearchBar();
  html += `<div class="stat-card"><div class="stat-label">This Month Total</div><div class="stat-value">${fmtMoney(total)}</div></div>`;
  html += `<div class="section-title">By Category</div><div class="card">`;
  if(!Object.keys(byCat).length){ html += `<div style="font-size:13px;color:var(--text-dim);padding:6px 0">Is mahine koi kharcha darj nahi.</div>`; }
  else {
    Object.entries(byCat).sort((a,b)=>b[1]-a[1]).forEach(([cat,amt])=>{
      const pct = total? Math.round(amt/total*100):0;
      html += `<div style="padding:8px 0"><div class="card-row" style="justify-content:space-between;margin-bottom:6px">
        <span style="font-size:13px;font-weight:700">${cat}</span>
        <span style="font-size:12px;color:var(--text-dim)">${fmtMoney(amt)} (${pct}%)</span></div>
        <div class="progress"><div style="width:${pct}%;background:${CATEGORY_COLORS[cat]}"></div></div></div>`;
    });
  }
  html += `</div>`;
  const list = monthExpenses.filter(e=>expenseFilter==='All'||e.category===expenseFilter).sort((a,b)=> String(b.date||'').localeCompare(String(a.date||'')));
  html += `<div class="section-title">Recent Entries</div>`;
  html += list.length ? `<div class="card">${list.map(e=>`
    <div class="list-item" onclick="openExpenseForm('${e.id}')">
      <div class="avatar" style="background:${CATEGORY_COLORS[e.category]}20;color:${CATEGORY_COLORS[e.category]}">${icon('wallet')}</div>
      <div class="meta"><div class="t">${escapeHtml(e.subcategory)}</div><div class="s">${e.category} · ${fmtDate(e.date)} ${e.recurring?'· 🔁':''}</div></div>
      <div class="amt">-${fmtMoney(e.amount)}</div>
    </div>`).join('')}</div>` : emptyState('wallet','Koi entry nahi mili','');
  // Export buttons
  if(DATA.expenses.length){
    html += `<div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="exportExpensesPDF()">${ICN.print} PDF</button>
      <button class="btn btn-outline btn-sm" onclick="exportExpensesCSV()">${ICN.down} CSV</button>
    </div>`;
  }
  $('#viewRoot').innerHTML = html;
  // Search handler
  const si = $('#searchInput');
  if(si) si.addEventListener('input', (e)=>{ SEARCH_QUERY = e.target.value; renderExpenses(); });
}

/* ---- RENT ---- */
function udharBalance(u){
  if(!u) return 0;
  return DATA.udharTx.filter(t=>t.udharId===u.id).reduce((s,t)=> s + (t.type==='Given'? Number(t.amount) : -Number(t.amount)), 0);
}
function renderRent(){
  let html = '';
  if(!DATA.properties.length){ html += emptyState('key','Koi property nahi', 'Apni pehli property add karein', 'rent-picker'); $('#viewRoot').innerHTML = html; return; }
  html += `<div class="section-title">Properties</div><div class="card">` +
    DATA.properties.map(p=>`<div class="list-item"><div class="avatar" style="background:#e0f2fe;color:#0369a1">${icon('key')}</div>
      <div class="meta"><div class="t">${escapeHtml(p.name)}</div><div class="s">${escapeHtml(p.type||'')}</div></div>${icon('chevron')}</div>`).join('') + `</div>`;
  html += `<div class="section-title">Tenants</div>`;
  if(!DATA.tenants.length){ html += emptyState('users','Koi tenant nahi','Tenant add karein'); }
  else { html += `<div class="card">` + DATA.tenants.map(t=>`<div class="list-item"><div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('users')}</div>
    <div class="meta"><div class="t">${escapeHtml(t.name)}</div><div class="s">Rs ${Number(t.monthlyRent||0).toLocaleString()}/mo</div></div></div>`).join('') + `</div>`; }
  if(DATA.properties.length){
    html += `<div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="exportRentPDF()">${ICN.print} PDF</button>
      <button class="btn btn-outline btn-sm" onclick="exportRentCSV()">${ICN.down} CSV</button>
    </div>`;
  }
  $('#viewRoot').innerHTML = html;
}

/* ---- UDHAR ---- */
function renderUdhar(){
  if(!DATA.udhars.length){ $('#viewRoot').innerHTML = emptyState('users','Koi udhar contact nahi','Naya contact shamil karein', 'udhars'); return; }
  const totalReceivable = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
  const totalPayable = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Receivable</div><div class="stat-value">${fmtMoney(totalReceivable)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Payable</div><div class="stat-value">${fmtMoney(totalPayable)}</div></div>
  </div><div class="section-title">Contacts</div><div class="card">` +
    DATA.udhars.map(u=>{ const bal = udharBalance(u); const level = bal>0?'green':bal<0?'red':'amber';
      return `<div class="list-item"><div class="avatar" style="background:#ede9fe;color:#7c3aed">${icon('users')}</div>
      <div class="meta"><div class="t">${escapeHtml(u.name)}</div><div class="s">${escapeHtml(u.phone||'')}</div></div>
      <span class="badge ${level}">${bal===0?'Settled':fmtMoney(Math.abs(bal))}</span></div>`;
    }).join('') + `</div>`;
  if(DATA.udhars.length){
    html += `<div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="exportUdharPDF()">${ICN.print} PDF</button>
      <button class="btn btn-outline btn-sm" onclick="exportUdharCSV()">${ICN.down} CSV</button>
    </div>`;
  }
  $('#viewRoot').innerHTML = html;
}
function openUdharForm(editId){
  const editItem = editId ? DATA.udhars.find(x=>x.id===editId) : null;
  const fields = [{key:'name', label:'Contact Name', type:'text', required:true},{key:'phone', label:'Phone', type:'text'},{key:'notes', label:'Notes', type:'textarea'}];
  openSheet(`${sheetHeader((editItem?'Edit ':'Add ')+'Contact')}
    <form id="uForm">${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
    <div style="display:flex;gap:10px">
      ${editItem?`<button type="button" class="btn btn-danger" id="delU">${ICN.trash}</button>`:''}
      <button type="submit" class="btn btn-primary btn-block">${editItem?'Update':'Save'}</button>
    </div></form>`, (root)=>{
    $('#uForm', root).addEventListener('submit', e=>{
      e.preventDefault(); const vals = readForm(e.target, fields);
      if(editItem) Object.assign(editItem, vals); else DATA.udhars.push({id:uid(), ...vals});
      saveData(); closeSheet(); toast('Saved'); renderRoute();
    });
    if(editItem) $('#delU', root).addEventListener('click', ()=>{
      confirmDialog('Delete?', ()=>{ DATA.udhars = DATA.udhars.filter(x=>x.id!==editId); DATA.udharTx = DATA.udharTx.filter(x=>x.udharId!==editId); saveData(); closeSheet(); renderRoute(); });
    });
  });
}

/* ---- GENERIC LIST RENDERER ---- */
function renderGenericList(arrayKey, title, iconKey, color){
  let items = DATA[arrayKey] || [];
  // Search
  if(SEARCH_QUERY){
    const q = SEARCH_QUERY.toLowerCase();
    items = items.filter(item=>{
      const name = (item.name || item.title || item.task || item.description || '').toLowerCase();
      return name.includes(q);
    });
  }
  if(!items.length && !SEARCH_QUERY){ $('#viewRoot').innerHTML = emptyState(iconKey, 'Koi record nahi', 'Naya entry add karein', arrayKey); return; }
  let html = renderSearchBar();
  html += `<div class="section-title">${title} (${items.length})</div><div class="card">`;
  if(!items.length){ html += `<div style="padding:12px;color:var(--text-dim);font-size:13px">Search mein koi match nahi mila.</div>`; }
  items.forEach(item => {
    const name = item.name || item.title || item.task || item.description || 'Item';
    html += `<div class="list-item" onclick="openGenericForm('${arrayKey}','${item.id}')">
      <div class="avatar" style="background:${color}20;color:${color}">${icon(iconKey)}</div>
      <div class="meta"><div class="t">${escapeHtml(name)}</div></div>${icon('chevron')}
    </div>`;
  });
  html += `</div>`;
  // Export buttons
  if(DATA[arrayKey] && DATA[arrayKey].length){
    html += `<div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-outline btn-sm" onclick="exportModulePDF('${arrayKey}','${title}','${iconKey}','${color}')">${ICN.print} PDF</button>
      <button class="btn btn-outline btn-sm" onclick="exportModuleCSV('${arrayKey}','${title}')">${ICN.down} CSV</button>
    </div>`;
  }
  $('#viewRoot').innerHTML = html;
  const si = $('#searchInput');
  if(si) si.addEventListener('input', (e)=>{ SEARCH_QUERY = e.target.value; renderGenericList(arrayKey, title, iconKey, color); });
}

/* ---- FINANCIAL OVERVIEW (NEW) ---- */
function renderFinancialOverview(){
  const mKey = monthKey();
  const expThis = DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((s,e)=>s+Number(e.amount||0),0);
  const incThis = DATA.incomes.filter(i=>monthKey(i.date)===mKey).reduce((s,i)=>s+Number(i.amount||0),0);
  const rentCollected = DATA.rentPayments.filter(p=>p.status==='Paid' && monthKey(p.month)===mKey).reduce((s,p)=>s+Number(p.amount||0),0);
  const rentPending = DATA.rentPayments.filter(p=>p.status!=='Paid').reduce((s,p)=>s+Number(p.amount||0),0);
  const udharRecv = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
  const udharPay = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
  const bizIncome = DATA.businessEntries.filter(b=>b.type==='Sale'||b.type==='Income').reduce((s,b)=>s+Number(b.amount||0),0);
  const bizExpense = DATA.businessEntries.filter(b=>b.type==='Purchase'||b.type==='Expense').reduce((s,b)=>s+Number(b.amount||0),0);
  const goldValue = DATA.goldInvestments.reduce((s,g)=>s+(Number(g.weight||0)*Number(g.pricePerGram||0)),0);
  const totalSavings = DATA.goals.reduce((s,g)=>s+Number(g.saved||0),0);

  let html = `<div class="grid-2">
    <div class="stat-card"><div class="stat-label">Net This Month</div><div class="stat-value">${fmtMoney(incThis-expThis)}</div></div>
    <div class="stat-card blue"><div class="stat-label">Gold/Silver Value</div><div class="stat-value">${fmtMoney(goldValue)}</div></div>
  </div>
  <div class="grid-2" style="margin-top:12px">
    <div class="stat-card ${rentPending?'warn':''}"><div class="stat-label">Rent Collected</div><div class="stat-value">${fmtMoney(rentCollected)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Rent Pending</div><div class="stat-value">${fmtMoney(rentPending)}</div></div>
  </div>
  <div class="grid-2" style="margin-top:12px">
    <div class="stat-card" style="background:linear-gradient(135deg,#7c3aed,#a855f7)"><div class="stat-label">Business Net</div><div class="stat-value">${fmtMoney(bizIncome-bizExpense)}</div></div>
    <div class="stat-card" style="background:linear-gradient(135deg,#0891b2,#22d3ee)"><div class="stat-label">Total Savings</div><div class="stat-value">${fmtMoney(totalSavings)}</div></div>
  </div>`;

  html += `<div class="section-title">Udhar Summary</div>
  <div class="grid-2">
    <div class="stat-card"><div class="stat-label">Receivable</div><div class="stat-value">${fmtMoney(udharRecv)}</div></div>
    <div class="stat-card danger"><div class="stat-label">Payable</div><div class="stat-value">${fmtMoney(udharPay)}</div></div>
  </div>`;

  // Expense by category chart
  const byCat = {};
  DATA.expenses.filter(e=>monthKey(e.date)===mKey).forEach(e=>{ byCat[e.category] = (byCat[e.category]||0) + Number(e.amount||0); });
  if(Object.keys(byCat).length){
    html += `<div class="section-title">Expense Breakdown (This Month)</div><div class="card">`;
    Object.entries(byCat).sort((a,b)=>b[1]-a[1]).forEach(([cat,amt])=>{
      const pct = expThis? Math.round(amt/expThis*100):0;
      html += `<div style="padding:8px 0"><div class="card-row" style="justify-content:space-between;margin-bottom:6px">
        <span style="font-size:13px;font-weight:700">${cat}</span>
        <span style="font-size:12px;color:var(--text-dim)">${fmtMoney(amt)} (${pct}%)</span></div>
        <div class="progress"><div style="width:${pct}%;background:${CATEGORY_COLORS[cat]}"></div></div></div>`;
    });
    html += `</div>`;
  }

  html += `<div style="display:flex;gap:8px;margin-top:12px">
    <button class="btn btn-outline btn-sm" onclick="exportFinancialOverviewPDF()">${ICN.print} Full Report PDF</button>
  </div>`;

  $('#viewRoot').innerHTML = html;
}

/* ---- EXPORT FUNCTIONS (Separate PDF per module) ---- */
function exportBudgetsPDF(){
  const data = {
    title: 'Budgets Report',
    summary: [
      {label:'Total Budgets', value: String(DATA.budgets.length), color:'#059669'},
      {label:'Total Estimated', value: fmtMoney(DATA.budgets.reduce((s,b)=>s+Number(b.estimated||0),0)), color:'#0ea5e9'},
    ],
    sections: [{
      title: 'All Budgets',
      headers: ['Name', 'Category', 'Period', 'Estimated', 'Spent', '%'],
      rows: DATA.budgets.map(b=>{
        const spent = budgetSpent(b);
        const est = budgetEffective(b);
        const pct = est>0 ? Math.min(100, Math.round(spent/est*100)) : 0;
        return [b.name, b.category||'-', b.period||'-', fmtMoney(est), fmtMoney(spent), pct+'%'];
      })
    }]
  };
  downloadModulePDF(data, `GharSaz360-Budgets-${todayISO()}.pdf`);
}
function exportBudgetsCSV(){
  exportCSV(`GharSaz360-Budgets-${todayISO()}.csv`,
    ['Name','Category','Period','Estimated','Spent'],
    DATA.budgets.map(b=>[b.name, b.category, b.period, b.estimated, budgetSpent(b)])
  );
}
function exportExpensesPDF(){
  const mKey = monthKey();
  const monthExp = DATA.expenses.filter(e=>monthKey(e.date)===mKey);
  const total = monthExp.reduce((s,e)=>s+Number(e.amount||0),0);
  const data = {
    title: 'Expense Report',
    summary: [
      {label:'Month', value: mKey, color:'#059669'},
      {label:'Total', value: fmtMoney(total), color:'#dc2626'},
      {label:'Entries', value: String(monthExp.length), color:'#0ea5e9'},
    ],
    sections: [{
      title: 'Expense Entries',
      headers: ['Date', 'Category', 'Sub-Category', 'Amount', 'Note'],
      rows: monthExp.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).map(e=>[
        fmtDate(e.date), e.category, e.subcategory, fmtMoney(e.amount), e.note||''
      ])
    }]
  };
  downloadModulePDF(data, `GharSaz360-Expenses-${mKey}.pdf`);
}
function exportExpensesCSV(){
  const mKey = monthKey();
  const monthExp = DATA.expenses.filter(e=>monthKey(e.date)===mKey);
  exportCSV(`GharSaz360-Expenses-${mKey}.csv`,
    ['Date','Category','SubCategory','Amount','Note','Recurring'],
    monthExp.map(e=>[e.date, e.category, e.subcategory, e.amount, e.note||'', e.recurring||''])
  );
}
function exportRentPDF(){
  const data = {
    title: 'Rent Report',
    summary: [
      {label:'Properties', value: String(DATA.properties.length), color:'#059669'},
      {label:'Tenants', value: String(DATA.tenants.length), color:'#0ea5e9'},
    ],
    sections: [
      {
        title: 'Properties',
        headers: ['Name', 'Type'],
        rows: DATA.properties.map(p=>[p.name, p.type||'-'])
      },
      {
        title: 'Tenants',
        headers: ['Name', 'Property', 'Monthly Rent', 'Phone'],
        rows: DATA.tenants.map(t=>{
          const prop = DATA.properties.find(p=>p.id===t.propertyId);
          return [t.name, prop?prop.name:'-', fmtMoney(t.monthlyRent), t.phone||'-'];
        })
      },
      {
        title: 'Payment History',
        headers: ['Tenant', 'Month', 'Amount', 'Status'],
        rows: DATA.rentPayments.sort((a,b)=>String(b.month||'').localeCompare(String(a.month||''))).map(p=>{
          const t = DATA.tenants.find(x=>x.id===p.tenantId);
          return [t?t.name:'-', p.month||'-', fmtMoney(p.amount), p.status||'-'];
        })
      }
    ]
  };
  downloadModulePDF(data, `GharSaz360-Rent-${todayISO()}.pdf`);
}
function exportRentCSV(){
  exportCSV(`GharSaz360-Rent-${todayISO()}.csv`,
    ['Tenant','Month','Amount','Status'],
    DATA.rentPayments.map(p=>{
      const t = DATA.tenants.find(x=>x.id===p.tenantId);
      return [t?t.name:'', p.month, p.amount, p.status];
    })
  );
}
function exportUdharPDF(){
  const sections = DATA.udhars.map(u=>{
    const bal = udharBalance(u);
    const txs = DATA.udharTx.filter(t=>t.udharId===u.id);
    return {
      title: `${u.name} (Balance: ${fmtMoney(bal)})`,
      headers: ['Date', 'Type', 'Amount', 'Status', 'Note'],
      rows: txs.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).map(t=>[
        fmtDate(t.date), t.type, fmtMoney(t.amount), t.status||'-', t.note||''
      ])
    };
  });
  const totalRecv = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
  const totalPay = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
  const data = {
    title: 'Udhar Khata Report',
    summary: [
      {label:'Receivable', value: fmtMoney(totalRecv), color:'#059669'},
      {label:'Payable', value: fmtMoney(totalPay), color:'#dc2626'},
      {label:'Contacts', value: String(DATA.udhars.length), color:'#8b5cf6'},
    ],
    sections
  };
  downloadModulePDF(data, `GharSaz360-UdharKhata-${todayISO()}.pdf`);
}
function exportUdharCSV(){
  const rows = [];
  DATA.udhars.forEach(u=>{
    DATA.udharTx.filter(t=>t.udharId===u.id).forEach(t=>{
      rows.push([u.name, u.phone||'', t.date, t.type, t.amount, t.status||'', t.note||'']);
    });
  });
  exportCSV(`GharSaz360-UdharKhata-${todayISO()}.csv`,
    ['Contact','Phone','Date','Type','Amount','Status','Note'], rows);
}

/* Generic module PDF export */
function exportModulePDF(arrayKey, title, iconKey, color){
  const items = DATA[arrayKey] || [];
  const schema = SCHEMAS[arrayKey];
  if(!schema) return;
  const headers = schema.fields.filter(f=>f.type!=='textarea').map(f=>f.label);
  const rows = items.map(item=> schema.fields.filter(f=>f.type!=='textarea').map(f=>{
    const val = item[f.key];
    if(f.type==='number') return fmtMoney(val);
    if(f.type==='date') return fmtDate(val);
    return val || '-';
  }));
  const data = {
    title: title + ' Report',
    summary: [{label:'Total Entries', value: String(items.length), color}],
    sections: [{title, headers, rows}]
  };
  downloadModulePDF(data, `GharSaz360-${title.replace(/\s+/g,'-')}-${todayISO()}.pdf`);
}
function exportModuleCSV(arrayKey, title){
  const items = DATA[arrayKey] || [];
  const schema = SCHEMAS[arrayKey];
  if(!schema) return;
  const headers = schema.fields.map(f=>f.label);
  const rows = items.map(item=> schema.fields.map(f=>{
    const val = item[f.key];
    if(f.type==='date') return fmtDate(val);
    return val || '';
  }));
  exportCSV(`GharSaz360-${title.replace(/\s+/g,'-')}-${todayISO()}.csv`, headers, rows);
}

/* Financial Overview PDF */
function exportFinancialOverviewPDF(){
  const mKey = monthKey();
  const expThis = DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((s,e)=>s+Number(e.amount||0),0);
  const incThis = DATA.incomes.filter(i=>monthKey(i.date)===mKey).reduce((s,i)=>s+Number(i.amount||0),0);
  const rentCollected = DATA.rentPayments.filter(p=>p.status==='Paid').reduce((s,p)=>s+Number(p.amount||0),0);
  const udharRecv = DATA.udhars.reduce((s,u)=>s+Math.max(0,udharBalance(u)),0);
  const udharPay = DATA.udhars.reduce((s,u)=>s+Math.max(0,-udharBalance(u)),0);
  const bizIncome = DATA.businessEntries.filter(b=>b.type==='Sale'||b.type==='Income').reduce((s,b)=>s+Number(b.amount||0),0);
  const bizExpense = DATA.businessEntries.filter(b=>b.type==='Purchase'||b.type==='Expense').reduce((s,b)=>s+Number(b.amount||0),0);
  const goldValue = DATA.goldInvestments.reduce((s,g)=>s+(Number(g.weight||0)*Number(g.pricePerGram||0)),0);

  const data = {
    title: 'Financial Overview - Complete Report',
    summary: [
      {label:'Month Income', value: fmtMoney(incThis), color:'#059669'},
      {label:'Month Expense', value: fmtMoney(expThis), color:'#dc2626'},
      {label:'Net', value: fmtMoney(incThis-expThis), color:'#0ea5e9'},
    ],
    sections: [
      {
        title: 'Income & Expense Summary',
        headers: ['Module', 'Income', 'Expense', 'Net'],
        rows: [
          ['Monthly Income/Expense', fmtMoney(incThis), fmtMoney(expThis), fmtMoney(incThis-expThis)],
          ['Rent Collected', fmtMoney(rentCollected), '-', fmtMoney(rentCollected)],
          ['Business', fmtMoney(bizIncome), fmtMoney(bizExpense), fmtMoney(bizIncome-bizExpense)],
          ['Udhar Receivable', fmtMoney(udharRecv), '-', fmtMoney(udharRecv)],
          ['Udhar Payable', '-', fmtMoney(udharPay), fmtMoney(-udharPay)],
        ]
      },
      {
        title: 'Investments & Savings',
        headers: ['Category', 'Value'],
        rows: [
          ['Gold/Silver Holdings', fmtMoney(goldValue)],
          ['Savings Goals Progress', fmtMoney(DATA.goals.reduce((s,g)=>s+Number(g.saved||0),0))],
        ]
      },
      {
        title: 'Expense by Category (This Month)',
        headers: ['Category', 'Amount', '% of Total'],
        rows: Object.entries(DATA.expenses.filter(e=>monthKey(e.date)===mKey).reduce((acc,e)=>{acc[e.category]=(acc[e.category]||0)+Number(e.amount||0);return acc;},{}))
          .sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>[cat, fmtMoney(amt), expThis?Math.round(amt/expThis*100)+'%':'0%'])
      }
    ]
  };
  downloadModulePDF(data, `GharSaz360-FinancialOverview-${mKey}.pdf`);
}

/* ---- SETTINGS ---- */
function renderSettings(){
  let html = `<div class="card">
    <div class="section-title" style="margin-top:0">Appearance</div>
    <div class="card-row" style="justify-content:space-between;padding:8px 0">
      <span style="font-weight:700">Dark Mode</span>
      <button class="btn btn-sm btn-outline" onclick="toggleTheme()">${SETTINGS.theme==='dark'?'Light':'Dark'}</button>
    </div>
    <div class="field" style="margin-top:12px"><label>Currency</label>
      <select id="currencySel" onchange="SETTINGS.currency=this.value;saveSettings();toast('Updated')">
        ${Object.entries(CURRENCIES).map(([code,c])=>`<option value="${code}" ${SETTINGS.currency===code?'selected':''}>${c.symbol} - ${c.name}</option>`).join('')}
      </select></div>
  </div>
  <div class="card">
    <div class="section-title" style="margin-top:0">Backup & Restore</div>
    <button class="btn btn-primary btn-block" style="margin-bottom:10px" onclick="exportJSON()">${ICN.down} Export JSON Backup</button>
    <button class="btn btn-outline btn-block" style="margin-bottom:10px" onclick="document.getElementById('importFile').click()">${ICN.up} Import JSON Backup</button>
    <input type="file" id="importFile" accept=".json" style="display:none" onchange="importJSON(event)">
    <div class="divider"></div>
    <button class="btn btn-outline btn-block" style="margin-bottom:10px" onclick="exportAllPDF()">${ICN.print} Export ALL Data as PDF</button>
    <div class="divider"></div>
    <button class="btn btn-danger btn-block" onclick="if(confirm('ALL data erase ho jayega! Continue?')){localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(SETTINGS_KEY);location.reload();}">Erase All App Data</button>
  </div>
  <div class="card" style="text-align:center">
    <div style="font-size:13px;color:var(--text-dim)">GharSaz 360 v4.0 Enhanced<br>100% Offline · No Data Collection<br>Separate PDF per module</div>
  </div>`;
  $('#viewRoot').innerHTML = html;
}
function toggleTheme(){
  SETTINGS.theme = SETTINGS.theme==='dark'?'light':'dark';
  document.documentElement.classList.toggle('dark', SETTINGS.theme==='dark');
  saveSettings(); renderRoute();
}
function exportJSON(){
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `GharSaz360-backup-${todayISO()}.json`; a.click();
  toast('Backup downloaded');
}
function importJSON(event){
  const file = event.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{ DATA = Object.assign(defaultState(), JSON.parse(e.target.result)); saveData(); toast('Data restored'); renderRoute(); }
    catch(err){ toast('Invalid backup file'); }
  };
  reader.readAsText(file);
}
function exportAllPDF(){
  const data = {
    title: 'GharSaz 360 - Complete Data Export',
    summary: [
      {label:'Export Date', value: fmtDate(todayISO()), color:'#059669'},
      {label:'Total Modules', value: String(ALL_MODULES.length), color:'#0ea5e9'},
    ],
    sections: []
  };
  // Add each module with data as a section
  Object.keys(SCHEMAS).forEach(key=>{
    const items = DATA[key];
    if(items && items.length){
      const schema = SCHEMAS[key];
      const headers = schema.fields.filter(f=>f.type!=='textarea').map(f=>f.label);
      const rows = items.map(item=> schema.fields.filter(f=>f.type!=='textarea').map(f=>{
        const val = item[f.key];
        if(f.type==='number') return fmtMoney(val);
        if(f.type==='date') return fmtDate(val);
        return val || '-';
      }));
      data.sections.push({title: schema.title + 's', headers, rows});
    }
  });
  downloadModulePDF(data, `GharSaz360-FullExport-${todayISO()}.pdf`);
}

/* ---- ROUTER ---- */
function renderRoute(){
  renderTopbar(); renderBottomNav(); renderFab();
  const routes = {
    dashboard: renderDashboard, budgets: renderBudgets, expenses: renderExpenses,
    rent: renderRent, udhar: renderUdhar,
    construction: ()=>renderGenericList('constructionProjects','Construction Projects','hammer','#b45309'),
    salary: ()=>renderGenericList('employees','Employees','briefcase','#4f46e5'),
    labour: ()=>renderGenericList('labourWorkers','Labour Workers','hardhat','#c2410c'),
    todos: ()=>renderGenericList('todos','Tasks','checksquare','#0e7490'),
    bills: ()=>renderGenericList('bills','Bills','bell','#b45309'),
    familyMembers: ()=>renderGenericList('familyMembers','Family Members','users','#db2777'),
    loans: ()=>$('#viewRoot').innerHTML = emptyState('bank','Loan tracker','Coming soon',''),
    subscriptions: ()=>renderGenericList('subscriptions','Subscriptions','repeat','#7c3aed'),
    insurancePolicies: ()=>$('#viewRoot').innerHTML = emptyState('umbrella','Insurance','Coming soon',''),
    healthRecords: ()=>$('#viewRoot').innerHTML = emptyState('heartpulse','Health Records','Coming soon',''),
    importantDates: ()=>renderGenericList('importantDates','Important Dates','gift','#be185d'),
    assets: ()=>renderGenericList('assets','Assets','box','#0369a1'),
    maintenance: ()=>renderGenericList('maintenanceLogs','Maintenance','wrench','#475569'),
    vehicle: ()=>renderGenericList('vehicles','Vehicles','car','#dc2626'),
    zakat: ()=>$('#viewRoot').innerHTML = emptyState('moonstar','Zakat & Charity','Coming soon',''),
    solar: ()=>$('#viewRoot').innerHTML = emptyState('sunbolt','Solar & Utility','Coming soon',''),
    pantry: ()=>renderGenericList('pantryItems','Pantry','basket','#65a30d'),
    vault: ()=>$('#viewRoot').innerHTML = emptyState('shield','Document Vault','Coming soon',''),
    events: ()=>renderGenericList('events','Events','calendarheart','#db2777'),
    goals: ()=>renderGenericList('goals','Savings Goals','target','#0891b2'),
    // NEW MODULES
    goldInvestments: ()=>renderGenericList('goldInvestments','Gold/Silver Investments','gold','#d97706'),
    businessEntries: ()=>renderGenericList('businessEntries','Business/Shop Entries','shop','#7c3aed'),
    waterTanks: ()=>renderGenericList('waterTanks','Water Tanks','droplet','#0284c7'),
    gardenPlants: ()=>renderGenericList('gardenPlants','Garden & Plants','plant','#16a34a'),
    guestExpenses: ()=>renderGenericList('guestExpenses','Guest/Hospitality Expenses','gift','#e11d48'),
    religiousExpenses: ()=>renderGenericList('religiousExpenses','Religious Expenses','moonstar','#0f766e'),
    financialOverview: renderFinancialOverview,
    settings: renderSettings,
    more: ()=>{ $('#viewRoot').innerHTML = `<div class="section-title">All Modules</div>` + moreGrid(); },
  };
  (routes[ROUTE] || routes.dashboard)();
}

/* ---- INIT ---- */
function init(){
  if(SETTINGS.theme==='dark') document.documentElement.classList.add('dark');
  $('#menuBtn').innerHTML = ICN.menu;
  $('#themeBtn').innerHTML = SETTINGS.theme==='dark' ? ICN.sun : ICN.moon;
  $('#settingsBtn').innerHTML = ICN.settings;
  $('#fabAdd').innerHTML = ICN.plus;
  $('#fabWa').innerHTML = ICN.wa;
  $('#pdfBtn').innerHTML = ICN.print;
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#settingsBtn').addEventListener('click', ()=>navigate('settings'));
  $('#pdfBtn').addEventListener('click', ()=>{
    // Generate PDF for current module
    const mod = ALL_MODULES.find(m=>m.id===ROUTE);
    if(!mod) return;
    if(ROUTE==='expenses') exportExpensesPDF();
    else if(ROUTE==='budgets') exportBudgetsPDF();
    else if(ROUTE==='rent') exportRentPDF();
    else if(ROUTE==='udhar') exportUdharPDF();
    else if(ROUTE==='financialOverview') exportFinancialOverviewPDF();
    else {
      const schema = SCHEMAS[ROUTE];
      if(schema) exportModulePDF(ROUTE, mod.label, mod.icon, mod.color);
    }
  });
  $('#fabWa').addEventListener('click', ()=>{
    window.open(`https://wa.me/${SETTINGS.whatsapp.replace(/\D/g,'')}`, '_blank');
  });
  const hash = location.hash.replace('#','') || 'dashboard';
  ROUTE = hash;
  renderRoute();
  setTimeout(()=>{
    $('#splash').classList.add('hide');
    $('#app').classList.add('ready');
    setTimeout(()=>$('#splash').style.display='none', 600);
  }, 2000);
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
}
document.addEventListener('DOMContentLoaded', init);
