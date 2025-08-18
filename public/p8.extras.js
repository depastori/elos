/* p8.extras.js — Recursos adicionais: exportações, atalhos, UI opcional
   Seguro e idempotente. Pode ser incluído várias vezes sem efeitos colaterais. */
(function (w, d) {
  'use strict';

  const P8 = w.P8 = w.P8 || {};
  P8.parts = P8.parts || {};
  if (P8.parts.extras) {
    try { (P8.log || console.log)('[P8] extras: já carregado'); } catch (_) {}
    return;
  }
  P8.parts.extras = '8.0-extras';

  const LOG_PREFIX = '[P8 extras]';
  const clog = (...a) => { try { (P8.log || console.log).apply(console, [LOG_PREFIX, ...a]); } catch (_) {} };
  const cwarn = (...a) => { try { (P8.warn || console.warn).apply(console, [LOG_PREFIX, ...a]); } catch (_) {} };
  const cerr = (...a) => { try { (P8.error || console.error).apply(console, [LOG_PREFIX, ...a]); } catch (_) {} };

  const Bus = P8.events || {
    on: () => () => {},
    once: () => {},
    off: () => {},
    emit: () => {}
  };
  P8.flags = P8.flags || {};
  // Atalhos padrão podem ser desativados
  P8.flags.bindDefaultShortcuts = P8.flags.bindDefaultShortcuts ?? true;
  // Edição inline protegida por flag
  P8.flags.allowInlineEdit = P8.flags.allowInlineEdit ?? false;

  // Helpers
  function download(filename, content, mime = 'text/plain;charset=utf-8') {
    try {
      const blob = new Blob([content], { type: mime });
      const a = d.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      d.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 0);
      return true;
    } catch (e) {
      cwarn('download falhou:', e);
      return false;
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    // Fallback
    const ta = d.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    d.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = d.execCommand && d.execCommand('copy');
    ta.remove();
    return ok;
  }

  // Exportações
  P8.export = P8.export || {};

  function itemsOrState(items) {
    const st = P8.core && P8.core.state ? P8.core.state : { items: [] };
    return Array.isArray(items) ? items : st.items || [];
  }

  function csvEscape(val, delimiter) {
    if (val == null) return '';
    const s = String(val);
    const mustQuote = s.includes(delimiter) || s.includes('"') || s.includes('\n');
    const escaped = s.replace(/"/g, '""');
    return mustQuote ? `"${escaped}"` : escaped;
  }

  function exportCSV(items, delimiter = ',') {
    const arr = itemsOrState(items);
    const header = ['id', 'label', 'start', 'end', 'intensity', 'tags', 'color', 'notes'];
    const lines = [header.join(delimiter)];
    for (const it of arr) {
      const row = [
        csvEscape(it.id, delimiter),
        csvEscape(it.label, delimiter),
        csvEscape(P8.core.utils.fromMinutes ? P8.core.utils.fromMinutes(it.start) : it.start, delimiter),
        csvEscape(it.end != null ? (P8.core.utils.fromMinutes ? P8.core.utils.fromMinutes(it.end) : it.end) : '', delimiter),
        csvEscape(it.intensity != null ? it.intensity : '', delimiter),
        csvEscape(Array.isArray(it.tags) ? it.tags.join(';') : (it.tags || ''), delimiter),
        csvEscape(it.color || '', delimiter),
        csvEscape(it.notes || '', delimiter)
      ];
      lines.push(row.join(delimiter));
    }
    return lines.join('\n');
  }

  function exportHTML(items, inlineStyle = true) {
    const arr = itemsOrState(items);
    const css = `
      <style>
        .p8-export-table { border-collapse: collapse; width: 100%; font-family: system-ui, Arial, sans-serif; }
        .p8-export-table th, .p8-export-table td { border: 1px solid #ddd; padding: 8px; }
        .p8-export-table th { background: #f5f5f5; text-align: left; }
        .p8-chip { display: inline-block; padding: 2px 6px; margin-right: 4px; background: #eef; border-radius: 10px; font-size: 12px; }
        .p8-dot { display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px; vertical-align:middle; }
      </style>`;
    const head = `
      <meta charset="utf-8">
      <title>MVP Emoções — Exportação</title>
      ${inlineStyle ? css : ''}
    `;
    const rows = [];
    rows.push('<tr><th>ID</th><th>Início–Fim</th><th>Evento</th><th>Int.</th><th>Tags</th><th>Notas</th></tr>');
    for (const it of arr) {
      const start = P8.core.utils.fromMinutes ? P8.core.utils.fromMinutes(it.start) : it.start;
      const end = it.end != null ? (P8.core.utils.fromMinutes ? P8.core.utils.fromMinutes(it.end) : it.end) : '';
      const tags = Array.isArray(it.tags) ? it.tags : (it.tags ? String(it.tags).split(',') : []);
      const chips = tags.filter(Boolean).map(t => `<span class="p8-chip">${P8.core.utils.escapeHTML ? P8.core.utils.escapeHTML(t) : t}</span>`).join(' ');
      const dot = it.color ? `<span class="p8-dot" style="background:${P8.core.utils.escapeHTML ? P8.core.utils.escapeHTML(it.color) : it.color}"></span>` : '';
      rows.push(`<tr>
        <td>${P8.core.utils.escapeHTML ? P8.core.utils.escapeHTML(it.id) : it.id}</td>
        <td>${start}${end ? '–' + end : ''}</td>
        <td>${dot}${P8.core.utils.escapeHTML ? P8.core.utils.escapeHTML(it.label) : it.label}</td>
        <td>${it.intensity != null ? it.intensity : ''}</td>
        <td>${chips}</td>
        <td>${P8.core.utils.escapeHTML ? P8.core.utils.escapeHTML(it.notes || '') : (it.notes || '')}</td>
      </tr>`);
    }
    const html = `<!doctype html>
<html lang="pt-BR">
<head>${head}</head>
<body>
  <h1>MVP Emoções — Exportação</h1>
  <table class="p8-export-table">
    <tbody>
      ${rows.join('\n')}
    </tbody>
  </table>
</body>
</html>`;
    return html;
  }

  function parseCSV(text, delimiter = ',') {
    // Parser simples com suporte a aspas
    const rows = [];
    let i = 0, field = '', row = [], inQuotes = false;
    function endField() { row.push(field); field = ''; }
    function endRow() { rows.push(row); row = []; }
    while (i < text.length) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        } else { field += ch; i++; continue; }
      } else {
        if (ch === '"') { inQuotes = true; i++; continue; }
        if (ch === delimiter) { endField(); i++; continue; }
        if (ch === '\n') { endField(); endRow(); i++; continue; }
        if (ch === '\r') { i++; continue; } // ignora CR
        field += ch; i++; continue;
      }
    }
    endField();
    if (row.length) endRow();
    return rows;
  }

  function importCSV(text, delimiter = ',') {
    const rows = parseCSV(text, delimiter);
    if (!rows.length) return [];
    const header = rows[0].map(h => h.trim().toLowerCase());
    const mapIdx = Object.create(null);
    const known = ['id', 'label', 'start', 'end', 'intensity', 'tags', 'color', 'notes'];
    for (const k of known) mapIdx[k] = header.indexOf(k);
    const out = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r.length) continue;
      const obj = {};
      for (const k of known) {
        const idx = mapIdx[k];
        if (idx >= 0) obj[k] = r[idx];
      }
      // Normalização de campos
      if (obj.tags && typeof obj.tags === 'string') {
        obj.tags = obj.tags.split(/;|,/).map(s => s.trim()).filter(Boolean);
      }
      if (P8.core && P8.core.utils && P8.core.utils.toMinutes) {
        if (obj.start != null) obj.start = P8.core.utils.toMinutes(obj.start);
        if (obj.end != null && obj.end !== '') obj.end = P8.core.utils.toMinutes(obj.end);
      }
      out.push(obj);
    }
    return out;
  }

  // Ligações na UI (toolbar) — não invasivo
  function ensureToolbar(host) {
    // Se já houver toolbar (criada pelo boot), usamos ela.
    let tb = host.querySelector(':scope > .p8-toolbar');
    if (tb) return tb;

    // Se não existir, criamos uma toolbar minimalista
    tb = d.createElement('div');
    tb.className = 'p8-toolbar';
    host.insertBefore(tb, host.firstChild);
    return tb;
  }

  function makeButton(text, title, onClick) {
    const b = d.createElement('button');
    b.type = 'button';
    b.className = 'p8-btn';
    b.textContent = text;
    if (title) b.title = title;
    b.addEventListener('click', (ev) => { ev.preventDefault(); try { onClick(ev); } catch (e) { cerr('button error', e); } });
    return b;
  }

  function wireToolbar(host) {
    try {
      const tb = ensureToolbar(host);
      // Evita duplicação: checa marcador
      if (tb.dataset.extrasWired === '1') return;
      tb.dataset.extrasWired = '1';

      const group = d.createElement('div');
      group.className = 'p8-btn-group';

      const btnSave = makeButton('Salvar', 'Salvar no navegador (localStorage)', () => {
        if (!P8.core || !P8.core.saveLocal) return;
        P8.core.saveLocal();
        toast(host, 'Salvo localmente ✅');
      });

      const btnCSV = makeButton('Exportar CSV', 'Baixar .csv dos eventos', () => {
        const csv = exportCSV();
        const ok = download('timeline.csv', csv, 'text/csv;charset=utf-8');
        if (!ok) toast(host, 'Falha ao baixar CSV');
      });

      const btnHTML = makeButton('Exportar HTML', 'Baixar relatório HTML', () => {
        const html = exportHTML();
        const ok = download('timeline.html', html, 'text/html;charset=utf-8');
        if (!ok) toast(host, 'Falha ao baixar HTML');
      });

      const btnClear = makeButton('Limpar', 'Remover todos os eventos', () => {
        if (!P8.core || !P8.core.clear) return;
        const go = confirm('Tem certeza que deseja remover todos os eventos?');
        if (!go) return;
        P8.core.clear();
        toast(host, 'Lista limpa 🧹');
      });

      group.appendChild(btnSave);
      group.appendChild(btnCSV);
      group.appendChild(btnHTML);
      group.appendChild(btnClear);
      tb.appendChild(group);
    } catch (e) {
      cwarn('wireToolbar falhou:', e);
    }
  }

  // Toast simples
  function toast(host, message, timeout = 1500) {
    let box = host.querySelector(':scope > .p8-toast');
    if (!box) {
      box = d.createElement('div');
      box.className = 'p8-toast';
      host.appendChild(box);
    }
    box.textContent = message;
    box.classList.add('is-visible');
    setTimeout(() => box.classList.remove('is-visible'), timeout);
  }

  // Decorações por item: tooltip e edição opcional
  function decorateRow({ host, row, item }) {
    row.title = [
      item.label,
      item.intensity != null ? `Intensidade: ${item.intensity}` : '',
      item.tags && item.tags.length ? `Tags: ${item.tags.join(', ')}` : '',
      item.notes ? `Notas: ${item.notes}` : ''
    ].filter(Boolean).join('\n');

    if (P8.flags.allowInlineEdit) {
      row.addEventListener('dblclick', (ev) => {
        ev.preventDefault();
        // Edição muito simples via prompt
        const newLabel = prompt('Editar rótulo do evento:', item.label);
        if (newLabel != null) {
          item.label = newLabel;
          if (P8.core && P8.core.utils) {
            P8.core.coreDirty = true;
          }
          P8.events.emit('item:update', item);
          // Re-render
          if (P8.core && P8.core.attach) {
            // Apenas agenda renderização
            const st = P8.core.state;
            if (st) st.changed = true;
            if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => {
              // Força render de todos os hosts
              P8.events.emit('render:request');
            });
          }
        }
      });
    }
  }

  // Atalhos de teclado
  let shortcutsBound = false;
  function bindShortcuts() {
    if (shortcutsBound || !P8.flags.bindDefaultShortcuts) return;
    shortcutsBound = true;

    d.addEventListener('keydown', (ev) => {
      const ctrl = ev.ctrlKey || ev.metaKey;
      const shift = ev.shiftKey;

      // Ctrl+S — salvar
      if (ctrl && !shift && ev.key.toLowerCase() === 's') {
        ev.preventDefault();
        if (P8.core && P8.core.saveLocal) {
          P8.core.saveLocal();
          const host = pickFirstHost();
          if (host) toast(host, 'Salvo (Ctrl+S)');
        }
      }

      // Ctrl+E — exportar CSV
      if (ctrl && !shift && ev.key.toLowerCase() === 'e') {
        ev.preventDefault();
        const csv = exportCSV();
        download('timeline.csv', csv, 'text/csv;charset=utf-8');
      }

      // Ctrl+Shift+H — exportar HTML
      if (ctrl && shift && ev.key.toLowerCase() === 'h') {
        ev.preventDefault();
        const html = exportHTML();
        download('timeline.html', html, 'text/html;charset=utf-8');
      }

      // Delete — remover selecionado
      if (!ctrl && !shift && (ev.key === 'Delete' || ev.key === 'Backspace')) {
        const st = P8.core && P8.core.state;
        if (st && st.selectedId) {
          ev.preventDefault();
          const id = st.selectedId;
          P8.core.removeItem(id);
          const host = pickFirstHost();
          if (host) toast(host, 'Evento removido');
        }
      }
    });
  }

  function pickFirstHost() {
    // Tenta encontrar o primeiro host com .p8-host
    return d.querySelector('.p8-host') || d.querySelector('[data-p8-attached="1"]') || null;
  }

  // API pública de extras
  Object.assign(P8.export, {
    csv: exportCSV,
    html: exportHTML,
    downloadCSV: (filename = 'timeline.csv') => {
      const csv = exportCSV();
      return download(filename, csv, 'text/csv;charset=utf-8');
    },
    downloadHTML: (filename = 'timeline.html') => {
      const html = exportHTML();
      return download(filename, html, 'text/html;charset=utf-8');
    },
    importCSV,
    copyCSVToClipboard: async () => {
      const csv = exportCSV();
      const ok = await copyToClipboard(csv);
      return ok;
    }
  });

  // Integrações com o core
  P8.ready(() => {
    // Wire toolbar para todos os hosts anexados
    const hosts = Array.from(d.querySelectorAll('.p8-host, [data-p8-attached="1"]'));
    for (const host of hosts) wireToolbar(host);

    // Ao anexar novos hosts (quando attach é chamado depois)
    Bus.on('attach', ({ host }) => {
      wireToolbar(host);
    });

    // Decoração de linhas quando renderizadas
    Bus.on('render:item', decorateRow);

    // Atalhos
    bindShortcuts();

    // Render refresh a pedido
    Bus.on('render:request', () => {
      try {
        // Se o core expôs attach/renderAll indiretamente, forçamos um repaint
        // Estratégia: re-selecionar hosts e disparar render via pequena mudança de estado
        const st = P8.core && P8.core.state;
        if (st) {
          const prev = st.changed;
          st.changed = !prev;
          // Se o core tiver schedule, apenas emitir um evento que ele já escuta
        }
      } catch (_) {}
    });

    clog('extras prontos');
  });

})(window, document);
