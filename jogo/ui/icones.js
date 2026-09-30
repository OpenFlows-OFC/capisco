/* =========================================================
   CAPISCO · Ícones próprios (nada de emoji)
   Grade 24×24, traço 2,2 com pontas redondas, cor herdada (currentColor).
   Mesma linguagem da marca: formas redondas, gordinhas, sem detalhe fino.
   ========================================================= */
(function () {
  const C = (window.CAPISCO = window.CAPISCO || {});
  const F = 'fill="currentColor"';
  const D = 'fill="currentColor" fill-opacity=".22" stroke="none"'; // tom suave: o duotom da marca
  const P = {
    // navegação
    trilha: `<circle cx="6.5" cy="6" r="2.6" ${F}/><circle cx="17.5" cy="18" r="2.6" ${F}/><path d="M9 7.2c5.5 1.3 7.2 3.4 3 5.6s-3 4.6 3.1 5.2"/>`,
    revisar: `<path d="M19.5 9.5A8 8 0 0 0 5.4 7.6"/><path d="M4.5 14.5a8 8 0 0 0 14.1 1.9"/><path d="M5.2 3.6v4.2h4.2"/><path d="M18.8 20.4v-4.2h-4.2"/>`,
    capi: `<rect x="4" y="6.2" width="16" height="14.3" rx="6.5" ${D}/><path d="M5 8.4a2.1 2.1 0 1 1 3-2.6"/><path d="M19 8.4a2.1 2.1 0 1 0-3-2.6"/><rect x="4" y="6.2" width="16" height="14.3" rx="6.5"/><path d="M8.6 16.3c0-1.7 1.5-2.6 3.4-2.6s3.4.9 3.4 2.6-1.5 2.3-3.4 2.3-3.4-.6-3.4-2.3z"/><circle cx="9" cy="11" r="1.1" ${F} stroke="none"/><circle cx="15" cy="11" r="1.1" ${F} stroke="none"/>`,
    mais: `<rect x="4" y="4" width="6.5" height="6.5" rx="2.2" ${F}/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2.2" ${F}/>`,
    fechar: `<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>`,
    voltar: `<path d="M14.5 5.5L8 12l6.5 6.5"/>`,
    seta: `<path d="M9.5 5.5L16 12l-6.5 6.5"/>`,
    baixo: `<path d="M6.5 9.5L12 15l5.5-5.5"/>`,
    // contadores e metas
    calendario: `<rect x="3.5" y="5" width="17" height="15.5" rx="4" ${D}/><path d="M7.5 5h9a4 4 0 0 1 4 4v1h-17V9a4 4 0 0 1 4-4z" ${F}/><rect x="3.5" y="5" width="17" height="15.5" rx="4"/><path d="M3.5 10h17M8 3v3.5M16 3v3.5"/><path d="M9 15.2l2 2 4-4"/>`,
    alvo: `<circle cx="12" cy="12" r="8.5" ${D}/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.3" ${F}/>`,
    relogio: `<circle cx="12" cy="12" r="8.5" ${D}/><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2.2"/>`,
    // estados dos tópicos
    estrela: `<path d="M12 3.9l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8z" ${F}/>`,
    brilho: `<path d="M12 3c.8 5.2 3.8 8.2 9 9-5.2.8-8.2 3.8-9 9-.8-5.2-3.8-8.2-9-9 5.2-.8 8.2-3.8 9-9z" ${F}/>`,
    pratica: `<path d="M19 12a7 7 0 1 1-2.2-5.1"/><path d="M17.6 3.4v4h-4"/>`,
    excl: `<path d="M12 5v8.5"/><circle cx="12" cy="18.3" r="1.5" ${F} stroke="none"/>`,
    cadeado: `<path d="M8 10.5V8.2a4 4 0 0 1 8 0v2.3"/><rect x="5" y="10.5" width="14" height="10" rx="3.2" ${F}/>`,
    aberto: `<path d="M8 10.5V8.2a4 4 0 0 1 7.6-1.7"/><rect x="5" y="10.5" width="14" height="10" rx="3.2" ${F}/>`,
    trofeu: `<path d="M7.5 4h9v5.4a4.5 4.5 0 0 1-9 0z" ${F}/><path d="M7.5 6H5.2a2.6 2.6 0 0 0 2.8 4.1M16.5 6h2.3a2.6 2.6 0 0 1-2.8 4.1"/><path d="M12 14.2v3.3"/><rect x="8" y="17.5" width="8" height="3.2" rx="1.6" ${F}/>`,
    // resultados
    check: `<path d="M5 12.5l4.5 4.5L19 7.5"/>`,
    meia: `<circle cx="12" cy="12" r="7.5"/><path d="M12 4.5a7.5 7.5 0 0 1 0 15z" ${F}/>`,
    traco: `<path d="M6.5 12h11"/>`,
    pausa: `<path d="M9 6.5v11M15 6.5v11"/>`,
    caixa: `<path d="M4 8l8-4 8 4-8 4z" ${F}/><path d="M4 8l8 4v8.2l-8-4z" ${D}/><path d="M4 8l8-4 8 4v8.2l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8.2"/>`,
    // menus
    livros: `<rect x="3.5" y="4" width="4.6" height="16.5" rx="1.6" ${F}/><rect x="9.8" y="4" width="4.6" height="16.5" rx="1.6"/><path d="M16.1 6.2l3.6-.9 3.2 13.8-3.6.9z"/>`,
    grupo: `<circle cx="9" cy="8.5" r="3.2" ${F}/><path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="16.8" cy="9.3" r="2.6"/><path d="M16 14.6c2.6-.3 4.4 1.3 5 4.5"/>`,
    balanca: `<path d="M12 4v16M7.5 20h9M5 7.5h14"/><path d="M5 7.5l-2.6 6.2a3.2 3.2 0 0 0 5.2 0z" ${D}/><path d="M19 7.5l-2.6 6.2a3.2 3.2 0 0 0 5.2 0z" ${D}/><path d="M5 7.5l-2.6 6.2a3.2 3.2 0 0 0 5.2 0z"/><path d="M19 7.5l-2.6 6.2a3.2 3.2 0 0 0 5.2 0z"/>`,
    ajustes: `<path d="M4 7h8.5M17.5 7H20M4 17h2.5M11.5 17H20"/><circle cx="15" cy="7" r="2.5"/><circle cx="9" cy="17" r="2.5"/>`,
    paleta: `<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.4-2.1-.7-1.3.1-2.6 1.6-2.6h1.6a3.9 3.9 0 0 0 3.9-3.9C20.5 7.3 16.7 3.5 12 3.5z" ${D}/><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 1.4-2.1-.7-1.3.1-2.6 1.6-2.6h1.6a3.9 3.9 0 0 0 3.9-3.9C20.5 7.3 16.7 3.5 12 3.5z"/><circle cx="7.6" cy="11.2" r="1.2" ${F} stroke="none"/><circle cx="9.8" cy="7.4" r="1.2" ${F} stroke="none"/><circle cx="14.4" cy="7.4" r="1.2" ${F} stroke="none"/>`,
    baixar: `<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>`,
    // boas-vindas
    formatura: `<path d="M2.5 9.5L12 5l9.5 4.5L12 14z" ${F}/><path d="M6.5 11.6v4.2c1.5 1.6 3.5 2.4 5.5 2.4s4-.8 5.5-2.4v-4.2"/><path d="M21.5 9.5v5"/>`,
    folha: `<path d="M6 3.5h8l4 4v13H6z" ${D}/><path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>`,
    broto: `<path d="M12 20.5v-7.5"/><path d="M12 13c0-3.5 2.5-5.5 6-5.5 0 3.5-2.5 5.5-6 5.5z" ${F}/>`,
    planta: `<path d="M12 20.5v-9.5"/><path d="M12 11c0-3.3 2.4-5.5 6-5.5 0 3.5-2.4 5.5-6 5.5z" ${F}/><path d="M12 15.2c0-2.6-2-4.5-5-4.5 0 2.8 2 4.5 5 4.5z" ${F}/>`,
    arvore: `<path d="M12 21v-5"/><path d="M12 16c-4.4 0-7-2.3-7-5.5 0-2.5 1.7-4.2 3.8-4.6C9.6 4.2 10.7 3 12 3s2.4 1.2 3.2 2.9c2.1.4 3.8 2.1 3.8 4.6 0 3.2-2.6 5.5-7 5.5z" ${D}/><path d="M12 16c-4.4 0-7-2.3-7-5.5 0-2.5 1.7-4.2 3.8-4.6C9.6 4.2 10.7 3 12 3s2.4 1.2 3.2 2.9c2.1.4 3.8 2.1 3.8 4.6 0 3.2-2.6 5.5-7 5.5z"/>`,
    lapis: `<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z" ${D}/><path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>`,
    // matérias
    dna: `<circle cx="12" cy="7.6" r="0" /><path d="M7 3c0 4.5 10 4.5 10 9s-10 4.5-10 9"/><path d="M17 3c0 4.5-10 4.5-10 9s10 4.5 10 9"/><path d="M8.4 4.8h7.2M7.2 12h9.6M8.4 19.2h7.2"/>`,
    frasco: `<path d="M9.5 3.5h5"/><path d="M10.5 3.5V9l-5.2 8.6A2 2 0 0 0 7 20.5h10a2 2 0 0 0 1.7-2.9L13.5 9V3.5"/><path d="M7.4 15.2h9.2l1.3 2.4a2 2 0 0 1-1.7 2.9H7.8a2 2 0 0 1-1.7-2.9z" ${F}/>`,
    atomo: `<ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)"/><circle cx="12" cy="12" r="1.6" ${F} stroke="none"/>`,
    esquadro: `<path d="M4 20V4.5L19.5 20z" ${D}/><path d="M4 20V4.5L19.5 20z"/><path d="M8 16v-3.4l3.4 3.4z"/><path d="M4 8.5h2.2M4 12.5h2.2"/>`,
    coluna: `<path d="M3.5 9L12 4l8.5 5z" ${F}/><path d="M4.5 20.5h15M6.5 9.5v8M10.2 9.5v8M13.8 9.5v8M17.5 9.5v8M5 17.5h14"/>`,
    globo: `<circle cx="12" cy="12" r="8.5" ${D}/><circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="3.8" ry="8.5"/><path d="M3.5 12h17"/>`,
    livro: `<path d="M12 7c-2-1.6-4.8-2.2-8-2v12.5c3.2-.2 6 .4 8 2 2-1.6 4.8-2.2 8-2V5c-3.2-.2-6 .4-8 2z" ${D}/><path d="M12 7c-2-1.6-4.8-2.2-8-2v12.5c3.2-.2 6 .4 8 2 2-1.6 4.8-2.2 8-2V5c-3.2-.2-6 .4-8 2z"/><path d="M12 7v12.5"/>`,
  };
  const MAT = { bio: 'dna', qui: 'frasco', fis: 'atomo', mat: 'esquadro', his: 'coluna', geo: 'globo', por: 'livro', red: 'lapis' };
  const ESTADO = { vencido: 'excl', agendado: 'relogio', consolidado: 'estrela', novo: 'brilho', pratica: 'pratica', bloqueado: 'cadeado' };
  const ic = (n, s = 24, peso = 2.2) => `<svg class="ic-svg" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${peso}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;
  C.icones = { P, MAT, ESTADO, ic, icMat: (m, s, peso) => ic(MAT[m] || 'livros', s, peso), icEstado: (e, s, peso) => ic(ESTADO[e] || 'brilho', s, peso) };
})();
