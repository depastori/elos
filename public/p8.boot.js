(function (w, d) {
  const P8 = w.P8 = w.P8 || {};
  // Fallbacks para util e log se safe-boot não estiver presente
  const util = P8.util || (P8.util = {
    $: function (sel, root) { try { return (root || d).querySelector(sel); } catch (e) { return null; } },
    $$: function (sel, root) { try { return Array.from((root || d).querySelectorAll(sel)); } catch (e) { return []; } },
    ce: function (tag, attrs, children) {
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
    }
  });
  const log = P8.log || (P8.log = {
    info: function () {},
    warn: function () {},
    error: function () {},
    debug: function () {}
  });

  P8.parts = P8.parts || {};
  P8.config = P8.config || {
    selectors: { timeline: '#timeline, .timeline, [data-timeline]' },
    attach: 'auto'
  };

  const IDS = {
    root: 'p8-root',
    toolbar: 'p8-toolbar',
    minimap: 'p8-minimap',
    track: 'p8-track'
  };

  function ensureRoot() {
    let root = d.getElementById(IDS.root);
    if (root) return root;
    root = util.ce('div', { id: IDS.root, class: 'p8-root' });
    d.body.appendChild(root);
    return root;
  }

  function ensureToolbar(root) {
    let bar = d.getElementById(IDS.toolbar);
    if (bar) return bar;
    bar = util.ce('div', {
      id: IDS.toolbar, class: 'p8-toolbar', role: 'toolbar', 'aria-label': 'P8 toolbar'
    }, [
      util.ce('button', { class: 'p8-btn', type: 'button', title: 'Zoom in', 'data-action': 'zoom-in' }, '+'),
      util.ce('button', { class: 'p8-btn', type: 'button', title: 'Zoom out', 'data-action': 'zoom-out' }, '\u2212'),
      util.ce('button', { class: 'p8-btn', type: 'button', title: 'Reset', 'data-action': 'reset' }, 'Reset'),
      util.ce('div', { class: 'p8-spacer' }),
      util.ce('button', { class: 'p8-btn', type: 'button', title: 'Ajuda', 'data-action': 'help' }, '?')
    ]);
    root.appendChild(bar);
    return bar;
  }

  function ensureMinimap(root) {
    let mini = d.getElementById(IDS.minimap);
    if (mini) return mini;
    mini = util.ce('div', {
      id: IDS.minimap, class: 'p8-minimap', role: 'region', 'aria-label': 'Mini mapa'
    }, [
      util.ce('div', { class: 'p8-minimap-viewport' })
    ]);
    root.appendChild(mini);
    return mini;
  }

  function ensureTrackContainer(root) {
    let track = d.getElementById(IDS.track);
    if (track) return track;

    // tenta usar o contêiner da página (#timeline, .timeline ou [data-timeline])
    let container = null;
    const sel = (P8.config && P8.config.selectors && P8.config.selectors.timeline)
      ? P8.config.selectors.timeline
      : '#timeline, .timeline, [data-timeline]';
    try {
      container = d.querySelector(sel);
    } catch (e) {
      container = null;
    }

    if (!container) {
      // cria um novo se não existir
      container = util.ce('div', { id: IDS.track, class: 'p8-track', 'data-timeline': 'auto' });
      root.appendChild(container);
      return container;
    } else {
      // aproveita o existente
      if (!container.id) container.id = IDS.track; // não sobrescreve se já houver ID
      container.classList.add('p8-track');
      return container;
    }
  }

  function wireBasics(root, bar, mini, track) {
    const actions = {
      'zoom-in': () => log.info('zoom-in (n\u00facleo ainda n\u00e3o instalado)'),
      'zoom-out': () => log.info('zoom-out (n\u00facleo ainda n\u00e3o instalado)'),
      'reset': () => log.info('reset (n\u00facleo ainda n\u00e3o instalado)'),
      'help': () => alert('Pacote 8 carregado (modo b\u00e1sico). Instale p8.core.js para recursos avan\u00e7ados.')
    };
    bar.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const a = btn.getAttribute('data-action');
      if (a && actions[a]) actions[a]();
    });

    // viewport do minimapa (estado inicial)
    const vp = mini.querySelector('.p8-minimap-viewport');
    if (vp) {
      vp.style.left = '0%';
      vp.style.width = '25%';
    }
  }

  function mount() {
    const root = ensureRoot();
    const bar = ensureToolbar(root);
    const mini = ensureMinimap(root);
    const track = ensureTrackContainer(root);
    wireBasics(root, bar, mini, track);
    P8.parts['boot'] = true;
    log.info('Loaded: boot', { root, bar, mini, track });
  }

  if (P8.ready) {
    P8.ready(mount);
  } else if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})(window, document);
