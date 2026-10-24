/* Tulips website — menu, gallery, age checker and the enquiry / visit form.
   Talks to the Preschool Desk app only through its public "website" function. */
(function () {
  'use strict';
  var API = 'https://qtqmrfsndcxatbreclzi.supabase.co/functions/v1/website?school=tulips';
  var LANG = document.documentElement.lang === 'mr' ? 'mr' : 'en';
  var openedAt = Date.now();

  var T = {
    en: {
      young: 'Your child is a little young for our classes in {year}. Please choose a later school year, or call us.',
      old: 'Your child is past our pre-primary age for {year}. Please call us and we will guide you.',
      suggest: 'Suggested class for {year}',
      grace: 'Your child’s birthday falls in the grace period. Please contact the school to confirm the class.',
      otherBoard: 'For other boards the age cut-off differs. Please call or WhatsApp us and we will guide you.',
      needDob: 'Enter your child’s date of birth.',
      enquire: 'Enquire for this class',
      chooseDate: 'Choose a date', chooseTime: 'Choose a time', noSlots: 'No visit times are free at this branch right now. Send the enquiry and we will call you.',
      sending: 'Sending…', send: 'Send enquiry', sendVisit: 'Send enquiry and book visit',
      okTitle: 'Thank you! We have received your enquiry.',
      okAgain: 'Thank you! We already had your enquiry; we have added this to it.',
      okClass: 'Suggested class: {cls}.',
      okVisit: 'Your school visit is booked: {when} at our {branch} branch. Please bring your child along.',
      okCall: 'Our team will call you soon on {phone}.',
      badPhone: 'Enter a 10-digit mobile number.', badName: 'Enter this name.', badBranch: 'Choose a branch.', badYear: 'Choose the school year.',
      failed: 'Sorry, something went wrong. Please call us on +91 90110 32851 or WhatsApp +91 74997 68838.',
      offline: 'Could not reach the school’s system. Please check your internet, or call +91 90110 32851.',
      at: 'at'
    },
    mr: {
      young: '{year} साठी आपले मूल अजून थोडे लहान आहे. कृपया पुढील शैक्षणिक वर्ष निवडा किंवा आम्हाला फोन करा.',
      old: '{year} साठी आपले मूल बालवाडीच्या वयापेक्षा मोठे आहे. कृपया आम्हाला फोन करा, आम्ही मार्गदर्शन करू.',
      suggest: '{year} साठी योग्य वर्ग',
      grace: 'आपल्या मुलाचा वाढदिवस सवलतीच्या कालावधीत येतो. वर्ग निश्चित करण्यासाठी कृपया शाळेशी संपर्क साधा.',
      otherBoard: 'इतर मंडळांसाठी वयाची अट वेगळी असते. कृपया फोन किंवा व्हॉट्सअॅप करा, आम्ही मार्गदर्शन करू.',
      needDob: 'मुलाची जन्मतारीख भरा.',
      enquire: 'या वर्गासाठी चौकशी करा',
      chooseDate: 'दिवस निवडा', chooseTime: 'वेळ निवडा', noSlots: 'या शाखेत सध्या भेटीची वेळ उपलब्ध नाही. चौकशी पाठवा, आम्ही फोन करू.',
      sending: 'पाठवत आहोत…', send: 'चौकशी पाठवा', sendVisit: 'चौकशी पाठवा व भेट ठरवा',
      okTitle: 'धन्यवाद! आपली चौकशी आम्हाला मिळाली.',
      okAgain: 'धन्यवाद! आपली चौकशी आधीच आमच्याकडे आहे; ही माहिती त्यात जोडली आहे.',
      okClass: 'योग्य वर्ग: {cls}.',
      okVisit: 'आपली शाळा भेट निश्चित झाली: {when}, आमच्या {branch} शाखेत. कृपया मुलाला सोबत आणा.',
      okCall: 'आमची टीम लवकरच {phone} या क्रमांकावर फोन करेल.',
      badPhone: '१० अंकी मोबाइल क्रमांक भरा.', badName: 'हे नाव भरा.', badBranch: 'शाखा निवडा.', badYear: 'शैक्षणिक वर्ष निवडा.',
      failed: 'क्षमस्व, काहीतरी चुकले. कृपया +९१ ९०११० ३२८५१ वर फोन करा किंवा +९१ ७४९९७ ६८८३८ वर व्हॉट्सअ‍ॅप करा.',
      offline: 'शाळेच्या यंत्रणेशी संपर्क झाला नाही. इंटरनेट तपासा किंवा +९१ ९०११० ३२८५१ वर फोन करा.',
      at: ''
    }
  }[LANG];

  var MR_NAMES = {
    'Playgroup': 'प्ले ग्रुप', 'Nursery': 'नर्सरी', 'Jr. KG': 'ज्युनिअर केजी', 'Sr. KG': 'सिनिअर केजी',
    'Gaonbhag': 'गावभाग', 'Sangli Road': 'सांगली रोड',
    'Tulips Montessori Balmandir Gaonbhag': 'ट्युलिप्स मॉंटेसोरी बालमंदिर, गावभाग',
    'SSC Board': 'राज्य मंडळ (SSC)', 'CBSE': 'CBSE', 'Marathi medium': 'मराठी माध्यम'
  };
  var EN_NAMES = { 'SSC Board': 'State board (SSC)', 'Tulips Montessori Balmandir Gaonbhag': 'Montessori Balmandir, Gaonbhag (Marathi medium)' };
  function nm(s) { return LANG === 'mr' ? (MR_NAMES[s] || s) : (EN_NAMES[s] || s); }
  function fill(s, o) { return s.replace(/\{(\w+)\}/g, function (_, k) { return o[k] == null ? '' : o[k]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, text) { var e = document.createElement(tag); for (var k in (attrs || {})) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }

  /* ---------- menu, video, reveal ---------- */
  var menuBtn = $('.menu-btn'), mnav = $('.mobile-nav');
  if (menuBtn && mnav) menuBtn.addEventListener('click', function () {
    var open = mnav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  var hv = $('.hero video'), hp = $('.hero .pause');
  if (hv) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { hv.removeAttribute('autoplay'); hv.pause(); }
    if (hp) hp.addEventListener('click', function () {
      if (hv.paused) { hv.play(); hp.setAttribute('aria-label', hp.dataset.pause); hp.innerHTML = hp.dataset.iconPause; }
      else { hv.pause(); hp.setAttribute('aria-label', hp.dataset.play); hp.innerHTML = hp.dataset.iconPlay; }
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    $all('.reveal').forEach(function (e) { io.observe(e); });
  } else { $all('.reveal').forEach(function (e) { e.classList.add('in'); }); }

  /* ---------- gallery ---------- */
  $all('.filters').forEach(function (bar) {
    var grid = $('#' + bar.dataset.for);
    bar.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      $all('button', bar).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $all('figure', grid).forEach(function (f) { f.classList.toggle('hidden', b.dataset.cat !== 'all' && f.dataset.cat.indexOf(b.dataset.cat) < 0); });
    });
  });
  var lb = $('.lightbox');
  if (lb) {
    var lbImg = $('img', lb), lbCap = $('p', lb), lastFocus = null;
    document.addEventListener('click', function (ev) {
      var b = ev.target.closest('.gallery button[data-full]'); if (!b) return;
      lastFocus = b; lbImg.src = b.dataset.full; lbImg.alt = b.dataset.cap; lbCap.textContent = b.dataset.cap;
      lb.classList.add('open'); $('button', lb).focus();
    });
    function closeLb() { lb.classList.remove('open'); lbImg.removeAttribute('src'); if (lastFocus) lastFocus.focus(); }
    $('button', lb).addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  /* ---------- config from the app ---------- */
  var cfgEl = document.getElementById('tl-config');
  var CFG = cfgEl ? JSON.parse(cfgEl.textContent) : null;
  var cfgReady = [];
  function whenConfig(fn) { if (CFG) fn(CFG); cfgReady.push(fn); }
  if ($('[data-agecheck]') || $('[data-enquiry]') || $('[data-insta]') || $('[data-app-photos]')) {
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    fetch(API, { signal: ctl ? ctl.signal : undefined }).then(function (r) { return r.json(); }).then(function (j) {
      clearTimeout(timer);
      if (j && j.ok) { CFG = j; cfgReady.forEach(function (fn) { fn(CFG); }); }
    }).catch(function () { /* keep the copy saved when the site was built */ });
  }

  /* ---------- Instagram posts (the app syncs them; see WEBSITE_API.md) ---------- */
  var insta = $('[data-insta]');
  if (insta) whenConfig(function (cfg) {
    var grid = $('.insta-grid', insta);
    var posts = ((cfg.instagram && cfg.instagram.posts) || []).filter(function (p) { return p.image && /^https:\/\/(www\.)?instagram\.com\//.test(p.permalink || ''); }).slice(0, 12);
    var key = posts.map(function (p) { return p.id + p.image; }).join();
    if (!posts.length || grid.dataset.key === key) return;  // nothing new since the copy built into the page
    grid.dataset.key = key; grid.textContent = '';
    posts.forEach(function (p) {
      var cap = (p.caption || '').replace(/\s+/g, ' ').trim();
      var short = cap.length > 90 ? cap.slice(0, 88) + '…' : cap;
      var a = el('a', { href: p.permalink, target: '_blank', rel: 'noopener', 'aria-label': (short || grid.dataset.open) + ' — ' + grid.dataset.open });
      a.appendChild(el('img', { src: p.image, alt: short || grid.dataset.open, loading: 'lazy', decoding: 'async' }));
      var kind = p.type === 'VIDEO' ? grid.dataset.video : p.type === 'CAROUSEL_ALBUM' ? grid.dataset.album : '';
      if (kind) a.appendChild(el('span', { class: 'kind' }, (p.type === 'VIDEO' ? '▶ ' : '❐ ') + kind));
      var f = el('figure'); f.appendChild(a);
      if (short) f.appendChild(el('figcaption', null, short));
      grid.appendChild(f);
    });
    if (grid.childNodes.length) insta.hidden = false;
  });

  /* ---------- photos the school approves in the app (see WEBSITE_API.md) ---------- */
  var gal = $('[data-app-photos]');
  if (gal) whenConfig(function (cfg) {
    if (!cfg.photos) return;
    var ok = /^https:\/\/qtqmrfsndcxatbreclzi\.supabase\.co\//;
    var photos = cfg.photos.filter(function (p) { return ok.test(p.thumb || '') && ok.test(p.full || ''); }).slice(0, 60);
    var key = photos.map(function (p) { return p.id + p.full; }).join();
    if (gal.dataset.key === key) return;
    gal.dataset.key = key;
    $all('figure.from-app', gal).forEach(function (f) { f.remove(); });  // a hidden or deleted photo disappears too
    var pressed = $('.filters[data-for="' + gal.id + '"] button[aria-pressed="true"]'), cat = pressed ? pressed.dataset.cat : 'all';
    var first = gal.firstChild;
    photos.forEach(function (p) {
      var text = (LANG === 'mr' && p.caption_mr) ? p.caption_mr : (p.caption_en || '');
      var cap = p.centre ? (text ? text + ' · ' : '') + nm(p.centre).replace(/\s*\(.*\)$/, '') : text;  // short branch name on tiles
      var b = el('button', { type: 'button', 'data-full': p.full, 'data-cap': cap, 'aria-label': cap || gal.dataset.photo });
      b.appendChild(el('img', { src: p.thumb, alt: cap || gal.dataset.photo, loading: 'lazy', decoding: 'async' }));
      var f = el('figure', { 'data-cat': p.category || 'events', class: 'from-app' }); f.appendChild(b);
      f.appendChild(el('span', { class: 'new' }, gal.dataset.new));
      if (cap) f.appendChild(el('figcaption', null, cap));
      if (cat !== 'all' && f.dataset.cat.indexOf(cat) < 0) f.classList.add('hidden');
      gal.insertBefore(f, first);
    });
  });

  /* ---------- age rules (same as the app; see WEBSITE_API.md) ---------- */
  function parseDate(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? { y: +m[1], m: +m[2], d: +m[3] } : null; }
  function daysIn(y, m) { return new Date(Date.UTC(y, m, 0)).getUTCDate(); }
  function countDate(set, year) { var y = parseInt(String(year).slice(0, 4), 10); var m = set.count_month; return { y: y, m: m, d: Math.min(set.count_day, daysIn(y, m)) }; }
  function addDays(d, n) { var t = new Date(Date.UTC(d.y, d.m - 1, d.d + n)); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; }
  function ageMonths(dob, on) { var mo = (on.y - dob.y) * 12 + (on.m - dob.m); if (on.d < dob.d) mo -= 1; return mo; }
  function classFor(set, dob, on) {
    var rules = (set.rules || []).slice().sort(function (a, b) { return a.min_months - b.min_months; });
    if (!rules.length) return { kind: 'none' };
    var age = ageMonths(dob, on);
    if (age < rules[0].min_months) return { kind: 'young' };
    if (age >= rules[rules.length - 1].min_months + 12) return { kind: 'old' };
    var pick = rules[0]; rules.forEach(function (r) { if (age >= r.min_months) pick = r; });
    return { kind: 'ok', cls: pick.class_name };
  }
  function suggest(set, dobStr, year) {
    var dob = parseDate(dobStr); if (!dob) return null;
    var on = countDate(set, year);
    var res = classFor(set, dob, on);
    if (set.grace_days > 0) {
      var later = classFor(set, dob, addDays(on, set.grace_days));
      if (later.kind !== res.kind || later.cls !== res.cls) res.grace = true;
    }
    return res;
  }
  function setsFor(cfg, medium) { return (cfg.age_rule_sets || []).filter(function (s) { return (s.medium || 'english') === medium; }); }

  function fillYears(sel, cfg) {
    var keep = sel.value; sel.innerHTML = '';
    (cfg.joining_years || []).forEach(function (y, i) { var o = el('option', { value: y }, y); sel.appendChild(o); });
    if (keep && $all('option', sel).some(function (o) { return o.value === keep; })) sel.value = keep;
    else if (sel.options.length > 1) sel.selectedIndex = sel.options.length - 1;
  }
  function fillBoards(sel, cfg, medium, otherLabel) {
    var keep = sel.value; sel.innerHTML = '';
    setsFor(cfg, medium).forEach(function (s) { sel.appendChild(el('option', { value: s.id }, nm(s.name))); });
    if (medium === 'english') sel.appendChild(el('option', { value: 'other' }, otherLabel));
    if (keep && $all('option', sel).some(function (o) { return o.value === keep; })) sel.value = keep;
  }

  /* ---------- age checker ---------- */
  $all('[data-agecheck]').forEach(function (form) {
    var dob = $('[name=dob]', form), year = $('[name=year]', form), board = $('[name=board]', form), boardWrap = $('.board-wrap', form), out = $('.result', form);
    function medium() { var r = $('[name=medium]:checked', form); return r ? r.value : 'english'; }
    function sync(cfg) {
      fillYears(year, cfg);
      var md = medium();
      fillBoards(board, cfg, md, form.dataset.other);
      boardWrap.style.display = md === 'marathi' ? 'none' : '';
    }
    whenConfig(sync);
    $all('[name=medium]', form).forEach(function (r) { r.addEventListener('change', function () { if (CFG) sync(CFG); }); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      out.className = 'result show';
      if (!dob.value) { out.classList.add('bad'); out.innerHTML = ''; out.appendChild(el('p', null, T.needDob)); return; }
      var md = medium();
      var setId = md === 'marathi' ? (setsFor(CFG, 'marathi')[0] || {}).id : board.value;
      out.innerHTML = '';
      if (setId === 'other' || !setId) { out.classList.add('warn'); out.appendChild(el('p', null, T.otherBoard)); return; }
      var set = (CFG.age_rule_sets || []).filter(function (s) { return s.id === setId; })[0];
      var res = suggest(set, dob.value, year.value);
      if (!res || res.kind === 'none') { out.classList.add('warn'); out.appendChild(el('p', null, T.otherBoard)); return; }
      if (res.kind === 'young') { out.classList.add('warn'); out.appendChild(el('p', null, fill(T.young, { year: year.value }))); }
      else if (res.kind === 'old') { out.classList.add('warn'); out.appendChild(el('p', null, fill(T.old, { year: year.value }))); }
      else {
        out.classList.add('good');
        out.appendChild(el('p', { class: 'mb-0' }, fill(T.suggest, { year: year.value })));
        out.appendChild(el('p', { class: 'big' }, nm(res.cls)));
      }
      if (res.grace) out.appendChild(el('p', null, T.grace));
      var target = form.dataset.enquiryTarget;
      if (target && res.kind === 'ok') {
        var a = el('a', { href: target, class: 'btn btn-pink' }, T.enquire);
        a.addEventListener('click', function (e) {
          var f = $('[data-enquiry]');
          if (f) { e.preventDefault(); prefillEnquiry(f, { dob: dob.value, medium: md, set: setId, year: year.value }); f.scrollIntoView({ behavior: 'smooth' }); }
          else { sessionStorageSet({ dob: dob.value, medium: md, set: setId, year: year.value }); }
        });
        out.appendChild(a);
      }
    });
  });
  function sessionStorageSet(v) { try { sessionStorage.setItem('tl-pre', JSON.stringify(v)); } catch (e) { } }
  function sessionStorageGet() { try { var v = sessionStorage.getItem('tl-pre'); sessionStorage.removeItem('tl-pre'); return v ? JSON.parse(v) : null; } catch (e) { return null; } }

  /* ---------- enquiry + visit ---------- */
  function fmtSlot(s, part) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s); if (!m) return s;
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
    var loc = LANG === 'mr' ? 'mr-IN' : 'en-IN';
    if (part === 'date') return d.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
    if (part === 'time') return clock(d);
    return d.toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) + (T.at ? ' ' + T.at + ' ' : ', ') + clock(d);
  }
  function clock(d) {   // 10:30 AM  /  सकाळी १०:३०
    var h = d.getUTCHours(), m = d.getUTCMinutes(), h12 = h % 12 || 12, mm = (m < 10 ? '0' : '') + m;
    if (LANG !== 'mr') return h12 + ':' + mm + (h < 12 ? ' AM' : ' PM');
    var dv = function (s) { return String(s).replace(/\d/g, function (x) { return '०१२३४५६७८९'.charAt(+x); }); };
    return (h < 12 ? 'सकाळी ' : (h < 16 ? 'दुपारी ' : 'संध्याकाळी ')) + dv(h12 + ':' + mm);
  }
  var prefillers = [];
  function prefillEnquiry(form, v) { prefillers.forEach(function (fn) { fn(form, v); }); }

  $all('[data-enquiry]').forEach(function (form) {
    var q = function (n) { return $('[name=' + n + ']', form); };
    var branch = q('centre_id'), year = q('joining_year'), board = q('board'), boardWrap = $('.board-wrap', form);
    var wantVisit = q('want_visit'), vbox = $('.visit-box', form), vdate = q('visit_date'), vtime = q('visit_time'), vnote = $('.visit-note', form);
    var out = $('.result', form), submit = $('[type=submit]', form);
    function medium() { var r = $('[name=medium]:checked', form); return r ? r.value : 'english'; }
    function centre(cfg) { return (cfg.centres || []).filter(function (c) { return c.id === branch.value; })[0]; }

    function syncBranches(cfg) {
      var md = medium(), keep = branch.value; branch.innerHTML = '';
      branch.appendChild(el('option', { value: '' }, form.dataset.chooseBranch));
      (cfg.centres || []).forEach(function (c) { if ((c.mediums || []).indexOf(md) >= 0) branch.appendChild(el('option', { value: c.id }, nm(c.name))); });
      if (keep && $all('option', branch).some(function (o) { return o.value === keep; })) branch.value = keep;
      else if (branch.options.length === 2) branch.selectedIndex = 1;
      fillBoards(board, cfg, md, form.dataset.other);
      boardWrap.style.display = md === 'marathi' ? 'none' : '';
      syncSlots(cfg);
    }
    function syncSlots(cfg) {
      var c = centre(cfg), slots = (c && c.visit_slots) || [];
      vdate.innerHTML = ''; vtime.innerHTML = '';
      vdate.appendChild(el('option', { value: '' }, T.chooseDate));
      var days = [];
      slots.forEach(function (s) { var d = s.slice(0, 10); if (days.indexOf(d) < 0) days.push(d); });
      days.forEach(function (d) { vdate.appendChild(el('option', { value: d }, fmtSlot(d + 'T00:00', 'date'))); });
      vnote.textContent = c && !slots.length ? T.noSlots : '';
      syncTimes(cfg);
    }
    function syncTimes(cfg) {
      var c = centre(cfg), slots = (c && c.visit_slots) || [];
      vtime.innerHTML = ''; vtime.appendChild(el('option', { value: '' }, T.chooseTime));
      slots.filter(function (s) { return s.slice(0, 10) === vdate.value; }).forEach(function (s) { vtime.appendChild(el('option', { value: s }, fmtSlot(s, 'time'))); });
    }
    function syncVisitUi() {
      vbox.classList.toggle('show', wantVisit.checked);
      submit.textContent = wantVisit.checked ? T.sendVisit : T.send;
    }
    whenConfig(function (cfg) { fillYears(year, cfg); syncBranches(cfg); });
    $all('[name=medium]', form).forEach(function (r) { r.addEventListener('change', function () { if (CFG) syncBranches(CFG); }); });
    branch.addEventListener('change', function () { if (CFG) syncSlots(CFG); });
    vdate.addEventListener('change', function () { if (CFG) syncTimes(CFG); });
    wantVisit.addEventListener('change', syncVisitUi);
    if (/[?&]visit=1/.test(location.search) || location.hash === '#visit') { wantVisit.checked = true; }
    syncVisitUi();

    prefillers.push(function (f, v) {
      if (f !== form) return;
      if (v.dob) q('child_dob').value = v.dob;
      var r = $('[name=medium][value=' + v.medium + ']', form); if (r) { r.checked = true; }
      if (CFG) { syncBranches(CFG); fillYears(year, CFG); }
      if (v.year) year.value = v.year;
      if (v.set && v.medium === 'english') board.value = v.set;
    });
    var pre = sessionStorageGet(); if (pre) whenConfig(function () { prefillEnquiry(form, pre); pre = null; });

    function err(name, msg) { var e = $('[data-err=' + name + ']', form); if (e) { e.textContent = msg; e.classList.toggle('show', !!msg); } return !msg; }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var phone = q('phone').value.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
      var ok = true;
      ok = err('parent_name', q('parent_name').value.trim() ? '' : T.badName) && ok;
      ok = err('phone', /^[6-9]\d{9}$/.test(phone) ? '' : T.badPhone) && ok;
      ok = err('child_name', q('child_name').value.trim() ? '' : T.badName) && ok;
      ok = err('child_dob', q('child_dob').value ? '' : T.needDob) && ok;
      ok = err('centre_id', branch.value ? '' : T.badBranch) && ok;
      ok = err('joining_year', year.value ? '' : T.badYear) && ok;
      var visitAt = wantVisit.checked ? vtime.value : '';
      ok = err('visit', wantVisit.checked && !visitAt && (centre(CFG || {}) || {}).visit_slots && centre(CFG).visit_slots.length ? T.chooseTime : '') && ok;
      if (!ok) { var first = $('.field-error.show', form); if (first) first.parentNode.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

      var md = medium();
      var setId = md === 'marathi' ? (setsFor(CFG, 'marathi')[0] || {}).id : (board.value === 'other' ? '' : board.value);
      var body = {
        parent_name: q('parent_name').value.trim(), phone: phone, child_name: q('child_name').value.trim(),
        child_dob: q('child_dob').value, centre_id: branch.value, age_rule_set_id: setId || undefined,
        joining_year: year.value, comments: q('comments').value.trim() + (board.value === 'other' && md === 'english' ? ' [Board: other / not sure]' : '') + (LANG === 'mr' ? ' [Marathi website]' : ''),
        visit_at: visitAt || undefined, website: q('website').value, started_at: openedAt
      };
      form.classList.add('sending'); submit.textContent = T.sending;
      out.className = 'result';
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (j) {
          form.classList.remove('sending'); syncVisitUi();
          out.innerHTML = '';
          if (j && j.ok) {
            out.className = 'result show good';
            out.appendChild(el('h3', null, j.new_enquiry === false ? T.okAgain : T.okTitle));
            if (j.suggested_class) out.appendChild(el('p', null, fill(T.okClass, { cls: nm(j.suggested_class) })));
            if (j.visit) out.appendChild(el('p', null, fill(T.okVisit, { when: fmtSlot(j.visit.at), branch: nm(j.visit.centre_name) })));
            else out.appendChild(el('p', null, fill(T.okCall, { phone: phone })));
            $all('input:not([type=radio]):not([type=checkbox]), textarea', form).forEach(function (i) { if (i.name !== 'website') i.value = ''; });
            wantVisit.checked = false; syncVisitUi();
            if (j.visit && CFG) {  // drop the booked slot from the list
              (CFG.centres || []).forEach(function (c) { c.visit_slots = (c.visit_slots || []).filter(function (s) { return s !== j.visit.at; }); });
              syncSlots(CFG);
            }
          } else {
            out.className = 'result show bad';
            out.appendChild(el('p', null, (j && j.error) || T.failed));
            if (j && j.code === 'slot_taken') fetch(API).then(function (r) { return r.json(); }).then(function (c) { if (c.ok) { CFG = c; syncSlots(CFG); } }).catch(function () { });
          }
          out.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          form.classList.remove('sending'); syncVisitUi();
          out.className = 'result show bad'; out.innerHTML = ''; out.appendChild(el('p', null, T.offline));
        });
    });
  });
})();
