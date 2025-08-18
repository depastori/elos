/* p8.core.js — Núcleo da timeline (dados, render básico, persistência)
   Seguro e idempotente. Pode ser incluído várias vezes sem efeitos colaterais. */
(function (w, d) {
  'use strict';

  const P8 = w.P8 = w.P8 || {};
  P8.parts = P8.parts || {};
  if (P8.parts.core) {
    try { (P8.log || console.log)('[P8] core: já carregado'); } catch (_) {}
    return;
  }
  P8.parts.core = '8.0-core';

  // Config
  P8.config = P8.config || {};
  P8.config.selectors = P8.config.selectors || { timeline: '#timeline, .timeline, [data-timeline]' };
  P8.config.attach = P8.config.attach || 'auto';
  P8.flags = P8.flags || {};
  P8.flags.autoLoadLocal = P8.flags.autoLoadLocal ?? true; // tenta carregar do localStorage na inicialização

  // Log seguro
  const LOG_PREFIX = '[P8 core]';
  const clog = (...a) => {
    try { (P8.log || console.log).apply(console, [LOG_PREFIX, ...a]); } catch (_) {}
  };
  const cwarn = (...a) => {
    try { (P8.warn || console.warn).apply(console, [LOG_PREFIX, ...a]); } catch (_) {}
  };
  const cerr = (...a) => {
    try { (P8.error || console.error).apply(console, [LOG_PREFIX, ...a]); } catch (_) {}
  };

  // Ready helper (se ainda não existir)
  if (!P8.ready) {
    let ready = false;
    const queue = [];
    P8.ready = function (fn) {
      if (ready) { try { fn(); } catch (e) { cerr('ready(fn) error:', e); } return; }
      queue.push(fn);
    };
    function flush() {
      if (ready) return;
      ready = true;
      while (queue.length) {
        const fn = queue.shift();
        try { fn(); } catch (e) { cerr('ready flush error:', e); }
      }
    }
    if (d.readyState === 'complete' || d.readyState === 'interactive') setTimeout(flush, 0);
    else d.addEventListener('DOMContentLoaded', flush, { once: true });
  }

  // Event bus (se ainda não existir)
  P8.events = P8.events || (function () {
    const map = new Map();
    function on(evt, fn) {
      if (!map.has(evt)) map.set(evt, new Set());
      map.get(evt).add(fn);
      return () => off(evt, fn);
    }
    function once(evt, fn) {
      const off = on(evt, (...args) => { off(); try { fn(...args); } catch (e) { cerr('once handler error', e); } });
    }
    function off(evt, fn) {
      if (!map.has(evt)) return;
      if (!fn) { map.delete(evt); return; }
      map.get(evt).delete(fn);
    }
    function emit(evt, payload) {
      if (!map.has(evt)) return;
      for (const fn of map.get(evt)) {
        try { fn(payload); } catch (e) { cerr('emit error for', evt, e); }
      }
    }
    return { on, once, off, emit };
  })();
  const Bus = P8.events;

  // Utils
  let __uid = 1;
  function uid(prefix = 'it') {
    return `${prefix}-${Date.now().toString(36)}-${(__uid++).toString(36)}`;
  }
  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
  function toMinutes(v) {
    if (v == null) return null;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (v instanceof Date) return v.getHours() * 60 + v.getMinutes();
    if (typeof v === 'string') {
      const s = v.trim();
      const m = s.match(/^(\d{1,2})(?::(\d{2}))?$/);
      if (m) {
        const h = parseInt(m[1], 10);
        const mm = m[2] ? parseInt(m[2], 10) : 0;
        return h * 60 + mm;
      }
      const n = Number(s);
      if (!Number.isNaN(n)) return n;
    }
    return 0;
  }
  function fromMinutes(min) {
    if (min == null) return '';
    const h = Math.floor(min / 60);
    const m = Math.floor(min % 60);
    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    return pad(h) + ':' + pad(m);
  }
  function escapeHTML(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function qs(sel, root = d) { return root.querySelector(sel); }
  function qsa(sel, root = d) { return Array.from(root.querySelectorAll(sel)); }
  function el(tag, cls, text) {
    const e = d.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Estado
  P8.state = P8.state || {};
  const state = Object.assign(P8.state, {
    items: Array.isArray(P8.state.items) ? P8.state.items : [],
    index: P8.state.index instanceof Map ? P8.state.index : new Map(),
    selectedId: P8.state.selectedId || null,
    changed: P8.state.changed || false
  });

  // Normalização de item
  function normalizeItem(raw) {
    const item = Object.assign({
      id: uid(),
      label: 'Evento',
      start: 0,   // minutos inteiros
      end: null,  // minutos inteiros ou null
      intensity: null, // número 0..10 opcional
      tags: [],
      color: null,
      notes: ''
    }, raw || {});
    item.start = toMinutes(item.start);
    item.end = item.end == null ? null : toMinutes(item.end);
    if (typeof item.tags === 'string') {
      item.tags = item.tags.split(',').map(s => s.trim()).filter(Boolean);
    }
    return item;
  }

  // Operações de dados
  function addItem(raw) {
    const item = normalizeItem(raw);
    if (state.index.has(item.id)) {
      // Update existente
      const ref = state.index.get(item.id);
      Object.assign(ref, item);
      state.changed = true;
      Bus.emit('item:update', ref);
      scheduleRender();
      return ref;
    }
    state.items.push(item);
    state.index.set(item.id, item);
    state.changed = true;
    Bus.emit('item:add', item);
    scheduleRender();
    return item;
  }

  function removeItem(id) {
    if (!id) return false;
    if (!state.index.has(id)) return false;
    const item = state.index.get(id);
    state.items = state.items.filter(x => x.id !== id);
    state.index.delete(id);
    if (state.selectedId === id) state.selectedId = null;
    state.changed = true;
    Bus.emit('item:remove', item);
    scheduleRender();
    return true;
  }

  function clear() {
    state.items = [];
    state.index.clear();
    state.selectedId = null;
    state.changed = true;
    Bus.emit('items:clear');
    scheduleRender();
  }

  function load(items) {
    const arr = Array.isArray(items) ? items : [];
    state.items = [];
    state.index.clear();
    for (const it of arr) {
      const item = normalizeItem(it);
      state.items.push(item);
      state.index.set(item.id, item);
    }
    sortByStart();
    state.changed = false;
    Bus.emit('items:load', { count: state.items.length });
    scheduleRender(true);
  }

  function sortByStart() {
    state.items.sort((a, b) => {
      const sa = a.start ?? 0;
      const sb = b.start ?? 0;
      if (sa !== sb) return sa - sb;
      return (a.label || '').localeCompare(b.label || '');
    });
  }

  // Persistência (localStorage)
  const STORAGE_KEY = P8.storageKey || 'P8:timeline';
  function saveLocal() {
    try {
      const data = JSON.stringify(state.items);
      w.localStorage.setItem(STORAGE_KEY, data);
      state.changed = false;
      Bus.emit('storage:save', { key: STORAGE_KEY, count: state.items.length });
      return true;
    } catch (e) {
      cwarn('saveLocal falhou:', e);
      return false;
    }
  }
  function loadLocal() {
    try {
      const raw = w.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      load(arr);
      Bus.emit('storage:load', { key: STORAGE_KEY, count: state.items.length });
      return state.items;
    } catch (e) {
      cwarn('loadLocal falhou:', e);
      return [];
    }
  }

  // Serialização
  function serialize() { return JSON.stringify(state.items, null, 2); }
  function deserialize(json) {
    try {
      const arr = JSON.parse(json);
      if (!Array.isArray(arr)) return false;
      load(arr);
      return true;
    } catch (e) {
      cwarn('deserialize falhou:', e);
      return false;
    }
  }

  // Seleção
  function setSelected(id) {
    if (id && !state.index.has(id)) return;
    const prev = state.selectedId;
    state.selectedId = id || null;
    if (prev !== state.selectedId) {
      Bus.emit('selection:change', { id: state.selectedId, prev });
      scheduleRender();
    }
  }
  function getSelected() {
    return state.selectedId ? state.index.get(state.selectedId) : null;
  }

  // Renderização
  const attached = new Set(); // elementos host já anexados
  function ensureScaffold(host) {
    // Reaproveita estruturas existentes se já estiverem presentes
    host.classList.add('p8-host');

    let body = host.querySelector(':scope > .p8-body');
    if (!body) {
      body = el('div', 'p8-body');
      host.appendChild(body);
    }
    let track = body.querySelector(':scope > .p8-track');
    if (!track) {
      track = el('div', 'p8-track');
      body.appendChild(track);
    }
    // Opcional: toolbar pode ter sido criada pelo p8.boot.js
    let toolbar = host.querySelector(':scope > .p8-toolbar');
    // Não cria toolbar aqui; extras pode complementar UI

    return { body, track, toolbar };
  }

  function renderHost(host) {
    const { track } = ensureScaffold(host);

    // Limpa track e reconstrói lista
    track.innerHTML = '';

    // Cabeçalho simples
    const header = el('div', 'p8-row p8-row--header');
    header.innerHTML = `
      <div class="p8-col p8-col--time">Início–Fim</div>
      <div class="p8-col p8-col--label">Evento</div>
      <div class="p8-col p8-col--intensity">Int.</div>
      <div class="p8-col p8-col--tags">Tags</div>
    `;
    track.appendChild(header);

    sortByStart();
    for (const item of state.items) {
      const row = el('div', 'p8-row p8-row--item');
      row.dataset.id = item.id;
      if (state.selectedId === item.id) row.classList.add('is-selected');

      const time = el('div', 'p8-col p8-col--time');
      const timeText = `${fromMinutes(item.start)}${item.end != null ? '–' + fromMinutes(item.end) : ''}`;
      time.textContent = timeText;

      const label = el('div', 'p8-col p8-col--label');
      label.innerHTML = `<span class="p8-dot" style="${item.color ? `background:${escapeHTML(item.color)};` : ''}"></span> ${escapeHTML(item.label)}`;

      const intensity = el('div', 'p8-col p8-col--intensity');
      intensity.textContent = item.intensity != null ? String(item.intensity) : '';

      const tags = el('div', 'p8-col p8-col--tags');
      tags.textContent = (item.tags || []).join(', ');

      row.appendChild(time);
      row.appendChild(label);
      row.appendChild(intensity);
      row.appendChild(tags);

      // Interações básicas
      row.addEventListener('click', (ev) => {
        ev.preventDefault();
        setSelected(item.id);
      });

      track.appendChild(row);

      // Notifica extras para decorarem a linha
      Bus.emit('render:item', { host, row, item });
    }

    Bus.emit('render:done', { host, count: state.items.length });
  }

  let rafId = 0;
  function scheduleRender(force) {
    if (force) {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => renderAll());
      return;
    }
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      renderAll();
    });
  }

  function renderAll() {
    for (const host of attached) {
      try { renderHost(host); } catch (e) { cerr('render host error', e); }
    }
  }

  function attach(target) {
    const hosts = [];
    if (!target) {
      // auto: por seletor
      const sel = P8.config.selectors && P8.config.selectors.timeline || '#timeline, .timeline, [data-timeline]';
      for (const node of qsa(sel, d)) hosts.push(node);
    } else if (typeof target === 'string') {
      for (const node of qsa(target, d)) hosts.push(node);
    } else if (target instanceof Element) {
      hosts.push(target);
    }

    for (const host of hosts) {
      if (attached.has(host)) continue;
      ensureScaffold(host);
      attached.add(host);
      host.dataset.p8Attached = '1';
      Bus.emit('attach', { host });
    }
    scheduleRender(true);
    return hosts;
  }

  function detach(target) {
    const toRemove = [];
    if (!target) attached.forEach(h => toRemove.push(h));
    else if (target instanceof Element) toRemove.push(target);
    else if (typeof target === 'string') qsa(target, d).forEach(h => toRemove.push(h));

    for (const host of toRemove) {
      attached.delete(host);
      host.removeAttribute('data-p8-attached');
      Bus.emit('detach', { host });
    }
    scheduleRender(true);
  }

  // API pública
  P8.core = P8.core || {};
  Object.assign(P8.core, {
    addItem, removeItem, clear, load,
    serialize, deserialize,
    saveLocal, loadLocal,
    setSelected, getSelected,
    attach, detach,
    utils: { uid, clamp, toMinutes, fromMinutes, escapeHTML },
    get state() { return state; }
  });

  // Auto attach/load
  P8.ready(() => {
    if (P8.config.attach === 'auto') {
      attach();
      if (P8.flags.autoLoadLocal) {
        try { loadLocal(); } catch (_) {}
      }
    }
  });

})(window, document);
