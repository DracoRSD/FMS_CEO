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
const LIMITE_FAVORITO = 70;   // % máximo de victorias del favorito (criterio de aceptación)
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
  w.close();
  process.exit(ok ? 0 : 1);
}, 800));
