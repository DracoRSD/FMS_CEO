// FMS CEO · simulación de temporadas con el motor real del juego.
// Uso: npm run simular [-- --temporadas 1000 --semilla 1 --formato short|long]
// Carga index.html en jsdom y sustituye Math.random SOLO dentro de esa ventana por un
// generador con semilla, para que la misma semilla dé siempre el mismo resultado.
// El código del juego no se toca.
const fs = require('fs'), path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const args = process.argv.slice(2);
const arg = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 && args[i + 1] != null ? args[i + 1] : def; };
const TEMPORADAS = parseInt(arg('temporadas', '1000'), 10);
const SEMILLA = parseInt(arg('semilla', '1'), 10);
const FORMATO = arg('formato', 'short') === 'long' ? 'long' : 'short';
const LIMITE_FAVORITO = 70;   // % máximo de victorias del favorito en liga (criterio de aceptación)
// Eliminatorias y Under: referencia medida con el motor anterior (simulateBattle, solo nivel), semilla 5, 1.000 cuadros.
// El motor nuevo debe quedar a ±TOLERANCIA_KO puntos en el % del favorito por cruce.
const REF_KO = { favorito: 72.6, sembrado: 39.4 }, REF_UNDER = { favorito: 71.2, sembrado: 35.4 }, TOLERANCIA_KO = 3;
const CUADROS = parseInt(arg('cuadros', '1000'), 10);
const PROGRESION = parseInt(arg('progresion', '20'), 10);   // temporadas de evolución del pool (informe de progresión y relevo)
// Criterios de aceptación del relevo generacional tras PROGRESION temporadas (evolución + retiros + nuevos talentos)
const TOP30_TOL = 3, TOP100_TOL = 4;   // el nivel medio del top 30 y del top 100 queda a ±esto del inicio
const POOL_TOL = 10;                   // el pool de activos no varía más de ±esto (%)
const FAV_MIN = 66, FAV_MAX = 72;      // % del favorito en liga con el pool de T10 y T20
// Batallas por temporada fuera de las ligas, para estimar el crecimiento del guardado: 9 Red Bull nacionales + Plazas + Red Bull
// Internacional + FMS Internacional (16 cada uno) + 4 Under de 16 + 5 de Monster Fu
const KO_POR_TEMPORADA = 9 * 16 + 16 + 16 + 16 + 4 * 16 + 5;
const RANGOS = [['menos de 75', 0, 74], ['75 a 79', 75, 79], ['80 a 84', 80, 84], ['85 a 89', 85, 89], ['90 o más', 90, 999]];
const GAPS = [['0 a 2', 0, 2], ['3 a 5', 3, 5], ['6 a 9', 6, 9], ['10 a 14', 10, 14], ['15 o más', 15, 999]];

// mulberry32: generador pequeño y reproducible
function mulberry32(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rango = (tabla, v) => tabla.find(([, a, b]) => v >= a && v <= b)[0];
const pct = (a, b) => b ? (100 * a / b).toFixed(1).replace('.', ',') + ' %' : '—';

const vc = new VirtualConsole();
const errores = [];
vc.on('jsdomError', e => errores.push(String((e.detail && e.detail.stack) || e.message)));
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dom = new JSDOM(html, {
  url: 'file:///' + ROOT.replace(/\\/g, '/') + '/index.html',
  runScripts: 'dangerously', resources: 'usable', pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(win) {
    win.Math.random = mulberry32(SEMILLA);            // solo dentro de la ventana simulada
    const mem = new Map();
    Object.defineProperty(win, 'localStorage', { value: { getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: k => mem.delete(k) } });
    win.scrollTo = () => {};
  },
});
const w = dom.window;

w.addEventListener('load', () => setTimeout(() => {
  if (errores.length) { console.error('El juego dio errores al cargar:\n' + errores.join('\n')); process.exit(2); }
  const g = n => w.eval(n);
  const pool = g('generatePool()');
  g('state').freestylers = pool;

  // Prueba previa: la evolución de fin de temporada (misma fórmula que endSeason) aplicada 10 veces seguidas
  // debe dejar la media de atributos igual al nivel en todos, también tras guardar y recargar la partida.
  {
    const poolTest = g('generatePool()');   // pool aparte: la prueba no debe alterar el de la simulación
    g('state').freestylers = poolTest;
    const setNivel = g('setNivel'), rnd = g('rnd'), clamp = g('clamp'), nf = g('nivelFromAttrs'), KEYS = g('ATTR_KEYS');
    const desajustados = () => g('state').freestylers.filter(f => !f.attrs || nf(f.attrs) !== f.nivel || KEYS.some(k => f.attrs[k] < 1 || f.attrs[k] > g('ATTR_MAX'))).length;
    const forma0 = Object.fromEntries(poolTest.map(f => [f.id, KEYS.map(k => f.attrs[k] - f.attrs.punchline)]));
    for (let i = 0; i < 10; i++) poolTest.forEach(f => setNivel(f, clamp(f.nivel + rnd(-3, 4), 35, 97)));
    const malEvol = desajustados();
    const cambiaForma = poolTest.filter(f => KEYS.some(k => Math.abs(f.attrs[k] - f.attrs.punchline - forma0[f.id][KEYS.indexOf(k)]) > 2 && f.attrs[k] < g('ATTR_MAX') - 3)).length;
    g('state').company = { name: 'simulación', stars: 0, reputation: 0, money: 0, dbv: g('state').company ? g('state').company.dbv : 5 };
    g('state').seasons = [];
    g('save')();
    const niveles = Object.fromEntries(poolTest.map(f => [f.name, f.nivel]));
    g('state').freestylers = []; g('state').company = null;
    const cargada = g('load')();
    const malCarga = desajustados();
    const nivelCambia = g('state').freestylers.filter(f => niveles[f.name] != null && niveles[f.name] !== f.nivel).length;
    const ok = cargada && malEvol === 0 && malCarga === 0 && nivelCambia === 0 && cambiaForma === 0;
    console.log((ok ? 'OK   ' : 'FAIL ') + 'evolución ×10: media de atributos = nivel en todos (desajustados ' + malEvol + '), forma conservada (cambios ' + cambiaForma + '), tras guardar y recargar (desajustados ' + malCarga + ', niveles cambiados ' + nivelCambia + ')');
    if (!ok) { w.close(); process.exit(1); }
    g('state').freestylers = pool;   // la simulación de temporadas usa el pool original
  }
  g('state').seasons = [{ format: FORMATO }];
  w.eval('WS_SHORT=false');
  const LEAGUES = g('LEAGUES'), sim = g('simulateFMSBattle'), pickJudges = g('pickJudges'), standings = g('computeStandings'), fby = g('fby');

  // Plantilla de cada liga: los 10 mejores de sus países (fija en toda la simulación)
  const plantillas = LEAGUES.map(L => ({ L, ids: pool.filter(f => L.countries.includes(f.country)).sort((a, b) => b.nivel - a.nivel).slice(0, 10).map(f => f.id) }));

  const titulos = {}, plazas = {}; RANGOS.forEach(([n]) => { titulos[n] = 0; plazas[n] = 0; });
  plantillas.forEach(p => p.ids.forEach(id => plazas[rango(RANGOS, fby(id).nivel)]++));
  const fav = {}; GAPS.forEach(([n]) => fav[n] = [0, 0]);
  let favTot = 0, favN = 0, replicas = 0, batallas = 0;
  const campeones = {};

  const t0 = Date.now();
  for (let t = 0; t < TEMPORADAS; t++) {
    for (const { L, ids } of plantillas) {
      const judges = pickJudges(L.key);
      const matches = [];
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
        const m = { a: ids[i], b: ids[j], result: null };
        sim(m, 0, judges);
        matches.push(m); batallas++; if (m.result.tiebreak) replicas++;
        const A = fby(m.a), B = fby(m.b), gap = Math.abs(A.nivel - B.nivel);
        if (gap > 0) { const favId = A.nivel > B.nivel ? A.id : B.id; const k = rango(GAPS, gap); fav[k][1]++; favN++; if (m.result.winner === favId) { fav[k][0]++; favTot++; } }
      }
      const tabla = standings({ competitors: ids, rounds: [matches] });
      const camp = fby(tabla[0].id);
      titulos[rango(RANGOS, camp.nivel)]++;
      campeones[camp.name] = (campeones[camp.name] || 0) + 1;
    }
  }
  const seg = ((Date.now() - t0) / 1000).toFixed(1);

  // ---- eliminatorias y Under con el mismo motor (runKnockout) ----
  const runKO = g('runKnockout'), shuffle = g('shuffle'), RB_NATS = g('RB_NATS'), UNDER_DEFS = g('UNDER_DEFS');
  function medirCuadros(pools) {
    let f = 0, fN = 0, semb = 0, cuadros = 0, rep = 0, bat = 0, bytesCon = 0, bytesSin = 0;
    for (let i = 0; i < CUADROS; i++) {
      const p = pools[i % pools.length]; const ids = shuffle(p.slice()).slice(0, 16).map(x => x.id);
      const r = runKO(ids, null, 1); const all = r.bracket.rounds.flat().concat([r.bracket.third]);
      for (const m of all) { bat++; if (m.result.tiebreak) rep++; const A = fby(m.a), B = fby(m.b); if (A.nivel !== B.nivel) { fN++; if (m.result.winner === (A.nivel > B.nivel ? A.id : B.id)) f++; } }
      const best = Math.max(...ids.map(id => fby(id).nivel)); cuadros++; if (fby(r.champion).nivel === best) semb++;
      bytesCon += JSON.stringify(all).length; bytesSin += JSON.stringify(all.map(m => ({ a: m.a, b: m.b, result: m.result, views: m.views }))).length;
    }
    return { favorito: 100 * f / fN, sembrado: 100 * semb / cuadros, replicas: 100 * rep / bat, porBatalla: (bytesCon - bytesSin) / bat, cuadros };
  }
  const poolsKO = RB_NATS.map(d => pool.filter(x => d.countries.includes(x.country)).sort((a, b) => b.nivel - a.nivel).slice(0, 32)).filter(p => p.length >= 16);
  const poolsUnder = UNDER_DEFS.map(d => pool.filter(x => x.fama <= d.famaMax && (!d.countries || d.countries.includes(x.country)))).filter(p => p.length >= 16);
  const ko = medirCuadros(poolsKO), under = medirCuadros(poolsUnder);

  // ---- progresión y relevo: 20 temporadas de evolución, retiros y nuevos talentos sobre una copia del pool, con ligas simuladas de verdad ----
  const evolve = g('evolveFreestylers'), retirar = g('retirarFreestylers'), novatos = g('generarNovatos'), etapaOf = g('etapaOf'), nf = g('nivelFromAttrs'), KEYS = g('ATTR_KEYS');
  const poolEv = JSON.parse(JSON.stringify(pool)); g('state').freestylers = poolEv;   // los novatos se añaden a este mismo array
  const fbyEv = id => poolEv.find(x => x.id === id), activosEv = () => poolEv.filter(x => !x.retirado);
  const foto = () => { const act = activosEv(); const lv = act.map(x => x.nivel).sort((a, b) => b - a); const avg = a => a.reduce((x, y) => x + y, 0) / a.length; const et = {}; act.forEach(x => { const e = etapaOf(x); et[e] = (et[e] || 0) + 1; });
    const brecha = avg(LEAGUES.map(L => { const t = act.filter(x => L.countries.includes(x.country)).sort((a, b) => b.nivel - a.nivel); return t.length >= 10 ? t[0].nivel - t[9].nivel : 0; }));   // 1º − 10º de cada liga
    return { top30: avg(lv.slice(0, 30)), top100: avg(lv.slice(0, 100)), todos: avg(lv), max: lv[0], n90: lv.filter(x => x >= 90).length, et, activos: act.length, brecha, ret: 0, nov: 0 }; };
  const fotos = { 0: foto() }; let desajustes = 0; const favPool = {}; let retTramo = 0, novTramo = 0, retTotal = 0, novTotal = 0, retMax = 0, novTope = 0;
  const NOVATO_MAX = g('NOVATO_MAX');
  function favoritoConPool() {   // % del favorito en liga con el pool tal como está ahora (top 10 por liga, 100 temporadas)
    let f = 0, n = 0; const pl = LEAGUES.map(L => activosEv().filter(x => L.countries.includes(x.country)).sort((a, b) => b.nivel - a.nivel).slice(0, 10).map(x => x.id));
    for (let t = 0; t < 100; t++) for (const ids of pl) { const jj = pickJudges('fms_espana'); for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const m = { a: ids[i], b: ids[j], result: null }; sim(m, 0, jj); const A = fbyEv(m.a), B = fbyEv(m.b); if (A.nivel !== B.nivel) { n++; if (m.result.winner === (A.nivel > B.nivel ? A.id : B.id)) f++; } } }
    return 100 * f / n; }
  favPool[0] = favoritoConPool();   // referencia: la misma medida con el pool inicial
  for (let t = 1; t <= PROGRESION; t++) {
    const sEv = { year: 2026 + t, activeKeys: LEAGUES.map(L => L.key), leagues: {}, intl: { champion: null, qualifiers: [] }, rb: { off: true }, under: [] };
    for (const L of LEAGUES) { const ids = activosEv().filter(x => L.countries.includes(x.country)).sort((a, b) => b.nivel - a.nivel).slice(0, 10).map(x => x.id); const jj = pickJudges(L.key); const ms = [];
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const m = { a: ids[i], b: ids[j], result: null }; sim(m, 0, jj); ms.push(m); }
      sEv.leagues[L.key] = { competitors: ids, finalStandings: standings({ competitors: ids, rounds: [ms] }).map(r => r.id) }; }
    sEv.intl.champion = sEv.leagues.fms_espana.finalStandings[0];
    evolve(sEv);
    const ret = retirar(sEv), nov = novatos(sEv, ret);
    retTramo += ret.length; novTramo += nov.length; retTotal += ret.length; novTotal += nov.length; retMax = Math.max(retMax, ret.length); if (ret.length > NOVATO_MAX) novTope++;
    poolEv.forEach(x => { if (nf(x.attrs) !== x.nivel || KEYS.some(k => x.attrs[k] < 1 || x.attrs[k] > g('ATTR_MAX'))) desajustes++; });
    if (t % 5 === 0 || t === 1) { fotos[t] = foto(); fotos[t].ret = retTramo; fotos[t].nov = novTramo; retTramo = novTramo = 0; }
    if (t % 5 === 0) favPool[t] = favoritoConPool();   // criterio en T10 y T20; T5 y T15 informativos
  }
  g('state').freestylers = pool;

  const totalTitulos = TEMPORADAS * plantillas.length, totalPlazas = plantillas.length * 10;
  console.log(`FMS CEO · simulación de ${TEMPORADAS} temporadas · ${plantillas.length} ligas · formato ${FORMATO === 'long' ? 'largo' : 'corto'} · semilla ${SEMILLA} · ${batallas} batallas en ${seg} s\n`);
  console.log('Títulos por rango de nivel del campeón');
  console.log('Rango de nivel   Títulos   % títulos   % de plazas en las ligas');
  for (const [n] of RANGOS) console.log(`${n.padEnd(16)} ${String(titulos[n]).padStart(7)}   ${pct(titulos[n], totalTitulos).padStart(9)}   ${pct(plazas[n], totalPlazas).padStart(9)}`);
  console.log('\nCampeones más frecuentes');
  Object.entries(campeones).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([n, c]) => console.log(`  ${n.padEnd(18)} ${String(c).padStart(5)}  (nivel ${pool.find(f => f.name === n).nivel})`));
  console.log('\nVictorias del favorito (el de mayor nivel; empates de nivel excluidos)');
  console.log('Diferencia       Gana el favorito   Batallas');
  for (const [n] of GAPS) console.log(`${n.padEnd(16)} ${pct(fav[n][0], fav[n][1]).padStart(16)}   ${String(fav[n][1]).padStart(8)}`);
  const total = 100 * favTot / favN;
  console.log(`${'TOTAL'.padEnd(16)} ${pct(favTot, favN).padStart(16)}   ${String(favN).padStart(8)}`);
  console.log(`Réplicas: ${pct(replicas, batallas)} de las batallas`);
  const ok = total <= LIMITE_FAVORITO;
  console.log(`\n${ok ? 'CUMPLE' : 'NO CUMPLE'}: el favorito gana ${total.toFixed(1).replace('.', ',')} % (límite ${LIMITE_FAVORITO} %)`);

  const f1 = x => x.toFixed(1).replace('.', ',');
  const linea = (nombre, r, ref) => { const d = r.favorito - ref.favorito; const okd = Math.abs(d) <= TOLERANCIA_KO;
    console.log(`${nombre.padEnd(14)} favorito por cruce ${f1(r.favorito)} % (antes ${f1(ref.favorito)} %, ${d >= 0 ? '+' : ''}${f1(d)}) · mejor sembrado campeón ${f1(r.sembrado)} % (antes ${f1(ref.sembrado)} %) · réplicas ${f1(r.replicas)} % · ${r.cuadros} cuadros`);
    return okd; };
  console.log(`\nEliminatorias y Under con el motor de las ligas (formato corto, semilla ${SEMILLA}; 'antes' = motor anterior solo con nivel)`);
  const okKO = linea('Eliminatorias', ko, REF_KO), okUnder = linea('Under', under, REF_UNDER);
  console.log(`${okKO && okUnder ? 'CUMPLE' : 'NO CUMPLE'}: diferencia con el motor anterior dentro de ±${TOLERANCIA_KO} puntos`);

  // ---- crecimiento del guardado: cada batalla de cuadro o Under lleva ahora las notas (d) y la etiqueta (lb) ----
  const kb = x => (x / 1024).toFixed(1).replace('.', ',') + ' KB';
  const extra10 = ko.porBatalla * KO_POR_TEMPORADA * 10;
  console.log(`\nGuardado: cada batalla de cuadro o Under ocupa ${Math.round(ko.porBatalla)} bytes más que antes; con ${KO_POR_TEMPORADA} por temporada son ${kb(ko.porBatalla * KO_POR_TEMPORADA)} por temporada y ${kb(extra10)} tras 10 temporadas (las batallas de liga ya llevaban notas).`);
  const f1b = x => x.toFixed(1).replace('.', ',');
  console.log(`\nProgresión y relevo: ${PROGRESION} temporadas de evolución, retiros y nuevos talentos sobre el pool (activos)`);
  console.log('Temporada   Top 30   Top 100   Todos   Máx   ≥90   Brecha 1º-10º   Jóvenes / Madurez / Veteranos   Activos   Retirados / Novatos en el tramo');
  Object.entries(fotos).forEach(([t, f]) => console.log(`${('T' + t).padEnd(11)} ${f1b(f.top30).padStart(6)}   ${f1b(f.top100).padStart(7)}   ${f1b(f.todos).padStart(5)}   ${String(f.max).padStart(3)}   ${String(f.n90).padStart(3)}   ${f1b(f.brecha).padStart(13)}   ${String(f.et.joven || 0).padStart(7)} / ${String(f.et.madurez || 0).padStart(7)} / ${String(f.et.veterano || 0).padStart(9)}   ${String(f.activos).padStart(7)}   ${t === '0' ? '—' : f.ret + ' / ' + f.nov}`));
  const dTop30 = fotos[PROGRESION].top30 - fotos[0].top30, dTop100 = fotos[PROGRESION].top100 - fotos[0].top100, dPool = 100 * (fotos[PROGRESION].activos - fotos[0].activos) / fotos[0].activos;
  const okTop30 = Math.abs(dTop30) <= TOP30_TOL, okTop100 = Math.abs(dTop100) <= TOP100_TOL, okPool = Math.abs(dPool) <= POOL_TOL;
  const favCriterio = t => t === '10' || t === '20';
  const okFav = Object.entries(favPool).filter(([t]) => favCriterio(t)).every(([, v]) => v >= FAV_MIN && v <= FAV_MAX);
  const okProg = desajustes === 0 && okTop30 && okTop100 && okPool && okFav;
  const signo = x => (x >= 0 ? '+' : '−') + f1b(Math.abs(x));
  console.log(`${desajustes === 0 ? 'OK  ' : 'FAIL'} nivel = media de atributos en todos los freestylers (novatos incluidos) en cada temporada (desajustes ${desajustes})`);
  console.log(`${okTop30 ? 'OK  ' : 'FAIL'} el top 30 queda a ${signo(dTop30)} puntos del inicio tras ${PROGRESION} temporadas (tolerancia ±${TOP30_TOL})`);
  console.log(`${okTop100 ? 'OK  ' : 'FAIL'} el top 100 queda a ${signo(dTop100)} puntos del inicio (tolerancia ±${TOP100_TOL})`);
  console.log(`${okPool ? 'OK  ' : 'FAIL'} el pool de activos pasa de ${fotos[0].activos} a ${fotos[PROGRESION].activos} (${signo(dPool)} %, tolerancia ±${POOL_TOL} %) · ${retTotal} retiros y ${novTotal} novatos en total, máximo ${retMax} retiros en una temporada${novTope ? ', el tope de ' + NOVATO_MAX + ' novatos se alcanzó en ' + novTope + ' temporadas' : ''}`);
  Object.entries(favPool).forEach(([t, v]) => console.log(`${!favCriterio(t) ? 'INFO' : (v >= FAV_MIN && v <= FAV_MAX ? 'OK  ' : 'FAIL')} favorito en liga con el pool de la temporada ${t}: ${f1b(v)} % (entre ${FAV_MIN} y ${FAV_MAX} %${favCriterio(t) ? '' : '; informativo'})`));

  const attrsBytes = JSON.stringify(pool.map(x => ({ attrs: x.attrs }))).length, judgesBytes = JSON.stringify({ judges: pickJudges('fms_espana') }).length * 7;
  console.log(`Además, desde la fase 1: atributos de los ${pool.length} freestylers ${kb(attrsBytes)} (una sola vez) y jueces de las 7 ligas ${kb(judgesBytes)} por temporada (${kb(judgesBytes * 10)} en 10).`);
  w.close();
  process.exit(ok && okKO && okUnder && okProg ? 0 : 1);
}, 800));
