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
};
function icon(name, color){ return `<span style="color:${color||'currentColor'};display:flex">${ICN[name]||''}</span>`; }

/* ---------------------------------------------------------------------- *
 * 2. UTILITIES
 * ---------------------------------------------------------------------- */
const $ = (sel, root) => (root||document).querySelector(sel);
const $$ = (sel, root) => Array.from((root||document).querySelectorAll(sel));
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
function fmtMoney(n){
  n = Number(n)||0;
  return 'Rs ' + n.toLocaleString('en-PK', {maximumFractionDigits:0});
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
function downloadFile(filename, content, mime){
  const blob = new Blob([content], {type:mime||'application/octet-stream'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 2000);
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
}
let SETTINGS = loadSettings();
function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    return Object.assign({theme:'light', whatsapp:'+923065772734', currency:'Rs'}, raw?JSON.parse(raw):{});
  }catch(e){ return {theme:'light', whatsapp:'+923065772734', currency:'Rs'}; }
}
function saveSettings(){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); }

/* ---------------------------------------------------------------------- *
 * 4. EXPENSE CATEGORY TREE (preset, deeply nested)
 * ---------------------------------------------------------------------- */
const CATEGORY_TREE = {
  'Grocery & Pantry': ['Vegetables','Fruits','Milk/Dairy','Meat/Chicken','Grains/Flour','Spices/Oils','Beverages','Snacks','Cleaning Supplies','Toiletries'],
  'Health & Medical': ['Doctor Consultations','Medicines','Lab Tests/Reports','Emergency Hospitalization','Dental','Health Insurance','Pharmacy Items'],
  'Daily Living': ['Electricity Bill','Gas Bill','Water/Trash','Internet/Wifi','Mobile Load/Packages','Fuel/Petrol','Vehicle Repair','Maid/Servant Salary','Kids Pocket Money','School Fees','Home Maintenance'],
  'Leisure & Shopping': ['Dining Out','Clothes','Footwear','Gifts','Entertainment'],
};
const CATEGORY_COLORS = {
  'Grocery & Pantry':'#10b981','Health & Medical':'#ef4444','Daily Living':'#0ea5e9','Leisure & Shopping':'#8b5cf6'
};

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

function renderTopbar(){
  const mod = ALL_MODULES.find(m=>m.id===ROUTE) || ALL_MODULES[0];
  $('#pageTitle').textContent = mod.label;
  const subs = {
    dashboard:'Aaj ka khulasa', budgets:'Estimated vs actual', expenses:'Sab kharchay ek jaga',
    rent:'Properties, tenants, receipts', udhar:'Udhar len-den ledger', construction:'Material & labour',
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
      ${icon(n.icon)}<span class="dot"></span>${n.label}
    </button>`;
  }).join('');
  $$('.nav-item', nav).forEach(btn=>btn.addEventListener('click', ()=>navigate(btn.dataset.nav)));
}
function renderFab(){
  const map = {
    budgets:'budgets', expenses:'expenses', rent:'rent-picker', udhar:'udhars',
    construction:'construction-picker', assets:'assets', maintenance:'maintenanceLogs',
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
};

function handleFab(route){
  const pickers = {
    'rent-picker': [['Add Property','properties'],['Add Tenant','tenants'],['Record Payment','rentPayments']],
    'construction-picker': [['New Project','constructionProjects'],['Add Material Expense','materials'],['Add Labourer','labourers']],
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
        else DATA[arrayKey].push({id:uid(), ...vals});
        saveData(); closeSheet(); toast('Saved'); renderRoute();
      });
      if(editItem){
        $('#delBtn', root).addEventListener('click', ()=>{
          if(confirm('Delete this entry?')){
            DATA[arrayKey] = DATA[arrayKey].filter(x=>x.id!==editId);
            saveData(); closeSheet(); toast('Deleted'); renderRoute();
          }
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
function renderDashboard(){
  const {exp, inc} = computeMonthTotals();
  const pendingRent = DATA.rentPayments.filter(p=>p.status!=='Paid').length;
  const pendingUdhar = DATA.udhars.filter(u=>udharBalance(u)!==0).length;
  const upcomingMaint = DATA.maintenanceLogs.filter(m=>{
    const d = daysUntil(m.nextDate); return d!==null && d<=14 && d>=0;
  }).length;
  const warrantySoon = DATA.assets.filter(a=>{
    const d = daysUntil(a.warrantyExpiry); return d!==null && d<=30 && d>=0;
  }).length;

  let html = `
  <div class="grid-2">
    <div class="stat-card">
      <div class="stat-label">This Month Expense</div>
      <div class="stat-value">${fmtMoney(exp)}</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-label">This Month Income</div>
      <div class="stat-value">${fmtMoney(inc)}</div>
    </div>
  </div>
  <div class="grid-2" style="margin-top:12px">
    <div class="stat-card ${pendingRent?'warn':''}">
      <div class="stat-label">Rent Pending</div>
      <div class="stat-value">${pendingRent}</div>
    </div>
    <div class="stat-card ${pendingUdhar?'danger':''}">
      <div class="stat-label">Udhar Open</div>
      <div class="stat-value">${pendingUdhar}</div>
    </div>
  </div>`;

  if(upcomingMaint || warrantySoon){
    html += `<div class="section-title">Reminders</div><div class="card">`;
    if(upcomingMaint) html += reminderRow('wrench','#475569', upcomingMaint+' maintenance task(s) due in 14 days', ()=>navigate('maintenance'));
    if(warrantySoon) html += reminderRow('box','#0369a1', warrantySoon+' warranty(ies) expiring in 30 days', ()=>navigate('assets'));
    html += `</div>`;
  }

  html += `<div class="section-title">Budgets Overview</div>`;
  if(!DATA.budgets.length){
    html += emptyState('wallet','Koi budget nahi bana', 'Apna pehla budget banayen taake kharche track ho sakein', 'budgets');
  } else {
    html += `<div class="card">` + DATA.budgets.slice(0,3).map(budgetRow).join('') + `</div>`;
  }

  html += `<div class="section-title">Quick Access</div><div class="grid-4">`;
  ['expenses','rent','udhar','zakat','vehicle','goals','vault','settings'].forEach(id=>{
    const m = ALL_MODULES.find(x=>x.id===id);
    html += moduleTile(m);
  });
  html += `</div>`;

  $('#viewRoot').innerHTML = html;
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
function moduleTile(m){
  return `<div class="module-tile" onclick="navigate('${m.id}')">
    <div class="ic" style="background:${m.color}20;color:${m.color}">${icon(m.icon)}</div>
    <span>${m.label}</span>
  </div>`;
}
function moreGrid(){
  return `<div class="grid-3">${ALL_MODULES.filter(m=>m.id!=='dashboard').map(moduleTile).join('')}</div>`;
}

/* ---------------------------------------------------------------------- *
 * 9. BUDGETS & INCOME
 * ---------------------------------------------------------------------- */
function budgetSpent(b){
  return DATA.expenses.filter(e=>e.budgetId===b.id).reduce((s,e)=>s+Number(e.amount||0),0);
}
function budgetRow(b){
  const spent = budgetSpent(b);
  const pct = b.estimated? Math.min(100, Math.round(spent/b.estimated*100)) : 0;
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
    <div class="card-sub" style="margin-top:6px">${fmtMoney(spent)} spent of ${fmtMoney(b.estimated)}</div>
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
  ];
  openSheet(`${sheetHeader((editItem?'Edit ':'New ')+'Budget')}
    <form id="bForm">
      ${fields.map(f=>renderField(f, editItem?editItem[f.key]:'')).join('')}
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
        if(confirm('Delete budget?')){ DATA.budgets = DATA.budgets.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
        if(confirm('Delete?')){ DATA.incomes = DATA.incomes.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
    html += `<div class="card">` + DATA.incomes.slice().reverse().map(i=>`
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
        if(confirm('Delete expense?')){ DATA.expenses = DATA.expenses.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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

  const list = monthExpenses.filter(e=>expenseFilter==='All'||e.category===expenseFilter).slice().reverse();
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
        if(confirm('Delete property? Linked tenants will remain but unlinked.')){
          DATA.properties = DATA.properties.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute();
        }
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
        if(confirm('Delete tenant?')){ DATA.tenants = DATA.tenants.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
      if(confirm('Delete this payment record?')){ DATA.rentPayments = DATA.rentPayments.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
  const pays = DATA.rentPayments.slice().reverse();
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
        if(confirm('Delete this contact and all its transactions?')){
          DATA.udhars = DATA.udhars.filter(x=>x.id!==editId);
          DATA.udharTx = DATA.udharTx.filter(x=>x.udharId!==editId);
          saveData(); closeSheet(); renderRoute();
        }
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
  const txs = udharTxList(udharId).slice().reverse();
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
        if(confirm('Delete project?')){ DATA.constructionProjects = DATA.constructionProjects.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
        if(confirm('Delete worker?')){ DATA.labourers = DATA.labourers.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
    const mats = DATA.materials.slice().reverse();
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
        if(confirm('Delete entry?')){ DATA.fuelLogs = DATA.fuelLogs.filter(x=>x.id!==editId); saveData(); closeSheet(); renderRoute(); }
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
    html += `<div class="card">` + DATA.charityRecords.slice().reverse().map(c=>`
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
          if(confirm('Delete this vault item?')){
            DATA.vaultItems = DATA.vaultItems.filter(x=>x.id!==id);
            saveData(); closeSheet(); renderRoute();
          }
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
  toast('JSON backup exported');
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
  toast('CSV exported');
}
function importJSON(file){
  const reader = new FileReader();
  reader.onload = (e)=>{
    try{
      const parsed = JSON.parse(e.target.result);
      if(typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('invalid');
      DATA = Object.assign(defaultState(), parsed);
      saveData(); toast('Data imported successfully'); renderRoute();
    }catch(err){ toast('Invalid backup file'); }
  };
  reader.readAsText(file);
}
function wipeAllData(){
  if(confirm('Yeh permanent hai — sab data delete ho jayega. Pakka?')){
    if(confirm('Aakhri tasdeeq: Sab kuch delete karna hai?')){
      DATA = defaultState(); VAULT_KEY = null; saveData(); toast('All data cleared'); renderRoute();
    }
  }
}
function renderSettings(){
  const dataSize = new Blob([JSON.stringify(DATA)]).size;
  let html = `
  <div class="card">
    <div class="card-title">Storage Used</div>
    <div class="card-sub" style="margin-top:4px">${(dataSize/1024).toFixed(1)} KB stored locally on this device — nothing leaves your phone.</div>
  </div>

  <div class="section-title">Backup &amp; Restore</div>
  <div class="card">
    <button class="btn btn-primary btn-block" onclick="exportJSON()">${ICN.down} Export JSON Backup</button>
    <div style="height:10px"></div>
    <button class="btn btn-outline btn-block" onclick="exportCSV()">${ICN.down} Export CSV</button>
    <div style="height:10px"></div>
    <label class="btn btn-ghost btn-block" style="cursor:pointer">
      ${ICN.up} Import JSON Backup
      <input type="file" accept="application/json" style="display:none" id="importFile">
    </label>
    <div class="help-text">Import se pehle current data ka backup zaroor le lein — import mojooda data ko overwrite karta hai.</div>
  </div>

  <div class="section-title">Google Drive Sync</div>
  <div class="card">
    <div class="card-sub">Google Drive API se personal backup sync karne ke liye apni Google Cloud project mein ek OAuth Client ID banayen aur <kbd>guide.html</kbd> mein diye gaye steps follow karein. Ye app kisi bhi external server ko data nahi bhejta — sync direct aapke apne Google Drive account se hota hai.</div>
  </div>

  <div class="section-title">Appearance</div>
  <div class="card card-row" style="justify-content:space-between">
    <div class="card-title">Dark Mode</div>
    <button class="btn btn-sm btn-outline" id="toggleThemeSettings">${document.documentElement.classList.contains('dark')?'Switch to Light':'Switch to Dark'}</button>
  </div>

  <div class="section-title">Support</div>
  <div class="card">
    <button class="btn btn-block" style="background:#25D366;color:#fff" onclick="openWhatsAppSupport()">${ICN.wa} Contact Developer on WhatsApp</button>
  </div>

  <div class="section-title">Danger Zone</div>
  <div class="card">
    <button class="btn btn-danger btn-block" onclick="wipeAllData()">${ICN.trash} Erase All App Data</button>
  </div>

  <div style="text-align:center;margin-top:24px;font-size:11px;color:var(--text-dim)">
    GharSaz 360 · v1.0 · 100% Offline · <a href="privacy-policy.html" target="_blank" style="text-decoration:underline">Privacy Policy</a> · <a href="guide.html" target="_blank" style="text-decoration:underline">Setup Guide</a>
  </div>`;
  $('#viewRoot').innerHTML = html;
  $('#importFile').addEventListener('change', (e)=>{ if(e.target.files[0]) importJSON(e.target.files[0]); });
  $('#toggleThemeSettings').addEventListener('click', toggleTheme);
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

const ROUTE_RENDERERS = {
  dashboard: renderDashboard,
  budgets: renderBudgets,
  expenses: renderExpenses,
  rent: renderRent,
  udhar: renderUdhar,
  construction: renderConstruction,
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
  renderTopbar();
  renderBottomNav();
  renderFab();
  const fn = ROUTE_RENDERERS[ROUTE] || renderDashboard;
  fn();
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
  $('#fabWa').addEventListener('click', openWhatsAppSupport);
}
function initApp(){
  initTheme();
  initTopbarButtons();
  const initialRoute = location.hash.replace('#','');
  ROUTE = ALL_MODULES.some(m=>m.id===initialRoute) ? initialRoute : 'dashboard';
  renderRoute();
  $('#app').classList.add('ready');

  setTimeout(()=>{
    $('#splash').classList.add('hide');
    setTimeout(()=>$('#splash').remove(), 700);
  }, 3000);
}
document.addEventListener('DOMContentLoaded', initApp);

/* Register service worker for offline caching (GitHub Pages / TWA ready) */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(err=>console.warn('SW registration failed:', err));
  });
}

/* ---------------------------------------------------------------------- *
 * 25. PDF EXPORT (native browser print-to-PDF — no external library,
 *     works fully offline on every device that has a print/share sheet)
 * ---------------------------------------------------------------------- */
function pdfRow(cells){ return `<tr>${cells.map(c=>`<td>${escapeHtml(c===undefined||c===null?'':c)}</td>`).join('')}</tr>`; }
function pdfSection(title, headers, rows){
  let html = `<h2>${escapeHtml(title)}</h2>`;
  if(!rows.length){ html += `<p class="print-empty">Koi record nahi mila.</p>`; return html; }
  html += `<table><thead><tr>${headers.map(h=>`<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(pdfRow).join('')}</tbody></table>`;
  return html;
}
function getPrintData(route){
  switch(route){
    case 'budgets':
      return { title:'Budgets & Income Report', sections: [
        pdfSection('Budgets', ['Name','Category','Period','Estimated','Spent'],
          DATA.budgets.map(b=>[b.name,b.category,b.period,fmtMoney(b.estimated),fmtMoney(budgetSpent(b))])),
        pdfSection('Income', ['Source','Date','Amount','Notes'],
          DATA.incomes.map(i=>[i.source,fmtDate(i.date),fmtMoney(i.amount),i.notes||''])),
      ]};
    case 'expenses':
      return { title:'Expense Report', sections: [
        pdfSection('All Expenses', ['Date','Category','Sub-category','Amount','Note'],
          DATA.expenses.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''))
            .map(e=>[fmtDate(e.date),e.category,e.subcategory,fmtMoney(e.amount),e.note||''])),
      ]};
    case 'rent':
      return { title:'House Rent Report', sections: [
        pdfSection('Properties', ['Name','Type','Address'],
          DATA.properties.map(p=>[p.name,p.type||'',p.address||''])),
        pdfSection('Tenants', ['Name','Property','Phone','Monthly Rent','Security Deposit'],
          DATA.tenants.map(t=>{
            const p = DATA.properties.find(x=>x.id===t.propertyId);
            return [t.name, p?p.name:'', t.phone||'', fmtMoney(t.monthlyRent), fmtMoney(t.securityDeposit)];
          })),
        pdfSection('Rent Payments', ['Tenant','Month','Amount','Status'],
          DATA.rentPayments.slice().reverse().map(pay=>{
            const t = DATA.tenants.find(x=>x.id===pay.tenantId);
            return [t?t.name:'', pay.month, fmtMoney(pay.amount), pay.status];
          })),
      ]};
    case 'udhar':
      return { title:'Udhar Khata Ledger', sections: [
        pdfSection('Contacts & Balance', ['Name','Phone','Balance'],
          DATA.udhars.map(u=>{
            const bal = udharBalance(u);
            return [u.name, u.phone||'', bal===0?'Settled':(bal>0?fmtMoney(bal)+' receivable':fmtMoney(-bal)+' payable')];
          })),
        pdfSection('All Transactions', ['Contact','Type','Amount','Date','Status'],
          DATA.udharTx.slice().reverse().map(t=>{
            const u = DATA.udhars.find(x=>x.id===t.udharId);
            return [u?u.name:'', t.type, fmtMoney(t.amount), fmtDate(t.date), t.status];
          })),
      ]};
    case 'construction':
      return { title:'Construction Report', sections: [
        pdfSection('Projects', ['Name','Start Date','Budget'],
          DATA.constructionProjects.map(p=>[p.name,fmtDate(p.startDate),fmtMoney(p.budget)])),
        pdfSection('Material Expenses', ['Item','Qty','Amount','Date','Vendor'],
          DATA.materials.slice().reverse().map(m=>[m.item,m.qty||'',fmtMoney(m.amount),fmtDate(m.date),m.vendor||''])),
        pdfSection('Labour Register', ['Name','Role','Daily Wage','Advance','Net Payout'],
          DATA.labourers.map(l=>[l.name,l.role,fmtMoney(l.dailyWage),fmtMoney(l.advance),fmtMoney(labourerPayout(l))])),
      ]};
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
    case 'vehicle':
      return { title:'Vehicle Log Report', sections: [
        pdfSection('Vehicles', ['Name','Plate','Odometer'],
          DATA.vehicles.map(v=>[v.name,v.plate||'',(v.odometer||0)+' km'])),
        pdfSection('Fuel Log', ['Vehicle','Date','Liters','Rate','Odometer','Cost'],
          DATA.fuelLogs.slice().reverse().map(f=>{
            const v = DATA.vehicles.find(x=>x.id===f.vehicleId);
            return [v?v.name:'',fmtDate(f.date),f.liters,f.rate,f.odometer,fmtMoney(f.liters*f.rate)];
          })),
      ]};
    case 'zakat':
      return { title:'Zakat & Charity Report', sections: [
        pdfSection('Charity Ledger', ['Type','Recipient','Amount','Date'],
          DATA.charityRecords.slice().reverse().map(c=>[c.type,c.recipient||'',fmtMoney(c.amount),fmtDate(c.date)])),
      ]};
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
        pdfSection('Encrypted Vault', [], []),
      ], note:'Encrypted vault item values are never included in PDF exports for your security.' };
    case 'events':
      return { title:'Event Budget Report', sections: [
        pdfSection('Events', ['Name','Date','Budget'],
          DATA.events.map(e=>[e.name,fmtDate(e.date),fmtMoney(e.budget)])),
        pdfSection('Line Items', ['Event','Item','Vendor','Amount','Advance'],
          DATA.eventItems.slice().reverse().map(i=>{
            const ev = DATA.events.find(x=>x.id===i.eventId);
            return [ev?ev.name:'',i.item,i.vendor||'',fmtMoney(i.amount),fmtMoney(i.advance)];
          })),
      ]};
    case 'goals':
      return { title:'Savings Goals Report', sections: [
        pdfSection('Goals', ['Name','Target','Saved','Target Date'],
          DATA.goals.map(g=>[g.name,fmtMoney(g.target),fmtMoney(g.saved),fmtDate(g.targetDate)])),
      ]};
    default:
      return null;
  }
}
function exportPDF(){
  const data = getPrintData(ROUTE);
  if(!data){ toast('Is tab ke liye PDF export available nahi'); return; }
  const area = $('#printArea');
  area.innerHTML = `<h1>GharSaz 360 — ${escapeHtml(data.title)}</h1>
    <div class="print-date">Generated on ${fmtDate(todayISO())}</div>
    ${data.note?`<p class="print-empty">${escapeHtml(data.note)}</p>`:''}
    ${data.sections.join('')}
    <div class="print-footer">Generated by GharSaz 360 · 100% Offline App</div>`;
  setTimeout(()=>{ window.print(); }, 150);
}
