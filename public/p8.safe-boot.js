(function (w, d) {
  const ns = w.P8 = w.P8 || {};
  ns.version = ns.version || '8.0-safe';
  ns.parts = ns.parts || {};
  ns.flags = ns.flags || {};
  ns.config = ns.config || {
    selectors: { timeline: '#timeline, .timeline, [data-timeline]' },
    attach: 'auto'
  };

  const LOG_PREFIX = '[P8]';
  ns.log = ns.log || {
    info: (...a) => { try { console.info(LOG_PREFIX, ...a); } catch (e) {} },
    warn: (...a) => { try { console.warn(LOG_PREFIX, ...a); } catch (e) {} },
    error: (...a) => { try { console.error(LOG_PREFIX, ...a); } catch (e) {} },
    debug: (...a) => { if (ns.flags.debug) { try { console.debug(LOG_PREFIX, ...a); } catch (e) {} } }
  };

  ns.safe = ns.safe || function (label, fn) {
    try { return typeof fn === 'function' ? fn() : undefined; }
    catch (err) { ns.log.error(label + ' failed:', err); return undefined; }
  };

  if (!ns._readyQueue) ns._readyQueue = [];
  if (!ns.ready) {
    ns.ready = function (cb) {
      if (typeof cb !== 'function') return;
      if (d.readyState === 'complete' || d.readyState === 'interactive') {
        setTimeout(cb, 0);
      } else {
        ns._readyQueue.push(cb);
      }
    };
    d.addEventListener('DOMContentLoaded', function () {
      const q = ns._readyQueue.splice(0);
      q.forEach(cb => ns.safe('ready-callback', cb));
    });
  }

  ns.util = ns.util || {};
  ns.util.$ = ns.util.$ || function (sel, root) { try { return (root || d).querySelector(sel); } catch (e) { return null; } };
  ns.util.$$ = ns.util.$$ || function (sel, root) { try { return Array.from((root || d).querySelectorAll(sel)); } catch (e) { return []; } };
  ns.util.ce = ns.util.ce || function (tag, attrs, children) {
    const el = d.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'style' && v && typeof v === 'object') {
          Object.assign(el.style, v);
        } else if (k === 'class' || k === 'className') {
          el.className = v;
        } else if (k === 'dataset' && v && typeof v === 'object') {
          Object.assign(el.dataset, v);
        } else if (k in el) {
          try { el[k] = v; } catch (e) { el.setAttribute(k, v); }
        } else {
          el.setAttribute(k, v);
        }
      });
    }
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(c => {
        if (c == null) return;
        el.appendChild(typeof c === 'string' ? d.createTextNode(c) : c);
      });
    }
    return el;
  };

  ns.parts['safe-boot'] = true;
  ns.log.info('Loaded: safe-boot');
})(window, document);
