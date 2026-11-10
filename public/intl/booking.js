var _telexOpenP;

(function() {

var bookedSlots = {}; 
var myBookings = [];  
var tSlotsFetched = false;
var tYear, tMonth, tDay = null, tSlot = null;
var tMN = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

/* @tz-core: pure logic, tested by intl/tests/book.test.mjs */
var TZ_COUNTRIES = 'AD:Europe/Andorra;AE:Asia/Dubai;AF:Asia/Kabul;AL:Europe/Tirane;AM:Asia/Yerevan;AT:Europe/Vienna;AU:Australia/Lord_Howe,Antarctica/Macquarie,Australia/Hobart,Australia/Melbourne,Australia/Sydney,Australia/Broken_Hill,Australia/Brisbane,Australia/Lindeman,Australia/Adelaide,Australia/Darwin,Australia/Perth,Australia/Eucla;AX:Europe/Mariehamn;AZ:Asia/Baku;BA:Europe/Sarajevo;BD:Asia/Dhaka;BE:Europe/Brussels;BG:Europe/Sofia;BH:Asia/Bahrain;BN:Asia/Brunei;BT:Asia/Thimphu;BY:Europe/Minsk;CA:America/St_Johns,America/Halifax,America/Glace_Bay,America/Moncton,America/Goose_Bay,America/Blanc-Sablon,America/Toronto,America/Iqaluit,America/Atikokan,America/Winnipeg,America/Resolute,America/Rankin_Inlet,America/Regina,America/Swift_Current,America/Edmonton,America/Cambridge_Bay,America/Inuvik,America/Vancouver,America/Creston,America/Dawson_Creek,America/Fort_Nelson,America/Whitehorse,America/Dawson;CH:Europe/Zurich;CN:Asia/Shanghai,Asia/Urumqi;CY:Asia/Nicosia,Asia/Famagusta;CZ:Europe/Prague;DE:Europe/Berlin,Europe/Busingen;DK:Europe/Copenhagen;EE:Europe/Tallinn;ES:Europe/Madrid,Africa/Ceuta,Atlantic/Canary;FI:Europe/Helsinki;FR:Europe/Paris;GB:Europe/London;GE:Asia/Tbilisi;GG:Europe/Guernsey;GI:Europe/Gibraltar;GR:Europe/Athens;HK:Asia/Hong_Kong;HR:Europe/Zagreb;HU:Europe/Budapest;ID:Asia/Jakarta,Asia/Pontianak,Asia/Makassar,Asia/Jayapura;IE:Europe/Dublin;IL:Asia/Jerusalem;IM:Europe/Isle_of_Man;IN:Asia/Kolkata;IQ:Asia/Baghdad;IR:Asia/Tehran;IS:Atlantic/Reykjavik;IT:Europe/Rome;JE:Europe/Jersey;JO:Asia/Amman;JP:Asia/Tokyo;KG:Asia/Bishkek;KH:Asia/Phnom_Penh;KP:Asia/Pyongyang;KR:Asia/Seoul;KW:Asia/Kuwait;KZ:Asia/Almaty,Asia/Qyzylorda,Asia/Qostanay,Asia/Aqtobe,Asia/Aqtau,Asia/Atyrau,Asia/Oral;LA:Asia/Vientiane;LB:Asia/Beirut;LI:Europe/Vaduz;LK:Asia/Colombo;LT:Europe/Vilnius;LU:Europe/Luxembourg;LV:Europe/Riga;MC:Europe/Monaco;MD:Europe/Chisinau;ME:Europe/Podgorica;MK:Europe/Skopje;MM:Asia/Yangon;MN:Asia/Ulaanbaatar,Asia/Hovd;MO:Asia/Macau;MT:Europe/Malta;MY:Asia/Kuala_Lumpur,Asia/Kuching;NL:Europe/Amsterdam;NO:Europe/Oslo;NP:Asia/Kathmandu;NZ:Pacific/Auckland,Pacific/Chatham;OM:Asia/Muscat;PH:Asia/Manila;PK:Asia/Karachi;PL:Europe/Warsaw;PS:Asia/Gaza,Asia/Hebron;PT:Europe/Lisbon,Atlantic/Madeira,Atlantic/Azores;QA:Asia/Qatar;RO:Europe/Bucharest;RS:Europe/Belgrade;RU:Europe/Kaliningrad,Europe/Moscow,Europe/Kirov,Europe/Volgograd,Europe/Astrakhan,Europe/Saratov,Europe/Ulyanovsk,Europe/Samara,Asia/Yekaterinburg,Asia/Omsk,Asia/Novosibirsk,Asia/Barnaul,Asia/Tomsk,Asia/Novokuznetsk,Asia/Krasnoyarsk,Asia/Irkutsk,Asia/Chita,Asia/Yakutsk,Asia/Khandyga,Asia/Vladivostok,Asia/Ust-Nera,Asia/Magadan,Asia/Sakhalin,Asia/Srednekolymsk,Asia/Kamchatka,Asia/Anadyr;SA:Asia/Riyadh;SE:Europe/Stockholm;SG:Asia/Singapore;SI:Europe/Ljubljana;SK:Europe/Bratislava;SM:Europe/San_Marino;SY:Asia/Damascus;TH:Asia/Bangkok;TJ:Asia/Dushanbe;TL:Asia/Dili;TM:Asia/Ashgabat;TR:Europe/Istanbul;TW:Asia/Taipei;UA:Europe/Simferopol,Europe/Kyiv;US:America/New_York,America/Detroit,America/Kentucky/Louisville,America/Kentucky/Monticello,America/Indiana/Indianapolis,America/Indiana/Vincennes,America/Indiana/Winamac,America/Indiana/Marengo,America/Indiana/Petersburg,America/Indiana/Vevay,America/Chicago,America/Indiana/Tell_City,America/Indiana/Knox,America/Menominee,America/North_Dakota/Center,America/North_Dakota/New_Salem,America/North_Dakota/Beulah,America/Denver,America/Boise,America/Phoenix,America/Los_Angeles,America/Anchorage,America/Juneau,America/Sitka,America/Metlakatla,America/Yakutat,America/Nome,America/Adak,Pacific/Honolulu;UZ:Asia/Samarkand,Asia/Tashkent;VA:Europe/Vatican;VN:Asia/Ho_Chi_Minh;YE:Asia/Aden';
var tzCountry = {};
TZ_COUNTRIES.split(';').forEach(function(e) { var p = e.split(':'); p[1].split(',').forEach(function(z) { tzCountry[z] = p[0]; }); });

var CLIENT_SLOTS = [];
for (var sm = 9 * 60; sm <= 17 * 60 + 45; sm += 15) CLIENT_SLOTS.push(sm);
var CALL_MS = 15 * 60 * 1000;

function pad2(n) { return String(n).padStart(2, '0'); }
function hhmm(t) { return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); }

function isNamedZone(z) {
  if (!/^[A-Za-z]+\/[A-Za-z0-9_+\-\/]+$/.test(z) || z.indexOf('Etc/') === 0) return false;
  try { new Intl.DateTimeFormat('en-US', { timeZone: z }); return true; } catch (e) { return false; }
}

function resolveZone(raw) {
  if (tzCountry[raw]) return raw;
  if (!isNamedZone(raw)) return 'Asia/Manila';
  var canon = function(z) { return new Intl.DateTimeFormat('en-US', { timeZone: z }).resolvedOptions().timeZone; };
  var want = canon(raw), zones = Object.keys(tzCountry);
  for (var i = 0; i < zones.length; i++) if (canon(zones[i]) === want) return zones[i];
  return raw;
}

function zoneParts(ms, zone) {
  var p = {};
  new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric',
    day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(new Date(ms))
    .forEach(function(x) { if (x.type !== 'literal') p[x.type] = +x.value; });
  return p;
}

function zoneInstant(zone, y, m, d, h, mi) {
  var want = Date.UTC(y, m, d, h, mi || 0), ms = want;
  for (var i = 0; i < 3; i++) {
    var p = zoneParts(ms, zone);
    ms += want - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  }
  return ms;
}

function slotInfo(zone, y, m, d, t, busy, now) {
  var s = zoneInstant(zone, y, m, d, Math.floor(t / 60), t % 60);
  var ph = new Date(s + 8 * 3600e3), phEnd = ph.getUTCHours() * 60 + ph.getUTCMinutes() + CALL_MS / 60000;
  return {
    start: s,
    past: s <= now,
    taken: busy.some(function(b) { return s < b[1] && s + CALL_MS > b[0]; }),
    closed: ph.getUTCDay() === 0 || (ph.getUTCDay() === 6 && phEnd > 12 * 60)
  };
}

function cleanPhoneInput(v) {
  var out = String(v).replace(/[^0-9+-]/g, '').replace(/(?!^)\+/g, ''), digits = 0;
  return out.replace(/[0-9]/g, function(d) { return ++digits > 15 ? '' : d; });
}

function formatPhone(clean, country) {
  if (typeof libphonenumber === 'undefined' || !phoneE164(clean, country)) return clean;
  var p = libphonenumber.parsePhoneNumberFromString(clean.replace(/-/g, ''), country);
  return p.country === country ? p.formatNational() : p.formatInternational();
}

var PHONE_SHAPE = /^\+?[0-9]{4,15}$/; 

function phoneE164(raw, country) {
  raw = String(raw).replace(/[\s().-]/g, '');
  if (!PHONE_SHAPE.test(raw)) return '';
  if (typeof libphonenumber === 'undefined') return /^\+[0-9]{7,15}$/.test(raw) ? raw : '';
  var p = libphonenumber.parsePhoneNumberFromString(raw, country);
  return p && p.isValid() ? p.number : '';
}

function defaultPhoneCountry(zone, locale) {
  var known = function(cc) { return cc && typeof libphonenumber !== 'undefined' && libphonenumber.getCountries().indexOf(cc) > -1 ? cc : ''; };
  var region = '';
  try { region = new Intl.Locale(locale).maximize().region; } catch (e) {}
  return known(tzCountry[zone]) || known(region) || 'PH';
}

var AGENTS_NEEDED = ['1–4', '5–10', '11–20', '21–50', '51–100', '101+'];

var NAME_RE = /^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s.'’\-]{1,100}$/;
var EMAIL_RE = /^[A-Za-z0-9._%+\-]{1,64}@[A-Za-z0-9.\-]{1,190}\.[A-Za-z]{2,24}$/;

function contactError(c) {
  if (!NAME_RE.test(c.firstName)) return 'firstName';
  if (!NAME_RE.test(c.lastName)) return 'lastName';
  if (c.email.length > 254 || !EMAIL_RE.test(c.email)) return 'email';
  if (!phoneE164(c.phoneNumber, c.phoneCountry)) return 'phoneNumber';
  if (AGENTS_NEEDED.indexOf(c.agentsNeeded) < 0) return 'agentsNeeded';
  if (c.notes.length > 1000 || /[<>`"\\{}]/.test(c.notes)) return 'notes';
  return '';
}

function lastBookableDay(now) { return new Date(now.year, now.month - 1, now.day + 364); }

var CHANNELS = ['facebook', 'linkedin', 'email', 'instagram', 'search', 'chatgpt', 'telexph-website', 'direct', 'other'];
var FIRST_TOUCH_MS = 30 * 86400e3;

function hostChannel(host) {
  return (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(host) && 'linkedin')
    || (/(^|\.)(facebook\.com|fb\.com|fb\.me)$/.test(host) && 'facebook')
    || (/(^|\.)instagram\.com$/.test(host) && 'instagram')
    || (/(^|\.)(chatgpt\.com|chat\.openai\.com)$/.test(host) && 'chatgpt')
    || (/(^|\.)telexph\.com$/.test(host) && 'telexph-website')
    || (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org)$/.test(host) && 'search')
    || '';
}

function channelFrom(ref, referrer, ua, ownHost) {
  ref = String(ref || '').trim().toLowerCase();
  if (ref) return CHANNELS.indexOf(ref) >= 0 ? ref : hostChannel(ref) || 'other';
  var host = '';
  try { host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, ''); } catch (e) {}
  if (host && host !== ownHost) return hostChannel(host) || 'other';
  return (/LinkedInApp/.test(ua) && 'linkedin')
    || (/FBAN|FBAV/.test(ua) && 'facebook')
    || (/Instagram/.test(ua) && 'instagram')
    || 'direct';
}

function firstTouch(saved, current, now) {
  var age = saved ? now - saved.at : NaN;
  var keep = CHANNELS.indexOf(saved && saved.channel) >= 0 && age >= 0 && age < FIRST_TOUCH_MS
    && !(saved.channel === 'direct' && current !== 'direct');
  return keep ? saved : { channel: current, at: now };
}
/* The 4 qualifying questions; same lists as QUALIFY in website-admin-backend/src/intl/intl.controller.js. */
var QUALIFY = {
  role: ['Business owner / decision-maker', 'Employee', 'Looking for a VA job'],
  need: ['Inbox & admin', 'Customer support', 'Sales support', 'Other'],
  start: ['This month', 'In 30–60 days', 'Just researching'],
  budget: ['Under US$1,500', 'US$1,500–2,500', 'US$2,500–4,000', 'US$4,000+']
};

/* 'book' = calendar, 'careers' = careers page, 'nurture' = thank-you + email follow-up. */
function qualifyRoute(a) {
  if (a.role === QUALIFY.role[2]) return 'careers';
  if (a.role === QUALIFY.role[0] && a.budget !== QUALIFY.budget[0] && a.start !== QUALIFY.start[2]) return 'book';
  return 'nurture';
}
/* @tz-core-end */

var LAST_CHANNEL = 'direct';
try {
  var q = new URLSearchParams(location.search);
  LAST_CHANNEL = channelFrom(q.get('ref') || q.get('utm_source'), document.referrer, navigator.userAgent, location.hostname.replace(/^www\./, ''));
} catch (e) {}
try {
  var visit = sessionStorage.getItem('intlChannel');
  if (CHANNELS.indexOf(visit) >= 0) LAST_CHANNEL = visit;
  else sessionStorage.setItem('intlChannel', LAST_CHANNEL);
} catch (e) {}
var CHANNEL = LAST_CHANNEL;
try {
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem('intlFirstChannel')); } catch (e) {}
  var first = firstTouch(saved, LAST_CHANNEL, Date.now());
  if (first !== saved) localStorage.setItem('intlFirstChannel', JSON.stringify(first));
  CHANNEL = first.channel;
} catch (e) {}
var ATTR = {};
try {
  var ATTR_KEYS = ['utm_source', 'utm_campaign', 'utm_content', 'fbclid'];
  var fromUrl = ATTR_KEYS.some(function (k) { return q.get(k); });
  var savedAttr = JSON.parse(sessionStorage.getItem('intlAttr') || '{}');
  ATTR_KEYS.forEach(function (k) {
    var v = String((fromUrl ? q.get(k) : savedAttr[k]) || '').trim();
    if (/^[A-Za-z0-9 _.\-+:,()]{1,300}$/.test(v)) ATTR[k] = v;
  });
  sessionStorage.setItem('intlAttr', JSON.stringify(ATTR));
} catch (e) {}

var clientZone = 'Asia/Manila';
try { clientZone = resolveZone(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch (e) {}

function dayKey() { return clientZone + '|' + tYear + '-' + pad2(tMonth + 1) + '-' + pad2(tDay); }
function esc(s) { return String(s).replace(/[&<>"']/g, function(c) { return '&#' + c.charCodeAt(0) + ';'; }); }
function slotState(t) { return slotInfo(clientZone, tYear, tMonth, tDay, t, (bookedSlots[dayKey()] || []).concat(myBookings), Date.now()); }

function initTzSelect() {
  var sel = document.getElementById('tTzSel');
  if (!sel) return;
  var names = null;
  try { names = new Intl.DisplayNames(['en'], { type: 'region' }); } catch (e) {}
  var perCountry = {};
  Object.keys(tzCountry).forEach(function(z) { perCountry[tzCountry[z]] = (perCountry[tzCountry[z]] || 0) + 1; });
  if (!tzCountry[clientZone]) sel.add(new Option(clientZone.split('/').pop().replace(/_/g, ' ') + ' (your device)', clientZone, true, true));
  Object.keys(tzCountry).map(function(z) {
    var cc = tzCountry[z], name = names ? names.of(cc) : cc;
    return { z: z, label: perCountry[cc] > 1 ? name + ' – ' + z.split('/').pop().replace(/_/g, ' ') : name };
  }).sort(function(a, b) { return a.label.localeCompare(b.label); }).forEach(function(o) {
    sel.add(new Option(o.label, o.z, false, o.z === clientZone));
  });
  sel.addEventListener('change', function() {
    clientZone = this.value;
    syncPhoneCountry();
    tSlotsFetched = false; fetchBookedSlots(); rCal(); rTime(); rDisp();
  });
}

function isWeekend(y, mo, d) {
  var dow = new Date(y, mo, d).getDay();
  return dow === 0 || dow === 6;
}

function rDisp() {
  var sum = document.getElementById('tSum');
  if (!sum) return;
  if (!tDay || tSlot === null) { sum.textContent = tDay ? 'Pick a time' : 'Pick a date and time'; return; }
  var day = new Date(tYear, tMonth, tDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  sum.innerHTML = '<b>' + day + ' · ' + hhmm(tSlot) + '</b> your time';
}

function injectCSS() {
  var s = document.createElement('style');
  s.textContent = `
    :root{--tcr:#A10000;--tcr2:#6B0000;--tcgold:#C8A96E;--tctxt:#1C1C1C;--tcsub:#6B6560;--tcbord:#E8E4DF;--tclt:#F5F3F0;--tccard:#FAFAF9;}
    @keyframes tSpin{to{transform:rotate(360deg);}}
    @keyframes tFadeIn{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes tPulse{0%,100%{box-shadow:0 0 0 0 rgba(161,0,0,.4)}50%{box-shadow:0 0 0 10px rgba(161,0,0,0)}}
    #tOvl{display:none;position:fixed;inset:0;z-index:999999;background:rgba(6,4,2,.80);backdrop-filter:blur(6px);align-items:center;justify-content:center;padding:14px;font-family:'Open Sans',sans-serif;}
    #tOvl.open{display:flex!important;}
    #tMdl{background:#fff;border-radius:20px;width:100%;max-width:1020px;max-height:94vh;overflow-y:auto;overflow-x:hidden;position:relative;box-shadow:0 24px 70px rgba(0,0,0,.30),0 4px 16px rgba(0,0,0,.10);animation:tFadeIn .3s cubic-bezier(.16,1,.3,1);}
    #tMdl::-webkit-scrollbar{width:5px;}#tMdl::-webkit-scrollbar-track{background:transparent;}#tMdl::-webkit-scrollbar-thumb{background:#ded8d2;border-radius:3px;}
    .tX{position:absolute;top:18px;right:18px;width:36px;height:36px;border-radius:50%;border:1px solid var(--tcbord);background:#fff;cursor:pointer;font-size:13px;color:var(--tcsub);z-index:20;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,border-color .2s,transform .2s;font-family:'Open Sans',sans-serif;}
    .tX:hover{background:var(--tctxt);color:#fff;border-color:var(--tctxt);transform:rotate(90deg);}
    #tLdr{display:none;position:absolute;inset:0;background:rgba(255,255,255,.96);z-index:50;flex-direction:column;align-items:center;justify-content:center;gap:18px;border-radius:20px;}
    #tLdr.show{display:flex!important;}
    .tSpin{width:42px;height:42px;border:3px solid var(--tcbord);border-top-color:var(--tcr);border-radius:50%;animation:tSpin .7s linear infinite;}
    .tLTxt{font-family:'Poppins',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--tcsub);}
    #tOk{display:none;flex-direction:column;align-items:center;justify-content:center;padding:72px 40px;text-align:center;gap:18px;}
    #tOk.show{display:flex!important;}
    .tOkIco{width:76px;height:76px;background:linear-gradient(135deg,var(--tcr),var(--tcr2));border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 28px rgba(161,0,0,.28);margin-bottom:4px;animation:tPulse 2s ease-in-out infinite;}
    .tOkT{font-family:'Poppins',sans-serif;font-size:28px;font-weight:800;color:var(--tctxt);letter-spacing:-.4px;}
    .tOkS{font-family:'Open Sans',sans-serif;font-size:14px;color:var(--tcsub);max-width:380px;line-height:1.8;}
    .tOkD{background:var(--tclt);border-left:4px solid var(--tcr);padding:22px 26px;text-align:left;width:100%;max-width:400px;font-family:'Open Sans',sans-serif;font-size:13px;line-height:2.3;border-radius:0 12px 12px 0;color:var(--tcr);}
    .tOkD b{color:var(--tcr);font-weight:700;}
    #tIntro{padding:0;}
    #tIntroBar{height:5px;background:linear-gradient(90deg,var(--tcr) 0%,var(--tcr2) 50%,var(--tcgold) 100%);border-radius:20px 20px 0 0;}
    #tIntroHead{display:flex;align-items:center;padding:24px 44px 22px;border-bottom:1px solid var(--tcbord);}
    #tIHLogo{display:flex;align-items:center;gap:14px;}
    #tIHLogoImg{width:48px;height:48px;object-fit:contain;border-radius:4px;border:1px solid var(--tcbord);box-shadow:0 2px 8px rgba(0,0,0,.08);}
    #tIHLogoName{font-family:'Poppins',sans-serif;font-size:16px;font-weight:800;color:var(--tctxt);letter-spacing:-.2px;line-height:1.25;}
    #tIHLogoName small{display:block;font-family:'Open Sans',sans-serif;font-size:10px;font-weight:400;letter-spacing:1.5px;text-transform:uppercase;color:var(--tcsub);margin-top:2px;}
    #tIntroBody{display:grid;grid-template-columns:1fr 1fr;gap:0;}
    #tIntroLeft{padding:40px 44px 44px;border-right:1px solid var(--tcbord);}
    #tILEyebrow{display:inline-block;font-family:'Poppins',sans-serif;font-size:10px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--tcr);margin-bottom:14px;}
    #tILBig{font-family:'Poppins',sans-serif;font-size:38px;font-weight:900;color:var(--tctxt);line-height:1.06;margin-bottom:18px;letter-spacing:-.8px;}
    #tILBig span{display:block;color:var(--tcr);}
    #tILDesc{font-family:'Open Sans',sans-serif;font-size:15px;color:var(--tcsub);line-height:1.8;margin-bottom:32px;}
    #tILFeats{display:flex;flex-direction:column;gap:14px;margin-bottom:36px;}
    .tIFeat{display:flex;align-items:center;gap:14px;font-family:'Open Sans',sans-serif;font-size:14px;font-weight:600;color:var(--tctxt);}
    .tIFIcon{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--tcr),var(--tcr2));display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(161,0,0,.22);}
    #tILLoc{display:inline-flex;align-items:center;gap:8px;font-family:'Open Sans',sans-serif;font-size:12px;color:var(--tcsub);}
    #tIntroRight{padding:40px 44px 44px;display:flex;flex-direction:column;justify-content:center;background:var(--tclt);}
    #tIRLabel{font-family:'Poppins',sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--tcsub);margin-bottom:8px;}
    #tIRTitle{font-family:'Poppins',sans-serif;font-size:28px;font-weight:800;color:var(--tctxt);line-height:1.1;margin-bottom:28px;letter-spacing:-.4px;}
    #tIRTitle span{color:var(--tcr);}
    #tIntroSteps{display:flex;flex-direction:column;gap:14px;margin-bottom:34px;}
    .tIStep{display:flex;align-items:center;gap:16px;background:#fff;border:1.5px solid var(--tcbord);border-radius:14px;padding:16px 18px;transition:border-color .2s,box-shadow .2s;}
    .tIStep.active{border-color:var(--tcr);box-shadow:0 4px 16px rgba(161,0,0,.10);}
    .tIStepNum{width:34px;height:34px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-family:'Poppins',sans-serif;font-size:14px;font-weight:800;}
    .tIStep.active .tIStepNum{background:var(--tcr);color:#fff;}
    .tIStep:not(.active) .tIStepNum{background:var(--tcbord);color:#aaa;}
    .tIStepTitle{font-family:'Poppins',sans-serif;font-size:13px;font-weight:700;color:var(--tctxt);letter-spacing:.1px;}
    .tIStepDesc{font-family:'Open Sans',sans-serif;font-size:12px;color:var(--tcsub);margin-top:2px;}
    #tIRBtns{display:flex;gap:12px;}
    #tIntroCancel{background:#fff;color:var(--tcsub);border:1.5px solid var(--tcbord);border-radius:10px;padding:14px 26px;font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
    #tIntroCancel:hover{border-color:var(--tctxt);color:var(--tctxt);}
    #tIntroStart{flex:1;background:linear-gradient(135deg,var(--tcr),var(--tcr2));color:#fff;border:none;border-radius:10px;padding:14px 0;font-family:'Poppins',sans-serif;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .22s;box-shadow:0 4px 18px rgba(161,0,0,.3);}
    #tIntroStart:hover{box-shadow:0 6px 26px rgba(161,0,0,.44);transform:translateY(-1px);}
    #tStpr{display:flex;align-items:center;justify-content:center;padding:22px 32px 18px;gap:0;background:#fff;border-bottom:1px solid var(--tcbord);}
    .tSW{display:flex;flex-direction:column;align-items:center;gap:6px;}
    .tSC{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Poppins',sans-serif;font-size:14px;font-weight:800;transition:all .3s;}
    .tSC.on{background:linear-gradient(135deg,var(--tcr),var(--tcr2));color:#fff;box-shadow:0 4px 14px rgba(161,0,0,.3);}
    .tSC.off{background:var(--tclt);color:#bbb;}
    .tSL{font-family:'Poppins',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;}
    .tSL.on{color:var(--tctxt);}.tSL.off{color:#ccc;}
    .tSLn{width:120px;height:1px;background:var(--tcbord);margin:0 12px 18px;}
    .tTag{font-family:'Poppins',sans-serif;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--tctxt);padding:26px 40px 0;display:flex;align-items:center;gap:8px;}
    .tTag::before{content:'';display:block;width:18px;height:1px;background:var(--tctxt);}
    .tHdr{display:flex;align-items:center;padding:10px 40px 0;font-family:'Poppins',sans-serif;font-size:21px;font-weight:800;color:var(--tctxt);letter-spacing:-.3px;}
    .tHdr .r{color:var(--tcr);margin-left:6px;font-size:18px;}
    .tSub{padding:5px 40px 20px;font-family:'Open Sans',sans-serif;font-size:13px;color:var(--tcsub);line-height:1.65;}
    #tMG{display:grid;grid-template-columns:1fr 1fr;gap:0;padding:0 40px 32px;border-bottom:1px solid var(--tcbord);}
    .tCW{padding-right:28px;}
    .tCH{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
    .tCM{font-family:'Poppins',sans-serif;font-size:15px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:var(--tctxt);}
    .tCNs{display:flex;gap:6px;}
    .tCN{width:32px;height:32px;border:1px solid var(--tcbord);border-radius:10px;background:#fff;cursor:pointer;font-size:15px;color:var(--tcsub);display:flex;align-items:center;justify-content:center;transition:all .18s;}
    .tCN:hover{background:var(--tcr);color:#fff;border-color:var(--tcr);}
    .tCT{width:100%;border-collapse:collapse;}
    .tCT th{font-family:'Poppins',sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#bbb;text-align:center;padding:6px 0 10px;}
    .tCT th.wknd{color:#e0b8b8;}
    .tCT td{text-align:center;padding:3px 0;}
    .tDB{width:38px;height:38px;border-radius:12px;border:none;background:transparent;font-family:'Open Sans',sans-serif;font-size:12.5px;font-weight:600;color:var(--tctxt);cursor:pointer;transition:background .15s,color .15s,box-shadow .15s;margin:auto;display:flex;align-items:center;justify-content:center;}
    .tDB:hover:not(:disabled){background:var(--tclt);color:var(--tcr);font-weight:700;}
    .tDB.sel{background:linear-gradient(135deg,var(--tcr),var(--tcr2))!important;color:#fff!important;font-weight:700!important;box-shadow:0 6px 16px rgba(161,0,0,.30);}
    .tDB.tdy{box-shadow:inset 0 0 0 1.5px var(--tcr);color:var(--tcr);font-weight:700;}
    .tDB:disabled{color:#dcdcdc;cursor:default;}
    .tDB.wknd:disabled{color:#e3cbcb;background:transparent;}
    .tTW{border-left:1px solid var(--tcbord);padding-left:28px;}
    .tTT{font-family:'Poppins',sans-serif;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--tcsub);margin-bottom:14px;}
    .tSlots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-height:360px;overflow-y:auto;padding-right:4px;}
    .tSlots::-webkit-scrollbar{width:4px;}.tSlots::-webkit-scrollbar-thumb{background:#ded8d2;border-radius:3px;}
    .tSlot{height:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.1;border:1.5px solid var(--tcbord);border-radius:10px;background:#fff;font-family:'Open Sans',sans-serif;font-size:14px;font-weight:700;color:var(--tctxt);cursor:pointer;transition:border-color .15s,color .15s,box-shadow .15s;}
    .tSlot:hover:not(:disabled){border-color:var(--tcr);color:var(--tcr);}
    .tSlot:focus-visible{outline:2px solid var(--tcr);outline-offset:2px;}
    .tSlot.sel{background:linear-gradient(135deg,var(--tcr),var(--tcr2));border-color:transparent;color:#fff;box-shadow:0 6px 16px rgba(161,0,0,.28);}
    .tSlot.sel span{color:rgba(255,255,255,.85);}
    .tSlot:disabled{cursor:not-allowed;background:var(--tclt);border-color:var(--tcbord);color:#c9c3bc;text-decoration:line-through;}
    .tSlot:disabled span{color:#dcbcbc;}
    .tSlotMsg{grid-column:1/-1;padding:44px 16px;text-align:center;font-family:'Open Sans',sans-serif;font-size:12.5px;line-height:1.6;color:var(--tcsub);background:var(--tccard);border:1px dashed var(--tcbord);border-radius:12px;}
    .tSlotMsg b{display:block;font-family:'Poppins',sans-serif;font-size:13px;color:var(--tctxt);margin-bottom:2px;}
    .tTzRow{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:10px;font-size:11.5px;}
    .tTz24::before{content:'•';margin-right:8px;}
    .tTzLbl{font-family:'Poppins',sans-serif;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--tctxt);}
    .tTzField{position:relative;display:inline-flex;align-items:center;max-width:260px;border:1.5px solid rgba(161,0,0,.35);border-radius:6px;background:#FFF5F5;box-shadow:0 2px 8px rgba(161,0,0,.08);transition:border .2s,box-shadow .2s,background .2s;}
    .tTzField:hover{border-color:var(--tcr);background:#FFEDED;}
    .tTzField:focus-within{border-color:var(--tcr);box-shadow:0 0 0 3px rgba(161,0,0,.12);}
    .tTzGlobe,.tTzCaret{position:absolute;color:var(--tcr);pointer-events:none;}
    .tTzGlobe{left:10px;}.tTzCaret{right:10px;}
    #tTzSel{width:100%;min-width:0;appearance:none;-webkit-appearance:none;border:0;outline:0;background:none;padding:6px 28px 6px 30px;font-family:'Open Sans',sans-serif;font-size:12.5px;font-weight:700;color:var(--tcr2);cursor:pointer;text-overflow:ellipsis;}
    #tSum{flex:1;align-self:center;font-family:'Open Sans',sans-serif;font-size:12.5px;color:var(--tcsub);}
    #tSum b{color:var(--tctxt);}
    #tSum span{white-space:nowrap;}
    .tFT{display:flex;justify-content:flex-end;align-items:center;flex-wrap:wrap;gap:12px;padding:20px 40px;background:var(--tclt);border-top:1px solid var(--tcbord);border-radius:0 0 20px 20px;}
    .tBB{background:#fff;color:var(--tcsub);border:1.5px solid var(--tcbord);border-radius:10px;padding:12px 32px;font-family:'Poppins',sans-serif;font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;}
    .tBB:hover{border-color:var(--tctxt);color:var(--tctxt);}
    .tBB:disabled{opacity:.4;cursor:default;}
    .tBN{background:linear-gradient(135deg,var(--tcr),var(--tcr2));color:#fff;border:none;border-radius:10px;padding:12px 40px;font-family:'Poppins',sans-serif;font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;transition:all .22s;box-shadow:0 4px 16px rgba(161,0,0,.28);}
    .tBN:hover{box-shadow:0 6px 24px rgba(161,0,0,.42);transform:translateY(-1px);}
    .tBN:disabled{opacity:.6;cursor:default;transform:none;}
    #tFG{padding:4px 40px 36px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}
    .tFGp{display:flex;flex-direction:column;gap:7px;min-width:0;}
    .tFGp.full{grid-column:1/-1;}
    .tFL{font-family:'Poppins',sans-serif;font-size:8px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:var(--tcsub);}
    .tFL .tReq{color:var(--tcr);font-size:11px;}
    .tFI{border:1.5px solid var(--tcbord);border-radius:10px;padding:13px 16px;font-family:'Open Sans',sans-serif;font-size:13px;color:var(--tctxt);width:100%;outline:none;transition:border .2s,box-shadow .2s;background:#fff;}
    .tFI:focus{border-color:var(--tcr);box-shadow:0 0 0 3px rgba(161,0,0,.07);}
    .tFI::placeholder{color:#ccc;}
    select.tFI{appearance:none;-webkit-appearance:none;cursor:pointer;padding-right:40px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 16px center;}
    select.tFI:invalid{color:#767676;}
    select.tFI option{color:var(--tctxt);}
    #tOvl input:focus-visible,#tOvl select:focus-visible{outline:none;}
    .tPhone{display:flex;align-items:stretch;border:1.5px solid var(--tcbord);border-radius:10px;background:#fff;transition:border .2s,box-shadow .2s;}
    .tPhone:focus-within{border-color:var(--tcr);box-shadow:0 0 0 3px rgba(161,0,0,.07);}
    .tPhone.bad{border-color:var(--tcr);}
    .tCc{position:relative;display:flex;align-items:center;gap:7px;padding:0 10px 0 13px;border-right:1.5px solid var(--tcbord);border-radius:8.5px 0 0 8.5px;background:var(--tclt);color:var(--tcsub);cursor:pointer;flex-shrink:0;transition:background .2s;}
    .tCc:hover,.tCc:focus-within{background:#FFF5F5;}
    .tCcFlag{width:21px;height:15px;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.1);background:#eee center/cover no-repeat;flex-shrink:0;}
    .tCcCode{font-family:'Open Sans',sans-serif;font-size:13px;font-weight:700;color:var(--tctxt);}
    #tCcSel{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px;}
    .tPhIn{flex:1;width:0;min-width:0;border:0;outline:0;background:none;padding:13px 16px 13px 12px;font-family:'Open Sans',sans-serif;font-size:13px;color:var(--tctxt);}
    .tPhIn::placeholder{color:#ccc;}
    .tPhone.noCc .tCc{display:none;}
    .tPhHint{font-family:'Open Sans',sans-serif;font-size:11px;font-weight:600;color:var(--tcr);}
    .tPhHint:empty{display:none;}
    #tErr{display:none;background:#FFF5F5;border-left:3px solid var(--tcr);padding:11px 16px;margin:0 40px 14px;border-radius:0 10px 10px 0;font-family:'Open Sans',sans-serif;font-size:12px;color:var(--tcr);font-weight:600;}
    #tOvl.tInline{display:block;position:static;inset:auto;z-index:auto;background:none;backdrop-filter:none;padding:0;}
    #tOvl.tInline #tMdl{max-height:none;overflow:hidden;animation:none;box-shadow:0 18px 50px rgba(0,0,0,.08);}
    #tOvl.tInline .tX,#tOvl.tInline #tIntro{display:none!important;}
    #tQG,#tNG{padding:4px 40px 28px;display:grid;grid-template-columns:1fr 1fr;gap:18px;}
    .tErrBox{display:none;background:#FFF5F5;border-left:3px solid var(--tcr);padding:11px 16px;margin:0 40px 14px;border-radius:0 10px 10px 0;font-family:'Open Sans',sans-serif;font-size:12px;color:var(--tcr);font-weight:600;}
    #tNForm .tHdr{padding-top:26px;}
    #tNDone{padding:64px 40px;text-align:center;}
    #tNDone .tOkS{margin:10px auto 0;}
    @media(max-width:720px){
      #tQG,#tNG{grid-template-columns:1fr;padding:4px 22px 24px;}
      .tErrBox{margin:0 22px 14px;}
    }
    @media(max-width:720px){
      #tIntroHead{padding:20px 22px 18px;}
      #tIntroBody{grid-template-columns:1fr;}
      #tIntroLeft{padding:26px 22px 28px;border-right:none;border-bottom:1px solid var(--tcbord);text-align:center;}
      #tILEyebrow{font-size:9.5px;letter-spacing:2px;margin-bottom:10px;}
      #tILBig{font-size:27px;line-height:1.14;letter-spacing:-.5px;margin-bottom:12px;}
      #tILBig span{display:inline;}
      #tILDesc{font-size:13.5px;line-height:1.7;margin-bottom:22px;}
      #tILFeats{gap:11px;margin-bottom:22px;}
      .tIFeat{font-size:13px;gap:11px;justify-content:flex-start;text-align:left;}
      #tILLoc{text-align:left;}
      #tIntroRight{padding:26px 22px 30px;text-align:center;}
      #tIRLabel{letter-spacing:2.5px;margin-bottom:6px;}
      #tIRTitle{font-size:20px;margin-bottom:20px;}
      #tIRTitle br{display:none;}
      #tIntroSteps{gap:10px;margin-bottom:22px;}
      .tIStep{padding:13px 15px;gap:13px;justify-content:flex-start;text-align:left;}
      .tIStepNum{width:30px;height:30px;font-size:13px;}
      #tIRBtns{flex-direction:row;gap:10px;}
      #tIntroCancel{flex:0 0 auto;padding:14px 18px;font-size:9.5px;letter-spacing:1.5px;}
      #tIntroStart{font-size:9.5px;letter-spacing:1.5px;}
      #tMG{grid-template-columns:1fr!important;}
      .tCW{padding-right:0;padding-bottom:24px;}
      .tTW{border-left:none;border-top:1px solid var(--tcbord);padding:20px 0 0;}
      .tTzField{flex:1 1 180px;max-width:none;}
      .tTz24{flex-basis:100%;}
      .tTz24::before{content:none;}
      #tSum{flex-basis:100%;text-align:center;}
      .tFT .tBB,.tFT .tBN{flex:1;}
      #tFG{grid-template-columns:1fr!important;padding:4px 22px 28px;}
      .tTag,.tHdr,.tSub{padding-left:22px;padding-right:22px;}
      .tFT{padding:16px 22px;}
      #tStpr{padding:16px 22px 14px;}
      .tSLn{width:48px;}
      #tErr{margin:0 22px 14px;}
    }
    @media(max-width:420px){
      #tOvl{padding:8px;}
      #tMdl{border-radius:16px;}
      #tIntroBar{border-radius:16px 16px 0 0;}
      .tFT{border-radius:0 0 16px 16px;}
      #tIntroHead{padding:18px 18px 16px;}
      #tIHLogoImg{width:40px;height:40px;}
      #tIHLogoName{font-size:14px;}
      #tIntroLeft{padding:22px 18px 24px;}
      #tIntroRight{padding:22px 18px 26px;}
      #tILBig{font-size:24px;}
      #tILDesc{font-size:13px;margin-bottom:20px;}
      #tIRTitle{font-size:17px;letter-spacing:-.2px;}
      #tIRBtns{gap:8px;}
      #tIntroCancel{padding:13px 14px;font-size:9px;letter-spacing:1px;}
      #tIntroStart{font-size:9px;letter-spacing:1px;}
      .tX{top:14px;right:14px;width:32px;height:32px;}
      .tTag,.tHdr,.tSub{padding-left:18px;padding-right:18px;}
      .tHdr{font-size:18px;}
      #tErr{margin:0 18px 14px;}
      #tMG{padding:0 18px 28px;}
      #tFG{padding:4px 18px 24px;}
      .tFT{padding:14px 18px;}
      .tBB,.tBN{padding:12px 22px;letter-spacing:1.8px;}
      .tDB{width:34px;height:34px;font-size:12px;}
      .tSlots{gap:6px;}
      .tSlot{height:44px;font-size:13px;}
    }
    @media(max-width:340px){
      .tSlots{grid-template-columns:repeat(2,1fr);}
      .tDB{width:30px;height:30px;}
    }
  `;
  document.head.appendChild(s);
}

function qSelect(key, label) {
  return '<div class="tFGp"><label class="tFL" for="tQ_' + key + '">' + label + ' <span class="tReq">*</span></label>' +
    '<select id="tQ_' + key + '" class="tFI" required><option value="" selected disabled>Select one</option>' +
    QUALIFY[key].map(function(o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></div>';
}

var OVL, INLINE = false, QA = null;
var CAREERS_URL = 'https://www.telexph.com/careers';

function injectHTML() {
  var d = OVL = document.createElement('div');
  d.id = 'tOvl';
  d.innerHTML = `
    <div id="tMdl">
      <button type="button" class="tX" id="tXBtn">&#x2715;</button>
      <div id="tLdr"><div class="tSpin"></div><div class="tLTxt">Submitting your booking...</div></div>
      <div id="tOk">
        <div class="tOkIco"><svg width="34" height="34" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="tOkT">Booking Confirmed!</div>
        <div class="tOkS">Your discovery call has been scheduled. A confirmation will be sent to your email shortly.</div>
        <div class="tOkD" id="tOkD"></div>
      </div>
      <div id="tIntro">
        <div id="tIntroBar"></div>
        <div id="tIntroHead">
          <div id="tIHLogo">
            <img id="tIHLogoImg" src="https://assets.cdn.filesafe.space/KlBL9XEG0eVNlAqE7m5V/media/697971acd119a518486e9405.png" alt="TELEX Global Solutions" />
            <div id="tIHLogoName">TELEX Global Solutions<small>Your Partner to Scale Smarter</small></div>
          </div>
        </div>
        <div id="tIntroBody">
          <div id="tIntroLeft">
            <div id="tILEyebrow">Schedule a Discovery Call</div>
            <div id="tILBig">Let's Talk<br/><span>About Your</span> Business</div>
            <div id="tILDesc">Let us understand your needs and guide you through the best offshore operations and deployment solutions for your growing company.</div>
            <div id="tILFeats">
              <div class="tIFeat"><div class="tIFIcon"><svg width="11" height="11" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>15-minute discovery call</div>
              <div class="tIFeat"><div class="tIFIcon"><svg width="11" height="11" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>No commitment required</div>
              <div class="tIFeat"><div class="tIFIcon"><svg width="11" height="11" fill="none" stroke="#fff" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div>Expert consultation, zero cost</div>
            </div>
            <div id="tILLoc"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Central Luzon, Philippines</div>
          </div>
          <div id="tIntroRight">
            <div id="tIRLabel">How it works</div>
            <div id="tIRTitle">Book in two <br/><span>simple steps</span></div>
            <div id="tIntroSteps">
              <div class="tIStep active"><div class="tIStepNum">1</div><div><div class="tIStepTitle">Choose Date &amp; Time</div><div class="tIStepDesc">Pick a schedule that works best for you</div></div></div>
              <div class="tIStep"><div class="tIStepNum">2</div><div><div class="tIStepTitle">Enter Your Details</div><div class="tIStepDesc">Provide your contact info to confirm</div></div></div>
            </div>
            <div id="tIRBtns">
              <button type="button" id="tIntroCancel">CANCEL</button>
              <button type="button" id="tIntroStart">GET STARTED &#x2192;</button>
            </div>
          </div>
        </div>
      </div>
      <div id="tQ" style="display:none;">
        <div class="tTag">Quick check</div>
        <div class="tHdr">See if it's a fit: 4 quick questions</div>
        <div class="tSub"></div>
        <div id="tQErr" class="tErrBox"></div>
        <div id="tQG">
          ${qSelect('role', 'I am a')}
          ${qSelect('need', 'Main need')}
          ${qSelect('start', 'When do you want to start?')}
          ${qSelect('budget', 'Monthly budget for a dedicated agent')}
        </div>
        <div class="tFT"><button type="button" class="tBN" id="tQN">CONTINUE &#x2192;</button></div>
      </div>
      <div id="tNur" style="display:none;">
        <div id="tNForm">
          <div class="tHdr">Thanks, you're on our list.</div>
          <div class="tSub">Leave your name and email and we'll send you a short guide on how a dedicated agent works, plus pricing details.</div>
          <div id="tNErr" class="tErrBox"></div>
          <div id="tNG">
            <div class="tFGp"><label class="tFL" for="tNFN">First Name <span class="tReq">*</span></label><input id="tNFN" class="tFI" type="text" placeholder="Juan" required maxlength="100" autocomplete="given-name" oninput="this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÑñ .'’-]/g, '').replace(/ {2,}/g, ' ').replace(/^ /, '')"/></div>
            <div class="tFGp"><label class="tFL" for="tNEM">Email Address <span class="tReq">*</span></label><input id="tNEM" class="tFI" type="email" placeholder="juan@email.com" required maxlength="254" autocomplete="email" oninput="this.value = this.value.replace(/[^A-Za-z0-9._%+@-]/g, '')"/></div>
            <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;" aria-hidden="true" tabindex="-1"><input type="text" id="tNHp" autocomplete="off" tabindex="-1"></div>
          </div>
          <div class="tFT"><button type="button" class="tBN" id="tNS">SEND ME THE DETAILS</button></div>
        </div>
        <div id="tNDone" style="display:none;"><div class="tOkT">Done!</div><div class="tOkS">Check your inbox in a few minutes.</div></div>
      </div>
      <div id="tStpr" style="display:none;">
        <div class="tSW"><div class="tSC on" id="tC1">1</div><div class="tSL on" id="tL1">Time &amp; Date</div></div>
        <div class="tSLn"></div>
        <div class="tSW"><div class="tSC off" id="tC2">2</div><div class="tSL off" id="tL2">Contact Info</div></div>
      </div>
      <div id="tSt1" style="display:none;">
        <div class="tTag">Step 1 of 2</div>
        <div class="tHdr">Time &amp; Date Selection <span class="r">*</span></div>
        <div class="tSub">Available Monday – Friday, 09:00–18:00 your time. Weekends are unavailable.<div class="tTzRow"><span class="tTzLbl">Your timezone</span><label class="tTzField"><svg class="tTzGlobe" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></svg><select id="tTzSel" aria-label="Your timezone"></select><svg class="tTzCaret" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></label><span class="tTz24">Times in 24-hour format</span></div></div>
        <div id="tMG">
          <div class="tCW">
            <div class="tCH"><div class="tCM" id="tCLbl"></div><div class="tCNs"><button type="button" class="tCN" id="tPB">&#8249;</button><button type="button" class="tCN" id="tNB">&#8250;</button></div></div>
            <table class="tCT"><thead><tr id="tCHd"></tr></thead><tbody id="tCBd"></tbody></table>
          </div>
          <div class="tTW">
            <div class="tTT">Pick a time</div>
            <div class="tSlots" id="tSlots"></div>
          </div>
        </div>
        <div class="tFT"><div id="tSum" aria-live="polite"></div><button type="button" class="tBB" disabled>&#x2190; BACK</button><button type="button" class="tBN" id="tN1">NEXT &#x2192;</button></div>
      </div>
      <div id="tSt2" style="display:none;">
        <div class="tTag">Step 2 of 2</div>
        <div class="tHdr">Contact Information <span class="r">*</span></div>
        <div class="tSub">Please fill in your details to confirm the booking.</div>
        <div id="tErr"></div>
        <div id="tFG">
          <div class="tFGp"><label class="tFL">First Name <span class="tReq">*</span></label><input id="tFN" class="tFI" type="text" placeholder="Juan" required maxlength="100" autocomplete="given-name" oninput="this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÑñ .'’-]/g, '').replace(/ {2,}/g, ' ').replace(/^ /, '')" title="Letters, spaces, dots, apostrophes and hyphens only."/></div>
          <div class="tFGp"><label class="tFL">Last Name <span class="tReq">*</span></label><input id="tLN" class="tFI" type="text" placeholder="Dela Cruz" required maxlength="100" autocomplete="family-name" oninput="this.value = this.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÑñ .'’-]/g, '').replace(/ {2,}/g, ' ').replace(/^ /, '')" title="Letters, spaces, dots, apostrophes and hyphens only."/></div>
          <div class="tFGp"><label class="tFL">Email Address <span class="tReq">*</span></label><input id="tEM" class="tFI" type="email" placeholder="juan@email.com" required maxlength="254" autocomplete="email" oninput="this.value = this.value.replace(/[^A-Za-z0-9._%+@-]/g, '')" title="Please enter a valid email address."/></div>
          <div class="tFGp"><label class="tFL" for="tPH">Phone Number <span class="tReq">*</span></label><div class="tPhone" id="tPhone"><label class="tCc" id="tCc"><span class="tCcFlag" id="tCcFlag" aria-hidden="true"></span><span class="tCcCode" id="tCcCode">+63</span><svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg><select id="tCcSel" aria-label="Country code"></select></label><input id="tPH" class="tPhIn" type="tel" inputmode="tel" placeholder="Phone number" required maxlength="25" autocomplete="tel" title="Type or paste your number; spaces are added in your country's format once it is complete."/></div><div class="tPhHint" id="tPhHint" aria-live="polite"></div></div>
          <div class="tFGp full"><label class="tFL" for="tAG">How many support agents do you need? <span class="tReq">*</span></label><select id="tAG" class="tFI" required><option value="" selected disabled>Select a range</option><option value="1–4">1–4</option><option value="5–10">5–10</option><option value="11–20">11–20</option><option value="21–50">21–50</option><option value="51–100">51–100</option><option value="101+">101+</option></select></div>
          <div class="tFGp full"><label class="tFL">Notes / Questions (Optional)</label><input id="tNT" class="tFI" type="text" placeholder="Any specific topics you'd like to discuss..." maxlength="1000" oninput="this.value = this.value.replace(/[^A-Za-z0-9À-ÖØ-öø-ÿÑñ .,?!'()-]/g, '')" title="Letters, numbers, spaces and basic punctuation, up to 1000 characters."/></div>
          <!-- Honeypot -->
          <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;" aria-hidden="true" tabindex="-1">
            <input type="text" id="tHpField" name="t_hp_field" autocomplete="off" tabindex="-1">
          </div>
        </div>
        <div class="tFT"><button type="button" class="tBB" id="tBk">&#x2190; BACK</button><button type="button" class="tBN" id="tCB">CONFIRM BOOKING</button></div>
      </div>
    </div>`;
  document.body.appendChild(d);
}

function showOnly(id) {
  ['tIntro', 'tQ', 'tNur', 'tStpr', 'tSt1', 'tSt2'].forEach(function(s) { document.getElementById(s).style.display = 'none'; });
  document.getElementById('tOk').classList.remove('show');
  document.getElementById(id).style.display = 'block';
}

function showIntro() {
  window._formOpenedAt = Date.now();
  showOnly('tIntro');
}

function showQualify() {
  window._formOpenedAt = window._formOpenedAt || Date.now();
  showOnly('tQ');
}

function qualifyNext() {
  var a = {}, er = document.getElementById('tQErr');
  for (var k in QUALIFY) {
    a[k] = document.getElementById('tQ_' + k).value;
    if (!a[k]) { er.textContent = '⚠️ Please answer all 4 questions.'; er.style.display = 'block'; return; }
  }
  er.style.display = 'none';
  QA = a;
  var route = qualifyRoute(a);
  if (route === 'careers') { location.href = CAREERS_URL; return; }
  if (route === 'nurture') { showOnly('tNur'); return; }
  /* Meta Lead: qualified visitors only, once per page view, before the calendar */
  if (window.fbq && !window.__tgLead) { window.__tgLead = 1; fbq('track', 'Lead'); }
  showCalendar();
}

async function sendLead() {
  var fn = document.getElementById('tNFN').value.trim(), em = document.getElementById('tNEM').value.trim();
  var er = document.getElementById('tNErr'), btn = document.getElementById('tNS');
  var bad = !NAME_RE.test(fn) ? 'firstName' : (em.length > 254 || !EMAIL_RE.test(em)) ? 'email' : '';
  if (bad) { er.textContent = '⚠️ ' + FIELD_HELP[bad]; er.style.display = 'block'; return; }
  er.style.display = 'none';
  btn.disabled = true;
  try {
    var res = await fetch('https://app.telexph.com/api/intl/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: fn, email: em, qualify: QA,
        utm_source: ATTR.utm_source, utm_campaign: ATTR.utm_campaign, utm_content: ATTR.utm_content,
        _fax_number: document.getElementById('tNHp').value
      })
    });
    if (!res.ok) { var httpErr = new Error('HTTP ' + res.status); httpErr.status = res.status; throw httpErr; }
    document.getElementById('tNForm').style.display = 'none';
    document.getElementById('tNDone').style.display = 'block';
  } catch (e) {
    btn.disabled = false;
    er.textContent = e.status === 429 ? '⚠️ Too many attempts. Please wait 15 minutes and try again.'
      : e.status === 422 ? '⚠️ Please check your name and email and try again.'
      : '❌ Something went wrong. Please try again or email business@telexph.com.';
    er.style.display = 'block';
  }
}

/* Inline mode: the booking box lives in the #dedicated-agent section (intl/a1b-dedicated.html).
   GHL renders some blocks late, so this re-runs a few times, the same pattern as b2-bodyTrack.html. */
function mountInline() {
  var box = document.getElementById('daBook');
  if (!box || box.contains(OVL)) return;
  OVL.classList.remove('open');
  document.body.style.overflow = '';
  OVL.classList.add('tInline');
  box.appendChild(OVL);
  if (!INLINE) {
    INLINE = true;
    var n = zoneParts(Date.now(), clientZone); tYear = n.year; tMonth = n.month - 1;
    showQualify();
  }
}

function showCalendar() {
  window._formOpenedAt = window._formOpenedAt || Date.now();
  showOnly('tSt1');
  document.getElementById('tStpr').style.display='flex';
  document.getElementById('tC1').className='tSC on'; document.getElementById('tL1').className='tSL on';
  document.getElementById('tC2').className='tSC off'; document.getElementById('tL2').className='tSL off';
  rCal(); rTime(); rDisp();
}

function bindEvents() {
  document.getElementById('tXBtn').onclick = closeP;
  document.getElementById('tOvl').onclick = function(e){ if(e.target===this) closeP(); };
  document.getElementById('tPB').onclick = function(){ chgM(-1); };
  document.getElementById('tNB').onclick = function(){ chgM(1); };
  document.getElementById('tN1').onclick = go2;
  document.getElementById('tBk').onclick = go1;
  document.getElementById('tCB').onclick = submit;
  document.getElementById('tIntroCancel').onclick = closeP;
  document.getElementById('tIntroStart').onclick = showQualify;
  document.getElementById('tQN').onclick = qualifyNext;
  document.getElementById('tNS').onclick = sendLead;
  /* a1-book.html's exit popup stays away once the visitor starts the form */
  document.getElementById('tMdl').addEventListener('change', function() { window.tgFormStarted = 1; });

  var days=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var hdEl=document.getElementById('tCHd');
  days.forEach(function(d,i){
    var th=document.createElement('th');
    th.textContent=d;
    if(i===0||i===6) th.className='wknd';
    hdEl.appendChild(th);
  });

  initTzSelect();
  initPhone();
  document.getElementById('tSlots').onclick = function(e) {
    var b = e.target.closest('.tSlot');
    if (!b || b.disabled) return;
    tSlot = +b.dataset.t;
    rTime(); rDisp();
  };
}

function openP(){
  var sec=document.getElementById('dedicated-agent');
  if(INLINE&&sec){sec.scrollIntoView({behavior:'smooth',block:'start'});return;}
  var n=zoneParts(Date.now(),clientZone);tYear=n.year;tMonth=n.month-1;tDay=null;
  tSlot=null;
  showIntro();
  document.getElementById('tOvl').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeP(){
  if(INLINE)return;
  document.getElementById('tOvl').classList.remove('open');
  document.body.style.overflow='';
  document.getElementById('tErr').style.display='none';
  document.getElementById('tCB').disabled=false;
  document.getElementById('tLdr').classList.remove('show');
  showIntro();
}

function rCal(){
  document.getElementById('tCLbl').textContent=tMN[tMonth]+' '+tYear;
  var tb=document.getElementById('tCBd');tb.innerHTML='';
  var now=zoneParts(Date.now(),clientZone);
  var fd=new Date(tYear,tMonth,1).getDay(),dm=new Date(tYear,tMonth+1,0).getDate(),todayObj=new Date(now.year,now.month-1,now.day),day=1;
  for(var r=0;r<6;r++){
    if(day>dm)break;
    var tr=document.createElement('tr');
    for(var c=0;c<7;c++){
      var tdEl=document.createElement('td');
      if((r===0&&c<fd)||day>dm){tdEl.innerHTML='&nbsp;';}
      else{
        var dd=day;
        var isPast=new Date(tYear,tMonth,dd)<todayObj||new Date(tYear,tMonth,dd)>lastBookableDay(now);
        var isWknd=isWeekend(tYear,tMonth,dd);
        var isSel=dd===tDay;
        var isToday=dd===todayObj.getDate()&&tMonth===todayObj.getMonth()&&tYear===todayObj.getFullYear();
        var btn=document.createElement('button');
        btn.type='button';
        var cls='tDB';
        if(isSel)cls+=' sel';else if(isToday)cls+=' tdy';
        if(isWknd)cls+=' wknd';
        btn.className=cls;btn.textContent=dd;
        if(isPast||isWknd){btn.disabled=true;}
        else{btn.onclick=(function(x){return function(){tDay=x;tSlotsFetched=false;fetchBookedSlots();rCal();rTime();rDisp();};})(dd);}
        tdEl.appendChild(btn);day++;
      }
      tr.appendChild(tdEl);
    }
    tb.appendChild(tr);
  }
}

function chgM(dir){
  var now=zoneParts(Date.now(),clientZone),ahead=(tYear-now.year)*12+tMonth-(now.month-1)+dir;
  if(ahead<0||ahead>12)return;
  tMonth+=dir;
  if(tMonth>11){tMonth=0;tYear++;}if(tMonth<0){tMonth=11;tYear--;}
  tDay=null;rCal();rTime();rDisp();
}

function fetchBookedSlots() {
  if (!tDay) { rTime(); return; }
  var key = dayKey();
  var startEpoch = zoneInstant(clientZone, tYear, tMonth, tDay, 0);
  var endEpoch = zoneInstant(clientZone, tYear, tMonth, tDay + 1, 0) - 1;
  fetch('https://app.telexph.com/api/intl/slots?startTime=' + startEpoch + '&endTime=' + endEpoch, { method: 'GET' })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      var busy = [];
      (data.events || data.appointments || data.data || []).forEach(function(event) {
        if (/cancel|invalid/i.test(event.appointmentStatus || event.status || '')) return;
        var s = Date.parse(event.startTime || event.start_time || event.startAt || '');
        if (isNaN(s)) return;
        var e = Date.parse(event.endTime || event.end_time || event.endAt || '');
        busy.push([s, isNaN(e) ? s + CALL_MS : e]);
      });
      bookedSlots[key] = busy;
      tSlotsFetched = true;
      rTime(); rDisp();
    })
    .catch(function() {
      tSlotsFetched = true;
      rCal(); rTime(); rDisp();
    });
}

function rTime(){
  var box=document.getElementById('tSlots');
  if(!box)return;
  if(!tDay){box.innerHTML='<div class="tSlotMsg"><b>Select a date</b>Available times will show here.</div>';return;}
  var html='',open=0,future=0;
  CLIENT_SLOTS.forEach(function(t){
    var st=slotState(t),sel=tSlot===t;
    if(st.closed){if(sel)tSlot=null;return;}
    if(!st.past)future++;
    if(st.past||st.taken){if(sel)tSlot=null;sel=false;}else open++;
    html+='<button type="button" class="tSlot'+(sel?' sel':'')+'" data-t="'+t+'"'+(st.past||st.taken?' disabled':'')+
      ' aria-pressed="'+sel+'">'+hhmm(t)+'</button>';
  });
  box.innerHTML=open?html:(future
    ?'<div class="tSlotMsg"><b>This day is fully booked</b>Please select a different date.</div>'
    :'<div class="tSlotMsg"><b>Closed for today</b>Please select a future date.</div>');
}

window.tToast = function(msg){
  if(!document.getElementById('tToastStyle')){
    var st=document.createElement('style');st.id='tToastStyle';
    st.textContent=[
      '@keyframes tToastIn{from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}',
      '@keyframes tToastOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-12px) scale(.97)}}',
      '#tToastWrap{position:fixed;top:24px;left:0;right:0;z-index:9999999;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;padding:0 16px;}',
      '.tToast{display:flex;align-items:center;gap:13px;background:#fff;border:1px solid #EFEBE6;border-radius:12px;padding:14px 20px;box-shadow:0 4px 14px rgba(0,0,0,.07),0 1px 4px rgba(0,0,0,.04);font-family:\'Open Sans\',sans-serif;font-size:13.5px;font-weight:600;color:#1C1C1C;max-width:400px;pointer-events:auto;animation:tToastIn .28s cubic-bezier(.16,1,.3,1);}',
      '.tToast.hide{animation:tToastOut .22s ease forwards;}',
      '.tToastIco{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#A10000,#6B0000);display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      '@media(max-width:480px){.tToast{font-size:12.5px;padding:12px 16px;}}'
    ].join('');
    document.head.appendChild(st);
  }
  var wrap=document.getElementById('tToastWrap');
  if(!wrap){wrap=document.createElement('div');wrap.id='tToastWrap';document.body.appendChild(wrap);}
  var t=document.createElement('div');t.className='tToast';
  t.innerHTML='<div class="tToastIco"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6"><line x1="12" y1="7" x2="12" y2="13"/><circle cx="12" cy="17" r=".6" fill="#fff"/></svg></div><span></span>';
  t.querySelector('span').textContent=msg;
  wrap.appendChild(t);
  setTimeout(function(){
    t.classList.add('hide');
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); },240);
  },3000);
};

function go2(){
  if(!tDay){tToast('Please select a date first.');return;}
  if(tSlot===null){tToast('Please select a time.');return;}
  var st=slotState(tSlot);
  if(st.past){tToast('This time slot has already passed. Please select a future time.');return;}
  if(st.taken||st.closed){tToast('This time slot is already booked. Please select a different time.');return;}
  document.getElementById('tSt1').style.display='none';document.getElementById('tSt2').style.display='block';document.getElementById('tC2').className='tSC on';document.getElementById('tL2').className='tSL on';document.getElementById('tC1').className='tSC off';document.getElementById('tL1').className='tSL off';
}
function go1(){document.getElementById('tSt2').style.display='none';document.getElementById('tSt1').style.display='block';document.getElementById('tC1').className='tSC on';document.getElementById('tL1').className='tSL on';document.getElementById('tC2').className='tSC off';document.getElementById('tL2').className='tSL off';}

var PHONE_LIB = 'https://cdn.jsdelivr.net/npm/libphonenumber-js@1.13.15/bundle/libphonenumber-max.js';
var PHONE_LIB_SRI = 'sha384-KFpFw4Q7EIpeK/WJ3azDRjpDeYmDLF9DdzBb3LMPtHHFi/99I94irctbZUeBVBQv';
var phoneCountry = 'PH', phoneTouched = false;

function countryName(cc) { try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc); } catch (e) { return cc; } }

function setPhoneCountry(cc) {
  if (typeof libphonenumber === 'undefined') return;
  phoneCountry = cc;
  document.getElementById('tCcSel').value = cc;
  document.getElementById('tCcCode').textContent = '+' + libphonenumber.getCountryCallingCode(cc);
  document.getElementById('tCcFlag').style.backgroundImage = 'url(https://flagcdn.com/w40/' + cc.toLowerCase() + '.png)';
}

function showPhoneHint(msg) {
  document.getElementById('tPhHint').textContent = msg;
  document.getElementById('tPhone').classList.toggle('bad', !!msg);
}

function initPhone() {
  var wrap = document.getElementById('tPhone'), input = document.getElementById('tPH'), sel = document.getElementById('tCcSel');
  wrap.classList.add('noCc');
  input.placeholder = '+639171234567';
  var s = document.createElement('script');
  s.src = PHONE_LIB; s.integrity = PHONE_LIB_SRI; s.crossOrigin = 'anonymous'; s.async = true;
  s.onload = function() {
    libphonenumber.getCountries().map(function(cc) {
      return { cc: cc, label: countryName(cc) + ' (+' + libphonenumber.getCountryCallingCode(cc) + ')' };
    }).sort(function(a, b) { return a.label.localeCompare(b.label); }).forEach(function(o) { sel.add(new Option(o.label, o.cc)); });
    wrap.classList.remove('noCc');
    input.placeholder = 'Phone number';
    setPhoneCountry(defaultPhoneCountry(clientZone, navigator.language));
  };
  document.head.appendChild(s);

  sel.addEventListener('change', function() {
    phoneTouched = true; setPhoneCountry(this.value); showPhoneHint('');
    input.value = formatPhone(cleanPhoneInput(input.value), phoneCountry);
  });
  input.addEventListener('input', function() {
    showPhoneHint('');
    var clean = cleanPhoneInput(this.value);
    if (typeof libphonenumber !== 'undefined' && clean.charAt(0) === '+') {
      var p = libphonenumber.parsePhoneNumberFromString(clean);
      if (p && p.country && p.country !== phoneCountry) { phoneTouched = true; setPhoneCountry(p.country); }
    }
    this.value = formatPhone(clean, phoneCountry);
  });
  input.addEventListener('blur', function() {
    var v = this.value.trim();
    if (!v) return showPhoneHint('');
    showPhoneHint(phoneE164(v, phoneCountry) ? '' : phoneHelp());
  });
}

/* Timezone changed and the client never picked a phone country: follow the timezone */
function syncPhoneCountry() {
  if (!phoneTouched && typeof libphonenumber !== 'undefined') setPhoneCountry(defaultPhoneCountry(clientZone, navigator.language));
}

function phoneHelp() {
  return typeof libphonenumber === 'undefined'
    ? 'Please enter your phone number with the country code, for example +639171234567.'
    : 'Please enter a valid ' + countryName(phoneCountry) + ' phone number, or pick your country code.';
}

var FIELD_HELP = {
  firstName: 'Please enter a valid first name (letters only, up to 100 characters).',
  lastName: 'Please enter a valid last name (letters only, up to 100 characters).',
  email: 'Please enter a valid email address, for example juan@email.com.',
  agentsNeeded: 'Please choose how many support agents you need.',
  notes: 'Please shorten your notes to 1000 characters.'
};

async function submit(){
  var fn=document.getElementById('tFN').value.trim(),ln=document.getElementById('tLN').value.trim();
  var em=document.getElementById('tEM').value.trim(),ph=document.getElementById('tPH').value.trim();
  var nt=document.getElementById('tNT').value.trim(),er=document.getElementById('tErr');
  var ag=document.getElementById('tAG').value;
  if(!fn||!ln||!em||!ph||!ag){er.textContent='⚠️ Please fill in all required fields.';er.style.display='block';return;}
  var badField=contactError({firstName:fn,lastName:ln,email:em,phoneNumber:ph,phoneCountry:phoneCountry,agentsNeeded:ag,notes:nt});
  if(badField){er.textContent='⚠️ '+(badField==='phoneNumber'?phoneHelp():FIELD_HELP[badField]);er.style.display='block';if(badField==='phoneNumber')showPhoneHint(phoneHelp());return;}
  er.style.display='none';
  document.getElementById('tLdr').classList.add('show');
  document.getElementById('tCB').disabled=true;
  var startMs=zoneInstant(clientZone,tYear,tMonth,tDay,Math.floor(tSlot/60),tSlot%60);
  var clientDate=new Date(tYear,tMonth,tDay).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  var notesValue=nt||'No additional notes or questions were provided by the client at the time of booking.';
  /* Meta: same event ID for the pixel and the backend Conversions API, so the booking counts once */
  var evId='book_'+Date.now()+'_'+Math.random().toString(36).slice(2,8);
  function ck(n){var m=document.cookie.match('(?:^|; )'+n+'=([^;]*)');return m?m[1]:'';}
  var payload={
    contact:{
      firstName:fn,
      lastName:ln,
      email:em,
      phoneNumber:phoneE164(ph,phoneCountry),
      agentsNeeded:ag,
      notes:notesValue
    },
    /* The backend checks the slot in the client's timezone and adds the PH date/time for GHL */
    appointment:{
      startAt:new Date(startMs).toISOString(),
      timezone:clientZone
    },
    source:'telexph-a1-hero',
    channel:CHANNEL,
    lastChannel:LAST_CHANNEL,
    timestamp:new Date().toISOString(),
    meta_event_id:evId,
    fbp:ck('_fbp')||undefined,
    fbc:ck('_fbc')||undefined,
    utm_source:ATTR.utm_source,
    utm_campaign:ATTR.utm_campaign,
    utm_content:ATTR.utm_content,
    fbclid:ATTR.fbclid,
    qualify:QA||undefined,
    _fax_number: document.getElementById('tHpField') ? document.getElementById('tHpField').value : '',
    _time_to_fill: window._formOpenedAt ? (Date.now() - window._formOpenedAt) : 0
  };

  try{
    var res=await fetch('https://app.telexph.com/api/intl/booking',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    var resText=await res.text();
    if(!res.ok){var httpErr=new Error('HTTP '+res.status+': '+resText);httpErr.status=res.status;throw httpErr;}

    myBookings.push([startMs,startMs+CALL_MS]);
    document.getElementById('tLdr').classList.remove('show');
    document.getElementById('tSt2').style.display='none';
    document.getElementById('tStpr').style.display='none';
    document.getElementById('tOk').classList.add('show');
    document.getElementById('tOkD').innerHTML='<div><b>Name:</b> '+esc(fn+' '+ln)+'</div><div><b>Email:</b> '+esc(em)+'</div><div><b>Date:</b> '+clientDate+'</div><div><b>Time:</b> '+hhmm(tSlot)+' (your time)</div>';
    if(window.fbq)fbq('track','Schedule',{content_name:'Discovery Call'},{eventID:evId});
  }catch(e){
    document.getElementById('tLdr').classList.remove('show');
    document.getElementById('tCB').disabled=false;
    var details=[];
    try{details=JSON.parse(String(e.message).replace(/^HTTP \d+: /,'')).details||[];}catch(x){}
    var field=(details.find(function(d){return /^contact\./.test(d.field);})||{}).field;
    if(e.status===422&&field){
      var key=field.split('.')[1];
      er.textContent='⚠️ '+(key==='phoneNumber'?phoneHelp():FIELD_HELP[key]||'Please check your details and try again.');
    }else if(e.status===422||e.status===409){
      er.textContent='⚠️ That time is no longer available. Please go back and pick another time.';
      tSlotsFetched=false;fetchBookedSlots();
    }else if(e.status===429){
      er.textContent='⚠️ Too many booking attempts. Please wait 15 minutes and try again.';
    }else{
      er.textContent='❌ Something went wrong. Please try again or contact us directly.';
    }
    er.style.display='block';
  }
}

function init(){
  injectCSS();
  injectHTML();
  bindEvents();
  _telexOpenP = openP;
  window.openTelexBooking = openP;
  window.soOpenModal = openP;
  window.soCloseModal = closeP;
  mountInline();
  [300, 1500, 4000, 8000].forEach(function(ms) { setTimeout(mountInline, ms); });
  window.addEventListener('load', mountInline);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}

})();
