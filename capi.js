/* =========================================================
   CAPISCO · Capi v2 (2D com volume)
   capi({expr, roupa, size})
   expr : neutra | feliz | pensando | quase | comemora | dormindo
   roupa: nenhuma | bio | qui | fis | mat | his | geo | por | red
   ========================================================= */
let __capiId=0;
function capi(opts={},legacySize){
  if(typeof opts==='string')opts={expr:opts,size:legacySize};
  const {expr='neutra',roupa='nenhuma',size=160}=opts;
  const id='c'+(++__capiId);
  const INK='#2a1a0e';

  /* ---------- olhos ---------- */
  const eyeOpen=(cx,cy,look=0)=>`
    <ellipse cx="${cx}" cy="${cy}" rx="17" ry="20" fill="#fff"/>
    <ellipse cx="${cx+look}" cy="${cy+3}" rx="11" ry="13" fill="${INK}"/>
    <circle cx="${cx+look+4}" cy="${cy-3}" r="4.5" fill="#fff"/>
    <circle cx="${cx+look-4}" cy="${cy+8}" r="2" fill="#fff" opacity=".8"/>`;
  const eyes={
    neutra:eyeOpen(92,92)+eyeOpen(148,92),
    feliz:`<path d="M76 96q16-20 32 0M132 96q16-20 32 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    pensando:eyeOpen(92,92,5)+eyeOpen(148,92,5)+`<path d="M76 64l30 6M134 70l30-6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    quase:eyeOpen(92,92)+eyeOpen(148,92)+`<path d="M78 66l28 2M134 68l28-6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
    comemora:`<path d="M74 98q18-26 36 0M130 98q18-26 36 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    dormindo:`<path d="M78 94q14 10 28 0M134 94q14 10 28 0" stroke="${INK}" stroke-width="6" fill="none" stroke-linecap="round"/>`
  }[expr];
  const mouth={
    neutra:`<path d="M110 142q10 7 20 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    feliz:`<path d="M104 138q16 18 32 0z" fill="${INK}"/><path d="M112 146q8 5 16 0" fill="#ff8f86"/>`,
    pensando:`<path d="M112 144q6-3 16 1" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    quase:`<path d="M108 144q6-5 12 0t12 0" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    comemora:`<path d="M100 136q20 26 40 0z" fill="${INK}"/><path d="M110 148q10 7 20 0" fill="#ff8f86"/>`,
    dormindo:`<ellipse cx="120" cy="144" rx="5" ry="4" fill="${INK}"/>`
  }[expr];
  const fx={
    pensando:`<g fill="#b9b2a8"><circle cx="204" cy="60" r="5"/><circle cx="216" cy="42" r="8"/><circle cx="226" cy="18" r="12"/></g>`,
    comemora:`<g stroke-linecap="round" stroke-width="6"><path d="M28 70l-16-12" stroke="#ffc62e"/><path d="M22 100H4" stroke="#ff8f0a"/><path d="M212 70l16-12" stroke="#ffc62e"/><path d="M218 100h18" stroke="#0fa292"/></g>`,
    dormindo:`<g font-family="Baloo 2,Nunito,sans-serif" font-weight="800" fill="#3fa9f5"><text x="186" y="56" font-size="30">z</text><text x="208" y="32" font-size="20">z</text></g>`
  }[expr]||'';
  const armsUp=expr==='comemora';

  /* ---------- roupas: [atrás do corpo, sobre o corpo, sobre a cabeça, na mão] ---------- */
  const R={
    nenhuma:['','','',''],
    bio:['',
      `<path d="M52 170q0-26 20-38h96q20 12 20 38v58H52z" fill="url(#${id}coat)"/>
       <path d="M96 132l24 44 24-44" fill="none" stroke="#d7dde0" stroke-width="4"/>
       <path d="M96 132l-10 30 18-6zM144 132l10 30-18-6z" fill="#eef2f4"/>
       <rect x="140" y="180" width="26" height="20" rx="4" fill="#e6ebee"/><rect x="146" y="172" width="4" height="16" rx="2" fill="#3fa9f5"/>`,
      `<path d="M120 42q-4-22 10-34q10 16-10 34z" fill="#58b847"/><path d="M120 42q-14-12-28-8q8 14 28 8z" fill="#7ccf5a"/><rect x="118" y="36" width="4" height="14" rx="2" fill="#3f8f2f"/>`,
      ''],
    qui:['','',
      `<rect x="68" y="52" width="104" height="14" rx="7" fill="#2b2825"/>
       <circle cx="92" cy="58" r="17" fill="#8fd3ff" stroke="#2b2825" stroke-width="5" opacity=".95"/><circle cx="148" cy="58" r="17" fill="#8fd3ff" stroke="#2b2825" stroke-width="5" opacity=".95"/>
       <path d="M84 52l8-4M140 52l8-4" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
      `<g transform="translate(176 164)"><path d="M6 0h20v14l12 28q2 8-6 8H0q-8 0-6-8L6 14z" fill="#e8f7ff" stroke="#9fb8c6" stroke-width="3"/><path d="M-3 34h38l3 8q2 8-6 8H0q-8 0-6-8z" fill="#58d17a"/><circle cx="14" cy="-8" r="4" fill="#58d17a" opacity=".7"/><circle cx="22" cy="-18" r="3" fill="#58d17a" opacity=".5"/></g>`],
    fis:['','',
      `<g transform="translate(120 34)" fill="none" stroke="#8b6cff" stroke-width="4"><ellipse rx="34" ry="11"/><ellipse rx="34" ry="11" transform="rotate(60)"/><ellipse rx="34" ry="11" transform="rotate(-60)"/></g><circle cx="120" cy="34" r="7" fill="#ffc62e"/>`,
      `<g transform="translate(180 168)"><circle cx="16" cy="16" r="18" fill="#ff5b4f"/><circle cx="10" cy="10" r="5" fill="#fff" opacity=".4"/><path d="M16 -2q2-10 10-12" stroke="#7a4d22" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M18 -6q10-8 16 0q-8 6-16 0z" fill="#58b847"/></g>`],
    mat:['','',
      `<g fill="none" stroke="#2b2825" stroke-width="5"><rect x="72" y="74" width="40" height="36" rx="8"/><rect x="128" y="74" width="40" height="36" rx="8"/><path d="M112 88h16"/></g>
       <path d="M160 40l34-14 6 12-34 14z" fill="#ffc62e"/><path d="M194 26l12-2-6 14z" fill="#f4d4b0"/><path d="M160 40l-6-2 6 14" fill="#ff7a6b"/>`,
      `<g transform="translate(174 170)"><rect width="40" height="50" rx="8" fill="#ff7a6b"/><rect x="6" y="6" width="28" height="12" rx="3" fill="#e6fff9"/><g fill="#fff"><rect x="6" y="24" width="8" height="7" rx="2"/><rect x="16" y="24" width="8" height="7" rx="2"/><rect x="26" y="24" width="8" height="7" rx="2"/><rect x="6" y="35" width="8" height="7" rx="2"/><rect x="16" y="35" width="8" height="7" rx="2"/><rect x="26" y="35" width="8" height="7" rx="2"/></g><text x="10" y="16" font-family="JetBrains Mono,monospace" font-size="10" font-weight="700" fill="#08685e">π</text></g>`],
    his:['',
      `<path d="M58 176q62 30 124 0l6 22q-68 32-136 0z" fill="#b8343a"/><circle cx="178" cy="184" r="9" fill="#ffc62e" stroke="#d99a00" stroke-width="3"/>`,
      `<g fill="#58b847">${[...Array(7)].map((_,i)=>{const a=-160+i*23,r=66;const x=120+r*Math.cos(a*Math.PI/180),y=78+r*.55*Math.sin(a*Math.PI/180);return `<ellipse cx="${x}" cy="${y}" rx="10" ry="5" transform="rotate(${a+90} ${x} ${y})"/>`}).join('')}</g>`,
      `<g transform="translate(176 160)"><rect width="36" height="48" rx="3" fill="#f3e2bf"/><path d="M0 4q18-10 36 0M0 44q18 10 36 0" stroke="#c9a66b" stroke-width="5" fill="none"/><path d="M8 16h20M8 24h16M8 32h20" stroke="#9c6634" stroke-width="2.5"/></g>`],
    geo:['','',
      `<path d="M52 66q68-24 136 0l-8 10q-60-18-120 0z" fill="#c9a66b"/><path d="M76 64q4-40 44-40t44 40q-44-14-88 0z" fill="#dcbf85"/><path d="M78 60q42-12 84 0" stroke="#8a5d2c" stroke-width="7" fill="none"/>`,
      `<g transform="translate(178 162)"><circle cx="20" cy="20" r="22" fill="#3fa9f5"/><path d="M6 10q8 4 10 12t-6 12M24 2q6 8 16 8M22 30q8-4 14 4" fill="#58b847" stroke="#58b847" stroke-width="4" stroke-linejoin="round"/><circle cx="12" cy="12" r="5" fill="#fff" opacity=".35"/><path d="M20 42v10M8 54h24" stroke="#8a857d" stroke-width="5" stroke-linecap="round"/></g>`],
    por:['','',
      `<path d="M66 64q10-30 56-30t52 26q4 10-8 12H74q-12-2-8-8z" fill="#e05c9a"/><circle cx="124" cy="30" r="6" fill="#e05c9a"/><path d="M76 70h92" stroke="#b83e78" stroke-width="5"/>`,
      `<g transform="translate(170 166)"><path d="M0 4q20-8 22 0v44q-2-8-22 0z" fill="#fff" stroke="#c9a66b" stroke-width="2.5"/><path d="M44 4q-20-8-22 0v44q2-8 22 0z" fill="#fff" stroke="#c9a66b" stroke-width="2.5"/><path d="M-2 6v44h48V6" fill="none" stroke="#0fa292" stroke-width="5" stroke-linejoin="round"/></g>`],
    red:['',
      `<path d="M62 150q58 26 116 0v18q-58 26-116 0z" fill="#ffc62e"/><path d="M150 164l10 44h14l-6-46z" fill="#ffc62e"/><path d="M152 176h18M154 190h18" stroke="#d99a00" stroke-width="3"/>`,
      `<g transform="rotate(-30 178 58)"><rect x="150" y="54" width="54" height="10" rx="5" fill="#2b2825"/><path d="M204 54l14 5-14 5z" fill="#ffc62e"/><rect x="156" y="54" width="6" height="10" fill="#ffc62e"/></g>`,
      `<g transform="translate(174 164)"><rect width="40" height="50" rx="4" fill="#fff" stroke="#e2dfda" stroke-width="3"/><path d="M8 14h24M8 22h24M8 30h18M8 38h22" stroke="#3fa9f5" stroke-width="2.5"/><path d="M4 0v50" stroke="#ff7a6b" stroke-width="2"/></g>`]
  }[roupa];

  return `<svg viewBox="0 0 240 250" width="${size}" height="${size*250/240}" role="img" aria-label="Capi ${expr}${roupa!=='nenhuma'?' · '+roupa:''}">
  <defs>
    <radialGradient id="${id}fur" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#e4ab6c"/><stop offset=".55" stop-color="#c98a4b"/><stop offset="1" stop-color="#9c6634"/></radialGradient>
    <radialGradient id="${id}head" cx=".4" cy=".28" r=".85"><stop offset="0" stop-color="#e9b475"/><stop offset=".6" stop-color="#cc8d4d"/><stop offset="1" stop-color="#a06a36"/></radialGradient>
    <radialGradient id="${id}snout" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#a87444"/><stop offset="1" stop-color="#6e4422"/></radialGradient>
    <radialGradient id="${id}belly" cx=".5" cy=".35" r=".7"><stop offset="0" stop-color="#f7dcb6"/><stop offset="1" stop-color="#e3b27c"/></radialGradient>
    <linearGradient id="${id}coat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe6ea"/></linearGradient>
  </defs>
  <ellipse cx="120" cy="238" rx="84" ry="10" fill="#000" opacity=".12"/>
  ${R[0]}
  <!-- corpo sentado -->
  <path d="M40 186q0-66 80-66t80 66q0 50-80 50t-80-50z" fill="url(#${id}fur)"/>
  <ellipse cx="120" cy="196" rx="44" ry="36" fill="url(#${id}belly)"/>
  ${R[1]}
  <!-- braços -->
  ${armsUp
    ?`<path d="M58 170q-26-24-22-56" stroke="#a06a36" stroke-width="20" fill="none" stroke-linecap="round"/><path d="M182 170q26-24 22-56" stroke="#a06a36" stroke-width="20" fill="none" stroke-linecap="round"/>`
    :`<ellipse cx="78" cy="206" rx="15" ry="22" fill="#b17a42" transform="rotate(18 78 206)"/><ellipse cx="162" cy="206" rx="15" ry="22" fill="#b17a42" transform="rotate(-18 162 206)"/>`}
  <!-- pés -->
  <ellipse cx="90" cy="234" rx="22" ry="10" fill="#8a5a2c"/><ellipse cx="150" cy="234" rx="22" ry="10" fill="#8a5a2c"/>
  <!-- orelhas -->
  <ellipse cx="64" cy="54" rx="15" ry="12" fill="#8a5a2c"/><ellipse cx="64" cy="55" rx="8" ry="6" fill="#5e3a1a"/>
  <ellipse cx="176" cy="54" rx="15" ry="12" fill="#8a5a2c"/><ellipse cx="176" cy="55" rx="8" ry="6" fill="#5e3a1a"/>
  <!-- cabeça (capivara: larga e quadrada) -->
  <path d="M46 104q0-62 74-62t74 62q0 58-74 58t-74-58z" fill="url(#${id}head)"/>
  <path d="M60 80q10-28 60-30" stroke="#f3c890" stroke-width="6" fill="none" stroke-linecap="round" opacity=".6"/>
  <!-- focinho grande -->
  <path d="M76 128q0-24 44-24t44 24q0 30-44 30t-44-30z" fill="url(#${id}snout)"/>
  <ellipse cx="104" cy="120" rx="6" ry="4.5" fill="${INK}"/><ellipse cx="136" cy="120" rx="6" ry="4.5" fill="${INK}"/>
  <ellipse cx="112" cy="110" rx="10" ry="4" fill="#fff" opacity=".18"/>
  ${eyes}
  <ellipse cx="70" cy="118" rx="11" ry="6" fill="#ff8f86" opacity=".5"/><ellipse cx="170" cy="118" rx="11" ry="6" fill="#ff8f86" opacity=".5"/>
  ${mouth}
  ${R[2]}
  ${R[3]}
  ${fx}
  </svg>`;
}

/* Ícone do app: rosto da Capi num quadrado arredondado */
function capiIcon(size=96,bg='#0fa292'){
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Capisco">
  <defs><radialGradient id="ic${size}${bg.slice(1)}" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#e9b475"/><stop offset=".6" stop-color="#cc8d4d"/><stop offset="1" stop-color="#a06a36"/></radialGradient></defs>
  <rect width="120" height="120" rx="30" fill="${bg}"/><path d="M0 100h120v-10q0 30-30 30H30Q0 120 0 90z" fill="#000" opacity=".12"/>
  <ellipse cx="28" cy="34" rx="11" ry="9" fill="#8a5a2c"/><ellipse cx="92" cy="34" rx="11" ry="9" fill="#8a5a2c"/>
  <path d="M14 72q0-44 46-44t46 44q0 40-46 40t-46-40z" fill="url(#ic${size}${bg.slice(1)})"/>
  <path d="M34 88q0-16 26-16t26 16q0 20-26 20t-26-20z" fill="#7a4d26"/>
  <ellipse cx="51" cy="84" rx="4" ry="3" fill="#2a1a0e"/><ellipse cx="69" cy="84" rx="4" ry="3" fill="#2a1a0e"/>
  <ellipse cx="42" cy="60" rx="10" ry="12" fill="#fff"/><ellipse cx="78" cy="60" rx="10" ry="12" fill="#fff"/>
  <ellipse cx="43" cy="62" rx="6.5" ry="8" fill="#2a1a0e"/><ellipse cx="79" cy="62" rx="6.5" ry="8" fill="#2a1a0e"/>
  <circle cx="45" cy="58" r="2.8" fill="#fff"/><circle cx="81" cy="58" r="2.8" fill="#fff"/></svg>`;
}

/* =========================================================
   Capi 3D (renders do Blender em capi3d/, gerados por capi3d/src/capi_build.py)
   capi3d({expr, roupa, size, cls})  → <img> com fundo transparente
   ========================================================= */
var CAPI3D_BASE=window.CAPI3D_BASE||'capi3d/', CAPI3D_EXT=window.CAPI3D_EXT||'.png';
function capi3dSrc(expr='neutra',roupa='nenhuma'){return `${CAPI3D_BASE}capi_${roupa}_${expr}${CAPI3D_EXT}`}
function capi3d(opts={},legacySize){
  if(typeof opts==='string')opts={expr:opts,size:legacySize};
  const {expr='neutra',roupa='nenhuma',size=160,cls=''}=opts;
  return `<img class="capi3d ${cls}" src="${capi3dSrc(expr,roupa)}" width="${size}" height="${size}" loading="lazy" decoding="async" alt="Capi ${expr}${roupa!=='nenhuma'?' · '+roupa:''}" style="object-fit:contain">`;
}

/* =========================================================
   Marca v2
   capiscoIcon(size, bg)     → ícone do app (Capi flat num squircle)
   capiscoLogo({size, variant:'brand'|'inverse'|'ink', icon:true})
   ========================================================= */
let __brandId=0;
function capiscoIcon(size=96,bg='#0fa292'){
  const id='bi'+(++__brandId);
  const dark=bg==='#0fa292'?'#0b8577':bg;
  return `<svg class="ic" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Capisco">
  <defs>
    <clipPath id="${id}c"><rect width="100" height="100" rx="26"/></clipPath>
    <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
    <linearGradient id="${id}fur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dba265"/><stop offset="1" stop-color="#c0823f"/></linearGradient>
  </defs>
  <g clip-path="url(#${id}c)">
    <rect width="100" height="100" fill="url(#${id}bg)"/>
    <circle cx="86" cy="14" r="26" fill="#fff" opacity=".07"/>
    <!-- orelhas -->
    <ellipse cx="19" cy="41" rx="9" ry="8" fill="#8a5a2c"/><ellipse cx="19" cy="42" rx="4.5" ry="4" fill="#5e3a1a"/>
    <ellipse cx="81" cy="41" rx="9" ry="8" fill="#8a5a2c"/><ellipse cx="81" cy="42" rx="4.5" ry="4" fill="#5e3a1a"/>
    <!-- cabeça larga e quadrada -->
    <path d="M8 70q0-34 42-34t42 34v40H8z" fill="url(#${id}fur)"/>
    <path d="M20 52q8-10 30-11" stroke="#f0c48c" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <!-- olhos -->
    <ellipse cx="35" cy="60" rx="10.5" ry="12" fill="#fff"/><ellipse cx="65" cy="60" rx="10.5" ry="12" fill="#fff"/>
    <ellipse cx="36" cy="62" rx="6.8" ry="8" fill="#2a1a0e"/><ellipse cx="66" cy="62" rx="6.8" ry="8" fill="#2a1a0e"/>
    <circle cx="38.5" cy="58.5" r="2.8" fill="#fff"/><circle cx="68.5" cy="58.5" r="2.8" fill="#fff"/>
    <ellipse cx="21" cy="75" rx="6" ry="3.6" fill="#ff8f86" opacity=".55"/><ellipse cx="79" cy="75" rx="6" ry="3.6" fill="#ff8f86" opacity=".55"/>
    <!-- focinho -->
    <path d="M28 88q0-15 22-15t22 15q0 14-22 14t-22-14z" fill="#8f5c33"/>
    <ellipse cx="42" cy="84" rx="3.6" ry="2.7" fill="#2a1a0e"/><ellipse cx="58" cy="84" rx="3.6" ry="2.7" fill="#2a1a0e"/>
    <path d="M44 93q6 4 12 0" stroke="#2a1a0e" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </g></svg>`;
}
function capiscoWordmark(size=64,wm='limpa'){
  const W=(typeof CAPISCO_WM!=="undefined")&&CAPISCO_WM[wm];
  if(!W)return `<span class="wm2">capisco</span>`;
  const [x,y,w,h]=W.viewBox.split(" ").map(Number);
  const mid='wmk'+(++__brandId);
  const mask=W.cut?`<mask id="${mid}" maskUnits="userSpaceOnUse" x="-50" y="-150" width="600" height="300"><rect x="-50" y="-150" width="600" height="300" fill="#fff"/><path d="${W.cut}" fill="none" stroke="#000" stroke-width="${W.cw}" stroke-dasharray="${W.dash}" stroke-linecap="round"/></mask>`:'';
  return `<svg class="wm3" viewBox="${W.viewBox}" height="${size*h/100}" width="${size*w/100}" role="img" aria-label="capisco">${mask}<path ${W.cut?`mask="url(#${mid})" `:''}fill="currentColor" fill-rule="evenodd" d="${W.d}"/>${W.trail?`<path fill="none" stroke="currentColor" stroke-width="${W.tw}" stroke-linecap="round" d="${W.trail}"/>`:""}</svg>`;
}
function capiscoLogo({size=64,variant='brand',icon=true,iconBg,wm='limpa'}={}){
  const cls=variant==='brand'?'':variant;
  return `<span class="cp-brand ${cls}" style="font-size:${size}px">${icon?capiscoIcon(size*1.3,iconBg||(variant==='inverse'?'#0b8577':'#0fa292')):''}${capiscoWordmark(size,wm)}</span>`;
}
