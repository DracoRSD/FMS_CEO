
/* =========================================================================
   FMS CEO · datos y constantes
========================================================================= */
const COUNTRY_COLORS = {"España":"#E2101F","Argentina":"#5DADE2","Chile":"#0B2545","Colombia":"#F2C230","Cuba":"#0033A0","México":"#006341","Panamá":"#00205B","Perú":"#D91023","Puerto Rico":"#ED1C24","República Dominicana":"#002D62","Venezuela":"#FFCC00","Sudamérica":"#2E8B57","Centroamérica":"#1F6FB2","Caribe":"#00A8A2","Bolivia":"#2E8B47","Ecuador":"#FFD100","Uruguay":"#57A0D3","Paraguay":"#D52B1E","Costa Rica":"#002B7F","Guatemala":"#4997D0","Honduras":"#0073CF","El Salvador":"#0047AB","Nicaragua":"#0067C6","EEUU":"#3C3B6E","Brasil":"#009739","Italia":"#009246","Francia":"#0055A4","Portugal":"#006600","Guinea Ecuatorial":"#009A44"};
function countryColor(c){ return COUNTRY_COLORS[c] || "#7a0a13"; }
function shadeColor(hex, percent){
  const num = parseInt(hex.replace('#',''),16);
  let r=(num>>16)+Math.round(255*percent/100), g=((num>>8)&255)+Math.round(255*percent/100), b=(num&255)+Math.round(255*percent/100);
  r=Math.max(0,Math.min(255,r)); g=Math.max(0,Math.min(255,g)); b=Math.max(0,Math.min(255,b));
  return '#'+(0x1000000+r*0x10000+g*0x100+b).toString(16).slice(1);
}
function avatarStyle(country){ const c=countryColor(country); return `background:linear-gradient(135deg, ${c}, ${shadeColor(c,-45)});`; }
function nrm(x){ return String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function fMatch(f,q){ if(!q) return true; const n=nrm(q).trim(); return nrm(f.name).includes(n) || nrm(f.country).includes(n); }
function photoOf(f){ return f ? (f.photo || (typeof FACES!=='undefined' && FACES[f.name]) || null) : null; }
function avatarDivStyle(f){ return photoOf(f) ? '' : avatarStyle(f? f.country : ''); }
function avatarContent(f){ const ph=photoOf(f); return ph ? `<img src="${ph}" alt="">` : (f? esc(f.name[0]) : '?'); }
function miniAvatar(id, size){
  const f=fby(id); if(!f) return '';
  return `<span class="mini-avatar" style="width:${size}px;height:${size}px;font-size:${Math.round(size*0.5)}px; ${avatarDivStyle(f)}">${avatarContent(f)}</span>`;
}
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

const LEAGUES = [
  {key:'fms_espana',    name:'FMS España',    short:'ESP', countries:['España'],    badge:'#E67E22', fg:'#fff'},
  {key:'fms_argentina', name:'FMS Argentina', short:'ARG', countries:['Argentina'], badge:'#64B5F6', fg:'#1a1a1a'},
  {key:'fms_mexico',    name:'FMS México',    short:'MEX', countries:['México'],    badge:'#2E7D32', fg:'#fff'},
  {key:'fms_chile',     name:'FMS Chile',     short:'CHI', countries:['Chile'],     badge:'#1A237E', fg:'#fff'},
  {key:'fms_peru',      name:'FMS Perú',      short:'PER', countries:['Perú'],      badge:'#E53935', fg:'#fff'},
  {key:'fms_colombia',  name:'FMS Colombia',  short:'COL', countries:['Colombia'],  badge:'#FFC107', fg:'#1a1a1a'},
  {key:'fms_caribe',    name:'FMS Caribe',    short:'CAR', countries:['Caribe','Venezuela','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua','Centroamérica','EEUU'], badge:'#8BC34A', fg:'#1a1a1a'},
];
const INTL = {key:'fms_internacional', name:'FMS Internacional', short:'INTL', badge:'#D4AF37', fg:'#1a1a1a'};
const LEAGUE_THEME = {
  fms_argentina:{red:'#00B8D4', bright:'#26E1F5', dark:'#006C7A'},
  fms_chile:{red:'#1A3FA0', bright:'#3D5FC7', dark:'#0D2160'},
  fms_mexico:{red:'#1B6B3A', bright:'#2E8F50', dark:'#0D3D20'},
  fms_caribe:{red:'#00A8A2', bright:'#2BD6CE', dark:'#00645F'},
  fms_colombia:{red:'#C99A12', bright:'#F2C230', dark:'#7A5D08'},
  fms_peru:{red:'#C0392B', bright:'#E85A45', dark:'#7A1F14'},
  fms_internacional:{red:'#B8932A', bright:'#EFCB5E', dark:'#6E5714'},
  fms_ws:{red:'#8E44FF', bright:'#B98CFF', dark:'#4B1D99'},
  redbull:{red:'#C8102E', bright:'#E8314F', dark:'#1B2A6B'},
};
// Logos oficiales (fijos, no editables)
const RB_LOGO = LOGOS.redbull;
const WS = {key:'fms_ws', name:'FMS World Series', short:'WS', countries:null, badge:'#8E44FF', fg:'#fff'};
const WS_JORNADAS = 5;
function isWS(k){ return k===WS.key; }
function natKeys(s){ return s.activeKeys.filter(k=>!isWS(k)); }
function nJ(k){ return isWS(k) ? WS_JORNADAS : JORNADAS; }
function wsRange(s){ const L=s.leagues[WS.key]; if(!L || !L.dates.length) return null; return [Math.min(...L.dates), Math.max(...L.dates)]; }
function ldef(key){ return key===INTL.key ? INTL : (key===WS.key ? WS : LEAGUES.find(l=>l.key===key)); }

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_C = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const DOW = ['L','M','X','J','V','S','D'];

// Reglas de la empresa
const STAR_THRESHOLDS = [0, 70, 220, 450, 780, 1200];   // reputación necesaria para 0..5 estrellas
const START_MONEY = 250000;
const JORNADAS = 9;
function maxLeagues(stars){ return Math.min(6, stars+1); }
function starsFor(rep){ let s=0; STAR_THRESHOLDS.forEach((t,i)=>{ if(rep>=t) s=i; }); return s; }

// Hype: días seguidos sin jornada de esa liga -> pérdida diaria
const GAP_OK = 21, GAP_WARN = 35;
function decayRate(gap){ return gap<=GAP_OK ? 0 : (gap<=GAP_WARN ? 0.4 : 1.0); }

/* ---------- fechas ---------- */
function daysInYear(y){ return ((y%4===0 && y%100!==0) || y%400===0) ? 366 : 365; }
function dayToDate(y,d){ return new Date(Date.UTC(y,0,1+d)); }
function dateToDay(y,m,dd){ return Math.round((Date.UTC(y,m,dd)-Date.UTC(y,0,1))/86400000); }
function fmtDay(y,d){ const t=dayToDate(y,d); return t.getUTCDate()+' '+MESES_C[t.getUTCMonth()]; }
function monthOf(y,d){ return dayToDate(y,d).getUTCMonth(); }
function money(n){ const s=Math.round(n).toLocaleString('es-ES'); return s+' €'; }
function moneyK(n){ const a=Math.abs(n); const s = a>=1000 ? (Math.round(a/100)/10).toLocaleString('es-ES')+'k' : Math.round(a)+''; return (n<0?'-':'')+s+' €'; }

/* ---------- generador de freestylers ficticios ---------- */
const SYL_A = ['Ka','Zu','Ne','Ro','Vi','Da','Mo','Te','Lu','Bra','Dre','Fe','Gro','Ix','Ja','Ky','Le','Ma','No','Pa','Qui','Re','Sa','To','Ul','Va','Xe','Yo','Zo','Cho','Tra','Kre','Plu','Sto','Bu','Ci','Gu','Hu','Ri','Se'];
const SYL_B = ['','','r','n','l','x','k','s','z','m','nd','rk','sk','lv','nt'];
const SYL_C = ['o','a','e','i','ix','on','ek','as','or','ux','in','al','us','er','ez','ow','ah','yn'];
function rnd(a,b){ return a + Math.random()*(b-a); }
function rint(a,b){ return Math.floor(rnd(a,b+1)); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function gauss(){ let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function clamp(x,a,b){ return Math.max(a,Math.min(b,x)); }
function genName(used){
  for(let t=0;t<200;t++){
    let n = pick(SYL_A)+pick(SYL_B)+pick(SYL_C);
    if(Math.random()<0.35) n += pick(SYL_A).toLowerCase()+pick(SYL_C);
    const r=Math.random();
    if(r<0.07) n = 'El '+n; else if(r<0.13) n = n+'-T'; else if(r<0.18) n = 'MC '+n; else if(r<0.22) n = 'Lil '+n; else if(r<0.25) n = n+' Flow';
    if(!used.has(n.toLowerCase())){ used.add(n.toLowerCase()); return n; }
  }
  return 'Freestyler '+(used.size+1);
}
function genStats(){
  const nivel = Math.round(clamp(64 + gauss()*11, 38, 95));
  const fama = Math.round(clamp(nivel - 10 + gauss()*13, 10, 98));
  return {nivel, fama};
}
// Preset de freestylers reales. País = liga/región con la que se les asocia. Nivel y fama son estimaciones editables (DEV).
// Freestylers reales de FMS y de Red Bull Batalla (2016-2026). País = región con la que compiten (los de Red Bull EEUU van como EEUU).
// Los de país 'Sudamérica'/'Centroamérica' compitieron en esas finales regionales sin país confirmado.
const REAL_PRESET = {
  "España": [["Chuty", 95, 94], ["Gazir", 94, 91], ["Arkano", 86, 89], ["Bnet", 91, 93], ["Zasko", 89, 87], ["Skone", 89, 89], ["Mnak", 84, 78], ["Sweet Pain", 88, 84], ["Blon", 82, 89], ["Dani VK", 81, 73], ["Hander", 76, 77], ["Sawi Elekipo", 74, 64], ["Force", 74, 89], ["Le33", 74, 62], ["Alek", 78, 77], ["Mounts", 77, 71], ["Tirpa", 81, 85], ["Michu", 67, 58], ["Fabiuki", 77, 75], ["Bta", 72, 77], ["Jesús LC", 72, 56], ["Kmbra", 77, 79], ["Nez", 75, 55], ["Barón", 73, 73], ["Mr. Ego", 80, 86], ["Invert", 74, 83], ["Khan", 32, 81], ["Sara Socas", 77, 88], ["Navas", 71, 86], ["Mowlihawk", 65, 84], ["Bélico", 75, 74], ["Nocre", 74, 71], ["BTP", 71, 62], ["Errecé", 76, 81], ["Adriana", 51, 53], ["Piromana", 55, 61], ["Segrelles", 78, 76], ["Owen", 68, 51], ["Spolker", 67, 61], ["Argente", 61, 55], ["Davisito", 70, 89], ["Mr Aaron", 67, 65], ["CDFlex", 66, 75], ["Ander2K", 73, 70], ["Sozat", 65, 65], ["Ibán", 74, 71], ["Zyko GDH", 68, 51], ["Piezas", 79, 86], ["Lgido", 76, 71], ["Dr. Filtros", 74, 72], ["Pirry", 67, 71], ["Azeta", 45, 35], ["NQP", 78, 76], ["Babi", 77, 78], ["Mike Shinobi", 70, 77], ["MC Men", 78, 83], ["Peret", 66, 65], ["Soen", 70, 72], ["Krisan", 74, 78], ["Nacho SRK", 75, 79], ["Botta", 72, 77], ["Nacho Argentino", 71, 61], ["Ortega", 64, 60], ["Arcoiris", 58, 65], ["Kavron", 75, 67], ["Akar", 66, 61], ["Ortiz", 45, 35], ["Titus", 73, 75], ["Kensuke", 67, 77], ["Niki DMT", 69, 71], ["Kinkiwinky", 60, 62], ["Rubenico", 70, 70], ["Swit Eme", 76, 83], ["Driu", 42, 66], ["Walls", 84, 89], ["Pyro", 65, 62], ["NachoLCM", 60, 50], ["Triple R", 67, 73], ["Estrimo", 31, 66], ["Godlemon", 45, 35], ["Jaloner", 96, 88], ["Jorge Mauro", 62, 59], ["Bohemia", 64, 67], ["Santi", 74, 76], ["Rayban", 77, 81], ["Tanquecrack", 57, 71], ["NG", 62, 76], ["Perry", 61, 51], ["Kusho", 66, 58], ["Conde", 46, 46], ["JC Snake", 64, 64], ["Tyler", 56, 55], ["Vokbulario", 56, 55], ["Cafú", 56, 55]],
  "Argentina": [["Stuart", 88, 86], ["Larrix", 89, 84], ["Mecha", 91, 87], ["Wos", 89, 97], ["Papo", 88, 95], ["Dtoke", 82, 91], ["Dani Ribba", 78, 84], ["Kodigo", 85, 86], ["Trueno", 87, 99], ["Klan", 83, 81], ["G Sony", 80, 81], ["Replik", 84, 87], ["Jesse Pungaz", 75, 71], ["Nacho", 76, 75], ["Naista", 72, 78], ["Zaina", 75, 83], ["MP", 81, 79], ["Tata", 74, 81], ["Katra", 72, 62], ["Wolf", 72, 58], ["Mito", 70, 62], ["Dybbuk", 75, 71], ["DAC", 62, 56], ["Jaff", 67, 56], ["CTZ", 77, 78], ["MKS", 77, 82], ["Cacha", 77, 88], ["Sub", 77, 83], ["Nasir Catriel", 62, 55], ["Barto", 66, 61], ["Exe", 80, 77], ["HDR", 73, 80], ["Sophia", 71, 74], ["Abel", 79, 82], ["Cobe CLK", 63, 65], ["1Tobi", 72, 74], ["Dyse", 82, 76], ["GW", 65, 62], ["Ritter", 70, 71], ["Franchute", 77, 78], ["Rife", 77, 78], ["TiagoPZK", 83, 91], ["Lit Killah", 83, 95], ["Duki", 80, 99], ["Roma", 70, 77], ["Dozer", 71, 76], ["G5", 71, 67], ["Brasita", 60, 55], ["Parker", 70, 72], ["Alkoy", 75, 75], ["Snake", 68, 71], ["Acru", 92, 88], ["Frescolate", 76, 82], ["Dam", 79, 81]],
  "México": [["Aczino", 95, 98], ["Jony Beltrán", 89, 91], ["Azuky", 86, 94], ["Rapder", 84, 83], ["Lobo Estepario", 85, 82], ["Yoiker", 76, 74], ["RC", 83, 82], ["Dante", 72, 64], ["Skiper", 86, 80], ["Ari Carrillo", 71, 60], ["Zticma", 75, 77], ["Dominic", 72, 68], ["Garza", 71, 72], ["Jack Andrenalina", 72, 82], ["Nota Roja", 70, 48], ["Soto", 60, 48], ["Xavlac", 65, 48], ["Damián", 69, 46], ["Lobo López", 68, 87], ["Xhavez", 71, 72], ["Fat Tony", 66, 65], ["Potencia", 73, 70], ["DangerAK", 21, 68], ["Saturno", 64, 56], ["Dalia", 72, 78], ["Sandra", 64, 71], ["Hadrian", 74, 81], ["Vens", 64, 59]],
  "Chile": [["El Menor", 94, 92], ["Teorema", 91, 93], ["Acertijo", 84, 80], ["Nitro", 87, 87], ["Kaiser", 84, 89], ["Tom Crowley", 79, 76], ["Stigma", 77, 81], ["Ricto", 88, 84], ["Joqerr", 76, 74], ["Drose", 83, 86], ["Pepe Grillo", 74, 76], ["Jokker", 74, 62], ["Metalingüística", 83, 85], ["Racso", 73, 58], ["Esezeta", 72, 78], ["Rodamiento", 78, 76], ["Anubis", 79, 72], ["Basek", 72, 66], ["Satim", 61, 65], ["Blade", 71, 65], ["99", 70, 64], ["Bigtamina", 72, 67], ["Adesong", 78, 64], ["Elemece", 70, 64], ["Eskai", 60, 54], ["ChysteMC", 80, 84], ["BTI", 62, 69], ["Destello", 70, 67], ["Fusok", 72, 66], ["Scub", 70, 72]],
  "Perú": [["Jaze", 93, 94], ["Jota", 86, 84], ["Stick", 84, 74], ["KG", 84, 85], ["Nekroos", 88, 87], ["Litzen", 76, 74], ["Skill", 87, 82], ["Choque", 76, 80], ["Strike", 75, 73], ["Jair Wong", 71, 74], ["Vijay Kesh", 85, 89], ["Diego MC", 74, 60], ["Kian", 79, 79], ["Ramset", 72, 56], ["Ghost", 72, 56], ["Xplain", 79, 76], ["Almendrades", 78, 79], ["Piero Pistas", 70, 54], ["Katacrist", 70, 48], ["Xilo", 68, 44], ["Scope", 68, 44], ["Maricielo", 67, 44], ["Letras Tarapoto", 67, 42], ["Blaxi Mental", 67, 42], ["Sumeria", 67, 83], ["Scraps", 74, 62], ["Venti", 67, 62], ["Dexuz", 72, 76], ["Danu", 72, 70], ["Icon", 62, 66], ["Necia", 76, 71], ["Gasper", 70, 72], ["Papicha", 72, 67], ["MSL", 61, 55]],
  "Colombia": [["Valles-T", 88, 89], ["Marithea", 89, 88], ["Lokillo", 85, 93], ["Filósofo", 81, 74], ["J1", 76, 60], ["Coloso", 75, 62], ["Puppy", 81, 71], ["RBN", 74, 60], ["Airon", 74, 60], ["Carpediem", 86, 82], ["Elevn", 74, 56], ["Fat N", 82, 84], ["Ken Zingle", 72, 58], ["Token", 72, 54], ["Axl Evans", 68, 44], ["Coffy", 68, 44], ["Urko", 73, 78], ["Visionario", 76, 74], ["Pandora", 67, 72], ["Lil White", 67, 65], ["Dima", 67, 65], ["Kore", 68, 65], ["Nico B", 75, 56], ["Flama", 68, 65], ["Gafas", 67, 51], ["Andy Ink", 61, 48], ["Tormenta", 59, 51], ["JM Serna", 70, 73]],
  "Venezuela": [["Chang", 86, 83], ["Letra", 82, 80], ["Black Code", 83, 78], ["Lit Ignis", 69, 46], ["Lancer Lirical", 79, 76], ["MCKlopedia", 80, 86], ["Gavyria", 64, 75], ["Oner", 70, 66], ["Akapellah", 83, 87], ["AdonysX", 79, 62], ["Freites", 77, 58], ["White Caracas", 75, 56], ["Bobby", 68, 44], ["Imigrante", 68, 44], ["Lou T", 68, 44]],
  "Ecuador": [["Mac Tempo", 80, 66], ["Abel EC", 76, 56], ["Alfredozki", 75, 56], ["Switch", 74, 58], ["Melo", 72, 50], ["Eppico", 71, 48], ["Big Mind", 69, 44], ["Punch", 69, 44], ["Andy Novem", 68, 42], ["Adulterio", 68, 42], ["Amir", 67, 42], ["Acxel Rapster", 66, 40], ["Santo Skill", 66, 40]],
  "Uruguay": [["Spektro", 79, 71], ["Wordplay", 72, 50], ["Naicen", 69, 44], ["Alexunder", 68, 42], ["SOK", 67, 42], ["Vostok", 67, 42], ["Punisher", 67, 40], ["Rasta", 72, 69], ["Ualde", 66, 41], ["SFJ", 66, 43], ["Varela", 66, 45], ["Hammer", 74, 71], ["Morfeo", 66, 41], ["Cronin", 66, 40]],
  "Paraguay": [["Drazer", 72, 50], ["Mister H", 68, 44]],
  "Bolivia": [["Minos", 72, 50]],
  "República Dominicana": [["Éxodo Lirical", 78, 76], ["KDT", 70, 48], ["Shield Master", 69, 46]],
  "Costa Rica": [["SNK", 74, 70], ["RVS", 69, 46], ["P8", 68, 44], ["Blackhawk", 68, 44], ["Eros EQ", 67, 67], ["Kenyari", 67, 42], ["Cehzar", 67, 42], ["Bana", 68, 44], ["Nicosan", 68, 44]],
  "Guatemala": [["Ritmodelia", 74, 76]],
  "Panamá": [["Aldahir", 71, 65], ["UFO", 70, 48], ["Índico", 69, 66], ["Bway Woody", 67, 42]],
  "El Salvador": [["Zaki", 72, 56], ["Zeu", 68, 44], ["Reos", 68, 44], ["Verso One", 68, 44], ["Jafet", 68, 44], ["Odil", 67, 42]],
  "Nicaragua": [["Pseudocódigo", 68, 44], ["Blaze", 67, 42]],
  "Honduras": [["Terrorista", 68, 44], ["Androide", 68, 56]],
  "Puerto Rico": [["Yartzi", 82, 72], ["Outlaw", 67, 42], ["Knnon", 66, 40]],
  "Cuba": [["Reverse", 84, 74]]
};
function presetPhoto(name){ return name==='Force' ? STREAMERS.force.photo : null; }
function randHype(fama){ return fama==null ? Math.round(clamp(50+gauss()*20,1,99)) : Math.round(clamp(fama*0.85+6+gauss()*7,1,99)); }   // hype inicial: va con la fama, pero no exacto
const PRESET_LEGENDS = ["Chuty", "Gazir", "Arkano", "Bnet", "Skone", "Invert", "Khan", "Piezas", "Walls", "Pyro", "Jaloner", "Wos", "Papo", "Dtoke", "Trueno", "TiagoPZK", "Lit Killah", "Duki", "Frescolate", "Aczino", "Hadrian", "Kaiser", "Ricto", "ChysteMC", "Jaze", "Lokillo", "MCKlopedia", "Akapellah"];
function generatePool(){
  const out=[];
  Object.entries(REAL_PRESET).forEach(([country,list])=> list.forEach(([name,nivel,fama])=> out.push(ensureAttrs({id:uid('f'), name, country, nivel, fama, hype:randHype(fama), photo:presetPhoto(name), legend: PRESET_LEGENDS.includes(name), style:defaultStyle(name)}))));
  return out;
}
const LEGEND_MULT = 1.5;  // las leyendas cobran un 50% más solo por serlo
/* ---- estilos de freestyle ---- */
// v: variabilidad entre rondas (1 = normal) · m: ventaja/desventaja por tipo de ronda (en puntos de nivel)
const STYLES = {
  'Punchline':  {v:0.6, m:{deluxe:4, min:-4},                         txt:'Cuadrado y constante. Destaca en el Deluxe, sufre en los minutos libres.'},
  'Ingenio':    {v:0.6, m:{tema:5, min:-4},                           txt:'Cuadrado y constante. Destaca en Temáticas, baja en los minutos.'},
  'Métrico':    {v:1.5, m:{min:4, easy:4, tema:-4, random:-4},        txt:'Muy irregular. Destaca en minutos y Easy Mode, baja en Temáticas y Random Mode.'},
  'Flow':       {v:1.5, m:{easy:-4, hard:-4, min:4},                  txt:'Muy irregular. Sube en los minutos, baja en Easy y Hard Mode.'},
  'Showman':    {v:1,   m:{}, views:1.15,                             txt:'No destaca en ninguna ronda, pero sus batallas tienen más visitas.'},
  'Disonante':  {v:1,   m:{deluxe:4, easy:4, min:-4, tema:-4, hard:-4}, fmt:{short:2, long:-2}, txt:'Rinde mejor en formato corto. Destaca en Deluxe y Easy, baja en minutos, Temáticas y Hard.'},
  'Teatral':    {v:1.15,m:{random:5, deluxe:-4},                      txt:'Muy expresivo. Destaca en Random Mode, baja en el Deluxe.'},
  'Coherencia': {v:0.6, m:{hard:-4, easy:4},                          txt:'Cuadrado y constante. Destaca en Easy Mode, baja en Hard Mode.'},
  'Poético':    {v:0.6, m:{}, spike:true,                             txt:'Constante, pero de vez en cuando se sale en una ronda.'},
};
const STYLE_NAMES = Object.keys(STYLES);
const STYLE_PRESET = {"Chuty": "Ingenio", "Gazir": "Ingenio", "Arkano": "Punchline", "Bnet": "Métrico", "Zasko": "Métrico", "Skone": "Showman", "Mnak": "Punchline", "Sweet Pain": "Poético", "Blon": "Ingenio", "Dani VK": "Ingenio", "Hander": "Punchline", "Sawi Elekipo": "Punchline", "Force": "Punchline", "Le33": "Flow", "Alek": "Coherencia", "Mounts": "Ingenio", "Tirpa": "Poético", "Michu": "Flow", "Fabiuki": "Métrico", "Bta": "Punchline", "Jesús LC": "Punchline", "Kmbra": "Poético", "Nez": "Ingenio", "Barón": "Métrico", "Mr. Ego": "Showman", "Invert": "Showman", "Khan": "Flow", "Sara Socas": "Flow", "Navas": "Disonante", "Mowlihawk": "Showman", "Bélico": "Poético", "Nocre": "Punchline", "BTP": "Punchline", "Errecé": "Flow", "Adriana": "Punchline", "Piromana": "Poético", "Segrelles": "Métrico", "Owen": "Punchline", "Spolker": "Métrico", "Argente": "Showman", "Davisito": "Punchline", "Mr Aaron": "Métrico", "CDFlex": "Showman", "Ander2K": "Métrico", "Sozat": "Flow", "Ibán": "Métrico", "Zyko GDH": "Punchline", "Piezas": "Flow", "Lgido": "Punchline", "Dr. Filtros": "Disonante", "Pirry": "Flow", "Azeta": "Coherencia", "NQP": "Métrico", "Babi": "Showman", "Mike Shinobi": "Flow", "MC Men": "Showman", "Peret": "Punchline", "Soen": "Punchline", "Krisan": "Punchline", "Nacho SRK": "Métrico", "Botta": "Showman", "Nacho Argentino": "Métrico", "Ortega": "Disonante", "Arcoiris": "Disonante", "Kavron": "Punchline", "Akar": "Flow", "Ortiz": "Coherencia", "Titus": "Showman", "Kensuke": "Showman", "Niki DMT": "Punchline", "Kinkiwinky": "Disonante", "Rubenico": "Métrico", "Swit Eme": "Poético", "Driu": "Disonante", "Walls": "Ingenio", "Pyro": "Teatral", "NachoLCM": "Punchline", "Triple R": "Métrico", "Estrimo": "Punchline", "Godlemon": "Métrico", "Jaloner": "Métrico", "Jorge Mauro": "Punchline", "Bohemia": "Punchline", "Santi": "Ingenio", "Rayban": "Showman", "Tanquecrack": "Showman", "NG": "Coherencia", "Stuart": "Poético", "Larrix": "Teatral", "Mecha": "Punchline", "Wos": "Flow", "Papo": "Métrico", "Dtoke": "Showman", "Dani Ribba": "Flow", "Kodigo": "Flow", "Trueno": "Flow", "Klan": "Punchline", "G Sony": "Flow", "Replik": "Poético", "Jesse Pungaz": "Flow", "Nacho": "Punchline", "Naista": "Punchline", "Zaina": "Ingenio", "MP": "Flow", "Tata": "Teatral", "Katra": "Punchline", "Wolf": "Ingenio", "Mito": "Coherencia", "Dybbuk": "Showman", "DAC": "Ingenio", "Jaff": "Teatral", "CTZ": "Poético", "MKS": "Punchline", "Cacha": "Showman", "Sub": "Punchline", "Nasir Catriel": "Punchline", "Barto": "Punchline", "Exe": "Ingenio", "HDR": "Showman", "Sophia": "Poético", "Abel": "Métrico", "Cobe CLK": "Showman", "1Tobi": "Flow", "Dyse": "Coherencia", "GW": "Punchline", "Ritter": "Métrico", "Franchute": "Showman", "Rife": "Poético", "TiagoPZK": "Flow", "Lit Killah": "Métrico", "Duki": "Flow", "Roma": "Punchline", "Dozer": "Punchline", "G5": "Flow", "Brasita": "Punchline", "Parker": "Punchline", "Alkoy": "Flow", "Snake": "Flow", "Acru": "Métrico", "Frescolate": "Punchline", "Dam": "Métrico", "Aczino": "Punchline", "Jony Beltrán": "Showman", "Azuky": "Punchline", "Rapder": "Punchline", "Lobo Estepario": "Punchline", "Yoiker": "Punchline", "RC": "Flow", "Dante": "Punchline", "Skiper": "Ingenio", "Ari Carrillo": "Punchline", "Zticma": "Showman", "Dominic": "Punchline", "Garza": "Showman", "Jack Andrenalina": "Showman", "Nota Roja": "Teatral", "Soto": "Punchline", "Xavlac": "Punchline", "Damián": "Punchline", "Lobo López": "Showman", "Xhavez": "Punchline", "Fat Tony": "Punchline", "Potencia": "Ingenio", "DangerAK": "Punchline", "Saturno": "Ingenio", "Dalia": "Showman", "Sandra": "Punchline", "Hadrian": "Ingenio", "Vens": "Showman", "El Menor": "Métrico", "Teorema": "Métrico", "Acertijo": "Ingenio", "Nitro": "Punchline", "Kaiser": "Showman", "Tom Crowley": "Punchline", "Stigma": "Flow", "Ricto": "Métrico", "Joqerr": "Showman", "Drose": "Métrico", "Pepe Grillo": "Ingenio", "Jokker": "Punchline", "Metalingüística": "Métrico", "Racso": "Punchline", "Esezeta": "Flow", "Rodamiento": "Ingenio", "Anubis": "Métrico", "Basek": "Punchline", "Satim": "Showman", "Blade": "Punchline", "99": "Ingenio", "Bigtamina": "Punchline", "Adesong": "Métrico", "Elemece": "Ingenio", "Eskai": "Punchline", "ChysteMC": "Métrico", "BTI": "Punchline", "Destello": "Showman", "Fusok": "Ingenio", "Scub": "Métrico", "Jaze": "Flow", "Jota": "Flow", "Stick": "Punchline", "KG": "Flow", "Nekroos": "Punchline", "Litzen": "Punchline", "Skill": "Poético", "Choque": "Punchline", "Strike": "Ingenio", "Jair Wong": "Showman", "Vijay Kesh": "Teatral", "Diego MC": "Punchline", "Kian": "Métrico", "Ramset": "Punchline", "Ghost": "Punchline", "Xplain": "Métrico", "Almendrades": "Ingenio", "Piero Pistas": "Punchline", "Katacrist": "Punchline", "Xilo": "Punchline", "Scope": "Punchline", "Maricielo": "Punchline", "Letras Tarapoto": "Punchline", "Blaxi Mental": "Punchline", "Sumeria": "Showman", "Scraps": "Punchline", "Venti": "Ingenio", "Dexuz": "Ingenio", "Danu": "Punchline", "Icon": "Punchline", "Necia": "Ingenio", "Gasper": "Punchline", "Papicha": "Ingenio", "MSL": "Ingenio", "Valles-T": "Punchline", "Marithea": "Ingenio", "Lokillo": "Showman", "Filósofo": "Poético", "J1": "Punchline", "Coloso": "Ingenio", "Puppy": "Ingenio", "RBN": "Punchline", "Airon": "Punchline", "Carpediem": "Métrico", "Elevn": "Punchline", "Fat N": "Showman", "Ken Zingle": "Punchline", "Token": "Punchline", "Axl Evans": "Punchline", "Coffy": "Ingenio", "Urko": "Showman", "Visionario": "Flow", "Pandora": "Ingenio", "Lil White": "Métrico", "Dima": "Métrico", "Kore": "Ingenio", "Nico B": "Punchline", "Flama": "Ingenio", "Gafas": "Ingenio", "Andy Ink": "Punchline", "Tormenta": "Coherencia", "JM Serna": "Ingenio", "Chang": "Ingenio", "Letra": "Coherencia", "Black Code": "Ingenio", "Lit Ignis": "Punchline", "Lancer Lirical": "Flow", "MCKlopedia": "Flow", "Gavyria": "Punchline", "Oner": "Punchline", "Akapellah": "Flow", "AdonysX": "Punchline", "Freites": "Punchline", "White Caracas": "Punchline", "Bobby": "Punchline", "Imigrante": "Punchline", "Lou T": "Punchline", "Mac Tempo": "Punchline", "Abel EC": "Ingenio", "Alfredozki": "Punchline", "Switch": "Ingenio", "Melo": "Punchline", "Eppico": "Punchline", "Big Mind": "Punchline", "Punch": "Punchline", "Andy Novem": "Punchline", "Adulterio": "Punchline", "Amir": "Punchline", "Acxel Rapster": "Punchline", "Santo Skill": "Punchline", "Spektro": "Ingenio", "Wordplay": "Punchline", "Naicen": "Punchline", "Alexunder": "Punchline", "SOK": "Punchline", "Vostok": "Punchline", "Punisher": "Punchline", "Rasta": "Poético", "Ualde": "Punchline", "SFJ": "Punchline", "Varela": "Punchline", "Hammer": "Ingenio", "Morfeo": "Punchline", "Cronin": "Punchline", "Drazer": "Punchline", "Mister H": "Punchline", "Minos": "Punchline", "Éxodo Lirical": "Showman", "KDT": "Punchline", "Shield Master": "Punchline", "SNK": "Ingenio", "RVS": "Punchline", "P8": "Punchline", "Blackhawk": "Punchline", "Eros EQ": "Ingenio", "Kenyari": "Punchline", "Cehzar": "Punchline", "Bana": "Punchline", "Nicosan": "Punchline", "Ritmodelia": "Ingenio", "Aldahir": "Ingenio", "UFO": "Punchline", "Índico": "Ingenio", "Bway Woody": "Punchline", "Zaki": "Ingenio", "Zeu": "Punchline", "Reos": "Punchline", "Verso One": "Ingenio", "Jafet": "Punchline", "Odil": "Punchline", "Pseudocódigo": "Punchline", "Blaze": "Punchline", "Terrorista": "Punchline", "Androide": "Punchline", "Yartzi": "Ingenio", "Outlaw": "Punchline", "Knnon": "Punchline", "Reverse": "Flow", "Perry": "Ingenio", "Kusho": "Poético", "Conde": "Teatral", "JC Snake": "Ingenio", "Tyler": "Punchline", "Vokbulario": "Coherencia", "Cafú": "Punchline"};   // bloc de notas de la base de datos
function defaultStyle(name){ if(STYLE_PRESET[name]) return STYLE_PRESET[name]; let h=0; for(const ch of name) h=(h*31+ch.charCodeAt(0))>>>0; return STYLE_NAMES[h%STYLE_NAMES.length]; }
function styleOf(f){ return (f && STYLES[f.style]) ? f.style : (f ? defaultStyle(f.name) : 'Showman'); }

/* =========================================================================
   Modelo de atributos y jueces
   Todas las constantes ajustables del modelo viven en este bloque.
========================================================================= */
const ATTR_KEYS = ['punchline','metrica','flow','impro','mentalidad'];
const ATTR_LABELS = {punchline:'Punchline', metrica:'Métrica', flow:'Flow', impro:'Improvisación', mentalidad:'Mentalidad'};
// Peso de cada atributo según el tipo de ronda (cada fila suma 1)
const ROUND_WEIGHTS = {
  random:{punchline:0.20, metrica:0.10, flow:0.15, impro:0.45, mentalidad:0.10},
  min:   {punchline:0.20, metrica:0.30, flow:0.30, impro:0.10, mentalidad:0.10},
  deluxe:{punchline:0.35, metrica:0.25, flow:0.15, impro:0.10, mentalidad:0.15},
  easy:  {punchline:0.10, metrica:0.35, flow:0.25, impro:0.20, mentalidad:0.10},
  hard:  {punchline:0.10, metrica:0.35, flow:0.10, impro:0.30, mentalidad:0.15},
  tema:  {punchline:0.20, metrica:0.15, flow:0.10, impro:0.40, mentalidad:0.15},
};
// Sesgo de cada estilo al convertir un nivel en atributos (puntos). La media se reajusta después al nivel exacto.
const STYLE_ATTR_BIAS = {
  'Punchline':  {punchline:+8, metrica:0,  flow:-4, impro:-3, mentalidad:+2},
  'Ingenio':    {punchline:+2, metrica:-3, flow:-3, impro:+8, mentalidad:+3},
  'Métrico':    {punchline:-3, metrica:+9, flow:+3, impro:-4, mentalidad:-5},
  'Flow':       {punchline:-4, metrica:+2, flow:+9, impro:-2, mentalidad:-5},
  'Showman':    {punchline:+2, metrica:-3, flow:+3, impro:+1, mentalidad:0},
  'Disonante':  {punchline:+4, metrica:-4, flow:+2, impro:+1, mentalidad:-2},
  'Teatral':    {punchline:-2, metrica:-3, flow:+2, impro:+5, mentalidad:-1},
  'Coherencia': {punchline:-3, metrica:+3, flow:-2, impro:+2, mentalidad:+4},
  'Poético':    {punchline:-2, metrica:+4, flow:+1, impro:-4, mentalidad:+4},
};
const ATTR_NOISE = 3;          // desviación típica (puntos) del ruido al convertir; determinista por nombre
const ATTR_MAX = 110;          // tope interno de un atributo (la media sigue siendo el nivel, que no pasa de 99)
const ATTR_SHOWN_MAX = 99;     // tope al mostrarlo en la interfaz
const STYLE_ROUND_MOD = 0.5;   // los modificadores por ronda de STYLES (m) pesan la mitad: los atributos ya explican parte
// Mentalidad y varianza: factor = MENTAL_VAR_BASE − mentalidad·MENTAL_VAR_SLOPE (50 → 1,00 · 90 → 0,80 · 20 → 1,15)
const MENTAL_VAR_BASE = 1.45, MENTAL_VAR_SLOPE = 0.005;
const MENTAL_REPLICA = 0.15;   // puntos de nivel equivalentes en la mano alzada por cada punto de mentalidad sobre el rival
// Jueces
const JUDGE_TASTE_PER_10 = 0.25;                       // puntos (escala 1-10) por cada 10 puntos de atributo sobre 50 y gusto 1,0
const JUDGE_NOISE_MIN = 0.25, JUDGE_NOISE_MAX = 0.75;   // ruido por ronda: consistencia 1 → mínimo, 0 → máximo
const JUDGE_GROUP = {fms_espana:'España', fms_argentina:'Argentina', fms_mexico:'México', fms_chile:'Chile', fms_peru:'Perú', fms_colombia:'Colombia', fms_caribe:'Caribe'};
const JUDGES_PER_LEAGUE = 5, JUDGES_INTL_PER_LEAGUE = 1;   // por liga y temporada: 4 del país + 1 internacional
// Pool de jueces (nombres ficticios). gustos: −0,5 a +0,5 · consistencia: 0 a 1 · severidad: −0,4 a +0,4 (igual para ambos)
const JUDGES = [
  // España
  {id:'j_esp_1', name:'Tano Barrera',    country:'España',    gustos:{punchline:+0.4, flow:-0.2},                consistencia:0.85, severidad:-0.1},
  {id:'j_esp_2', name:'Lía Ferrer',      country:'España',    gustos:{impro:+0.4, metrica:-0.1},                 consistencia:0.70, severidad:+0.2},
  {id:'j_esp_3', name:'Nuko',            country:'España',    gustos:{metrica:+0.4, flow:+0.2, punchline:-0.2},  consistencia:0.60, severidad:0},
  {id:'j_esp_4', name:'Rober Dalmau',    country:'España',    gustos:{mentalidad:+0.3, impro:+0.2},              consistencia:0.90, severidad:-0.3},
  {id:'j_esp_5', name:'Mayka Soler',     country:'España',    gustos:{flow:+0.3, punchline:+0.1, metrica:-0.2},  consistencia:0.55, severidad:+0.3},
  // Argentina
  {id:'j_arg_1', name:'Facu Ledesma',    country:'Argentina', gustos:{metrica:+0.4, flow:+0.2},                  consistencia:0.75, severidad:0},
  {id:'j_arg_2', name:'Pili Rojas',      country:'Argentina', gustos:{punchline:+0.4, impro:-0.1},               consistencia:0.65, severidad:+0.1},
  {id:'j_arg_3', name:'El Sordo Ruiz',   country:'Argentina', gustos:{flow:+0.4, mentalidad:-0.1},               consistencia:0.50, severidad:+0.3},
  {id:'j_arg_4', name:'Mati Quiroga',    country:'Argentina', gustos:{impro:+0.3, metrica:+0.2, punchline:-0.2}, consistencia:0.85, severidad:-0.2},
  {id:'j_arg_5', name:'Lu Ferreyra',     country:'Argentina', gustos:{mentalidad:+0.3, flow:+0.1},               consistencia:0.90, severidad:-0.1},
  // México
  {id:'j_mex_1', name:'Chino Valdez',    country:'México',    gustos:{punchline:+0.5, flow:-0.2},                consistencia:0.60, severidad:0},
  {id:'j_mex_2', name:'Marisol Ibarra',  country:'México',    gustos:{impro:+0.4, mentalidad:+0.1},              consistencia:0.80, severidad:-0.2},
  {id:'j_mex_3', name:'Rorro Castañeda', country:'México',    gustos:{metrica:+0.3, flow:+0.3},                  consistencia:0.70, severidad:+0.2},
  {id:'j_mex_4', name:'Dany Olvera',     country:'México',    gustos:{punchline:+0.2, impro:+0.2, metrica:-0.2}, consistencia:0.55, severidad:+0.4},
  {id:'j_mex_5', name:'Toño Lugo',       country:'México',    gustos:{mentalidad:+0.4, punchline:-0.1},          consistencia:0.90, severidad:-0.3},
  // Chile
  {id:'j_chi_1', name:'Pancho Riquelme', country:'Chile',     gustos:{metrica:+0.4, punchline:-0.2},             consistencia:0.80, severidad:-0.1},
  {id:'j_chi_2', name:'Cata Fuenzalida', country:'Chile',     gustos:{impro:+0.4, flow:+0.1},                    consistencia:0.70, severidad:+0.1},
  {id:'j_chi_3', name:'Nacho Vergara',   country:'Chile',     gustos:{punchline:+0.4, metrica:+0.1},             consistencia:0.60, severidad:+0.2},
  {id:'j_chi_4', name:'Kote Saavedra',   country:'Chile',     gustos:{flow:+0.4, impro:-0.2},                    consistencia:0.50, severidad:+0.3},
  {id:'j_chi_5', name:'Javi Oyarzún',    country:'Chile',     gustos:{mentalidad:+0.3, metrica:+0.2},            consistencia:0.90, severidad:-0.3},
  // Perú
  {id:'j_per_1', name:'Renzo Huamán',    country:'Perú',      gustos:{punchline:+0.4, flow:-0.1},                consistencia:0.75, severidad:0},
  {id:'j_per_2', name:'Kiara Mendoza',   country:'Perú',      gustos:{impro:+0.3, mentalidad:+0.2},              consistencia:0.85, severidad:-0.2},
  {id:'j_per_3', name:'Piero Zapata',    country:'Perú',      gustos:{metrica:+0.4, impro:-0.2},                 consistencia:0.65, severidad:+0.2},
  {id:'j_per_4', name:'Gino Chávez',     country:'Perú',      gustos:{flow:+0.4, punchline:+0.1},                consistencia:0.55, severidad:+0.3},
  {id:'j_per_5', name:'Dayana Quispe',   country:'Perú',      gustos:{punchline:+0.2, metrica:+0.2, flow:-0.2},  consistencia:0.80, severidad:-0.1},
  // Colombia
  {id:'j_col_1', name:'Juancho Arango',  country:'Colombia',  gustos:{punchline:+0.4, metrica:-0.2},             consistencia:0.70, severidad:+0.1},
  {id:'j_col_2', name:'Vale Restrepo',   country:'Colombia',  gustos:{impro:+0.5, flow:-0.1},                    consistencia:0.60, severidad:0},
  {id:'j_col_3', name:'Pipe Cardona',    country:'Colombia',  gustos:{flow:+0.4, mentalidad:+0.1},               consistencia:0.80, severidad:-0.2},
  {id:'j_col_4', name:'Sebas Montoya',   country:'Colombia',  gustos:{metrica:+0.3, punchline:+0.2},             consistencia:0.55, severidad:+0.4},
  {id:'j_col_5', name:'Nata Giraldo',    country:'Colombia',  gustos:{mentalidad:+0.4, impro:+0.1},              consistencia:0.90, severidad:-0.3},
  // Caribe
  {id:'j_car_1', name:'Yeyo Marcano',    country:'Caribe',    gustos:{punchline:+0.5, metrica:-0.2},             consistencia:0.60, severidad:+0.2},
  {id:'j_car_2', name:'Dariel Peña',     country:'Caribe',    gustos:{flow:+0.4, impro:+0.1},                    consistencia:0.70, severidad:0},
  {id:'j_car_3', name:'Yaritza Bermúdez',country:'Caribe',    gustos:{impro:+0.4, punchline:-0.1},               consistencia:0.80, severidad:-0.1},
  {id:'j_car_4', name:'Kelvin Santana',  country:'Caribe',    gustos:{metrica:+0.4, flow:+0.1},                  consistencia:0.50, severidad:+0.3},
  {id:'j_car_5', name:'Marielys Rondón', country:'Caribe',    gustos:{mentalidad:+0.3, punchline:+0.2},          consistencia:0.85, severidad:-0.2},
  // Internacionales
  {id:'j_int_1', name:'Max Urrutia',     country:'Internacional', gustos:{punchline:+0.3, impro:+0.2},           consistencia:0.90, severidad:-0.1},
  {id:'j_int_2', name:'Sol Benítez',     country:'Internacional', gustos:{metrica:+0.3, flow:+0.2},              consistencia:0.85, severidad:0},
  {id:'j_int_3', name:'Kael Doménech',   country:'Internacional', gustos:{impro:+0.4, mentalidad:+0.1},          consistencia:0.80, severidad:-0.2},
  {id:'j_int_4', name:'Ana Lucía Prado', country:'Internacional', gustos:{flow:+0.3, punchline:+0.2},            consistencia:0.75, severidad:+0.1},
  {id:'j_int_5', name:'Jairo Betancur',  country:'Internacional', gustos:{mentalidad:+0.4, metrica:+0.1},        consistencia:0.95, severidad:-0.3},
];
const JUDGE_BY_ID = Object.fromEntries(JUDGES.map(j=>[j.id, j]));

/* ---- atributos ---- */
// Generador con semilla (mulberry32) para que la conversión nivel → atributos sea la misma en todas las partidas
function seedOf(str){ let h=2166136261; for(const ch of String(str)){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); } return h>>>0; }
function seededRandom(seed){ let a=seed>>>0; return function(){ a=(a+0x6D2B79F5)>>>0; let t=a; t=Math.imul(t^(t>>>15), t|1); t^=t+Math.imul(t^(t>>>7), t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function seededGauss(rnd){ let u=0,v=0; while(!u) u=rnd(); while(!v) v=rnd(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function nivelFromAttrs(at){ return Math.round(ATTR_KEYS.reduce((s,k)=>s+(at[k]||0),0)/ATTR_KEYS.length); }
// Convierte un nivel y un estilo en los cinco atributos. La media redondeada es exactamente el nivel.
function attrsFromNivel(nivel, style, seed){
  const bias=STYLE_ATTR_BIAS[style]||{}; const rnd=seededRandom(seedOf(seed||'')^seedOf(style||''));
  const raw=ATTR_KEYS.map(k=>(bias[k]||0)+seededGauss(rnd)*ATTR_NOISE);
  const mean=raw.reduce((a,b)=>a+b,0)/raw.length;
  const at={}; ATTR_KEYS.forEach((k,i)=>at[k]=clamp(Math.round(nivel+raw[i]-mean),1,ATTR_MAX));
  for(let guard=0; guard<20 && nivelFromAttrs(at)!==nivel; guard++){   // el recorte a 1-ATTR_MAX puede mover la media: se corrige
    const up=nivelFromAttrs(at)<nivel; const k=ATTR_KEYS.slice().sort((a,b)=>up? at[a]-at[b] : at[b]-at[a])[0]; at[k]=clamp(at[k]+(up?1:-1),1,ATTR_MAX); }
  return at;
}
function ensureAttrs(f){ if(!f) return f; if(!f.attrs || ATTR_KEYS.some(k=>typeof f.attrs[k]!=='number')) f.attrs=attrsFromNivel(f.nivel, styleOf(f), f.name); if(nivelFromAttrs(f.attrs)!==f.nivel) setNivel(f, f.nivel); return f; }
// Cambia el nivel de un freestyler desplazando sus cinco atributos por igual (conservan su forma) hasta que la media sea exactamente n
function setNivel(f, n){
  n=clamp(Math.round(n),1,99);
  if(!f.attrs || ATTR_KEYS.some(k=>typeof f.attrs[k]!=='number')){ f.attrs=attrsFromNivel(n, styleOf(f), f.name); f.nivel=n; return f; }
  const mean=ATTR_KEYS.reduce((s,k)=>s+f.attrs[k],0)/ATTR_KEYS.length; const d=n-mean;
  ATTR_KEYS.forEach(k=>f.attrs[k]=clamp(Math.round(f.attrs[k]+d),1,ATTR_MAX));
  for(let guard=0; guard<40 && nivelFromAttrs(f.attrs)!==n; guard++){   // el redondeo o el tope pueden desviar la media: se corrige
    const up=nivelFromAttrs(f.attrs)<n; const k=ATTR_KEYS.slice().sort((a,b)=>up? f.attrs[a]-f.attrs[b] : f.attrs[b]-f.attrs[a])[0]; f.attrs[k]=clamp(f.attrs[k]+(up?1:-1),1,ATTR_MAX); }
  f.nivel=n; return f;
}
function attrOf(f,k){ return (f && f.attrs && typeof f.attrs[k]==='number') ? f.attrs[k] : (f ? f.nivel : 50); }
function attrShown(f,k){ return Math.min(ATTR_SHOWN_MAX, Math.round(attrOf(f,k))); }   // para la interfaz: nunca por encima de 99
// Base de rendimiento en una ronda: media ponderada de los atributos según el tipo de ronda
function roundBase(f, rt){ const w=ROUND_WEIGHTS[rt]||ROUND_WEIGHTS.min; return ATTR_KEYS.reduce((s,k)=>s+attrOf(f,k)*w[k],0); }
function mentalFactor(f){ return clamp(MENTAL_VAR_BASE - attrOf(f,'mentalidad')*MENTAL_VAR_SLOPE, 0.5, 1.5); }

/* ---- jueces ---- */
function judgesByGroup(g){ return JUDGES.filter(j=>j.country===g); }
// Sortea los jueces de una liga para una temporada: 4 del país + 1 internacional (ligas sin país: 5 internacionales)
function pickJudges(key){
  const grp=JUDGE_GROUP[key]; const pool=grp ? judgesByGroup(grp) : [];
  const intl=judgesByGroup('Internacional').slice().sort(()=>Math.random()-0.5);
  const loc=pool.slice().sort(()=>Math.random()-0.5);
  const nIntl = pool.length ? JUDGES_INTL_PER_LEAGUE : JUDGES_PER_LEAGUE;
  return [...loc.slice(0, JUDGES_PER_LEAGUE-nIntl), ...intl.slice(0, nIntl)].sort(()=>Math.random()-0.5).map(j=>j.id);
}
function judgesOf(L){ if(!L) return pickJudges(null); if(!Array.isArray(L.judges) || L.judges.length!==JUDGES_PER_LEAGUE || L.judges.some(id=>!JUDGE_BY_ID[id])) L.judges=pickJudges(L.key); return L.judges; }
// Cuánto suma o resta un juez a la nota de un freestyler por sus gustos (escala 1-10)
function judgeTaste(j, f){ if(!j||!j.gustos) return 0; return Object.entries(j.gustos).reduce((s,[k,g])=>s+g*((attrOf(f,k)-50)/10)*JUDGE_TASTE_PER_10, 0); }
function judgeNoise(j){ const c=j ? clamp(j.consistencia,0,1) : 0.5; return JUDGE_NOISE_MAX-(JUDGE_NOISE_MAX-JUDGE_NOISE_MIN)*c; }
function judgeName(id){ const j=JUDGE_BY_ID[id]; return j ? j.name : `Juez ${id||''}`.trim(); }

function styleTag(f){ const st=styleOf(f); return `<span class="style-tag st-${st.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}" title="${esc(STYLES[st].txt)}">${st}</span>`; }
const FOREIGN_MULT = 1.25; // un extranjero cuesta un 25% más por viajes
function isForeign(f, key){ if(isWS(key)) return false; const d=ldef(key); return !!(d && d.countries && !d.countries.includes(f.country)); }
const STAR_SALARY = 0.15;  // cada estrella de la empresa: los freestylers piden un 15% más
function contractCost(f, key){ if(isWS(key)) return Math.round(contractCostBase(f,key)*0.5/100)*100; return contractCostBase(f,key); }
function contractCostBase(f, key){ const st=(state.company&&state.company.stars)||0; const nk=(typeof fxVal==='function') ? 1-fxVal(key,'salary') : 1; const base=salaryOf(f)*(1+STAR_SALARY*st)*(isForeign(f,key)?FOREIGN_MULT:1); const capped = f.name==='Walls' ? base : Math.min(SALARY_CAP, base); return Math.round(capped*nk/100)*100; }
const SALARY_CAP = 65000;   // nadie cobra más de 65K de sueldo (salvo Walls)
const UQ_SAL = {'Walls':1.6, 'Wos':1.15, 'Trueno':1.15, 'Duki':1.15, 'TiagoPZK':1.15, 'Jaloner':1.15, 'Lit Killah':1.15};
function salaryOf(f){
  const v = 0.6*f.nivel + 0.4*f.fama;
  const raw = (600 + Math.pow(Math.max(0,(v-35))/60, 2.3)*32000) * (f.legend ? LEGEND_MULT : 1) * 0.9 * (UQ_SAL[f.name]||1);
  return Math.round((f.name==='Walls' ? raw : Math.min(SALARY_CAP, raw))/100)*100;
}

/* =========================================================================
   ESTADO
========================================================================= */
const STORAGE_KEY = 'fms_ceo_v1';
let state = { company:null, freestylers:[], seasons:[], logos:{}, _counter:1, view:{name:'dashboard', params:{}}, ui:{} };
let _skipScrollRestore = false;
function uid(p){ return p + (state._counter++); }
function fby(id){ return state.freestylers.find(f=>f.id===id); }
function fname(id){ const f=fby(id); return f? f.name : '—'; }
function nameH(f){ return f ? esc(f.name) : '—'; }
function fnameH(id){ return nameH(fby(id)); }
function cur(){ return state.seasons[state.seasons.length-1]; }

function save(){
  try{
    const dump = {company:state.company, freestylers:state.freestylers, seasons:state.seasons, _counter:state._counter};
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dump, (k,v)=> (k==='img' && typeof v==='string' && (v.startsWith('data:') || v.startsWith('assets/'))) ? undefined : v));   // las fotos de los tuits se recuperan al pintar
    state.ui.saveFailed=false;
  }catch(e){
    if(!state.ui.saveFailed){ state.ui.saveFailed=true; setTimeout(()=>toast('No cabe más en el guardado del navegador (demasiadas imágenes). Exporta la partida para no perderla.'),50); }
  }
}
function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY); if(!raw) return false;
    const d = JSON.parse(raw); if(!d || !d.company) return false;
    state.company=d.company; state.freestylers=d.freestylers||[]; state.seasons=d.seasons||[]; state._counter=d._counter||1;
    state.seasons.forEach((s,i)=>{ const last=i===state.seasons.length-1;
      if(last && s.phase==='pre' && (!s.rb || !s.rb.drawn)) rbGenerateSchedule(s, state.seasons.slice(0,i));
      if(last && !s.under && s.phase!=='done') underGenerate(s, s.phase==='live'?s.day+1:0);
      else if(!s.rb) s.rb={off:true};
      if(last) Object.values(s.leagues||{}).forEach(L=>{ if(!L.finished) L.manual=true; }); });
    syncRealPool(); customFS().forEach(c=>{ if(!state.freestylers.some(f=>f.name.toLowerCase()===c.name.toLowerCase())) state.freestylers.push(customToF(c)); });
    return true;
  }catch(e){ return false; }
}

function newLeagueSeason(key, prev){
  return {
    key, competitors:[], contracts:{}, dates:[], rounds:[], played:0, finished:false,
    hype:0, lastEventDay:-14, finalStandings:[], relegated:[],
    blocked: prev && prev.leagues[key] ? (prev.leagues[key].relegated||[]).slice() : [],
    prevRoster: prev && prev.leagues[key] ? (prev.leagues[key].competitors||[]).slice() : [],
    prevHype: prev && prev.leagues[key] ? prev.leagues[key].hype : null,
    income:0, manual: true, confirmed:{},
    judges: pickJudges(key)
  };
}
function newSeason(prev){
  const year = prev ? prev.year+1 : 2027;
  const limit = maxLeagues(state.company.stars);
  const keys = prev ? [...natKeys(prev).slice(0, limit), ...(prev.activeKeys.includes(WS.key) && state.company.stars>=5 ? [WS.key] : [])] : [LEAGUES[0].key];
  const leagues = {}; keys.forEach(k=> leagues[k]=newLeagueSeason(k, prev));
  const season = {
    number: prev? prev.number+1 : 1, year, phase:'pre', day:0, format: prev && prev.format==='long' ? 'long' : 'short',
    activeKeys: keys, leagues,
    intlEnabled: !!(prev && prev.intlEnabled && keys.filter(k=>!isWS(k)).length>=4),
    intl:{date:null, sede:null, played:false, bracket:null, qualifiers:[], champion:null, runnerUp:null, third:null, fourth:null},
    defendingChampion: prev ? (prev.intl.champion || prev.defendingChampion || null) : null,
    log:[], fin:{salaries:0, income:0, production:0},
    repStart: state.company.reputation, starsStart: state.company.stars, moneyStart: state.company.money,
    summary:null
  };
  rbGenerateSchedule(season, state.seasons.slice()); underGenerate(season, 0);
  return season;
}
function ensureLeague(s, key){ if(!s.leagues[key]){ const prev = state.seasons[state.seasons.length-2]; s.leagues[key]=newLeagueSeason(key, prev); } return s.leagues[key]; }

/* =========================================================================
   EVENTOS / CALENDARIO
========================================================================= */
function seasonEvents(s){
  const evs=[];
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; if(!L) return;
    L.dates.slice().sort((a,b)=>a-b).forEach((d,i)=> evs.push({day:d, key:k, j:i+1}));
  });
  if(s.intlEnabled && s.intl.date!=null) evs.push({day:s.intl.date, key:INTL.key, j:null});
  return evs.sort((a,b)=>a.day-b.day);
}
function eventsByDay(s){ const m={}; seasonEvents(s).forEach(e=> m[e.day]=e); return m; }
function monthsWithEvents(s){ const set=new Set(); seasonEvents(s).forEach(e=> set.add(monthOf(s.year,e.day))); return set; }

function gapsFor(s, key){
  const ds = s.leagues[key].dates.slice().sort((a,b)=>a-b);
  const gaps=[]; let last=-14;
  ds.forEach(d=>{ gaps.push(d-last); last=d; });
  return gaps;
}
function gapClass(g){ return g<=GAP_OK ? 'g' : (g<=GAP_WARN ? 'y' : 'r'); }
function projectedHypeLoss(s, key){
  return gapsFor(s,key).reduce((acc,g)=>{ let loss=0; for(let x=1;x<=g;x++) loss+=decayRate(x); return acc+loss; },0);
}

function rostersComplete(s){ return s.activeKeys.length>0 && s.activeKeys.every(k=> s.leagues[k] && s.leagues[k].competitors.length===10); }
function lastNationalDay(s){ return Math.max(-1, ...natKeys(s).flatMap(k=> s.leagues[k] ? s.leagues[k].dates : [])); }
function clearSchedule(){
  const s=cur(); s.activeKeys.forEach(k=> s.leagues[k].dates=[]); s.intl.date=null; render();
}
function calClick(day){
  const s=cur();
  const byDay=eventsByDay(s); const ev=byDay[day];
  const rev=rbByDay(s)[day];
  if(rev){ if(s.phase==='pre') toast(`Ese día es la ${rbdef(rev.key).name}. No puedes poner una fecha ahí.`); else goto('redbull',{key:rev.key}); return; }
  const uev=underByDay(s)[day]; if(uev){ if(s.phase==='pre' && !ev) toast(`Ese día se juega la ${udef(uev.key).name}. No puedes poner una fecha ahí.`); else showUnder(uev.key, day); return; }
  if(s.phase!=='pre'){
    if(ev){ if(ev.key===INTL.key) goto('intl'); else { state.ui['jnav_'+ev.key]=ev.j-1; goto('league',{key:ev.key}); } }
    return;
  }
  if(!rostersComplete(s)){ toast('Primero completa los fichajes de todas las ligas (10 por liga).'); return; }
  if(ev){
    if(ev.key===INTL.key) s.intl.date=null;
    else { const L=s.leagues[ev.key]; L.dates.splice(L.dates.indexOf(day),1); }
    render(); return;
  }
  const tool = state.ui.calTool || s.activeKeys[0];
  if(tool===INTL.key){
    if(!s.intlEnabled){ toast('Activa el Internacional primero (necesitas 4 ligas).'); return; }
    const pend = natKeys(s).filter(k=> s.leagues[k].dates.length<JORNADAS);
    if(pend.length){ toast(`Antes pon todas las jornadas nacionales (falta ${ldef(pend[0]).name}).`); return; }
    const lastNat = lastNationalDay(s);
    if(day<=lastNat){ toast(`El Internacional tiene que ir después de la última jornada nacional (${fmtDay(s.year,lastNat)}).`); return; }
    s.intl.date=day; render(); return;
  }
  const L=s.leagues[tool]; if(!L) return;
  if(L.dates.length>=nJ(tool)){ toast(`${ldef(tool).name} ya tiene sus ${nJ(tool)} fechas. Quita una o elige otra liga.`); return; }
  if(isWS(tool)){ const ds=[...L.dates, day]; const a=Math.min(...ds), b=Math.max(...ds); const clash=natKeys(s).flatMap(k=>s.leagues[k].dates).find(x=>x>a && x<b);
    if(clash!=null){ toast(`Entre la J1 y la J5 de la World Series no puede haber jornadas nacionales (hay una el ${fmtDay(s.year,clash)}).`); return; } }
  else { const r=wsRange(s); if(r && day>r[0] && day<r[1]){ toast(`Esas fechas son de la FMS World Series (${fmtDay(s.year,r[0])} – ${fmtDay(s.year,r[1])}): no puede haber jornadas nacionales en medio.`); return; } }
  if(!isWS(tool) && s.intlEnabled && s.intl.date!=null && day>=s.intl.date){ toast(`Las jornadas nacionales tienen que ir antes del Internacional (${fmtDay(s.year,s.intl.date)}).`); return; }
  if(day<LU_RESERVED){ toast('Esa fecha no está disponible.'); return; }
  if(L.dates.some(x=>Math.abs(x-day)===1)){ toast(`${ldef(tool).name} ya tiene una fecha el día de al lado: deja al menos un día libre entre dos jornadas de la misma liga.`); return; }
  L.dates.push(day);
  if(L.dates.length===nJ(tool)){
    const next = s.activeKeys.find(k=> s.leagues[k].dates.length<nJ(k));
    if(next) state.ui.calTool=next; else if(s.intlEnabled && s.intl.date==null) state.ui.calTool=INTL.key;
  }
  render();
}

/* =========================================================================
   PRETEMPORADA
========================================================================= */
function toggleLeague(key){
  const s=cur(); if(s.phase!=='pre') return;
  const i=s.activeKeys.indexOf(key);
  if(i>=0){
    const L=s.leagues[key];
    if(L && L.competitors.length){ L.competitors.forEach(id=>{ state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; }); }
    if(L) spkRefundAll(s, L);
    s.activeKeys.splice(i,1); delete s.leagues[key];
    if(natKeys(s).length<4){ s.intlEnabled=false; s.intl.date=null; }
  } else {
    if(!isWS(key) && natKeys(s).length>=maxLeagues(state.company.stars)){ toast(`Con ${state.company.stars}★ puedes tener ${maxLeagues(state.company.stars)} liga(s) activa(s).`); return; }
    if(isWS(key) && (state.company.stars||0)<5){ toast('La FMS World Series se desbloquea con 5 estrellas.'); return; }
    if(isWS(key)){ const c=spState(); if(c.wsPool.length<3) sponsorOffers(state.company.stars||5, 4-c.wsPool.length, false, true); }
    s.activeKeys.push(key); s.activeKeys.sort((a,b)=> (isWS(a)?99:LEAGUES.findIndex(l=>l.key===a))-(isWS(b)?99:LEAGUES.findIndex(l=>l.key===b)));
    ensureLeague(s,key); preselectRoster(s,key);
  }
  render();
}
function toggleIntl(){
  const s=cur(); if(s.phase!=='pre') return;
  if(natKeys(s).length<4){ toast('El Internacional se desbloquea con 4 ligas activas.'); return; }
  s.intlEnabled=!s.intlEnabled; if(!s.intlEnabled) s.intl.date=null; render();
}
function signedLeagueOf(s, id){ return natKeys(s).find(k=> s.leagues[k] && s.leagues[k].competitors.includes(id)) || null; }
function toggleSign(key, id){
  const s=cur(); if(s.phase!=='pre') return;
  const L=s.leagues[key]; const f=fby(id);
  const i=L.competitors.indexOf(id);
  if(i>=0){
    L.competitors.splice(i,1); state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; delete L.contracts[id];
  } else {
    if(L.competitors.length>=10){ toast('La plantilla ya tiene 10 freestylers.'); return; }
    if(L.blocked.includes(id)){ toast(`${f.name} descendió de esta liga la temporada pasada: no puede volver hasta ${s.year+1}. Puedes ficharlo en otra liga.`); return; }
    if(isSpeakerId(s,id)){ toast(`${f.name} es host de ${ldef(speakerKeyOf(s,f.name)).name}: no puede estar en un line up.`); return; }
    const other=isWS(key)?null:signedLeagueOf(s,id); if(other){ toast(`${f.name} ya está fichado en ${ldef(other).name}.`); return; }
    const sal=contractCost(f,key);
    if(state.company.money < sal){ toast(`No te llega: ${f.name} pide ${money(sal)}${isForeign(f,key)?' (incluye viajes)':''}.`); return; }
    L.competitors.push(id); L.contracts[id]=sal; state.company.money -= sal; s.fin.salaries += sal;
  }
  render();
}
function preselectRoster(s, key){
  const L=s.leagues[key]; if(!L || L.competitors.length) return 0; let n=0;
  (L.prevRoster||[]).filter(id=> fby(id) && !L.blocked.includes(id) && !isSpeakerId(s,id) && (isWS(key) || !signedLeagueOf(s,id))).forEach(id=>{
    if(L.competitors.length>=10) return; const sal=contractCost(fby(id),key); if(state.company.money<sal) return;
    L.competitors.push(id); L.contracts[id]=sal; state.company.money-=sal; s.fin.salaries+=sal; n++; });
  return n;
}
function keepRoster(key){
  const s=cur(); const L=s.leagues[key];
  const ids=L.prevRoster.filter(id=> fby(id) && !L.blocked.includes(id) && !isSpeakerId(s,id) && !L.competitors.includes(id) && (isWS(key) || !signedLeagueOf(s,id)));
  let added=0, skipped=0;
  ids.forEach(id=>{
    if(L.competitors.length>=10) return;
    const sal=contractCost(fby(id),key);
    if(state.company.money<sal){ skipped++; return; }
    L.competitors.push(id); L.contracts[id]=sal; state.company.money-=sal; s.fin.salaries+=sal; added++;
  });
  toast(`Renovados ${added}${skipped? ` · ${skipped} no caben en el presupuesto`:''}.`);
  render();
}
function releaseAll(key){
  const s=cur(); const L=s.leagues[key];
  L.competitors.forEach(id=>{ state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; });
  L.competitors=[]; L.contracts={}; render();
}
function preseasonIssues(s){
  const issues=[];
  if(!natKeys(s).length) issues.push('Activa al menos una liga.');
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; const d=ldef(k);
    if(L.competitors.length<10) issues.push(`${d.name}: faltan ${10-L.competitors.length} fichajes.`);
    if(L.dates.length<nJ(k)) issues.push(`${d.name}: faltan ${nJ(k)-L.dates.length} fechas en el calendario.`);
    if(!spkList(L).length) issues.push(`${d.name}: falta elegir el host (speaker).`);
  });
  { const r=wsRange(s); if(r){ const c=natKeys(s).flatMap(k=>s.leagues[k].dates).find(x=>x>r[0]&&x<r[1]); if(c!=null) issues.push(`World Series: no puede haber jornadas nacionales entre su J1 y su J5 (${fmtDay(s.year,c)}).`); } }
  if(s.intlEnabled){
    if(!s.intl.sede) issues.push('Internacional: elige su sede.');
    if(s.intl.date==null) issues.push('Internacional: pon su fecha en el calendario.');
    else {
      const lastNat=lastNationalDay(s);
      if(s.intl.date<=lastNat) issues.push(`Internacional: debe ir después de la última jornada nacional (${fmtDay(s.year,lastNat)}).`);
    }
  }
  return issues;
}

/* =========================================================================
   LIGAS: round robin y clasificación
========================================================================= */
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function buildRoundRobin(ids){
  let list=ids.slice(); if(list.length%2) list.push(null);
  const total=list.length, half=total/2, rounds=[];
  for(let r=0;r<total-1;r++){
    const rm=[];
    for(let i=0;i<half;i++){ const a=list[i], b=list[total-1-i]; if(a!=null && b!=null) rm.push({id:uid('m'), a, b, result:null}); }
    rounds.push(rm);
    const fixed=list[0], rest=list.slice(1); rest.unshift(rest.pop()); list=[fixed,...rest];
  }
  return rounds;
}
function computeStandings(L){
  const t={}; L.competitors.forEach(id=> t[id]={id, pts:0, pj:0, v:0, vr:0, dr:0, d:0});
  L.rounds.flat().forEach(m=>{
    if(!m.result) return; const w=t[m.result.winner], l=t[m.result.loser]; if(!w && !l) return;
    if(w) w.pj++; if(l) l.pj++;
    if(m.result.tiebreak){ if(w){ w.vr++; w.pts+=2; } if(l){ l.dr++; l.pts+=1; } } else { if(w){ w.v++; w.pts+=3; } if(l) l.d++; }
  });
  // empate a puntos: decide quién ganó el enfrentamiento directo; si no se han enfrentado, da igual el orden
  const h2h={}; L.rounds.flat().forEach(m=>{ if(m.result) h2h[pairKey(m.a,m.b)]=m.result.winner; });
  return Object.values(t).sort((a,b)=>{ if(b.pts!==a.pts) return b.pts-a.pts;
    const w=h2h[pairKey(a.id,b.id)]; if(w===a.id) return -1; if(w===b.id) return 1; return 0; });
}
function intlSlotsPerLeague(n){ return n===4?4:(n===5?3:(n===6?2:0)); }

/* =========================================================================
   ENFRENTAMIENTOS: comprobar que una elección manual deja un calendario válido
   (cada pareja se enfrenta una sola vez en las 9 jornadas)
========================================================================= */
function pairKey(a,b){ return a<b ? a+'|'+b : b+'|'+a; }
function playedPairsOf(L){ const s=new Set(); L.rounds.slice(0,L.played).forEach(r=>r.forEach(m=>s.add(pairKey(m.a,m.b)))); return s; }
// Devuelve las rondas que faltan (la primera incluye las parejas fijadas) o null si no hay forma de cuadrarlas.
function solveRounds(players, used, fixed, nRounds){
  const n=players.length; const idx={}; players.forEach((p,i)=>idx[p]=i);
  for(let attempt=0; attempt<6; attempt++){
    const avail=players.map(()=>new Set());
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(!used.has(pairKey(players[i],players[j]))){ avail[i].add(j); avail[j].add(i); }
    const rounds=[]; let nodes=0; const budget=30000;
    let ok=true; const matched0=new Array(n).fill(false); const pairs0=[];
    for(const [a,b] of fixed){
      const i=idx[a], j=idx[b];
      if(i==null||j==null||matched0[i]||matched0[j]||!avail[i].has(j)){ return null; }
      matched0[i]=matched0[j]=true; avail[i].delete(j); avail[j].delete(i); pairs0.push([i,j]);
    }
    const matchRound=(matched,pairs,cb)=>{
      if(++nodes>budget) return false;
      let v=-1; for(let i=0;i<n;i++) if(!matched[i]){ v=i; break; }
      if(v<0) return cb(pairs);
      const opts=shuffle([...avail[v]].filter(u=>!matched[u]));
      for(const u of opts){
        matched[v]=matched[u]=true; avail[v].delete(u); avail[u].delete(v); pairs.push([v,u]);
        if(matchRound(matched,pairs,cb)) return true;
        pairs.pop(); avail[v].add(u); avail[u].add(v); matched[v]=matched[u]=false;
      }
      return false;
    };
    const build=(r)=>{
      if(r===nRounds) return true;
      const matched = r===0 ? matched0 : new Array(n).fill(false);
      const pairs = r===0 ? pairs0 : [];
      return matchRound(matched, pairs, p=>{ rounds[r]=p.slice(); if(build(r+1)) return true; return false; });
    };
    if(build(0)) return rounds.map(r=>r.map(([i,j])=>[players[i],players[j]]));
    if(nodes<=budget) return null; // búsqueda completa sin solución: imposible de verdad
  }
  return null;
}
function nextRoundEditable(L){ return !L.finished && L.rounds.length && !L.confirmed[L.played]; }
/* =========================================================================
   SIMULACIÓN
========================================================================= */
function addLog(s, day, text, type){ s.log.unshift({day, text, type:type||''}); if(s.log.length>200) s.log.length=200; }
function avgFama(ids){ return ids.length ? ids.reduce((a,id)=>a+fby(id).fama,0)/ids.length : 0; }

function styleVariety(ids){
  const c={}; ids.forEach(id=>{ const st=styleOf(fby(id)); c[st]=(c[st]||0)+1; });
  const n=Object.keys(c).length, max=Math.max(0,...Object.values(c));
  const rep=Object.entries(c).filter(([k,v])=>v>=4).map(([k])=>k);
  const bonus = rep.length ? -25 : Math.round(Math.max(0,n-3)*2.5);
  return {n, max, rep, bonus, counts:c};
}
function startSeason(){
  const s=cur(); const issues=preseasonIssues(s);
  if(issues.length){ toast(issues[0]); return; }
  const stars=state.company.stars;
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k];
    L.dates.sort((a,b)=>a-b);
    L.rounds= isWS(k) ? wsBuildRounds(L) : buildRoundRobin(shuffle(L.competitors));
    let h = 30 + avgFama(L.competitors)*0.35 + stars*3;
    if(L.prevHype!=null) h += (L.prevHype-50)*0.2;
    const sv=styleVariety(L.competitors); h += sv.bonus; L.styleVar=sv;
    if(isWS(k)){ const nc={}; L.competitors.forEach(id=>{ const c=fby(id).country; nc[c]=(nc[c]||0)+1; }); const rep4=Object.entries(nc).filter(([c,v])=>v>=4).map(([c])=>c);
      if(rep4.length){ L.competitors.forEach(id=>{ const f=fby(id); f.hype=Math.round(clamp((f.hype||50)*0.9,1,99)*10)/10; });
        addLog(s, 0, `${WS.name}: la comunidad se queja de que el cartel tiene demasiados de ${rep4.join(' y ')}. La plantilla pierde un 10% de hype.`, 'bad'); } }
    const sk=state.freestylers.find(f=>f.name==='Skone'); L.skoneMx=false;
    if(k==='fms_mexico' && sk && L.competitors.includes(sk.id)){ sk.hype=99; L.skoneMx=true; addLog(s, 0, '🇲🇽 Skone llega a FMS México y revienta las redes: hype al máximo, +10% de taquilla en la liga y sus batallas tendrán un 10% más de visitas.', 'gold'); }
    if(sv.rep.length){ L.competitors.forEach(id=>{ const f=fby(id); f.hype=Math.round(clamp((f.hype||50)*0.8,1,99)*10)/10; });
      addLog(s, 0, `${ldef(k).name}: demasiados ${sv.rep.join(' y ')} en el cartel. El público lo ve repetitivo: la liga arranca con mucho menos hype y la plantilla pierde un 20%.`, 'bad'); }
    else if(sv.bonus>0) addLog(s, 0, `${ldef(k).name}: cartel variado (${sv.n} estilos distintos), +${sv.bonus} de hype de salida.`, 'good');
    L.hype = clamp(Math.round(h),5,95);
    L.lastEventDay = -14; L.played=0; L.finished=false;
  });
  s.phase='live'; s.day=0; state.ui.calMonth=null;
  rbDraw(s);
  s.repStart=state.company.reputation; s.starsStart=state.company.stars;
  addLog(s, 0, `Arranca la temporada ${s.year} con ${s.activeKeys.length} liga(s)${s.intlEnabled?' + Internacional':''}.`, 'gold');
  goto('dashboard');
}

/* ---------- Hype de freestylers ---------- */
const HYPE_STREAK = 0.6;    // por victoria: 0,6 × racha (1ª +0,6, 2ª +1,2, 3ª +1,8…)
const LEGEND_HYPE = 1.5;   // las leyendas ganan un 50% más de hype
function absDay(){ const s=cur(); return s? s.year*366+(s.day||0) : 0; }
function addHype(id, n){ const f=fby(id); if(!f||!n) return; if(n>0 && f.legend) n*=LEGEND_HYPE; f.hype=Math.round(clamp((f.hype||50)+n,1,99)*10)/10; }
function hypeOf(id){ const f=fby(id); return f? Math.round(f.hype||0) : 0; }
function isUpset(W, Lo){ return (Lo.nivel-W.nivel)>=8 || (Lo.legend && !W.legend && Lo.nivel>W.nivel); }
function battleHype(W, Lo){
  W.lastB=Lo.lastB=absDay();
  W.streak=(W.streak||0)+1; Lo.streak=0;
  let g=Math.min(HYPE_STREAK*W.streak, 6);
  if(isUpset(W,Lo)) g += 2 + Math.max(0,Lo.nivel-W.nivel)*0.35 + (Lo.legend?3:0);
  addHype(W.id, g);
}
// premios de hype por competiciones (final, título y finales "imposibles")
function finalHype(champ, runner, big){
  const C=fby(champ), R=fby(runner); if(!C||!R) return '';
  addHype(runner, big?8:3);
  addHype(champ, big?14:6);
  if(isUpset(C,R)){ const extra=(big?14:8)+Math.max(0,R.nivel-C.nivel)*0.6; addHype(champ, extra); return ` ¡Final sorpresa! ${C.name} dispara su hype.`; }
  return '';
}
function simulateBattle(m, bonus){
  const A=fby(m.a), B=fby(m.b);
  const na=A.nivel+(bonus?bonus(A.id):0), nb=B.nivel+(bonus?bonus(B.id):0);
  const pA = 1/(1+Math.pow(10,(nb-na)/18));
  const aWins = Math.random()<pA;
  const W=aWins?A:B, Lo=aWins?B:A;
  const diff=Math.abs(A.nivel-B.nivel);
  const tiebreak = Math.random() < (diff<6?0.32:(diff<12?0.2:0.1));
  m.result={winner:W.id, loser:Lo.id, tiebreak};
  battleHype(W, Lo);
  return {upset: (Lo.nivel-W.nivel)>=10, tiebreak, W, Lo};
}

function runLeagueJornada(s, L, d){
  const def=ldef(L.key); const stars=state.company.stars;
  const round=L.rounds[L.played]; const jn=L.played+1;
  let replicas=0, upsets=0, highlight=null;
  const ord=isWS(L.key) ? noBackToBack(jornadaOrder(round), round) : jornadaOrder(round); if(!L.ord) L.ord=[]; L.ord[L.played]=ord;
  WS_SHORT = isWS(L.key);
  const zk=uqZaskoRoll(s, L);
  if(isWS(L.key) && L.wsSede && L.wsSede[L.played]){ const sd=L.wsSede[L.played]; round.forEach(m=>[m.a,m.b].forEach(id=>{ const f=fby(id); if(f && f.country===sd) UQ_PERF[id]=(UQ_PERF[id]||0)+LOCAL_BONUS; })); }   // Zasko: buen o mal día (se sabe al día siguiente)
  ord.forEach(([i])=>{ const m=round[i]; if(m.postponed || !m.b) return;
    const r=simulateFMSBattle(m, fxVal(L.key,'nivel')+spkLv(L.key), judgesOf(L));
    if(r.tiebreak) replicas++;
    if(r.upset){ upsets++; if(!highlight) highlight=`sorpresa: ${r.W.name} tumba a ${r.Lo.name}`; }
  });
  if(!highlight && replicas) { const m=round.find(x=>x.result && x.result.tiebreak); highlight=`${fname(m.result.winner)} gana a ${fname(m.result.loser)} en réplica`; }
  const prime=isPrimeDay(s.year,d) || leagueHasFx(L.key,'weekday');
  const income = Math.round((isWS(L.key)?2.2:1) * (L.skoneMx?1.1:1) * ((L.key==='fms_chile'||L.key==='fms_mexico')?1.3:1) * (5000 + avgFama(L.competitors)*110) * (0.35 + L.hype/70) * (1+0.06*stars) * (prime?1:WEEKDAY_TICKET) * TICKET_MULT * (1+fxVal(L.key,'ticket')));
  const vmBase=0.8*(isWS(L.key)?1.6:1)*(1+0.08*stars)*(1+fxVal(L.key,'views'))*(leagueHasFx(L.key,'nivel')?1.03:1);
  const vm=vmBase*(isWS(L.key)?0.4:0.7);
  UQ_PERF={};
  SPK_BH=spkVal(L.key,'bhype'); RIVAL_DEFER=true; round.forEach(m=>{ m.views = (m.postponed||!m.b) ? 0 : Math.round(battleViews(m, vm)*uqViewMult(s,L,m,zk)); }); RIVAL_DEFER=false;
  round.forEach((m,mi)=>{ if(m.views && isRival(m.a,m.b) && Math.random()<0.75) uqPush(s, {day:d+1, type:'rival', key:L.key, j:L.played, mi, a:m.a, b:m.b, w:m.result&&m.result.winner, v:rint(0,13)}); });
  const fx = L.fexhib && L.fexhib[L.played];
  if(fx && fby(fx.a) && fby(fx.b)){ const m=fx.m={id:uid('x'), a:fx.a, b:fx.b, result:null, ex:true, forced:true}; simulateFMSBattle(m, (leagueHasFx(L.key,'nivel')?2:0)+spkLv(L.key), judgesOf(L)); m.views=Math.round(battleViews(m, vmBase)*exViewMult(m)); }
  const ex = L.exhib && L.exhib[L.played];
  if(ex && fby(ex.a) && fby(ex.b)){
    const m=ex.m={id:uid('x'), a:ex.a, b:ex.b, result:null, ex:true};
    simulateFMSBattle(m, (leagueHasFx(L.key,'nivel')?2:0)+spkLv(L.key), judgesOf(L)); m.views=Math.round(battleViews(m, vmBase)*exViewMult(m));
    const all=round.filter(r=>r.result).flatMap(r=>ptbOf(r)); const avg=all.reduce((a,x)=>a+x,0)/Math.max(1,all.length); const p=ptbOf(m);
    ex.good=[p[0]>=avg*0.97 || (m.result.winner===m.a && p[0]>=avg*0.9), p[1]>=avg*0.97 || (m.result.winner===m.b && p[1]>=avg*0.9)];
    if(!s.exEvents) s.exEvents=[];
    s.exEvents.push({day:d+7, key:L.key, j:L.played, ids:[ex.a,ex.b], good:ex.good.slice(), done:false});
  }
  WS_SHORT=false; SPK_BH=0;
  const views = round.reduce((a,m)=>a+m.views,0) + (ex&&ex.m ? ex.m.views : 0) + (fx&&fx.m ? fx.m.views : 0);
  uqAfterJornada(s, L, round, d, zk);
  const viewsIncome = Math.round(views*VIEW_RATE);
  // MVP: más puntos sumando los 5 jueces
  let mvp=null; round.forEach(m=>{ const p=ptbOf(m); if(!p) return; [[m.a,p[0]],[m.b,p[1]]].forEach(([id,pts])=>{ if(!L.competitors.includes(id)) return; if(!mvp||pts>mvp.pts) mvp={id,pts}; }); });
  if(!L.mvps) L.mvps=[]; L.mvps[L.played]=mvp;
  if(mvp && leagueHasFx(L.key,'mvp')){ addFama(mvp.id,2); addHype(mvp.id,4); }
  { const hv=fxVal(L.key,'hype'); if(hv) L.competitors.forEach(id=>addHype(id,hv)); }
  const spon = sponsorIncome(L.key);
  const cost = Math.round((7600 + 1000*stars + 500*(s.activeKeys.length-1)) * (1-fxVal(L.key,'prod')));   // producción: más cara cuanto más grande es la empresa
  state.company.money += income + viewsIncome + spon - cost;
  s.fin.sponsors=(s.fin.sponsors||0)+spon;
  s.fin.income += income + viewsIncome + spon; s.fin.views=(s.fin.views||0)+viewsIncome; s.fin.production += cost; L.income += income + viewsIncome;
  const rep = Math.round(L.hype/8 + replicas + upsets) + fxVal(L.key,'rep');
  state.company.reputation += rep;
  const hypeGain = 5 + replicas*1.5 + upsets*2;
  L.hype = clamp(L.hype + hypeGain, 0, 100);
  scheduleStream(s, L.key, L.played, d);
  L.played++; L.lastEventDay=d;
  addLog(s, d, `<b>${def.name} · J${jn}</b>: ${highlight||'5 batallas sin sorpresas'}. MVP ${mvp?fname(mvp.id):'—'}. Taquilla ${moneyK(income)}${prime?'':' (entre semana)'}, ${fmtViews(views)} visitas (${moneyK(viewsIncome)})${spon?`, patrocinios ${moneyK(spon)}`:''}, +${rep} rep.`, 'good');
  if(L.played>=nJ(L.key)){
    L.finished=true;
    L.finalStandings=computeStandings(L).map(r=>r.id);
    L.relegated= isWS(L.key) ? [] : L.finalStandings.slice(-2);
    addHype(L.finalStandings[0], 6); addHype(L.finalStandings[1], 2); try{ chGenerate(s, L.key); }catch(e){ console.error(e); }
    addLog(s, d, `🏆 <b>${fname(L.finalStandings[0])}</b> campeón de ${def.name}.${L.relegated.length?` Descienden ${L.relegated.map(fname).join(' y ')}.`:''}`, 'gold');
  }
}

/* --- clasificación al Internacional (mismo sistema que el gestor original) --- */
function bestOf(ids, s){
  // desempate para comodines: puntos en su liga, luego nivel
  const pts={};
  natKeys(s).forEach(k=>{ computeStandings(s.leagues[k]).forEach(r=> pts[r.id]=r.pts); });
  return ids.slice().sort((a,b)=> (pts[b]||0)-(pts[a]||0) || fby(b).nivel-fby(a).nivel);
}
function intlQualifiers(s){
  const keys=natKeys(s); const n=keys.length;
  const st=k=> s.leagues[k].finalStandings;
  if(n===4){ const out=[]; for(let p=0;p<4;p++) keys.forEach(k=> out.push(st(k)[p])); return {ids:out, note:'Top 4 de cada liga.'}; }
  if(n===5){
    const out=[]; for(let p=0;p<3;p++) keys.forEach(k=> out.push(st(k)[p]));
    const wc=bestOf(keys.map(k=>st(k)[3]), s)[0]; out.push(wc);
    return {ids:out, note:`Top 3 de cada liga + comodín: ${fname(wc)} (mejor cuarto).`, wildcards:[wc]};
  }
  // 6 ligas: top 2 (12) + cupo de campeón + 3 comodines entre terceros
  const D=s.defendingChampion; const top2=[]; keys.forEach(k=>{ top2.push(st(k)[0], st(k)[1]); });
  let dKey=null, dPos=null;
  if(D) keys.forEach(k=>{ const i=st(k).indexOf(D); if(i>=0 && dKey==null){ dKey=k; dPos=i; } });
  let extra=null, exclude=null, note='';
  if(dKey!=null && dPos<=1){ extra=st(dKey)[2]; exclude=dKey; note=`El campeón vigente ya entró por su liga; ${fname(extra)} (3º de ${ldef(dKey).short}) ocupa su cupo.`; }
  else if(D){ extra=D; if(dKey!=null && dPos===2) exclude=dKey; note=`Cupo de campeón vigente: ${fname(D)}.`; }
  const pool = keys.filter(k=>k!==exclude).map(k=>st(k)[2]).filter(id=> id && id!==extra);
  const need = 16 - top2.length - (extra?1:0);
  const wcs = bestOf(pool, s).slice(0, need);
  const out=[...top2]; if(extra) out.push(extra); out.push(...wcs);
  return {ids:out, note:`Top 2 de cada liga. ${note} Comodines (mejores terceros): ${wcs.map(fname).join(', ')}.`, wildcards:wcs};
}
function runIntl(s, d){
  const stars=state.company.stars;
  const q = s.intl.order ? {ids:s.intl.qualifiers, note:s.intl.note} : intlQualifiers(s);
  if(!s.intl.spkDone) intlSpkAuto(s);
  const sb=sedeBonus(s.intl.sede), slv=spkLv(INTL.key); SPK_BH=spkVal(INTL.key,'bhype');
  const ko=runKnockout(s.intl.order||shuffle(q.ids), (sb||slv)? (id=>(sb?sb(id):0)+slv) : null, 1.8*0.4*(1+0.08*stars)*(s.intl.lu? 1+s.intl.lu.delta/100 : 1)*(1+spkVal(INTL.key,'views'))); SPK_BH=0; { const fin=ko.bracket.rounds[ko.bracket.rounds.length-1][0]; fin.views=Math.round(fin.views*1.15*1.5); }   // Inter -60%, final -40%
  s.intl.bracket=ko.bracket; uqViral(s, ko.bracket, 'fms', d);
  { const B=ko.bracket; const chk=(m,ri,mi)=>{ if(!m||!m.result||!isRival(m.a,m.b)) return; const w=m.result.winner, l=m.result.loser; const sd=s.intl.sede;
      const loc=fby(w).country===sd && fby(l).country!==sd; if(loc || Math.random()<0.75) uqPush(s, {day:d+1, type:'rival', comp:'fms', key:INTL.key, ri, mi, a:m.a, b:m.b, w, v: loc?14:rint(0,13)}); };
    B.rounds.forEach((r,ri)=>r.forEach((m,mi)=>chk(m,ri,mi))); chk(B.third,'third',0); } uqLocalismo(s, q.ids, s.intl.sede, 'fms', d, ko.champion); s.intl.played=true; s.intl.qualifiers=q.ids; s.intl.note=q.note;
  s.intl.champion=ko.champion; s.intl.runnerUp=ko.runnerUp; s.intl.third=ko.third; s.intl.fourth=ko.fourth; try{ icGenerate(s); }catch(e){ console.error(e); }
  const avgH = s.activeKeys.reduce((a,k)=>a+s.leagues[k].hype,0)/s.activeKeys.length;
  const prime=isPrimeDay(s.year,d);
  const income=Math.round((40000 + avgFama(q.ids)*400) * (0.5 + avgH/100) * (1+0.12*stars) * (prime?1:WEEKDAY_TICKET) * TICKET_MULT);
  const vb=ko.bracket.rounds.flat().concat([ko.bracket.third]);
  const views=vb.reduce((a,m)=>a+(m.views||0),0); const viewsIncome=Math.round(views*VIEW_RATE);
  const hypeNote=finalHype(ko.champion, ko.runnerUp, true);
  const cost=40000 + 12000*stars;
  state.company.money += income+viewsIncome-cost; s.fin.income+=income+viewsIncome; s.fin.views=(s.fin.views||0)+viewsIncome; s.fin.production+=cost; s.intl.income=income+viewsIncome;
  const rep=25 + Math.round(avgH/10); state.company.reputation+=rep;
  addLog(s, d, `🌎 <b>${fname(s.intl.champion)}</b> gana el ${INTL.name}${s.intl.sede?' en '+s.intl.sede:''} ante ${fname(s.intl.runnerUp)}. Taquilla ${moneyK(income)}, ${fmtViews(views)} visitas (${moneyK(viewsIncome)}), +${rep} rep.${hypeNote}`, 'gold');
}

function monthEnd(s, m){
  // leyendas que llevan mucho sin batallar: la gente las echa de menos
  const now=s.year*366+dateToDay(s.year,m+1,0);
  state.freestylers.forEach(f=>{ if(!f.legend) return; if(f.lastB==null) f.lastB=now-30; const idle=now-f.lastB; if(idle>=90) addHype(f.id, idle>=180?2:1); });
  const months=monthsWithEvents(s);
  if(!months.has(m)){
    const pen = 8 + 2*state.company.stars;
    state.company.reputation = Math.max(0, state.company.reputation - pen);
    s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L.finished) L.hype=clamp(L.hype-4,0,100); });
    addLog(s, dateToDay(s.year,m+1,0), `Mes vacío en ${MESES[m].toLowerCase()}: la competencia se queda con tu público (−${pen} rep).`, 'bad');
  }
}

function simulateDay(auto){
  const s=cur(); if(s.phase!=='live') return null;
  const d=s.day, y=s.year, diy=daysInYear(y);
  if(!s.uqInit){ s.uqInit=true; uqSeasonStart(s); }
  // eventos únicos pendientes
  const uq=(s.uq||[]).find(x=>!x.done && x.day<=d);
  if(uq){ if(!uq.applied){ uq.applied=true; uqApply(s, uq); } if(auto) uqAuto(s, uq); else if(!uq.done || uq.show) return {pause:'uq', uq}; }
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(L && L.pendingRep && L.pendingRep.length){ if(auto) uqAutoReplace(s,k); else return {pause:'replace', key:k}; } }
  const st=(s.streams||[]).find(x=>!x.done && x.day===d);
  if(st){ applyStream(s, st); if(!auto) return {pause:'stream', st}; }
  // exhibiciones: 7 días después, la comunidad opina
  const xe=(s.exEvents||[]).find(x=>!x.done && x.day<=d);
  if(xe){ applyExhibEvent(s, xe); if(!auto) return {pause:'exhib', xe}; }
  if(rbNeedsVote(s,d)) return {pause:'vote'};
  // revelación del line up: 15 días antes de la J1 de cada liga
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || L.played>0 || (L.lu && L.lu.shown)) continue;
    const nd=L.dates.slice().sort((a,b)=>a-b)[0]; if(nd==null || d<nd-LU_DAYS) continue;
    if(!L.lu) luGenerate(s, k);
    if(auto) L.lu.shown=true; else return {pause:'lineup', key:k}; }
  if(s.intlEnabled && s.intl.date!=null && !s.intl.played && !(s.intl.lu && s.intl.lu.shown) && natKeys(s).every(k=>s.leagues[k].finished)){
    if(!s.intl.lu) luGenerate(s, INTL.key);
    if(auto) s.intl.lu.shown=true; else return {pause:'lineup', key:INTL.key}; }
  if(s.intlEnabled && s.intl.date!=null && !s.intl.played && s.intl.lu && s.intl.lu.shown && !s.intl.spkDone && natKeys(s).every(k=>s.leagues[k].finished)){
    if(auto || !intlSpkCands(s).length) intlSpkAuto(s); else return {pause:'ispk'}; }
  // los cruces de cada jornada tienen que estar elegidos 10 días antes
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || !L.manual || L.confirmed[L.played]) continue;
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null && d>=nd-PAIR_DEADLINE) return {pause:true, key:k, j:L.played+1, day:nd}; }
  // al día siguiente del límite de cruces: los enfrentamientos se hacen oficiales en redes
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || !L.confirmed[L.played]) continue; const j=L.played;
    const nd=L.dates.slice().sort((a,b)=>a-b)[j]; if(nd==null || d<nd-PAIR_DEADLINE+1 || d>=nd || (L.pv && L.pv[j] && L.pv[j].shown)) continue;
    if(!L.pv || !L.pv[j]) pvGenerate(s, k, j);
    if(auto) L.pv[j].shown=true; else return {pause:'pairs', key:k, j}; }
  // 3 días antes de cada jornada: un 3% de que alguien enferme
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || isWS(k) || L.played>=JORNADAS-1) continue; if(!L.illChk) L.illChk={};
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd==null || d<nd-3 || L.illChk[L.played]) continue; L.illChk[L.played]=true;
    const round=L.rounds[L.played]; if(!round || round.some(x=>x.postponed) || Math.random()>=0.03) continue;
    const opts=[]; round.forEach((m,mi)=>{ if(m.ep) return; opts.push([mi,m.a],[mi,m.b]); }); if(!opts.length) continue;
    const [mi,fid]=opts[Math.floor(Math.random()*opts.length)];
    const u=uqPush(s, {day:d, type:'unavail', key:k, j:L.played, mi, fid, jday:nd, why:'se ha puesto enfermo'}); u.applied=true; uqApply(s,u); if(auto) uqAuto(s,u); else return {pause:'uq', uq:u}; }
  // 5 días antes de cada jornada: ¿falla alguien?
  for(const k of s.activeKeys){ const L=s.leagues[k]; if(!L || L.finished || isWS(k) || L.played>=JORNADAS-1) continue; if(!L.uaChk) L.uaChk={};
    const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd==null || d<nd-5 || L.uaChk[L.played]) continue;
    L.uaChk[L.played]=true; uqCheckUnavailable(s, L, nd);
    const u=(s.uq||[]).find(x=>!x.done && x.day<=d); if(u){ u.applied=true; uqApply(s,u); if(auto) uqAuto(s,u); else return {pause:'uq', uq:u}; } }
  const u0=underByDay(s)[d];
  if(u0 && !u0.presented){ if(auto) u0.presented=true; else return {pause:'under', key:u0.key, day:d}; }
  const rb0=rbByDay(s)[d];
  if(rb0 && !rbEvent(s,rb0.key).presented){ if(auto) rbEvent(s,rb0.key).presented=true; else return {pause:'rb', key:rb0.key}; }
  const ev0=eventsByDay(s)[d];
  if(ev0 && ev0.key!==INTL.key){ const L0=s.leagues[ev0.key]; if(L0.manual && !L0.confirmed[L0.played]) return {pause:true, ...ev0};
    if(!L0.shown) L0.shown={}; if(!L0.shown[L0.played]){ if(auto) L0.shown[L0.played]=true; else return {pause:'fms', key:ev0.key}; } }
  if(ev0 && ev0.key===INTL.key && !s.intl.presented){ if(auto) s.intl.presented=true; else return {pause:'rb', key:INTL.key}; }
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; if(L.finished) return;
    L.hype = clamp(L.hype - decayRate(d - L.lastEventDay - spkVal(k,'gap')), 3, 100);
  });
  const ev=eventsByDay(s)[d];
  if(ev){ if(ev.key===INTL.key) runIntl(s,d); else runLeagueJornada(s, s.leagues[ev.key], d); }
  const rev=rbByDay(s)[d];
  if(rev){ if(rev.key===RB_INT.key) runRBInter(s,d); else runRBEvent(s, rbEvent(s,rev.key), d); }
  const uev=underByDay(s)[d]; if(uev && !uev.played) runUnder(s, uev, d);
  if(d===diy-1 || monthOf(y,d+1)!==monthOf(y,d)) monthEnd(s, monthOf(y,d));
  s.day++;
  if(s.day>=diy) endSeason(s);
  return ev||rev||null;
}
function advance(mode){
  const s=cur(); if(s.phase!=='live') return;
  const played=[]; const startMonth=monthOf(s.year,s.day);
  let guard=0;
  while(s.phase==='live' && guard++<400){
    const ev=simulateDay(mode==='year');
    if(ev && ev.pause==='uq'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showUQ(ev.uq); return;
    }
    if(ev && ev.pause==='pairs'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openPairs(ev.key, ev.j); return;
    }
    if(ev && ev.pause==='lineup'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openLineup(ev.key); return;
    }
    if(ev && ev.pause==='ispk'){ render(); state.ui.ispk=[]; showIntlSpeakers(); return; }
    if(ev && ev.pause==='replace'){ render(); showReplace(ev.key); return; }
    if(ev && ev.pause==='exhib'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showExhibEvent(ev.xe); return;
    }
    if(ev && ev.pause==='stream'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); showStream(ev.st); return;
    }
    if(ev && ev.pause==='fms'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openFMSShow(ev.key); return;
    }
    if(ev && ev.pause==='under'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); if(ev.key===MFU.key) openMFU(ev.day); else openRBShow(ev.key); return;
    }
    if(ev && ev.pause==='rb'){
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); openRBShow(ev.key); return;
    }
    if(ev && ev.pause==='vote'){
      toast(played.length? `Se jugaron ${played.length} fecha(s). Se abre la votación de Red Bull.` : 'Se abre la votación de comodines de Red Bull.');
      if(state.view.name==='calendar') state.ui.calMonth=monthOf(s.year,s.day);
      render(); setTimeout(showRBVote,30); return;
    }
    if(ev && ev.pause){
      if(played.length) toast(`Se jugaron ${played.length} fecha(s). Ahora toca elegir los enfrentamientos de la J${ev.j} de ${ldef(ev.key).name}.`);
      else toast(`Quedan ${Math.max(0,(ev.day!=null?ev.day:s.day)-s.day)} días para la J${ev.j} de ${ldef(ev.key).name}: elige los enfrentamientos (hay que tenerlos ${PAIR_DEADLINE} días antes).`);
      goto('league',{key:ev.key}); return;
    }
    if(ev) played.push(ev);
    if(mode==='day') break;
    if(mode==='event' && ev) break;
  }
  if(state.view.name==='calendar' && s.phase==='live') state.ui.calMonth=monthOf(s.year,s.day);
  if(s.phase==='done'){ render(); showSummary(); return; }
  if(played.length===1){ const e=played[0]; toast(e.key===INTL.key? `Se jugó el ${INTL.name}.` : (isRB(e.key)? `Se jugó la ${rbdef(e.key).name}: gana ${fname(rbEvent(s,e.key).champion)}.` : `Se jugó la J${e.j} de ${ldef(e.key).name}.`)); }
  else if(played.length>1) toast(`Se jugaron ${played.length} fechas.`);
  render();
}

function endSeason(s){
  s.phase='done';
  const avgH = s.activeKeys.reduce((a,k)=>a+s.leagues[k].hype,0)/Math.max(1,s.activeKeys.length);
  const bonus=Math.round(avgH/5);
  state.company.reputation += bonus;
  const before=state.company.stars;
  state.company.stars = Math.min(5, before+1);   // una estrella por temporada completada
  if(state.company.stars>before){ const offers=sponsorOffers(state.company.stars, 3+state.company.stars); s.newSponsorOffers=offers.length; }
  // evolución de freestylers
  const signed=new Set(s.activeKeys.flatMap(k=>s.leagues[k].competitors));
  state.freestylers.forEach(f=>{
    setNivel(f, clamp(f.nivel + rnd(-3,4), 35, 97));
    if(!signed.has(f.id)) f.fama = Math.round(clamp(f.fama - 1, 5, 99));
  });
  s.activeKeys.forEach(k=>{
    const st=s.leagues[k].finalStandings;
    st.forEach((id,i)=>{ const f=fby(id); const delta = i===0?8:(i<3?4:(i>=st.length-2 && !isWS(k)?-3:1)); f.fama=Math.round(clamp(f.fama+delta,5,99)); });
  });
  if(s.intl.champion){ const f=fby(s.intl.champion); f.fama=Math.round(clamp(f.fama+12,5,99)); }
  s.summary = {
    bonus, avgHype:Math.round(avgH), starsBefore:before, starsAfter:state.company.stars,
    repDelta: state.company.reputation - s.repStart,
    income:s.fin.income, views:s.fin.views||0, sponsors:s.fin.sponsors||0, salaries:s.fin.salaries, production:s.fin.production,
    emptyMonths: 12 - monthsWithEvents(s).size
  };
  addLog(s, daysInYear(s.year)-1, `Fin de la temporada ${s.year}. ${state.company.stars>before?'Subes a '+state.company.stars+'★.':(state.company.stars<before?'Bajas a '+state.company.stars+'★.':'Te mantienes en '+state.company.stars+'★.')}`, 'gold');
}
function showTutorial(t){
  const c=state.company;
  const body = t==='inf' ? `<div class="tut-icon">♾️</div><h3>¡Modo infinito desbloqueado!</h3>
      <p>Has completado una temporada con <b>5 estrellas</b>. A partir de ahora juegas en modo sandbox: sin límite de temporadas y con todo el juego abierto.</p>
      <p><b>Todos los competidores están desbloqueados</b>: los que antes rechazaban estar en la FMS o hacer exhibiciones ahora aceptan siempre.</p>
      <p class="tut-warn">Bueno… casi todos. Papo sigue siendo Papo.</p>`
    : t==='s2' ? `<div class="tut-icon">⭐</div><h3>¡Has ganado tu primera estrella!</h3>
      <p>Empieza la temporada 2. Con cada estrella tu empresa crece: ahora puedes tener <b>${maxLeagues(c.stars)} FMS activas</b> a la vez y cada liga admite <b>3 patrocinadores</b>.</p>
      <p>Abre la nueva liga desde <b>Ligas</b>, ficha a su plantilla y colócala en el calendario.</p>
      <p class="tut-warn">⚠️ Ojo: si repites las mismas batallas temporada tras temporada, la gente se cansa y esas batallas tendrán cada vez menos visitas. Renueva los carteles.</p>`
    : `<div class="tut-icon">🌎</div><h3>¡Has desbloqueado la FMS Internacional!</h3>
      <p>Con ${c.stars} estrellas puedes tener <b>4 FMS activas</b>, y con 4 ligas se abre la <b>FMS Internacional</b>: los mejores de cada liga se clasifican y se juega en eliminatorias en la sede que elijas.</p>
      <p>Actívala en el menú de la temporada, elige sede y ponle fecha después de la última jornada nacional. Es el evento que más taquilla y visitas deja.</p>`;
  openModal(`<div class="tut">${body}</div><div class="modal-actions"><button class="btn primary" onclick="closeModal()">Entendido</button></div>`);
}
function nextSeason(){
  const prev=cur(); if(prev.phase!=='done') return;
  state.seasons.slice(0,-1).forEach(o=>{ Object.values(o.leagues||{}).forEach(L=>(L.rounds||[]).flat().forEach(m=>{ if(m.d) delete m.d.s; })); });
  state.seasons.slice(0,-1).forEach(o=>{ Object.values(o.leagues||{}).forEach(L=>{ if(L.lu) delete L.lu.tweets; delete L.pv; if(L.champTw) delete L.champTw.tweets; }); if(o.intl && o.intl.lu) delete o.intl.lu.tweets; });   // los tuits de temporadas pasadas no se guardan
  state.seasons.push(newSeason(prev)); state.ui.calMonth=null;
  { const ns=cur(); ns.activeKeys.forEach(k=>preselectRoster(ns,k)); if(ns.activeKeys.includes(WS.key)){ const c=spState(); if(c.wsPool.length<3) sponsorOffers(state.company.stars||5, 3-c.wsPool.length, false, true); } }
  Object.keys(state.ui).filter(x=>/^(jnav_|exA_|exB_|exQ_|draft_)/.test(x)).forEach(x=>delete state.ui[x]);
  { const c=state.company; if(!c.tut) c.tut={};
    if(prev.starsStart>=5 && !c.infinite){ c.infinite=true; c.tut.inf=true; state.ui.pendingTut='inf'; }
    else if(c.stars>=1 && !c.tut.s2){ c.tut.s2=true; state.ui.pendingTut='s2'; }
    else if(c.stars>=3 && !c.tut.intl){ c.tut.intl=true; state.ui.pendingTut='intl'; } }
  if(state.seasons.length===2){ const c=spState(); if(c.sponsorPool.length<3) sponsorOffers(state.company.stars||0, 3-c.sponsorPool.length); }
  closeModal(); goto('dashboard');
  if(state.ui.pendingTut){ const t=state.ui.pendingTut; state.ui.pendingTut=null; setTimeout(()=>showTutorial(t), 120); }
}

/* =========================================================================
   PARTIDA: nueva / importar / exportar
========================================================================= */
function newGame(){
  const name=(document.getElementById('ng_name').value||'').trim()||'FMS';
  state.company={name, stars:0, reputation:0, money:START_MONEY, dbv:5}; state.ui.tutQ=null;
  if(!state.ui.importedPool) state.freestylers=generatePool();
  else state.freestylers=state.ui.importedPool;
  customFS().forEach(c=>{ if(!state.freestylers.some(f=>f.name.toLowerCase()===c.name.toLowerCase())) state.freestylers.push(customToF(c)); });
  state.seasons=[]; state.seasons.push(newSeason(null));
  state.ui.importedPool=null; state.company.spStart=true; sponsorOffers(0, 3);
  goto('dashboard');
}
function importPoolFile(ev){
  const file=ev.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const d=JSON.parse(r.result);
      const list=(d.freestylers||[]).filter(f=>f && f.name);
      if(list.length<10) throw new Error('pocos');
      state.ui.importedPool=list.map(f=>{ const st=genStats(); return {id:uid('f'), name:f.name, country:f.country||'España', photo:f.photo||null, nivel:st.nivel, fama:st.fama}; });
      toast(`Importados ${list.length} freestylers. Se les han asignado nivel y fama al azar.`);
    }catch(e){ toast('Ese archivo no tiene una lista de freestylers válida (exporta desde tu gestor).'); }
    render();
  };
  r.readAsText(file); ev.target.value='';
}
function exportGame(){
  const dump={company:state.company, freestylers:state.freestylers, seasons:state.seasons, _counter:state._counter};
  const blob=new Blob([JSON.stringify(dump)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`fms_ceo_${cur()?cur().year:'partida'}.json`; a.click();
}
function importGameFile(ev){
  const file=ev.target.files[0]; if(!file) return;
  const r=new FileReader();
  r.onload=()=>{
    try{ const d=JSON.parse(r.result); if(!d.company) throw 0;
      state.company=d.company; state.freestylers=d.freestylers; state.seasons=d.seasons; state._counter=d._counter||1;
      syncRealPool();   // migra la partida importada al formato actual (atributos, jueces, dbv)
      toast('Partida cargada.'); goto('dashboard');
    }catch(e){ toast('Ese archivo no es una partida de FMS CEO.'); }
  };
  r.readAsText(file); ev.target.value='';
}
function resetGame(){
  openModal(`<h3>Borrar partida</h3><p class="step-note">Se pierde la empresa, las temporadas y los freestylers. Exporta antes si quieres conservarla.</p>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn danger" onclick="doReset()">Borrar partida</button></div>`);
}
function doReset(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} state.company=null; state.seasons=[]; state.freestylers=[]; closeModal(); goto('welcome'); }
/* =========================================================================
   RENDER
========================================================================= */
function goto(name, params){ params=params||{}; if(name==='league' && !params.from) params.from = state.view.name==='league' ? (state.view.params.from||'leagues') : state.view.name; state.view={name, params}; _skipScrollRestore=true; render(); }
function themeEl(el, key){
  const uc = /^u_/.test(key||'') && typeof udef==='function' && udef(key) ? udef(key).color : null;
  const t = LEAGUE_THEME[key] || (uc ? {red:uc, bright:`color-mix(in srgb, ${uc} 70%, #fff)`, dark:`color-mix(in srgb, ${uc} 60%, #000)`} : (/^rb_/.test(key||'') ? LEAGUE_THEME.redbull : {red:'#e2101f', bright:'#ff2436', dark:'#7a0a13'}));
  el.style.setProperty('--red',t.red); el.style.setProperty('--red-bright',t.bright); el.style.setProperty('--red-dark',t.dark);
}
function applyViewTheme(){
  const el=document.documentElement; let key=null;
  if(state.view.name==='league') key=state.view.params.key;
  if(state.view.name==='intl') key=INTL.key;
  if(state.view.name==='redbull') key='redbull';
  const t=key? LEAGUE_THEME[key] : null;
  if(t){ el.style.setProperty('--red',t.red); el.style.setProperty('--red-bright',t.bright); el.style.setProperty('--red-dark',t.dark); }
  else { el.style.removeProperty('--red'); el.style.removeProperty('--red-bright'); el.style.removeProperty('--red-dark'); }
}
function render(){
  const active=document.activeElement; let focusId=null, s0=null, s1=null;
  if(active && active.id && document.getElementById('app').contains(active)){ focusId=active.id; if(typeof active.selectionStart==='number'){ s0=active.selectionStart; s1=active.selectionEnd; } }
  const skip=_skipScrollRestore; _skipScrollRestore=false;
  const prevY=window.scrollY;
  const pg=document.querySelector('.pick-grid'); const pgTop=pg? pg.scrollTop : null;
  if(state.company) save();
  const paint=()=>{
    applyViewTheme();
    renderTopbar();
    document.getElementById('app').innerHTML = renderView();
    if(focusId){ const el=document.getElementById(focusId); if(el){ el.focus(); if(s0!=null && el.setSelectionRange){ try{ el.setSelectionRange(s0,s1); }catch(e){} } } }
    tutTick();
    if(skip) window.scrollTo(0,0);
    else { window.scrollTo(0,prevY); const npg=document.querySelector('.pick-grid'); if(npg && pgTop!=null) npg.scrollTop=pgTop; }
  };
  if(typeof requestAnimationFrame==='function') requestAnimationFrame(paint); else setTimeout(paint,0);
}
let _toastTimer=null;
function toast(msg){
  if(typeof SHOW!=='undefined' && SHOW) return;   // durante el espectáculo manda la línea de estado
  let el=document.getElementById('toast');
  if(!el){ el=document.createElement('div'); el.id='toast'; el.className='toast'; el.setAttribute('role','status'); document.body.appendChild(el); }
  el.innerHTML=msg; el.style.display='block';
  clearTimeout(_toastTimer); _toastTimer=setTimeout(()=>{ el.style.display='none'; }, 3200);
}
function openModal(html, wide){ const mr=document.getElementById('modalRoot'); ['--red','--red-bright','--red-dark'].forEach(v=>mr.style.removeProperty(v)); mr.innerHTML=`<div class="modal-bg" onclick="if(event.target===this) closeModal()"><div class="modal ${wide===true?'wide':(wide||'')}">${html}</div></div>`; }
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; document.body.classList.remove('noscroll'); }
function starsHtml(n){ let h=''; for(let i=0;i<5;i++) h+= i<n? '★' : '<span class="off">★</span>'; return `<span class="stars" aria-label="${n} de 5 estrellas">${h}</span>`; }
function leagueDot(key, size){
  const d=ldef(key); const logo=LOGOS[key];
  if(logo){ const s=size||18; return `<img class="lg-logo" src="${logo}" alt="" style="width:${s}px;height:${s}px">`; }
  return `<span class="lg-dot" style="background:${d.badge}${size?`;width:${size}px;height:${size}px;border-radius:${Math.round(size/4)}px`:''}"></span>`;
}
function leagueHeadLogo(key){
  const d=ldef(key); const logo=LOGOS[key];
  return `<span class="logo-slot">${logo?`<img src="${logo}" alt="${d.name}">`:`<span style="background:${d.badge};color:${d.fg}">${d.short}</span>`}</span>`;
}
function hypeColor(h){ return h>=60?'#4bd18f':(h>=35?'#e0b23c':'#ff6b6b'); }
function hypeBar(h){ return `<div class="hype-row">Hype <div class="hype"><i style="width:${clamp(h,0,100)}%; background:${hypeColor(h)}"></i></div><b>${Math.round(h)}</b></div>`; }

function renderTopbar(){
  const tb=document.getElementById('topbar');
  if(!state.company){ tb.innerHTML=`<div class="topbar"><div class="brand">${gameMark()}<div class="name">FMS <span>CEO</span></div></div><div class="top-spacer"></div><button class="btn small gear-btn" onclick="openSettings()" title="Ajustes" aria-label="Ajustes">${GEAR_SVG}</button></div>`; return; }
  const s=cur();
  const tabs=[['dashboard','Inicio'],['calendar','Calendario'],['leagues','Ligas']];
  if(s.intlEnabled || s.intl.played) tabs.push(['intl','Internacional']);
  tabs.push(['redbull','Red Bull'],['freestylers','Freestylers'],['history','Historial']);
  const dateTxt = s.phase==='pre' ? `Pretemporada ${s.year}` : (s.phase==='done' ? `Temporada ${s.year} cerrada` : fmtDay(s.year,s.day)+' '+s.year);
  tb.innerHTML=`<div class="topbar">
    <div class="brand">${gameMark()}<div class="name">FMS <span>CEO</span></div></div>
    <div class="navtabs">${tabs.map(([k,l])=>`<button class="navtab ${state.view.name===k||(k==='leagues'&&state.view.name==='league')?'active':''}" onclick="goto('${k}')">${l}</button>`).join('')}</div>
    <div class="top-spacer"></div>
    <button class="btn small gear-btn" onclick="openSettings()" title="Ajustes" aria-label="Ajustes">${GEAR_SVG}</button>
    <div class="date-pill">${dateTxt} &nbsp;<span class="m ${state.company.money<0?'neg':''}">${moneyK(state.company.money)}</span></div>
    ${s.phase==='live'? `<div class="time-controls">
      <button class="btn small primary" onclick="animatedAdvance('event')">Próxima fecha</button>
    </div>`:''}
  </div>`;
}
function renderView(){
  if(!state.company) return renderWelcome();
  switch(state.view.name){
    case 'calendar': return renderCalendar();
    case 'leagues': return renderLeagues();
    case 'league': return renderLeague(state.view.params.key);
    case 'intl': return renderIntl();
    case 'redbull': return renderRedBull();
    case 'freestylers': return renderFreestylers();
    case 'history': return renderHistory();
    default: return renderDashboard();
  }
}

/* ---------- bienvenida ---------- */
function renderWelcome(){
  const imp=state.ui.importedPool;
  return `<div class="welcome">
    <div class="hero" style="display:block;">
      <h1>Eres el CEO de FMS</h1>
      <p>Empiezas con 0 estrellas, ${money(START_MONEY)} y una sola liga. Cada temporada que completas sumas 1 estrella y desbloqueas una liga más (con 3★ y 4 ligas, el Internacional). Ficha a los 10 freestylers, reparte las 9 jornadas por el año y haz crecer la empresa hasta las 5 estrellas.</p>
    </div>
    <div class="step" style="margin-top:16px;">
      <label class="field-label" for="ng_name">Nombre de la empresa</label>
      <input id="ng_name" value="FMS" style="width:100%; margin-bottom:14px;">
      <span class="field-label">Freestylers</span>
      <p class="step-note" style="margin-bottom:10px;">${imp? `Usarás <b>${imp.length}</b> freestylers importados de tu gestor.` : 'Por defecto se carga el preset de freestylers reales de las FMS (nivel y fama estimados). También puedes importar tu lista desde el JSON que exporta tu gestor de temporadas.'}</p>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn" onclick="document.getElementById('poolFileInput').click()">Importar freestylers (.json)</button>
        ${imp?`<button class="btn ghost" onclick="state.ui.importedPool=null; render()">Usar generados</button>`:''}
        <div class="top-spacer"></div>
        <button class="btn primary" onclick="newGame()">Empezar partida</button>
      </div>
      <p class="step-note" style="margin-top:14px;">¿Tienes una partida guardada en archivo? <button class="btn small ghost" onclick="document.getElementById('gameFileInput').click()">Cargar partida</button></p>
    </div>
  </div>`;
}

/* ---------- inicio ---------- */
function renderCompanyHero(){
  const c=state.company; const s=cur();
  const next=STAR_THRESHOLDS[c.stars+1];
  const prevT=STAR_THRESHOLDS[c.stars];
  const pct = next? clamp((c.reputation-prevT)/(next-prevT)*100,0,100) : 100;
  return `<div class="hero" style="display:block;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:16px; flex-wrap:wrap;">
      <div><h1>${esc(c.name)}</h1><p>Temporada ${s.number} · ${s.year}</p></div>
      <div style="text-align:right;">${starsHtml(c.stars)}<p>Hasta ${maxLeagues(c.stars)} liga(s) activa(s)${c.stars>=3?' · Internacional desde 4 ligas':''}</p></div>
    </div>
    <div class="kpis">
      <div class="kpi"><div class="k-l">Caja</div><div class="k-v ${c.money<0?'neg':''}">${money(c.money)}</div></div>
      <div class="kpi"><div class="k-l">Reputación</div><div class="k-v">${Math.round(c.reputation)}</div>
        <div class="k-l" style="margin-top:4px;">${c.stars<5? `Al cerrar la temporada: ${c.stars+1}★ y hasta ${maxLeagues(c.stars+1)} ligas` : 'Máximo de estrellas'}</div></div>
      <div class="kpi"><div class="k-l">Ingresos temporada</div><div class="k-v">${moneyK(s.fin.income)}</div></div>
      <div class="kpi"><div class="k-l">Gastos temporada</div><div class="k-v">${moneyK(s.fin.salaries+s.fin.production)}</div></div>
    </div>
  </div>`;
}
function renderDashboard(){
  const s=cur();
  let h=renderCompanyHero();
  h+=sponsorBanner();
  if(s.phase==='pre') h+=renderPreseason(s);
  else h+=renderLiveDashboard(s);
  return h;
}
function renderPreseason(s){
  const stars=state.company.stars; const limit=maxLeagues(stars);
  const leaguesOk = s.activeKeys.length>0;
  const rostersOk = leaguesOk && s.activeKeys.every(k=>s.leagues[k].competitors.length===10);
  const totalDates = s.activeKeys.reduce((a,k)=>a+nJ(k),0) + (s.intlEnabled?1:0);
  const placed = s.activeKeys.reduce((a,k)=>a+s.leagues[k].dates.length,0) + (s.intlEnabled && s.intl.date!=null?1:0);
  const issues=preseasonIssues(s);
  const calOk = leaguesOk && placed===totalDates && !issues.some(i=>i.includes('calendario')||i.includes('Internacional'));
  return `<div class="section-title"><h2>Pretemporada</h2></div>
  <div class="steps">
    <div class="step ${leaguesOk?'ok':''}">
      <div class="step-head"><div class="step-num">1</div><h3>Ligas activas</h3><span class="counter"><span class="n">${natKeys(s).length}</span>/${limit}</span></div>
      <div class="league-toggle-grid">
        ${LEAGUES.map(l=>{ const on=s.activeKeys.includes(l.key); const locked=!on && natKeys(s).length>=limit;
          return `<button class="ltoggle ${on?'on':''} ${locked?'locked':''}" onclick="toggleLeague('${l.key}')" aria-pressed="${on}">${leagueDot(l.key)}<span>${l.name}<small>${on?'Activa':(locked?`Necesitas más estrellas`:'Inactiva')}</small></span></button>`; }).join('')}
        <button class="ltoggle ${s.intlEnabled?'on':''} ${natKeys(s).length<4?'locked':''}" onclick="toggleIntl()" aria-pressed="${s.intlEnabled}">${leagueDot(INTL.key)}<span>${INTL.name}<small>${natKeys(s).length<4?'Requiere 4 ligas':(s.intlEnabled?'Activo · 16 plazas':'Inactivo')}</small></span></button>
        <button class="ltoggle ${s.activeKeys.includes(WS.key)?'on':''} ${(state.company.stars||0)<5?'locked':''}" onclick="toggleLeague('${WS.key}')" aria-pressed="${s.activeKeys.includes(WS.key)}">${leagueDot(WS.key)}<span>${WS.name}<small>${(state.company.stars||0)<5?'Requiere 5 estrellas':(s.activeKeys.includes(WS.key)?'Activa · no ocupa cupo':'Inactiva · no ocupa cupo')}</small></span></button>
      </div>
      ${s.intlEnabled? sedePicker() : ''}
    </div>
    <div class="step ${rostersOk?'ok':''}">
      <div class="step-head"><div class="step-num">2</div><h3>Fichajes</h3></div>
      <p class="step-note" style="margin-bottom:10px;">10 freestylers por liga. El contrato de la temporada se paga al fichar. Cada freestyler solo puede estar en una liga nacional${s.activeKeys.includes(WS.key)?' (la World Series va aparte: cobran la mitad y pueden compaginarla)':''}.</p>
      <div class="card-list">${s.activeKeys.map(k=>{ const L=s.leagues[k]; const pay=L.competitors.reduce((a,id)=>a+(L.contracts[id]||0),0);
        return `<div class="tcard" onclick="goto('league',{key:'${k}'})">${leagueDot(k)}<div class="info"><div class="tname">${ldef(k).name}</div><div class="tmeta">Nómina ${moneyK(pay)}</div></div><span class="status ${L.competitors.length===10?'done':'pending'}">${L.competitors.length}/10</span></div>`; }).join('')}</div>
    </div>
    <div class="step ${calOk?'ok':''}">
      <div class="step-head"><div class="step-num">3</div><h3>Calendario</h3><span class="counter"><span class="n">${placed}</span>/${totalDates} fechas</span></div>
      <p class="step-note" style="margin-bottom:10px;">Si dejas más de ${GAP_OK} días entre jornadas de una liga, empieza a perder hype; pasados ${GAP_WARN}, lo pierde rápido. Cada mes del año sin ningún evento te cuesta reputación.</p>
      ${rostersOk? `<button class="btn" onclick="goto('calendar',{from:'dashboard'})">Abrir calendario</button>` : `<button class="btn" disabled style="opacity:.45;cursor:not-allowed">Abrir calendario</button> <span class="step-note">Se desbloquea al completar los fichajes.</span>`}
    </div>
  </div>
  <div class="step ok" style="margin-top:14px;">
    <div class="step-head"><div class="step-num">4</div><h3>Formato de batalla</h3></div>
    <div class="mode-toggle" role="group" aria-label="Formato de batalla">
      <button class="seg ${seasonFormat(s)==='short'?'on':''}" onclick="setFormat('short')" aria-pressed="${seasonFormat(s)==='short'}">Corto</button>
      <button class="seg ${seasonFormat(s)==='long'?'on':''}" onclick="setFormat('long')" aria-pressed="${seasonFormat(s)==='long'}">Largo</button>
    </div>
    <p class="step-note" style="margin-top:8px;">${seasonFormat(s)==='short' ? 'Random Mode, 2 minutos libres y Deluxe. Cada juez puntúa del 1 al 10 por ronda.'+(s.activeKeys.includes(WS.key)?' La World Series siempre se juega en formato corto.':'') : 'Easy Mode (0-30), Hard Mode (0-30), Temáticas (0-44), Random Mode (0-38), 2 minutos libres (0-30 cada uno) y Deluxe (0-42). Más rondas, más peso de los estilos.'+(s.activeKeys.includes(WS.key)?' La World Series siempre se juega en formato corto.':'')}</p>
  </div>
  <div style="display:flex; align-items:center; gap:14px; margin-top:20px; flex-wrap:wrap;">
    <div class="step-note" style="flex:1;">${issues.length? `Falta: ${esc(issues[0])}${issues.length>1?` (y ${issues.length-1} más)`:''}` : 'Todo listo.'}</div>
    <button class="btn primary" ${issues.length?'disabled':''} onclick="startSeason()">Iniciar temporada ${s.year}</button>
  </div>`;
}
function setFormat(v){ const s=cur(); if(s.phase!=='pre') return; s.format=v; render(); }
function sponsorBanner(){ const c=spState(); if(!c.sponsorPool.length) return ''; if(cur() && cur().phase!=='pre') return ''; const lim=sponsorSlotLimit(); const sc=cur(); if(!sc || !natKeys(sc).some(k=>leagueSponsors(k).slice(0,lim).some(x=>!x))) return ''; return `<div class="banner sp-banner">🤝 Tienes <b>&nbsp;${c.sponsorPool.length} oferta${c.sponsorPool.length>1?'s':''} de patrocinio&nbsp;</b> sin colocar. Cada FMS activa admite ${sponsorSlotLimit()} patrocinador${sponsorSlotLimit()>1?'es':''}${sponsorSlotLimit()<3?' (3 desde la 2ª temporada)':''}.&nbsp;<button class="btn small primary" onclick="goto('league',{key:'${cur().activeKeys[0]||LEAGUES[0].key}'})">Colocar</button></div>`; }
function renderLiveDashboard(s){
  const evs=[...seasonEvents(s), ...rbEventsList(s), ...(rbOn(s)&&!s.rb.inter.voted?[{day:s.rb.inter.voteDay, key:'vote'}]:[])].filter(e=>e.day>=s.day).sort((a,b)=>a.day-b.day).slice(0,6);
  let h='';
  if(s.phase==='done'){
    h+=`<div class="banner" style="margin-top:20px;">La temporada ${s.year} ha terminado.&nbsp;<button class="btn small" onclick="showSummary()">Ver resumen</button>&nbsp;<button class="btn small primary" onclick="nextSeason()">Preparar temporada ${s.year+1}</button></div>`;
  } else {

  }
  h+=`<div class="section-title"><h2>Ligas</h2></div><div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.activeKeys.map(k=>leagueCard(s,k)).join('')}</div>`;
  if(s.phase==='live'){
    h+=`<div class="section-title"><h2>Próximas fechas</h2></div>
    ${evs.length? `<div class="news">${evs.map(e=>`<div class="news-item ${isRB(e.key)||e.key==='vote'?'rb':''}"><span class="nd">${fmtDay(s.year,e.day)}</span>${e.key==='vote'?rbDot(RB_INT.key):anyDot(e.key)}<span>${e.key==='vote'?'🗳️ Votación de comodines Red Bull':(isRB(e.key)? rbdef(e.key).name+(e.key===RB_INT.key?' · 📍 '+s.rb.inter.sede:'') : `${ldef(e.key).name}${e.j?` · Jornada ${e.j}`:' · Eliminatoria de 16'}`)}${e.day===s.day?' <span class="rtag">hoy</span>':''}</span></div>`).join('')}</div>` : `<div class="step-note">No quedan fechas este año.</div>`}`;
  }
  h+=`<div class="section-title"><h2>Noticias</h2></div>${s.log.length?`<div class="news">${s.log.slice(0,25).map(n=>`<div class="news-item ${n.type}"><span class="nd">${fmtDay(s.year,Math.max(0,n.day))}</span><span>${n.text}</span></div>`).join('')}</div>`:'<div class="step-note">Aún no ha pasado nada.</div>'}`;
  return h;
}
function leagueCard(s,k){
  const L=s.leagues[k]; const st=computeStandings(L);
  const nextD=L.finished? null : L.dates[L.played];
  return `<div class="step" style="cursor:pointer;" onclick="goto('league',{key:'${k}'})">
    <div style="display:flex; align-items:center; gap:8px; font-weight:700;">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="status ${L.finished?'done':'live'}">${L.finished?'Finalizada':`J${L.played}/${nJ(k)}`}</span></div>
    ${hypeBar(L.hype)}
    <div class="hype-row" style="justify-content:space-between;"><span>${L.finished?'Campeón':'Líder'}: <b style="text-align:left">${st[0]&&st[0].pj? fnameH(st[0].id):'—'}</b></span><span>${nextD!=null?'Próxima '+fmtDay(s.year,nextD):''}</span></div>
  </div>`;
}
function confirmSimYear(){
  openModal(`<h3>Simular hasta fin de año</h3><p class="step-note">Se jugarán todas las fechas que quedan y se cerrará la temporada ${cur().year}.</p>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn primary" onclick="closeModal(); animatedAdvance('year')">Simular</button></div>`);
}
function sumRight(s){
  return `<div class="sum-tabs"><button class="seg on" onclick="sumTab(this,0)">Top 10 batallas</button><button class="seg" onclick="sumTab(this,1)">Top 10 freestylers</button></div>
    <div class="sum-pane on">${topBattlesHtml(s)||'<p class="step-note">Sin batallas.</p>'}</div><div class="sum-pane">${topFreestylersHtml(s)||'<p class="step-note">Sin datos.</p>'}</div>`;
}
function sumTab(btn,i){ const w=btn.closest('.sum-right'); w.querySelectorAll('.sum-tabs .seg').forEach((b,k)=>b.classList.toggle('on',k===i)); w.querySelectorAll('.sum-pane').forEach((p,k)=>p.classList.toggle('on',k===i)); }
function champRows(s){
  return `${s.activeKeys.map(k=>`<div class="sum-row"><span>${leagueDot(k)} ${ldef(k).name}</span><span>🏆 ${fnameH(s.leagues[k].finalStandings[0])}</span></div>`).join('')}
    ${s.intl.champion?`<div class="sum-row"><span>${leagueDot(INTL.key)} ${INTL.name}</span><span>🌎 ${fnameH(s.intl.champion)}</span></div>`:''}
    ${rbOn(s)&&s.rb.inter.champion?`<div class="sum-row"><span>${rbDot(RB_INT.key)} ${RB_INT.name} (${s.rb.inter.sede})</span><span>🔴 ${fnameH(s.rb.inter.champion)}</span></div>`:''}`;
}
function showSummary(){
  const s=cur(); const m=s.summary; if(!m) return;
  const net=m.income-m.salaries-m.production;
  openModal(`<h3>Temporada ${s.year}</h3>
    <div class="sum-grid"><div class="sum-left">
    <div style="margin-bottom:10px;">${starsHtml(m.starsAfter)} ${m.starsAfter>m.starsBefore?'<span class="pos-v"> ¡Subes de estrella!</span>':''}</div>
    <div class="sum-sec">Campeones</div>${champRows(s)}
    <div class="sum-sec">Balance</div>
    <div class="sum-row"><span>Ingresos (taquilla + visitas)</span><b class="pos-v">${money(m.income)}</b></div>
    ${m.views?`<div class="sum-row"><span>· de ellos, por visitas</span><b class="pos-v">${money(m.views)}</b></div>`:''}
    ${m.sponsors?`<div class="sum-row"><span>· de ellos, patrocinios</span><b class="pos-v">${money(m.sponsors)}</b></div>`:''}
    <div class="sum-row"><span>Contratos</span><b class="neg-v">−${money(m.salaries)}</b></div>
    <div class="sum-row"><span>Producción de eventos</span><b class="neg-v">−${money(m.production)}</b></div>
    <div class="sum-row sum-total"><span>Balance</span><b class="${net>=0?'pos-v':'neg-v'}">${money(net)}</b></div>
    <div class="sum-row"><span>Reputación ganada</span><b class="${m.repDelta>=0?'pos-v':'neg-v'}">${m.repDelta>=0?'+':''}${Math.round(m.repDelta)}</b></div>
    <div class="sum-row"><span>Meses sin eventos</span><b>${m.emptyMonths}</b></div>
    ${s.newSponsorOffers?`<div class="banner sp-banner" style="margin:8px 0">🤝 ¡Nueva estrella! ${s.newSponsorOffers} marcas quieren patrocinarte.</div>`:''}
    </div><div class="sum-right">${sumRight(s)}</div></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button>${s===cur()&&s.phase==='done'?`<button class="btn primary" onclick="nextSeason()">Preparar temporada ${s.year+1}</button>`:''}</div>`, 'summary');
}

/* ---------- calendario ---------- */
function renderCalendar(){
  const s=cur(); const y=s.year;
  if(state.ui.calMonth==null) state.ui.calMonth = s.phase==='live'? monthOf(y,s.day) : 0;
  const m=state.ui.calMonth;
  const byDay=eventsByDay(s); const months=monthsWithEvents(s); const rbDay=rbByDay(s);
  const tool=state.ui.calTool && (s.activeKeys.includes(state.ui.calTool) || state.ui.calTool===INTL.key) ? state.ui.calTool : s.activeKeys[0];
  const back=state.view.params&&state.view.params.from==='dashboard';
  let h=`${back?`<div class="back-link" onclick="goto('dashboard')">‹ Inicio</div>`:''}<div class="detail-head"><h1>Calendario ${y}</h1>${back?`<button class="btn small" style="margin-left:auto" onclick="goto('dashboard')">Volver al inicio</button>`:''}</div>`;
  if(s.phase==='pre'){
    if(!rostersComplete(s)){
      const pend=s.activeKeys.filter(k=>s.leagues[k].competitors.length<10);
      return h+`<div class="empty-state"><span class="big">Primero el line up</span>El calendario se elige cuando todas las ligas tienen sus 10 freestylers.${pend.length?` Falta: ${pend.map(k=>`${ldef(k).name} (${s.leagues[k].competitors.length}/10)`).join(', ')}.`:''}<div style="margin-top:14px;"><button class="btn primary" onclick="goto('dashboard')">Ir a fichajes</button></div></div>`;
    }
    h+=`<div class="banner">Elige una liga y toca días vacíos para poner sus jornadas. Toca una fecha ya puesta para quitarla. No puede haber dos eventos el mismo día, y los días de Red Bull están ocupados. De lunes a jueves la taquilla es un ${Math.round((1-WEEKDAY_TICKET)*100)}% menor que de viernes a domingo (🎟).${s.intlEnabled?' El Internacional se coloca cuando estén todas las jornadas nacionales, y siempre después de la última.':''}</div>
    <div class="cal-tools">
      ${s.activeKeys.map(k=>{ const n=s.leagues[k].dates.length; return `<button class="cal-tool ${tool===k?'sel':''}" onclick="state.ui.calTool='${k}'; render()" aria-pressed="${tool===k}">${leagueDot(k)}${ldef(k).short}<span class="cnt ${n===nJ(k)?'full':''}">${n}/${nJ(k)}</span></button>`; }).join('')}
      ${s.intlEnabled?`<button class="cal-tool ${tool===INTL.key?'sel':''}" onclick="state.ui.calTool='${INTL.key}'; render()">${leagueDot(INTL.key)}INTL<span class="cnt ${s.intl.date!=null?'full':''}">${s.intl.date!=null?1:0}/1</span></button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small danger" onclick="clearSchedule()">Vaciar</button>
    </div>`;
  }
  h+=`<div class="cal-toolbar">
    <button class="btn small" ${m===0?'disabled':''} onclick="state.ui.calMonth=${m-1}; render()" aria-label="Mes anterior">‹</button>
    <div class="cal-month-title">${MESES[m]}</div>
    <button class="btn small" ${m===11?'disabled':''} onclick="state.ui.calMonth=${m+1}; render()" aria-label="Mes siguiente">›</button>
    ${s.phase==='live'?`<button class="btn small ghost" onclick="state.ui.calMonth=${monthOf(y,s.day)}; render()">Hoy</button>`:''}
  </div>`;
  const first=dateToDay(y,m,1); const dim=new Date(Date.UTC(y,m+1,0)).getUTCDate();
  const lead=(dayToDate(y,first).getUTCDay()+6)%7;
  h+=`<div class="cal-grid">${DOW.map(d=>`<div class="cal-dow">${d}</div>`).join('')}`;
  for(let i=0;i<lead;i++) h+=`<div class="cal-cell out"></div>`;
  for(let dd=1; dd<=dim; dd++){
    const d=first+dd-1; const ev=byDay[d]; const wd=(lead+dd-1)%7;
    const cls=['cal-cell']; if(wd>=5) cls.push('weekend'); if(s.phase==='pre' && wd>=4) cls.push('prime');
    if(s.phase==='live' && d<s.day) cls.push('past');
    if(s.phase==='pre' && !ev && tool===INTL.key && (natKeys(s).some(k=>s.leagues[k].dates.length<JORNADAS) || d<=lastNationalDay(s))) cls.push('blocked');
    if(s.phase==='pre' && !ev && tool!==INTL.key && s.intlEnabled && s.intl.date!=null && d>=s.intl.date) cls.push('blocked'); if(s.phase==='live' && d===s.day) cls.push('today');
    const resv = s.phase==='pre' && !ev && d<LU_RESERVED && tool!==INTL.key; if(resv) cls.push('reserved');
    const adj = s.phase==='pre' && !ev && !resv && tool!==INTL.key && s.leagues[tool] && s.leagues[tool].dates.some(x=>Math.abs(x-d)===1); if(adj) cls.push('blocked','adj');
    let inner=`<span class="cal-dnum">${dd}</span>${resv?'<span class="cal-na">No disponible</span>':''}`;
    if(ev){
      const def=ldef(ev.key); const played = s.phase!=='pre' && d<s.day || s.phase==='done';
      let sub='';
      if(ev.key===INTL.key) sub = s.intl.champion? '🏆 '+fnameH(s.intl.champion) : 'Eliminatoria';
      else sub = def.name;
      inner+=`<div class="cal-ev ${played?'played':''}" style="background:${def.badge}; color:${def.fg}">${LOGOS[ev.key]?`<img class="cal-logo" src="${LOGOS[ev.key]}" alt="">`:''}${ev.key===INTL.key?'INTL':def.short+' · J'+ev.j}<small>${sub}</small></div>`;
    }
    const rev=rbDay[d];
    if(rev){ const played=(s.phase==='live'&&d<s.day)||s.phase==='done'; const re=rbEvent(s,rev.key);
      inner+=`<div class="cal-ev rb ${rev.key===RB_INT.key?'int':''} ${played?'played':''}">RB ${rbdef(rev.key).short}<small>${re.champion?'🏆 '+fnameH(re.champion):(rev.key===RB_INT.key?'📍 '+s.rb.inter.sede:rbdef(rev.key).name)}</small></div>`; }
    const uev=underByDay(s)[d]; if(uev){ const ud=udef(uev.key); const pl=uev.played; inner+=`<div class="cal-ev under ${pl?'played':''}" style="background:${ud.color}">${ulogo(uev.key)?`<img class="cal-logo" src="${ulogo(uev.key)}" alt="">`:''}${ud.short}${uev.n?' '+uev.n:''}<small>${uev.champion?'🏆 '+fnameH(uev.champion):ud.name}</small></div>`; }
    if(rbOn(s) && d===s.rb.inter.voteDay) inner+=`<div class="cal-vote">🗳️ Votación RB</div>`;
    h+=`<button class="${cls.join(' ')}" onclick="calClick(${d})" aria-label="${dd} de ${MESES[m]}${ev?', '+ldef(ev.key).name+(ev.j?' jornada '+ev.j:''):''}${rev?', '+rbdef(rev.key).name:''}">${inner}</button>`;
  }
  h+=`</div>`;
  // tira de meses
  const curM = s.phase==='live'? monthOf(y,s.day) : -1;
  h+=`<div class="section-title"><h2>Año completo</h2></div><div class="month-strip">${MESES_C.map((mm,i)=>{ const n=seasonEvents(s).filter(e=>monthOf(y,e.day)===i).length;
    return `<button class="ms-cell ${n?'':'empty'} ${i===m?'cur':''}" onclick="state.ui.calMonth=${i}; render()" title="${MESES[i]}">${mm}<span class="n">${n}</span></button>`; }).join('')}</div>
  <p class="step-note" style="margin-top:6px;">${12-months.size} mes(es) sin eventos → −${(12-months.size)*(8+2*state.company.stars)} de reputación.</p>`;
  // análisis
  if(s.activeKeys.some(k=>s.leagues[k].dates.length)){
    h+=`<div class="section-title"><h2>Distancia entre jornadas</h2></div><div class="analysis">${s.activeKeys.map(k=>{
      const gaps=gapsFor(s,k); const loss=Math.round(projectedHypeLoss(s,k));
      return `<div class="analysis-row"><div class="ar-head">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="step-note">Hype en riesgo: <b style="color:${loss>40?'#ff6b6b':(loss>15?'#e0b23c':'#4bd18f')}">−${loss}</b></span></div>
      <div class="gap-list">${gaps.map((g,i)=>`<span class="gap ${gapClass(g)}" title="${i===0?'Desde el inicio de temporada':'Desde la jornada '+i}">${i===0?'Inicio':'J'+i}→J${i+1}: ${g}d</span>`).join('')||'<span class="step-note">Sin fechas.</span>'}</div></div>`; }).join('')}</div>`;
  }
  return h;
}

/* ---------- ligas ---------- */
function renderLeagues(){
  const s=cur();
  return `<div class="detail-head"><h1>Ligas ${s.year}</h1></div>
  ${s.activeKeys.length? `<div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.activeKeys.map(k=> s.phase==='pre' ? `<div class="step" style="cursor:pointer" onclick="goto('league',{key:'${k}'})"><div style="display:flex;gap:8px;align-items:center;font-weight:700;">${leagueDot(k)} ${ldef(k).name}<span class="top-spacer"></span><span class="status ${s.leagues[k].competitors.length===10?'done':'pending'}">${s.leagues[k].competitors.length}/10</span></div></div>` : leagueCard(s,k)).join('')}</div>` : `<div class="empty-state"><span class="big">Sin ligas activas</span>Actívalas en Inicio.</div>`}`;
}
function renderLeague(key){
  const s=cur(); const L=s.leagues[key]; const def=ldef(key);
  if(!L) return `<div class="empty-state"><span class="big">Liga no activa</span></div>`;
  const from=state.view.params.from||'leagues'; const backNames={dashboard:'Inicio', leagues:'Ligas', calendar:'Calendario', intl:'Internacional', freestylers:'Freestylers', history:'Historial'};
  const back = backNames[from]? from : 'leagues';
  let h=`<div class="back-link" onclick="goto('${back}')">‹ ${backNames[back]}</div>
  <div class="detail-head">${leagueHeadLogo(key)}<h1>${def.name} ${s.year}</h1></div>`;
  h+=renderSponsorSlots(key);
  if(s.phase==='pre') return h+renderSpeakerBox(s,key)+renderSigning(s,key);
  h+=hypeBar(L.hype);
  spkList(L).map(spkBy).filter(Boolean).forEach(sp=>{ const im=spkImg(sp); h+=`<div class="spk-live">${im?`<img src="${im}" alt="">`:''}<span>🎙️ Host: <b>${esc(sp.name)}</b> · ${esc(spkTxt(sp,key))}</span></div>`; });
  { const jj=Math.min(L.played, nJ(key)-1); const pvx=L.pv&&L.pv[jj]; if(pvx && pvx.shown && !L.finished && jj===L.played) h+=`<div class="lu-again"><button class="btn small" onclick="openPairs('${key}',${jj})">📣 Enfrentamientos oficiales J${jj+1} · ${pvx.delta>=0?'+':''}${pvx.delta} hype</button></div>`; }
  if(L.finished && L.champTw) h+=`<div class="lu-again"><button class="btn small" onclick="openChamp('${key}')">🏆 Reacciones al campeón en X</button></div>`;
  if(L.lu && L.lu.shown) h+=`<div class="lu-again"><button class="btn small" onclick="openLineup('${key}')">📣 Revelación del line up · reacción ${L.lu.delta>=0?'+':''}${L.lu.delta} hype</button></div>`;
  if(L.manual && !L.finished) h+=renderPairingEditor(s,key);
  const st=computeStandings(L); const n=natKeys(s).length;
  const q = (s.intlEnabled && !isWS(key)) ? intlSlotsPerLeague(n) : 0;
  h+=`<div class="section-title"><h2>Clasificación</h2>${q?`<span class="tag">Top ${q} al Internacional</span>`:''}</div>
  <div style="overflow-x:auto;"><table class="standings"><thead><tr><th>#</th><th>Freestyler</th><th class="num">PJ</th><th class="num">V</th><th class="num">VR</th><th class="num">DR</th><th class="num">D</th><th class="num">PTS</th></tr></thead><tbody>
  ${st.map((r,i)=>{ const rel=!isWS(key) && i>=st.length-2; const isQ=i<q;
    return `<tr class="${isQ?'q':''} ${rel?'rel':''}"><td class="pos">${i+1}</td><td><span style="display:inline-flex;align-items:center;gap:8px;cursor:pointer" onclick="showFreestyler('${r.id}')">${miniAvatar(r.id,24)} ${fnameH(r.id)}</span>${isQ?'<span class="qbadge">INTL</span>':''}${(()=>{ const n=L.rounds.flat().filter(m=>m.postponed&&!m.result&&(m.a===r.id||m.b===r.id)).length; return n?`<span class="tag-mini pend">⏳ ${n} batalla${n>1?'s':''} pendiente${n>1?'s':''}</span>`:''; })()}${rel&&L.played?'<span class="tag-mini" style="background:#2a2a2e;color:var(--gray)">Descenso</span>':''}</td>
    <td class="num">${r.pj}</td><td class="num">${r.v}</td><td class="num">${r.vr}</td><td class="num">${r.dr}</td><td class="num">${r.d}</td><td class="pts num">${r.pts}</td></tr>`; }).join('')}
  </tbody></table></div>
  <p class="step-note" style="margin-top:-14px; margin-bottom:10px;">Victoria 3 · Victoria en réplica 2 · Derrota en réplica 1 · Derrota 0</p>`;
  const navKey='jnav_'+key;
  let j = state.ui[navKey]; if(j==null) j=Math.max(0,Math.min(nJ(key)-1, L.played? L.played-1 : 0));
  const round=L.rounds[j]||[];
  h+=`<div class="section-title"><h2>Jornadas</h2></div>
  <div class="jornada-nav"><button class="btn small" ${j===0?'disabled':''} onclick="state.ui['${navKey}']=${j-1}; render()">‹</button>
  <div class="jornada-nav-label">Jornada ${j+1} · ${fmtDay(s.year,L.dates[j])}${isWS(key)&&L.wsSede&&L.wsSede[j]?' · '+esc(L.wsSede[j]):''} ${j<L.played?'<span class="jdone">· jugada</span>':(L.manual && !L.confirmed[j]?'<span class="jprov">· provisional</span>':(L.manual?'<span class="jdone">· elegida</span>':''))}</div>
  <button class="btn small" ${j===nJ(key)-1?'disabled':''} onclick="state.ui['${navKey}']=${j+1}; render()">›</button></div>
  <div class="matches-grid">${round.map((m,mi)=>{ const r=m.result; const wa=r&&r.winner===m.a, wb=r&&r.winner===m.b;
    return `<div class="match${r?' clickable':''}" style="min-height:0;"${r?` onclick="showBattle('${key}',${j},${mi})"`:''}><div class="match-head">
      <div class="match-side left ${wa?'win':''}">${miniAvatar(m.a,22)}<span class="side-name">${fnameH(m.a)}</span></div><div class="vs">vs</div>
      <div class="match-side right ${wb?'win':''}"><span class="side-name">${m.ep&&!m.b?'<i class="step-note">Extraplayer</i>':fnameH(m.b)}${m.ep&&m.b?' <span class="tag-mini ep">EP</span>':''}</span>${miniAvatar(m.b,22)}</div></div>
      <div class="match-result"><span>${r? `Gana ${fnameH(r.winner)}${r.tiebreak?' <span class="rtag">réplica</span>':''}${m.recup?' <span class="rtag">recuperativa</span>':''}` : (m.postponed?`Aplazada${m.recupDay!=null?' · recuperativa el '+fmtDay(s.year,m.recupDay):''}`:'Pendiente')}</span><span>${(()=>{ const p=ptbOf(m); return p? 'PTB '+fpt(p[0])+'–'+fpt(p[1]) : fby(m.a).nivel+' · '+(fby(m.b)?fby(m.b).nivel:'—'); })()}</span></div>
      ${r&&(m.lb||m.views)?`<div class="match-result" style="margin-top:2px"><span>${esc(m.lb||'')}</span><span>${m.views?'▶ '+fmtViews(m.views):''}</span></div>`:''}</div>`; }).join('')}</div>
  ${renderExhib(s,L,key,j)}${(()=>{ const fx=L.fexhib&&L.fexhib[j]; if(!fx) return ''; const m=fx.m;
    return `<div class="ex-box done clickable" onclick="showBattle('${key}',${j},'fex')"><div class="ex-h">🎤 Exhibición obligada</div><div class="ex-row">${miniAvatar(fx.a,22)} ${fnameH(fx.a)} <span class="vs">vs</span> ${fnameH(fx.b)} ${miniAvatar(fx.b,22)}</div>
      <div class="step-note">${m&&m.result?`Gana ${fnameH(m.result.winner)} · PTB ${fpt(ptbOf(m)[0])}–${fpt(ptbOf(m)[1])}`:`Sustituye a la batalla aplazada de ${fnameH(fx.missing)}`}</div></div>`; })()}
  ${j<L.played && L.mvps && L.mvps[j]?`<div class="jornada-foot"><span>⭐ MVP: <b>${fnameH(L.mvps[j].id)}</b> · ${fpt(L.mvps[j].pts)} pts</span>${round[0]&&round[0].d&&round[0].d.s?`<button class="btn small" onclick="openFMSShow('${key}',${j})">▶ Ver jornada</button>`:''}</div>`:''}`;
  return h;
}
function renderSigning(s,key){
  const L=s.leagues[key]; const def=ldef(key);
  const fk='sf_'+key; const filter=state.ui[fk]||''; const allC=state.ui['sall_'+key]; const sort=state.ui['ssort_'+key]||'fama';
  let pool=state.freestylers.filter(f=> allC || !def.countries || def.countries.includes(f.country) || L.competitors.includes(f.id));
  if(filter) pool=pool.filter(f=> fMatch(f,filter));
  const sorters={nivel:(a,b)=>b.nivel-a.nivel, fama:(a,b)=>b.fama-a.fama, salario:(a,b)=>contractCost(a,key)-contractCost(b,key), hype:(a,b)=>(b.hype||0)-(a.hype||0)};
  pool.sort(sorters[sort]);
  const pay=L.competitors.reduce((a,id)=>a+(L.contracts[id]||0),0);
  const canKeep = L.prevRoster.length>0;
  return `<div class="selector-box">
    <div class="selector-top">
      <div class="counter"><span class="n">${L.competitors.length}</span>/10 fichados · nómina ${money(pay)} · caja ${money(state.company.money)}</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${canKeep?`<button class="btn small" onclick="keepRoster('${key}')">Renovar plantilla anterior</button>`:''}
        ${L.competitors.length?`<button class="btn small danger" onclick="releaseAll('${key}')">Liberar todos</button>`:''}
      </div>
    </div>
    ${L.competitors.length?`<div class="picked-strip"><div class="picked-strip-label">Plantilla</div><div class="picked-chips">${L.competitors.map(id=>`<span class="picked-chip" onclick="toggleSign('${key}','${id}')">${miniAvatar(id,22)}${fnameH(id)}<span class="picked-chip-x">×</span></span>`).join('')}</div></div>`:''}
    <div class="selector-top">
      <input id="search_${key}" class="searchbox" placeholder="Buscar freestyler" value="${esc(filter)}" oninput="state.ui['${fk}']=this.value; render()">
      <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
        <select onchange="state.ui['ssort_${key}']=this.value; render()" aria-label="Ordenar">${['nivel','fama','hype','salario'].map(o=>`<option value="${o}" ${sort===o?'selected':''}>Ordenar por ${o}</option>`).join('')}</select>
        <label class="step-note" style="display:flex;gap:6px;align-items:center;"><input type="checkbox" ${allC?'checked':''} onchange="state.ui['sall_${key}']=this.checked; render()"> Todos los países</label>
      </div>
    </div>
    ${(()=>{ if(!L.competitors.length) return ''; const sv=styleVariety(L.competitors);
      const chips=Object.entries(sv.counts).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${styleTag({style:k,name:k})}<b class="sv-n ${v>=4?'bad':''}">×${v}</b>`).join(' ');
      const ncw={}; if(isWS(key)) L.competitors.forEach(id=>{ const c=fby(id).country; ncw[c]=(ncw[c]||0)+1; }); const natRep=Object.entries(ncw).filter(([c,v])=>v>=4).map(([c])=>c);
      return `${natRep.length?`<div class="sv-box bad"><b>Nacionalidades</b> · ⚠️ ${natRep.join(' y ')} con 4 o más competidores: la comunidad se quejará y la plantilla perderá un 10% de hype.</div>`:''}<div class="sv-box ${sv.rep.length?'bad':(sv.bonus>0?'good':'')}"><div><b>Variedad de estilos</b> · ${sv.rep.length? `⚠️ ${sv.rep.join(' y ')} repetido 4+ veces: la liga empezará con mucho menos hype y la plantilla perderá un 20%` : `${sv.n} estilos distintos: ${sv.bonus>0?'+'+sv.bonus:'+0'} de hype al arrancar`}</div><div class="sv-chips">${chips}</div></div>`; })()}
    <div class="pick-grid">${pool.map(f=>{
      const checked=L.competitors.includes(f.id); const other=!checked && !isWS(key) && signedLeagueOf(s,f.id); const blocked=L.blocked.includes(f.id);
      const fx=isForeign(f,key); const sal=checked? L.contracts[f.id] : contractCost(f,key); const cant=!checked && sal>state.company.money;
      const od=other? ldef(other):null;
      return `<div class="pick-item ${checked?'checked':''} ${other||cant?'disabled':''} ${blocked?'relegated':''}" onclick="toggleSign('${key}','${f.id}')">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}${f.demand&&f.demand.year===s.year?(f.demand.good?'<span class="tag-mini dem good">🔥 Pedido por la comunidad</span>':'<span class="tag-mini dem bad">👎 No lo quieren</span>'):''}<div class="pcountry">${esc(f.country)}${fx?' <span class="tag-mini foreign" title="Extranjero: +'+Math.round((FOREIGN_MULT-1)*100)+'% por viajes">✈ viajes</span>':''}</div>
        ${od?`<span class="league-badge-tag" style="background:${od.badge};color:${od.fg}">${od.short}</span>`:''}${blocked?`<div class="relegated-tag">Descendió · vuelve en ${s.year+1}</div>`:''}</div>
        <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b><br><span class="sal">${moneyK(sal)}</span></div>
      </div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>
  </div>`;
}

/* ---------- internacional ---------- */
function renderIntl(){
  const s=cur(); const b=s.intl.bracket;
  let h=`<div class="detail-head">${leagueHeadLogo(INTL.key)}<h1>${INTL.name} ${s.year}</h1></div>`;
  if(s.intl.champTw) h+=`<div class="lu-again"><button class="btn small" onclick="openChamp('${INTL.key}')">🏆 Reacciones al campeón en X</button></div>`;
  if(s.intl.lu && s.intl.lu.shown) h+=`<div class="lu-again"><button class="btn small" onclick="openLineup('${INTL.key}')">📣 Revelación del line up · ${s.intl.lu.delta>=0?'+':''}${s.intl.lu.delta}% visitas</button></div>`;
  if(!s.intlEnabled && !b) return h+`<div class="empty-state"><span class="big">No activo</span>Necesitas 4 ligas activas para organizarlo.</div>`;
  if(!b){
    const n=s.activeKeys.length;
    return h+(s.phase==='pre'?sedePicker():'')+`<div class="banner">${s.intl.sede?`📍 ${s.intl.sede}. `:''}${s.intl.date!=null?`Se juega el <b>${fmtDay(s.year,s.intl.date)}</b>. `:'Aún sin fecha. '}Clasificación: ${n===4?'top 4 de cada una de las 4 ligas':(n===5?'top 3 de cada liga (15) + el mejor cuarto':'top 2 de cada liga (12) + cupo del campeón vigente + mejores terceros')}. Los cruces se sortean el día del evento.</div>
    ${s.defendingChampion?`<p class="step-note">Campeón vigente: <b>${fnameH(s.defendingChampion)}</b></p>`:''}`;
  }
  const names=['Octavos','Cuartos','Semifinal','Final'];
  h+=`<div class="banner">${s.intl.sede?'📍 '+s.intl.sede+'. ':''}${esc(s.intl.note||'')}</div><div class="bracket-scroll"><div class="bracket">${b.rounds.map((r,ri)=>`<div class="round"><div class="rlabel">${names[ri]||'Ronda '+(ri+1)}</div>${r.map(m=>bm(m)).join('')}</div>`).join('')}
  <div class="round"><div class="rlabel">3er puesto</div>${bm(b.third)}</div></div></div>
  <div class="podium3">
    <div class="podium-card p1"><div class="medal">1º</div><div class="pname">${fnameH(s.intl.champion)}</div><div class="plabel">Campeón</div></div>
    <div class="podium-card p2"><div class="medal">2º</div><div class="pname">${fnameH(s.intl.runnerUp)}</div><div class="plabel">Subcampeón</div></div>
    <div class="podium-card p3"><div class="medal">3º</div><div class="pname">${fnameH(s.intl.third)}</div><div class="plabel">Tercer puesto</div></div>
  </div>`;
  return h;
}
function bm(m){
  const slot=(id)=>`<div class="bslot ${m.result&&m.result.winner===id?'winner':''}"><span style="display:flex;align-items:center;gap:7px;">${miniAvatar(id,20)}${fnameH(id)}</span>${m.result&&m.result.winner===id&&m.result.tiebreak?'<span class="rtag">réplica</span>':''}</div>`;
  return `<div class="bmatch">${slot(m.a)}${slot(m.b)}</div>`;
}

/* ---------- freestylers ---------- */
function renderFreestylers(){
  const s=cur(); const q=state.ui.fq||''; const c=state.ui.fc||''; const sort=state.ui.fs||'nivel';
  let list=state.freestylers.slice();
  if(q) list=list.filter(f=>fMatch(f,q));
  if(c) list=list.filter(f=>f.country===c);
  list.sort(sort==='fama'?(a,b)=>b.fama-a.fama:sort==='hype'?(a,b)=>(b.hype||0)-(a.hype||0):(sort==='salario'?(a,b)=>salaryOf(b)-salaryOf(a):(a,b)=>b.nivel-a.nivel));
  const countries=[...new Set(state.freestylers.map(f=>f.country))].sort();
  return `<div class="detail-head"><h1>Freestylers</h1><span class="tag" style="font-family:var(--font-cond);color:var(--gray)">${state.freestylers.length}</span></div>
  <div class="fl-toolbar">
    <input id="fq" placeholder="Buscar" value="${esc(q)}" oninput="state.ui.fq=this.value; render()">
    <select onchange="state.ui.fc=this.value; render()" aria-label="País"><option value="">Todos los países</option>${countries.map(x=>`<option ${x===c?'selected':''}>${esc(x)}</option>`).join('')}</select>
    <select onchange="state.ui.fs=this.value; render()" aria-label="Ordenar">${['nivel','fama','hype','salario'].map(o=>`<option value="${o}" ${o===sort?'selected':''}>Por ${o}</option>`).join('')}</select>
  </div>
  <div class="fl-grid">${list.map(f=>{ const lk=signedLeagueOf(s,f.id); const d=lk?ldef(lk):null;
    return `<div class="fl-card" onclick="showFreestyler('${f.id}')"><div class="fl-avatar" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
    <div style="min-width:0;"><div class="fname">${nameH(f)}</div><div class="fcountry">${esc(f.country)}${d?` <span class="tag-mini" style="background:${d.badge};color:${d.fg}">${d.short}</span>`:''}</div></div>
    <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b><br><span class="sal">${moneyK(salaryOf(f))}</span></div></div>`; }).join('')}</div>`;
}
function titlesOf(id){
  const t=[];
  state.seasons.forEach(s=>{
    if(s.phase==='pre') return;
    s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(L.finished && L.finalStandings[0]===id) t.push(`${ldef(k).name} ${s.year}`); });
    if(s.intl.champion===id) t.push(`${INTL.name} ${s.year}`);
    if(rbOn(s)){ s.rb.events.forEach(e=>{ if(e.champion===id) t.push(`${rbdef(e.key).name} ${s.year}`); }); if(s.rb.inter.champion===id) t.push(`${RB_INT.name} ${s.year}`); }
    (s.under||[]).forEach(e=>{ if(e.champion===id) t.push(`${udef(e.key).name} ${s.year}`); });
  });
  return t;
}
function showFreestyler(id){
  const f=fby(id); const s=cur(); const lk=signedLeagueOf(s,id); const t=titlesOf(id);
  openModal(`<div class="profile-top" style="margin-bottom:10px;">
    <button class="profile-avatar avatar-edit" style="${avatarDivStyle(f)}" onclick="pickImage({type:'photo', id:'${id}'})" aria-label="Cambiar foto">${avatarContent(f)}<em>Foto</em></button>
    <div style="min-width:0; flex:1;"><h3 style="margin:0">${nameH(f)}</h3><div class="pc">${esc(f.country)}${lk?' · '+ldef(lk).name:' · Libre'}</div>
    <div class="avatar-upload-btns"><button class="btn small" onclick="pickImage({type:'photo', id:'${id}'})">${f.photo?'Cambiar foto':'Subir foto'}</button>${f.photo?`<button class="btn small danger" onclick="removePhoto('${id}')">Quitar foto</button>`:''}</div></div></div>
  <label class="field-label" for="fs_name">Nombre</label>
  <div class="formrow"><input id="fs_name" value="${esc(f.name)}" maxlength="40" onkeydown="if(event.key==='Enter') renameFreestyler('${id}')"><button class="btn" onclick="renameFreestyler('${id}')">Guardar nombre</button></div>
  <div class="stat-bars">
    <div class="hype-row">Nivel <div class="hype"><i style="width:${f.nivel}%;background:var(--red-bright)"></i></div><b>${f.nivel}</b></div>
    <div class="hype-row">Fama <div class="hype"><i style="width:${f.fama}%;background:var(--gold)"></i></div><b>${f.fama}</b></div>
    <div class="hype-row">Hype <div class="hype"><i style="width:${f.hype||0}%;background:#b26bff"></i></div><b>${f.hype!=null?Math.round(f.hype):'—'}</b></div>
  </div>
  ${attrBars(f)}
  <div class="style-box">${styleTag(f)}<span>${esc(STYLES[styleOf(f)].txt)}</span></div>
  ${state.ui.devStats?`<div class="dev-box"><span class="field-label" style="color:#e0b23c">DEV · editar parámetros</span>
    <div class="formrow"><label class="dev-field">Nivel<input id="dev_nivel" type="number" min="1" max="99" value="${f.nivel}"></label><label class="dev-field">Fama<input id="dev_fama" type="number" min="1" max="99" value="${f.fama}"></label><label class="dev-field">Hype<input id="dev_hype" type="number" min="1" max="99" value="${f.hype!=null?Math.round(f.hype):50}"></label><label class="dev-field">Estilo<select id="dev_style">${STYLE_NAMES.map(n=>`<option ${styleOf(f)===n?'selected':''}>${n}</option>`).join('')}</select></label><label class="dev-check" style="width:auto;margin:0 0 8px;"><input id="dev_legend" type="checkbox" ${f.legend?'checked':''}> Leyenda (oculto)</label><button class="btn" onclick="devSaveStats('${id}')">Guardar</button></div></div>`:''}
  <div class="sum-row"><span>Pide por temporada</span><b>${money(salaryOf(f))}</b></div>
  <div class="sum-row"><span>Títulos</span><span>${t.length? t.map(esc).join(', ') : '—'}</span></div>
  <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`);
}
function renameFreestyler(id){
  const v=(document.getElementById('fs_name').value||'').trim();
  if(!v){ toast('El nombre no puede quedar vacío.'); return; }
  if(state.freestylers.some(f=>f.id!==id && f.name.toLowerCase()===v.toLowerCase())){ toast('Ya hay un freestyler con ese nombre.'); return; }
  fby(id).name=v; toast('Nombre guardado.'); render(); showFreestyler(id);
}
function removePhoto(id){ fby(id).photo=null; render(); showFreestyler(id); }

/* ---------- detalle de una batalla jugada ---------- */
// Nombre corto del juez para cabeceras (primera palabra; "El Sordo Ruiz" → "El Sordo")
function judgeShort(id){ const j=JUDGE_BY_ID[id]; if(!j) return 'Juez'; const p=j.name.split(' '); return /^(el|la|los|las)$/i.test(p[0]) && p.length>1 ? p[0]+' '+p[1] : p[0]; }
// Celdas <th> con los jueces de una batalla. Sin m.d.j (batallas anteriores a la fase 1) → "Juez 1" a "Juez 5"
function judgeHeads(m){ const ids=(m && m.d && Array.isArray(m.d.j) && m.d.j.length===5) ? m.d.j : null;
  return [0,1,2,3,4].map(j=> ids && JUDGE_BY_ID[ids[j]] ? `<th class="jh">${esc(judgeShort(ids[j]))}</th>` : `<th>Juez ${j+1}</th>`).join(''); }
// Localiza la batalla: mi numérico = cruce de la jornada j; 'ex' = exhibición; 'fex' = exhibición obligada
function battleAt(key, j, mi){ const s=cur(); const L=s && s.leagues && s.leagues[key]; if(!L) return null;
  if(mi==='ex') return L.exhib && L.exhib[j] && L.exhib[j].m || null;
  if(mi==='fex') return L.fexhib && L.fexhib[j] && L.fexhib[j].m || null;
  return (L.rounds[j]||[])[mi] || null; }
function showBattle(key, j, mi){
  const m=battleAt(key, j, mi); if(!m || !m.result) return;
  const A=fby(m.a), B=fby(m.b); if(!A || !B) return;
  const wa=m.result.winner===m.a;
  const head=`<div class="bt-head"><div class="bt-side ${wa?'won':''}">${miniAvatar(m.a,36)}<div><div class="bt-name">${nameH(A)}</div>${styleTag(A)}</div></div>
    <div class="bt-vs">VS</div>
    <div class="bt-side r ${wa?'':'won'}"><div><div class="bt-name">${nameH(B)}</div>${styleTag(B)}</div>${miniAvatar(m.b,36)}</div></div>`;
  const label=`Gana <b>${fnameH(m.result.winner)}</b>${m.result.tiebreak?' <span class="rtag">réplica</span>':''}${m.recup?' <span class="rtag">recuperativa</span>':''}${m.ex?' <span class="rtag">exhibición</span>':''}`;
  // Sin notas por juez (eliminatorias, Under o batallas sin m.d): solo el resultado
  if(!m.d || !m.d.s){
    openModal(`<h3 style="margin-bottom:10px">Batalla</h3>${head}<p class="bt-res">${label}${m.lb?' · '+esc(m.lb):''}</p>
      <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`); return; }
  const RS=roundsOf(m), longF=RS===ROUND_SETS.long, p=ptbOf(m), [tA,tB]=judgeTotals(m), cjA=countedJudges(m,0), cjB=countedJudges(m,1);
  const cell=(a,b)=>`<span class="${a>b?'hi':''}">${fpt(a)}</span><i>-</i><span class="${b>a?'hi':''}">${fpt(b)}</span>`;
  const rows=RS.map((R,r)=>`<tr><td class="fm-rn">${esc(R.n)}${longF?` <small>/${R.max}</small>`:''}</td>${[0,1,2,3,4].map(j=>`<td>${cell(dScore(m,r,0,j), dScore(m,r,1,j))}</td>`).join('')}</tr>`).join('');
  const nc='title="No cuenta para el PTB (nota más alta o más baja)"';
  const tot=`<tr class="fm-tot"><td class="fm-rn">Total</td>${[0,1,2,3,4].map(j=>`<td><span class="${tA[j]>tB[j]?'hi':''} ${cjA.has(j)?'':'nc'}" ${cjA.has(j)?'':nc}>${fpt(tA[j])}</span><i>-</i><span class="${tB[j]>tA[j]?'hi':''} ${cjB.has(j)?'':'nc'}" ${cjB.has(j)?'':nc}>${fpt(tB[j])}</span></td>`).join('')}</tr>`;
  const votes=`<tr class="fm-votes"><td class="fm-rn">Voto</td>${[0,1,2,3,4].map(j=>{ const v=m.d.v[j]; return `<td>${v==='R'?'<span class="fm-vr">Réplica</span>':`<span class="fm-vw">${fnameH(v==='A'?m.a:m.b)}</span>`}</td>`; }).join('')}</tr>`;
  const hand=m.d.h?`<p class="bt-res">Réplica · mano alzada ${m.d.h[0]}-${m.d.h[1]}</p>`:'';
  openModal(`<h3 style="margin-bottom:10px">Batalla${longF?' · formato largo':''}</h3>${head}
    <p class="bt-res">${label}${m.lb?' · '+esc(m.lb):''} · PTB <b>${fpt(p[0])}</b>–<b>${fpt(p[1])}</b>${m.views?' · ▶ '+fmtViews(m.views):''}</p>${hand}
    <div class="fm-table-wrap bt-table"><table class="fm-judges"><thead><tr><th>Ronda</th>${judgeHeads(m)}</tr></thead><tbody>${rows}${tot}${votes}</tbody></table></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, 'wide');
}
// Barras de los cinco atributos (valor mostrado con tope 99). Solo lectura.
function attrBars(f){ return `<div class="attr-bars"><span class="attr-title">Atributos</span>${ATTR_KEYS.map(k=>{ const v=attrShown(f,k); return `<div class="hype-row attr-row"><span class="attr-lbl">${esc(ATTR_LABELS[k])}</span><div class="hype"><i style="width:${v}%"></i></div><b>${v}</b></div>`; }).join('')}</div>`; }

/* ---------- imágenes (fotos y logos) ---------- */
function pickImage(target){ state.ui.imgTarget=target; document.getElementById('imgFileInput').click(); }
function onImageFile(ev){
  const file=ev.target.files[0]; ev.target.value=''; const t=state.ui.imgTarget; if(!file||!t) return;
  if(!file.type.startsWith('image/')){ toast('Ese archivo no es una imagen.'); return; }
  const r=new FileReader();
  r.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      let url;
      if(t.type==='photo') url=resizeImage(img, 220, true, 'image/jpeg');
      else url=resizeImage(img, 256, false, file.type==='image/jpeg'?'image/jpeg':'image/png');
      if(t.type==='photo'){ fby(t.id).photo=url; render(); showFreestyler(t.id); }

    };
    img.onerror=()=>toast('No se pudo leer esa imagen.');
    img.src=r.result;
  };
  r.readAsDataURL(file);
}
// foto: recorte cuadrado centrado; logo: cabe entero manteniendo transparencia
function resizeImage(img, max, square, mime){
  const c=document.createElement('canvas'); const ctx=c.getContext('2d');
  if(square){
    const side=Math.min(img.width,img.height); c.width=c.height=Math.min(max,side);
    ctx.drawImage(img,(img.width-side)/2,(img.height-side)/2,side,side,0,0,c.width,c.height);
  } else {
    const k=Math.min(1, max/Math.max(img.width,img.height)); c.width=Math.round(img.width*k); c.height=Math.round(img.height*k);
    ctx.drawImage(img,0,0,c.width,c.height);
  }
  return c.toDataURL(mime, 0.85);
}
/* ---------- modo desarrollador (temporal) ---------- */
function openDev(){
  const c=state.company;
  openModal(`<h3>Modo desarrollador</h3>
  <p class="step-note" style="margin-bottom:12px;">Herramienta temporal para probar. Los cambios se aplican al momento.</p>
  <label class="field-label" for="dev_money">Dinero (€)</label>
  <div class="formrow"><input id="dev_money" type="number" step="1000" value="${Math.round(c.money)}"></div>
  <div class="formrow" style="gap:6px;">${[50000,250000,1000000].map(v=>`<button class="btn small" onclick="document.getElementById('dev_money').value=${Math.round(c.money)}+${v}">+${moneyK(v)}</button>`).join('')}</div>
  <span class="field-label">Estrellas</span>
  <div class="formrow" style="gap:6px;">${[0,1,2,3,4,5].map(n=>`<button class="btn small ${state.ui.devStars===n||(state.ui.devStars==null&&c.stars===n)?'primary':''}" onclick="devPickStars(${n})">${n}★</button>`).join('')}</div>
  <label class="field-label" for="dev_rep">Reputación (se ajusta sola al elegir estrellas)</label>
  <div class="formrow"><input id="dev_rep" type="number" value="${Math.round(c.reputation)}"></div>
  <div class="modal-actions" style="flex-wrap:wrap;">
    <label class="dev-check" style="margin-right:auto;"><input type="checkbox" ${state.ui.devStats?'checked':''} onchange="state.ui.devStats=this.checked"> Editar nivel y fama en la ficha de cada freestyler</label>
    <button class="btn" onclick="devNewFreestyler()">Añadir freestyler</button>
    <button class="btn danger" onclick="devConfirmReset()">Reiniciar juego desde 0</button>
    ${cur().phase==='pre'?`<button class="btn" onclick="devApply(); devAutoSign()">Aplicar y autocompletar fichajes</button>`:''}
    <button class="btn" onclick="state.ui.devStars=null; closeModal()">Cancelar</button>
    <button class="btn primary" onclick="devApply()">Aplicar</button>
  </div>`);
}
function devPickStars(n){
  const money=document.getElementById('dev_money').value;
  state.ui.devStars=n; openDev();
  document.getElementById('dev_money').value=money;
  document.getElementById('dev_rep').value=STAR_THRESHOLDS[n];
}
function devApply(){
  const c=state.company;
  const m=parseFloat(document.getElementById('dev_money').value);
  const r=parseFloat(document.getElementById('dev_rep').value);
  if(!isNaN(m)) c.money=m;
  const starsBefore=c.stars;
  if(state.ui.devStars!=null) c.stars=state.ui.devStars;
  if(!isNaN(r)){ c.reputation=Math.max(0,r); }
  if(c.stars>starsBefore) sponsorOffers(c.stars, 3+c.stars);
  state.ui.devStars=null;
  closeModal(); toast(`DEV: ${money(c.money)} · ${c.stars}★ · ${Math.round(c.reputation)} rep.`); render();
}
function devSaveStats(id){
  const f=fby(id);
  const n=parseInt(document.getElementById('dev_nivel').value,10), fa=parseInt(document.getElementById('dev_fama').value,10);
  if(isNaN(n)||isNaN(fa)){ toast('Pon números entre 1 y 99.'); return; }
  const hy=parseInt(document.getElementById('dev_hype').value,10); if(!isNaN(hy)) f.hype=clamp(hy,1,99);
  setNivel(f, clamp(n,1,99)); f.fama=clamp(fa,1,99); f.legend=document.getElementById('dev_legend').checked; const se=document.getElementById('dev_style'); if(se) f.style=se.value;
  toast(`${f.name}: nivel ${f.nivel}, fama ${f.fama}, hype ${Math.round(f.hype)}. Su salario pasa a ${money(salaryOf(f))} (los contratos ya firmados no cambian).`);
  render(); showFreestyler(id);
}
function devNewFreestyler(){
  state.ui.devStars=null;
  const countries=[...new Set([...LEAGUES.flatMap(l=>l.countries), ...state.freestylers.map(f=>f.country)])].sort((a,b)=>a.localeCompare(b,'es'));
  openModal(`<h3>Añadir freestyler</h3>
  <label class="field-label" for="nf_name">Nombre</label>
  <div class="formrow"><input id="nf_name" maxlength="40" placeholder="Nombre artístico"></div>
  <label class="field-label" for="nf_country">País</label>
  <div class="formrow"><input id="nf_country" list="nf_countries" placeholder="Elige o escribe un país"><datalist id="nf_countries">${countries.map(c=>`<option value="${esc(c)}">`).join('')}</datalist></div>
  <div class="formrow"><label class="dev-field">Nivel<input id="nf_nivel" type="number" min="1" max="99" value="70"></label><label class="dev-field">Fama<input id="nf_fama" type="number" min="1" max="99" value="60"></label><label class="dev-field">Hype<input id="nf_hype" type="number" min="1" max="99" value="50"></label></div>
  <label class="dev-check"><input id="nf_legend" type="checkbox"> Leyenda (oculto)</label>
  <p class="step-note">La foto se sube después desde su ficha. Para que salga por defecto en una liga, usa un país de esa liga (Caribe acepta "Caribe", Venezuela, Cuba, Puerto Rico, República Dominicana y Panamá).</p>
  <div class="modal-actions"><button class="btn" onclick="openDev()">Volver</button><button class="btn" onclick="devCreateFreestyler(true)">Crear y añadir otro</button><button class="btn primary" onclick="devCreateFreestyler(false)">Crear</button></div>`);
  setTimeout(()=>{ const el=document.getElementById('nf_name'); if(el) el.focus(); },50);
}
function devCreateFreestyler(another){
  const name=(document.getElementById('nf_name').value||'').trim();
  const country=(document.getElementById('nf_country').value||'').trim();
  const nivel=parseInt(document.getElementById('nf_nivel').value,10), fama=parseInt(document.getElementById('nf_fama').value,10);
  if(!name){ toast('Ponle un nombre.'); return; }
  if(!country){ toast('Elige o escribe un país.'); return; }
  if(isNaN(nivel)||isNaN(fama)){ toast('Nivel y fama tienen que ser números entre 1 y 99.'); return; }
  if(state.freestylers.some(f=>f.name.toLowerCase()===name.toLowerCase())){ toast('Ya existe un freestyler con ese nombre.'); return; }
  const f={id:uid('f'), name, country, nivel:clamp(nivel,1,99), fama:clamp(fama,1,99), hype:clamp(parseInt(document.getElementById('nf_hype').value,10)||50,1,99), legend:document.getElementById('nf_legend').checked};
  state.freestylers.push(f);
  toast(`${f.name} añadido (${f.country}, pide ${money(salaryOf(f))}).`);
  render();
  if(another){ devNewFreestyler(); document.getElementById('nf_country').value=country; }
  else showFreestyler(f.id);
}
function devConfirmReset(){
  state.ui.devStars=null;
  openModal(`<h3>Reiniciar juego desde 0</h3><p class="step-note">Se borra todo: empresa, temporadas, freestylers (con sus nombres y fotos) y logos. Vuelves a la pantalla de nueva partida.</p>
  <div class="modal-actions"><button class="btn" onclick="openDev()">Volver</button><button class="btn danger" onclick="doReset()">Reiniciar todo</button></div>`);
}
function devAutoSign(){
  const s=cur(); if(s.phase!=='pre') return;
  s.activeKeys.forEach(k=>{
    const L=s.leagues[k]; const def=ldef(k);
    const pool=state.freestylers.filter(f=>!signedLeagueOf(s,f.id) && !L.blocked.includes(f.id)).sort((a,b)=>(def.countries.includes(b.country)-def.countries.includes(a.country)) || b.nivel-a.nivel);
    for(const f of pool){ if(L.competitors.length>=10) break; if(state.company.money<contractCost(f,k)) continue; toggleSign(k,f.id); }
  });
  render();
}

/* ---------- historial ---------- */
function renderHistory(){
  const done=state.seasons.filter(s=>s.phase==='done').slice().reverse();
  return `<div class="detail-head"><h1>Historial</h1></div>
  ${done.length? `<div class="hist-list">${done.map(s=>`<div class="hist-item" onclick="showSeasonSummary(${s.number})"><div class="hn">${s.year}</div>
    <div class="hstat">${s.activeKeys.map(k=>`${ldef(k).short}: ${fnameH(s.leagues[k].finalStandings[0])}`).join(' · ')}${s.intl.champion?` · INTL: ${fnameH(s.intl.champion)}`:''}</div>${starsHtml(s.summary?s.summary.starsAfter:0)}</div>`).join('')}</div>`
  : `<div class="empty-state"><span class="big">Sin temporadas cerradas</span>Aquí aparecerán los campeones y el balance de cada año.</div>`}
  <div class="section-title"><h2>Partida</h2></div>
  <div style="display:flex; gap:8px; flex-wrap:wrap;">
    <button class="btn" onclick="exportGame()">Exportar partida</button>
    <button class="btn" onclick="document.getElementById('gameFileInput').click()">Cargar partida</button>
    <button class="btn danger" onclick="resetGame()">Borrar partida</button>
  </div>
  <p class="step-note" style="margin-top:8px;">La partida se guarda sola en este navegador. Exporta para tener copia o pasarla a otro dispositivo.</p>`;
}
function showSeasonSummary(num){
  const s=state.seasons.find(x=>x.number===num); if(!s) return;
  const m=s.summary; if(!m) return;
  const net=m.income-m.salaries-m.production;
  openModal(`<h3>Temporada ${s.year}</h3>
    <div class="sum-grid"><div class="sum-left">${starsHtml(m.starsAfter)}
    <div class="sum-sec">Campeones</div>${champRows(s)}
    <div class="sum-sec">Balance</div>
    <div class="sum-row"><span>Ingresos</span><b class="pos-v">${money(m.income)}</b></div>
    <div class="sum-row"><span>Gastos</span><b class="neg-v">−${money(m.salaries+m.production)}</b></div>
    <div class="sum-row sum-total"><span>Balance</span><b class="${net>=0?'pos-v':'neg-v'}">${money(net)}</b></div>
    <div class="sum-row"><span>Reputación</span><b>${m.repDelta>=0?'+':''}${Math.round(m.repDelta)}</b></div>
    <div class="sum-row"><span>Meses sin eventos</span><b>${m.emptyMonths}</b></div>
    </div><div class="sum-right">${sumRight(s)}</div></div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, 'summary');
}

/* ---------- init ---------- */
/* =========================================================================
   RED BULL BATALLA (competencia externa, calendario automático)
========================================================================= */
const RB_NATS = [
  {key:'rb_esp', name:'Red Bull España',        short:'ESP', countries:['España']},
  {key:'rb_arg', name:'Red Bull Argentina',     short:'ARG', countries:['Argentina']},
  {key:'rb_chi', name:'Red Bull Chile',         short:'CHI', countries:['Chile']},
  {key:'rb_mex', name:'Red Bull México',        short:'MEX', countries:['México']},
  {key:'rb_col', name:'Red Bull Colombia',      short:'COL', countries:['Colombia']},
  {key:'rb_per', name:'Red Bull Perú',          short:'PER', countries:['Perú']},
  {key:'rb_usa', name:'Red Bull EEUU',          short:'USA', countries:['EEUU','Canadá']},
  {key:'rb_sud', name:'Red Bull Sudamérica',    short:'SUD', countries:['Venezuela','Bolivia','Ecuador','Uruguay','Paraguay','Brasil','Sudamérica']},
  {key:'rb_cen', name:'Red Bull Centroamérica', short:'CEN', countries:['Centroamérica','Caribe','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua']},
];
const RB_PLZ = {key:'rb_plz', name:'Torneo de Plazas', short:'PLZ'};
const RB_INT = {key:'rb_int', name:'Red Bull Internacional', short:'INT'};
const RB_ALL = [...RB_NATS, RB_PLZ];
function rbdef(k){ return k===RB_INT.key ? RB_INT : RB_ALL.find(x=>x.key===k); }
function isRB(k){ return typeof k==='string' && k.startsWith('rb_'); }
function rbOn(s){ return !!(s && s.rb && !s.rb.off); }
function evName(k){ return isRB(k) ? rbdef(k).name : ldef(k).name; }

const RB_PARTICIPATION = 0.6;            // prob. de que un freestyler apto se apunte esa temporada
const RB_FIRST_PODIUM = ['Chuty','Aczino','Gazir'];
const SEDES = ['España','Argentina','Perú','México','Chile','EEUU','Colombia','Venezuela'];
const SEDE_W = {'EEUU':0.25, 'Venezuela':0.25};
const LOCAL_BONUS = 6;                   // nivel extra del local en una Internacional
const RB_POOL_TARGET = 26;               // mínimo de aptos por nacional (se rellena con freestylers de plaza)

function quality(f){ return 0.6*f.nivel + 0.4*f.fama; }
function rbDot(k){ return `<img class="lg-logo rb-logo" src="${RB_LOGO}" alt="" style="width:18px;height:18px">`; }
function anyDot(k){ return isRB(k) ? rbDot(k) : leagueDot(k); }

/* ---- cantera real: quita los genéricos y añade los reales que falten ---- */
const COUNTRY_FIX = {'Reverse':'EEUU','Switch':'Ecuador','Éxodo Lirical':'República Dominicana','SNK':'Costa Rica','Ritmodelia':'Guatemala','Zaki':'El Salvador','Aldahir':'Panamá'};
function syncRealPool(){
  if(state.company && (state.company.dbv||0)<3){
    const fixes={'Azeta':[45,35],'Godlemon':[45,35],'Ortiz':[45,35]};
    state.freestylers.forEach(f=>{ if(STYLE_PRESET[f.name]) f.style=STYLE_PRESET[f.name]; if(fixes[f.name]){ f.nivel=fixes[f.name][0]; f.fama=fixes[f.name][1]; } if(f.name==='Yartzi') f.country='Puerto Rico'; });
    state.company.dbv=3; }
  if(state.company && (state.company.dbv||0)<4){   // v4: atributos por freestyler y jueces por liga. Aditivo: no borra nada
    state.freestylers.forEach(ensureAttrs);
    state.seasons.forEach(sn=>Object.values(sn.leagues||{}).forEach(judgesOf));
    state.company.dbv=4; }
  if(state.company && (state.company.dbv||0)<5){   // v5: atributos regenerados con tope interno 110 (misma media = nivel)
    state.freestylers.forEach(f=>{ f.attrs=attrsFromNivel(f.nivel, styleOf(f), f.name); f.nivel=nivelFromAttrs(f.attrs); });
    state.company.dbv=5; }
  const s=cur(); const ref=new Set();
  if(s){ Object.values(s.leagues||{}).forEach(L=>L.competitors.forEach(id=>ref.add(id)));
    if(rbOn(s)){ s.rb.events.forEach(e=>e.participants.forEach(id=>ref.add(id))); (s.rb.inter.qualifiers||[]).forEach(id=>ref.add(id)); (s.rb.interPodium||[]).forEach(id=>ref.add(id)); } }
  state.freestylers=state.freestylers.filter(f=>!f.plaza || ref.has(f.id));
  state.freestylers.forEach(f=>{ if(!f.photo && presetPhoto(f.name)) f.photo=presetPhoto(f.name); if(f.hype==null) f.hype=randHype(f.fama); if(!STYLES[f.style]) f.style=defaultStyle(f.name); ensureAttrs(f); const fx=COUNTRY_FIX[f.name]; if(fx && (f.country==='México'||f.country==='Caribe')) f.country=fx; });
  const have=new Set(state.freestylers.map(f=>f.name.toLowerCase()));
  Object.entries(REAL_PRESET).forEach(([country,list])=> list.forEach(([name,nivel,fama])=>{
    if(!have.has(name.toLowerCase())) state.freestylers.push(ensureAttrs({id:uid('f'), name, country, nivel, fama, hype:randHype(fama), legend:PRESET_LEGENDS.includes(name), style:defaultStyle(name)}));
  }));
}
function isPrimeDay(y,d){ const w=dayToDate(y,d).getUTCDay(); return w===5||w===6||w===0; }   // viernes, sábado o domingo
const WEEKDAY_TICKET = 0.7;   // taquilla de lunes a jueves

/* ---- sedes ---- */
function recentSedes(seasons, kind){
  return seasons.slice(-2).map(s=> kind==='rb' ? (rbOn(s) && s.rb.inter.sede) : (s.intlEnabled && s.intl && s.intl.sede)).filter(Boolean);
}
function pickSede(excluded){
  const opts=SEDES.filter(x=>!excluded.includes(x));
  const tot=opts.reduce((a,x)=>a+(SEDE_W[x]||1),0); let r=Math.random()*tot;
  for(const x of opts){ r-=(SEDE_W[x]||1); if(r<=0) return x; }
  return opts[0];
}
function fmsSedeBlocked(){ const s=cur(); const i=state.seasons.indexOf(s); return recentSedes(state.seasons.slice(0,i),'fms'); }
function setIntlSede(c){
  const s=cur(); if(s.phase!=='pre') return;
  if(fmsSedeBlocked().includes(c)){ toast(`${c} fue sede hace menos de 3 temporadas.`); return; }
  s.intl.sede=c; render();
}
function sedePicker(){
  const s=cur(); const blocked=fmsSedeBlocked();
  return `<div class="sede-picker"><span class="field-label">Sede del ${INTL.name}</span>
    <div class="sede-row">${SEDES.map(c=>{ const b=blocked.includes(c);
      return `<button class="seg ${s.intl.sede===c?'on':''} ${b?'locked':''}" onclick="setIntlSede('${c}')" ${b?'aria-disabled="true" title="Sede reciente"':''} aria-pressed="${s.intl.sede===c}">${c}</button>`; }).join('')}</div>
    <p class="step-note">Los locales ganan algo de nivel en sus batallas. Una sede no puede repetirse hasta pasadas 2 temporadas.</p></div>`;
}

/* ---- calendario Red Bull ---- */
function rbGenerateSchedule(s, prevSeasons){
  const diy=daysInYear(s.year);
  const taken=new Set(seasonEvents(s).map(e=>e.day));
  const order=shuffle(RB_ALL.map(x=>x.key));
  const start=25, end=300, step=(end-start)/(order.length-1);
  const events=order.map((k,i)=>{
    let d=Math.round(start+i*step+rnd(-6,6)); while(taken.has(d) || !isPrimeDay(s.year,d)) d++; taken.add(d);
    return {key:k, day:d, participants:[], seeds:[], bracket:null, champion:null, runnerUp:null, third:null, fourth:null, played:false};
  });
  let id=diy-rint(14,28); while(taken.has(id) || !isPrimeDay(s.year,id)) id--;
  s.rb={ events, drawn:false, interPodium:[],
    inter:{day:id, voteDay:id-7, sede:pickSede(recentSedes(prevSeasons,'rb')), voted:false, candidates:[], userVotes:[], votedIn:[],
           qualifiers:[], reasons:{}, bracket:null, champion:null, runnerUp:null, third:null, fourth:null, played:false} };
}
function rbEventsList(s){
  if(!rbOn(s)) return [];
  return [...s.rb.events.map(e=>({day:e.day, key:e.key})), {day:s.rb.inter.day, key:RB_INT.key}].sort((a,b)=>a.day-b.day);
}
function rbByDay(s){ const m={}; rbEventsList(s).forEach(e=>m[e.day]=e); return m; }
function rbEvent(s,k){ return k===RB_INT.key ? s.rb.inter : s.rb.events.find(e=>e.key===k); }

/* ---- sorteo de participantes ---- */
function probPick(sorted, n){
  if(sorted.length<=n) return sorted.map(f=>f.id);
  const chosen=[]; const taken=new Set(); let guard=0;
  while(chosen.length<n && guard++<50){
    for(const f of sorted){ if(chosen.length>=n) break; if(taken.has(f.id)) continue; if(Math.random()<RB_PARTICIPATION){ chosen.push(f.id); taken.add(f.id); } }
  }
  return chosen;
}
function rbPrevSeason(s){ const i=state.seasons.indexOf(s); return i>0 ? state.seasons[i-1] : null; }
function rbFirstPodium(){
  const ids=RB_FIRST_PODIUM.map(n=>state.freestylers.find(f=>f.name.toLowerCase()===n.toLowerCase())).filter(Boolean).map(f=>f.id);
  state.freestylers.slice().sort((a,b)=>b.fama-a.fama).forEach(f=>{ if(ids.length<3 && !ids.includes(f.id)) ids.push(f.id); });
  return ids;
}
function rbDraw(s){
  if(!rbOn(s) || s.rb.drawn) return;
  const prev=rbPrevSeason(s); const prevRB=rbOn(prev) ? prev.rb : null;
  s.rb.interPodium = (prevRB && prevRB.inter.played) ? [prevRB.inter.champion, prevRB.inter.runnerUp, prevRB.inter.third].filter(id=>id&&fby(id)) : rbFirstPodium();
  const isJal=id=>(fby(id)||{}).name==='Jaloner';
  s.rb.interPodium=s.rb.interPodium.filter(id=>!isJal(id));
  const used=new Set(s.rb.interPodium);
  const prevPodium0=k=>{ const e=prevRB && prevRB.events.find(x=>x.key===k); return e&&e.played ? [e.champion,e.runnerUp,e.third] : []; };
  // algunos no quieren ir a Red Bull esta temporada (salvo que ya estén clasificados por podio; Jaloner nunca va)
  { const seeded=new Set([...s.rb.interPodium, ...RB_ALL.flatMap(d=>prevPodium0(d.key))]);
    state.freestylers.forEach(f=>{ const p=RB_DECLINE[f.name]; if(!p) return; if(f.name!=='Jaloner' && seeded.has(f.id)) return; if(Math.random()<p) used.add(f.id); }); }
  const prevPodium=k=>{ const e=prevRB && prevRB.events.find(x=>x.key===k); return e&&e.played ? [e.champion,e.runnerUp,e.third] : []; };
  // EEUU y Centroamérica comparten cantera: un mismo freestyler puede ir a una u otra, nunca a las dos
  const shared=['rb_usa','rb_cen'];
  const elig=(def,f)=> shared.includes(def.key) ? shared.some(k=>rbdef(k).countries.includes(f.country)) : def.countries.includes(f.country);
  // primero los podios de todas las nacionales
  const seedsBy={};
  RB_NATS.forEach(def=>{ const sd=prevPodium(def.key).filter(id=>id && fby(id) && !used.has(id) && elig(def,fby(id))); sd.forEach(id=>used.add(id)); seedsBy[def.key]=sd; });
  // Torneo de Plazas (se sortea antes que las nacionales): un competidor por país, sin estrellas (como mucho 2 de +83 de fama).
  // El podio anterior entra directo y no cuenta para la regla de un país por edición.
  { const pev=rbEvent(s,RB_PLZ.key);
    const seeds=prevPodium(RB_PLZ.key).filter(id=>id && fby(id) && !used.has(id)); seeds.forEach(id=>used.add(id));
    const byCountry={}; state.freestylers.filter(f=>!used.has(f.id)).forEach(f=>{ (byCountry[f.country]=byCountry[f.country]||[]).push(f); });
    const need=16-seeds.length; const countries=shuffle(Object.keys(byCountry)); let starsLeft=Math.floor(Math.random()*3); const picked=[];
    for(const c of countries){ if(picked.length>=need) break;
      const list=byCountry[c].slice().sort((a,b)=>quality(b)-quality(a));
      const low=list.filter(f=>f.fama<=83), high=list.filter(f=>f.fama>83);
      let f=null;
      if(high.length && starsLeft>0 && Math.random()<0.35){ f=high[Math.floor(Math.random()*high.length)]; starsLeft--; }
      else if(low.length){ const top=low.slice(0, Math.max(3, Math.ceil(low.length*0.5))); f=top[Math.floor(Math.random()*top.length)]; }
      if(f){ picked.push(f.id); used.add(f.id); } }
    // si no hay países suficientes, se completa (sin estrellas) repitiendo país lo mínimo posible
    if(picked.length<need){ const extra=state.freestylers.filter(f=>!used.has(f.id) && f.fama<=83).sort((a,b)=>quality(b)-quality(a));
      const cnt={}; picked.forEach(id=>{ const c=fby(id).country; cnt[c]=(cnt[c]||0)+1; });
      extra.sort((a,b)=>(cnt[a.country]||0)-(cnt[b.country]||0)); for(const f of extra){ if(picked.length>=need) break; picked.push(f.id); used.add(f.id); cnt[f.country]=(cnt[f.country]||0)+1; } }
    pev.seeds=seeds; pev.participants=[...seeds, ...picked]; }
  const order=RB_NATS.filter(d=>!shared.includes(d.key));
  const sh=shuffle(RB_NATS.filter(d=>shared.includes(d.key)));
  // las dos compartidas eligen alternándose, para que ninguna se quede con todos los buenos
  order.forEach(def=>{
    const ev=rbEvent(s,def.key); const seeds=seedsBy[def.key];
    const pool=state.freestylers.filter(f=>elig(def,f) && !used.has(f.id)).sort((a,b)=>quality(b)-quality(a));
    const picked=probPick(pool, 16-seeds.length); picked.forEach(id=>used.add(id));
    ev.seeds=seeds; ev.participants=[...seeds, ...picked];
  });
  sh.forEach(def=>{ const ev=rbEvent(s,def.key); ev.seeds=seedsBy[def.key]; ev.participants=[...ev.seeds]; });
  let guard=0;
  while(sh.some(def=>rbEvent(s,def.key).participants.length<16) && guard++<400){
    let progress=false;
    for(const def of sh){
      const ev=rbEvent(s,def.key); if(ev.participants.length>=16) continue;
      const pool=state.freestylers.filter(f=>elig(def,f) && !used.has(f.id)).sort((a,b)=>quality(b)-quality(a));
      const pk=probPick(pool,1); if(pk.length){ ev.participants.push(pk[0]); used.add(pk[0]); progress=true; }
    }
    if(!progress) break;
  }
  // si algún torneo no llega a 16 (cantera muy corta), se completa con libres
  [...s.rb.events].forEach(ev=>{
    if(ev.participants.length>=16) return;
    const near=['México','Venezuela','Colombia','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica'];
    const pref=f=> (ev.key==='rb_usa'||ev.key==='rb_cen') && near.includes(f.country) ? 1 : 0;
    const extra=state.freestylers.filter(f=>!used.has(f.id)).sort((a,b)=>pref(b)-pref(a) || quality(b)-quality(a));
    while(ev.participants.length<16 && extra.length){ const f=extra.shift(); ev.participants.push(f.id); used.add(f.id); }
  });
  s.rb.drawn=true;
  addLog(s, 0, `Red Bull anuncia sus ${RB_ALL.length} torneos clasificatorios. Internacional en <b>${s.rb.inter.sede}</b> (${fmtDay(s.year,s.rb.inter.day)}).`, 'rb');
}

/* ---- eliminatorias ---- */
function runKnockout(ids, bonus, vmult){
  const rounds=[]; const r0=[];
  for(let i=0;i<ids.length;i+=2) r0.push({a:ids[i], b:ids[i+1], result:null});
  rounds.push(r0);
  let semis=[];
  while(true){
    const r=rounds[rounds.length-1];
    r.forEach(m=> simulateBattle(m, bonus));
    if(r.length===2) semis=r.map(m=>m.result.loser);
    if(r.length===1) break;
    const nx=[]; for(let i=0;i<r.length;i+=2) nx.push({a:r[i].result.winner, b:r[i+1].result.winner, result:null});
    rounds.push(nx);
  }
  const third={a:semis[0], b:semis[1], result:null}; simulateBattle(third, bonus);
  const fin=rounds[rounds.length-1][0];
  rounds.flat().concat([third]).forEach(m=>{ m.views=battleViews(m, vmult||1); });
  return {bracket:{rounds, third}, champion:fin.result.winner, runnerUp:fin.result.loser, third:third.result.winner, fourth:third.result.loser};
}
const RB_DECLINE={'Jaloner':1, 'Walls':0.9, 'Piezas':0.9, 'Wos':0.8, 'Trueno':0.8, 'Duki':0.8, 'Lit Killah':0.8, 'ChysteMC':0.8, 'Dani Ribba':0.8, 'Khan':0.8, 'Papo':0.7, 'Bnet':0.7, 'Acru':0.7, 'TiagoPZK':0.7};
function sedeBonus(sede){ return sede ? (id=> { const f=fby(id); if(!f) return 0; return (f.country===sede ? LOCAL_BONUS : 0) + (sede==='México' && f.name==='Aczino' ? 10 : 0); }) : null; }
function uqLocalismo(s, ids, sede, comp, d, champ){ const ac=state.freestylers.find(f=>f.name==='Aczino'); if(sede!=='México' || !ac || champ!==ac.id) return;
  uqPush(s, {day:d+1, type:'local', comp, fid:ac.id, ids:ids.slice()}); }
function addFama(id, d){ const f=fby(id); if(f) f.fama=Math.round(clamp(f.fama+d,5,99)); }

function runRBEvent(s, ev, d){
  if(!s.rb.drawn) rbDraw(s);
  const r=runKnockout(ev.order||shuffle(ev.participants), null, 0.8*0.8*(ev.key===RB_PLZ.key?1:1.1));
  Object.assign(ev, r, {played:true});
  addFama(r.champion,5); addFama(r.runnerUp,2); addFama(r.third,1);
  const hn=finalHype(r.champion, r.runnerUp, false);
  addLog(s, d, `🔴 <b>${fname(r.champion)}</b> gana la ${rbdef(ev.key).name} ante ${fname(r.runnerUp)} y va al Internacional.${hn}`, 'rb');
}

/* ---- votación de comodines ---- */
function rbCandidates(s){ return RB_NATS.map(n=>rbEvent(s,n.key)).filter(e=>e.played).map(e=>e.runnerUp); }
function rbNeedsVote(s, d){ return rbOn(s) && !s.rb.inter.voted && d>=s.rb.inter.voteDay; }
function showRBVote(){
  const s=cur(); if(!rbNeedsVote(s, s.day)) return;
  const cands=rbCandidates(s); const votes=state.ui.rbVotes||(state.ui.rbVotes=[]);
  const from=id=> rbdef(RB_NATS.map(n=>rbEvent(s,n.key)).find(e=>e.runnerUp===id).key).short;
  openModal(`<h3>Votación · ${RB_INT.name}</h3>
    <p class="step-note" style="margin-bottom:12px;">Estos son los subcampeones de cada nacional. Tres irán al Internacional (${s.rb.inter.sede}, ${fmtDay(s.year,s.rb.inter.day)}). Tus votos cuentan, pero la fama de cada uno pesa más.</p>
    <div class="vote-grid">${cands.map(id=>{ const f=fby(id); const on=votes.includes(id);
      return `<button class="vote-card ${on?'on':''}" onclick="toggleRBVote('${id}')" aria-pressed="${on}">
        <div class="vote-photo" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
        <div class="vote-name">${nameH(f)}</div><div class="vote-country">${esc(f.country)} · 2º RB ${from(id)}</div>
        ${on?'<span class="vote-check">✓</span>':''}</button>`; }).join('')}</div>
    <div class="modal-actions"><span class="step-note" style="margin-right:auto">Votos <b>${votes.length}</b>/3</span>
      <button class="btn primary" ${votes.length===3?'':'disabled'} onclick="confirmRBVote()">Enviar votos</button></div>`, 'vote');
}
function toggleRBVote(id){
  const v=state.ui.rbVotes||(state.ui.rbVotes=[]); const i=v.indexOf(id);
  if(i>=0) v.splice(i,1); else if(v.length<3) v.push(id); else { toast('Ya tienes 3 votos. Quita uno para cambiarlo.'); return; }
  showRBVote();
}
function rbResolveVote(s, userVotes){
  const I=s.rb.inter; const cands=rbCandidates(s);
  // siempre pasan los 3 con más fama, se vote lo que se vote
  const chosen=shuffle(cands.slice()).sort((a,b)=>fby(b).fama-fby(a).fama).slice(0,3);
  I.candidates=cands; I.userVotes=userVotes.slice(); I.votedIn=chosen; I.voted=true;
  // clasificados: 10 campeones + podio anterior + 3 votados
  const reasons={};
  s.rb.events.forEach(e=>{ if(e.played) reasons[e.champion]=`Campeón ${rbdef(e.key).name}`; });
  s.rb.interPodium.forEach((id,i)=>{ if(!reasons[id]) reasons[id]=`Podio del Internacional anterior (${i+1}º)`; });
  chosen.forEach(id=>{ if(!reasons[id]) reasons[id]='Votación (comodín)'; });
  const rest=cands.filter(id=>!reasons[id]).sort((a,b)=>fby(b).fama-fby(a).fama);
  while(Object.keys(reasons).length<16 && rest.length){ reasons[rest.shift()]='Plaza vacante (fama)'; }
  I.reasons=reasons; I.qualifiers=Object.keys(reasons).slice(0,16);
  addLog(s, s.day, `🗳️ Votación Red Bull: ${chosen.map(id=>'<b>'+fname(id)+'</b>').join(', ')} completan los 16 del Internacional.`, 'rb');
}
function confirmRBVote(){
  const s=cur(); const v=(state.ui.rbVotes||[]).slice(); if(v.length!==3) return;
  rbResolveVote(s, v); state.ui.rbVotes=[];
  const I=s.rb.inter;
  openModal(`<h3>Resultado de la votación</h3>
    <div class="vote-grid">${I.candidates.map(id=>{ const f=fby(id); const inn=I.votedIn.includes(id), mine=I.userVotes.includes(id);
      return `<div class="vote-card ${inn?'win':'out'}"><div class="vote-photo" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
      <div class="vote-name">${nameH(f)}</div><div class="vote-country">${esc(f.country)}${mine?' · tu voto':''}</div>${inn?'<span class="vote-check">✓</span>':''}</div>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal(); goto('redbull',{key:'${RB_INT.key}'})">Ver clasificados</button><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, 'vote');
}

function runRBInter(s, d){
  const I=s.rb.inter;
  if(!I.voted) rbResolveVote(s, []);
  const r=runKnockout(I.order||shuffle(I.qualifiers), sedeBonus(I.sede), 2.2*0.4); { const fin=r.bracket.rounds[r.bracket.rounds.length-1][0]; fin.views=Math.round(fin.views*1.15); }
  Object.assign(I, r, {played:true}); uqViral(s, r.bracket, 'rb', d); uqLocalismo(s, I.qualifiers, I.sede, 'rb', d, r.champion);
  addFama(r.champion,10); addFama(r.runnerUp,4); addFama(r.third,2);
  const hn=finalHype(r.champion, r.runnerUp, true);
  const loc=fby(r.champion).country===I.sede ? ' ¡Gana el local!' : '';
  addLog(s, d, `🏆 <b>${fname(r.champion)}</b> campeón de la ${RB_INT.name} en ${I.sede} ante ${fname(r.runnerUp)}.${loc}${hn}`, 'rb');
}

/* ---- vistas ---- */
function rbStatus(s, ev){ return ev.played ? `<span class="status done">Jugada</span>` : (s.phase==='live'&&ev.day>=s.day||s.phase==='pre' ? `<span class="status pending">${fmtDay(s.year,ev.day)}</span>` : `<span class="status pending">—</span>`); }
function renderRedBull(){
  const s=cur(); const key=state.view.params.key;
  if(!rbOn(s)) return `<div class="detail-head"><h1>Red Bull Batalla</h1></div><div class="empty-state"><span class="big">Desde la próxima temporada</span>Esta partida empezó antes de que existiera Red Bull. Aparecerá al preparar la siguiente temporada.</div>`;
  if(key) return key===RB_INT.key ? renderRBInter(s) : renderRBEvent(s, key);
  const I=s.rb.inter;
  let h=`<div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>Red Bull Batalla ${s.year}</h1></div>`;
  if(s.phase==='live' && rbNeedsVote(s,s.day)) h+=`<div class="banner">La votación de comodines está abierta.&nbsp;<button class="btn small primary" onclick="showRBVote()">Votar</button></div>`;
  h+=`<div class="step rb-inter-card" onclick="goto('redbull',{key:'${RB_INT.key}'})">
    <div style="display:flex;align-items:center;gap:10px;font-weight:700;">${rbDot(RB_INT.key)} ${RB_INT.name}<span class="top-spacer"></span>${rbStatus(s,I)}</div>
    <div class="hype-row" style="justify-content:space-between;"><span>📍 Sede: <b style="text-align:left">${I.sede}</b></span><span>${I.played?'🏆 '+fnameH(I.champion):'Votación: '+fmtDay(s.year,I.voteDay)}</span></div></div>
  <div class="section-title"><h2>Clasificatorios</h2></div>
  <div class="league-toggle-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));">${s.rb.events.slice().sort((a,b)=>a.day-b.day).map(ev=>`
    <div class="step" style="cursor:pointer" onclick="goto('redbull',{key:'${ev.key}'})">
      <div style="display:flex;align-items:center;gap:8px;font-weight:700;">${rbDot(ev.key)} ${rbdef(ev.key).name}<span class="top-spacer"></span>${rbStatus(s,ev)}</div>
      <div class="hype-row" style="justify-content:space-between;"><span>${ev.played?'Campeón: <b style="text-align:left">'+fnameH(ev.champion)+'</b>':(s.rb.drawn?`${ev.participants.length} participantes · ${ev.seeds.length} por podio`:'Participantes al iniciar temporada')}</span></div>
    </div>`).join('')}</div>
  <p class="step-note" style="margin-top:12px;">Cada campeón va al Internacional, junto al podio del último Internacional (que no juega nacionales) y 3 subcampeones elegidos por votación. El Torneo de Plazas reúne a uno por país de los que se quedaron fuera.</p>`;
  return h;
}
function rbBracketHtml(ev){
  const names=['Octavos','Cuartos','Semifinal','Final'];
  return `<div class="bracket-scroll"><div class="bracket">${ev.bracket.rounds.map((r,ri)=>`<div class="round"><div class="rlabel">${names[ri]}</div>${r.map(m=>bm(m)).join('')}</div>`).join('')}
  <div class="round"><div class="rlabel">3er puesto</div>${bm(ev.bracket.third)}</div></div></div>
  <div class="podium3">
    <div class="podium-card p1"><div class="medal">1º</div><div class="pname">${fnameH(ev.champion)}</div><div class="plabel">Campeón</div></div>
    <div class="podium-card p2"><div class="medal">2º</div><div class="pname">${fnameH(ev.runnerUp)}</div><div class="plabel">Subcampeón</div></div>
    <div class="podium-card p3"><div class="medal">3º</div><div class="pname">${fnameH(ev.third)}</div><div class="plabel">Tercer puesto</div></div>
  </div>`;
}
function rbPeopleGrid(ids, tagFn){
  return `<div class="fl-grid">${ids.map(id=>{ const f=fby(id); const tag=tagFn?tagFn(id):'';
    return `<div class="fl-card" onclick="showFreestyler('${id}')"><div class="fl-avatar" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
    <div style="min-width:0;"><div class="fname">${nameH(f)}</div><div class="fcountry">${esc(f.country)}${tag}</div></div>
    <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${f.hype!=null?Math.round(f.hype):'—'}</b></div></div>`; }).join('')}</div>`;
}
function renderRBEvent(s, key){
  const ev=rbEvent(s,key); const def=rbdef(key);
  let h=`<div class="back-link" onclick="goto('redbull')">‹ Red Bull</div><div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>${def.name} ${s.year}</h1></div>
  <div class="banner">${fmtDay(s.year,ev.day)} · 16 freestylers, eliminación directa. ${key===RB_PLZ.key?'Un freestyler por país, sin grandes estrellas (el podio anterior entra directo y no cuenta).':((key==='rb_usa'||key==='rb_cen')?`Pueden entrar freestylers de EEUU y de Centroamérica (cada uno solo a una de las dos).`:`Pueden entrar: ${def.countries.join(', ')}.`)} El campeón va al Internacional.</div>`;
  if(ev.played) h+=rbBracketHtml(ev);
  h+=`<div class="section-title"><h2>Participantes</h2></div>`;
  if(!s.rb.drawn) return h+`<div class="step-note">Se anuncian al empezar la temporada.</div>`;
  return h+rbPeopleGrid(ev.participants, id=> ev.seeds.includes(id)?' <span class="tag-mini rb-seed">Podio '+(s.year-1)+'</span>':'');
}
function renderRBInter(s){
  const I=s.rb.inter;
  let h=`<div class="back-link" onclick="goto('redbull')">‹ Red Bull</div><div class="detail-head"><img class="rb-mark" src="${RB_LOGO}" alt="Red Bull Batalla"><h1>${RB_INT.name} ${s.year}</h1></div>
  <div class="banner">📍 ${I.sede} · ${fmtDay(s.year,I.day)}. Los freestylers de ${I.sede} juegan como locales (+${LOCAL_BONUS} de nivel en sus batallas).</div>`;
  if(I.played) h+=rbBracketHtml(I);
  if(I.voted){
    h+=`<div class="section-title"><h2>Clasificados</h2></div>`+rbPeopleGrid(I.qualifiers, id=>`<br><span class="tag-mini rb-seed">${esc(I.reasons[id])}</span>${fby(id).country===I.sede?' <span class="tag-mini rb-local">Local</span>':''}`);
    h+=`<div class="section-title"><h2>Votación</h2></div><p class="step-note">Tus votos: ${I.userVotes.length?I.userVotes.map(fnameH).join(', '):'no votaste'}. Elegidos: ${I.votedIn.map(fnameH).join(', ')}.</p>`;
  } else {
    h+=`<div class="section-title"><h2>Ya clasificados</h2></div>`;
    const champs=s.rb.events.filter(e=>e.played);
    const ids=[...s.rb.interPodium, ...champs.map(e=>e.champion)];
    if(!s.rb.drawn) h+=`<p class="step-note">Podio del último Internacional (clasificado directo): ${(rbPrevSeason(s)&&rbOn(rbPrevSeason(s))&&rbPrevSeason(s).rb.inter.played?[rbPrevSeason(s).rb.inter.champion,rbPrevSeason(s).rb.inter.runnerUp,rbPrevSeason(s).rb.inter.third]:rbFirstPodium()).map(fnameH).join(', ')}.</p>`;
    else h+=rbPeopleGrid(ids, id=> s.rb.interPodium.includes(id)?' <span class="tag-mini rb-seed">Podio anterior</span>':' <span class="tag-mini rb-seed">Campeón '+rbdef(champs.find(e=>e.champion===id).key).short+'</span>');
    h+=`<p class="step-note" style="margin-top:10px;">Faltan ${16-ids.length} plazas: ${Math.max(0,10-champs.length)} campeones por decidir y 3 comodines por votación (${fmtDay(s.year,I.voteDay)}).</p>`;
    if(s.phase==='live' && rbNeedsVote(s,s.day)) h+=`<button class="btn primary" onclick="showRBVote()">Votar ahora</button>`;
  }
  return h;
}

/* =========================================================================
   ESPECTÁCULO RED BULL: sorteo animado del cuadrante y combates
========================================================================= */
const SHOW_SPEEDS = { lenta:{label:'Lenta', reveal:4000, k:1.5}, normal:{label:'Normal', reveal:1400, k:1}, rapida:{label:'Rápida', reveal:450, k:0.4} };
const SH = {CW:128, CH:36, GAP:18, H:470};
SH.W = 7*SH.CW + 6*SH.GAP;
const SH_C = {champ:96, finA:196, finB:242, thA:352, thB:398};
let SHOW = null;
function shSpeed(){ return SHOW_SPEEDS.normal; }
function shWait(ms){ return new Promise(r=>setTimeout(r, ms)); }
function shColX(c){ return c*(SH.CW+SH.GAP); }
function shOctY(i){ return 56 + i*44 + Math.floor(i/2)*12; }
function shQY(j){ return (shOctY(2*j)+shOctY(2*j+1))/2; }
function shSY(k){ return (shQY(2*k)+shQY(2*k+1))/2; }
function shPos(slot){
  const [r, side, i] = slot.split(':'); const L = side==='L'; const n=+i;
  if(r==='o') return {x:shColX(L?0:6), y:shOctY(n)};
  if(r==='q') return {x:shColX(L?1:5), y:shQY(n)};
  if(r==='s') return {x:shColX(L?2:4), y:shSY(n)};
  const y={fA:SH_C.finA, fB:SH_C.finB, tA:SH_C.thA, tB:SH_C.thB, c:SH_C.champ}[r];
  return {x:shColX(3), y};
}
function shIdxSlot(i){ return i<8 ? 'o:L:'+i : 'o:R:'+(i-8); }
function shStage(){ return document.getElementById('shStage'); }
function shChip(id, slot, cls){
  const p=shPos(slot); const f=fby(id); const el=document.createElement('div');
  el.className='sh-chip '+(cls||''); el.dataset.slot=slot;
  el.style.left=p.x+'px'; el.style.top=p.y+'px';
  const local = SHOW && SHOW.sede && f && f.country===SHOW.sede;
  el.innerHTML=`${miniAvatar(id,24)}<span class="sh-name">${nameH(f)}</span>${local?'<span class="sh-local" title="Local">LOC</span>':''}`;
  shStage().appendChild(el); return el;
}
function shGet(slot){ const all=shStage().querySelectorAll('.sh-chip'); let last=null; all.forEach(e=>{ if(e.dataset.slot===slot) last=e; }); return last; }
function shLinesSvg(){
  const {CW,CH,GAP}=SH; const h=CH/2; let d='';
  const elbow=(x1,y1,x2,y2)=>{ const xm=(x1+x2)/2; d+=`M${x1} ${y1+h}H${xm}V${y2+h}H${x2}`; };
  for(let j=0;j<4;j++){ elbow(shColX(0)+CW, shOctY(2*j), shColX(1), shQY(j)); elbow(shColX(0)+CW, shOctY(2*j+1), shColX(1), shQY(j));
    elbow(shColX(6), shOctY(2*j), shColX(5)+CW, shQY(j)); elbow(shColX(6), shOctY(2*j+1), shColX(5)+CW, shQY(j)); }
  for(let k=0;k<2;k++){ elbow(shColX(1)+CW, shQY(2*k), shColX(2), shSY(k)); elbow(shColX(1)+CW, shQY(2*k+1), shColX(2), shSY(k));
    elbow(shColX(5), shQY(2*k), shColX(4)+CW, shSY(k)); elbow(shColX(5), shQY(2*k+1), shColX(4)+CW, shSY(k)); }
  elbow(shColX(2)+CW, shSY(0), shColX(3), SH_C.finA); elbow(shColX(2)+CW, shSY(1), shColX(3), SH_C.finA);
  elbow(shColX(4), shSY(0), shColX(3)+CW, SH_C.finB); elbow(shColX(4), shSY(1), shColX(3)+CW, SH_C.finB);
  const labels=['Octavos','Cuartos','Semis','Final','Semis','Cuartos','Octavos'].map((t,c)=>`<text x="${shColX(c)+CW/2}" y="24" text-anchor="middle">${t}</text>`).join('');
  return `<svg class="sh-lines" width="${SH.W}" height="${SH.H}" viewBox="0 0 ${SH.W} ${SH.H}" aria-hidden="true"><path d="${d}"/>${labels}
    <text x="${shColX(3)+CW/2}" y="${SH_C.champ-8}" text-anchor="middle" class="gold">🏆 Campeón</text>
    <text x="${shColX(3)+CW/2}" y="${SH_C.thA-8}" text-anchor="middle">3er puesto</text></svg>`;
}
function shFit(){
  const wrap=document.getElementById('shWrap'); const st=shStage(); if(!wrap||!st) return;
  const top=wrap.getBoundingClientRect().top + (document.getElementById('rbShow').querySelector('.rbs').scrollTop||0);
  const k=Math.min(wrap.clientWidth/SH.W, Math.max(0.3,(window.innerHeight-top-(window.innerHeight<500?64:96))/SH.H), 1.3);
  st.style.transform=`scale(${k})`; wrap.style.height=Math.ceil(SH.H*k)+'px';
}
function shSpeedBtns(){
  return Object.entries(SHOW_SPEEDS).map(([k,v])=>`<button class="seg ${(state.ui.showSpeed||'lenta')===k?'on':''}" onclick="state.ui.showSpeed='${k}'; shPaintSpeed()">${v.label}</button>`).join('');
}
function shPaintSpeed(){ const el=document.getElementById('shSpeed'); if(el) el.innerHTML=shSpeedBtns(); }
function shSetBottom(html){ const el=document.getElementById('shBottom'); if(el) el.innerHTML=html; }
function shStatus(t){ const el=document.getElementById('shStatus'); if(el) el.innerHTML=t; }

function isUnder(key){ return /^u_/.test(key||''); }
function showEv(s,key){ return key===INTL.key ? s.intl : (isUnder(key) ? (s.under||[]).find(e=>e.key===key) : rbEvent(s,key)); }
function showName(key){ return key===INTL.key ? INTL.name : (isUnder(key) ? udef(key).name : rbdef(key).name); }
function showLogo(key){ return key===INTL.key ? LOGOS.fms_internacional : (isUnder(key) ? (ulogo(key)||RB_LOGO) : RB_LOGO); }
function openRBShow(key){
  const s=cur(); const ev=showEv(s,key); let ids;
  if(key===INTL.key){
    if(!ev.order){ const q=intlQualifiers(s); ev.qualifiers=q.ids; ev.note=q.note; ev.order=shuffle(q.ids); }
    ids=ev.qualifiers;
  } else if(isUnder(key)){
    if(!ev.participants || ev.participants.length!==16) underDraw(ev);
    ids=ev.participants; if(!ev.order || ev.order.length!==16) ev.order=shuffle(ids);
  } else {
    if(!s.rb.drawn) rbDraw(s);
    if(key===RB_INT.key && !ev.voted) rbResolveVote(s, []);
    ids = key===RB_INT.key ? ev.qualifiers : ev.participants;
    if(!ev.order || ev.order.length!==ids.length) ev.order=shuffle(ids);
  }
  save();
  SHOW={kind:'ko', key, tok:1, phase:'reveal', sede: (key===RB_INT.key||key===INTL.key) ? ev.sede : null};
  let root=document.getElementById('rbShow');
  if(!root){ root=document.createElement('div'); root.id='rbShow'; document.body.appendChild(root); }
  themeEl(root, key);
  root.innerHTML=`<div class="rbs ${key===INTL.key?'fms':''}" ${isUnder(key)?`style="background:radial-gradient(ellipse at top, color-mix(in srgb, ${udef(key).color} 55%, #07070c) 0%, #07070c 62%)"`:''} role="dialog" aria-label="${showName(key)}">
    <div class="rbs-top"><img class="rb-mark sm ${key===INTL.key?'fm-logo':''}" src="${showLogo(key)}" alt=""><div style="min-width:0"><div class="rbs-title">${showName(key)} ${s.year}</div>
      <div class="rbs-sub">${fmtDay(s.year,ev.day??ev.date)}${SHOW.sede?' · 📍 '+SHOW.sede+' (locales +'+LOCAL_BONUS+' de nivel)':''} · cruces por sorteo</div></div>
      <span class="top-spacer"></span><button class="btn small ghost" onclick="shSkip()">Saltar</button></div>
    <div class="rbs-rotate">Gira el móvil para ver el cuadrante más grande.</div>
    <div class="rbs-wrap" id="shWrap"><div class="rbs-stage" id="shStage" style="width:${SH.W}px;height:${SH.H}px">${shLinesSvg()}</div></div>
    <div class="rbs-status" id="shStatus">Sorteo de cruces…</div>
    <div class="rbs-bottom" id="shBottom"></div></div>`;
  shFit(); window.addEventListener('resize', shFit);
  shReveal(SHOW.tok);
}
async function shReveal(tok){
  const ev=showEv(cur(),SHOW.key);
  for(let i=0;i<16;i++){
    if(!SHOW||tok!==SHOW.tok) return;
    const sp=shSpeed(); const el=shChip(ev.order[i], shIdxSlot(i), 'rev'+(i>=8?' r':''));
    el.style.animationDuration=sp.reveal+'ms';
    el.addEventListener('animationend', ()=>{ el.classList.remove('rev','r'); el.style.animationDuration=''; }, {once:true});
    shStatus(`Sorteo · ${i<8?'lado izquierdo':'lado derecho'} · ${i+1}/16`);
    await shWait(sp.reveal*0.8);
  }
  if(!SHOW||tok!==SHOW.tok) return;
  await shWait(300); shChoose();
}
function shChoose(){
  SHOW.phase='choose'; shStatus('Cuadrante listo.');
  shSetBottom(`<button class="btn" onclick="shStart('sim')">Simular todo</button><button class="btn primary" onclick="shStart('ver')">Ver la competencia</button>`);
}
function shClearChips(){ shStage().querySelectorAll('.sh-chip').forEach(e=>e.remove()); }
function shSkip(){
  if(!SHOW) return; SHOW.tok++;
  const ev=showEv(cur(),SHOW.key);
  if(SHOW.phase==='reveal'){ shClearChips(); ev.order.forEach((id,i)=>shChip(id, shIdxSlot(i))); shChoose(); }
  if(SHOW.phase==='choose'){ shStage().querySelectorAll('.sh-chip').forEach(e=>{ e.classList.remove('rev','r'); e.style.animationDuration=''; }); }
  else if(SHOW.phase==='play'){ shFinal(); }
}
function shStart(mode){
  shStage().querySelectorAll('.sh-chip').forEach(e=>{ e.classList.remove('rev','r'); e.style.animationDuration=''; });
  const s=cur(); const ev=showEv(s,SHOW.key);
  shSetBottom('');
  ev.presented=true;
  advance('day');            // juega el día (resultados ya decididos)
  if(!ev.played){ closeRBShow(); return; }
  if(mode==='sim') shFinal(); else { SHOW.phase='play'; shPlay(++SHOW.tok); }
}
function shFinal(){
  const ev=showEv(cur(),SHOW.key); const B=ev.bracket, R=B.rounds;
  SHOW.phase='done'; shClearChips();
  ev.order.forEach((id,i)=> shChip(id, shIdxSlot(i), R[0][Math.floor(i/2)].result.loser===id?'lost':''));
  R[0].forEach((m,mi)=>{ const w=m.result.winner; shChip(w, 'q:'+(mi<4?'L':'R')+':'+(mi%4), R[1][Math.floor(mi/2)].result.loser===w?'lost':''); });
  R[1].forEach((m,qi)=>{ const w=m.result.winner; shChip(w, 's:'+(qi<2?'L':'R')+':'+(qi%2), R[2][Math.floor(qi/2)].result.loser===w?'lost':''); });
  R[2].forEach((m,si)=>{ shChip(m.result.winner, si?'fB':'fA', R[3][0].result.loser===m.result.winner?'lost':''); shChip(m.result.loser, si?'tB':'tA', B.third.result.winner===m.result.loser?'bronze':'lost'); });
  shChip(R[3][0].result.winner, 'c', 'champ');
  shDone();
}
function shDone(){
  const ev=showEv(cur(),SHOW.key); SHOW.phase='done';
  shStatus(`🏆 <b>${fnameH(ev.champion)}</b> gana la ${showName(SHOW.key)}${(SHOW.key===RB_INT.key||SHOW.key===INTL.key)?'':(isUnder(SHOW.key)?' (+5 de hype)':' y va al Internacional')}.`);
  shSetBottom(`<button class="btn primary" onclick="shContinue()">Continuar</button>`);
}
function closeRBShow(){
  if(SHOW) SHOW.tok++; SHOW=null; window.removeEventListener('resize', shFit);
  const root=document.getElementById('rbShow'); if(root) root.innerHTML='';
  render();
}
async function shMove(id, from, to, cls){
  const c=shChip(id, from, 'moving '+(cls||'')); c.dataset.slot=to;
  c.getBoundingClientRect();
  const k=shSpeed().k; c.style.transitionDuration=(800*k)+'ms';
  const p=shPos(to); c.style.left=p.x+'px'; c.style.top=p.y+'px';
  await shWait(850*k); c.classList.remove('moving'); return c;
}
async function shPlay(tok){
  const ev=showEv(cur(),SHOW.key); const B=ev.bracket, R=B.rounds;
  const alive=()=> SHOW && tok===SHOW.tok;
  const match=async(m, aSlot, bSlot, label, winTo, loseTo, winCls)=>{
    if(!alive()) return false;
    shStatus(label);
    const ea=shGet(aSlot), eb=shGet(bSlot);
    ea.classList.add('fight'); eb.classList.add('fight');
    await shWait(800*shSpeed().k); if(!alive()) return false;
    const wSlot = m.result.winner===m.a ? aSlot : bSlot, lSlot = wSlot===aSlot ? bSlot : aSlot;
    const ew=shGet(wSlot), el=shGet(lSlot);
    ea.classList.remove('fight'); eb.classList.remove('fight');
    ew.classList.add('won'); el.classList.add('lost');
    if(m.result.tiebreak){ const t=document.createElement('span'); t.className='sh-rep'; t.textContent='réplica'; ew.appendChild(t); }
    await shWait(1100*shSpeed().k); if(!alive()) return false;
    const moves=[];
    if(winTo) moves.push(shMove(m.result.winner, wSlot, winTo, winCls));
    if(loseTo) moves.push(shMove(m.result.loser, lSlot, loseTo));
    await Promise.all(moves);
    return alive();
  };
  for(let mi=0; mi<8; mi++){ const side=mi<4?'L':'R', j=mi%4;
    if(!await match(R[0][mi], `o:${side}:${2*j}`, `o:${side}:${2*j+1}`, `Octavos · combate ${mi+1}/8`, `q:${side}:${j}`)) return; }
  for(let qi=0; qi<4; qi++){ const side=qi<2?'L':'R', j=qi%2;
    if(!await match(R[1][qi], `q:${side}:${2*j}`, `q:${side}:${2*j+1}`, `Cuartos · combate ${qi+1}/4`, `s:${side}:${j}`)) return; }
  for(let si=0; si<2; si++){ const side=si?'R':'L';
    if(!await match(R[2][si], `s:${side}:0`, `s:${side}:1`, `Semifinal ${si+1}/2`, si?'fB':'fA', si?'tB':'tA')) return; }
  if(!await match(B.third, 'tA', 'tB', 'Tercer y cuarto puesto', null, null)) return;
  shGet(B.third.result.winner===B.third.a?'tA':'tB').classList.add('bronze');
  if(!await match(R[3][0], 'fA', 'fB', '🔥 Gran final', 'c', null, 'champ')) return;
  shDone();
}

/* =========================================================================
   BATALLAS FMS: 4 rondas, 5 jueces, PTB, réplicas y mano alzada
========================================================================= */
const ROUND_SETS = {
  short:[{n:'Random Mode',t:'random',max:10,min:1},{n:'Primer minuto libre',t:'min',max:10,min:1},{n:'Segundo minuto libre',t:'min',max:10,min:1},{n:'Deluxe',t:'deluxe',max:10,min:1}],
  long:[{n:'Easy Mode',t:'easy',max:30,min:0},{n:'Hard Mode',t:'hard',max:30,min:0},{n:'Temáticas',t:'tema',max:44,min:0},{n:'Random Mode',t:'random',max:38,min:0},
        {n:'Primer minuto libre',t:'min',max:30,min:0},{n:'Segundo minuto libre',t:'min',max:30,min:0},{n:'Deluxe',t:'deluxe',max:42,min:0}]
};
const FMS_ROUNDS = ROUND_SETS.short.map(r=>r.n);
const TIEP_S=0, TIEP_L=0.1;
const PAIR_DEADLINE=10;   // días de antelación para tener los cruces
function roundsOf(m){ return (m && m.d && m.d.f==='L') ? ROUND_SETS.long : ROUND_SETS.short; }
function seasonFormat(s){ return (s && s.format==='long') ? 'long' : 'short'; }
const TICKET_MULT = 1.8;     // taquilla reforzada
const VIEW_RATE = 0.006;     // € por visita de YouTube
function scoreChar(n){ return String.fromCharCode(96+n); }
function dScore(m, r, side, j){ const v=m.d.s.charCodeAt(r*10+side*5+j)-96; return m.d.e===2 ? v/2 : v; }
function fpt(n){ return Number.isInteger(n) ? n.toLocaleString('es-ES') : n.toLocaleString('es-ES',{minimumFractionDigits:1, maximumFractionDigits:1}); }
// PTB: a cada competidor no le cuentan el juez que más le puntúa ni el que menos (cuentan 3 de 5)
function countedJudges(m, sd){ const T=[0,1,2,3,4].map(j=>{ let t=0; for(let r=0;r<roundsOf(m).length;r++) t+=dScore(m,r,sd,j); return [j,t]; });
  T.sort((a,b)=>a[1]-b[1]); return new Set(T.slice(1,4).map(x=>x[0])); }
function ptbOf(m){ if(!m.d||!m.d.s) return null; const nr=roundsOf(m).length; const t=[0,0];
  for(let sd=0;sd<2;sd++){ const cj=countedJudges(m,sd); for(let r=0;r<nr;r++) for(const j of cj) t[sd]+=dScore(m,r,sd,j); } return t; }
function judgeTotals(m){ const A=[0,0,0,0,0], B=[0,0,0,0,0]; const nr=roundsOf(m).length; for(let r=0;r<nr;r++) for(let j=0;j<5;j++){ A[j]+=dScore(m,r,0,j); B[j]+=dScore(m,r,1,j); } return [A,B]; }
function votesAB(m){
  if(!m.d) return m.result&&m.result.tiebreak ? 'Réplica' : '';
  const v=m.d.v; const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  if(m.d.h){ const aW=m.result.winner===m.a; const ha=aW?m.d.h[0]:m.d.h[1], hb=aW?m.d.h[1]:m.d.h[0]; return `Réplica · mano alzada ${ha}-${hb}`; }
  return `${nA}-${nB}${nR?` (${nR} réplica${nR>1?'s':''})`:''}`;
}
function fmsLabel(m){
  if(!m.d) return m.result&&m.result.tiebreak ? 'Réplica' : '';
  const v=m.d.v; const aW=m.result.winner===m.a;
  const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  if(m.d.h) return `Réplica · mano alzada ${m.d.h[0]}-${m.d.h[1]}`;
  const w=aW?nA:nB, l=aW?nB:nA;
  return `${w}-${l}${nR?` (${nR} réplica${nR>1?'s':''})`:''}`;
}
// judges: los 5 ids de juez de la liga (judgesOf(L)). Sin ellos, los 5 internacionales.
function simulateFMSBattle(m, lvB, judges){
  const A=fby(m.a), B=fby(m.b); lvB=lvB||0;
  if(!Array.isArray(judges) || judges.length!==5) judges=judgesByGroup('Internacional').slice(0,5).map(j=>j.id);
  const JJ=judges.map(id=>JUDGE_BY_ID[id]||null);
  const fa=gauss()*7*mentalFactor(A), fb=gauss()*7*mentalFactor(B);     // forma del día: no siempre se rinde al nivel; la mentalidad la estabiliza
  const fmt=WS_SHORT ? 'short' : seasonFormat(cur()); const RS=ROUND_SETS[fmt];
  const SA=STYLES[styleOf(A)], SB=STYLES[styleOf(B)];
  const perf=(F,S,form,rt)=>{
    if(F.name==='Khan') return 47.5 + form*0.4 + gauss()*4;    // PTB muy bajo (60-120 en formato largo)
    if(F.name==='Navas') return 57 + form*0.4 + gauss()*4;     // bajo (110-170 en formato largo)
    let p=roundBase(F,rt)+lvB+form+gauss()*8*S.v*mentalFactor(F)+(S.m[rt]||0)*STYLE_ROUND_MOD+((S.fmt&&S.fmt[fmt])||0)+(UQ_PERF[F.id]||0);
    if(S.spike && Math.random()<0.12) p+=11; return p; };
  let s='';
  const tA=[0,0,0,0,0], tB=[0,0,0,0,0];
  for(const R of RS){
    const pa=perf(A,SA,fa,R.t), pb=perf(B,SB,fb,R.t);
    // escala 1-10. Largo: notas más bajas (como en la FMS real, ~35% del máximo de media)
    const ba = fmt==='long' ? 3.5+(pa-80)*0.07 : 6.4+(pa-78)/11, bb = fmt==='long' ? 3.5+(pb-80)*0.07 : 6.4+(pb-78)/11;
    const k=R.max/10; const tieP = fmt==='long' ? TIEP_L : TIEP_S;
    const sc=x=>{ let v=clamp(Math.round(x*k*2)/2,R.min,R.max);   // medios puntos
      if(v>=R.max && Math.random()<0.93) v=R.max-(Math.random()<0.6?0.5:1);   // la nota máxima es rarísima
      return v; };
    const ra=[], rb=[];
    for(let j=0;j<5;j++){
      const J=JJ[j], sev=J?J.severidad:0, nz=judgeNoise(J);
      let sa=sc(ba+judgeTaste(J,A)+sev+gauss()*nz), sb=sc(bb+judgeTaste(J,B)+sev+gauss()*nz);
      if(Math.abs(ba-bb)<1.5 && Math.random()<tieP){ const x=sc((ba+bb)/2+gauss()*0.5); sa=sb=x; }
      ra.push(sa); rb.push(sb); tA[j]+=sa; tB[j]+=sb;
    }
    s+=ra.map(x=>scoreChar(x*2)).join('')+rb.map(x=>scoreChar(x*2)).join('');
  }
  // réplica si la diferencia de un juez es de 1,5 o menos (corto) o de 5 o menos (largo); a partir de 2 / 5,5 es victoria directa
  const RT = fmt==='long' ? 5 : 1.5;
  let v=''; for(let j=0;j<5;j++) v+= tA[j]-tB[j]>RT?'A':(tB[j]-tA[j]>RT?'B':'R');
  const nA=[...v].filter(x=>x==='A').length, nB=[...v].filter(x=>x==='B').length, nR=[...v].filter(x=>x==='R').length;
  let aWins, h=null, tiebreak=false;
  if(nA<3 && nB<3){   // sin 3 votos para nadie → réplica (p. ej. 2-2-1 o 2 votos + 2 réplicas + 1)
    tiebreak=true;
    const p=1/(1+Math.pow(10,((B.nivel+fb)-(A.nivel+fa)+MENTAL_REPLICA*(attrOf(B,'mentalidad')-attrOf(A,'mentalidad')))/18));
    let ha=0; for(let j=0;j<5;j++) if(Math.random()<p) ha++;
    aWins=ha>=3; h=aWins?[ha,5-ha]:[5-ha,ha];
  } else aWins=nA>nB;
  if(A.name==='Khan' && B.name!=='Khan') aWins=false; else if(B.name==='Khan' && A.name!=='Khan') aWins=true;
  const W=aWins?A:B, Lo=aWins?B:A;
  m.d={s, v, h, e:2, j:judges.slice()}; if(fmt==='long') m.d.f='L';
  m.result={winner:W.id, loser:Lo.id, tiebreak};
  battleHype(W, Lo);
  m.lb=fmsLabel(m);
  return {upset:(Lo.nivel-W.nivel)>=10, tiebreak, W, Lo};
}
// visitas de YouTube: la fama es lo que más pesa, luego el hype y un poco el nivel
// batallas repetidas temporada tras temporada: a partir de la 3ª seguida, -10% de visitas por temporada
const PAIR_CACHE={};
var RIVALS=[['Chuty','Gazir'],['Chuty','Aczino'],['Chuty','Cacha'],['Cacha','Papo'],['Cacha','Abel'],['Cacha','Wos'],['Wos','Aczino'],['Navas','Gazir'],['Navas','Bélico'],
  ['Sara Socas','Sweet Pain'],['Sweet Pain','Stuart'],['Valles-T','El Menor'],['El Menor','Lokillo'],['Teorema','Aczino'],['El Menor','Gazir'],['Dyse','Exe'],['Aczino','Jack Andrenalina'],
  ['Sara Socas','Rapder'],['Dtoke','Skone'],['Mecha','Papo'],['Mecha','Nacho'],['Navas','El Menor'],['Skone','Chuty'],['Mowlihawk','Navas'],['Mowlihawk','Alek'],['Mowlihawk','Nocre'],['KG','Chang'],
  ['KG','Navas'],['Dominic','RC'],['Fat N','Puppy'],['Carpediem','Valles-T'],['Force','Segrelles'],['Skone','Rapder'],['Rife','Abel'],['Papo','Kodigo'],['Exe','HDR'],
  ['Dybbuk','CTZ'],['Cacha','Mecha'],['Dybbuk','Stuart'],['Mecha','Sophia'],['Bnet','Valles-T'],['Nekroos','Jaze']];
// 15 variantes del evento de rivalidad: [kicker, título, texto]  ({A}/{B} = los dos, {W} ganador, {L} perdedor, {C} competición)
var RIVAL_VARS=[
  ['⚔️ Rivalidad','{A} vs {B}: el pique sigue vivo','La rivalidad entre los dos ha incendiado las redes tras la batalla en {C}: todo el mundo quiere verla.'],
  ['🔥 Redes','{W} se lleva el duelo contra {L}','Los fans de {L} no lo aceptan y los de {W} no paran de compartir los mejores momentos. La batalla no deja de sumar.'],
  ['🎤 Barras','La barra que todo el mundo comenta','{W} le soltó a {L} una barra personal que ya circula en todos los clips. Nadie habla de otra cosa.'],
  ['🗳️ Encuestas','¿Quién ganó de verdad?','La comunidad está dividida a partes iguales sobre {A} vs {B}. Las encuestas en X están 50/50 y cada voto trae a más gente a ver la batalla.'],
  ['🎬 Reacciones','Los streamers reaccionan a {A} vs {B}','Medio mundo del freestyle ha hecho directo reaccionando a la batalla. Las visitas se disparan.'],
  ['📼 Historia','Otro capítulo de una rivalidad histórica','{A} y {B} suman un enfrentamiento más y la gente ya hace recopilatorios de todos sus cruces.'],
  ['😤 Tensión','No se dieron la mano','Al terminar {A} vs {B} ninguno quiso saludar al otro. El vídeo del momento corre por todas partes.'],
  ['📱 Stories','{L} responde en redes','{L} ha subido una story contestando a {W} tras la batalla. La comunidad vuelve a ver la batalla para entender el contexto.'],
  ['🎵 Tiraeras','Amenaza de tiraera','{L} insinúa que va a sacar un tema contra {W}. La batalla original se convierte en tendencia.'],
  ['⚖️ Jueces','Polémica con los jueces','La afición de {L} se queja de las votaciones contra {W}. El debate sobre los jueces le da a la batalla un empujón de visitas.'],
  ['🎙️ Entrevista','{W}: "Con {L} siempre es especial"','En la entrevista post-batalla {W} reconoció que contra {L} se motiva más que contra nadie. La frase se ha hecho viral.'],
  ['🔁 Revancha','La gente pide la revancha','Tras {A} vs {B}, el hashtag pidiendo otra batalla entre los dos es tendencia. Todos vuelven a ver la última.'],
  ['💬 Memes','{A} vs {B} ya es un meme','Las caras, los gestos y las réplicas de la batalla están por todas partes en forma de meme.'],
  ['🕵️ Polémica','"{W} ganó con preparadas"','Parte del público está convencido de que {W} llevaba rimas preparadas contra {L}. Las acusaciones y los vídeos analizando cada ronda disparan las visitas.'],
  ['🏟️ Localismo','Ha estallado la polémica: el público favoreció a {W}','{W} jugaba en casa en {C} y le ganó a {L}. Muchos dicen que el público lo empujó a la victoria y las redes arden.'],
];
var RIVAL_DEFER=false;
var SPK_BH=0;   // hype extra de batalla que da el speaker   // en jornadas de liga el +15% llega al día siguiente como evento
function rivalFill(t, ev){ const w=ev.w||ev.a, l=w===ev.a?ev.b:ev.a; const C=ev.comp==='fms'?'el '+INTL.name:(ev.j!=null?`la J${ev.j+1} de ${ldef(ev.key).name}`:ldef(ev.key).name);
  return t.replace(/\{A\}/g,fname(ev.a)).replace(/\{B\}/g,fname(ev.b)).replace(/\{W\}/g,fname(w)).replace(/\{L\}/g,fname(l)).replace(/\{C\}/g,C); }
function isRival(a, b){ const A=fby(a), B=fby(b); if(!A||!B) return false; const x=nrm(A.name), y=nrm(B.name); return RIVALS.some(([p,q])=>(nrm(p)===x&&nrm(q)===y)||(nrm(p)===y&&nrm(q)===x)); }
var VIEW_STAR={'Navas':1.3, 'Jaze':1.3};   // sus batallas dan más visitas que la media
const MISMATCH_EXEMPT=['Trueno','Wos','TiagoPZK','Azuky','Walls'];
const LOW_VIEW_EXEMPT=['El Menor','Kaiser','Teorema','Nitro','Metalingüística','Ricto','Aczino','Azuky'];
const NO_FATIGUE=['El Menor','Teorema'];
function seasonPairs(s){
  if(s.phase==='done' && PAIR_CACHE[s.number]) return PAIR_CACHE[s.number];
  const set=new Set(); const add=m=>{ if(m&&m.a&&m.b) set.add(pairKey(m.a,m.b)); };
  Object.values(s.leagues||{}).forEach(L=>{ (L.rounds||[]).flat().forEach(m=>{ if(m.result) add(m); }); Object.values(L.exhib||{}).forEach(x=>add(x.m)); });
  const ko=b=>{ if(b){ b.rounds.flat().forEach(add); add(b.third); } };
  if(s.intl) ko(s.intl.bracket); if(s.rb && s.rb.events){ s.rb.events.forEach(e=>ko(e.bracket)); if(s.rb.inter) ko(s.rb.inter.bracket); }
  if(s.phase==='done') PAIR_CACHE[s.number]=set; return set;
}
function pairFatigue(a, b){
  if(!state.seasons || !state.seasons.length) return 1; if(NO_FATIGUE.includes(fname(a)) || NO_FATIGUE.includes(fname(b))) return 1; const k=pairKey(a,b); let n=1;   // la temporada actual cuenta
  for(let i=state.seasons.length-2;i>=0;i--){ if(seasonPairs(state.seasons[i]).has(k)) n++; else break; }
  return n>=3 ? Math.max(0.3, 1-0.1*(n-2)) : 1;
}
function battleViews(m, mult){
  const A=fby(m.a), B=fby(m.b); if(!A||!B) return 0;
  const score=0.55*(A.fama+B.fama)/2 + 0.30*Math.min(200, hypeOf(m.a)+hypeOf(m.b)+SPK_BH)/2 + 0.15*(A.nivel+B.nivel)/2;
  const lvl=(A.nivel+B.nivel)/2; const lvlF=clamp(0.5+(lvl-64)/36, 0.5, 1.1);   // batallas de nivel bajo: algo menos de visitas
  let v=1000*Math.pow(10, clamp((score-25)/70,0,1.25)*3.4) * Math.exp(gauss()*0.35) * (mult||1) * lvlF;
  if(m.result && m.result.tiebreak) v*=1.15;
  [A,B].forEach(F=>{ const vm=STYLES[styleOf(F)].views; if(vm) v*=vm; });
  if(m.result && isUpset(fby(m.result.winner), fby(m.result.loser))) v*=1.25;
  [A,B].forEach(F=>{ if(VIEW_STAR[F.name]) v*=VIEW_STAR[F.name]; });
  { const hi=Math.max(A.fama,B.fama), diff=Math.abs(A.fama-B.fama);   // famoso contra alguien con poca fama: menos visitas
    if(hi>=78 && diff>=15 && !(MISMATCH_EXEMPT.includes(A.name)||MISMATCH_EXEMPT.includes(B.name))) v*=1-Math.min(0.35,(diff-15)*0.012); }
  [A,B].forEach(F=>{ if((F.country==='Chile' || F.country==='México') && !LOW_VIEW_EXEMPT.includes(F.name)) v*=0.85; });
  v*=pairFatigue(m.a, m.b);
  if(!RIVAL_DEFER && isRival(m.a, m.b)) v*=1.15;
  return Math.max(1000, Math.round(v));
}
function fmtViews(n){ if(n>=1e6) return (n/1e6).toLocaleString('es-ES',{maximumFractionDigits:1})+' M'; if(n>=1e3) return Math.round(n/1e3).toLocaleString('es-ES')+' K'; return String(n); }
function noBackToBack(ord, round){   // mantiene el orden por hype en lo posible, pero nadie batalla dos veces seguidas
  const n=ord.length, used=new Array(n).fill(false), out=[]; let steps=0;
  const clash=(x,y)=>{ const a=round[x[0]], b=round[y[0]]; return a.a===b.a||a.a===b.b||a.b===b.a||a.b===b.b; };
  const dfs=()=>{ if(out.length===n) return true; if(steps++>20000) return false;
    for(let i=0;i<n;i++){ if(used[i]) continue; if(out.length && clash(out[out.length-1], ord[i])) continue;
      used[i]=true; out.push(ord[i]); if(dfs()) return true; out.pop(); used[i]=false; }
    return false; };
  return dfs() ? out : ord;
}
function jornadaOrder(round){ return round.map((m,i)=>[i, hypeOf(m.a)+hypeOf(m.b)]).sort((x,y)=>x[1]-y[1]); }

/* ---------- top 10 de visitas de la temporada ---------- */
function seasonTopBattles(s, n){
  const out=[]; const KO=['Octavos','Cuartos','Semifinal','Final'];
  const push=(m, logo, comp)=>{ if(m && m.result && m.views) out.push({m, logo, comp}); };
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; (L.rounds||[]).forEach((r,ri)=> r.forEach(m=>push(m, LOGOS[k], `${ldef(k).name} · J${ri+1}`))); });
  if(s.intl && s.intl.bracket){ s.intl.bracket.rounds.forEach((r,ri)=>r.forEach(m=>push(m, LOGOS.fms_internacional, `${INTL.name} · ${KO[ri]}`))); push(s.intl.bracket.third, LOGOS.fms_internacional, `${INTL.name} · 3er puesto`); }
  if(rbOn(s)){ [...s.rb.events, s.rb.inter].forEach(ev=>{ if(!ev.bracket) return; const nm=ev===s.rb.inter?RB_INT.name:rbdef(ev.key).name;
    ev.bracket.rounds.forEach((r,ri)=>r.forEach(m=>push(m, RB_LOGO, `${nm} · ${KO[ri]}`))); push(ev.bracket.third, RB_LOGO, `${nm} · 3er puesto`); }); }
  return out.sort((a,b)=>b.m.views-a.m.views).slice(0,n||10);
}
function seasonTopFreestylers(s, n){
  const T={}; const add=(m,k)=>{ if(!m||!m.result||!m.views) return; [m.a,m.b].forEach(id=>{ if(!id) return; (T[id]=T[id]||{id, views:0, n:0, keys:[]}); T[id].views+=m.views; T[id].n++; if(k && !T[id].keys.includes(k)) T[id].keys.push(k); }); };
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; (L.rounds||[]).flat().forEach(m=>add(m,k)); Object.values(L.exhib||{}).forEach(x=>add(x.m,k)); Object.values(L.fexhib||{}).forEach(x=>add(x.m,k)); });
  if(s.intl && s.intl.bracket){ s.intl.bracket.rounds.flat().forEach(m=>add(m,INTL.key)); add(s.intl.bracket.third,INTL.key); }
  const ord=[...s.activeKeys, INTL.key]; Object.values(T).forEach(t=>t.keys.sort((a,b)=>ord.indexOf(a)-ord.indexOf(b)));
  return Object.values(T).sort((a,b)=>b.views-a.views).slice(0,n||10);
}
function topFreestylersHtml(s){
  const top=seasonTopFreestylers(s,10); if(!top.length) return '';
  return `<div class="section-title" style="margin-top:18px"><h2 style="font-size:22px">Top 10 freestylers con más visitas</h2></div>
  <div class="tb-list">${top.map((t,i)=>{ const f=fby(t.id); return `<div class="tb-row"><span class="tb-pos">${i+1}</span>
      <span class="tb-face w" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div class="tb-info"><div class="tb-names"><span class="w">${nameH(f)}</span></div><div class="tb-meta">${t.n} batalla${t.n>1?'s':''}</div></div>
      <div class="tb-logos">${t.keys.map(k=>LOGOS[k]?`<img src="${LOGOS[k]}" alt="${esc(ldef(k).name)}" title="${esc(ldef(k).name)}">`:'').join('')}</div>
      <div class="tb-views">${fmtViews(t.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
}
function topBattlesHtml(s){
  const top=seasonTopBattles(s,10); if(!top.length) return '';
  return `<div class="section-title" style="margin-top:18px"><h2 style="font-size:22px">Top 10 batallas más vistas</h2></div>
  <div class="tb-list">${top.map((t,i)=>{ const m=t.m; const wa=m.result.winner===m.a; const res=m.lb || (m.result.tiebreak?'Réplica':'');
    return `<div class="tb-row"><span class="tb-pos">${i+1}</span><img class="tb-logo" src="${t.logo}" alt="">
      <div class="tb-faces"><span class="tb-face ${wa?'w':''}" style="${avatarDivStyle(fby(m.a))}">${avatarContent(fby(m.a))}</span><span class="tb-face ${wa?'':'w'}" style="${avatarDivStyle(fby(m.b))}">${avatarContent(fby(m.b))}</span></div>
      <div class="tb-info"><div class="tb-names"><span class="${wa?'w':''}">${fnameH(m.a)}</span> <i>vs</i> <span class="${wa?'':'w'}">${fnameH(m.b)}</span></div>
      <div class="tb-meta">${esc(t.comp)} · gana ${fnameH(m.result.winner)}${res?' · '+esc(res):''}</div></div>
      <div class="tb-views">${fmtViews(m.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
}

/* ---------- espectáculo de la jornada ---------- */
function openFMSShow(key, jReplay){
  const s=cur(); const L=s.leagues[key];
  const replay = jReplay!=null;
  const j = replay ? jReplay : L.played;
  SHOW={kind:'fms', key, j, tok:1, phase:'intro', replay};
  if(!replay){
    if(!L.shown) L.shown={}; L.shown[j]=true;
    advance('day');
    if(!L.rounds[j] || !L.rounds[j][0].result){ closeRBShow(); return; }
  }
  const def=ldef(key);
  let root=document.getElementById('rbShow');
  if(!root){ root=document.createElement('div'); root.id='rbShow'; document.body.appendChild(root); }
  themeEl(root, key);
  root.innerHTML=`<div class="rbs fms" role="dialog" aria-label="${def.name} jornada ${j+1}">
    <div class="rbs-top"><img class="rb-mark sm fm-logo" src="${LOGOS[key]}" alt=""><div style="min-width:0"><div class="rbs-title">${def.name} · Jornada ${j+1}</div>
      <div class="rbs-sub">${fmtDay(s.year,L.dates[j])} ${s.year}</div></div>
      <span class="top-spacer"></span><button class="btn small ghost" id="fmSkip" onclick="fmSkip()">Saltar</button></div>
    <div class="fm-stage" id="fmStage"></div>
    <div class="rbs-bottom" id="shBottom"></div></div>`;
  fmRun(SHOW.tok);
}
function fmData(){ const s=cur(); const L=s.leagues[SHOW.key]; const base=L.rounds[SHOW.j]; const o0=(L.ord&&L.ord[SHOW.j]) || jornadaOrder(base);
  const list=[]; [L.exhib&&L.exhib[SHOW.j], L.fexhib&&L.fexhib[SHOW.j]].forEach(x=>{ if(x && x.m && x.m.result) list.push([x.m, hypeOf(x.a)+hypeOf(x.b)]); });   // las exhibiciones abren la jornada
  o0.forEach(([i,h])=>{ const m=base[i]; if(m && m.result && !m.recup) list.push([m,h]); });
  const round=list.map(x=>x[0]); const ord=list.map((x,i)=>[i,x[1]]);
  return {s, L, round, ord}; }
function fmStage(){ return document.getElementById('fmStage'); }
function fmK(){ return shSpeed().k; }
function fmAlive(tok){ return SHOW && SHOW.kind==='fms' && SHOW.tok===tok; }
function fmSkip(){ if(!SHOW) return; SHOW.tok++; SHOW.nextRes=null; fmSummary(); }
function countUp(el, from, to, ms, fmt){
  if(!el) return; const t0=performance.now(); fmt=fmt||(x=>Math.round(x).toLocaleString('es-ES'));
  const step=now=>{ const p=Math.min(1,(now-t0)/ms); const e=1-Math.pow(1-p,3); el.textContent=fmt(from+(to-from)*e); if(p<1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function fmFace(id, cls){ const f=fby(id); return `<span class="fm-face ${cls||''}" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>`; }
async function fmRun(tok){
  const {L, round, ord}=fmData(); const k=fmK;
  // 1. intro
  fmStage().innerHTML=`<div class="fm-intro"><img src="${LOGOS[SHOW.key]}" alt=""><div class="fm-intro-small">Empieza la</div><div class="fm-intro-big">Jornada ${SHOW.j+1}</div></div>`;
  await shWait(3200*k()); if(!fmAlive(tok)) return;
  // 2. cartel, de menos a más hype
  fmStage().innerHTML=`<div class="fm-lineup"><div class="fm-lineup-t">Cartel de la jornada <small>de menos a más hype</small></div>${ord.map(([i,hs],n)=>{ const m=round[i];
    return `<div class="fm-card" id="fmCard${n}"><span class="fm-n">${n+1}</span>${fmFace(m.a)}<span class="fm-cn">${fnameH(m.a)}</span><span class="fm-cvs">VS</span><span class="fm-cn r">${fnameH(m.b)}</span>${fmFace(m.b)}<span class="fm-hs">${m.ex?'<b class="fm-ex">EXHIBICIÓN</b> ':''}🔥 ${Math.round(hs)}</span></div>`; }).join('')}</div>`;
  for(let n=0;n<ord.length;n++){ await shWait(950*k()); if(!fmAlive(tok)) return; document.getElementById('fmCard'+n).classList.add('in'); }
  await shWait(2200*k()); if(!fmAlive(tok)) return;
  // 3. batallas
  for(let n=0;n<ord.length;n++){ if(!await fmBattle(tok, n)) return; }
  // 4. MVP
  const mv=L.mvps&&L.mvps[SHOW.j];
  if(mv){
    const st=computeStandings(L); const q=(cur().intlEnabled && !isWS(SHOW.key))? intlSlotsPerLeague(natKeys(cur()).length):0;
    fmStage().innerHTML=`<div class="fm-mvpwrap" id="fmMW">
      <div class="fm-table-side"><div class="fm-lineup-t" style="font-size:24px;text-align:left">Clasificación · tras la J${SHOW.j+1}</div>
        <table class="standings fm-st"><thead><tr><th>#</th><th>Freestyler</th><th class="num">PJ</th><th class="num">PTS</th></tr></thead><tbody>
        ${st.map((r,i)=>`<tr class="${i<q?'q':''} ${i>=st.length-2?'rel':''} ${r.id===mv.id?'mvp':''}" style="--i:${i}"><td class="pos">${i+1}</td><td><span style="display:inline-flex;align-items:center;gap:8px">${miniAvatar(r.id,22)} ${fnameH(r.id)}${r.id===mv.id?' <span class="mvp-tag">MVP</span>':''}</span></td><td class="num">${r.pj}</td><td class="pts num">${r.pts}</td></tr>`).join('')}
        </tbody></table></div>
      <div class="fm-mvp"><div class="fm-intro-small">MVP de la jornada</div>${fmFace(mv.id,'xl')}<div class="fm-mvp-name">${fnameH(mv.id)}</div><div class="fm-mvp-pts"><b id="fmMvpPts">0</b> puntos</div></div></div>`;
    countUp(document.getElementById('fmMvpPts'), 0, mv.pts, 1200*k(), x=>fpt(Math.round(x*2)/2)); await shWait(3200*k()); if(!fmAlive(tok)) return;
    document.getElementById('fmMW').classList.add('split');
    await shWait(900); if(!fmAlive(tok)) return;
    await fmWaitNext('Ver resultados y visitas'); if(!fmAlive(tok)) return;
  }
  fmSummary();
}
async function fmBattle(tok, n){
  const {round, ord}=fmData(); const m=round[ord[n][0]]; const k=fmK;
  const rail=ord.map(([i],x)=>{ const mm=round[i]; return `<span class="fm-pip ${x<n?'done':(x===n?'now':'')}">${x<n?fnameH(mm.result.winner):(x+1)}</span>`; }).join('');
  fmStage().innerHTML=`<div class="fm-rail">${rail}</div>
  <div class="fm-battle">
    <div class="fm-side" id="fmSA">${fmFace(m.a,'lg')}<div class="fm-name">${fnameH(m.a)}</div>${styleTag(fby(m.a))}<div class="fm-ptbrow"><span class="fm-plus" id="fmXA"></span><div class="fm-ptb" id="fmPA">0</div></div><div class="fm-ptbl">PTB</div></div>
    <div class="fm-mid"><div class="fm-bn">${m.ex?'Exhibición':`Batalla ${n+1}/${ord.length}`}</div><div class="fm-round" id="fmRound">&nbsp;</div><div class="fm-vs">VS</div></div>
    <div class="fm-side" id="fmSB">${fmFace(m.b,'lg')}<div class="fm-name">${fnameH(m.b)}</div>${styleTag(fby(m.b))}${m.ep?'<span class="tag-mini ep">EXTRAPLAYER</span>':''}<div class="fm-ptbrow"><div class="fm-ptb" id="fmPB">0</div><span class="fm-plus" id="fmXB"></span></div><div class="fm-ptbl">PTB</div></div>
  </div>
  <div class="fm-table-wrap"><table class="fm-judges"><thead><tr><th>Ronda</th>${judgeHeads(m)}</tr></thead><tbody>
    ${roundsOf(m).map((R,r)=>`<tr id="fmR${r}"><td class="fm-rn">${R.n}${roundsOf(m)===ROUND_SETS.long?` <small>/${R.max}</small>`:''}</td>${[0,1,2,3,4].map(j=>`<td id="fmC${r}_${j}"></td>`).join('')}</tr>`).join('')}
    <tr class="fm-tot"><td class="fm-rn">Total</td>${[0,1,2,3,4].map(j=>`<td id="fmT${j}"></td>`).join('')}</tr>
    <tr class="fm-votes"><td class="fm-rn">Voto</td>${[0,1,2,3,4].map(j=>`<td id="fmV${j}"></td>`).join('')}</tr>
  </tbody></table></div>
  <div class="fm-verdict" id="fmVerdict"></div>`;
  await shWait(1300*k()); if(!fmAlive(tok)) return false;
  const tot=[0,0]; const jt=[[0,0,0,0,0],[0,0,0,0,0]];
  const RS=roundsOf(m); const lk=1; const longF=RS.length>4;
  const cjA=countedJudges(m,0), cjB=countedJudges(m,1);
  for(let r=0;r<RS.length;r++){
    const rd=document.getElementById('fmRound'); rd.textContent=RS[r].n; rd.classList.remove('flash'); void rd.offsetWidth; rd.classList.add('flash');
    document.getElementById('fmR'+r).classList.add('now');
    await shWait(1100*k()*lk); if(!fmAlive(tok)) return false;
    let ra=0, rb=0;
    for(let j=0;j<5;j++){
      const a=dScore(m,r,0,j), b=dScore(m,r,1,j); if(cjA.has(j)) ra+=a; if(cjB.has(j)) rb+=b; jt[0][j]+=a; jt[1][j]+=b;
      const c=document.getElementById(`fmC${r}_${j}`); c.innerHTML=`<span class="${a>b?'hi':''}">${fpt(a)}</span><i>-</i><span class="${b>a?'hi':''}">${fpt(b)}</span>`; c.classList.add('pop');
      await shWait(280*k()*lk); if(!fmAlive(tok)) return false;
    }
    // PTB de la ronda en verde junto al marcador (por fuera), y luego sube el total
    const xa=document.getElementById('fmXA'), xb=document.getElementById('fmXB');
    xa.textContent='+'+fpt(ra); xb.textContent='+'+fpt(rb); [xa,xb].forEach(x=>{ x.classList.remove('show'); void x.offsetWidth; x.classList.add('show'); });
    await shWait((longF?1500:900)*k()); if(!fmAlive(tok)) return false;
    countUp(document.getElementById('fmPA'), tot[0], tot[0]+ra, 1000*k()*lk, x=>fpt(Math.round(x*2)/2)); countUp(document.getElementById('fmPB'), tot[1], tot[1]+rb, 1000*k()*lk, x=>fpt(Math.round(x*2)/2));
    await shWait(900*k()); if(!fmAlive(tok)) return false; [xa,xb].forEach(x=>x.classList.remove('show'));
    tot[0]+=ra; tot[1]+=rb;
    document.getElementById('fmR'+r).classList.remove('now');
    await shWait(1600*k()*lk); if(!fmAlive(tok)) return false;
  }
  for(let j=0;j<5;j++){ const t=document.getElementById('fmT'+j); t.innerHTML=`<span class="${jt[0][j]>jt[1][j]?'hi':''} ${cjA.has(j)?'':'nc'}" ${cjA.has(j)?'':'title="No cuenta para el PTB (nota más alta o más baja)"'}>${fpt(jt[0][j])}</span><i>-</i><span class="${jt[1][j]>jt[0][j]?'hi':''} ${cjB.has(j)?'':'nc'}" ${cjB.has(j)?'':'title="No cuenta para el PTB (nota más alta o más baja)"'}>${fpt(jt[1][j])}</span>`; }
  await shWait(1000*k()); if(!fmAlive(tok)) return false;
  for(let j=0;j<5;j++){
    const v=m.d.v[j]; const el=document.getElementById('fmV'+j);
    el.innerHTML = v==='R' ? '<span class="fm-vr">Réplica</span>' : `<span class="fm-vw">${esc((fby(v==='A'?m.a:m.b).name))}</span>`; el.classList.add('pop');
    await shWait(600*k()); if(!fmAlive(tok)) return false;
  }
  const V=document.getElementById('fmVerdict'); const W=m.result.winner;
  if(m.d.h){
    V.innerHTML=`<span class="fm-rep">¡Réplica!</span>`; await shWait(2000*k()); if(!fmAlive(tok)) return false;
    V.innerHTML=`<span class="fm-rep sm">Réplica</span> A mano alzada: gana <b>${fnameH(W)}</b> ${m.d.h[0]}-${m.d.h[1]}`;
  } else V.innerHTML=`Gana <b>${fnameH(W)}</b> ${esc(fmsLabel(m))}`;
  document.getElementById(W===m.a?'fmSA':'fmSB').classList.add('won');
  document.getElementById(W===m.a?'fmSB':'fmSA').classList.add('lost');
  await shWait(900*k()); if(!fmAlive(tok)) return false;
  await fmWaitNext(n+1<fmData().ord.length ? 'Siguiente batalla' : 'Ver MVP de la jornada');
  return fmAlive(tok);
}
function fmWaitNext(label){
  return new Promise(res=>{ if(!SHOW) return res(); SHOW.nextRes=res;
    shSetBottom(`<button class="btn primary" id="fmNext" onclick="fmNext()">${label} ›</button>`);
    const b=document.getElementById('fmNext'); if(b) b.focus(); });
}
function fmNext(){ if(!SHOW) return; const r=SHOW.nextRes; SHOW.nextRes=null; shSetBottom(''); if(r) r(); }
function fmSummary(){
  if(!SHOW) return; SHOW.phase='done';
  const {L, round, ord}=fmData(); const mv=L.mvps&&L.mvps[SHOW.j];
  const sk=document.getElementById('fmSkip'); if(sk) sk.style.display='none';
  const total=round.reduce((a,m)=>a+(m.views||0),0);
  fmStage().classList.add('sum'); fmStage().innerHTML=`<div class="fm-sum">
    <div class="fm-lineup-t">Resultados de la jornada ${SHOW.j+1}</div>
    ${mv?`<div class="fm-sum-mvp">⭐ MVP: <b>${fnameH(mv.id)}</b> · ${fpt(mv.pts)} puntos</div>`:''}
    ${ord.map(([i],n)=>{ const m=round[i]; const wa=m.result.winner===m.a; const p=ptbOf(m);
      return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">${p?fpt(p[0])+' – '+fpt(p[1]):'vs'}<small>${esc(votesAB(m))}</small></span><span class="${wa?'l':'w'} r">${m.ep?'<span class="tag-mini ep">EXTRAPLAYER</span>':''}${fnameH(m.b)}${fmFace(m.b)}</span></div>
        <div class="fm-views"><span class="fm-vn" id="fmVw${n}">—</span><button class="btn small" id="fmVb${n}" onclick="fmReveal(${n})">Revelar visitas</button></div></div>`; }).join('')}
    <div class="fm-sum-foot" id="fmFoot"></div></div>`;
  shSetBottom(`<button class="btn" onclick="fmRevealAll()">Revelar todas</button><button class="btn primary" onclick="fmContinue()">Continuar</button>`);
  SHOW.revealed=new Set(); SHOW.total=total;
}
function fmReveal(n){
  if(!SHOW||SHOW.kind!=='fms'||SHOW.revealed.has(n)) return;
  const {round, ord}=fmData(); const m=round[ord[n][0]]; SHOW.revealed.add(n);
  const b=document.getElementById('fmVb'+n); if(b) b.remove();
  const el=document.getElementById('fmVw'+n); el.classList.add('on');
  countUp(el, 0, m.views||0, 1500, x=>Math.round(x).toLocaleString('es-ES')+' visitas');
  if(SHOW.revealed.size===ord.length) setTimeout(()=>{ const f=document.getElementById('fmFoot'); if(f&&SHOW) f.innerHTML=`Total: <b>${SHOW.total.toLocaleString('es-ES')}</b> visitas · <b class="pos-v">${money(Math.round(SHOW.total*VIEW_RATE))}</b> en YouTube`; }, 1550);
}
function fmRevealAll(){ const {ord}=fmData(); ord.forEach((_,n)=>setTimeout(()=>fmReveal(n), n*180)); }


/* =========================================================================
   PATROCINADORES (marcas ficticias)
========================================================================= */
const SPONSOR_BRANDS = [ // nombre, sector (mismo sector = incompatibles en la misma liga), colores
  ['Amazon','ecommerce','#232F3E','#FF9900'],['AliExpress','ecommerce','#E62E04','#ffffff'],
  ['OCB','papel','#111111','#ffffff'],
  ['Monster Energy','energetica','#000000','#7AC143'],
  ['Red Bull','energetica','#1B2A6B','#ffffff'],
  ['Pepsi','refresco','#004B93','#ffffff'],
  ['Coca-Cola','refresco','#E41E2B','#ffffff'],
  ['Fanta','refresco_n','#F7841B','#1a1a1a'],
  ['Adidas','ropa','#000000','#ffffff'],
  ['Nike','ropa','#111111','#ffffff'],
  ['Puma','ropa','#1a1a1a','#ffffff'],
  ['New Era','gorras','#0B2545','#ffffff'],
  ['JD Sports','tienda','#000000','#FFD200'],
  ['Foot Locker','tienda','#111111','#ffffff'],
  ['Spotify','musica','#1DB954','#000000'],
  ['Apple Music','musica','#FA243C','#ffffff'],
  ['Twitch','stream','#9146FF','#ffffff'],
  ['Kick','stream','#53FC18','#000000'],
  ['Movistar','teleco','#019DF4','#ffffff'],
  ['Vodafone','teleco','#E60000','#ffffff'],
  ['Claro','teleco','#DA291C','#ffffff'],
  ['Burger King','comida','#D62300','#F5EBDC'],
  ["McDonald's",'comida','#DA291C','#FFC72C'],
  ['KFC','comida','#A3080C','#ffffff'],
  ['PlayStation','consola','#003791','#ffffff'],
  ['Xbox','consola','#107C10','#ffffff'],
  ['Logitech G','perifericos','#00B8FC','#000000'],
  ['Razer','perifericos','#000000','#44D62C'],
  ['Samsung','movil','#1428A0','#ffffff'],
  ['Xiaomi','movil','#FF6900','#ffffff'],
  ['Jägermeister','licor','#1E4D2B','#F7A600'],
  ['Mahou','cerveza','#C8102E','#ffffff'],
  ['Corona','cerveza','#00205B','#F5C400'],
  ['Uber Eats','delivery','#06C167','#000000'],['Glovo','delivery','#FFC244','#00A082'],
  ['Booking','viajes','#003580','#ffffff'],['Ryanair','aerolinea','#073590','#F1C933'],['Iberia','aerolinea','#D7192D','#FFCC00'],
  ['Takis','snacks','#5B2C83','#F4D03F'],['Doritos','snacks','#E2231A','#ffffff'],
  ['Prime','isotonica','#1B1F3B','#E91E63'],['Gatorade','isotonica','#F26522','#ffffff'],
  ['Revolut','banco','#0A0A0A','#ffffff'],['Wallapop','compraventa','#13C1AC','#ffffff'],
  ['Shein','moda','#000000','#ffffff'],['Zara','moda2','#000000','#ffffff']
];
/* ---- patrocinadores con efectos especiales: pagan menos, pero dan ventajas en la liga donde están ---- */
const SPONSOR_FX = {
  'Red Bull':       {fx:'nivel',   mult:0.55, txt:'Neveras para los MCs: +2 de nivel en las jornadas (más PTB y un poco más de visitas)'},
  'Amazon':         {fx:'stream',  mult:0.6,  txt:'Material para la jornada: los streamers hablan bien con más frecuencia (+20%)'},
  'Monster Energy': {fx:'hype',    mult:0.6,  txt:'+2 de hype a toda la plantilla después de cada jornada'},
  'Spotify':        {fx:'views',   v:0.04, mult:0.65, txt:'Playlists de la liga: +4% de visitas en las batallas'},
  'Twitch':         {fx:'shield',  mult:0.65, txt:'Si un streamer habla mal, la plantilla solo pierde la mitad de hype'},
  'Nike':           {fx:'salary',  mult:0.6,  txt:'Viste a los MCs: los fichajes de esta liga cuestan un 10% menos'},
  'Coca-Cola':      {fx:'ticket',  mult:0.6,  txt:'Barra en el recinto: +15% de taquilla'},
  'Movistar':       {fx:'prod',    mult:0.6,  txt:'Pone la retransmisión: −30% en costes de producción'},
  'Burger King':    {fx:'weekday', mult:0.65, txt:'Promos entre semana: las jornadas de lunes a jueves no pierden taquilla'},
  'PlayStation':    {fx:'rep',     mult:0.65, txt:'Campaña conjunta: +3 de reputación por jornada'},
  'JD Sports':      {fx:'mvp',     mult:0.65, txt:'Premio al MVP: +2 de fama y +4 de hype al MVP de cada jornada'},
  // solo funcionan en una liga concreta (en las demás son un patrocinador normal)
  'Pepsi':          {fx:'salary', v:0.20, only:'fms_mexico',    txt:'Los fichajes de la liga cuestan un 20% menos'},
  'Corona':         {fx:'ticket', v:0.30, only:'fms_mexico',    txt:'+30% de taquilla'},
  'Mahou':          {fx:'ticket', v:0.30, only:'fms_espana',    txt:'+30% de taquilla'},
  'Vodafone':       {fx:'prod',   v:0.50, only:'fms_espana',    txt:'−50% en costes de producción'},
  'Adidas':         {fx:'salary', v:0.20, only:'fms_argentina', txt:'Los fichajes de la liga cuestan un 20% menos'},
  'Kick':           {fx:'stream', v:0.40, only:'fms_argentina', txt:'Los streamers hablan bien mucho más a menudo (+40%)'},
  'Claro':          {fx:'views',  v:0.05, only:'fms_colombia',  txt:'+5% de visitas en las batallas'},
  'Fanta':          {fx:'hype',   v:4,    only:'fms_peru',      txt:'+4 de hype a toda la plantilla después de cada jornada'},
  'Xiaomi':         {fx:'views',  v:0.05, only:'fms_chile',     txt:'+5% de visitas en las batallas'},
  "McDonald's":     {fx:'rep',    v:6,    only:'fms_caribe',    txt:'+6 de reputación por jornada'},
  'Uber Eats':      {fx:'exfee', v:0.10, mult:0.8, txt:'Las exhibiciones de esta liga cuestan un 10% menos'},
  'Booking':        {fx:'exfee', v:0.10, mult:0.8, txt:'Paga los hoteles: las exhibiciones de esta liga cuestan un 10% menos'},
  'Ryanair':        {fx:'exfee', v:0.10, mult:0.8, txt:'Vuelos baratos: las exhibiciones de esta liga cuestan un 10% menos'},
  'Prime':          {fx:'hype',  v:3,    mult:0.7, txt:'+3 de hype a toda la plantilla después de cada jornada'},
  'Takis':          {fx:'exfee', v:0.10, only:'fms_mexico', txt:'Las exhibiciones cuestan un 10% menos'},
  'Revolut':        {fx:'rep',   v:4,    mult:0.7, txt:'+4 de reputación por jornada'},
  'Samsung':        {fx:'views',  v:0.05, only:'fms_ws',        txt:'+5% de visitas en las batallas'},
  'Jägermeister':   {fx:'mvp',    v:1,    only:'fms_ws',        txt:'Premio al MVP: +2 de fama y +4 de hype al MVP de cada jornada'},
};
const FX_DEF={exfee:0.10, nivel:2, stream:0.2, hype:2, views:0.12, shield:1, salary:0.10, ticket:0.15, prod:0.30, weekday:1, rep:3, mvp:1};
function spFx(x){ return x && SPONSOR_FX[x.name] || null; }
function fxOn(x, key){ const e=spFx(x); return !!(e && (!e.only || e.only===key)); }
function fxVal(key, fx){ const c=state.company; const sl=c && c.sponsors && c.sponsors[key]; if(!sl) return spkFxAdd(key,fx); let v=0;
  sl.forEach(x=>{ if(x && fxOn(x,key) && spFx(x).fx===fx){ const e=spFx(x); v=Math.max(v, e.v!=null?e.v:FX_DEF[fx]); } }); return v + spkFxAdd(key,fx); }
function spkFxAdd(key, fx){ return ['stream','views','salary','exfee'].includes(fx) && typeof spkVal==='function' ? spkVal(key,fx) : 0; }
function leagueHasFx(key, fx){ return fxVal(key,fx)>0; }
function spPool(key){ const c=spState(); return isWS(key) ? c.wsPool : c.sponsorPool; }
function fxTag(x){ const e=spFx(x); return e ? `<span class="sp-fx">⚡ ${esc(e.txt)}${e.only?` <small>(solo en ${ldef(e.only).name}; en otra liga es un patrocinador normal)</small>`:''}</span>` : ''; }
function spState(){ const c=state.company; if(!c.sponsors) c.sponsors={}; if(!c.sponsorPool) c.sponsorPool=[]; if(!c.wsPool) c.wsPool=[];
  if(!c.spReal){ const ok=x=>x && SPONSOR_BRANDS.some(b=>b[0]===x.name); const lost=c.sponsorPool.filter(x=>!ok(x)).length+Object.values(c.sponsors).flat().filter(x=>x&&!ok(x)).length;
    c.sponsorPool=c.sponsorPool.filter(ok); Object.keys(c.sponsors).forEach(k=>{ c.sponsors[k]=c.sponsors[k].map(x=>ok(x)?x:null); });
    if(lost) sponsorOffers(c.stars||1, lost, true); c.spReal=true; }
  if(!c.spStart){ c.spStart=true; const any=c.sponsorPool.length || Object.values(c.sponsors).flat().some(Boolean); if(!any) sponsorOffers(c.stars||0, 3, true); }
  return c; }
function sponsorOffers(stars, n, raw, ws){
  const c=raw? state.company : spState(); const used=ws ? new Set([...(c.wsPool||[]).map(x=>x.name), ...((c.sponsors||{})[WS.key]||[]).map(x=>x&&x.name)]) : new Set([...c.sponsorPool.map(x=>x.name), ...Object.values(c.sponsors).flat().map(x=>x&&x.name)]);
  const free=shuffle(SPONSOR_BRANDS.filter(b=>!used.has(b[0])));
  const out=[];
  for(let i=0;i<n && i<free.length;i++){
    const [name,cat,bg,fg]=free[i];
    const fxm=((SPONSOR_FX[name]||{}).mult||1)*(ws?2:1);
    const amount=Math.round((1000+Math.random()*1800)*(1+0.35*stars)*fxm/100)*100;
    out.push({id:uid('sp'), name, cat, bg, fg, amount, stars});
  }
  if(ws){ if(!c.wsPool) c.wsPool=[]; c.wsPool.push(...out); } else { c.sponsorPool.push(...out); c.newOffers=(c.newOffers||0)+out.length; }
  return out;
}
function spLocked(x){ return !!(x && x.lockSeason!=null && cur() && x.lockSeason===cur().number); }
function sponsorSlotLimit(){ return (state.seasons && state.seasons.length>1) ? 3 : 1; }
function leagueSponsors(key){ const c=spState(); if(!c.sponsors[key]) c.sponsors[key]=[null,null,null]; return c.sponsors[key]; }
function sponsorIncome(key){ const lim=sponsorSlotLimit(); return Math.round(leagueSponsors(key).reduce((a,x,i)=>a+(x&&i<lim?x.amount:0),0)*(1+spkVal(key,'spons'))); }
function spBadge(x, big){ let n=x.name.replace(/ Energy| Music| Sports| G$/,''); if(n.length>8) n=n.split(/[\s-]/).map(w=>w[0]).join('').slice(0,3).toUpperCase(); if(n==='P') n='PS';
  const fs = n.length<=4 ? (big?14:12) : (n.length<=6 ? (big?11.5:10) : (big?10:8.5));
  return `<span class="sp-badge ${big?'big':''}" style="background:${x.bg};color:${x.fg};font-size:${fs}px" title="${esc(x.name)}">${esc(n)}</span>`; }
function ensureWSOffers(){ const s=cur(); if(!s || !s.activeKeys.includes(WS.key)) return; const c=spState(); if(c.wsOfferYear===s.year) return; c.wsOfferYear=s.year; if(c.wsPool.length<3) sponsorOffers(Math.max(5,state.company.stars||0), 4-c.wsPool.length, false, true); }
function renderSponsorSlots(key){
  if(isWS(key)) ensureWSOffers();
  const slots=leagueSponsors(key); const c=spState(); const total=sponsorIncome(key); const lim=sponsorSlotLimit();
  return `<div class="sp-box"><div class="sp-head"><b>Patrocinadores</b> <span class="step-note">${slots.filter((x,i)=>x&&i<lim).length}/${lim} · +${money(total)} por jornada</span>${spPool(key).length?`<span class="sp-pool">${spPool(key).length} oferta${spPool(key).length>1?'s':''} disponible${spPool(key).length>1?'s':''}</span>`:''}</div>
    <div class="sp-slots">${slots.map((x,i)=> i>=lim ? `<div class="sp-slot locked"><span class="sp-plus">🔒</span><span><b>Bloqueado</b><small>Se abre la próxima temporada</small></span></div>` : x ? `<button class="sp-slot on" onclick="openSponsorSlot('${key}',${i})">${spBadge(x)}<span><b>${esc(x.name)}${fxOn(x,key)?' ⚡':''}</b><small>+${money(x.amount)} / jornada${spLocked(x)?' · 🔒 hasta '+(cur().year+1):''}</small></span></button>`
      : `<button class="sp-slot" onclick="openSponsorSlot('${key}',${i})"><span class="sp-plus">+</span><span><b>Hueco libre</b><small>${spPool(key).length?'Elige un patrocinador':'Sin ofertas (llegan al ganar una estrella)'}</small></span></button>`).join('')}</div></div>`;
}
function openSponsorSlot(key, i){
  if(cur().phase!=='pre' && !leagueSponsors(key)[i]){ toast('Los patrocinadores solo se pueden colocar antes de empezar la temporada.'); return; }
  if(i>=sponsorSlotLimit()){ toast('En la primera temporada solo tienes 1 hueco de patrocinio.'); return; }
  const c=spState(); const slots=leagueSponsors(key); const curS=slots[i];
  if(spLocked(curS)){ openModal(`<h3>Patrocinio · ${ldef(key).name}</h3>
    <div class="sp-row cur">${spBadge(curS,true)}<div><b>${esc(curS.name)}</b><small>+${money(curS.amount)} por jornada</small>${fxTag(curS)}</div></div>
    <p class="step-note" style="margin:10px 0 0">🔒 Contrato firmado para esta temporada. Podrás cambiarlo o quitarlo a partir de ${cur().year+1}.</p>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, true); return; }
  openModal(`<h3>Patrocinio · ${ldef(key).name}</h3>
    ${curS?`<div class="sp-row cur">${spBadge(curS,true)}<div><b>${esc(curS.name)}</b><small>Ahora en este hueco · +${money(curS.amount)} por jornada</small>${fxTag(curS)}</div><button class="btn small danger" onclick="removeSponsor('${key}',${i})">Quitar</button></div>`:''}
    <p class="step-note" style="margin:10px 0 8px">${spPool(key).length?'Ofertas disponibles. Cada patrocinador paga en cada jornada de esta liga. ⚠️ Una vez lo eliges, no podrás cambiarlo hasta la próxima temporada.':'No tienes ofertas libres. Llegan nuevas cada vez que tu empresa gana una estrella.'}</p>
    <div class="sp-list">${spPool(key).slice().sort((a,b)=>b.amount-a.amount).map(x=>{ const cl=sponsorClash(key,i,x);
      return `<button class="sp-row ${cl?'clash':''}" onclick="assignSponsor('${key}',${i},'${x.id}')" ${cl?'aria-disabled="true"':''}>${spBadge(x,true)}<div><b>${esc(x.name)}</b><small>${cl?`No compatible con ${esc(cl.name)}`:`Oferta de ${x.stars}★`}</small>${fxTag(x)}</div><span class="sp-amt">+${money(x.amount)}<small>por jornada</small></span></button>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`, true);
}
function sponsorClash(key, i, x){ const cat=x.cat||brandCat(x.name); const sl=leagueSponsors(key);   // la exclusividad solo cuenta dentro de la misma liga
  for(let n=0;n<sl.length;n++){ const y=sl[n]; if(!y || n===i) continue; if((y.cat||brandCat(y.name))===cat) return y; }
  return null; }
function brandCat(name){ const b=SPONSOR_BRANDS.find(b=>b[0]===name); return b? b[1] : name; }
function assignSponsor(key, i, id){ if(cur().phase!=='pre'){ toast('Los patrocinadores solo se pueden colocar antes de empezar la temporada.'); return; }
  if(i>=sponsorSlotLimit()) return;
  if(spLocked(leagueSponsors(key)[i])){ toast('Ese patrocinador tiene contrato hasta la próxima temporada.'); return; }
  const c=spState(); const slots=leagueSponsors(key); const k=spPool(key).findIndex(x=>x.id===id); if(k<0) return;
  const clash=sponsorClash(key, i, spPool(key)[k]); if(clash){ toast(`${spPool(key)[k].name} no es compatible con ${clash.name}: tienen exclusividad.`); return; }
  const x=spPool(key).splice(k,1)[0]; if(slots[i]) spPool(key).push(slots[i]); x.lockSeason=cur().number; slots[i]=x; c.newOffers=0;
  closeModal(); toast(`${x.name} patrocina ${ldef(key).name}: +${money(x.amount)} por jornada. Contrato cerrado hasta ${cur().year+1}.`); render();
}
function removeSponsor(key, i){ const c=spState(); const slots=leagueSponsors(key); if(spLocked(slots[i])){ toast('Ese patrocinador tiene contrato hasta la próxima temporada.'); return; } if(slots[i]){ spPool(key).push(slots[i]); slots[i]=null; } closeModal(); render(); }

/* =========================================================================
   STREAMERS: Force y Rodrigo Quesada opinan de tu jornada al día siguiente
========================================================================= */
const STREAMERS = {
  force:  {name:'Force', photo:"assets/img/extra/streamer_force.jpg", pGood:0.7},
  quesada:{name:'Rodrigo Quesada', photo:"assets/img/extra/streamer_quesada.jpg", pGood:0.4},
};
STREAMERS.gavyria={name:'Gavyria', pGood:0.6, photo:null}; STREAMERS.yagami={name:'Yagami', pGood:0.5, photo:null};
function streamerPhoto(S){ return S.photo || (typeof FACES!=='undefined' && FACES[S.name]) || null; }
if(typeof EXTRA_IMG!=='undefined'){ LOGOS[WS.key]=EXTRA_IMG.ws; STREAMERS.yagami.photo=EXTRA_IMG.yagami; }
const STREAM_CHANCE = 1;   // siempre habla alguien; solo cambia quién


/* =========================================================================
   COMPETICIONES UNDER (externas, entre semana, pocas visitas)
========================================================================= */
const UNDER_DEFS = [
  {key:'u_cuna',  name:'Cuna de Oro',       short:'CDO', countries:['Argentina'], famaMax:85, color:'#C9A227'},
  {key:'u_gr',    name:'General Rap',       short:'GR',  countries:['España'],    famaMax:83, color:'#2E86DE'},
  {key:'u_bdm',   name:'BDM Internacional', short:'BDM', countries:null,          famaMax:83, perCountry:true, color:'#B03A2E'},
  {key:'u_chess', name:'Chess Battle',      short:'CHS', countries:['México'],    famaMax:85, exc:['Rapder'], color:'#16A085'},
  {key:'u_dem',   name:'DEM Battles',       short:'DEM', countries:['Chile'],     famaMax:85, color:'#7D3C98'},
];
const MFU = {key:'u_mfu', name:'Monster Fu', short:'MFU', color:'#6AB04C'};
const UNDER_EXC = ['Teorema','El Menor','Acru','Dyse','Alek','Segrelles','Dalia','Mr. Ego','Kodigo','HDR','Abel','Mecha','Naista','MP','Stick','Replik','NQP','Fat N','Dani VK','Tirpa','Anubis','Bélico','Jesse Pungaz','Exe','Sophia','Kmbra','Nez','Rodamiento','Joqerr','Fabiuki','CTZ','Tata','Fat Tony','Potencia'];
const UNDER_RARE = ['El Menor','Acru'];
function ulogo(key){ return (typeof EXTRA_IMG!=='undefined' && EXTRA_IMG[key]) || null; }
function udef(key){ return key===MFU.key ? MFU : UNDER_DEFS.find(d=>d.key===key); }
function isWeekday(y,d){ const w=dayToDate(y,d).getUTCDay(); return w>=1 && w<=5; }
function underGenerate(s, from){
  const y=s.year, diy=daysInYear(y); from=from||0;
  const busy=new Set([...rbEventsList(s).map(e=>e.day), ...seasonEvents(s).map(e=>e.day)]); if(rbOn(s)) busy.add(s.rb.inter.voteDay);
  const pickDay=m=>{ const days=[]; for(let d=Math.max(from,0); d<diy; d++){ if(monthOf(y,d)===m && isWeekday(y,d) && !busy.has(d) && !busy.has(d-1) && !busy.has(d+1)) days.push(d); } if(!days.length) return null; const d=days[Math.floor(Math.random()*days.length)]; busy.add(d); return d; };
  const months=shuffle([...Array(11).keys()].map(x=>x+1)).filter(m=>monthOf(y,Math.max(from,0))<=m);
  const ev=[]; let mi=0;
  UNDER_DEFS.forEach(def=>{ while(mi<months.length){ const d=pickDay(months[mi++]); if(d!=null){ ev.push({key:def.key, day:d, played:false}); break; } } });
  const mm=shuffle([...Array(12).keys()].filter(m=>monthOf(y,Math.max(from,0))<=m)); let n=0;
  for(const m of mm){ if(n>=3) break; const d=pickDay(m); if(d!=null){ ev.push({key:MFU.key, day:d, played:false, n:++n}); } }
  s.under=ev.sort((a,b)=>a.day-b.day); let k=0; s.under.forEach(e=>{ if(e.key===MFU.key) e.n=++k; });
}
function underByDay(s){ const m={}; (s.under||[]).forEach(e=>m[e.day]=e); return m; }
function underEligible(f, def){
  if(UNDER_EXC.includes(f.name) || (def.exc && def.exc.includes(f.name))){ return UNDER_RARE.includes(f.name) ? Math.random()<0.1 : true; }
  return f.fama<=def.famaMax;
}
function underPick(list, n){ const sorted=list.slice().sort((a,b)=>quality(b)-quality(a)); const out=[]; const pool=sorted.slice();
  while(out.length<n && pool.length){ const i=Math.min(pool.length-1, Math.floor(Math.pow(Math.random(),1.6)*pool.length)); out.push(pool.splice(i,1)[0].id); } return out; }
function runUnder(s, ev, d){
  const def=udef(ev.key);
  if(ev.key===MFU.key){
    const es=state.freestylers.filter(f=>f.country==='España' && (f.fama<=83 || ['Sweet Pain','Zasko','Swit Eme'].includes(f.name) || UNDER_EXC.includes(f.name)) && f.name!=='Khan');
    const intl=state.freestylers.filter(f=>f.country!=='España' && f.fama<=83);
    const ni=rint(0,2); const ids=[...underPick(es, 10-ni), ...underPick(intl, ni)];
    const must=['Zasko','Sweet Pain'].map(n=>state.freestylers.find(f=>f.name===n)).filter(Boolean);
    if(must.length && !must.some(f=>ids.includes(f.id))){ const pickM=shuffle(must); const want=Math.random()<0.4 ? pickM : [pickM[0]];
      want.forEach(f=>{ const i=ids.findIndex(id=>!must.some(x=>x.id===id) && fby(id).country==='España'); if(i>=0) ids[i]=f.id; else ids.push(f.id); }); }
    const ord=shuffle(ids); ev.battles=[];
    for(let i=0;i+1<ord.length && ev.battles.length<5;i+=2){ const m={a:ord[i], b:ord[i+1], result:null}; simulateBattle(m, null); m.views=Math.round(rint(100000,1000000)*(isRival(m.a,m.b)?1.15:1)); addHype(m.result.winner,3); ev.battles.push(m); }
    ev.played=true; underTutQueue(ev.key, ev.battles.map(m=>m.result.winner)); addLog(s, d, `🟢 ${def.name} #${ev.n}: ${ev.battles.map(m=>fname(m.result.winner)).join(', ')} ganan sus batallas.`, 'rb'); return;
  }
  const ids=ev.order && ev.order.length===16 ? ev.order.slice() : underDraw(ev);
  const r=runKnockout(ev.order||shuffle(ids), null, 0.15);
  Object.assign(ev, r, {participants:ids, played:true});
  addHype(r.champion, 5); underTutQueue(ev.key, [r.champion]);
  addLog(s, d, `🟢 <b>${fname(r.champion)}</b> gana la ${def.name} ante ${fname(r.runnerUp)} (+5 de hype).`, 'rb');
}
function underDraw(ev){ const def=udef(ev.key); let ids;
  if(def.perCountry){ const by={}; state.freestylers.filter(f=>underEligible(f,def)).forEach(f=>{ (by[f.country]=by[f.country]||[]).push(f); });
    ids=shuffle(Object.keys(by)).slice(0,16).map(c=>underPick(by[c],1)[0]);
    if(ids.length<16){ const rest=state.freestylers.filter(f=>f.fama<=def.famaMax && !ids.includes(f.id)); ids.push(...underPick(rest,16-ids.length)); } }
  else ids=underPick(state.freestylers.filter(f=>def.countries.includes(f.country) && underEligible(f,def)), 16);
  if(ids.length<16){ ids.push(...underPick(state.freestylers.filter(f=>!ids.includes(f.id) && f.fama<=def.famaMax), 16-ids.length)); }
  ev.participants=ids; return ids;
}
function openMFU(day){
  const s=cur(); const ev=(s.under||[]).find(e=>e.key===MFU.key && e.day===day); if(!ev) return;
  ev.presented=true; advance('day'); if(!ev.played) return;
  state.ui.kov=ev.battles.map(m=>m.views||0); state.ui.kovMoney=false;
  const rows=ev.battles.map((m,i)=>{ const wa=m.result.winner===m.a;
    return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">vs<small>gana ${fnameH(m.result.winner)}</small></span><span class="${wa?'l':'w'} r">${fnameH(m.b)}${fmFace(m.b)}</span></div>
      <div class="fm-views"><span class="fm-vn" id="kov${i}">—</span><button class="btn small" id="kob${i}" onclick="kovReveal(${i})">Revelar visitas</button></div></div>`; }).join('');
  openModal(`<h3>${ulogo(MFU.key)?`<img class="un-logo" src="${ulogo(MFU.key)}" alt="">`:''}${MFU.name} #${ev.n} · ${fmtDay(s.year,day)}</h3><p class="step-note">5 batallas sueltas. Cada ganador se lleva +3 de hype.</p>
    <div class="kov">${rows}</div><div class="fm-sum-foot" id="kovFoot"></div>
    <div class="modal-actions"><button class="btn" onclick="kovAll()">Revelar todas</button><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), MFU.key);
}
function showUnder(key, day){
  const s=cur(); const ev=(s.under||[]).find(e=>e.key===key && e.day===day); if(!ev) return; const def=udef(key);
  let body='';
  if(!ev.played) body=`<p class="step-note">Se juega el ${fmtDay(s.year,ev.day)}. Es una competición externa: no puedes poner jornadas ese día.</p>`;
  else if(ev.battles) body=`<div class="tb-list">${ev.battles.map(m=>{ const wa=m.result.winner===m.a; return `<div class="tb-row"><div class="tb-faces"><span class="tb-face ${wa?'w':''}" style="${avatarDivStyle(fby(m.a))}">${avatarContent(fby(m.a))}</span><span class="tb-face ${wa?'':'w'}" style="${avatarDivStyle(fby(m.b))}">${avatarContent(fby(m.b))}</span></div><div class="tb-info"><div class="tb-names"><span class="${wa?'w':''}">${fnameH(m.a)}</span> <i>vs</i> <span class="${wa?'':'w'}">${fnameH(m.b)}</span></div><div class="tb-meta">gana ${fnameH(m.result.winner)}</div></div><div class="tb-views">${fmtViews(m.views)}<small>visitas</small></div></div>`; }).join('')}</div>`;
  else { const fin=ev.bracket.rounds[ev.bracket.rounds.length-1][0];
    body=`<div class="sum-row"><span>🏆 Campeón</span><b>${fnameH(ev.champion)}</b></div><div class="sum-row"><span>Subcampeón</span><span>${fnameH(ev.runnerUp)}</span></div><div class="sum-row"><span>3º</span><span>${fnameH(ev.third)}</span></div>
      <div class="sum-sec">Participantes</div><div class="un-people">${ev.participants.map(id=>`<span class="un-p">${miniAvatar(id,22)} ${fnameH(id)}</span>`).join('')}</div>`; }
  openModal(`<h3>${ulogo(key)?`<img class="un-logo" src="${ulogo(key)}" alt="">`:`<span class="un-dot" style="background:${def.color}"></span>`}${def.name}${ev.n?' #'+ev.n:''} ${s.year}</h3>${body}<div class="modal-actions"><button class="btn primary" onclick="closeModal()">Cerrar</button></div>`, true);
}

/* =========================================================================
   FMS WORLD SERIES: 5 jornadas, 2 batallas por competidor y jornada, extraplayers
========================================================================= */
function wsMatch(P, need, used, pairs, guard){
  if(guard.n++>4000) return null;
  const open=P.filter(x=>need[x]>0); if(!open.length) return pairs.slice();
  let best=null, bestOpts=null;
  for(const x of open){ const opts=open.filter(y=>y!==x && !used.has(pairKey(x,y))); if(opts.length<need[x]) return null; if(!best || opts.length<bestOpts.length){ best=x; bestOpts=opts; } }
  for(const y of shuffle(bestOpts)){
    need[best]--; need[y]--; used.add(pairKey(best,y)); pairs.push([best,y]);
    const r=wsMatch(P, need, used, pairs, guard); if(r) return r;
    pairs.pop(); used.delete(pairKey(best,y)); need[best]++; need[y]++;
  }
  return null;
}
function wsRound(P, used, epDone, fp, fe){
  for(let t=0;t<30;t++){
    const cand=shuffle(P.filter(x=>!epDone.has(x) && !fe.includes(x)));
    const eps=[...fe, ...cand].slice(0,2); if(eps.length<2) return null;
    const need={}; P.forEach(x=>need[x]= eps.includes(x)?1:2);
    let ok=true; const pairs=[]; const lu=new Set(used);
    for(const [a,b] of fp){ if(lu.has(pairKey(a,b))||need[a]<=0||need[b]<=0){ ok=false; break; } need[a]--; need[b]--; lu.add(pairKey(a,b)); pairs.push([a,b]); }
    if(!ok){ if(fe.length>=2) return null; continue; }
    const res=wsMatch(P, need, lu, pairs, {n:0});
    if(res) return {pairs:res, eps};
    if(fe.length>=2 && t>6) return null;
  }
  return null;
}
function wsSolve(P, used, epDone, fp, fe, n){
  for(let attempt=0; attempt<80; attempt++){
    const u=new Set(used), e=new Set(epDone), out=[]; let ok=true;
    for(let k=0;k<n;k++){ const r=wsRound(P, u, e, k===0?fp:[], k===0?fe:[]); if(!r){ ok=false; break; }
      r.pairs.forEach(([a,b])=>u.add(pairKey(a,b))); r.eps.forEach(x=>e.add(x)); out.push(r); }
    if(ok) return out;
  }
  return null;
}
function wsState(L){ const used=new Set(), ep=new Set();
  L.rounds.slice(0,L.played).forEach(r=>r.forEach(m=>{ if(m.ep) ep.add(m.a); else used.add(pairKey(m.a,m.b)); })); return {used, ep}; }
function wsRoundsFrom(sol){ return sol.map(r=>[...r.pairs.map(([a,b])=>({id:uid('m'), a, b, result:null})), ...r.eps.map(c=>({id:uid('m'), a:c, b:null, ep:true, result:null}))]); }
function wsBuildRounds(L){ const sol=wsSolve(L.competitors, new Set(), new Set(), [], [], WS_JORNADAS); return wsRoundsFrom(sol||[]); }
function wsEpFee(f){ return Math.max(100, Math.round(contractCostBase(f, WS.key)*0.05*(1-fxVal(WS.key,'exfee'))/100)*100); }
function wsDraft(key){ const L=cur().leagues[key]; const k='wsd_'+key; let d=state.ui[k];
  if(!d || d.round!==L.played) d=state.ui[k]={round:L.played, pairs:[], eps:[{c:null,x:null},{c:null,x:null}], sel:null, slot:null, sede:null};
  return d; }
function wsFeasible(L, pairs, epc){ const st=wsState(L); return !!wsSolve(L.competitors, st.used, st.ep, pairs, epc, WS_JORNADAS-L.played); }
function wsNeed(L, d, id){ return 2 - d.pairs.filter(p=>p.includes(id)).length - d.eps.filter(e=>e.c===id).length; }
function wsPairingEditor(s, key){
  const L=s.leagues[key]; const jn=L.played+1;
  if(L.confirmed[L.played]) return `<div class="banner" style="margin-top:14px;">Cruces de la J${jn} (${fmtDay(s.year,L.dates[L.played])}) elegidos.&nbsp;<button class="btn small" onclick="wsUnconfirm('${key}')">Cambiar</button></div>`;
  const d=wsDraft(key); const st=wsState(L);
  const chips=L.competitors.map(id=>{ const n=wsNeed(L,d,id); if(n<=0) return '';
    const isSel=d.sel===id; const blocked = d.slot==null ? (d.sel && d.sel!==id && st.used.has(pairKey(d.sel,id))) : st.ep.has(id);
    return `<button class="pair-chip ${isSel?'sel':''} ${blocked?'blocked':''}" onclick="wsTap('${key}','${id}')">${miniAvatar(id,22)}<span>${fnameH(id)}</span><small>${n}/2</small></button>`; }).join('');
  const epCard=(e,i)=>`<div class="ws-ep ${d.slot===i?'on':''}" onclick="wsSlot('${key}',${i})">
      <div class="ws-ep-h">Extraplayer ${i+1}</div>
      <div class="ex-row">${e.c?`${miniAvatar(e.c,24)} ${fnameH(e.c)}`:'<span class="step-note">Competidor…</span>'} <span class="vs">vs</span> ${e.x?`${fnameH(e.x)} ${miniAvatar(e.x,24)}<small class="step-note">${moneyK(wsEpFee(fby(e.x)))}</small>`:'<span class="step-note">Extraplayer…</span>'}</div>
      ${(e.c||e.x)?`<button class="btn small ghost" onclick="event.stopPropagation(); wsClearEp('${key}',${i})">Quitar</button>`:''}</div>`;
  let grid='';
  if(d.slot!=null){ const q=state.ui.wsQ||''; const el=state.freestylers.filter(f=>!L.competitors.includes(f.id) && fMatch(f,q)).sort((a,b)=>b.fama-a.fama).slice(0,40);
    grid=`<p class="step-note" style="margin:8px 0">Toca arriba al competidor que se enfrentará al extraplayer ${d.slot+1} (cada uno solo una vez en la temporada) y elige aquí al extraplayer. Se puede repetir extraplayer.</p>
      <input id="wsQ" class="ex-q" placeholder="Buscar extraplayer por nombre o país" value="${esc(q)}" oninput="state.ui.wsQ=this.value; render()">
      <div class="pick-grid ex-grid">${el.map(f=>`<div class="pick-item ${d.eps[d.slot].x===f.id?'checked':''}" onclick="wsPickX('${key}','${f.id}')">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}</div></div>
        <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br><span class="sal">${moneyK(wsEpFee(f))}</span></div></div>`).join('')}</div>`; }
  const ready=d.pairs.length===9 && d.eps.every(e=>e.c&&e.x) && !!d.sede;
  return `<div class="pair-editor">
    <div class="step-head" style="margin-bottom:6px;"><h3>Cruces de la jornada ${jn}</h3><span class="counter"><span class="n">${d.pairs.length}</span>/9 · <span class="n">${d.eps.filter(e=>e.c&&e.x).length}</span>/2 EP</span></div>
    <p class="step-note" style="margin-bottom:10px;">${fmtDay(s.year,L.dates[L.played])}. Cada competidor hace 2 batallas por jornada. Toca dos para enfrentarlos; además hay 2 batallas contra extraplayers.</p>
    <div class="field-label" style="margin-top:4px">País de la jornada (los de ese país juegan como locales)</div>
    <div class="ws-sedes">${SEDES.map(c=>`<button class="seg ${d.sede===c?'on':''}" onclick="wsSede('${key}','${c}')">${c}</button>`).join('')}</div>
    <div class="pair-free" style="margin-top:10px">${chips || '<span class="step-note">Todos tienen sus 2 batallas.</span>'}</div>
    <div class="ws-eps">${d.eps.map(epCard).join('')}</div>${grid}
    ${d.pairs.length?`<div class="matches-grid" style="margin-top:12px;">${d.pairs.map((p,i)=>`<div class="match" style="min-height:0;"><div class="match-head">
      <div class="match-side left">${miniAvatar(p[0],22)}<span class="side-name">${fnameH(p[0])}</span></div><div class="vs">vs</div>
      <div class="match-side right"><span class="side-name">${fnameH(p[1])}</span>${miniAvatar(p[1],22)}</div></div>
      <div class="match-result"><span>${fby(p[0]).nivel} · ${fby(p[1]).nivel}</span><button class="btn small ghost" onclick="wsRemovePair('${key}',${i})">Deshacer</button></div></div>`).join('')}</div>`:''}
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
      <button class="btn small" onclick="wsAuto('${key}')">${d.pairs.length||d.eps.some(e=>e.c||e.x)?'Completar el resto al azar':'Sortear todos'}</button>
      ${d.pairs.length||d.eps.some(e=>e.c||e.x)?`<button class="btn small danger" onclick="wsClear('${key}')">Vaciar</button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small primary" ${ready?'':'disabled'} onclick="wsConfirm('${key}')">Confirmar cruces</button>
    </div></div>`;
}
function wsSede(key,c){ const d=wsDraft(key); d.sede = d.sede===c ? null : c; render(); }
function wsSlot(key,i){ const d=wsDraft(key); d.slot = d.slot===i ? null : i; d.sel=null; render(); }
function wsTap(key,id){ const L=cur().leagues[key]; const d=wsDraft(key); const st=wsState(L);
  if(d.slot!=null){ const e=d.eps[d.slot];
    if(st.ep.has(id)){ toast(`${fname(id)} ya se enfrentó a un extraplayer esta temporada.`); return; }
    if(d.eps.some((x,i)=>i!==d.slot && x.c===id)){ toast('Ese competidor ya está en el otro extraplayer.'); return; }
    const epc=d.eps.map((x,i)=>i===d.slot?id:x.c).filter(Boolean);
    if(!wsFeasible(L, d.pairs, epc)){ toast(`Con ${fname(id)} contra un extraplayer el resto de jornadas ya no cuadra. Prueba otro.`); return; }
    e.c=id; render(); return; }
  if(d.sel==null){ d.sel=id; render(); return; } if(d.sel===id){ d.sel=null; render(); return; }
  const a=d.sel, b=id;
  if(st.used.has(pairKey(a,b)) || d.pairs.some(p=>pairKey(p[0],p[1])===pairKey(a,b))){ toast(`${fname(a)} y ${fname(b)} ya se han enfrentado.`); return; }
  const fp=[...d.pairs,[a,b]];
  if(!wsFeasible(L, fp, d.eps.map(x=>x.c).filter(Boolean))){ toast(`Con ${fname(a)} vs ${fname(b)} las jornadas que quedan ya no cuadran. Prueba otro.`); return; }
  d.pairs.push([a,b]); d.sel=null; render(); }
function wsPickX(key,id){ const d=wsDraft(key); if(d.slot==null) return; d.eps[d.slot].x=id; render(); }
function wsClearEp(key,i){ const d=wsDraft(key); d.eps[i]={c:null,x:null}; render(); }
function wsRemovePair(key,i){ const d=wsDraft(key); d.pairs.splice(i,1); d.sel=null; render(); }
function wsClear(key){ const d=wsDraft(key); d.pairs=[]; d.eps=[{c:null,x:null},{c:null,x:null}]; d.sel=null; d.slot=null; render(); }
function wsAuto(key, silent){ const s=cur(); const L=s.leagues[key]; const d=wsDraft(key); const st=wsState(L);
  const sol=wsSolve(L.competitors, st.used, st.ep, d.pairs, d.eps.map(x=>x.c).filter(Boolean), WS_JORNADAS-L.played);
  if(!sol){ toast('No hay forma de completar con esos cruces. Deshaz alguno.'); return false; }
  d.pairs=sol[0].pairs; const cs=sol[0].eps.slice(); const pool=state.freestylers.filter(f=>!L.competitors.includes(f.id)).sort((a,b)=>b.fama-a.fama).slice(0,30);
  d.eps.forEach(e=>{ if(!e.c){ e.c=cs.find(c=>!d.eps.some(x=>x.c===c)); } if(!e.x){ const f=pool[Math.floor(Math.random()*pool.length)]; e.x=f&&f.id; } });
  if(!d.sede) d.sede=SEDES[Math.floor(Math.random()*SEDES.length)];
  d.sel=null; if(!silent) render(); return true; }
function wsConfirm(key){ const s=cur(); const L=s.leagues[key]; const d=wsDraft(key);
  if(d.pairs.length!==9 || !d.eps.every(e=>e.c&&e.x) || !d.sede) return;
  const st=wsState(L); const sol=wsSolve(L.competitors, st.used, st.ep, d.pairs, d.eps.map(e=>e.c), WS_JORNADAS-L.played);
  if(!sol){ toast('Esos cruces no dejan un calendario válido.'); return; }
  const cur0=[...d.pairs.map(([a,b])=>({id:uid('m'), a, b, result:null})), ...d.eps.map(e=>({id:uid('m'), a:e.c, b:e.x, ep:true, result:null}))];
  L.rounds = L.rounds.slice(0,L.played).concat([cur0], wsRoundsFrom(sol.slice(1)));
  const fee=d.eps.reduce((a,e)=>a+wsEpFee(fby(e.x)),0); state.company.money-=fee; s.fin.salaries+=fee; if(!L.epFees) L.epFees={}; L.epFees[L.played]=fee;
  if(!L.wsSede) L.wsSede={}; L.wsSede[L.played]=d.sede;
  L.confirmed[L.played]=true; delete state.ui['wsd_'+key]; state.ui['jnav_'+key]=L.played;
  toast(`Cruces de la J${L.played+1} confirmados (extraplayers: ${money(fee)}).`); render(); }
function wsUnconfirm(key){ const s=cur(); const L=s.leagues[key]; const r=L.rounds[L.played];
  const fee=(L.epFees&&L.epFees[L.played])||0; state.company.money+=fee; s.fin.salaries-=fee; if(L.epFees) delete L.epFees[L.played];
  delete L.confirmed[L.played];
  state.ui['wsd_'+key]={round:L.played, pairs:r.filter(m=>!m.ep).map(m=>[m.a,m.b]), eps:r.filter(m=>m.ep).map(m=>({c:m.a,x:m.b})).concat([{c:null,x:null},{c:null,x:null}]).slice(0,2), sel:null, slot:null, sede:(L.wsSede&&L.wsSede[L.played])||null};
  render(); }

/* =========================================================================
   EVENTOS ÚNICOS (no se explican en el juego: se descubren jugando)
========================================================================= */
let UQ_PERF = {};
let WS_SHORT = false;
const UQ_REGGAE = {'Sara Socas':0.25, 'Lokillo':0.25, 'Visionario':0.25, 'Mecha':0.05};   // minutazo a puro reggae
const UQ_REFUSE = {   // al simular el primer día: no quieren estar en la FMS
  'Walls':{p:0.9}, 'Bnet':{p:0.5}, 'Acru':{p:0.6}, 'Wos':{p:0.7}, 'Trueno':{p:0.4}, 'Duki':{p:0.9},
  'Papo':{p:1, papo:true},
  'TiagoPZK':{p:0.6, kind:'concert', exDisc:0.25}, 'Lit Killah':{p:0.7, kind:'concert', exDisc:0.15}, 'Jaloner':{p:1, kind:'retired', exDisc:0.10},
};
const UQ_PREP = {'Hander':0.05,'Force':0.10,'Ritmodelia':0.10,'Lgido':0.10,'El Menor':0.03,'Mowlihawk':0.10,'Sweet Pain':0.03,'Zaina':0.08,'Papo':0.05,'Cacha':0.10,'Gazir':0.06,'Titus':0.10};
const UQ_UNAV = {   // 5 días antes de la jornada no pueden venir
  'Papo':{p:0.10, first:true, why:'tiene que organizar Liga Bazooka'}, 'Dtoke':{p:0.10, first:true, why:'tiene que organizar Liga Bazooka'},
  'Ricto':{p:0.20, first:false, why:'no le han dado el día libre en el trabajo'}, 'Arkano':{p:0.25, first:true, why:'coincide con su participación en Supervivientes'},
  'Mowlihawk':{p:0.15, first:true, why:'tiene que grabar un Batmowli'},
  'Errecé':{p:0.10, first:false, why:'se ha ido a Bali a reflexionar sobre la vida'},
  'Éxodo Lirical':{p:0.20, first:false, why:'no puede viajar: la visa no le permite entrar al país'},
};
function uqPush(s, ev){ if(!s.uq) s.uq=[]; ev.id=uid('u'); ev.done=false; s.uq.push(ev); return ev; }
function uqSeasonStart(s){
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; L.competitors.slice().forEach(id=>{ const f=fby(id); const r=f&&UQ_REFUSE[f.name]; if(!r) return;
    const p = Math.max(0, ((isWS(k) && f.name!=='Walls') ? r.p*0.5 : r.p) - spkVal(k,'refuse'));
    if(state.company.infinite && !r.papo) return;
    if(Math.random()<p) uqPush(s, {day:s.day, type:r.papo?'papo':'refuse', key:k, fid:id, kind:r.kind||'no'}); }); });
}
function uqExhibRefuses(s, f){ const r=f&&UQ_REFUSE[f.name]; if(!r || r.papo || r.kind || state.company.infinite) return false; if(signedLeagueOf(s,f.id)) return false;   // si ya compite en una FMS, la exhibición la hace
  if(!f.exNo || f.exNo.y!==s.year) f.exNo={y:s.year, no:Math.random()<r.p}; return f.exNo.no; }
function uqRemove(s, L, id){
  const i=L.competitors.indexOf(id); if(i<0) return;
  state.company.money += L.contracts[id]||0; s.fin.salaries -= L.contracts[id]||0; delete L.contracts[id];
  if(!L.pendingRep) L.pendingRep=[]; L.pendingRep.push(id); if(!s.refused) s.refused=[]; s.refused.push(id);
}
function uqReplace(s, key, oldId, newId){
  const L=s.leagues[key]; const i=L.competitors.indexOf(oldId); if(i<0) return false; const f=fby(newId);
  const sal=contractCost(f,key); state.company.money-=sal; s.fin.salaries+=sal;
  L.competitors[i]=newId; L.contracts[newId]=sal;
  L.rounds.forEach(r=>r.forEach(m=>{ if(m.a===oldId) m.a=newId; if(m.b===oldId) m.b=newId; }));
  L.pendingRep=(L.pendingRep||[]).filter(x=>x!==oldId); delete state.ui['draft_'+key];
  addLog(s, s.day, `${ldef(key).name}: ${f.name} entra en la plantilla en lugar de ${fname(oldId)}.`, 'gold');
  return true;
}
function uqCandidates(s, key){ const L=s.leagues[key]; const bad=new Set([...(s.refused||[]), ...L.blocked]);
  return state.freestylers.filter(f=>(isWS(key) ? !L.competitors.includes(f.id) : !signedLeagueOf(s,f.id)) && !bad.has(f.id)).sort((a,b)=>b.fama-a.fama); }
function uqAutoReplace(s, key){ const L=s.leagues[key]; (L.pendingRep||[]).slice().forEach(old=>{ const c=uqCandidates(s,key).filter(f=>f.country===fby(old).country)[0] || uqCandidates(s,key)[0]; if(c) uqReplace(s,key,old,c.id); }); }
function uqApply(s, ev){
  const L=s.leagues[ev.key];
  if(ev.type==='refuse'){ uqRemove(s, L, ev.fid); const f=fby(ev.fid); if(ev.kind!=='no') f.exOffer=s.year;
    addLog(s, ev.day, `${f.name} ${ev.kind==='concert'?'no puede compaginar la FMS con sus conciertos':ev.kind==='retired'?'está retirado de las batallas':'no está interesado en estar en la FMS'}: deja ${ldef(ev.key).name}.`, 'bad'); }
  else if(ev.type==='papo'){ ev.newSal=Math.round((L.contracts[ev.fid]||contractCost(fby(ev.fid),ev.key))*1.1/100)*100; }
  else if(ev.type==='prep'){ const a=fby(ev.fid), b=fby(ev.rival); [a,b].forEach(f=>{ if(f) f.hype=Math.round((f.hype||0)*0.95*10)/10; }); L.hype=clamp(L.hype*0.95,0,100); ev.done=true; ev.show=true;
    addLog(s, ev.day, `🕵️ Acusan a <b>${a.name}</b> de ganar a ${b?b.name:'su rival'} con preparadas. La comunidad carga contra los jueces.`, 'bad'); }
  else if(ev.type==='driu'){ [ev.fid, ev.rival].forEach(id=>{ const f=fby(id); if(f) f.hype=Math.round((f.hype||0)*0.9*10)/10; }); ev.done=true; ev.show=true;
    addLog(s, ev.day, `🤯 El público no ha entendido nada de la batalla de ${fname(ev.fid)} contra ${fname(ev.rival)}.`, 'bad'); }
  else if(ev.type==='zasko'){ const f=fby(ev.fid); if(!ev.good) f.hype=Math.round((f.hype||0)*0.85*10)/10; ev.done=true; ev.show=true;
    addLog(s, ev.day, ev.good?`🔥 Zasko tuvo un buen día.`:`😶 Zasko tuvo un mal día.`, ev.good?'good':'bad'); }
  else if(ev.type==='pairv'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*ev.mult); ev.before=before; ev.after=m.views; ev.a=m.a; ev.b=m.b;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, ev.sub==='azuky'?'🌐 Azuky y Nota Roja rompen internet.':ev.sub==='rq'?'⚔️ Patrocinados de Quesada contra el Elegido de Gazir: la batalla gana visitas.':'👑 Batalla femenina: la batalla gana visitas.', 'good'); }
  else if(ev.type==='khan'){ ev.done=true; ev.show=true; addLog(s, ev.day, '📉 Un regreso decepcionante: Khan.', 'bad'); }
  else if(ev.type==='sweet'){ const f=fby(ev.fid); f.hype=Math.round((f.hype||0)*0.9*10)/10; ev.done=true; ev.show=true;
    addLog(s, ev.day, `😡 Los fans de Sweet Pain se enfadan en redes tras su derrota contra ${fname(ev.rival)}.`, 'bad'); }
  else if(ev.type==='ryker'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*1.35); ev.before=before; ev.after=m.views;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; ev.edit=1000000+Math.round(Math.random()*1800000); }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🎬 Ryker sube un edit del minuto de ${fname(ev.fid)}: la batalla se dispara.`, 'good'); }
  else if(ev.type==='reggae'){ const m=L.rounds[ev.j][ev.mi]; if(m){ const before=m.views||0; m.views=Math.round(before*1.1); ev.before=before; ev.after=m.views;
      const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🎶 ${fname(ev.fid)} se marcó un minutazo a puro reggae: la batalla gana visitas.`, 'good'); }
  else if(ev.type==='local'){ ev.ids.forEach(id=>{ const f=fby(id); if(f) f.hype=Math.round((f.hype||0)*0.9*10)/10; }); ev.done=true; ev.show=true;
    addLog(s, ev.day, `😤 Los fans se quejan del localismo con Aczino en el ${ev.comp==='fms'?INTL.name:RB_INT.name}: baja el hype.`, 'bad'); }
  else if(ev.type==='rival'){ const m= ev.comp==='fms' ? (ev.ri==='third' ? s.intl.bracket.third : s.intl.bracket.rounds[ev.ri][ev.mi]) : L.rounds[ev.j][ev.mi]; const before=m.views||0; m.views=Math.round(before*1.15); ev.before=before; ev.after=m.views;
    const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; if(L) L.income+=inc; ev.inc=inc;
    const V=RIVAL_VARS[ev.v||0]; ev.done=true; ev.show=true; addLog(s, ev.day, `${V[0].split(' ')[0]} ${rivalFill(V[1],ev)} (+15% de visitas).`, ev.v===14?'bad':'good'); }
  else if(ev.type==='viral'){ const B = ev.comp==='fms' ? s.intl.bracket : s.rb.inter.bracket; const m = ev.ri==='third' ? B.third : B.rounds[ev.ri][ev.mi];
    const before=m.views||0; m.views=Math.round(before*(ev.comp==='fms'?1.5:1.25)); ev.before=before; ev.after=m.views;
    if(ev.comp==='fms'){ const inc=Math.round((m.views-before)*VIEW_RATE); state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; ev.inc=inc; }
    ev.done=true; ev.show=true; addLog(s, ev.day, `🌐 Chuty y Aczino rompen internet: su batalla no para de sumar visitas.`, 'gold'); }
  else if(ev.type==='unavail'){ const m=L.rounds[ev.j][ev.mi]; m.postponed=true; ev.rival = m.a===ev.fid ? m.b : m.a;
    addLog(s, ev.day, `${fname(ev.fid)} no estará en la J${ev.j+1} de ${ldef(ev.key).short}: ${ev.why||UQ_UNAV[fby(ev.fid).name].why}.`, 'bad'); }
  else if(ev.type==='recup'){ const m=L.rounds[ev.j][ev.mi]; const r=simulateFMSBattle(m, leagueHasFx(L.key,'nivel')?2:0, judgesOf(L)); m.recup=true; m.postponed=false;
    m.views=Math.round(battleViews(m, 0.8*(1+0.08*state.company.stars))*0.5); m.views=Math.min(m.views, (fby(m.a).fama>=90||fby(m.b).fama>=90)?400000:100000); const inc=Math.round(m.views*VIEW_RATE);
    state.company.money+=inc; s.fin.income+=inc; s.fin.views=(s.fin.views||0)+inc; L.income+=inc; ev.done=true; ev.show=true;
    addLog(s, ev.day, `Batalla recuperativa de ${ldef(ev.key).short}: ${fname(r.W.id)} gana a ${fname(r.Lo.id)} (${m.lb}).`, 'good'); }
}
function uqAuto(s, ev){
  if(ev.type==='refuse'){ ev.done=true; }
  else if(ev.type==='papo'){ uqPapo(ev.id, true, true); }
  else if(ev.type==='unavail'){ const g=exhibEligible(s, ev.key)[0]; const days=uqRecupDays(s, ev); uqSetUnavail(ev.id, g&&g.id, days[0], true); }
  else ev.done=true;
  ev.show=false;
}
function uqCheckUnavailable(s, L, nd){
  const round=L.rounds[L.played]; if(!round) return;
  round.forEach((m,mi)=>{ if(m.postponed) return; [m.a,m.b].forEach(id=>{ const f=fby(id); const u=f&&UQ_UNAV[f.name]; if(!u || (u.first && L.played!==0)) return;
    if(round.some(x=>x.postponed)) return;
    if(Math.random()<u.p) uqPush(s, {day:s.day, type:'unavail', key:L.key, j:L.played, mi, fid:id, jday:nd}); }); });
}
function uqRecupDays(s, ev){
  const L=s.leagues[ev.key]; const dates=L.dates.slice().sort((a,b)=>a-b); const next=dates[ev.j+1]!=null?dates[ev.j+1]:Math.min(ev.jday+21, daysInYear(s.year)-1);
  const busy=new Set([...seasonEvents(s).map(e=>e.day), ...rbEventsList(s).map(e=>e.day), ...(s.under||[]).map(e=>e.day), ...((s.uq||[]).filter(x=>x.type==='recup').map(x=>x.day))]);
  if(rbOn(s)) busy.add(s.rb.inter.voteDay);
  const out=[]; for(let d=ev.jday+1; d<next; d++) if(!busy.has(d)) out.push(d);
  return out.length? out : [ev.jday+1];
}
function uqSetUnavail(evId, guestId, day, silent){
  const s=cur(); const ev=s.uq.find(x=>x.id===evId); if(!ev||ev.done) return;
  if(!guestId || day==null){ toast('Elige el invitado de la exhibición y la fecha de la recuperativa.'); return; }
  const L=s.leagues[ev.key]; const g=fby(guestId);
  if(!silent && uqExhibRefuses(s, g)){ toast(`${g.name} no está interesado en hacer una exhibición.`); state.ui.uqGuest=null; showUQ(ev); return; }
  const cost=exhibCost(g, ev.key);
  state.company.money-=cost; s.fin.salaries+=cost; state.ui.uqGuest=null; state.ui.uqDay=null; state.ui.uqQ='';
  if(!L.fexhib) L.fexhib={}; L.fexhib[ev.j]={a:ev.rival, b:guestId, missing:ev.fid, cost};
  const m=L.rounds[ev.j][ev.mi]; m.recupDay=+day;
  uqPush(s, {day:+day, type:'recup', key:ev.key, j:ev.j, mi:ev.mi});
  ev.done=true; if(!silent){ closeModal(); toast(`${fname(ev.rival)} hará exhibición contra ${g.name}. Recuperativa el ${fmtDay(s.year,+day)}.`); render(); }
}
function uqPapo(evId, accept, silent){
  const s=cur(); const ev=s.uq.find(x=>x.id===evId); if(!ev||ev.done) return; const L=s.leagues[ev.key];
  if(accept){ const extra=ev.newSal-(L.contracts[ev.fid]||0); state.company.money-=extra; s.fin.salaries+=extra; L.contracts[ev.fid]=ev.newSal;
    addLog(s, ev.day, `Papo cobrará ${money(ev.newSal)} esta temporada.`, 'gold'); }
  else { uqRemove(s, L, ev.fid); addLog(s, ev.day, `Papo se va de ${ldef(ev.key).name}: "FMS no paga lo que Papo gana".`, 'bad'); }
  ev.done=true; if(!silent){ closeModal(); render(); if(!accept) showReplace(ev.key); }
}
function uqZaskoRoll(s, L){ const z=state.freestylers.find(f=>f.name==='Zasko'); if(!z || !L.competitors.includes(z.id)) return null;
  const round=L.rounds[L.played]; if(!round || !round.some(m=>!m.postponed && (m.a===z.id||m.b===z.id))) return null;
  const r=Math.random(); if(r<0.15){ UQ_PERF[z.id]=14; return {id:z.id, good:true}; } if(r<0.30){ UQ_PERF[z.id]=-14; return {id:z.id, good:false}; } return null; }
function uqViewMult(s, L, m, zk){ let v=1; if(zk && (m.a===zk.id||m.b===zk.id)) v*= zk.good?1.15:0.85;
  if(L.skoneMx){ const sk=state.freestylers.find(f=>f.name==='Skone'); if(sk && (m.a===sk.id||m.b===sk.id)) v*=1.10; } return v; }
function uqAfterJornada(s, L, round, d, zk){
  if(zk) uqPush(s, {day:d+1, type:'zasko', key:L.key, fid:zk.id, good:zk.good});
  // enfrentamientos especiales (al día siguiente / a los dos días)
  const nm=id=>(fby(id)||{}).name; const R=L.rounds[L.played];
  const RQ=['Coloso','Alek','Segrelles','Navas','Triple R','Ander2K'], EL=['Dani VK','JM Serna','Dima'];
  const WOMEN=['NG','Azuky','Marithea','Sara Socas','Pandora','Sumeria','Necia','Bohemia','Piromana','Roma','Sandra','Eskai','Arcoiris','Adriana'];
  round.forEach(m=>{ if(!m.result) return; const a=nm(m.a), b=nm(m.b); const mi=R.indexOf(m);
    if([a,b].includes('Azuky') && [a,b].includes('Nota Roja') && Math.random()<0.75) uqPush(s, {day:d+2, type:'pairv', sub:'azuky', mult:1.35, key:L.key, j:L.played, mi, fid:m.a});
    if((RQ.includes(a)&&EL.includes(b))||(RQ.includes(b)&&EL.includes(a))) uqPush(s, {day:d+1, type:'pairv', sub:'rq', mult:1.05, key:L.key, j:L.played, mi, fid:m.a});
    if(WOMEN.includes(a) && WOMEN.includes(b)) uqPush(s, {day:d+1, type:'pairv', sub:'women', mult:1.15, key:L.key, j:L.played, mi, fid:m.a}); });
  const kh=state.freestylers.find(f=>f.name==='Khan');
  if(kh && L.played>=nJ(L.key)-1 && L.competitors.includes(kh.id)) uqPush(s, {day:d+1, type:'khan', key:L.key, fid:kh.id});
  [L.exhib&&L.exhib[L.played], L.fexhib&&L.fexhib[L.played]].forEach(x=>{ if(kh && x && x.m && (x.a===kh.id||x.b===kh.id)) uqPush(s, {day:d+1, type:'khan', key:L.key, fid:kh.id, ex:true}); });
  // Ryker: edit de un minutazo (7 días después)
  { const pl=round.filter(m=>m.result && m.d && m.d.s); if(pl.length){ const RS=roundsOf(pl[0]); const mins=RS.map((R,i)=>R.t==='min'?i:-1).filter(i=>i>=0);
      const ss=(m,r,sd)=>{ let t=0; for(let j=0;j<5;j++) t+=dScore(m,r,sd,j); return t; };
      const avg={}; mins.forEach(r=>{ let t=0,n=0; pl.forEach(m=>{ t+=ss(m,r,0)+ss(m,r,1); n+=2; }); avg[r]=t/n; });
      let best=null; pl.forEach(m=>[m.a,m.b].forEach((id,sd)=>{ if(!L.competitors.includes(id)) return; mins.forEach(r=>{ const ratio=ss(m,r,sd)/Math.max(1,avg[r]); if(!best||ratio>best.ratio) best={ratio, id, m}; }); }));
      if(best && best.ratio>=1.3){ const f=fby(best.id); const fk= f.fama>=85?1 : (f.fama>=75?0.45 : 0.1);
        if(Math.random()<0.7*fk+spkVal(L.key,'ryker')) uqPush(s, {day:d+7, type:'ryker', key:L.key, j:L.played, mi:L.rounds[L.played].indexOf(best.m), fid:best.id}); } } }
  // Sweet Pain pierde: sus fans se enfadan
  round.forEach((m,mi)=>{ if(!m.result) return; const Lo=fby(m.result.loser); if(Lo && Lo.name==='Sweet Pain' && Math.random()<0.2) uqPush(s, {day:d+1, type:'sweet', key:L.key, fid:Lo.id, rival:m.result.winner}); });
  // minutazo a puro reggae: si hizo un minuto por encima de la media de la jornada
  const played=round.filter(m=>m.result && m.d && m.d.s);
  if(played.length){ const RS=roundsOf(played[0]); const mins=RS.map((R,i)=>R.t==='min'?i:-1).filter(i=>i>=0);
    const sideSum=(m,r,sd)=>{ let t=0; for(let j=0;j<5;j++) t+=dScore(m,r,sd,j); return t; };
    const avg={}; mins.forEach(r=>{ let t=0,n=0; played.forEach(m=>{ t+=sideSum(m,r,0)+sideSum(m,r,1); n+=2; }); avg[r]=t/n; });
    played.forEach(m=>{ [m.a,m.b].forEach((id,sd)=>{ const f=fby(id); const p=f&&UQ_REGGAE[f.name]; if(!p) return;
      if(mins.some(r=>sideSum(m,r,sd)>avg[r]) && Math.random()<p) uqPush(s, {day:d+2, type:'reggae', key:L.key, j:L.played, mi:L.rounds[L.played].indexOf(m), fid:id}); }); }); }
  round.forEach(m=>{ if(!m.result) return; const W=fby(m.result.winner); const p=W&&UQ_PREP[W.name];
    if(p && Math.random()<p) uqPush(s, {day:d+3, type:'prep', key:L.key, fid:W.id, rival:m.result.loser});
    [m.a,m.b].forEach(id=>{ const f=fby(id); if(f && f.name==='Driu') uqPush(s, {day:d+1, type:'driu', key:L.key, fid:id, rival: id===m.a?m.b:m.a}); }); });
}
function uqViral(s, B, comp, d){
  const ch=state.freestylers.find(f=>f.name==='Chuty'), ac=state.freestylers.find(f=>f.name==='Aczino'); if(!ch||!ac||!B) return;
  const is=m=>m && ((m.a===ch.id&&m.b===ac.id)||(m.a===ac.id&&m.b===ch.id));
  B.rounds.forEach((r,ri)=>r.forEach((m,mi)=>{ if(is(m)) uqPush(s, {day:d+1, type:'viral', comp, ri, mi, fid:ch.id}); }));
  if(is(B.third)) uqPush(s, {day:d+1, type:'viral', comp, ri:'third', mi:0, fid:ch.id});
}
function uqFace(id){ const f=fby(id); return `<span class="fm-face lg" style="${avatarDivStyle(f)}">${avatarContent(f)}</span>`; }
function showUQ(ev){
  const s=cur(); const f=fby(ev.fid); const L=s.leagues[ev.key]; let body='', acts=`<button class="btn primary" onclick="uqClose('${ev.id}')">Seguir</button>`, title='', kick='⚡ Última hora';
  if(ev.type==='refuse'){ title = ev.kind==='concert' ? `${f.name} no puede compaginar la FMS con sus conciertos` : ev.kind==='retired' ? `${f.name} está retirado de las batallas` : `${f.name} no está interesado en estar en la FMS`;
    body = `<p>${ev.kind==='no' ? `Le devuelves su contrato (${money(contractCost(f,ev.key))}) y tienes que buscar a otro freestyler para ${ldef(ev.key).name}.` : `Le devuelves el contrato, pero dice que sí le apetece hacer alguna exhibición esta temporada, y por menos dinero de lo normal.`}</p>`;
    acts=`<button class="btn primary" onclick="uqClose('${ev.id}'); showReplace('${ev.key}')">Buscar sustituto</button>`; }
  else if(ev.type==='papo'){ title='"FMS no paga lo que Papo gana"'; body=`<p>Papo quiere cobrar <b>${money(ev.newSal)}</b> esta temporada en ${ldef(ev.key).name}.</p>`;
    acts=`<button class="btn danger" onclick="uqPapo('${ev.id}', false)">No pagar (buscar sustituto)</button><button class="btn primary" onclick="uqPapo('${ev.id}', true)">Pagar ${money(ev.newSal)}</button>`; }
  else if(ev.type==='prep'){ kick='🕵️ Polémica'; title=`Acusan a ${f.name} de usar preparadas`; body=`<p>Tras su victoria contra ${fnameH(ev.rival)} circulan vídeos que dicen que llevaba rimas preparadas. La comunidad está que arde con los jueces.</p><p class="neg-v"><b>−5% de hype</b> para ${nameH(f)}, ${fnameH(ev.rival)} y la próxima jornada de ${ldef(ev.key).short}.</p>`; }
  else if(ev.type==='driu'){ kick='🤯 Redes'; title='El público no ha entendido nada'; body=`<p>La batalla de ${nameH(f)} contra ${fnameH(ev.rival)} ha dejado a todo el mundo descolocado.</p><p class="neg-v"><b>−10% de hype</b> para los dos.</p>`; }
  else if(ev.type==='zasko'){ kick=ev.good?'🔥 Redes':'😶 Redes'; title=ev.good?'Zasko tuvo un buen día':'Zasko tuvo un mal día';
    body= ev.good ? `<p>Zasko se salió ayer. Su batalla está volando en YouTube: <b class="pos-v">+15% de visitas</b>.</p>` : `<p>A Zasko no le salió nada ayer. <b class="neg-v">−15% de hype</b>.</p>`; }
  else if(ev.type==='pairv'){ const T={azuky:['🌐 Internet','Azuky y Nota Roja rompen internet','La batalla está en todas partes.'], rq:['⚔️ Redes','Patrocinados de Quesada contra el Elegido de Gazir','El pique entre los dos bandos dispara la batalla.'], women:['👑 Redes','Batalla femenina','La comunidad se vuelca con la batalla.']}[ev.sub];
    kick=T[0]; title=T[1]; body=`<div class="ex-row" style="justify-content:center; font-size:17px">${miniAvatar(ev.a,28)} ${fnameH(ev.a)} <span class="vs">vs</span> ${fnameH(ev.b)} ${miniAvatar(ev.b,28)}</div><p>${T[2]}</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='khan'){ kick='📉 Redes'; title='Un regreso decepcionante'; body= ev.ex ? `<p>La exhibición de ${nameH(f)} ha sido un desastre. La comunidad no da crédito.</p>` : `<p>${nameH(f)} cierra la temporada en ${ldef(ev.key).name} sin ganar una sola batalla y con 0 puntos. La comunidad no da crédito.</p>`; }
  else if(ev.type==='sweet'){ kick='😡 Redes'; title='Los fans de Sweet Pain se enfadan'; body=`<p>No han digerido la derrota contra ${fnameH(ev.rival)} y lo están pagando en redes.</p><p class="neg-v"><b>−10% de hype</b> para ${nameH(f)}.</p>`; }
  else if(ev.type==='ryker'){ kick='🎬 YouTube'; title=`Ryker hace un edit del minuto de ${f.name}`;
    body=`<div class="uq-face"><img class="ryker-logo" src="${(typeof EXTRA_IMG!=='undefined'&&EXTRA_IMG.ryker)||''}" alt="Ryker"></div><p>El canal de Ryker ha subido un edit del minutazo de ${nameH(f)} y ya va por <b>${fmtViews(ev.edit||1000000)}</b> de visitas. La batalla original no para de subir.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='reggae'){ kick='🎶 Redes'; title=`${f.name} hizo un minutazo a puro reggae`; body=`<p>El minuto de ${nameH(f)} se ha hecho viral y su batalla no para de sumar.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='local'){ kick='😤 Redes'; title='Los fans se quejan del localismo'; body=`<p>${nameH(f)} gana el ${ev.comp==='fms'?INTL.name:RB_INT.name} en México y las redes se llenan de quejas: dicen que le favorecieron por jugar en casa.</p><p class="neg-v"><b>−10% de hype</b> para ${nameH(f)} y para todos los participantes.</p>`; }
  else if(ev.type==='rival'){ const V=RIVAL_VARS[ev.v||0]; kick=V[0]; title=esc(rivalFill(V[1],ev));
    body=`<div class="ex-row" style="justify-content:center; font-size:17px">${miniAvatar(ev.a,34)} ${fnameH(ev.a)} <span class="vs">vs</span> ${fnameH(ev.b)} ${miniAvatar(ev.b,34)}</div>
      <p>${esc(rivalFill(V[2],ev))}</p>
      <div class="rv-cmp"><div><small>Antes</small><b>${fmtViews(ev.before||0)}</b></div><span class="rv-arrow">→</span><div><small>Después</small><b class="pos-v">${fmtViews(ev.after||0)}</b></div></div>
      <p style="text-align:center"><b class="pos-v">+15% de visitas</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='viral'){ kick='🌐 Internet'; title='Chuty y Aczino rompen internet'; body=`<p>La batalla de ayer en el ${ev.comp==='fms'?INTL.name:RB_INT.name} está en todas partes.</p><p>▶ ${fmtViews(ev.before||0)} → <b class="pos-v">${fmtViews(ev.after||0)}</b>${ev.inc?` · <b class="pos-v">+${money(ev.inc)}</b>`:''}</p>`; }
  else if(ev.type==='unavail'){ kick='📵 Baja'; title=`${f.name} no podrá estar en la J${ev.j+1}`; const ri=fby(ev.rival);
    const q=(state.ui.uqQ||'').toLowerCase(); const G=state.ui.uqGuest, D=state.ui.uqDay;
    const el=exhibEligible(s, ev.key).filter(x=>fMatch(x,q)).sort((a,b)=>b.fama-a.fama).slice(0,40); const days=uqRecupDays(s,ev);
    body=`<p>${nameH(f)} ${ev.why||UQ_UNAV[f.name].why}. ${nameH(ri)} hará una exhibición en su lugar y la batalla se jugará en una recuperativa antes de la siguiente jornada.</p>
      <div class="uq-split"><div class="uq-left"><div class="field-label" style="margin-top:10px">Rival de ${nameH(ri)} en la exhibición${G&&fby(G)?`: <b style="color:var(--white)">${nameH(fby(G))}</b>`:''}</div>
      <input id="uqQ" class="ex-q" placeholder="Buscar por nombre o país" value="${esc(state.ui.uqQ||'')}" oninput="state.ui.uqQ=this.value; showUQ(cur().uq.find(x=>x.id==='${ev.id}')); const e=document.getElementById('uqQ'); e.focus(); e.setSelectionRange(e.value.length,e.value.length);">
      <div class="pick-grid uq-grid">${el.map(x=>`<div class="pick-item ${G===x.id?'checked':''}" onclick="state.ui.uqGuest='${x.id}'; showUQ(cur().uq.find(y=>y.id==='${ev.id}'))">
        <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(x)}">${avatarContent(x)}</span>
        <div style="min-width:0;"><div class="pname">${nameH(x)}</div>${styleTag(x)}<div class="pcountry">${esc(x.country)}</div></div>
        <div class="pick-stats">Nivel <b>${x.nivel}</b><br>Fama <b>${x.fama}</b><br><span class="sal">${moneyK(exhibCost(x,ev.key))}</span></div></div>`).join('')}</div></div>
      <div class="uq-right"><div class="field-label" style="margin-top:10px">Fecha de la recuperativa${D!=null?`: <b style="color:var(--white)">${fmtDay(s.year,D)}</b>`:''}</div>
      ${uqMiniCal(s, ev, days, D)}</div></div>`;
    acts=`<button class="btn primary" ${G&&D!=null?'':'disabled'} onclick="uqSetUnavail('${ev.id}', state.ui.uqGuest, state.ui.uqDay)">Confirmar</button>`; }
  else if(ev.type==='recup'){ const m=L.rounds[ev.j][ev.mi]; const p=ptbOf(m); kick='🎤 Recuperativa'; title=`Batalla recuperativa · J${ev.j+1} de ${ldef(ev.key).short}`;
    body=`<div class="ex-row" style="justify-content:center; font-size:18px">${miniAvatar(m.a,28)} ${fnameH(m.a)} <span class="vs">vs</span> ${fnameH(m.b)} ${miniAvatar(m.b,28)}</div>
      <p style="text-align:center">Gana <b>${fnameH(m.result.winner)}</b> ${esc(m.lb||'')} · PTB ${fpt(p[0])}–${fpt(p[1])} · ▶ ${fmtViews(m.views)}</p>`;
    acts=`<button class="btn" onclick="showBattle('${ev.key}',${ev.j},${ev.mi})">Ver notas</button>`+acts; }
  openModal(`<div class="uq">${['prep','driu','zasko','refuse','papo','unavail','sweet','reggae','khan','local'].includes(ev.type)&&f?`<div class="uq-face">${uqFace(f.id)}</div>`:''}<div class="st-kicker">${kick} · ${fmtDay(s.year,ev.day)}</div><h3 style="margin:4px 0 10px">${title}</h3>${body}</div>
    <div class="modal-actions">${acts}</div>`, ev.type==='unavail' ? 'uqwide' : undefined);
  themeEl(document.getElementById('modalRoot'), ev.key);
}
function uqMiniCal(s, ev, days, sel){
  const ok=new Set(days); const from=ev.jday-2, to=Math.max(...days)+1;
  const start=from - ((dayToDate(s.year,from).getUTCDay()+6)%7);   // empieza en lunes
  const end=to + (6-((dayToDate(s.year,to).getUTCDay()+6)%7));
  const MS=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  let h='<div class="mcal"><div class="mcal-h">'+['L','M','X','J','V','S','D'].map(x=>`<span>${x}</span>`).join('')+'</div><div class="mcal-g">';
  for(let d=start; d<=end; d++){ if(d<0 || d>=daysInYear(s.year)){ h+='<span class="mc off"></span>'; continue; }
    const dt=dayToDate(s.year,d); const n=dt.getUTCDate(); const lbl=(n===1||d===start)?`<small>${MS[dt.getUTCMonth()]}</small>`:'';
    const ev2=eventsByDay(s)[d]; const rb=rbByDay(s)[d];
    const cls = d===ev.jday ? 'jor' : (ok.has(d) ? (d===sel?'sel':'ok') : 'off');
    const tag = d===ev.jday ? 'J'+(ev.j+1) : (ev2 ? ldef(ev2.key).short : (rb ? 'RB' : ''));
    h+= ok.has(d) ? `<button class="mc ${cls}" onclick="state.ui.uqDay=${d}; showUQ(cur().uq.find(y=>y.id==='${ev.id}'))">${lbl}<b>${n}</b></button>` : `<span class="mc ${cls}">${lbl}<b>${n}</b>${tag?`<i>${tag}</i>`:''}</span>`; }
  return h+'</div></div>';
}
function uqClose(id){ const s=cur(); const ev=(s.uq||[]).find(x=>x.id===id); if(ev){ ev.show=false; if(ev.type==='refuse') ev.done=true; } closeModal(); render(); }
function showReplace(key){
  const s=cur(); const L=s.leagues[key]; const old=(L.pendingRep||[])[0]; if(!old){ render(); return; }
  const q=(state.ui.repQ||'').toLowerCase(); const list=uqCandidates(s,key).filter(f=>fMatch(f,q)).slice(0,60);
  openModal(`<h3>Sustituto para ${fnameH(old)} · ${ldef(key).name}</h3>
    <p class="step-note" style="margin-bottom:8px">Ocupará su plaza en todos sus cruces. Caja: ${money(state.company.money)}</p>
    <input id="repQ" placeholder="Buscar por nombre o país" value="${esc(state.ui.repQ||'')}" oninput="state.ui.repQ=this.value; showReplace('${key}'); const e=document.getElementById('repQ'); e.focus(); e.setSelectionRange(e.value.length,e.value.length);">
    <div class="pick-grid rep-grid">${list.map(f=>{ const c=contractCost(f,key); const fx=isForeign(f,key); return `<div class="pick-item" onclick="pickReplace('${key}','${old}','${f.id}')">
      <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}${fx?' <span class="tag-mini foreign">✈ viajes</span>':''}</div></div>
      <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br>Hype <b>${Math.round(f.hype||0)}</b><br><span class="sal">${moneyK(c)}</span></div></div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>`, true);
}
function pickReplace(key, old, id){ const s=cur(); const f=fby(id); const c=contractCost(f,key); if(state.company.money<c){ toast(`No te llega: ${fname(id)} pide ${money(c)}.`); return; }
  const r=UQ_REFUSE[f.name]; if(r && !r.papo && !state.company.infinite && Math.random()<r.p-spkVal(key,'refuse')){ if(!s.refused) s.refused=[]; s.refused.push(id); if(r.kind) f.exOffer=s.year;
    toast(r.kind==='concert'?`${f.name} no puede compaginarlo con sus conciertos.`:r.kind==='retired'?`${f.name} está retirado de las batallas.`:`${f.name} tampoco está interesado en estar en la FMS.`); showReplace(key); return; }
  uqReplace(s,key,old,id); state.ui.repQ=''; closeModal(); const L=s.leagues[key]; if(L.pendingRep&&L.pendingRep.length) showReplace(key); else { toast(`${fname(id)} entra en ${ldef(key).name}.`); render(); } }

/* ---------- exhibiciones ---------- */
function exViewMult(m){ return ((fby(m.a).fama<80 || fby(m.b).fama<80) ? 0.5 : 0.7) * 0.75; }   // con el 0,8 de la liga: un 40% menos que antes
const EXH_UNKNOWN=60, EXH_FAMOUS=80;   // fama por debajo = desconocido · fama desde = con bastante fama
function exhibCost(f, key){ const y=cur()&&cur().year; const disc=(f.exOffer===y && UQ_REFUSE[f.name]) ? (UQ_REFUSE[f.name].exDisc||0) : 0; return Math.max(100, Math.round(contractCost(f,key)*0.025*(1-disc)*(1-fxVal(key,'exfee'))/100)*100); }
function exhibBusy(s){ const set=new Set(); s.activeKeys.forEach(k=>{ const L=s.leagues[k]; Object.entries(L.exhib||{}).forEach(([j,x])=>{ if(+j>=L.played){ set.add(x.a); set.add(x.b); } }); }); return set; }
function exhibEligible(s, key){ const busy=exhibBusy(s); const own=new Set(key&&s.leagues[key]?s.leagues[key].competitors:[]); return state.freestylers.filter(f=>!own.has(f.id) && !busy.has(f.id)); }
function renderExhib(s, L, key, j){
  const ex=L.exhib && L.exhib[j];
  if(ex && ex.m && ex.m.result){ const m=ex.m, r=m.result, p=ptbOf(m);
    return `<div class="ex-box done clickable" onclick="showBattle('${key}',${j},'ex')"><div class="ex-h">🎤 Exhibición</div><div class="ex-row">${miniAvatar(m.a,22)} ${fnameH(m.a)} <span class="vs">vs</span> ${fnameH(m.b)} ${miniAvatar(m.b,22)}</div>
      <div class="step-note">Gana ${fnameH(r.winner)}${r.tiebreak?' en réplica':''} · PTB ${fpt(p[0])}–${fpt(p[1])}${m.views?' · ▶ '+fmtViews(m.views):''}</div></div>`; }
  if(s.phase!=='live' || L.finished || j!==L.played) return '';
  if(ex){ return `<div class="ex-box"><div class="ex-h">🎤 Exhibición en esta jornada</div><div class="ex-row">${miniAvatar(ex.a,22)} ${fnameH(ex.a)} <span class="vs">vs</span> ${fnameH(ex.b)} ${miniAvatar(ex.b,22)}</div>
      <div class="step-note">Coste ${money(ex.cost)} · la jornada tendrá 6 batallas. A los 7 días la comunidad dirá si los quiere en la FMS.</div>
      <button class="btn small danger" style="margin-top:8px" onclick="cancelExhib('${key}')">Cancelar (se devuelve el dinero)</button></div>`; }
  const A=state.ui['exA_'+key]||'', B=state.ui['exB_'+key]||''; const q=(state.ui['exQ_'+key]||'').toLowerCase();
  const el=exhibEligible(s, key).filter(f=>fMatch(f,q)).sort((a,b)=>b.fama-a.fama).slice(0,48);
  const cost=(A&&fby(A)?exhibCost(fby(A),key):0)+(B&&fby(B)?exhibCost(fby(B),key):0);
  const slot=(id,lbl)=>{ const f=id&&fby(id); return f? `<button class="ex-slot on" onclick="exPick('${key}','${id}')" title="Quitar">${miniAvatar(id,34)}<span><b>${nameH(f)}</b><small>${esc(f.country)} · fama ${f.fama} · ${moneyK(exhibCost(f,key))}</small></span><i>✕</i></button>` : `<div class="ex-slot"><span class="sp-plus">+</span><span><b>${lbl}</b><small>Elige abajo</small></span></div>`; };
  return `<div class="ex-box"><div class="ex-h">🎤 Exhibición (opcional)</div>
    <p class="step-note">Prueba a dos freestylers que no están en ninguna FMS. Pueden estar compitiendo en otra FMS. Cobran una pequeña parte de su salario (los extranjeros, con sus viajes). Si hacen buena batalla la comunidad los pedirá para la próxima temporada.</p>
    <div class="ex-slots">${slot(A,'Freestyler 1')}<span class="vs">VS</span>${slot(B,'Freestyler 2')}</div>
    <input id="exQ_${key}" class="ex-q" placeholder="Buscar por nombre o país" value="${esc(state.ui['exQ_'+key]||'')}" oninput="state.ui['exQ_${key}']=this.value; render()">
    <div class="pick-grid ex-grid">${el.map(f=>{ const on=f.id===A||f.id===B; return `<div class="pick-item ${on?'checked':''}" onclick="exPick('${key}','${f.id}')">
      <span class="mini-avatar" style="width:32px;height:32px;font-size:15px;${avatarDivStyle(f)}">${avatarContent(f)}</span>
      <div style="min-width:0;"><div class="pname">${nameH(f)}</div>${styleTag(f)}<div class="pcountry">${esc(f.country)}</div></div>
      <div class="pick-stats">Nivel <b>${f.nivel}</b><br>Fama <b>${f.fama}</b><br><span class="sal">${moneyK(exhibCost(f,key))}</span></div></div>`; }).join('') || '<div class="step-note">Nadie coincide con la búsqueda.</div>'}</div>
    <button class="btn small primary" style="margin-top:8px" ${A&&B&&A!==B?'':'disabled'} onclick="organizeExhib('${key}')">Organizar exhibición${cost?' · '+money(cost):''}</button></div>`;
}
function exPick(key, id){ const a='exA_'+key, b='exB_'+key;
  if(state.ui[a]===id) delete state.ui[a]; else if(state.ui[b]===id) delete state.ui[b]; else if(!state.ui[a]) state.ui[a]=id; else state.ui[b]=id; render(); }
function organizeExhib(key){
  const s=cur(); const L=s.leagues[key]; const a=state.ui['exA_'+key], b=state.ui['exB_'+key];
  if(!a||!b||a===b) return; const el=new Set(exhibEligible(s, key).map(f=>f.id)); if(!el.has(a)||!el.has(b)){ toast('Alguno de los dos ya no está disponible.'); return; }
  for(const id of [a,b]){ if(uqExhibRefuses(s, fby(id))){ toast(`${fname(id)} no está interesado en hacer una exhibición.`); return; } }
  const cost=exhibCost(fby(a),key)+exhibCost(fby(b),key);
  if(state.company.money<cost){ toast(`No te llega: la exhibición cuesta ${money(cost)}.`); return; }
  if(!L.exhib) L.exhib={}; L.exhib[L.played]={a,b,cost};
  state.company.money-=cost; s.fin.salaries+=cost; delete state.ui['exA_'+key]; delete state.ui['exB_'+key];
  toast(`Exhibición cerrada: ${fname(a)} vs ${fname(b)} en la J${L.played+1}.`); render();
}
function cancelExhib(key){ const s=cur(); const L=s.leagues[key]; const ex=L.exhib&&L.exhib[L.played]; if(!ex||ex.m) return;
  state.company.money+=ex.cost; s.fin.salaries-=ex.cost; delete L.exhib[L.played]; render(); }
function applyExhibEvent(s, xe){
  xe.done=true;
  // desconocido + alguien con bastante fama, y los dos la rompen: el desconocido se dispara (+6 de fama en vez de +2)
  const fs=xe.ids.map(fby); xe.fg=xe.ids.map((id,i)=>{ if(!xe.good[i]) return 0; const o=fs[1-i];
    return (xe.good[0] && xe.good[1] && fs[i] && o && fs[i].fama<EXH_UNKNOWN && o.fama>=EXH_FAMOUS) ? 6 : 2; });
  xe.ids.forEach((id,i)=>{ const f=fby(id); if(!f) return; const g=xe.good[i];
    addHype(id, g?12:-10); if(g) addFama(id,xe.fg[i]); else addFama(id,-2);
    f.demand={year:s.year+1, good:g}; const lk=signedLeagueOf(s,id); if(!xe.lk) xe.lk=[]; xe.lk[i]=(lk && lk!==xe.key) ? lk : null; });
  addLog(s, xe.day, `🎤 Exhibición de ${ldef(xe.key).short}: ${xe.ids.map((id,i)=>`${fname(id)} ${xe.good[i]?'convence a la comunidad':'no convence'}`).join(' · ')}.`, xe.good.some(Boolean)?'good':'bad');
}
function showExhibEvent(xe){
  const s=cur();
  openModal(`<div class="st-kicker">🎤 La comunidad opina · ${fmtDay(s.year,xe.day)}</div>
    <h3 style="margin:4px 0 12px">Exhibición de ${ldef(xe.key).name} (J${xe.j+1})</h3>
    <div class="ex-verdicts">${xe.ids.map((id,i)=>{ const f=fby(id); const g=xe.good[i];
      return `<div class="ex-v ${g?'good':'bad'}"><span class="fm-face" style="${avatarDivStyle(f)}">${avatarContent(f)}</span><div><b>${nameH(f)}</b>
        <div>${g?((xe.lk&&xe.lk[i])?`La comunidad quiere que se traspase a ${ldef(xe.key).name}`:`La comunidad lo quiere en la FMS ${s.year+1}`):((xe.lk&&xe.lk[i])?`La comunidad no lo quiere en ${ldef(xe.key).name}`:'La comunidad no lo quiere en la FMS')}</div>
        <small class="${g?'pos-v':'neg-v'}">${g?`+12 hype · +${(xe.fg&&xe.fg[i])||2} fama${(xe.fg&&xe.fg[i])===6?' · ¡el desconocido se da a conocer!':''}`:'−10 hype · −2 fama'}</small></div></div>`; }).join('')}</div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`);
  themeEl(document.getElementById('modalRoot'), xe.key);
}
function scheduleStream(s, key, j, d){
  if(Math.random()>STREAM_CHANCE) return;
  const ks=Object.keys(STREAMERS); const who=ks[Math.floor(Math.random()*ks.length)];
  if(!s.streams) s.streams=[];
  const pg=Math.min(0.95, STREAMERS[who].pGood + fxVal(key,'stream'));
  s.streams.push({day:d+1, key, j, who, good:Math.random()<pg, done:false});
}
function applyStream(s, st){
  const L=s.leagues[st.key]; st.done=true; st.shield=leagueHasFx(st.key,'shield');
  const exs=[L.exhib&&L.exhib[st.j], L.fexhib&&L.fexhib[st.j]].filter(x=>x&&x.m&&x.m.result);
  const round=[...exs.map(x=>x.m), ...L.rounds[st.j].filter(m=>m.result && !m.recup)];
  const absent=new Set(L.fexhib&&L.fexhib[st.j] ? [L.fexhib[st.j].missing] : []);
  const hIds=[...new Set([...L.competitors.filter(id=>!absent.has(id)), ...exs.flatMap(x=>[x.a,x.b])])];
  if(st.good){
    st.rows=round.map(m=>{ const before=m.views||0; m.views=Math.round(before*1.1); return [m.a,m.b,before,m.views]; });
    const extra=st.rows.reduce((a,r)=>a+(r[3]-r[2]),0); st.extra=Math.round(extra*VIEW_RATE);
    state.company.money+=st.extra; s.fin.income+=st.extra; s.fin.views=(s.fin.views||0)+st.extra; L.income+=st.extra;
    // y +10% de hype a toda la plantilla (mínimo +2 para que se note en los que tienen poco)
    st.hrows=hIds.map(id=>{ const f=fby(id); const before=f.hype||0; f.hype=Math.round(clamp(before+Math.max(before*0.1,2),1,99)*10)/10; return [id,before,f.hype]; });
    addLog(s, st.day, `📺 <b>${STREAMERS[st.who].name}</b> habló bien de la J${st.j+1} de ${ldef(st.key).name} en su stream: +10% visitas (+${moneyK(st.extra)}) y +10% de hype a la plantilla.`, 'good');
  } else {
    st.rows=hIds.map(id=>{ const f=fby(id); const before=f.hype||0; f.hype=Math.round(before*(st.shield?0.95:0.9)*10)/10; return [id,before,f.hype]; });
    addLog(s, st.day, `📺 <b>${STREAMERS[st.who].name}</b> habló mal de la J${st.j+1} de ${ldef(st.key).name} en su stream: −10% de hype a toda la plantilla.`, 'bad');
  }
}
function showStream(st){
  const S=STREAMERS[st.who]; const s=cur();
  const body = st.good
    ? `<div class="st-table"><div class="st-h"><span>Batalla</span><span>Antes</span><span>Después</span></div>${st.rows.map(([a,b,bf,af])=>`<div class="st-r"><span>${fnameH(a)} <i>vs</i> ${fnameH(b)}</span><span>${bf.toLocaleString('es-ES')}</span><span class="pos-v">${af.toLocaleString('es-ES')} <small>+${(af-bf).toLocaleString('es-ES')}</small></span></div>`).join('')}</div>
       <div class="st-total">Total extra: <b class="pos-v">+${st.rows.reduce((x,r)=>x+r[3]-r[2],0).toLocaleString('es-ES')} visitas</b> · <b class="pos-v">+${money(st.extra)}</b></div>
       ${st.hrows?`<button class="st-more" onclick="const x=document.getElementById('stHype'); const o=x.hidden; x.hidden=!o; this.classList.toggle('open',o); this.querySelector('span').textContent=o?'Ocultar aumento de hype':'Ver aumento de hype';" aria-controls="stHype"><i>▼</i><span>Ver aumento de hype</span></button><div id="stHype" hidden><div class="st-table"><div class="st-h"><span>Freestyler</span><span>Hype antes</span><span>Después</span></div>${st.hrows.map(([id,bf,af])=>`<div class="st-r"><span>${fnameH(id)}</span><span>${Math.round(bf)}</span><span class="pos-v">${Math.round(af)} <small>+${Math.round(af-bf)}</small></span></div>`).join('')}</div></div>`:''}`
    : `<div class="st-table"><div class="st-h"><span>Freestyler</span><span>Hype antes</span><span>Después</span></div>${st.rows.map(([id,bf,af])=>`<div class="st-r"><span>${fnameH(id)}</span><span>${Math.round(bf)}</span><span class="neg-v">${Math.round(af)} <small>−${Math.round(bf-af)}</small></span></div>`).join('')}</div>`;
  openModal(`<div class="st-top">${streamerPhoto(S)?`<img class="st-photo ${st.good?'good':'bad'}" src="${streamerPhoto(S)}" alt="${esc(S.name)}">`:`<div class="st-photo st-init ${st.good?'good':'bad'}">${esc(S.name[0])}</div>`}<div>
      <div class="st-kicker">📺 En directo · ${fmtDay(s.year,st.day)}</div>
      <h3 style="margin:2px 0 4px">${esc(S.name)} ha hablado ${st.good?'bien':'mal'} de tu jornada</h3>
      <p class="step-note">${st.good?`Le gustó la J${st.j+1} de ${ldef(st.key).name}. Sus seguidores van a verla: <b>+10% de visitas</b> en todas las batallas y <b>+10% de hype</b> a tus competidores de esta liga.`:`No le gustó la J${st.j+1} de ${ldef(st.key).name}. La conversación se vuelve en contra: <b>−${st.shield?5:10}% de hype</b> a tus competidores de esta liga${st.shield?' (Twitch amortigua el golpe)':''}.`}</p></div></div>
    ${body}
    <div class="modal-actions"><button class="btn primary" onclick="closeModal(); render()">Seguir</button></div>`, 'wide stream');
  themeEl(document.getElementById('modalRoot'), st.key);
}

/* =========================================================================
   ANIMACIÓN DEL CALENDARIO al avanzar ("Próxima fecha" / "Simular hasta fin de año")
========================================================================= */
let CAL_ANIM=null;
function nextStopDay(s, mode){
  const diy=daysInYear(s.year); const d0=s.day;
  if(mode==='year'){ const v=rbOn(s)&&!s.rb.inter.voted ? s.rb.inter.voteDay : null; return (v!=null && v>=d0) ? v : diy-1; }
  const days=[...seasonEvents(s).map(e=>e.day), ...rbEventsList(s).map(e=>e.day), ...((s.streams||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.exEvents||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.uq||[]).filter(x=>!x.done).map(x=>x.day)), ...((s.under||[]).filter(x=>!x.played).map(x=>x.day))];
  if(!s.uqInit) days.push(d0);
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L||L.finished||isWS(k)||L.played>=JORNADAS-1||(L.uaChk&&L.uaChk[L.played])) return; const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null) days.push(Math.max(d0, nd-5)); });
  s.activeKeys.forEach(k=>{ const L=s.leagues[k]; if(!L||L.finished||!L.manual||L.confirmed[L.played]) return; const nd=L.dates.slice().sort((a,b)=>a-b)[L.played]; if(nd!=null) days.push(Math.max(d0, nd-PAIR_DEADLINE)); });
  if(rbOn(s)&&!s.rb.inter.voted) days.push(s.rb.inter.voteDay);
  const fut=days.filter(d=>d>=d0); return fut.length? Math.min(...fut) : diy-1;
}
function dayEventInfo(s, d){
  const e=eventsByDay(s)[d]; if(e) return {cls:'fms', color:ldef(e.key).badge, label:e.key===INTL.key?'INTL':ldef(e.key).short+' J'+e.j};
  const r=rbByDay(s)[d]; if(r) return {cls:'rb'+(r.key===RB_INT.key?' int':''), color:null, label:'RB '+rbdef(r.key).short};
  if(rbOn(s) && d===s.rb.inter.voteDay) return {cls:'vote', color:null, label:'Votación'};
  const u=underByDay(s)[d]; if(u) return {cls:'under', color:udef(u.key).color, label:udef(u.key).short};
  return null;
}
function animatedAdvance(mode){
  const s=cur(); if(s.phase!=='live' || CAL_ANIM) return;
  const target=nextStopDay(s, mode);
  if(target<=s.day){ advance(mode); return; }
  const y=s.year; const diy=daysInYear(y);
  let html=`<div class="ca" role="dialog" aria-label="Avanzando el calendario"><div class="ca-top"><div><div class="rbs-title">Calendario ${y}</div><div class="rbs-sub" id="caLbl">${fmtDay(y,s.day)}</div></div><span class="top-spacer"></span><button class="btn small ghost" onclick="caSkip()">Saltar</button></div><div class="ca-grid">`;
  for(let m=0;m<12;m++){
    const first=dateToDay(y,m,1), dim=new Date(Date.UTC(y,m+1,0)).getUTCDate(), lead=(dayToDate(y,first).getUTCDay()+6)%7;
    html+=`<div class="ca-m"><div class="ca-mt">${MESES[m]}</div><div class="ca-days">${DOW.map(x=>`<i>${x}</i>`).join('')}${'<span></span>'.repeat(lead)}`;
    for(let dd=1; dd<=dim; dd++){ const d=first+dd-1; const ev=dayEventInfo(s,d);
      html+=`<span id="ca${d}" class="ca-d ${d<s.day?'past':''} ${ev?'ev '+ev.cls:''} ${d===target?'target':''}" ${ev&&ev.color?`style="--ev:${ev.color}"`:''} title="${ev?esc(ev.label):''}">${dd}</span>`; }
    html+=`</div></div>`;
  }
  const tev=dayEventInfo(s,target);
  html+=`</div><div class="ca-next">${mode==='year'? (target===diy-1?'Simulando hasta el fin de año…':'Hasta la votación de Red Bull…') : `Próxima fecha: <b>${tev?esc(tev.label):'—'}</b> · ${fmtDay(y,target)}`}</div></div>`;
  let root=document.getElementById('calAnim'); if(!root){ root=document.createElement('div'); root.id='calAnim'; document.body.appendChild(root); }
  root.innerHTML=html;
  const span=target-s.day; const step=clamp((mode==='year'?4200:2000)/span, 12, 120);
  CAL_ANIM={mode, tok:Date.now(), d:s.day, target};
  const tok=CAL_ANIM.tok; let d=s.day;
  const tick=()=>{
    if(!CAL_ANIM || CAL_ANIM.tok!==tok) return;
    const prev=document.getElementById('ca'+d); if(prev){ prev.classList.remove('now'); prev.classList.add('past'); }
    d++; const el=document.getElementById('ca'+d);
    if(el){ el.classList.add('now'); if(d%7===0||d===target) el.scrollIntoView({block:'nearest'}); }
    const lb=document.getElementById('caLbl'); if(lb) lb.textContent=fmtDay(y,Math.min(d,diy-1));
    if(d>=target){ setTimeout(()=>caFinish(tok), 450); return; }
    setTimeout(tick, step);
  };
  const st=document.getElementById('ca'+s.day); if(st) st.classList.add('now');
  setTimeout(tick, 350);
}
function caFinish(tok){ if(!CAL_ANIM || (tok && CAL_ANIM.tok!==tok)) return; const mode=CAL_ANIM.mode; CAL_ANIM=null; const r=document.getElementById('calAnim'); if(r) r.innerHTML=''; advance(mode); }
function caSkip(){ caFinish(); }

/* =========================================================================
   CELEBRACIONES DE CAMPEÓN (FMS nacional, FMS Internacional, Red Bull Internacional)
========================================================================= */
function confettiHtml(colors, n){
  let h=''; for(let i=0;i<n;i++){ const c=colors[i%colors.length]; const l=Math.random()*100, d=Math.random()*2.6, du=2.6+Math.random()*2.4, w=6+Math.random()*7, r=Math.random()*360;
    h+=`<i style="left:${l}%;background:${c};width:${w}px;height:${w*0.45}px;animation-delay:${d}s;animation-duration:${du}s;transform:rotate(${r}deg)"></i>`; }
  return `<div class="cel-confetti" aria-hidden="true">${h}</div>`;
}
function openCelebration(o){
  const f=fby(o.id); if(!f) return;
  let root=document.getElementById('celeb'); if(!root){ root=document.createElement('div'); root.id='celeb'; document.body.appendChild(root); }
  root.innerHTML=`<div class="cel cel-${o.theme}" style="--celc:${o.colors[0]}" role="dialog" aria-label="${esc(o.title)}">
    <div class="cel-rays" aria-hidden="true"></div>${confettiHtml(o.colors, 90)}
    <div class="cel-body">
      <img class="cel-logo" src="${o.logo}" alt="">
      <div class="cel-kicker">${o.kicker}</div>
      <div class="cel-face" style="${avatarDivStyle(f)}">${avatarContent(f)}</div>
      <div class="cel-icon">${o.icon}</div>
      <div class="cel-name">${esc(f.name)}</div>
      <div class="cel-title">${o.title}</div>
      <div class="cel-sub">${o.sub||''}</div>
      <button class="btn primary cel-btn" onclick="closeCelebration()">Continuar</button>
    </div></div>`;
}
function closeCelebration(){ const r=document.getElementById('celeb'); if(r) r.innerHTML=''; render(); const a=state.ui.afterCel; state.ui.afterCel=null; if(a && a.indexOf('champ:')===0) setTimeout(()=>openChamp(a.slice(6)), 80); if(a==='intlViews') setTimeout(showIntlViews, 60); }
function showIntlViews(){
  const s=cur(); const B=s.intl && s.intl.bracket; if(!B) return;
  const KO=['Octavos de final','Cuartos de final','Semifinales'];
  const sec=[]; B.rounds.forEach((r,ri)=>{ if(ri<B.rounds.length-1) sec.push([KO[ri]||'Ronda', r]); }); sec.push(['3er y 4º puesto',[B.third]]); sec.push(['Final',[B.rounds[B.rounds.length-1][0]]]);
  let n=0; state.ui.kov=[]; state.ui.kovMoney=true;
  const rows=sec.map(([t,ms])=>`<div class="kov-h">${t}</div>`+ms.map(m=>{ const i=n++; state.ui.kov.push(m.views||0); const wa=m.result.winner===m.a;
    return `<div class="fm-srow"><div class="fm-sb"><span class="${wa?'w':'l'}">${fmFace(m.a)}${fnameH(m.a)}</span><span class="fm-sres">vs<small>gana ${fnameH(m.result.winner)}</small></span><span class="${wa?'l':'w'} r">${fnameH(m.b)}${fmFace(m.b)}</span></div>
      <div class="fm-views"><span class="fm-vn" id="kov${i}">—</span><button class="btn small" id="kob${i}" onclick="kovReveal(${i})">Revelar visitas</button></div></div>`; }).join('')).join('');
  openModal(`<h3>${INTL.name} ${s.year} · visitas</h3><div class="kov">${rows}</div><div class="fm-sum-foot" id="kovFoot"></div>
    <div class="modal-actions"><button class="btn" onclick="kovAll()">Revelar todas</button><button class="btn primary" onclick="closeModal(); render(); const c=cur().intl.champTw; if(c && !c.shown) setTimeout(()=>openIntlChamp(), 80);">Seguir</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), INTL.key);
}
function kovReveal(i){ const el=document.getElementById('kov'+i), b=document.getElementById('kob'+i); if(!el||!b||b.disabled) return; b.disabled=true; b.style.visibility='hidden';
  countUp(el, 0, state.ui.kov[i]||0, 1400, x=>Math.round(x).toLocaleString('es-ES')+' visitas');
  if(document.querySelectorAll('[id^="kob"]:not([disabled])').length===0){ const t=state.ui.kov.reduce((a,x)=>a+x,0); setTimeout(()=>{ const f=document.getElementById('kovFoot'); if(f) f.innerHTML=`Total: <b>${t.toLocaleString('es-ES')}</b> visitas`+(state.ui.kovMoney?` · <b class="pos-v">${money(Math.round(t*VIEW_RATE))}</b> en YouTube`:''); }, 1450); } }
function kovAll(){ (state.ui.kov||[]).forEach((_,i)=>setTimeout(()=>kovReveal(i), i*150)); }
function celebrateFMSLeague(key){
  const s=cur(); const L=s.leagues[key]; const id=L.finalStandings[0]; const d=ldef(key);
  const st=computeStandings(L).find(r=>r.id===id)||{};
  const mvps=(L.mvps||[]).filter(m=>m&&m.id===id).length;
  const th=LEAGUE_THEME[key]||{red:'#e2101f', bright:'#ff2436'};
  if(L.champTw && !L.champTw.shown) state.ui.afterCel='champ:'+key;
  openCelebration({theme:'fms', logo:LOGOS[key], kicker:`${d.name} · Temporada ${s.year}`, icon:'💍', id,
    title:`Campeón de ${d.name}`, sub:`${st.pts||0} puntos · ${(st.v||0)+(st.vr||0)} victorias${mvps?` · ${mvps} MVP${mvps>1?'s':''}`:''}`,
    colors:[th.red, th.bright, '#ffffff', d.badge]});
}
function celebrateIntl(key){
  const s=cur(); const ev=showEv(s,key);
  if(key===INTL.key){ state.ui.afterCel='intlViews'; } if(key===INTL.key) openCelebration({theme:'gold', logo:LOGOS.fms_internacional, kicker:`${INTL.name} ${s.year}${ev.sede?' · '+ev.sede:''}`, icon:'🏆', id:ev.champion,
      title:'Campeón Internacional', sub:`Ganó la final a ${esc(fname(ev.runnerUp))}`, colors:['#D4AF37','#EFCB5E','#fff3c4','#8A6E1F']});
  else openCelebration({theme:'rb', logo:RB_LOGO, kicker:`${RB_INT.name} ${s.year} · ${ev.sede}`, icon:'🏆', id:ev.champion,
      title:'Campeón del mundo de Red Bull Batalla', sub:`Ganó la final a ${esc(fname(ev.runnerUp))}`, colors:['#DB0A40','#1B2A6B','#F5C400','#ffffff']});
}
function shContinue(){ const key=SHOW&&SHOW.key; closeRBShow(); if(key===INTL.key||key===RB_INT.key) celebrateIntl(key); }
function fmContinue(){
  const key=SHOW&&SHOW.key, j=SHOW&&SHOW.j, replay=SHOW&&SHOW.replay; closeRBShow();
  const L=cur().leagues[key];
  if(!replay && L && L.finished && j===nJ(key)-1) celebrateFMSLeague(key);
}

/* ---------- init ---------- */
function init(){
  state.ui.devStats=false;
  if(load()) state.view={name:'dashboard',params:{}}; else state.view={name:'welcome',params:{}};
  render();
  window.addEventListener('pagehide', ()=>{ if(state.company) save(); });
}
init();
setTimeout(()=>{ try{ showCreator(); }catch(e){} }, 350);

/* ---------- elección de enfrentamientos ---------- */
function renderModeToggle(key){
  const L=cur().leagues[key];
  return `<div class="mode-toggle" role="group" aria-label="Enfrentamientos">
    <span class="step-note">Enfrentamientos</span>
    <button class="seg ${!L.manual?'on':''}" onclick="setManual('${key}',false)" aria-pressed="${!L.manual}">Automáticos</button>
    <button class="seg ${L.manual?'on':''}" onclick="setManual('${key}',true)" aria-pressed="${L.manual}">A mano</button>
  </div>`;
}
function setManual(key, v){
  const L=cur().leagues[key]; L.manual=v;
  if(!v){ delete state.ui['draft_'+key]; }
  toast(v? 'Antes de cada jornada de esta liga tendrás que elegir los cruces.' : 'Los cruces de esta liga se sortean solos.');
  render();
}
function draftOf(key){
  const L=cur().leagues[key]; const k='draft_'+key;
  let d=state.ui[k];
  if(!d || d.round!==L.played){ d=state.ui[k]={round:L.played, pairs:[], sel:null}; }
  return d;
}
function renderPairingEditor(s,key){
  if(isWS(key)) return wsPairingEditor(s,key);
  const L=s.leagues[key]; const jn=L.played+1;
  if(L.confirmed[L.played]){
    return `<div class="banner" style="margin-top:14px;">Cruces de la J${jn} (${fmtDay(s.year,L.dates[L.played])}) elegidos.&nbsp;<button class="btn small" onclick="unconfirmRound('${key}')">Cambiar</button></div>`;
  }
  const d=draftOf(key); const used=playedPairsOf(L);
  const paired=new Set(d.pairs.flat());
  const free=L.competitors.filter(id=>!paired.has(id));
  return `<div class="pair-editor">
    <div class="step-head" style="margin-bottom:6px;"><h3>Cruces de la jornada ${jn}</h3><span class="counter"><span class="n">${d.pairs.length}</span>/5</span></div>
    <p class="step-note" style="margin-bottom:10px;">${fmtDay(s.year,L.dates[L.played])}. Toca dos freestylers para enfrentarlos. Los que ya se han enfrentado esta temporada no se pueden repetir.</p>
    <div class="pair-free">${free.map(id=>{
      const isSel=d.sel===id; const blocked = d.sel && d.sel!==id && used.has(pairKey(d.sel,id));
      return `<button class="pair-chip ${isSel?'sel':''} ${blocked?'blocked':''}" onclick="tapPair('${key}','${id}')" ${blocked?'aria-disabled="true"':''}>${miniAvatar(id,22)}<span>${fnameH(id)}</span><small>${fby(id).nivel}</small></button>`; }).join('') || '<span class="step-note">Todos emparejados.</span>'}</div>
    ${d.pairs.length?`<div class="matches-grid" style="margin-top:12px;">${d.pairs.map((p,i)=>`<div class="match" style="min-height:0;"><div class="match-head">
      <div class="match-side left">${miniAvatar(p[0],22)}<span class="side-name">${fnameH(p[0])}</span></div><div class="vs">vs</div>
      <div class="match-side right"><span class="side-name">${fnameH(p[1])}</span>${miniAvatar(p[1],22)}</div></div>
      <div class="match-result"><span>${fby(p[0]).nivel} · ${fby(p[1]).nivel}</span><button class="btn small ghost" onclick="removePair('${key}',${i})">Deshacer</button></div></div>`).join('')}</div>`:''}
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:14px;">
      <button class="btn small" onclick="autoFillPairs('${key}')">${d.pairs.length?'Completar el resto al azar':'Sortear todos'}</button>
      ${d.pairs.length?`<button class="btn small danger" onclick="clearPairs('${key}')">Vaciar</button>`:''}
      <span class="top-spacer"></span>
      <button class="btn small primary" ${d.pairs.length===5?'':'disabled'} onclick="confirmRound('${key}')">Confirmar cruces</button>
    </div>
  </div>`;
}
function tapPair(key,id){
  const L=cur().leagues[key]; const d=draftOf(key);
  if(d.sel==null){ d.sel=id; render(); return; }
  if(d.sel===id){ d.sel=null; render(); return; }
  const a=d.sel, b=id;
  if(playedPairsOf(L).has(pairKey(a,b))){ toast(`${fname(a)} y ${fname(b)} ya se enfrentaron esta temporada.`); return; }
  const fixed=[...d.pairs,[a,b]];
  const ok=solveRounds(L.competitors, playedPairsOf(L), fixed, JORNADAS-L.played);
  if(!ok){ toast(`Con ${fname(a)} vs ${fname(b)} los cruces de las jornadas que quedan ya no cuadran. Prueba otro.`); return; }
  d.pairs.push([a,b]); d.sel=null; render();
}
function removePair(key,i){ const d=draftOf(key); d.pairs.splice(i,1); d.sel=null; render(); }
function clearPairs(key){ const d=draftOf(key); d.pairs=[]; d.sel=null; render(); }
function autoFillPairs(key){
  const L=cur().leagues[key]; const d=draftOf(key);
  const sol=solveRounds(L.competitors, playedPairsOf(L), d.pairs, JORNADAS-L.played);
  if(!sol){ toast('No hay forma de completar con esos cruces. Deshaz alguno.'); return; }
  d.pairs=sol[0]; d.sel=null; render();
}
function confirmRound(key){
  const L=cur().leagues[key]; const d=draftOf(key);
  if(d.pairs.length!==5) return;
  const sol=solveRounds(L.competitors, playedPairsOf(L), d.pairs, JORNADAS-L.played);
  if(!sol){ toast('Esos cruces no dejan un calendario válido.'); return; }
  const rest=sol.map(r=>r.map(([a,b])=>({id:uid('m'), a, b, result:null})));
  L.rounds = L.rounds.slice(0,L.played).concat(rest);
  L.confirmed[L.played]=true;
  delete state.ui['draft_'+key];
  state.ui['jnav_'+key]=L.played;
  toast(`Cruces de la J${L.played+1} confirmados. Ya puedes seguir avanzando.`);
  render();
}
function unconfirmRound(key){
  const L=cur().leagues[key];
  delete L.confirmed[L.played];
  state.ui['draft_'+key]={round:L.played, pairs:L.rounds[L.played].map(m=>[m.a,m.b]), sel:null};
  render();
}


/* =========================================================================
   REVELACIÓN DEL LINE UP: 15 días antes de la J1, la comunidad opina en X
========================================================================= */
var LU_DAYS = 15;
var LU_RESERVED = 20;   // primeros 20 días de enero: reservados para la revelación de line ups
/* Cuentas de X: TWITTEROS (reales, con color de país), TW_NEWS (McNoticias / Info Freestyle) y tuiteros genéricos de relleno */
function luStreak(s, k, id){   // temporadas seguidas anteriores en esta misma liga
  let n=0; for(let i=state.seasons.length-2;i>=0;i--){ const o=state.seasons[i];
    if(k===INTL.key){ if(o.intl && (o.intl.qualifiers||[]).includes(id)) n++; else break; continue; }
    const L=o.leagues&&o.leagues[k];
    if(L && (o.activeKeys||[]).includes(k) && (L.competitors||[]).includes(id)) n++; else break; } return n;
}
function luEverIn(s, id){ return state.seasons.slice(0,-1).some(o=>Object.keys(o.leagues||{}).some(k=>(o.activeKeys||[]).includes(k) && (o.leagues[k].competitors||[]).includes(id))); }
var TWITTEROS = [
  {"handle":"Quesadacid","name":"Rodrigo Quesada","country":"España","verified":true,"img":"@quesada","fav":[],"hate":[],"special":"quesada"},
  {"handle": "CTZismo", "name": "CTZismo", "country": "España", "verified": false, "img": "tw_ctzismo", "fav": [], "hate": []},
  {"handle": "SawiEleskizo", "name": "SawiEleskizo", "country": "México", "verified": false, "img": "tw_sawieleskizo", "fav": ["Gazir", "Bnet", "Mecha"], "hate": ["Cacha", "Stick", "Nitro"]},
  {"handle": "AhiDiceYuji", "name": "Yuji", "country": "España", "verified": false, "img": "tw_ahidiceyuji", "fav": ["Skone", "Chuty", "Gazir"], "hate": ["Navas", "Kodigo", "Vijay Kesh"]},
  {"handle": "fabiukismo", "name": "Fabiukismo", "country": null, "verified": false, "img": "tw_fabiukismo", "fav": ["Fabiuki", "Acertijo", "Gazir"], "hate": ["Yoiker", "Barón", "Cacha"]},
  {"handle": "KzgLegendary_", "name": "KzgLegendary", "country": "España", "verified": false, "img": "tw_kzglegendary_", "fav": ["Teorema", "Sweet Pain", "Acru"], "hate": ["Dybbuk", "Acertijo", "Barón"]},
  {"handle": "hbrsg_", "name": "motera", "country": "España", "verified": false, "img": "tw_hbrsg_", "fav": ["Bnet", "Acru"], "hate": ["Gazir", "Dybbuk", "Zasko"]},
  {"handle": "IgnoreF3", "name": "IgnoreF", "country": "Perú", "verified": false, "img": "tw_ignoref3", "fav": ["Jaze", "Acru", "Reverse"], "hate": ["Force", "Drose", "Acertijo"]},
  {"handle": "Benja_LIT", "name": "benja ☽", "country": "Chile", "verified": false, "img": "tw_benja_lit", "fav": ["Sweet Pain", "Teorema", "Abel"], "hate": ["Cacha", "Skone", "Acertijo"]},
  {"handle": "erchelsifut", "name": "Brais", "country": "España", "verified": false, "img": "tw_erchelsifut", "fav": ["Bnet", "Walls", "Jaze"], "hate": ["Navas", "Nitro", "Nekroos"]},
  {"handle": "SantiagoMagda1", "name": "Pity Martínez", "country": "Argentina", "verified": false, "img": "tw_santiagomagda1", "fav": ["Alkoy", "Bnet", "Zasko"], "hate": ["Larrix", "Dybbuk", "Gazir"]},
  {"handle": "ElVacileDeSKONE", "name": "ElVacileDeSKONE", "country": "España", "verified": false, "img": "tw_elvaciledeskone", "fav": ["Skone"], "hate": []},
  {"handle": "diegidioos", "name": "Diegooo 🇪🇸", "country": "España", "verified": false, "img": "tw_diegidioos", "fav": ["Gazir", "Bnet", "Rayban"], "hate": ["Nekroos", "Nitro", "Azuky"]},
  {"handle": "AKA_Porrismo", "name": "Zeker Roken", "country": "México", "verified": false, "img": "tw_aka_porrismo", "fav": ["Zasko", "Jony Beltrán", "Chuty"], "hate": ["Acertijo", "Kodigo", "Navas"]},
  {"handle": "uknowjav1", "name": "JAVIUKNOW", "country": "Argentina", "verified": true, "img": "tw_uknowjav1", "fav": ["Bnet", "Abel", "Navas"], "hate": ["Aczino", "Chuty", "Rapder"]},
  {"handle": "DavidEgidooo", "name": "David Egido Domenech", "country": "España", "verified": false, "img": "tw_davidegidooo", "fav": ["Nocre", "Sweet Pain", "Segrelles"], "hate": ["Jesús LC", "Mounts", "Lgido"]},
  {"handle": "Jalonerista", "name": "AlanBR", "country": "Chile", "verified": false, "img": "tw_jalonerista", "fav": ["El Menor", "Zasko", "Abel"], "hate": ["Acertijo", "Rapder", "Skone"]},
  {"handle": "Vazcoo_", "name": "Vazcoo", "country": "México", "verified": false, "img": "tw_vazcoo_", "fav": ["Zasko", "Bnet", "Teorema"], "hate": ["Rapder", "Azuky", "Dybbuk"]},
  {"handle": "Letoinia", "name": "Tiaguiño MC", "country": "Chile", "verified": false, "img": "tw_letoinia", "fav": ["Teorema", "Aczino", "Stigma"], "hate": ["Mecha", "Dybbuk", "Cacha"]},
  {"handle": "Ruvii____", "name": "Ruvi", "country": null, "verified": false, "img": "tw_ruvii____", "fav": ["Acru", "Papo", "Nitro"], "hate": []},
  {"handle": "elbrozas02", "name": "BRZ", "country": "España", "verified": false, "img": "tw_elbrozas02", "fav": ["Sweet Pain", "Bnet", "Chuty"], "hate": ["Force", "Xhavez", "Nitro"]},
  {"handle": "renzopr4", "name": "Ren", "country": "EEUU", "verified": false, "img": "tw_renzopr4", "fav": ["Gazir", "Chuty", "Teorema"], "hate": ["Rapder", "Dybbuk", "Acertijo"]},
  {"handle": "YairData", "name": "Yair", "country": "México", "verified": false, "img": "tw_yairdata", "fav": ["MCKlopedia", "Hadrian", "Piezas"], "hate": ["Tirpa", "Navas", "Segrelles"]},
  {"handle": "Emiaj761", "name": "Emiaj76", "country": "España", "verified": false, "img": "tw_emiaj761", "fav": ["Gazir", "Alek", "Mecha"], "hate": ["Kodigo", "Rapder", "Replik"]},
  {"handle": "DrekaaUC", "name": "Drekaa UC", "country": "España", "verified": false, "img": "tw_drekaauc", "fav": ["Chuty", "Sweet Pain", "Mecha"], "hate": ["Rapder", "Dima"]},
  {"handle": "FandeTrunks_", "name": "Trunks", "country": "República Dominicana", "verified": false, "img": "tw_fandetrunks_", "fav": ["El Menor", "Teorema", "Stuart"], "hate": ["Navas", "Force", "KG"]},
  {"handle": "eljaiskore_BS", "name": "Jaiskor", "country": "Perú", "verified": false, "img": "tw_eljaiskore_bs", "fav": ["Jaze", "Jota", "Trueno"], "hate": ["Navas", "Jair Wong", "Acertijo"]},
  {"handle": "LaVozDelFri", "name": "LaVozDelFreestyle", "country": "México", "verified": false, "img": "tw_lavozdelfri", "fav": ["Sweet Pain", "Zasko", "Teorema"], "hate": ["Cacha", "Valles-T", "Rapder"]},
  {"handle": "AfiduPingon", "name": "Afidu Alarako", "country": "Perú", "verified": false, "img": "tw_afidupingon", "fav": ["Scraps", "Papo", "Vokbulario"], "hate": ["Navas", "Dalia", "Papicha"]},
  {"handle": "Freekys", "name": "Freekys", "country": "España", "verified": false, "img": "tw_freekys", "fav": ["Sweet Pain", "Reverse", "Jaze"], "hate": ["Force", "Azuky", "Jesús LC"]},
  {"handle": "fripuro_", "name": "fripuro", "country": "Argentina", "verified": false, "img": "tw_fripuro_", "fav": ["Mecha", "Abel", "Bnet"], "hate": ["Rodamiento", "Acertijo", "KG"]},
  {"handle": "ErrorJudicialNF", "name": "n0facefighter", "country": "Perú", "verified": false, "img": "tw_errorjudicialnf", "fav": ["Duki", "Jaze", "MCKlopedia"], "hate": []},
  {"handle": "kora", "name": "SI ROMAN ES EL PILOTO BOCA ES EL CHAPECOPENSE", "country": "Argentina", "verified": false, "img": "tw_kora", "fav": ["Zasko", "Abel", "Bnet"], "hate": ["Force", "Letra", "Acertijo"]},
  {"handle": "NOZHITO1", "name": "NOZHITO", "country": "Panamá", "verified": false, "img": "tw_nozhito1", "fav": ["Aldahir", "UFO"], "hate": []},
  {"handle": "Deap1616", "name": "ashe", "country": "Argentina", "verified": false, "img": "tw_deap1616", "fav": ["Abel", "Larrix", "Tirpa"], "hate": ["Rapder", "Acertijo", "Force"]},
  {"handle": "IkerRM_", "name": "IkerRM", "country": "España", "verified": false, "img": "tw_ikerrm_", "fav": ["Gazir", "Valles-T", "Chuty"], "hate": ["Navas", "Nekroos", "Nitro"]},
  {"handle": "el_biontito", "name": "Biont", "country": "España", "verified": false, "img": "tw_el_biontito", "fav": ["Zasko", "Abel", "KG"], "hate": ["Dybbuk", "Pandora", "Acertijo"]},
  {"handle": "SalazarSixi", "name": "AKA", "country": null, "verified": false, "img": "tw_salazarsixi", "fav": ["Jaze", "KG", "Teorema"], "hate": ["Azuky", "Fat N", "Navas"]},
  {"handle": "Awel0_", "name": "Awelo", "country": "Chile", "verified": true, "img": "tw_awel0_", "fav": ["El Menor", "Abel", "Zasko"], "hate": ["Rapder", "Nitro", "Valles-T"]},
  {"handle": "elreydelhielo_", "name": "Rey del Hielo", "country": "España", "verified": false, "img": "tw_elreydelhielo_", "fav": ["Jaloner"], "hate": ["Almendrades", "Marithea", "Gazir"]},
  {"handle": "MarconoNotFound", "name": "MARCONE CANGREJO MUTANTE", "country": "Argentina", "verified": false, "img": "tw_marcononotfound", "fav": ["Mnak", "Mecha", "RC"], "hate": ["Larrix", "Kaiser", "Drose"]},
  {"handle": "xgbrlmthsx", "name": "GP", "country": "Venezuela", "verified": false, "img": "tw_xgbrlmthsx", "fav": ["Stuart", "Joqerr", "Larrix"], "hate": ["Rapder", "Dybbuk", "Hammer"]},
  {"handle": "cronicasportcat", "name": "Àlex", "country": "España", "verified": false, "img": "tw_cronicasportcat", "fav": ["Bnet", "Ibán", "Nocre"], "hate": ["Navas", "Nekroos", "KG"]},
  {"handle": "GriselGonz44241", "name": "uriel gonzalez", "country": "Argentina", "verified": false, "img": "tw_griselgonz44241", "fav": ["Dtoke", "Gazir", "Mecha"], "hate": ["Kaiser", "Navas", "Ramset"]},
  {"handle": "DonatoFerr75055", "name": "DoroMC 🇺🇾", "country": "Uruguay", "verified": false, "img": "tw_donatoferr75055", "fav": ["Jony Beltrán", "Cacha", "Sweet Pain"], "hate": ["Abel", "Navas", "Michu"]},
  {"handle": "Chipi139", "name": "Chipi", "country": "España", "verified": false, "img": "tw_chipi139", "fav": ["Sweet Pain", "Zasko", "Fabiuki"], "hate": ["Rapder", "Nekroos", "Fat N"]},
  {"handle": "ModorkFN", "name": "AlexanderYSB", "country": "México", "verified": false, "img": "tw_modorkfn", "fav": ["Gazir", "Bnet", "Sweet Pain"], "hate": ["Nitro", "Letra", "Nekroos"]},
  {"handle": "lil_puppet25", "name": "lil puppet 🇨🇱", "country": "Chile", "verified": false, "img": "tw_lil_puppet25", "fav": ["Teorema", "Mecha"], "hate": ["Kodigo", "Rapder", "Sara Socas"]},
  {"handle": "1903_apoyoatleti", "name": "1903_apoyoatleti", "country": "España", "verified": false, "img": "tw_1903_apoyoatleti", "fav": ["El Menor", "Gazir", "Chuty"], "hate": ["Aczino", "Alek", "Navas"]},
  {"handle": "Mastantuonism01", "name": "Mastantuonismo", "country": "Argentina", "verified": false, "img": "tw_mastantuonism01", "fav": ["Mecha", "Sweet Pain", "Jony Beltrán"], "hate": ["Dybbuk", "KG", "Chang"]},
  {"handle": "Lainho_", "name": "Laíño", "country": "España", "verified": false, "img": "tw_lainho_", "fav": ["Alek", "Nez", "Perry"], "hate": ["Dani VK", "Michu"]},
  {"handle": "ernizito", "name": "ernizito", "country": "Argentina", "verified": false, "img": "tw_ernizito", "fav": ["Zasko", "Jaze", "Mecha"], "hate": ["Acertijo", "Larrix", "Rapder"]},
  {"handle": "NPCMEXA", "name": "Npcmexicano", "country": "México", "verified": false, "img": "tw_npcmexa", "fav": ["El Menor", "Larrix", "Skone"], "hate": ["Gazir", "KG", "Valles-T"]},
  {"handle": "Fabhy__", "name": "FABHY_17", "country": "España", "verified": false, "img": "tw_fabhy__", "fav": ["Barón", "Xhavez", "CTZ"], "hate": ["Lobo Estepario", "Filósofo"]},
  {"handle": "Rasec_MF_", "name": "RaseC_B.A.", "country": "España", "verified": false, "img": "tw_rasec_mf_", "fav": ["Zasko", "Abel", "Joqerr"], "hate": ["Sara Socas", "Rapder", "Nitro"]},
  {"handle": "rexo_tw", "name": "santicarrasco", "country": "Argentina", "verified": false, "img": "tw_rexo_tw", "fav": ["Sweet Pain", "Replik", "Jaze"], "hate": ["Cacha", "Nitro", "Navas"]},
  {"handle": "Psychokiler9", "name": "Kiler", "country": "España", "verified": false, "img": "tw_psychokiler9", "fav": ["Arkano", "Skone", "Mr. Ego"], "hate": ["Navas", "Nitro", "Rapder"]},
  {"handle": "2BravoCharlie", "name": "BravoCharlie 🇻🇪", "country": "Venezuela", "verified": false, "img": "tw_2bravocharlie", "fav": ["Letra", "Chang", "Black Code"], "hate": ["Navas", "Naista", "Airon"]},
  {"handle": "KojiroRap30", "name": "KojiroRap", "country": "Colombia", "verified": false, "img": "tw_kojirorap30", "fav": ["Lokillo", "Chuty", "Jaze"], "hate": ["Cacha", "Azuky", "KG"]},
  {"handle": "Joaquin_nunez7", "name": "Xseven7", "country": "Perú", "verified": false, "img": "tw_joaquin_nunez7", "fav": ["Bnet", "Abel", "Jaze"], "hate": ["Force", "Dybbuk", "Jair Wong"]},
  {"handle": "marconcentrado", "name": "marco", "country": "México", "verified": false, "img": "tw_marconcentrado", "fav": ["Acru", "Tata", "Bnet"], "hate": ["Cacha", "Acertijo", "Rapder"]},
  {"handle": "BLEDOXD", "name": "blaxx", "country": "Chile", "verified": false, "img": "tw_bledoxd", "fav": ["El Menor", "Valles-T", "Rife"], "hate": ["Navas", "Michu", "Dybbuk"]},
  {"handle": "acciomas", "name": "acciomas", "country": "España", "verified": false, "img": "tw_acciomas", "fav": ["Stuart", "Chuty", "Replik"], "hate": ["Valles-T", "Force", "Acertijo"]},
  {"handle": "ElGatonto", "name": "bronx", "country": "Argentina", "verified": false, "img": "tw_elgatonto", "fav": ["Acru", "Aczino", "El Menor"], "hate": ["Naista", "Gazir", "Dybbuk"]},
  {"handle": "mauzun_06", "name": "M_zeta", "country": "Ecuador", "verified": false, "img": "tw_mauzun_06", "fav": ["Navas", "Abel", "Ritter"], "hate": ["Cacha", "Acertijo", "Garza"]},
  {"handle": "Mcflyxfree", "name": "Alfredo", "country": "Venezuela", "verified": false, "img": "tw_mcflyxfree", "fav": ["Chang", "Blon", "Zasko"], "hate": ["Mounts", "Nekroos", "Cacha"]},
  {"handle": "langonismo_13", "name": "SI ES NENE PONELE ACRU", "country": "Argentina", "verified": false, "img": "tw_langonismo_13", "fav": ["Abel", "Stuart", "Ibán"], "hate": ["KG", "Fat N", "Azuky"]},
  {"handle": "matogofc", "name": "matogo", "country": "España", "verified": false, "img": "tw_matogofc", "fav": ["Navas", "Chuty", "Bnet"], "hate": ["Force", "Aczino", "El Menor"]},
  {"handle": "LibanielNorena", "name": "Lib", "country": "Colombia", "verified": false, "img": "tw_libanielnorena", "fav": ["Abel", "Teorema", "Nocre"], "hate": ["Aczino", "Nitro", "Dybbuk"]},
  {"handle": "yebrayeah", "name": "aka.braye", "country": "España", "verified": false, "img": "tw_yebrayeah", "fav": ["Reverse", "Xhavez", "Teorema"], "hate": ["Black Code", "Abel", "Drose"]},
  {"handle": "JoseleJr99", "name": "Josele", "country": "España", "verified": false, "img": "tw_joselejr99", "fav": ["Mr Aaron"], "hate": ["Gazir", "Marithea", "Rapder"]},
  {"handle": "ReinoBlaugrana", "name": "Reino", "country": null, "verified": false, "img": "tw_reinoblaugrana", "fav": ["Sweet Pain", "Stuart", "Filósofo"], "hate": ["Dybbuk", "Larrix", "KG"]},
  {"handle": "way2fresh30", "name": "Omar carpio", "country": "Ecuador", "verified": false, "img": "tw_way2fresh30", "fav": ["Gazir", "Larrix", "Abel"], "hate": ["Azuky", "Switch", "Navas"]},
  {"handle": "Dan_x2g", "name": "Dan", "country": null, "verified": false, "img": "tw_dan_x2g", "fav": ["Jaze", "Necia", "Diego MC"], "hate": ["Sumeria", "Papicha", "Jair Wong"]},
  {"handle": "porrinhoo", "name": "porrinho", "country": "España", "verified": false, "img": "tw_porrinhoo", "fav": ["Gazir", "Krisan", "Sweet Pain"], "hate": ["Rapder", "Aczino", "Fat N"]},
  {"handle": "cleto1902", "name": "Cleto DKNO", "country": "Argentina", "verified": false, "img": "tw_cleto1902", "fav": ["Mecha", "Valles-T", "Reverse"], "hate": ["El Menor", "Navas", "Rapder"]},
  {"handle": "Dieggoalonnso", "name": "dieggoalonnso", "country": "España", "verified": false, "img": "tw_dieggoalonnso", "fav": ["Gazir", "Jony Beltrán", "99"], "hate": ["KG", "Navas", "Nota Roja"]},
  {"handle": "_osk44", "name": "Oscar", "country": "Argentina", "verified": false, "img": "tw__osk44", "fav": ["Dyse", "Mecha", "Zasko"], "hate": ["Dybbuk", "Rapder", "Lokillo"]},
  {"handle": "moskifreestyle", "name": "Moski", "country": "España", "verified": false, "img": "tw_moskifreestyle", "fav": ["Acru", "Abel", "Teorema"], "hate": ["Kodigo", "Rapder", "Barón"]},
  {"handle": "Shade2901", "name": "TE CAYERON TODOS LOS PUNCHLINES JUNTOS", "country": "Argentina", "verified": false, "img": "tw_shade2901", "fav": ["Mecha", "Gazir", "Abel"], "hate": ["Azuky", "Navas", "Nota Roja"]},
  {"handle": "TengomilPiplups", "name": "Iván Pastore", "country": "España", "verified": false, "img": "tw_tengomilpiplups", "fav": ["Exe", "Chuty", "Skone"], "hate": ["Navas", "HDR", "Bélico"]},
  {"handle": "rodrigo_zarate1", "name": "Rodrigo Zarate ()", "country": "Argentina", "verified": false, "img": "tw_rodrigo_zarate1", "fav": ["Gazir", "Mecha", "Exe"], "hate": ["Rapder", "Dybbuk", "El Menor"]},
  {"handle": "GameExiliado", "name": "GameExiliado", "country": "España", "verified": false, "img": "tw_gameexiliado", "fav": ["Skone", "Larrix", "Chuty"], "hate": ["Rapder", "Navas", "Azuky"]},
  {"handle": "RicoGercho", "name": "VersettRMU", "country": "España", "verified": false, "img": "tw_ricogercho", "fav": ["Skone", "Bnet", "Walls"], "hate": ["Sara Socas", "Abel", "Acertijo"]},
  {"handle": "Leoo_Cantero", "name": "Leo", "country": "Argentina", "verified": false, "img": "tw_leoo_cantero", "fav": ["Mecha", "Jaze", "Gazir"], "hate": ["Force", "Cacha", "Rapder"]},
  {"handle": "o_reynildoATM", "name": "#freereinildo", "country": "España", "verified": false, "img": "tw_o_reynildoatm", "fav": ["Bnet", "Jaze", "Replik"], "hate": ["Force", "Nekroos", "Lgido"]},
  {"handle": "MauArce21", "name": "MAU 1889", "country": "Argentina", "verified": false, "img": "tw_mauarce21", "fav": ["Dani Ribba", "Stuart", "Teorema"], "hate": ["Klan", "Replik", "Aczino"]},
  {"handle": "TenPantalla", "name": "Alonso Talavera 29", "country": "Perú", "verified": false, "img": "tw_tenpantalla", "fav": ["Venti"], "hate": ["Jair Wong", "Sumeria"]},
  {"handle": "CoBaT0_", "name": "CoBaT0", "country": "Colombia", "verified": false, "img": "tw_cobat0_", "fav": ["Zasko", "Teorema", "Abel"], "hate": ["Nitro", "Rapder", "Cacha"]},
  {"handle": "KiTsuN3_19", "name": "Comandante Kitsune", "country": "Puerto Rico", "verified": false, "img": "tw_kitsun3_19", "fav": ["Teorema", "Sweet Pain", "Wos"], "hate": ["Rapder", "Acertijo", "Force"]},
  {"handle": "larriva_j", "name": "JLarriva", "country": "Ecuador", "verified": false, "img": "tw_larriva_j", "fav": ["Gazir", "Tom Crowley", "Blon"], "hate": ["Navas", "Rapder", "Rodamiento"]},
  {"handle": "Marc254222", "name": "Marc", "country": "España", "verified": false, "img": "tw_marc254222", "fav": ["Chuty", "Bnet", "Acru"], "hate": ["Sara Socas", "Nocre", "El Menor"]},
  {"handle": "Bautistamenaje", "name": "Bautitamenaje", "country": "Argentina", "verified": false, "img": "tw_bautistamenaje", "fav": ["Bnet", "Stuart", "El Menor"], "hate": ["Navas", "Drose", "HDR"]},
  {"handle": "edersanv", "name": "edersan", "country": null, "verified": false, "img": "tw_edersanv", "fav": ["Abel", "Ibán", "Fabiuki"], "hate": ["Azuky", "CDFlex", "Rapder"]},
  {"handle": "ElMaxTO", "name": "TheMaxTO", "country": "México", "verified": false, "img": "tw_elmaxto", "fav": ["Aczino", "Jaze", "Teorema"], "hate": ["Navas", "Rapder", "Black Code"]},
  {"handle": "3l_F3NIXx", "name": "Diego_Mtz", "country": "México", "verified": false, "img": "tw_3l_f3nixx", "fav": ["Stuart", "Sweet Pain", "Teorema"], "hate": ["Rapder", "Dybbuk", "Replik"]},
  {"handle": "Carlito52323616", "name": "Carlos :)", "country": "México", "verified": false, "img": "tw_carlito52323616", "fav": ["Gazir", "Aczino", "Chuty"], "hate": ["Replik", "Navas", "Jony Beltrán"]},
  {"handle": "SaulRH3", "name": "KGismo", "country": "México", "verified": false, "img": "tw_saulrh3", "fav": ["KG", "Sweet Pain", "Sub"], "hate": ["Dybbuk", "Azuky", "Force"]},
  {"handle": "JuanManuel25339", "name": "Juan Manuel Abellaneda", "country": null, "verified": false, "img": "tw_juanmanuel25339", "fav": ["Navas", "Zasko", "Bélico"], "hate": ["Force", "Aczino", "Gazir"]},
  {"handle": "DiaFreestyler", "name": "Diario Freestyler", "country": null, "verified": false, "img": "tw_diafreestyler", "fav": ["Stuart", "Nacho SRK"], "hate": ["Force", "Hander", "Naista"]},
  {"handle": "GGFRESH0", "name": "nanomesias", "country": null, "verified": false, "img": "tw_ggfresh0", "fav": ["Bnet", "Zasko", "Arkano"], "hate": ["Rapder", "Aczino", "Mecha"]},
  {"handle": "joaq_ferrari", "name": "Swaggy J", "country": "Uruguay", "verified": false, "img": "tw_joaq_ferrari", "fav": ["Acru", "Aczino", "Jaze"], "hate": ["Rapder", "Navas", "Cacha"]},
  {"handle": "aaronsit00", "name": "Aaronsit00", "country": null, "verified": false, "img": "tw_aaronsit00", "fav": ["Mnak", "Acru", "Bnet"], "hate": ["Navas", "Kodigo", "Hander"]},
  {"handle": "nickzfn94", "name": "nickzzën", "country": "España", "verified": false, "img": "tw_nickzfn94", "fav": ["Gazir", "Trueno", "Acru"], "hate": ["Teorema", "Acertijo", "Sweet Pain"]},
  {"handle": "Txuntxu138083", "name": "txuntxu", "country": "Colombia", "verified": false, "img": "tw_txuntxu138083", "fav": ["Teorema", "Abel", "Valles-T"], "hate": ["Alek", "Stuart", "Nitro"]},
  {"handle": "WinteRNR9", "name": "GreenSnow", "country": "EEUU", "verified": false, "img": "tw_winternr9", "fav": ["Aczino", "Acru", "Chuty"], "hate": ["CTZ", "Mecha", "Abel"]},
  {"handle": "jotabolsilludo", "name": "Jota", "country": "Uruguay", "verified": false, "img": "tw_jotabolsilludo", "fav": ["Skone", "Zasko", "Teorema"], "hate": ["Navas", "Rapder", "Sophia"]},
  {"handle": "sotelo__08", "name": "el_killer08", "country": "España", "verified": false, "img": "tw_sotelo__08", "fav": ["Wos", "Acru", "Sweet Pain"], "hate": ["Rapder", "Force", "Fat N"]},
  {"handle": "DavidGJamal", "name": "David G. Jamal", "country": "España", "verified": false, "img": "tw_davidgjamal", "fav": ["Zasko", "Sweet Pain", "Krisan"], "hate": ["Force", "Azuky", "Gazir"]},
  {"handle": "freestylereal06", "name": "freestylereal", "country": "España", "verified": false, "img": "tw_freestylereal06", "fav": ["Navas", "Dr. Filtros", "Bnet"], "hate": ["Aczino", "Force", "Gazir"]},
  {"handle": "Multinecz", "name": "Multinecz", "country": "Chile", "verified": false, "img": "tw_multinecz", "fav": ["Ricto", "Zasko", "Marithea"], "hate": ["Nekroos", "Navas", "Fat N"]},
  {"handle": "jemzukii", "name": "jem #largatevelazco", "country": "Perú", "verified": false, "img": "tw_jemzukii", "fav": ["Nitro", "Kodigo", "Fusok"], "hate": ["Navas", "Sumeria", "Dalia"]},
  {"handle": "Shoviii_", "name": "Shovii", "country": "Colombia", "verified": false, "img": "tw_shoviii_", "fav": ["Gazir", "Valles-T", "El Menor"], "hate": ["Rapder", "Almendrades", "Fat N"]},
  {"handle": "SToilet86312", "name": "°Kyzen 🇲🇽°", "country": "México", "verified": false, "img": "tw_stoilet86312", "fav": ["Skiper", "Dominic"], "hate": ["Dybbuk", "Knnon", "Acertijo"]},
  {"handle": "DRossox", "name": "Rfs", "country": "Colombia", "verified": false, "img": "tw_drossox", "fav": ["Valles-T", "Teorema", "Bnet"], "hate": ["Puppy", "Navas", "Force"]},
  {"handle": "Fernando_Soto11", "name": "Fernando Soto", "country": "México", "verified": false, "img": "tw_fernando_soto11", "fav": ["Teorema", "Aczino", "Valles-T"], "hate": ["Azuky", "Navas", "Drose"]},
  {"handle": "just__ld19", "name": "LD", "country": "Colombia", "verified": false, "img": "tw_just__ld19", "fav": ["Trueno", "Bnet", "Puppy"], "hate": ["Rapder", "Acertijo", "Stick"]},
  {"handle": "MGJVYB", "name": "ex manu baby", "country": "España", "verified": false, "img": "tw_mgjvyb", "fav": ["Jaze", "Acru", "Sweet Pain"], "hate": ["Vijay Kesh", "Blon", "Dybbuk"]},
  {"handle": "jxandi_vz", "name": "Jxandi", "country": "Venezuela", "verified": false, "img": "tw_jxandi_vz", "fav": ["Papo", "Chang", "Fabiuki"], "hate": ["Navas", "Dybbuk", "Hander"]},
  {"handle": "6ancap6Lib", "name": "FanDelFree 🇲🇽", "country": "México", "verified": false, "img": "tw_6ancap6lib", "fav": ["Abel", "Zasko"], "hate": ["Cacha", "Rapder", "Valles-T"]},
  {"handle": "gutifiosoo", "name": "Gutifioso", "country": "España", "verified": false, "img": "tw_gutifiosoo", "fav": ["Teorema", "Bnet", "Sweet Pain"], "hate": ["Navas", "CDFlex", "Drose"]},
  {"handle": "Sarto0d", "name": "Sarto.0", "country": "Argentina", "verified": false, "img": "tw_sarto0d", "fav": ["Mecha", "Dyse", "El Menor"], "hate": ["Azuky", "Dalia", "Chang"]},
  {"handle": "TukiSaint", "name": "TUKI", "country": "Argentina", "verified": false, "img": "tw_tukisaint", "fav": ["Abel", "Mecha", "1Tobi"], "hate": ["Filósofo", "KG", "Aczino"]},
  {"handle": "Marco_Ramirez7", "name": "Marco R. Martinez", "country": "Honduras", "verified": false, "img": "tw_marco_ramirez7", "fav": ["Chuty", "Jaze", "Aczino"], "hate": ["Abel", "Nocre", "Dani VK"]},
  {"handle": "tinchotinchea", "name": "Tincherismo🇪🇸", "country": "España", "verified": false, "img": "tw_tinchotinchea", "fav": ["Sweet Pain", "Bnet", "Zasko"], "hate": ["Force", "Nitro", "Sara Socas"]},
  {"handle": "DomadasGato", "name": "⭐️ 16 🦅", "country": "México", "verified": false, "img": "tw_domadasgato", "fav": ["Aczino", "Wos", "Kodigo"], "hate": ["KG", "Fat N", "CTZ"]},
  {"handle": "LuccaPugliese", "name": "Lucca Supreme", "country": "Argentina", "verified": false, "img": "tw_luccapugliese", "fav": ["Bnet", "Papo", "Zasko"], "hate": ["Dybbuk", "Force", "Acertijo"]},
  {"handle": "prensasinsaber_", "name": "Francisco 🇦🇷", "country": "Argentina", "verified": false, "img": "tw_prensasinsaber_", "fav": ["Abel", "Bnet", "Teorema"], "hate": ["Navas", "Azuky", "Acertijo"]},
  {"handle": "kyforgothisname", "name": "kyzanoesta", "country": "México", "verified": false, "img": "tw_kyforgothisname", "fav": ["Jaze", "Teorema", "Acru"], "hate": ["Rapder", "Segrelles", "Acertijo"]},
  {"handle": "Joel_Otero22", "name": "Joeel_22", "country": "España", "verified": false, "img": "tw_joel_otero22", "fav": ["Abel", "Fabiuki", "KG"], "hate": ["Cacha", "Rapder", "Nitro"]},
  {"handle": "paco10809914", "name": "Antifarias", "country": "Colombia", "verified": false, "img": "tw_paco10809914", "fav": ["Papo", "Chuty", "Bélico"], "hate": ["Navas", "Rapder", "Almendrades"]},
  {"handle": "martingzlez", "name": "Martin González", "country": "Colombia", "verified": false, "img": "tw_martingzlez", "fav": ["Fabiuki", "Larrix", "El Menor"], "hate": ["Navas", "Rapder", "Black Code"]},
  {"handle": "AKA_FMK", "name": "efe", "country": "España", "verified": false, "img": "tw_aka_fmk", "fav": ["Zasko", "Bnet", "Ibán"], "hate": ["Gazir", "El Menor", "Valles-T"]},
  {"handle": "Batallas_Mc", "name": "BatallasMc", "country": null, "verified": false, "img": "tw_batallas_mc", "fav": ["Teorema", "Visionario", "Klan"], "hate": ["Kian", "Dybbuk", "Rapder"]}
];
/* ---- habla de cada país: los tuiteros escriben con sus palabras ---- */
function twDia(c){ if(!c) return 'neu'; if(c==='España') return 'es'; if(c==='Argentina'||c==='Uruguay') return 'ar'; if(c==='México'||c==='EEUU') return 'mx';
  if(c==='Chile') return 'cl'; if(c==='Perú'||c==='Ecuador'||c==='Bolivia') return 'pe'; if(c==='Colombia') return 'co'; return 'car'; }
var TWD={
  es:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} yo me lo veo todo, no hay más que hablar','Tío, que está {n}. Me lo apunto todo','Con {n} esta liga ya es otra cosa, qué pasada','{n} va a petarlo en {liga}, apuntadlo','Me flipa que esté {n}. Por fin una decisión con sentido'],
    hate:['{n} no es para mí, lo siento. Había otros que me apetecían más','{n} en {liga}... no termina de convencerme','Con todo el respeto a {n}, había opciones que me molaban más','No conecto con el estilo de {n}, esta vez no me ilusiona','A {n} le respeto, pero en este cartel no lo veo'],
    hateF:['Pues este año paso de {liga}, con {n} no me la veo','Con {n} en {liga} ya sé qué liga no me voy a ver','{liga} con {n}... me quedo con la mía, gracias'],
    favF:['No soy de ver {liga}, pero con {n} me la voy a tragar entera','Solo por {n} me engancho este año a {liga}','{n} en {liga}. Pues tocará verla 🔥'],
    swap:['Para traer a {n} podíais haber traído a {f}, vamos digo yo','¿Fichar a {n} teniendo a {f} disponible? No lo entiendo','Si había que traer a alguien de fuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevaba años esperando esto 🔥','{n} de vuelta en FMS. Se me ha puesto la piel de gallina','Lo que he echado de menos a {n}. Bienvenido otra vez'],
    retN:['Qué bien que vuelva {n}, se echaba en falta','Mira quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por aquí. Vale, sin más'],
  },
  ar:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, no hay con qué darle','Está {n}, loco. Re manija','Con {n} esta liga es otra cosa, una locura','{n} la va a romper en {liga}, anótenlo','Posta, que esté {n} es lo mejor que le pudo pasar a {liga}'],
    hate:['{n} no me cierra, perdón. Había otros que me gustaban más','{n} en {liga}... no me termina de convencer','Con todo el respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me entusiasma','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no miro {liga}, con {n} no me la banco','Con {n} en {liga} ya sé qué liga no voy a mirar','{liga} con {n}... me quedo con la nuestra'],
    favF:['No suelo mirar {liga}, pero con {n} la veo toda','Solo por {n} me prendo este año a {liga}','{n} en {liga}. Habrá que mirarla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, ¿no?','¿Traer a {n} teniendo a {f}? No lo entiendo, posta','Si había que traer a alguien de afuera, que sea {f} y no {n}'],
    ret:['¡VUELVE {n}! Hace años que espero esto 🔥','{n} de vuelta en FMS. Se me pone la piel de gallina','Cómo extrañaba a {n}. Bienvenido de nuevo, loco'],
    retN:['Qué bueno que vuelva {n}, se lo extrañaba','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, veremos','{n} otra vez por acá. Dale, sin más'],
  },
  mx:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, neta','No manches, está {n}. Qué chido','Con {n} esta liga es otra cosa, está cañón','{n} va a romperla en {liga}, apúntenlo','Qué buena decisión meter a {n}, carnal'],
    hate:['{n} no es para mí, la neta. Había otros que me gustaban más','{n} en {liga}... no me termina de convencer','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} ni de chiste','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... mejor me quedo con la de aquí'],
    favF:['No suelo ver {liga}, pero con {n} la veo completita','Nomás por {n} me pongo a ver {liga} este año','{n} en {liga}. Pues a verla 🔥'],
    swap:['Para traer a {n} mejor hubieran traído a {f}, ¿no?','¿Traer a {n} teniendo a {f}? No le entiendo','Si iban a traer a alguien de fuera, que fuera {f} y no {n}'],
    ret:['¡REGRESA {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me enchina la piel','Cómo extrañaba a {n}. Bienvenido otra vez, carnal'],
    retN:['Qué chido que regrese {n}, hacía falta','Miren quién regresa: {n}. Buena noticia'],
    retL:['¿Regresa {n}? Bueno, a ver qué tal','{n} otra vez por aquí. Va, sin más'],
  },
  cl:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo po','Está {n}, weón. La raja','Con {n} esta liga es otra cosa, bacán','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, cachai'],
    hate:['{n} no es para mí, sorry. Había otros que me tincaban más','{n} en {liga}... no me convence mucho','Con todo respeto a {n}, había mejores opciones po','No conecto con el estilo de {n}, esta vez no me prende','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no me la puedo','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá'],
    favF:['No veo mucho {liga}, pero con {n} la veo entera','Solo por {n} me engancho con {liga} este año','{n} en {liga}. Habrá que verla po 🔥'],
    swap:['Para traer a {n} hubieran traído a {f} po','¿Traer a {n} teniendo a {f}? No cacho','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me puso la piel de gallina','Cómo extrañaba a {n}. Bienvenido de vuelta'],
    retN:['Bacán que vuelva {n}, se le echaba de menos','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Ya, veamos','{n} otra vez por acá. Ya po, sin más'],
  },
  pe:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, causa','Asu, está {n}. Chévere','Con {n} esta liga es otra cosa, bacán','{n} la va a romper en {liga}, apunten','Buena decisión meter a {n} pe'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no la paso','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá, causa'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me engancho con {liga} este año','{n} en {liga}. A verla pe 🔥'],
    swap:['Para traer a {n} hubieran traído a {f} pe','¿Traer a {n} teniendo a {f}? No entiendo, causa','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Años esperando esto 🔥','{n} de vuelta en FMS. Se me pone la piel de gallina','Cómo extrañaba a {n}. Bienvenido otra vez, causa'],
    retN:['Chévere que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por acá. Ya, sin más'],
  },
  co:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, parce','Uff, está {n}. Qué chimba','Con {n} esta liga es otra cosa, muy bacano','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, parcero'],
    hate:['{n} no es para mí, qué pena. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no le jalo','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... me quedo con la de acá, parce'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me pego a {liga} este año','{n} en {liga}. Toca verla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, parce','¿Traer a {n} teniendo a {f}? No entiendo','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Se me erizó la piel','Cómo extrañaba a {n}. Bienvenido otra vez, parce'],
    retN:['Bacano que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver qué tal','{n} otra vez por acá. Listo, sin más'],
  },
  car:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, pana','Está {n}, brutal','Con {n} esta liga es otra cosa, qué nota','{n} la va a romper en {liga}, anótenlo','Buena decisión meter a {n}, chévere'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence esa vaina','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veo {liga}, con {n} no','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... paso, pana'],
    favF:['No veo mucho {liga}, pero con {n} la veo toda','Solo por {n} me pego a {liga} este año','{n} en {liga}. A verla 🔥'],
    swap:['Para traer a {n} hubieran traído a {f}, pana','¿Traer a {n} teniendo a {f}? No entiendo esa vaina','Si iban a traer a alguien de afuera, que fuera {f} y no {n}'],
    ret:['¡VUELVE {n}! Llevo años esperando esto 🔥','{n} de vuelta en FMS. Brutal','Cómo extrañaba a {n}. Bienvenido otra vez, pana'],
    retN:['Chévere que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, a ver','{n} otra vez por aquí. Bien, sin más'],
  },
  neu:{
    fav:['{n} en el cartel, temporada salvada 🔥','Si está {n} lo veo todo, no hay más que hablar','Está {n}. Gran noticia','Con {n} esta liga es otra cosa','{n} va a destacar en {liga}, anótenlo','Buena decisión incluir a {n}'],
    hate:['{n} no es para mí, disculpen. Había otros que me gustaban más','{n} en {liga}... no me convence','Con todo respeto a {n}, había mejores opciones','No conecto con el estilo de {n}, esta vez no me emociona','A {n} lo respeto, pero en este cartel no lo veo'],
    hateF:['Este año no veré {liga}, con {n} no me llama','Con {n} en {liga} ya sé qué liga no voy a ver','{liga} con {n}... esta vez paso'],
    favF:['No suelo ver {liga}, pero con {n} la veré entera','Solo por {n} veré {liga} este año','{n} en {liga}. Habrá que verla 🔥'],
    swap:['Para traer a {n} podrían haber traído a {f}','¿Traer a {n} teniendo a {f} disponible? No lo entiendo','Si había que traer a alguien de fuera, mejor {f} que {n}'],
    ret:['¡VUELVE {n}! Llevaba años esperando esto 🔥','{n} de vuelta en FMS. Qué emoción','Cuánto extrañaba a {n}. Bienvenido de nuevo'],
    retN:['Qué bien que vuelva {n}, hacía falta','Miren quién vuelve: {n}. Buena noticia'],
    retL:['¿Vuelve {n}? Bueno, veremos','{n} otra vez por aquí. Sin más'],
  },
};
// temas generales: España (vosotros) o Latinoamérica (ustedes)
var TWG={
  es:{
    styleRep:['{c} {st}s en el mismo cartel, va a ser la liga más monótona','Todo {st}s, ¿en serio? Dadle algo de variedad a {liga}','¿Quién ha hecho este cartel? {c} {st}s… van a ser todas las batallas iguales'],
    styleOk:['Qué cartel más variado: {st1}, {st2}, {st3}… así sí','Buen equilibrio de estilos en {liga} este año, nadie se va a aburrir','Mola que haya de todo en el cartel, cada jornada va a ser distinta'],
    styleMid:['Bastantes {st}s en {liga} este año… a ver si no se hace repetitivo'],
    rep:['{n} lleva {k} años seguidos en {liga}, dejad paso a otros','Otra vez {n}… {k} temporadas seguidas, ya cansa','¿{n} de nuevo? Hay vida más allá de {n}, eh'],
    same:['Prácticamente el mismo cartel que el año pasado, qué pereza','{liga} repitiendo a {c} del año pasado. Renovad un poco'],
    nuevo:['¡Por fin {n} en FMS! Se lo merecía hace tiempo','{n} debuta en FMS, a ver cómo se adapta','Ojo con {n}, que viene con hambre'],
    top:['Cartelazo. Esto es nivel internacional','No hay relleno en este cartel, {liga} viene fuerte','El mejor line up de {liga} que recuerdo'],
    low:['No conozco a la mitad del cartel…','Line up flojito, la verdad. Esperaba más de {liga}','¿Esto es {liga} o una liga under?'],
    meh:['A ver qué tal {n} este año','{n}… bueno, puede dar la sorpresa','Curiosidad por ver a {n} en {liga}'],
    bomb:['BOMBAZO. {n} en {liga}','Nadie se esperaba a {n} y aquí está','Con {n} ya tengo motivo para ver todas las jornadas'],
  },
  la:{
    styleRep:['{c} {st}s en el mismo cartel, va a ser la liga más monótona','Puros {st}s, ¿en serio? Denle algo de variedad a {liga}','¿Quién armó este cartel? {c} {st}s… van a ser todas las batallas iguales'],
    styleOk:['Qué cartel tan variado: {st1}, {st2}, {st3}… así sí','Buen equilibrio de estilos en {liga} este año, nadie se va a aburrir','Me gusta que haya de todo en el cartel, cada jornada va a ser distinta'],
    styleMid:['Bastantes {st}s en {liga} este año… ojalá no se haga repetitivo'],
    rep:['{n} lleva {k} años seguidos en {liga}, denle lugar a otros','Otra vez {n}… {k} temporadas seguidas, ya cansa','¿{n} de nuevo? Hay más gente aparte de {n}'],
    same:['Prácticamente el mismo cartel que el año pasado, qué flojera','{liga} repitiendo a {c} del año pasado. Renueven un poco'],
    nuevo:['¡Por fin {n} en FMS! Se lo merecía hace tiempo','{n} debuta en FMS, a ver cómo se adapta','Ojo con {n}, que viene con hambre'],
    top:['Cartelazo. Esto es nivel internacional','No hay relleno en este cartel, {liga} viene fuerte','El mejor line up de {liga} que recuerdo'],
    low:['No conozco a la mitad del cartel…','Line up flojito, la verdad. Esperaba más de {liga}','¿Esto es {liga} o una liga under?'],
    meh:['A ver qué tal {n} este año','{n}… bueno, puede dar la sorpresa','Curiosidad por ver a {n} en {liga}'],
    bomb:['BOMBAZO. {n} en {liga}','Nadie esperaba a {n} y aquí está','Con {n} ya tengo motivo para ver todas las jornadas'],
  },
};
/* ---- más variaciones de texto ---- */
(function(){
  const X={
    es:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Lo de {n} en {liga} es una alegría, de verdad','{n} dentro. Este año sí que me engancho','No me lo creo, {n} en el cartel. Temporadón','Que pongan a {n} el primero en el cartel, que se lo ha ganado'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de primeras no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Pues nada, con {n} ahí {liga} no la veo ni de coña','Este año {liga} se queda sin mi visita, con {n} no me apetece'],
      favF:['Me la suda que no sea mi liga, {n} en {liga} me lo veo','Por {n} me hago fan de {liga} este año','Ojo, que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿de verdad traéis a {n}? En fin','Fichajes de fuera los hay mejores: {f} sin ir más lejos. Lo de {n} no lo veo','Si queríais un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y yo vuelvo a ver FMS. Así de simple 🔥','Lo que me alegra ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, veremos si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, pinta interesante','No suelo seguir {liga}, pero el cartel tiene buena pinta','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde aquí le daré una oportunidad a {liga}'],
    },
    ar:{
      fav:['Ya tengo plan para cada fecha: mirar a {n}','Que esté {n} en {liga} es una alegría, posta','{n} adentro. Este año me engancho seguro','No lo puedo creer, {n} en el cartel. Temporadón','Pongan a {n} primero en el cartel, que se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le voy a dar una chance a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la miro ni en pedo','Este año {liga} sin mí, con {n} no me dan ganas'],
      favF:['No es mi liga, pero con {n} en {liga} la miro igual','Por {n} me hago hincha de {liga} este año','Ojo que está {n} en {liga}. La agendo'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, sin ir más lejos. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a mirar FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, suma experiencia'],
      retL:['Vuelve {n}. Bueno, veremos si sigue en forma'],
      otra:['Este año le voy a pegar una mirada a {liga}, pinta bien','No suelo mirar {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué onda','{liga} viene con cosas interesantes este año','Desde acá le voy a dar una chance a {liga}'],
    },
    mx:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Que esté {n} en {liga} me da gusto, neta','{n} adentro. Este año sí me engancho','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} hasta arriba del cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en lugar de {n}, la neta','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta del todo, pero {n} no me llena','Le daré chance a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni de broma','Este año {liga} sin mí, con {n} no se me antoja'],
      favF:['No es mi liga, pero con {n} en {liga} sí la veo','Por {n} me vuelvo fan de {liga} este año','Aguas que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿neta traen a {n}? Bueno','Hay mejores de fuera: {f}, por ejemplo. Lo de {n} no le entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Regresa {n} y regreso a ver FMS. Así de fácil 🔥','Qué gusto ver a {n} otra vez en un cartel'],
      retN:['Buen regreso el de {n}, aporta experiencia'],
      retL:['Regresa {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve interesante','No suelo ver {liga}, pero el cartel se ve chido','Curioso el line up de {liga}. A ver qué sale','{liga} trae cosas interesantes este año','Desde acá le daré chance a {liga}'],
    },
    cl:{
      fav:['Ya tengo panorama para cada fecha: ver a {n}','Que esté {n} en {liga} me tiene feliz','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón po','Pongan a {n} primero en el cartel, se lo ganó'],
      hate:['Respeto harto a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de entrada no me tinca'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni cagando','Este año {liga} sin mí, con {n} no me dan ganas'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me hago fan de {liga} este año','Ojo que está {n} en {liga}. Me la anoto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Ya','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo cacho','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Ya, veamos si sigue en forma'],
      otra:['Este año le pegaré una mirada a {liga}, se ve bacán','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré una oportunidad a {liga}'],
    },
    pe:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una alegría, causa','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} primero en el cartel, se lo ganó'],
      hate:['Respeto harto a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré chance a {n}, aunque de frente no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni de vainas','Este año {liga} sin mí, con {n} no provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me hago fan de {liga} este año','Ojo que está {n} en {liga}. Me la apunto pe'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Ya pe','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Ya, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve interesante','No veo mucho {liga}, pero el cartel está chévere','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré chance a {liga}'],
    },
    co:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una felicidad, parce','{n} adentro. Este año me engancho sí o sí','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} de primero en el cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré la oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo ni por el chiras','Este año {liga} sin mí, con {n} no me provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me vuelvo hincha de {liga} este año','Pilas que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de sencillo 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le pegaré una mirada a {liga}, se ve bacano','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde acá le daré la oportunidad a {liga}'],
    },
    car:{
      fav:['Ya tengo plan para cada fecha: ver a {n}','Que esté {n} en {liga} es una alegría, pana','{n} adentro. Este año me engancho seguro','No lo creo, {n} en el cartel. Temporadón','Pongan a {n} de primero en el cartel, se lo ganó'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en vez de {n}, la verdad','{n} tiene su público, pero yo no soy de ese grupo','No me disgusta tanto, pero {n} no me llena','Le daré la oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veo, pana','Este año {liga} sin mí, con {n} no provoca'],
      favF:['No es mi liga, pero con {n} en {liga} la veo igual','Por {n} me vuelvo fan de {liga} este año','Pendiente que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} libre, ¿en serio traen a {n}? Bueno','Hay mejores de afuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Bueno, a ver si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, se ve brutal','No veo mucho {liga}, pero el cartel está interesante','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Desde aquí le daré la oportunidad a {liga}'],
    },
    neu:{
      fav:['Ya tengo plan para cada jornada: ver a {n}','Que esté {n} en {liga} es una alegría','{n} dentro. Este año me engancho','No lo puedo creer, {n} en el cartel. Gran temporada','{n} merece estar arriba del cartel'],
      hate:['Respeto mucho a {n}, pero no es de mis favoritos para {liga}','Esperaba otro nombre en lugar de {n}','{n} tiene su público, pero yo no soy parte de él','No me disgusta del todo, pero {n} no me llena','Le daré una oportunidad a {n}, aunque de entrada no me convence'],
      hateF:['Con {n} en {liga} me ahorro esa liga este año','Con {n} ahí, {liga} no la veré','Este año {liga} sin mí, con {n} no me apetece'],
      favF:['No es mi liga, pero con {n} en {liga} la veré igual','Por {n} me hago seguidor de {liga} este año','Atentos, que está {n} en {liga}. Me la apunto'],
      swap:['Con {f} disponible, ¿de verdad traen a {n}?','Hay mejores opciones de fuera: {f}, por ejemplo. Lo de {n} no lo entiendo','Si querían un extranjero, {f}. No hacía falta {n}'],
      ret:['Vuelve {n} y vuelvo a ver FMS. Así de simple 🔥','Qué alegría ver a {n} otra vez en un cartel'],
      retN:['Buena vuelta la de {n}, aporta experiencia'],
      retL:['Vuelve {n}. Veremos si sigue en forma'],
      otra:['Este año le echaré un ojo a {liga}, pinta interesante','No suelo ver {liga}, pero el cartel tiene buena pinta','Curioso el line up de {liga}. A ver qué sale','{liga} viene con cosas interesantes este año','Le daré una oportunidad a {liga} esta temporada'],
    },
  };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
  const Y={
    es:{
      styleRep:['Demasiados {st}s juntos. Va a costar que cada jornada se sienta distinta','{c} {st}s… a la organización le encanta ese estilo, por lo visto'],
      styleOk:['Cartel con estilos para todos los gustos. Bien hecho','Por fin un line up equilibrado: cada batalla va a ser un mundo'],
      rep:['{n}, {k} temporadas seguidas en {liga}. Que se renueve un poco la cosa','Con todo el cariño a {n}, pero {k} años seguidos en {liga} ya son muchos'],
      same:['Cambian dos nombres y lo venden como cartel nuevo','El line up de {liga} es casi un copia y pega del año pasado'],
      nuevo:['Primera vez de {n} en FMS. Ganas de ver qué propone','{n} se estrena en FMS. Le tengo fe','Qué bonito ver a {n} debutar en FMS'],
      top:['Cartel de lujo en {liga}. Va a ser una temporada histórica','Esto parece un Internacional. Enhorabuena a {liga}'],
      low:['Cartel un poco flojo este año. Ojalá den la sorpresa','Le falta algún nombre grande a {liga}, la verdad'],
      meh:['{n} en {liga}. Ni fu ni fa, ya veremos','Tengo curiosidad por cómo le va a {n}','{n} puede ser la sorpresa del año, quién sabe','A {n} no lo conozco mucho, me miraré sus batallas'],
      bomb:['¡¿{n} en {liga}?! Esto no me lo esperaba','Pedazo de fichaje: {n} en {liga}'],
    },
    la:{
      styleRep:['Demasiados {st}s juntos. Va a costar que cada jornada se sienta distinta','{c} {st}s… a la organización le encanta ese estilo, por lo visto'],
      styleOk:['Cartel con estilos para todos los gustos. Bien hecho','Por fin un line up equilibrado: cada batalla va a ser distinta'],
      rep:['{n}, {k} temporadas seguidas en {liga}. Que se renueve un poco la cosa','Con todo el cariño a {n}, pero {k} años seguidos en {liga} ya son muchos'],
      same:['Cambian dos nombres y lo venden como cartel nuevo','El line up de {liga} es casi un copiar y pegar del año pasado'],
      nuevo:['Primera vez de {n} en FMS. Ganas de ver qué propone','{n} se estrena en FMS. Le tengo fe','Qué lindo ver a {n} debutar en FMS'],
      top:['Cartel de lujo en {liga}. Va a ser una temporada histórica','Esto parece un Internacional. Felicitaciones a {liga}'],
      low:['Cartel un poco flojo este año. Ojalá den la sorpresa','Le falta algún nombre grande a {liga}, la verdad'],
      meh:['{n} en {liga}. Ni fu ni fa, ya veremos','Tengo curiosidad por cómo le va a {n}','{n} puede ser la sorpresa del año, quién sabe','A {n} no lo conozco mucho, voy a ver sus batallas'],
      bomb:['¡¿{n} en {liga}?! Esto no me lo esperaba','Tremendo fichaje: {n} en {liga}'],
    },
  };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();
/* ---- todavía más variaciones ---- */
(function(){
  const Z={
    es:{ fav:['Me ha alegrado el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Ponedme a {n} todas las jornadas y soy feliz','Hay {n} en el cartel, ya no me pierdo ni una','Lo de {n} en {liga} es un acierto total'],
         hate:['{n} no es santo de mi devoción, pero le deseo suerte','Me habría gustado más otro perfil en lugar de {n}','No es lo que esperaba ver con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la verdad'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cruzo de liga sin problema','Este año sigo {liga} de reojo, que está {n}'],
         otra:['Le daré un vistazo a {liga} este año','Interesante lo que se viene en {liga}','Desde fuera, {liga} pinta bien'] },
    ar:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un golazo'],
         hate:['{n} no es de mis preferidos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la verdad'],
         hateF:['Con {n} en {liga} prefiero mirar otra cosa','{liga} este año la salteo, {n} no me engancha'],
         favF:['Por {n} me cruzo de liga sin drama','Este año miro {liga} de reojo, que está {n}'],
         otra:['Le voy a dar una mirada a {liga} este año','Interesante lo que se viene en {liga}','Desde afuera, {liga} pinta bien'] },
    mx:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es razón suficiente para seguir {liga} completita','Pónganme a {n} cada jornada y soy feliz','Está {n} en el cartel, no me pierdo ninguna','Lo de {n} en {liga} es un acierto, neta'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa, la neta'],
         hateF:['Con {n} en {liga} mejor veo otra cosa','{liga} este año me la salto, {n} no me late'],
         favF:['Por {n} me cambio de liga sin problema','Este año sigo {liga} de reojo, que está {n}'],
         otra:['Le daré una checada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bien'] },
    cl:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es razón suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una po','Lo de {n} en {liga} es un acierto total'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin drama','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le pegaré una mirada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bacán'] },
    pe:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y soy feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, causa'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin roche','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le echaré un ojo a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve chévere'] },
    co:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y quedo feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, parce'],
         hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
         hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
         favF:['Por {n} me cambio de liga sin problema','Este año veo {liga} de reojo, que está {n}'],
         otra:['Le pegaré una mirada a {liga} este año','Interesante lo que viene en {liga}','Desde acá, {liga} se ve bacano'] },
    car:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Pónganme a {n} todas las fechas y quedo feliz','Está {n} en el cartel, no me pierdo ni una','Lo de {n} en {liga} es un acierto, pana'],
          hate:['{n} no es de mis favoritos, pero le deseo suerte','Me hubiera gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
          hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año me la salto, {n} no me engancha'],
          favF:['Por {n} me cambio de liga sin problema','Este año veo {liga} de reojo, que está {n}'],
          otra:['Le echaré un ojo a {liga} este año','Interesante lo que viene en {liga}','Desde aquí, {liga} se ve brutal'] },
    neu:{ fav:['Me alegró el día ver a {n} en {liga}','{n} es motivo suficiente para seguir {liga} entera','Con {n} cada jornada soy feliz','Está {n} en el cartel, no me pierdo ninguna','Incluir a {n} en {liga} es un acierto total'],
          hate:['{n} no es de mis favoritos, pero le deseo suerte','Me habría gustado otro perfil en lugar de {n}','No es lo que esperaba con {n}, ojalá me sorprenda','{n} en {liga}… ni fu ni fa'],
          hateF:['Con {n} en {liga} prefiero ver otra cosa','{liga} este año no la seguiré, {n} no me engancha'],
          favF:['Por {n} me cambio de liga sin problema','Este año seguiré {liga} de reojo, que está {n}'],
          otra:['Le daré un vistazo a {liga} este año','Interesante lo que viene en {liga}','Desde fuera, {liga} pinta bien'] },
  };
  for(const d in Z) for(const c in Z[d]) TWD[d][c]=(TWD[d][c]||[]).concat(Z[d][c]);
  const Y={
    es:{ meh:['{n} llega con ganas, a ver qué tal le sale','Me genera curiosidad {n}, nada más','{n} en {liga}. Puede dar juego'], nuevo:['Bienvenido a FMS, {n}. A disfrutar','{n} se lo ha currado para llegar aquí'], rep:['¿Otra vez {n}? Que entre sangre nueva','{n} ya es parte del mobiliario de {liga}'],
         top:['Qué barbaridad de cartel en {liga}','Este line up de {liga} da miedo'], low:['Esperaba un cartel con más nombres','Faltan cabezas de cartel en {liga}'], styleOk:['Estilos de todo tipo en {liga}. Así da gusto'], bomb:['Notición: {n} en {liga}'],
         wsLow:['¿{n} en la World Series? Se supone que es la liga de las superestrellas','Con todo el respeto a {n}, pero la World Series debería ser solo para los más grandes','{n} en la World Series no me cuadra. Aquí tienen que estar los top','Esperaba una World Series de lujo y meten a {n}…'] },
    la:{ meh:['{n} llega con ganas, a ver qué tal le va','Me da curiosidad {n}, nada más','{n} en {liga}. Puede dar que hablar'], nuevo:['Bienvenido a FMS, {n}. A disfrutar','{n} se lo trabajó para llegar acá'], rep:['¿Otra vez {n}? Que entre sangre nueva','{n} ya es parte de los muebles de {liga}'],
         top:['Qué locura de cartel en {liga}','Este line up de {liga} da miedo'], low:['Esperaba un cartel con más nombres','Faltan cabezas de cartel en {liga}'], styleOk:['Estilos de todo tipo en {liga}. Así da gusto'], bomb:['Bombazo: {n} en {liga}'],
         wsLow:['¿{n} en la World Series? Se supone que es la liga de las superestrellas','Con todo respeto a {n}, pero la World Series debería ser solo para los más grandes','{n} en la World Series no me cierra. Acá tienen que estar los top','Esperaba una World Series de lujo y meten a {n}…'] },
  };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();
// cuentas oficiales de cada liga (despiden a quien se va a otra FMS)
function leagueAcc(k){ const d=ldef(k); return {handle:k, name:d.name, country:(d.countries&&d.countries[0])||null, verified:true, img:LOGOS[k]||null}; }
var TW_OFFICIAL={
  es:['Gracias por todo, @{h}. Mucha suerte en {liga} 🙏','Fue un honor tenerte en {prev}, @{h}. Te deseamos lo mejor en {liga}','Las puertas de {prev} siempre estarán abiertas para ti, @{h}. ¡A por todas en {liga}!'],
  la:['Gracias por todo, @{h}. Mucha suerte en {liga} 🙏','Fue un honor tenerte en {prev}, @{h}. Te deseamos lo mejor en {liga}','Las puertas de {prev} siempre van a estar abiertas, @{h}. ¡A romperla en {liga}!'],
  esC:['Nuestro campeón se va a {liga}. Cuidádnoslo bien 🏆','Os llevamos al campeón de {prev}, {liga}. Tratadlo como se merece 🏆','@{h}, campeón de {prev}, empieza una nueva etapa. {liga}, cuidad de nuestro campeón'],
  laC:['Nuestro campeón se va a {liga}. Cuídenlo mucho 🏆','Les mandamos al campeón de {prev}, {liga}. Trátenlo como se merece 🏆','@{h}, campeón de {prev}, empieza una nueva etapa. {liga}, cuiden a nuestro campeón'],
};

(function(){   // más variaciones para la revelación del line up
  const X={ es:{fav:['Ver a {n} en el cartel me ha dado la vida','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo estaba pidiendo a gritos'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No termino de verle a {n} en este cartel'], otra:['Echaré un ojo a {liga} de vez en cuando']},
    ar:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo venía pidiendo'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No lo termino de ver a {n} en este cartel'], otra:['Le voy a pegar una mirada a {liga} de vez en cuando']},
    mx:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}. Ya puedo dormir tranquilo','Por fin, {n}. Lo andaba pidiendo'], hate:['{n} no es lo que esperaba para {liga}, pero bueno','No lo termino de ver a {n} en este cartel'], otra:['Le daré una checada a {liga} de vez en cuando']},
    cl:{fav:['Ver a {n} en el cartel me alegró el día po','{n} confirmado en {liga}. Bacán'], hate:['{n} no es lo que esperaba para {liga}, pero ya'], otra:['Le pegaré una mirada a {liga} de repente']},
    pe:{fav:['Ver a {n} en el cartel me alegró el día, causa','{n} confirmado en {liga}. Chévere'], hate:['{n} no es lo que esperaba para {liga}, pero ya fue'], otra:['Le echaré un ojo a {liga} de vez en cuando']},
    co:{fav:['Ver a {n} en el cartel me alegró el día, parce','{n} confirmado en {liga}. Bacano'], hate:['{n} no es lo que esperaba para {liga}, pero bueno'], otra:['Le pegaré una mirada a {liga} de vez en cuando']},
    car:{fav:['Ver a {n} en el cartel me alegró el día, pana','{n} confirmado en {liga}. Brutal'], hate:['{n} no es lo que esperaba para {liga}, pero bueno'], otra:['Le echaré un ojo a {liga} de vez en cuando']},
    neu:{fav:['Ver a {n} en el cartel me alegró el día','{n} confirmado en {liga}'], hate:['{n} no es lo que esperaba para {liga}'], otra:['Seguiré {liga} de vez en cuando']} };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
  const Y={ es:{meh:['{n} tiene mucho que demostrar este año','Atentos a {n}, puede dar guerra'], top:['Cartel para enmarcar en {liga}'], low:['Le falta chispa al cartel de {liga}'], nuevo:['{n} llega a FMS. Que lo disfrute']},
            la:{meh:['{n} tiene mucho que demostrar este año','Atentos a {n}, puede dar pelea'], top:['Cartel para enmarcar en {liga}'], low:['Le falta chispa al cartel de {liga}'], nuevo:['{n} llega a FMS. Que lo disfrute']} };
  for(const d in Y) for(const c in Y[d]) TWG[d][c]=(TWG[d][c]||[]).concat(Y[d][c]);
})();

(function(){
  const X={ es:{miss:['¿Dónde está {f}? Sin {f} esto no es lo mismo','¿Por qué no habéis metido a {f}? No lo entiendo','Echo muchísimo de menos a {f} en {liga}','Un cartel de {liga} sin {f}… algo falla','{f} fuera de {liga}. Me niego'], missVs:['¿En serio está {n} y no {f}?','Meten a {n} y dejan fuera a {f}. No hay quien lo entienda','{n} dentro y {f} fuera. No lo entiendo, de verdad']},
    ar:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no metieron a {f}? No lo entiendo','Lo extraño un montón a {f} en {liga}','Un cartel de {liga} sin {f}… algo anda mal'], missVs:['¿En serio está {n} y no {f}?','Meten a {n} y dejan afuera a {f}. Cualquiera','{n} adentro y {f} afuera. No lo entiendo, posta']},
    mx:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no metieron a {f}? No le entiendo','Extraño un buen a {f} en {liga}','Un cartel de {liga} sin {f}… algo anda mal'], missVs:['¿Neta está {n} y no {f}?','Meten a {n} y dejan fuera a {f}. No manches','{n} adentro y {f} afuera. No le entiendo']},
    cl:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo po','¿Por qué no metieron a {f}? No cacho'], missVs:['¿En serio está {n} y no {f}, weón?','{n} adentro y {f} afuera. No cacho']},
    pe:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, causa','¿Por qué no metieron a {f}? No entiendo'], missVs:['¿En serio está {n} y no {f}?','{n} adentro y {f} afuera. No entiendo, causa']},
    co:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, parce','¿Por qué no metieron a {f}? No entiendo'], missVs:['¿En serio está {n} y no {f}, parce?','{n} adentro y {f} afuera. No entiendo']},
    car:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo, pana','¿Por qué no metieron a {f}?'], missVs:['¿En serio está {n} y no {f}?','{n} adentro y {f} afuera. No entiendo esa vaina']},
    neu:{miss:['¿Dónde está {f}? Sin {f} no es lo mismo','¿Por qué no incluyeron a {f}?'], missVs:['¿En serio está {n} y no {f}?','{n} dentro y {f} fuera. No lo entiendo']} };
  for(const d in X) for(const c in X[d]) TWD[d][c]=(TWD[d][c]||[]).concat(X[d][c]);
})();
var TW_NEWS = [
  {handle:'McNoticiasFree', name:'McNoticias', country:null, verified:false, img:'tw_mcn', special:'mcn'},
  {handle:'InfoFreestyle2', name:'Info Freestyle', country:null, verified:true, img:'tw_info', special:'info'},
];
var RQ_TRUE=['Navas','Alek','Segrelles','Ander2K','Fabiuki','Ortega','Coloso','Triple R'];   // los RQ de verdad
var RQ_CREW=[...RQ_TRUE,'Chuty','Mr. Ego','Arkano','Bnet','MP','HDR','Mowlihawk','Teorema','Zasko'];   // a todos estos los apoya
var GZ_CREW=['Dani VK','JM Serna','Dima'];   // el Elegido de Gazir
var PATRON_TX={
  quesadaLU:['Mucho éxito a {n} en {liga}. Orgullo 🔥','{n} dentro de {liga}. A por todas 🔥','Qué alegría ver a {n} en el cartel. Va a dar guerra 🔥','{n}, a romperla en {liga} 🔥','Vamos {n}, este año es el tuyo 🔥','Toda la fuerza para {n} esta temporada 🔥'],
  quesadaJ:['Vamos {n}, a por {o} 🔥','Fuerza {n}. Esta jornada es tuya 🔥','{n} contra {o}. Todo mi apoyo 🔥','A muerte con {n} 🔥','Confío en ti, {n}. A por la victoria 🔥'],
  gazirLU:['Orgulloso de ti, @{h}. A comerte {liga}','@{h} en {liga}. Lo que te has currado para llegar aquí. A por todas','Vamos @{h}. Este año es tuyo','@{h}, a demostrar lo que vales. Te quiero ver arriba'],
  gazirJ:['A por todas, @{h}. Contra {o} toca ganar','Vamos @{h}, hoy toca darlo todo','Confío en ti, @{h}. A por {o}','@{h}, sal a disfrutar y a ganar'],
  quesadaBoth:['Batalla de RQs 🔥','Batalla de RQs 🔥 {a} vs {b}, gane quien gane, gano yo','{a} vs {b}. Batalla de RQs 🔥🔥','Hoy hay batalla de RQs: {a} contra {b} 🔥'],
  gazirBoth:['Mis dos chavales, batallón del Elegido. @{a} vs @{b}','@{a} contra @{b}. Mis dos chavales cara a cara: batallón del Elegido asegurado','Batallón del Elegido: @{a} vs @{b}. Que gane el mejor, os quiero a los dos'],
  gazirCH:['¡Mi chaval! @{h} {cw} de {liga}. Orgullo máximo 🏆','Lo sabía. @{h} campeón de {liga}. Te lo mereces todo 🏆','Qué orgullo, @{h}. {cw} de {liga} 🏆'],
};
var TW_COLOR={'España':'#E67E22','Argentina':'#00B8D4','Chile':'#1A3FA0','Perú':'#E53935','México':'#2E7D32','Colombia':'#FFC107','Uruguay':'#8EC5F5','Bolivia':'#7CB342','Ecuador':'#F9A825','Paraguay':'#C62828','EEUU':'#7E57C2'};
function twColor(c){ if(!c) return '#ffffff'; if(TW_COLOR[c]) return TW_COLOR[c]; const car=LEAGUES.find(l=>l.key==='fms_caribe'); return car && car.countries.includes(c) ? '#00A8A2' : '#9a9aa6'; }
var FLAG_ISO={'España':'ES','Argentina':'AR','México':'MX','Chile':'CL','Perú':'PE','Colombia':'CO','Venezuela':'VE','Cuba':'CU','Puerto Rico':'PR','República Dominicana':'DO','Panamá':'PA','Costa Rica':'CR','Guatemala':'GT','Honduras':'HN','El Salvador':'SV','Nicaragua':'NI','EEUU':'US','Uruguay':'UY','Bolivia':'BO','Ecuador':'EC','Paraguay':'PY','Brasil':'BR','Francia':'FR','Italia':'IT','Portugal':'PT'};
function flagOf(c){ const iso=FLAG_ISO[c]; if(!iso) return '🌎'; return String.fromCodePoint(...[...iso].map(ch=>0x1F1E6+ch.charCodeAt(0)-65)); }
function leagueFlag(k){ if(k===INTL.key || isWS(k)) return '🌎'; if(k==='fms_caribe') return '🌴'; const d=ldef(k); return flagOf(d.countries[0]); }
function twHandle(name){ return nrm(name).replace(/[^a-z0-9_]/g,''); }
// emojis como imagen (se ven igual en PC y sin internet): banderas y fuego
function emoHtml(html){
  return html.replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, m=>{ const iso=[...m].map(c=>String.fromCharCode(c.codePointAt(0)-0x1F1E6+65)).join(''); const im=EXTRA_IMG['emo_'+iso];
      return im ? `<img class="emo" src="${im}" alt="${iso}">` : `<span class="emo-code">${iso}</span>`; })
    .replace(/🆚/gu, ()=> EXTRA_IMG.emo_vs ? `<img class="emo" src="${EXTRA_IMG.emo_vs}" alt="vs">` : 'vs')
    .replace(/🏆/gu, ()=> EXTRA_IMG.emo_trophy ? `<img class="emo" src="${EXTRA_IMG.emo_trophy}" alt="trofeo">` : '🏆')
    .replace(/🔥/gu, ()=> EXTRA_IMG.emo_fire ? `<img class="emo" src="${EXTRA_IMG.emo_fire}" alt="fuego">` : '🔥');
}
function twAcc(t){ return {...t, img: t.img==='@quesada' ? (STREAMERS.quesada && STREAMERS.quesada.photo) : (t.img ? (EXTRA_IMG[t.img]||t.img) : null)}; }
var TW_GO={
  es:['Este año voy a por todas. Nos vemos en {liga} 🔥','Preparado para {liga}. Esta temporada no se me escapa','Vengo a ganarlo todo, tío. A muerte con esto','Qué ganas de volver a pisar el escenario. A darlo todo en {liga}'],
  ar:['Vamos con todo esta temporada, loco. {liga}, prepárense','Este año la rompo, ni lo duden','Re manija de arrancar {liga}. Vamos por todo','Se viene una temporada zarpada. A dejar todo en el escenario'],
  mx:['Este año va con todo, carnal. {liga}, nos vemos','Qué chido estar en {liga}. A darle con todo','Vamos a romperla esta temporada, no hay de otra','Bien emocionado por {liga}, ahí nos vemos, raza'],
  cl:['Este año voy con too, weón. Se viene {liga}','Bacán estar en {liga}. A darlo todo po','Se viene la temporada, vamos con todo, cachai'],
  pe:['Este año voy con todo, causa. Se viene {liga}','Chévere estar en {liga}. A romperla pe'],
  co:['Qué chimba estar en {liga}, parce. Vamos con toda','Este año va con toda, parcero. Nos vemos en {liga}'],
  car:['Brutal estar en {liga}. Vamos con todo, pana','Este año vengo con todo. Nos vemos en {liga}'],
  neu:['Listo para {liga}. Vamos con todo esta temporada','A darlo todo este año en {liga}','Agradecido de estar en {liga}. Vamos por el título'],
};
(function(){
  const G2={es:['Nueva temporada, nuevas ganas. A por {liga}','Toca demostrar por qué estoy aquí. Nos vemos en {liga}'],ar:['Nueva temporada, mismas ganas de siempre. Vamos {liga}','A demostrar por qué estoy acá. Nos vemos en {liga}'],mx:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy aquí, raza. Nos vemos en {liga}'],cl:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy acá po'],pe:['Nueva temporada, mismas ganas. Vamos {liga}','A demostrar por qué estoy acá, causa'],co:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy acá, parce'],car:['Nueva temporada, las mismas ganas. Vamos {liga}','A demostrar por qué estoy aquí, pana'],neu:['Nueva temporada, nuevas metas. Vamos {liga}','A demostrar por qué estoy aquí']};
  for(const d in G2) TW_GO[d]=(TW_GO[d]||[]).concat(G2[d]);
})();
var TW_LUCK={   // 10 variantes: 0-5 compañeros de la liga anterior, 6-9 bienvenida desde el nuevo line up
  es:['Mucha suerte en {liga}, @{h}. Se te va a echar de menos en {prev}','A romperla en {liga}, hermano. Ha sido un placer compartir temporada contigo','{n} se va a {liga} y se lleva todo su nivel. Suerte, máquina','Suerte en la nueva etapa, @{h}. Allí también vas a dejar huella','Que te vaya muy bien en {liga}, crack. Nos vemos en el Internacional','Gran compañero en {prev}. Ahora a demostrarlo en {liga}. ¡Suerte!',
      'Bienvenido a {liga}, @{h}. Va a ser un placer compartir cartel contigo','Qué nivel suma {liga} con {n}. Bienvenido, hermano','¡Bienvenido, @{h}! Nos vemos en el escenario','Llega {n} a {liga}. Bienvenido, aunque en la tarima no habrá amistad'],
  la:['Mucha suerte en {liga}, @{h}. Te vamos a extrañar en {prev}','A romperla en {liga}, hermano. Fue un placer compartir temporada con vos','{n} se va a {liga} y se lleva todo su nivel. Suerte, crack','Suerte en la nueva etapa, @{h}. Allá también vas a dejar huella','Que te vaya muy bien en {liga}. Nos vemos en el Internacional','Gran compañero en {prev}. Ahora a demostrarlo en {liga}. ¡Suerte!',
      'Bienvenido a {liga}, @{h}. Va a ser un placer compartir cartel','Qué nivel suma {liga} con {n}. Bienvenido, hermano','¡Bienvenido, @{h}! Nos vemos en el escenario','Llega {n} a {liga}. Bienvenido, aunque en la tarima no hay amistad'],
};
function luPrevLeague(s, id, k){ const o=state.seasons[state.seasons.length-2]; if(!o) return null;
  if(isWS(k) || k===INTL.key) return null; const k2=(o.activeKeys||[]).find(x=>x!==k && !isWS(x) && o.leagues[x] && (o.leagues[x].competitors||[]).includes(id)); return k2? {k:k2, mates:o.leagues[k2].competitors.filter(x=>x!==id)} : null; }
function luSeasonsOut(id){   // temporadas seguidas fuera de cualquier FMS antes de la actual (null si nunca estuvo)
  const S=state.seasons; for(let i=S.length-2;i>=0;i--){ const o=S[i]; if((o.activeKeys||[]).some(k=>o.leagues[k] && (o.leagues[k].competitors||[]).includes(id))) return S.length-2-i; } return null; }
function luGenerate(s, k){
  const isI=k===INTL.key; const L=isI? s.intl : s.leagues[k]; const ids=isI? intlQualifiers(s).ids.slice() : L.competitors.slice(); const liga=ldef(k).name;
  const order=shuffle(ids).sort((a,b)=>fby(a).fama-fby(b).fama);   // de menos a más famoso: el bombazo al final
  const at=id=>order.indexOf(id); const END=order.length;
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc);
  const accs=shuffle(real); const inLU={}; ids.forEach(id=>inLU[nrm(fname(id))]=id);
  const lc = (isI || isWS(k)) ? null : ldef(k).countries;
  const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const tw=[]; const add=(acc, text, sent, a, extra)=>{ tw.push(Object.assign({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at:a, likes:Math.round(Math.pow(Math.random(),2)*4000)+rint(3,60), rts:rint(0,400), cm:rint(0,90)}, extra||{})); return tw[tw.length-1]; };
  const asComp=id=>{ const f=fby(id); return {handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const D=(a,cat)=>{ const d=TWD[twDia(a.country)]||TWD.neu; return pk(d[cat]||TWD.neu[cat]); };
  const G=(a,cat)=>pk(TWG[twDia(a&&a.country)==='es'?'es':'la'][cat]);
  const fans={}; real.forEach(a=>(a.fav||[]).forEach(n=>{ const id=inLU[nrm(n)]; if(id) fans[id]=(fans[id]||0)+1; }));
  const cap=id=>{ const n=fans[id]||0; return n>=10?5:(n>=7?4:(n>=4?3:(n>=2?2:1))); };
  const per={}; const used=new Set();
  const back=new Set(state.seasons.length>1 ? ids.filter(id=>{ const o=luSeasonsOut(id); return o!=null && o>2; }) : []);
  // 1) tuiteros: sobre todo su liga; en otras, si entran sus favoritos o los que no les gustan
  const personal=[], otras=[];
  accs.forEach(a=>{
    const fv=(a.fav||[]).map(n=>inLU[nrm(n)]).filter(Boolean), ht=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(Boolean);
    const local=isLocal(a), neutral=!a.country; const opts=[];
    if(!fv.length && !ht.length){ if(!local && Math.random()<(neutral?0.07:0.05)) otras.push(a); return; }
    fv.forEach(id=>{ if(back.has(id)) opts.push({cat:'ret', id, sent:2, w:5}); else opts.push({cat: local||neutral ? 'fav' : 'favF', id, sent:1, w:1}); });
    ht.forEach(id=>{ const f=fby(id);
      if(local && lc && !lc.includes(f.country)){ const alt=(a.fav||[]).filter(n=>!inLU[nrm(n)] && state.freestylers.some(x=>nrm(x.name)===nrm(n))); if(alt.length){ opts.push({cat:'swap', id, alt:pick(alt), sent:-1, w:1.3}); return; } }
      opts.push({cat: local||neutral ? 'hate' : 'hateF', id, sent:-1, w:1}); });
    const p = opts.some(o=>o.cat==='ret') ? 1 : (local ? 1 : (neutral ? 0.6 : 0.45)); if(Math.random()>p) return;
    const ok=opts.filter(o=>(per[o.id]||0)<cap(o.id) || o.cat==='ret'); if(!ok.length) return;
    let r=Math.random()*ok.reduce((x,o)=>x+o.w,0), o=ok[0]; for(const c of ok){ r-=c.w; if(r<=0){ o=c; break; } }
    per[o.id]=(per[o.id]||0)+1; personal.push({a, o});
  });
  const rets=personal.filter(x=>x.o.cat==='ret').slice(0,4), rest=shuffle(personal.filter(x=>x.o.cat!=='ret')).sort((x,y)=>isLocal(y.a)-isLocal(x.a)).slice(0,12);
  [...rets, ...rest].forEach(({a,o})=>{ used.add(a.handle); add(a, fill(D(a,o.cat),{n:fname(o.id), liga, f:o.alt}), o.sent, at(o.id), {fid:o.id}); });
  const free=(pref)=>{ const pool=accs.filter(x=>!used.has(x.handle)); const loc=pool.filter(isLocal); const a=(pref!==false && loc.length && Math.random()<0.8 ? pick(loc) : pick(pool.length?pool:accs)); used.add(a.handle); return a; };
  // extranjeros sin favoritos en el cartel: a veces también opinan
  shuffle(otras).filter(a=>!used.has(a.handle)).slice(0,2).forEach(a=>{ used.add(a.handle); add(a, fill(D(a,'otra'),{liga}), 0, END); });
  // vuelve tras más de 2 temporadas fuera y nadie es fan: alegría y algo de indiferencia
  back.forEach(id=>{ if(tw.some(t=>t.fid===id)) return; { const a=free(); add(a, fill(D(a,'retN'),{n:fname(id),liga}), 1, at(id), {fid:id}); } if(Math.random()<0.6){ const a=free(); add(a, fill(D(a,'retL'),{n:fname(id),liga}), 0, at(id)); } });
  // ¿dónde está mi favorito? (favoritos de su país que no están en su liga nacional)
  if(lc){ let nm=0; const signedNow=new Set(s.activeKeys.flatMap(x=>(s.leagues[x]&&s.leagues[x].competitors)||[]));
    accs.filter(a=>isLocal(a) && !used.has(a.handle)).forEach(a=>{ if(nm>=3) return;
      const miss=(a.fav||[]).map(n=>state.freestylers.find(z=>nrm(z.name)===nrm(n))).filter(z=>z && lc.includes(z.country) && !inLU[nrm(z.name)] && !signedNow.has(z.id));
      if(!miss.length || Math.random()>0.45) return; const f=pick(miss); const ht=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(Boolean);
      used.add(a.handle); nm++;
      if(ht.length && Math.random()<0.6){ const id=pick(ht); add(a, fill(D(a,'missVs'),{n:fname(id), f:f.name, liga}), -1, at(id)); }
      else add(a, fill(D(a,'miss'),{f:f.name, liga}), -1, END); }); }
  // Internacional: polémica con los locales que no gustan
  if(isI && s.intl.sede){ let ni=0; const sd=s.intl.sede;
    accs.filter(a=>!used.has(a.handle)).forEach(a=>{ if(ni>=3) return; const loc=(a.hate||[]).map(n=>inLU[nrm(n)]).filter(id=>id && fby(id).country===sd);
      if(!loc.length || Math.random()>0.7) return; const id=pick(loc); used.add(a.handle); ni++;
      add(a, fill(pk(TWI[twDia(a.country)==='es'?'es':'la'].luLocal),{n:fname(id), sede:sd}), -1, at(id), {fid:id}); }); }
  // 2) Rodrigo Quesada
  const sv=styleVariety(ids);
  { const Q=TWITTEROS.find(t=>t.special==='quesada');
    if(Q){ const q=twAcc(Q); const crew=ids.filter(id=>RQ_CREW.some(n=>nrm(n)===nrm(fname(id))));
      crew.forEach(id=>add(q, fill(pk(PATRON_TX.quesadaLU),{n:fname(id),liga}), 1, at(id), {fid:id}));
      if(sv.n>=6 && !sv.rep.length) add(q, fill(pick(['Esto es un cartel variado 🔥','Variedad de estilos en {liga}. Así sí 🔥','Hay de todo en este line up. Me gusta 🔥🔥']),{liga}), 1, END); } }
  // Gazir anima a los suyos
  { const gz=state.freestylers.find(f=>f.name==='Gazir'); if(gz){ const ga={handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)};
      ids.filter(id=>GZ_CREW.some(n=>nrm(n)===nrm(fname(id)))).forEach(id=>add(ga, fill(pk(PATRON_TX.gazirLU),{h:twHandle(fname(id)), liga}), 1, at(id), {fid:id})); } }
  // 3) competidores: 2-3 tuits (bienvenidas a fichajes de otra liga o "voy a por todo")
  if(!isI){ let budget=rint(2,3);
    const moved=shuffle(ids.map(id=>({id, p:luPrevLeague(s,id,k)})).filter(x=>x.p));
    moved.slice(0,2).forEach(mv=>{ const f=fby(mv.id); const pk=mv.p.k, prev=ldef(pk).name; const acc=leagueAcc(pk); const es=twDia(acc.country)==='es';
      const o=state.seasons[state.seasons.length-2]; const champ=o && o.leagues[pk] && (o.leagues[pk].finalStandings||[])[0]===mv.id;
      add(acc, fill(pick(TW_OFFICIAL[(es?'es':'la')+(champ?'C':'')]),{liga, prev, n:f.name, h:twHandle(f.name)}), champ?1:0, at(mv.id)); });
    if(moved.length){ const mv=moved[0]; const f=fby(mv.id); const prev=ldef(mv.p.k).name;
      const mates=shuffle(mv.p.mates.filter(x=>fby(x) && !isRival(x,mv.id))).map(x=>({id:x, nw:false}));
      const now=shuffle(ids.filter(x=>x!==mv.id && !isRival(x,mv.id))).map(x=>({id:x, nw:true}));
      const senders=[]; while(senders.length<budget && (mates.length||now.length)){ const useNow = !mates.length || (now.length && !senders.some(x=>x.nw) && Math.random()<0.4); senders.push(useNow?now.shift():mates.shift()); }
      senders.forEach(x=>{ const vi = x.nw ? rint(6,9) : rint(0,5); const set=TW_LUCK[twDia(fby(x.id).country)==='es'?'es':'la']; add(asComp(x.id), fill(set[vi],{liga, prev, n:f.name, h:twHandle(f.name)}), 0, at(mv.id)); });
      budget=0; }
    shuffle(ids).slice(0,budget).forEach(id=>{ const f=fby(id); add(asComp(id), fill(pk(TW_GO[twDia(f.country)]||TW_GO.neu),{liga}), 0, at(id)); }); }
  // World Series: liga de superestrellas, se quejan si entra alguien con poca fama
  if(isWS(k)) shuffle(ids.filter(id=>fby(id).fama<76)).slice(0,2).forEach(id=>{ const a=free(false); add(a, fill(G(a,'wsLow'),{n:fname(id),liga}), -1, at(id), {fid:id}); });
  // 4) temas generales: los comenta gente de la liga
  if(sv.rep.length) sv.rep.forEach(st=>{ const a=free(); add(a, fill(G(a,'styleRep'),{c:sv.counts[st],st,liga}), -2, END); });
  else if(sv.n>=6){ const sts=shuffle(Object.keys(sv.counts)); const a=free(); add(a, fill(G(a,'styleOk'),{st1:sts[0],st2:sts[1],st3:sts[2],liga}), 1, END); }
  else if(sv.max>=3){ const st=Object.keys(sv.counts).find(x=>sv.counts[x]===sv.max); const a=free(); add(a, fill(G(a,'styleMid'),{st,liga}), 0, END); }
  const reps=ids.map(id=>({id, k:luStreak(s,k,id)+1})).filter(x=>x.k>=3).sort((a,b)=>b.k-a.k);
  reps.slice(0,3).forEach(x=>{ const a=free(); add(a, fill(G(a,'rep'),{n:fname(x.id),k:x.k,liga}), -1, at(x.id)); });
  const lastYear=ids.filter(id=>luStreak(s,k,id)>=1).length;
  if(lastYear>=6){ const a=free(); add(a, fill(G(a,'same'),{c:lastYear,liga}), -2, END); }
  const nuevos=state.seasons.length>1 ? ids.filter(id=>!luEverIn(s,id)) : [];
  shuffle(nuevos).slice(0,2).forEach(id=>{ const a=free(); add(a, fill(G(a,'nuevo'),{n:fname(id),liga}), 1, at(id)); });
  const af=avgFama(ids);
  { const big=order.slice().reverse().filter(id=>fby(id).fama>=86 && !tw.some(t=>t.fid===id)); if(big.length){ const id=big[0]; const a=free(); add(a, fill(G(a,'bomb'),{n:fname(id),liga}), 1, at(id), {fid:id}); } }
  const quiet=shuffle(order.filter(id=>!tw.some(t=>t.fid===id)));
  while(tw.length<12 && quiet.length){ const id=quiet.shift(); if(fby(id).fama>=80) continue; const a=free(); add(a, fill(G(a,'meh'),{n:fname(id),liga}), 0, at(id)); }
  if(af>=78){ const a=free(); add(a, fill(G(a,'top'),{liga}), 2, END); } else if(af<58){ const a=free(); add(a, fill(G(a,'low'),{liga}), -1, END); }
  // 5) cuenta de noticias con el cartel completo (McNoticias o Info Freestyle, nunca las dos)
  { const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; const lf=leagueFlag(k); const dname=liga.toUpperCase();
    const local=id=> !isI && !isWS(k) && ldef(k).countries.includes(fby(id).country);
    const tag=nrm(liga.replace(/^FMS\s*/i,'')).replace(/[^a-z0-9]/g,'');
    let text;
    if(nw.special==='mcn') text=`🚨 ${dname} ${s.year} ${lf} 🚨\n\n${shuffle(ids).map(id=>`${flagOf(fby(id).country)} ${fname(id).toUpperCase()}`).join('\n')}\n\n#fms${tag}${isI?'':' #fmsinternacional'}`;
    else { const T2=x=>x.charAt(0).toUpperCase()+x.slice(1); text=`¡Temporada ${s.year} - ${liga} ${lf}!\n\n${shuffle(ids).map(id=>`- ${nrm(fname(id)).toUpperCase()}${local(id)?'':' '+flagOf(fby(id).country)}`).join('\n')}\n\n#FMS${T2(tag)} ${lf}`; }
    add(acc, text, 0, END+1, {news:true}); }
  tw.sort((a,b)=>a.at-b.at || Math.random()-0.5);
  // efecto: hype de la liga y de los mencionados
  const S=tw.reduce((a,t)=>a+t.sent,0); const delta=clamp(Math.round(S*1.5),-12,12);
  if(!isI) L.hype=clamp(L.hype+delta,5,100);
  tw.forEach(t=>{ if(t.fid) addHype(t.fid, t.sent>0?1.5:-1.5); });
  reps.forEach(x=>addHype(x.id,-1));
  L.lu={order, tweets:tw, delta, shown:false};
  addLog(s, s.day, `📣 Revelación del line up de ${liga}: ${delta>0?'la comunidad lo celebra':(delta<0?'la comunidad se queja':'opiniones divididas')} (${isI?(delta>=0?'+':'')+delta+'% de visitas':(delta>=0?'+':'')+delta+' de hype'}).`, delta>0?'good':(delta<0?'bad':''));
}
var TW_ICON={
  ver:'<svg class="tw-ver" viewBox="0 0 24 24" aria-label="Verificado"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34z"/><path fill="#fff" d="M10.54 16.2 6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36z"/></svg>',
  cm:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M1.75 10c0-4.42 3.58-8 8-8h4.37c4.42 0 8.13 3.58 8.13 8 0 4.42-3.58 8-8 8H14l-5.5 3.5V18h-.88c-3.6 0-5.87-3.3-5.87-8zm8-6c-3.31 0-6 2.69-6 6 0 3.03 1.78 6 3.88 6h2.37v1.82L13.4 16h.85c3.31 0 6-2.69 6-6s-2.79-6-6.13-6z"/></svg>',
  rt:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.5 3.88l4.43 4.14-1.36 1.46L5.5 7.55V16c0 1.1.9 2 2 2H13v2H7.5c-2.21 0-4-1.79-4-4V7.55L1.43 9.48.07 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.21 0 4 1.79 4 4v8.45l2.07-1.93 1.36 1.46-4.43 4.14-4.43-4.14 1.36-1.46 2.07 1.93V8c0-1.1-.9-2-2-2z"/></svg>',
  lk:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.7 3.5c-1.8 0-3.5.9-4.7 2.4C10.8 4.4 9.1 3.5 7.3 3.5 4 3.5 1.75 6 1.75 9.2c0 5.5 7.7 10.4 10.25 11.8 2.55-1.4 10.25-6.3 10.25-11.8C22.25 6 20 3.5 16.7 3.5zm-4.7 15.2C9.3 17.1 3.75 13.2 3.75 9.2 3.75 7.1 5.2 5.5 7.3 5.5c1.5 0 2.9 1 3.6 2.4h2.2c.7-1.4 2.1-2.4 3.6-2.4 2.1 0 3.55 1.6 3.55 3.7 0 4-5.55 7.9-8.25 9.5z"/></svg>',
};
function twImgFor(t){ if(t.img) return t.img;
  const a=TWITTEROS.find(x=>x.handle===t.h); if(a) return twAcc(a).img; const n=TW_NEWS.find(x=>x.handle===t.h); if(n) return EXTRA_IMG[n.img]||null;
  if(LOGOS[t.h]) return LOGOS[t.h]; const f=state.freestylers.find(x=>twHandle(x.name)===t.h); return f ? photoOf(f) : null; }
function luTweetHtml(t){
  t.img=twImgFor(t);
  const av = t.img ? `<img src="${t.img}" alt="">` : esc((t.n||t.h)[0].toUpperCase());
  const hue=[...t.h].reduce((a,c)=>a+c.charCodeAt(0),0)%360;
  const txt=esc(t.text).replace(/(^|\s)(@[A-Za-z0-9_]+)/g,'$1<span class="tw-at">$2</span>').replace(/(^|\s)(#[A-Za-z0-9_]+)/g,'$1<span class="tw-at">$2</span>');
  const txtE=emoHtml(txt), nmE=emoHtml(esc(t.n));
  return `<div class="tw" style="--twc:${twColor(t.c)}"><div class="tw-av" style="background:hsl(${hue} 45% 38%)">${av}</div><div class="tw-body">
    <div class="tw-head"><b>${nmE}</b>${t.v?TW_ICON.ver:''}<span>@${esc(t.h)} · ${(t.min||(t.min=rint(1,59)))} min</span></div><div class="tw-txt">${txtE}</div>
    <div class="tw-foot"><span>${TW_ICON.cm} ${t.cm!=null?t.cm:rint(0,90)}</span><span>${TW_ICON.rt} ${t.rts}</span><span>${TW_ICON.lk} ${t.likes.toLocaleString('es-ES')}</span></div></div></div>`;
}

var LU_ANIM=null;
function openLineup(key){
  const s=cur(); const isI=key===INTL.key; const L=isI? s.intl : s.leagues[key]; if(!L || !L.lu) return; document.body.classList.add('noscroll'); const lu=L.lu; const replay=lu.shown; lu.shown=true; save();
  const def=ldef(key); const tok={}; LU_ANIM=tok;
  const cards=lu.order.map((id,i)=>{ const f=fby(id); return `<div class="lu-card" id="luc${i}"><div class="lu-ph" style="${avatarDivStyle(f)}">${avatarContent(f)}</div><div class="lu-nm">${fnameH(id)}</div><div class="lu-mt"><span>${esc(f.country)}</span>${styleTag(f)}</div></div>`; }).join('');
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} Line up · ${esc(def.name)} ${s.year}</h3>
    <div class="lu-wrap"><div class="lu-grid ${lu.order.length>10?'c4':''}">${cards}</div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(def.short||def.name).replace(/\s+/g,'')}LineUp</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="lu-res" id="luRes"></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="luSkip()">Revelar todo</button><button class="btn primary" onclick="LU_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed');
  const showTw=i=>{ const t=lu.tweets[i]; if(!t || !feed) return; feed.insertAdjacentHTML('afterbegin', luTweetHtml(t)); };
  let ti=0; const step=(i)=>{ if(LU_ANIM!==tok) return;
    if(i<lu.order.length){ const c=document.getElementById('luc'+i); if(c) c.classList.add('on');
      let k=0; while(ti<lu.tweets.length && lu.tweets[ti].at<=i){ const idx=ti++; setTimeout(()=>{ if(LU_ANIM===tok) showTw(idx); }, 350+k*420); k++; }
      setTimeout(()=>step(i+1), 650+k*420); }
    else { let k=0; while(ti<lu.tweets.length){ const idx=ti++; setTimeout(()=>{ if(LU_ANIM===tok) showTw(idx); }, 300+k*450); k++; }
      setTimeout(()=>{ if(LU_ANIM===tok) luResult(lu, isI); }, 500+k*450); } };
  window.luSkip=()=>{ LU_ANIM=null; lu.order.forEach((id,i)=>{ const c=document.getElementById('luc'+i); if(c) c.classList.add('on'); });
    if(feed){ feed.innerHTML=''; lu.tweets.forEach((t,i)=>showTw(i)); } luResult(lu, isI); };
  if(replay) window.luSkip(); else setTimeout(()=>step(0), 400);
}
function luResult(lu, isI){
  const r=document.getElementById('luRes'); if(!r) return; const d=lu.delta;
  r.innerHTML=emoHtml(`<span class="lu-verdict ${d>0?'pos':(d<0?'neg':'')}">${d>=6?'🔥 La comunidad está encantada':(d>0?'👍 Buena acogida':(d===0?'🤷 Opiniones divididas':(d>-6?'👎 Hay quejas':'💢 La comunidad está indignada')))}</span> ${isI?'Visitas del Internacional':'Hype de la liga'} <b>${d>=0?'+':''}${d}${isI?'%':''}</b>`);
  const b=document.getElementById('luSkip'); if(b) b.disabled=true;
}

/* ---- tutorial tras la primera competición Under ---- */
function underTutQueue(key, winners){
  const c=state.company; if(!c) return; if(!c.tut) c.tut={}; if(c.tut.under) return;
  c.tut.under=true; state.ui.tutQ={t:'under', key, ids:winners.slice()};
}
function tutTick(){
  const q=state.ui && state.ui.tutQ; if(!q) return;
  setTimeout(()=>{ const q=state.ui.tutQ; if(!q) return;
    const mr=document.getElementById('modalRoot'), rs=document.getElementById('rbShow'), ce=document.getElementById('celeb');
    if((mr && mr.innerHTML) || (rs && rs.innerHTML) || (ce && ce.innerHTML) || (typeof SHOW!=='undefined' && SHOW)) return;
    state.ui.tutQ=null; showUnderTut(q); }, 250);
}
function showUnderTut(q){
  const s=cur(); const def=udef(q.key);
  const signed=new Set(s.activeKeys.flatMap(k=>s.leagues[k].competitors||[]));
  const people=q.ids.map(id=>`<span class="un-p">${miniAvatar(id,26)} ${fnameH(id)}${signed.has(id)?' <small>(ya en FMS)</small>':''}</span>`).join('');
  const one=q.ids.length===1;
  openModal(`<div class="tut"><div class="tut-icon">${ulogo(q.key)?`<img class="un-logo" style="height:54px" src="${ulogo(q.key)}" alt="">`:'🟢'}</div>
    <h3>Ha subido el hype ${one?'del campeón':'de los ganadores'} de ${esc(def.name)}</h3>
    <div class="un-people" style="justify-content:center;margin:10px 0;">${people}</div>
    <p>Las competiciones Under son el escaparate de la escena: quien gana gana hype y la gente empieza a pedirle.</p>
    <p>Prueba a hacer una <b>exhibición</b> con ${one?'él':'los ganadores'} si no ${one?'lo':'los'} tienes en FMS: si la comunidad responde bien, es señal de que el público ${one?'lo':'los'} quiere en la próxima temporada.</p></div>
    <div class="modal-actions"><button class="btn primary" onclick="closeModal()">Entendido</button></div>`);
}

/* =========================================================================
   SPEAKERS / HOSTS: uno por liga (obligatorio). Pasiva completa en su país, reducida fuera.
========================================================================= */
var SPEAKERS=[
  {name:'Bekaesh',    cost:2500, country:'España',    fx:'stream', v:0.05, vf:0.025, txt:'Las jornadas son más amenas: {p} de probabilidad de que los streamers hablen bien de tu jornada'},
  {name:'Kenan',      cost:2000, country:'España',    fx:'ryker',  v:0.07, vf:0.04,  txt:'Aumenta el rendimiento de los competidores: {p} de probabilidad de Minutazos de Ryker'},
  {name:'Sarita',     cost:700,  country:'España',    fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Misionero',  cost:2500, country:'Argentina', fx:'views',  v:0.05, vf:0.025, txt:'{p} de visitas en las batallas'},
  {name:'Serko Fu',   cost:1500, country:'México',    fx:'salary', v:0.03, vf:0.01,  txt:'Reduce el salario de los competidores un {m}'},
  {name:'MKS',        cost:1500, fs:true,             fx:'refuse', v:0.05, vf:0.03,  txt:'Los competidores que rechazan la FMS tienen {p} de probabilidad de aceptar'},
  {name:'Dante',      cost:1500, fs:true,             fx:'bhype',  v:10,   vf:5,     txt:'+{n} puntos de hype en las batallas'},
  {name:'Victor Sur', cost:800,  country:'Argentina', fx:'spons',  v:0.05, vf:0.03,  txt:'{p} de ganancias de los patrocinadores'},
  {name:'Nazo',       cost:1500, country:'Colombia',  fx:'bhype',  v:10,   vf:5,     txt:'+{n} puntos de hype en las batallas'},
  {name:'Metz',       cost:2000, country:'Perú',      fx:'ptb',    v:0.04, vf:0.02,  txt:'Los competidores suben de nivel: {p} de PTB en las jornadas'},
  {name:'Cayu',       cost:1500, country:'Chile',     fx:'salary', v:0.03, vf:0.01,  txt:'Reduce el salario de los competidores un {m}'},
  {name:'Queen Mery', cost:2500, country:'España',    fx:'views',  v:0.05, vf:0.025, txt:'{p} de visitas en las batallas'},
  {name:'Shulio',     cost:700,  country:'Argentina', fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Clipper',    cost:700,  country:'Uruguay',   fx:'exfee',  v:0.05, vf:0.025, txt:'Las exhibiciones cuestan un {m} menos'},
  {name:'Marina',     cost:1000, country:'España',    fx:'gap',    v:10,   vf:5,     txt:'Las jornadas pueden estar {n} días más separadas sin perder hype'},
  {name:'Mbaka',      cost:2000, country:'España',    fx:'ptb',    v:0.04, vf:0.02,  txt:'Los competidores suben de nivel: {p} de PTB en las jornadas'},
];
function spkBy(n){ return SPEAKERS.find(x=>x.name===n); }
function spkFs(sp){ return sp.fs ? state.freestylers.find(f=>nrm(f.name)===nrm(sp.name)) : null; }
function spkCountry(sp){ const f=spkFs(sp); return sp.country || (f?f.country:'—'); }
function spkImg(sp){ const f=spkFs(sp); if(f) return photoOf(f); const k='spk_'+sp.name.toLowerCase().replace(/[^a-z]/g,''); return (typeof EXTRA_IMG!=='undefined' && EXTRA_IMG[k]) || null; }
function spkLocal(sp, key){
  if(key===INTL.key || isWS(key)) return true;
  const def=ldef(key); const c=spkCountry(sp); if(!def || !def.countries) return true;
  if(def.countries.includes(c)) return true;
  if(key==='fms_caribe') return c==='México' || !LEAGUES.some(l=>l.countries.includes(c));
  return false;
}
function spkAmt(sp, key){ return spkLocal(sp,key) ? sp.v : sp.vf; }
function spkTxt(sp, key){ const a=spkAmt(sp,key); const pc=x=>(Math.round(x*1000)/10).toLocaleString('es-ES')+'%';
  return sp.txt.replace('{p}','+'+pc(a)).replace('{m}',pc(a)).replace('{n}',String(a)); }
function spkVal(key, fx){
  const s=cur(); if(!s) return 0; let names=[];
  if(key===INTL.key) names=(s.intl && s.intl.speakers)||[]; else { const L=s.leagues && s.leagues[key]; if(L) names=spkList(L); }
  let v=0; names.forEach(n=>{ const sp=spkBy(n); if(sp && sp.fx===fx) v+=spkAmt(sp,key); }); return v;
}
function spkLv(key){ return spkVal(key,'ptb')*75; }   // +4% de PTB ≈ +3 de nivel
function spkList(L){ if(!L) return []; if(!L.speakers){ L.speakers = L.speaker ? [L.speaker] : []; L.spkCosts = L.speaker ? {[L.speaker]:L.spkCost||0} : {}; delete L.speaker; delete L.spkCost; } return L.speakers; }
function spkSlots(key){ return isWS(key) ? 2 : ((state.company && state.company.stars>=3) ? 2 : 1); }
function speakerKeyOf(s, name, onlyNat){ return s.activeKeys.find(k=>(!onlyNat || !isWS(k)) && s.leagues[k] && spkList(s.leagues[k]).includes(name)) || null; }
function isSpeakerId(s, id){ const f=fby(id); return !!(f && SPEAKERS.some(sp=>sp.fs && nrm(sp.name)===nrm(f.name) && speakerKeyOf(s, sp.name))); }
function competesAnywhere(s, id){ return s.activeKeys.some(k=>s.leagues[k] && s.leagues[k].competitors.includes(id)); }
function spkRecontract(s, key){ const L=s.leagues[key];
  L.competitors.forEach(id=>{ const n=contractCost(fby(id),key), o=L.contracts[id]||0; if(n!==o){ state.company.money-=(n-o); s.fin.salaries+=(n-o); L.contracts[id]=n; } }); }
function spkRefundAll(s, L){ spkList(L).forEach(n=>{ const c=(L.spkCosts||{})[n]||0; state.company.money+=c; s.fin.salaries-=c; }); L.speakers=[]; L.spkCosts={}; }
// en una liga nacional un speaker solo puede estar en una; en la World Series se pueden repetir los de las nacionales
function spkBusy(s, key, sp){ const f=spkFs(sp); if(f && competesAnywhere(s,f.id)) return 'Compite en un line up';
  if(isWS(key)) return null; const o=speakerKeyOf(s, sp.name, true); return (o && o!==key) ? 'Host de '+ldef(o).short : null; }
function setSpeaker(key, name){
  const s=cur(); if(s.phase!=='pre') return; const L=s.leagues[key]; const list=spkList(L);
  const i=list.indexOf(name);
  if(i>=0){ const c=(L.spkCosts||{})[name]||0; state.company.money+=c; s.fin.salaries-=c; list.splice(i,1); delete L.spkCosts[name]; spkRecontract(s,key); render(); return; }
  const sp=spkBy(name); if(!sp) return;
  const busy=spkBusy(s,key,sp); if(busy){ toast(busy==='Compite en un line up' ? `${name} está en un line up como competidor: no puede ser host.` : `${name} ya es host de otra liga nacional.`); render(); return; }
  if(list.length>=spkSlots(key)){ if(spkSlots(key)===1){ setSpeaker(key, list[0]); return setSpeaker(key, name); } toast(`Ya tienes ${spkSlots(key)} speakers en ${ldef(key).name}. Quita uno primero.`); return; }
  if(state.company.money<sp.cost){ toast(`No te llega: ${name} cobra ${money(sp.cost)}.`); render(); return; }
  list.push(name); if(!L.spkCosts) L.spkCosts={}; L.spkCosts[name]=sp.cost; state.company.money-=sp.cost; s.fin.salaries+=sp.cost;
  spkRecontract(s,key); render();
}
function renderSpeakerBox(s, key){
  const L=s.leagues[key]; const list=spkList(L); const slots=spkSlots(key); const curs=list.map(spkBy).filter(Boolean);
  const open=state.ui['spkOpen_'+key] || curs.length<slots;
  const card=(sp, sel)=>{ const loc=spkLocal(sp,key); const busy= !sel && spkBusy(s,key,sp); const img=spkImg(sp);
    return `<button class="spk-card ${sel?'on':''} ${busy?'busy':''}" ${busy?'aria-disabled="true"':''} onclick="setSpeaker('${key}','${esc(sp.name)}')" title="${sel?'Quitar':'Elegir'}">
      <span class="spk-ph">${img?`<img src="${img}" alt="">`:esc(sp.name[0])}</span>
      <span class="spk-body"><span class="spk-nm">${esc(sp.name)}${sp.fs?' <small class="tag-mini">freestyler</small>':''}</span>
        <span class="spk-meta">${esc(spkCountry(sp))} · <b>${moneyK(sp.cost)}</b> · <span class="spk-loc ${loc?'l':'f'}">${loc?'Local':'Fuera'}</span></span>
        <span class="spk-fx">🎙️ ${esc(spkTxt(sp,key))}</span>
        ${busy?`<span class="spk-busy">${esc(busy)}</span>`:''}${sel?'<span class="spk-busy" style="color:var(--muted,#9a9aa6)">Toca para quitar</span>':''}</span></button>`; };
  const all=SPEAKERS.slice().sort((a,b)=>b.cost-a.cost || a.name.localeCompare(b.name));
  return `<div class="spk-box"><div class="spk-head"><h3>🎙️ ${slots>1?'Hosts / Speakers':'Host / Speaker'} <small class="step-note">${curs.length}/${slots}</small></h3>${curs.length?`<button class="btn small" onclick="state.ui['spkOpen_${key}']=!state.ui['spkOpen_${key}']; render()">${open?'Ocultar':'Cambiar'}</button>`:'<span class="tag-mini pend">Obligatorio</span>'}</div>
    ${isWS(key)?'<p class="step-note" style="margin:-4px 0 8px">En la World Series puedes repetir speakers de tus ligas nacionales.</p>':''}
    ${curs.length?`<div class="spk-grid sel">${curs.map(sp=>card(sp,true)).join('')}</div>`:''}
    ${open?`<div class="spk-grid">${all.filter(sp=>!list.includes(sp.name)).map(sp=>card(sp,false)).join('')}</div>`:''}</div>`;
}
/* ---- speakers del Internacional ---- */
function intlSpkCands(s){ return [...new Set(s.activeKeys.flatMap(k=>spkList(s.leagues[k])))]; }
function intlSpkMax(s){ return Math.min(2, intlSpkCands(s).length); }
function intlSpkAuto(s){ s.intl.speakers=intlSpkCands(s).sort((a,b)=>spkBy(b).cost-spkBy(a).cost).slice(0,intlSpkMax(s)); s.intl.spkDone=true; }
function showIntlSpeakers(){
  const s=cur(); const sel=state.ui.ispk||(state.ui.ispk=[]); const max=intlSpkMax(s);
  const cands=intlSpkCands(s).map(spkBy).filter(Boolean).sort((a,b)=>b.cost-a.cost);
  openModal(`<h3>🎙️ Speakers del ${INTL.name}</h3><p class="step-note">Elige <b>${max}</b> de los hosts que han trabajado esta temporada en tus ligas. En el Internacional todos aplican su pasiva completa.</p>
    <div class="spk-grid">${cands.map(sp=>{ const on=sel.includes(sp.name); const img=spkImg(sp);
      return `<button class="spk-card ispk-card ${on?'on':''}" data-n="${esc(sp.name)}" onclick="ispkToggle('${esc(sp.name)}')"><span class="spk-ph">${img?`<img src="${img}" alt="">`:esc(sp.name[0])}</span>
        <span class="spk-body"><span class="spk-nm">${esc(sp.name)}</span><span class="spk-meta">${esc(spkCountry(sp))}</span><span class="spk-fx">🎙️ ${esc(spkTxt(sp,INTL.key))}</span></span>${on?'<span class="vote-check">✓</span>':''}</button>`; }).join('')}</div>
    <div class="modal-actions"><span class="step-note" style="margin-right:auto">Elegidos <b id="ispkN">${sel.length}</b>/${max}</span><button class="btn primary" id="ispkOk" ${sel.length?'':'disabled'} onclick="ispkConfirm()">Confirmar</button></div>`, true);
  themeEl(document.getElementById('modalRoot'), INTL.key);
}
function ispkToggle(n){ const s=cur(); const sel=state.ui.ispk||(state.ui.ispk=[]); const i=sel.indexOf(n); if(i>=0) sel.splice(i,1); else if(sel.length<intlSpkMax(s)) sel.push(n); else { toast(`Solo puedes elegir ${intlSpkMax(s)} speakers.`); return; }
  // sin reabrir el modal: así no se pierde el scroll
  document.querySelectorAll('.ispk-card').forEach(b=>{ const on=sel.includes(b.dataset.n); b.classList.toggle('on',on); const ck=b.querySelector('.vote-check'); if(on && !ck) b.insertAdjacentHTML('beforeend','<span class="vote-check">✓</span>'); if(!on && ck) ck.remove(); });
  const c=document.getElementById('ispkN'); if(c) c.textContent=sel.length; const bt=document.getElementById('ispkOk'); if(bt) bt.disabled=!sel.length; }
function ispkConfirm(){ const s=cur(); s.intl.speakers=(state.ui.ispk||[]).slice(); s.intl.spkDone=true; state.ui.ispk=[]; closeModal(); toast('Speakers del Internacional confirmados.'); render(); }

/* =========================================================================
   ENFRENTAMIENTOS OFICIALES: el día después del límite de cruces, X reacciona
========================================================================= */
var PV_ADJ={fms_espana:'liga española',fms_argentina:'liga argentina',fms_mexico:'liga mexicana',fms_chile:'liga chilena',fms_peru:'liga peruana',fms_colombia:'liga colombiana',fms_caribe:'liga del Caribe'};
var TWP_BASE={
  both:['{a} vs {b}. Esta jornada la veo dos veces 🔥','{a} contra {b}: batallón asegurado','No me importa quién gane: {a} vs {b} es puro arte','Dos de mis favoritos frente a frente. {a} vs {b}, qué maravilla','{a} vs {b} es la batalla que llevaba tiempo esperando','Si {a} y {b} están inspirados, esto va a ser historia','Gane quien gane, con {a} vs {b} ganamos todos','Me pido primera fila para el {a} vs {b}'],
  hateBoth:['{a} vs {b}… esa batalla me la salto','Ni {a} ni {b}. Ese cruce no lo veo','{a} contra {b}: momento perfecto para ir por algo de comer','Con {a} vs {b} paso, la verdad','{a} vs {b} no me dice nada, siguiente','De toda la jornada, {a} vs {b} es la que menos me apetece'],
  vs:['Ojalá {a} se lleve el {a} vs {b}','Todo mi apoyo a {a} contra {b}','Tengo fe en {a} contra {b}, a ver si lo saca','{a} tiene que ganarle a {b} sí o sí','Que {a} haga su batalla y {b} no tiene nada que hacer','Voy con {a} contra {b}, sin dudarlo'],
  fav:['Ganas de ver a {a} contra {b}','Con {a} en el cruce, ya tengo batalla favorita de la jornada','{a} vs {b}: aquí estaré','Confío en que {a} brille contra {b}','{a} contra {b}, la batalla que más me llama','A {a} le veo ganando a {b}, pero va a costar','Por {a} me veo la jornada entera','Que llegue ya el {a} vs {b}'],
  rep:['¿{a} vs {b} OTRA VEZ? {k} temporadas seguidas viendo lo mismo','{a} contra {b} de nuevo… Ya me sé esta batalla de memoria','Otra edición más de {a} vs {b}. Un poco de variedad, por favor','{k} años seguidos con {a} vs {b}. Ya está bien','¿No hay otros cruces? {a} vs {b} por {k}ª temporada seguida','{a} vs {b} parte {k}. Ya cansa un poco'],
  rival:['{a} vs {b}. Aquí hay pique del bueno 🔥','Se viene {a} contra {b}, y ya sabemos cómo terminan estos dos','{a} vs {b}: esto va a ser personal','Cuando se cruzan {a} y {b} siempre pasa algo','Hay cuentas pendientes entre {a} y {b}','{a} contra {b}. El morbo está servido'],
  ex:['Buena exhibición la de {a} vs {b}','Tengo muchas ganas de la exhibición {a} vs {b}','{a} vs {b} de exhibición. Puede ser la mejor de la jornada','Exhibición {a} vs {b}: sin puntos en juego pero con mucho que demostrar','La exhibición {a} vs {b} tiene muy buena pinta'],
  gen:['{a} vs {b} puede dar mucho que hablar','Curioso el cruce {a} vs {b}','Para mí, {a} vs {b} es la batalla de la jornada','Ni idea de quién gana el {a} vs {b}','{a} vs {b} me parece la más igualada','Ojo al {a} vs {b}, que puede haber sorpresa','{a} contra {b}: estilos muy distintos, puede salir algo bueno'],
};
var TWP_DIA={
  es:{ both:['Tío, {a} vs {b}. Me lo veo en bucle','{a} contra {b}, qué pasada de cruce','Esta jornada la organización se ha lucido: {a} vs {b}','Pedazo de cruce {a} vs {b}, me flipa'],
       hateBoth:['{a} vs {b}… paso, me voy a hacer la cena','Ese cruce no me mola nada, {a} vs {b}'],
       vs:['A muerte con {a} contra {b}','Venga {a}, que a {b} se le puede ganar'],
       fav:['Qué ganas de ver a {a} contra {b}, tío','{a} contra {b}, me apunto ya','Me mola mucho el {a} vs {b}','{a} va a por {b}, menuda jornada'],
       rep:['Cambiad los cruces, que {a} vs {b} ya lo hemos visto {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Preparad las palomitas: {a} vs {b}','{a} vs {b}, se va a liar parda'],
       ex:['Qué buena pinta tiene la exhibición {a} vs {b}, me mola'],
       gen:['{a} vs {b}, a ver qué sale de ahí, tío','Me da que el {a} vs {b} va a estar muy reñido'] },
  ar:{ both:['{a} vs {b}, loco. La veo mil veces','Qué cruce, {a} contra {b}. Re manija','Se lucieron con este cruce: {a} vs {b}','{a} vs {b}, posta que es la final anticipada'],
       hateBoth:['{a} vs {b}… ni en pedo la miro','Ese cruce no me copa nada, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b}, eh','Dale {a}, que a {b} le podés ganar'],
       fav:['Re manija del {a} vs {b}','{a} contra {b}, ya la agendé','Me copa mucho el {a} vs {b}','{a} va por {b}, qué fecha se viene'],
       rep:['Cambien los cruces, que {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más pibes o qué?'],
       rival:['Preparen el mate: {a} vs {b}','{a} vs {b}, se va a pudrir todo'],
       ex:['Qué linda pinta tiene la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué onda','Me parece que el {a} vs {b} va a estar re parejo'] },
  mx:{ both:['{a} vs {b}, no manches. La veo mil veces','Qué cruce tan chido, {a} contra {b}','Se rifaron con este cruce: {a} vs {b}','{a} vs {b}, neta que es la batalla del año'],
       hateBoth:['{a} vs {b}… ni de chiste la veo','Ese cruce no me late nada, {a} vs {b}'],
       vs:['Con {a} hasta la muerte contra {b}, carnal','Échale ganas {a}, que a {b} sí se le gana'],
       fav:['Bien emocionado por el {a} vs {b}','{a} contra {b}, ya me la apunté','Me late mucho el {a} vs {b}','{a} va contra {b}, qué jornada se viene, raza'],
       rep:['Cambien los cruces, que {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué, wey?'],
       rival:['Prepárense las palomitas: {a} vs {b}','{a} vs {b}, se va a poner bien cañón'],
       ex:['Qué chida se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale','Se me hace que el {a} vs {b} va a estar bien parejo'] },
  cl:{ both:['{a} vs {b}, weón. La veo mil veces','Qué cruce más bacán, {a} contra {b}','Se pasaron con este cruce: {a} vs {b}','{a} vs {b} po, la raja'],
       hateBoth:['{a} vs {b}… ni cagando la veo','Ese cruce no me tinca na, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b} po','Vamos {a}, que a {b} se le puede ganar'],
       fav:['Terrible de emocionado por el {a} vs {b}','{a} contra {b}, ya me la anoté','Me tinca harto el {a} vs {b}','{a} contra {b}, qué fecha se viene, cachai'],
       rep:['Cambien los cruces po, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Preparen la once: {a} vs {b}','{a} vs {b}, se va a armar la grande'],
       ex:['Bacán se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale po','Me tinca que el {a} vs {b} va a estar parejo'] },
  pe:{ both:['{a} vs {b}, causa. La veo mil veces','Qué cruce más chévere, {a} contra {b}','Se pasaron con este cruce: {a} vs {b}','Asu, {a} vs {b}. Batallón'],
       hateBoth:['{a} vs {b}… esa ni la veo, causa','Ese cruce no me provoca nada, {a} vs {b}'],
       vs:['Con {a} a muerte contra {b} pe','Vamos {a}, que a {b} se le gana'],
       fav:['Full emocionado por el {a} vs {b}','{a} contra {b}, ya me la apunté','Me gusta harto el {a} vs {b}','{a} contra {b}, qué fecha se viene pe'],
       rep:['Cambien los cruces, causa, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Alisten la canchita: {a} vs {b}','{a} vs {b}, se va a armar la gorda'],
       ex:['Chévere se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale pe','Creo que el {a} vs {b} va a estar parejo'] },
  co:{ both:['{a} vs {b}, parce. La veo mil veces','Qué cruce tan chimba, {a} contra {b}','Se lucieron con este cruce: {a} vs {b}','Uff, {a} vs {b}. Batallón, parcero'],
       hateBoth:['{a} vs {b}… esa ni la veo, parce','Ese cruce no me llama nada, {a} vs {b}'],
       vs:['Con {a} hasta el final contra {b}, parce','Vamos {a}, que a {b} sí se le gana'],
       fav:['Muy emocionado por el {a} vs {b}','{a} contra {b}, ya la tengo apuntada','Me gusta mucho el {a} vs {b}, bacano','{a} contra {b}, qué jornada se viene, parce'],
       rep:['Cambien los cruces, parce, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
       rival:['Alisten las crispetas: {a} vs {b}','{a} vs {b}, se va a prender eso'],
       ex:['Bacana se ve la exhibición {a} vs {b}'],
       gen:['{a} vs {b}, a ver qué sale','Me da que el {a} vs {b} va a estar parejo'] },
  car:{ both:['{a} vs {b}, pana. La veo mil veces','Qué cruce tan brutal, {a} contra {b}','Se lucieron con este cruce: {a} vs {b}','{a} vs {b}. Qué nota de batalla'],
        hateBoth:['{a} vs {b}… esa vaina no la veo','Ese cruce no me llama nada, {a} vs {b}'],
        vs:['Con {a} hasta el final contra {b}, pana','Dale {a}, que a {b} se le gana'],
        fav:['Demasiado emocionado por el {a} vs {b}','{a} contra {b}, ya la tengo anotada','Me gusta mucho el {a} vs {b}, chévere','{a} contra {b}, qué jornada se viene'],
        rep:['Cambien los cruces, pana, {a} vs {b} ya lo vimos {k} años seguidos','Otra vez {a} vs {b}… ¿no hay más gente o qué?'],
        rival:['Busquen las cotufas: {a} vs {b}','{a} vs {b}, se va a prender esa vaina'],
        ex:['Brutal se ve la exhibición {a} vs {b}'],
        gen:['{a} vs {b}, a ver qué sale','Me parece que el {a} vs {b} va a estar parejo'] },
  neu:{ both:['{a} vs {b}. La veré varias veces','Excelente cruce, {a} contra {b}'], hateBoth:['{a} vs {b}… esa batalla no la veré'], vs:['Todo el apoyo para {a} frente a {b}'],
        fav:['Muchas ganas del {a} vs {b}','{a} contra {b}, ya lo tengo anotado'], rep:['Deberían cambiar los cruces: {a} vs {b} ya van {k} años seguidos'], rival:['{a} vs {b}, se viene algo grande'], ex:['Interesante la exhibición {a} vs {b}'], gen:['{a} vs {b}, veremos qué sale'] },
};
var TWP_COMP={
  es:['Nos vemos en la tarima, @{h}. Que gane el mejor','Preparado para el {a} vs {b}. Va a ser bonito','Respeto máximo a @{h}, pero esta jornada es mía','Llevo semanas preparando esta. Nos vemos, @{h}','Contra @{h} siempre hay que dar el 200%. Allí estaré'],
  ar:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar buenísimo','Respeto total a @{h}, pero esta fecha es mía','Vengo preparando esta hace semanas. Nos vemos, @{h}','Con @{h} siempre hay que dejar todo. Ahí voy a estar'],
  mx:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar chido','Todo el respeto para @{h}, pero esta jornada es mía','Llevo semanas preparando esta. Nos vemos, @{h}','Contra @{h} hay que dejarlo todo, carnal'],
  cl:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo pal {a} vs {b}. Va a estar bueno po','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, cachai'],
  pe:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar chévere','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, causa'],
  co:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar bacano','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, parce'],
  car:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}. Va a estar brutal','Respeto total a @{h}, pero esta fecha es mía','Contra @{h} hay que dejarlo todo, pana'],
  neu:['Nos vemos en la tarima, @{h}. Que gane el mejor','Listo para el {a} vs {b}','Respeto total a @{h}, pero esta jornada es mía'],
};

(function(){   // más variaciones para los cruces de jornada
  const B={ both:['Hoy no se sale de casa: {a} vs {b}','{a} vs {b}. Que alguien me sujete','Esto no es una batalla, es un regalo: {a} vs {b}','{a} vs {b} lo veo en directo y luego otra vez en YouTube'],
    hateBoth:['{a} vs {b}, la única que me salto de la jornada','Me apetecía cualquier cruce menos {a} vs {b}','{a} contra {b}… no es para mí'],
    vs:['{a} tiene que poner a {b} en su sitio','Si {a} está fino, {b} lo va a pasar mal','Hoy gana {a}, no hay más'],
    fav:['{a} vs {b}, esa no me la pierdo','Batalla clave para {a} contra {b}','{a} llega en su mejor momento para medirse a {b}','Mi apuesta de la jornada: {a} ante {b}'],
    rep:['Ya hemos visto {a} vs {b} hasta en sueños','{a} vs {b} otra vez… ¿no se cansan de hacer el mismo cruce?','Por {k}ª temporada seguida, {a} vs {b}. Sin comentarios'],
    rival:['{a} vs {b}: aquí nadie quiere perder','Se van a decir de todo, {a} vs {b}','{a} y {b} otra vez cara a cara. Va a arder'],
    ex:['La exhibición {a} vs {b} puede robarle protagonismo a la jornada','Gran acierto la exhibición {a} vs {b}'],
    gen:['El {a} vs {b} tiene pinta de réplica','{a} vs {b}: batalla trampa','Ojo que {b} le puede dar la sorpresa a {a}','{a} vs {b} me genera mucha curiosidad'] };
  for(const c in B) TWP_BASE[c]=TWP_BASE[c].concat(B[c]);
})();

(function(){   // exhibiciones y extraplayers
  const B={ exBoth:['Exhibición {a} vs {b}. Mis dos favoritos, aunque sea sin puntos, me vale','{a} y {b} de exhibición. Ojalá algún día en liga','Ni que fuera la final: {a} vs {b} de exhibición 🔥'],
    exFav:['Por fin veo a {a}, aunque sea en exhibición','{a} de exhibición contra {b}. Que lo fichen ya','Ver a {a} en exhibición me sabe a poco, lo quiero en liga','{a} en la exhibición. Esto es lo que vengo a ver'],
    exHate:['La exhibición {a} vs {b} me la salto','No entiendo por qué traen a {a} de exhibición','Exhibición con {a}… pasable'],
    ex:['La exhibición {a} vs {b} me parece de lo mejor de la jornada','Buena idea traer a {a} y {b} de exhibición','Exhibición {a} vs {b}: a ver si alguno se gana un sitio en la liga','Que la exhibición {a} vs {b} sirva para ver quién merece estar en FMS','Me interesa más la exhibición {a} vs {b} que media jornada'],
    epYes:['{x} de extraplayer se lo merece de sobra','Bien elegido {x} como extraplayer. Tiene nivel de World Series','{x} en la World Series aunque sea de extraplayer. Merecidísimo','Qué gusto ver a {x} de extraplayer contra {a}'],
    epNo:['¿{x} de extraplayer? No se merece una World Series','{x} contra {a} en la World Series… no lo veo a ese nivel','Con todo el respeto, {x} no es extraplayer de World Series'],
    epAlt:['Esperaba a {f} de extraplayer y no a {x}','¿{x}? Tendría que haber ido {f} de extraplayer','Para extraplayer, {f}. No {x}','Teniendo a {f} disponible eligen a {x} de extraplayer… en fin'] };
  for(const c in B) TWP_BASE[c]=(TWP_BASE[c]||[]).concat(B[c]);
  const D={ es:{exFav:['Tío, {a} de exhibición. Que lo metan ya en liga'], epAlt:['Dónde está {f}, tío. {x} de extraplayer no me mola']},
    ar:{exFav:['{a} de exhibición, loco. Métanlo en la liga ya'], epAlt:['¿Y {f}? {x} de extraplayer no me cierra']},
    mx:{exFav:['{a} de exhibición, no manches. Métanlo a la liga ya'], epAlt:['¿Y {f}, carnal? {x} de extraplayer no me late']},
    cl:{exFav:['{a} de exhibición po. Métanlo a la liga altiro'], epAlt:['¿Y {f}? {x} de extraplayer no me tinca']},
    pe:{exFav:['{a} de exhibición, causa. Métanlo a la liga ya'], epAlt:['¿Y {f}? {x} de extraplayer no me convence, causa']},
    co:{exFav:['{a} de exhibición, parce. Métanlo a la liga ya'], epAlt:['¿Y {f}, parce? {x} de extraplayer no me convence']},
    car:{exFav:['{a} de exhibición, pana. Métanlo en la liga ya'], epAlt:['¿Y {f}, pana? {x} de extraplayer no me convence']} };
  for(const d in D) for(const c in D[d]){ if(!TWP_DIA[d]) TWP_DIA[d]={}; TWP_DIA[d][c]=(TWP_DIA[d][c]||[]).concat(D[d][c]); }
})();
function pairStreak(a,b){ const k=pairKey(a,b); let n=1; for(let i=state.seasons.length-2;i>=0;i--){ if(seasonPairs(state.seasons[i]).has(k)) n++; else break; } return n; }

var TWT={
  es:{ title:['{a} vs {b}: aquí se decide el título','Final adelantada en {liga}: {a} contra {b}','{a} vs {b}, el que gane se pone a tiro del título','Los de arriba cara a cara: {a} vs {b}','{a} contra {b}. Batalla por el campeonato','Esto huele a final: {a} vs {b}','Si {a} gana a {b}, tiene medio título en el bolsillo','{a} vs {b} vale una liga, no os lo perdáis'],
       titleLast:['{a} vs {b} en la última jornada. Esto es una final','Todo se decide en el {a} vs {b}','Última jornada y {a} contra {b} por el título. Ni guionizado','{a} vs {b}: el que gane, campeón. Así de simple'],
       decided:['{n} ya es campeón matemáticamente. Lo que queda de {liga} sobra','Se acabó la emoción: {n} ya tiene el título','Quedan jornadas y ya sabemos quién gana {liga}. Qué aburrimiento','¿Para qué ver lo que queda si {n} ya es campeón?','{liga} decidida antes de tiempo. Las últimas jornadas no tienen chicha','{n} se ha paseado. Ya no hay pelea por el título'] },
  la:{ title:['{a} vs {b}: acá se define el título','Final adelantada en {liga}: {a} contra {b}','{a} vs {b}, el que gane queda a tiro del título','Los de arriba cara a cara: {a} vs {b}','{a} contra {b}. Batalla por el campeonato','Esto tiene olor a final: {a} vs {b}','Si {a} le gana a {b}, tiene medio título en el bolsillo','{a} vs {b} vale una liga, no se la pierdan'],
       titleLast:['{a} vs {b} en la última fecha. Esto es una final','Todo se define en el {a} vs {b}','Última fecha y {a} contra {b} por el título. Ni guionado','{a} vs {b}: el que gane, campeón. Así de simple'],
       decided:['{n} ya es campeón matemáticamente. Lo que queda de {liga} sobra','Se acabó la emoción: {n} ya tiene el título','Quedan fechas y ya sabemos quién gana {liga}. Qué aburrido','¿Para qué ver lo que queda si {n} ya es campeón?','{liga} definida antes de tiempo. Las últimas fechas no tienen gracia','{n} se paseó. Ya no hay pelea por el título'] },
};
var TWR_FOR={
  es:['Los {g} no valoran a {n}. Una vergüenza cómo le están puntuando','En {pais} no saben lo que tienen con {n}','{n} merece más respeto en {liga}. Los {g} no le valoran','Que vuelva {n} a casa, que allí no le valoran','Los jueces de {liga} no entienden a {n}. Los {g} se lo están perdiendo'],
  la:['Los {g} no valoran a {n}. Una vergüenza cómo lo están puntuando','En {pais} no saben lo que tienen con {n}','{n} merece más respeto en {liga}. Los {g} no lo valoran','Que vuelva {n} a casa, que allá no lo valoran','Los jueces de {liga} no entienden a {n}. Los {g} se lo están perdiendo'],
};


var TWDS={
  es:{ rel:['{a} vs {b}: batalla por no descender','El que pierda el {a} vs {b} se complica muchísimo la permanencia','{a} contra {b}, aquí se juegan la categoría','Batalla de vida o muerte en la parte baja: {a} vs {b}','{a} vs {b} huele a descenso para el que pierda'],
       relFav:['Ojalá gane {f} a {o}, no le quiero ver descender','Vamos {f}, que tienes que salvarte. A por {o}','{f} no puede bajar. Por favor, que gane a {o}','Sufriendo por {f}. Contra {o} toca ganar sí o sí','Si {f} desciende me da algo. Fuerza contra {o}'],
       relAnti:['Que gane {f}. Prefiero que se salve antes que {o}','Hoy voy con {f}, sin dudarlo','Vamos {f}, que el que tiene que bajar es {o}','Apoyo total a {f} en esta. Ojalá se salve'] },
  la:{ rel:['{a} vs {b}: batalla por no descender','El que pierda el {a} vs {b} se complica muchísimo la permanencia','{a} contra {b}, acá se juegan la categoría','Batalla de vida o muerte en la parte baja: {a} vs {b}','{a} vs {b} tiene olor a descenso para el que pierda'],
       relFav:['Ojalá le gane {f} a {o}, no lo quiero ver descender','Vamos {f}, que te tenés que salvar. A ganarle a {o}','{f} no puede bajar. Por favor, que le gane a {o}','Sufriendo por {f}. Contra {o} hay que ganar sí o sí','Si {f} desciende me muero. Fuerza contra {o}'],
       relAnti:['Que gane {f}. Prefiero que se salve antes que {o}','Hoy voy con {f}, sin dudarlo','Vamos {f}, que el que tiene que bajar es {o}','Apoyo total a {f} en esta. Ojalá se salve'] },
};

var TWI={
  es:{ luLocal:['{n} en una Inter en {sede}… finjamos que no sabemos quién va a ganar','Espero que el público no sea localista con {n}…','{n} jugando en casa. Ya me imagino las réplicas que le van a regalar','Inter en {sede} con {n}. A ver cuánto pesa el público esta vez','Ojalá los jueces no se dejen llevar por el público con {n}','{n} de local en la Inter. Preparad los pañuelos para los rivales'],
       champLocalHate:['Siendo local lo hace cualquiera…','{n} campeón en casa. Qué sorpresa, oye','Con el público a favor así cualquiera gana una Inter','Que gane {n} fuera de {sede} y hablamos','Inter en {sede}, campeón de {sede}. Nada más que añadir'],
       fan:['¡{n} CAMPEÓN DEL MUNDO! 🏆🔥','{n} es el mejor del mundo. Lo sabía','Lloro: {n} campeón de la Inter 🏆','Qué orgullo, {n}. Campeón internacional'], neu:['Enhorabuena a {n}, campeón de la FMS Internacional','Gran Inter de {n}. Merecido','{n} campeón del mundo. Chapó'], hateSoft:['No era mi favorito, pero enhorabuena a {n}','Me habría gustado otro campeón, pero bien jugado, {n}'] },
  la:{ luLocal:['{n} en una Inter en {sede}… hagamos de cuenta que no sabemos quién va a ganar','Ojalá el público no sea localista con {n}…','{n} jugando de local. Ya me imagino las réplicas que le van a regalar','Inter en {sede} con {n}. A ver cuánto pesa el público esta vez','Ojalá los jueces no se dejen llevar por el público con {n}','{n} de local en la Inter. Pobres rivales'],
       champLocalHate:['Siendo local lo hace cualquiera…','{n} campeón de local. Qué sorpresa, eh','Con el público a favor así cualquiera gana una Inter','Que gane {n} fuera de {sede} y hablamos','Inter en {sede}, campeón de {sede}. Nada más que agregar'],
       fan:['¡{n} CAMPEÓN DEL MUNDO! 🏆🔥','{n} es el mejor del mundo. Lo sabía','Lloro: {n} campeón de la Inter 🏆','Qué orgullo, {n}. Campeón internacional'], neu:['Felicitaciones a {n}, campeón de la FMS Internacional','Gran Inter de {n}. Merecido','{n} campeón del mundo. Respeto'], hateSoft:['No era mi favorito, pero felicitaciones a {n}','Me hubiera gustado otro campeón, pero bien jugado, {n}'] },
};
function icGenerate(s){
  const I=s.intl; const id=I.champion; if(!id || !I.bracket) return; const f=fby(id); const fem=isWoman(id); const sd=I.sede||''; const local=f.country===sd;
  let n=0; state.seasons.forEach(o=>{ if(o.intl && o.intl.champion===id) n++; }); const cw=champWord(n, fem);
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const usedT=new Set(); const pk=list=>{ const f2=list.filter(x=>!usedT.has(x)); const t=pick(f2.length?f2:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m); const T=a=>TWI[twDia(a&&a.country)==='es'?'es':'la'];
  const o={n:fname(id), sede:sd, cw};
  const tw=[]; const add=(acc, text, sent)=>tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:null, text, sent, at:0, likes:Math.round(Math.pow(Math.random(),2)*8000)+rint(20,150), rts:rint(10,900), cm:rint(10,200)});
  const like=a=>(a.fav||[]).some(x=>nrm(x)===nrm(f.name)), dis=a=>(a.hate||[]).some(x=>nrm(x)===nrm(f.name)); const used=new Set();
  add(leagueAcc(INTL.key), fill(pick(['🏆 {n}, campeón de la FMS Internacional {y}','Tenemos campeón del mundo: {n} 🏆','{n} se corona en {sede}. ¡Campeón de la FMS Internacional {y}! 🏆']),{...o, y:s.year}), 1);
  accs.filter(like).slice(0,4).forEach(a=>{ used.add(a.handle); add(a, fill(pk(T(a).fan),o), 1); });
  accs.filter(a=>dis(a)).slice(0, local?3:1).forEach(a=>{ used.add(a.handle); add(a, fill(pk(local ? T(a).champLocalHate : T(a).hateSoft),o), local?-1:0); });
  accs.filter(a=>!used.has(a.handle) && !dis(a)).slice(0,rint(2,3)).forEach(a=>{ used.add(a.handle); add(a, fill(pk(T(a).neu),o), 1); });
  const fin=I.bracket.rounds[I.bracket.rounds.length-1][0]; const opp=fin ? (fin.a===id?fin.b:fin.a) : I.runnerUp;
  if(opp && !isRival(opp,id)){ const of=fby(opp); add({handle:twHandle(of.name), name:of.name, country:of.country, verified:true, img:null}, fill(pick(TWC_COMP[twDia(of.country)==='es'?'es':'la']),{h:twHandle(f.name)}), 1); }
  const sf=flagOf(sd), cf=flagOf(f.country); const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:null}; let text;
  if(nw.special==='mcn') text=`${cf} ${f.name.toUpperCase()} - ${cw.toUpperCase()} FMS INTERNACIONAL ${s.year} 🌎\n\n${f.name} vence a ${fname(opp)} en la final y gana la FMS Internacional ${s.year} en ${sd} ${sf}!!!${n>1?` (${n}º título)`:''}`;
  else text=`¡${fem?'La CAMPEONA':'El CAMPEÓN'} de la FMS INTERNACIONAL 🌎! 🏆\n\n${nrm(f.name).toUpperCase()} ${cf} se convirtió en ${fem?'la':'el'} ${cw} de la FMS Internacional ${s.year} tras vencer a ${fname(opp)} en la final disputada en ${sd} ${sf}. 🔥\n\n#FMSInternacional 🏆`;
  add(acc, text, 0);
  I.champTw={id, cw, titles:n, streak:0, tweets:tw, shown:false};
}
function openIntlChamp(){ openChamp(INTL.key); }
function pvGenerate(s, k, j){
  const L=s.leagues[k]; const liga=ldef(k).name; const round=L.rounds[j]||[];
  const items=[];
  [L.exhib&&L.exhib[j], L.fexhib&&L.fexhib[j]].forEach(x=>{ if(x && x.a && x.b) items.push({a:x.a, b:x.b, ex:true}); });
  round.slice().sort((x,y)=>(hypeOf(x.a)+hypeOf(x.b||x.a))-(hypeOf(y.a)+hypeOf(y.b||y.a))).forEach(m=>{ if(m.a && m.b) items.push({a:m.a, b:m.b, ep:!!m.ep}); });
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const lc = isWS(k) ? null : ldef(k).countries; const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const P=(a,cat)=>{ const d=twDia(a&&a.country); let list=((TWP_DIA[d]||{})[cat]||[]).concat(d==='es'?TWP_BASE[cat]:TWP_BASE[cat].map(t=>t.replace('Aquí hay','Acá hay')));
    if(d!=='es') list=list.filter(t=>!/¡Preparad|Cambiad|aquí estaré/.test(t)); return pk(list); };
  const tw=[]; const add=(acc, text, sent, at)=>{ tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at, likes:Math.round(Math.pow(Math.random(),2)*3000)+rint(3,60), rts:rint(0,300), cm:rint(0,70)}); };
  const used=new Set(); const free=()=>{ const pool=accs.filter(x=>!used.has(x.handle)); const loc=pool.filter(isLocal); const a=(loc.length && Math.random()<0.8 ? pick(loc) : pick(pool.length?pool:accs)); used.add(a.handle); return a; };
  const like=(a,id)=>(a.fav||[]).some(n=>nrm(n)===nrm(fname(id))), dis=(a,id)=>(a.hate||[]).some(n=>nrm(n)===nrm(fname(id)));
  items.forEach((it,i)=>{ const A=fname(it.a), B=fname(it.b); let nb=0; const lovers=new Set();
    accs.forEach(a=>{ if(nb>=3) return; const la=like(a,it.a), lb=like(a,it.b), da=dis(a,it.a), db=dis(a,it.b); if(!(la||lb||da||db)) return;
      const p=isLocal(a)?0.7:(a.country?0.2:0.35); if(Math.random()>p) return;
      let cat, sent, o={a:A,b:B};
      if(la&&lb){ cat='both'; sent=1; lovers.add(a.handle); }
      else if(da&&db){ cat='hateBoth'; sent=-1; }
      else if((la&&db)||(lb&&da)){ cat='vs'; sent=0; if(lb){ o={a:B,b:A}; } }
      else if(la||lb){ cat='fav'; sent=1; if(lb) o={a:B,b:A}; }
      else return;
      used.add(a.handle); add(a, fill(P(a,cat),o), sent, i); nb++; });
    const st=it.ex? 0 : pairStreak(it.a,it.b);
    if(st>=3){ const a=accs.find(x=>!used.has(x.handle) && isLocal(x) && !lovers.has(x.handle) && !(like(x,it.a)&&like(x,it.b))) || free(); used.add(a.handle); add(a, fill(P(a,'rep'),{a:A,b:B,k:st}), -1, i); }
    if(isRival(it.a,it.b)){ const a=free(); add(a, fill(P(a,'rival'),{a:A,b:B}), 1, i); }
    else if(it.ex){ const fx=accs.filter(a=>!used.has(a.handle) && (like(a,it.a)||like(a,it.b)||dis(a,it.a)||dis(a,it.b)));
      if(fx.length && Math.random()<0.8){ const a=fx[0]; used.add(a.handle); const la=like(a,it.a), lb=like(a,it.b);
        if(la&&lb) add(a, fill(P(a,'exBoth'),{a:A,b:B}), 1, i); else if(la||lb) add(a, fill(P(a,'exFav'),la?{a:A,b:B}:{a:B,b:A}), 1, i); else add(a, fill(P(a,'exHate'),dis(a,it.a)?{a:A,b:B}:{a:B,b:A}), -1, i); }
      const a=free(); add(a, fill(P(a,'ex'),{a:A,b:B}), 1, i); }
    if(it.ep && isWS(k)){ const x=it.b, X=fname(x); const inWS=new Set(L.competitors);
      const fan=accs.find(a=>!used.has(a.handle) && like(a,x)), hater=accs.find(a=>!used.has(a.handle) && dis(a,x));
      if(fan){ used.add(fan.handle); add(fan, fill(P(fan,'epYes'),{a:A,x:X}), 1, i); }
      if(hater){ used.add(hater.handle); add(hater, fill(P(hater,'epNo'),{a:A,x:X}), -1, i); }
      const alt=shuffle(accs.filter(a=>!used.has(a.handle) && !like(a,x))).map(a=>({a, f:(a.fav||[]).map(n=>state.freestylers.find(z=>nrm(z.name)===nrm(n))).find(z=>z && z.id!==x && !inWS.has(z.id) && z.fama>=75)})).find(o=>o.f);
      if(alt && Math.random()<0.7){ used.add(alt.a.handle); add(alt.a, fill(P(alt.a,'epAlt'),{a:A,x:X,f:alt.f.name}), -1, i); }
      if(!fan && !hater && !alt){ const a=free(); add(a, fill(P(a, fby(x).fama>=80?'epYes':'epNo'),{a:A,x:X}), fby(x).fama>=80?1:-1, i); } }
    else if(!nb && Math.random()<0.35){ const a=free(); add(a, fill(P(a,'gen'),{a:A,b:B}), 0, i); }
  });
  // padrinos: Quesada y Gazir, como mucho un tuit cada uno por jornada
  { const Q=TWITTEROS.find(t=>t.special==='quesada'); const q=Q&&twAcc(Q); const gz=state.freestylers.find(f=>f.name==='Gazir');
    const inC=(list,id)=>list.some(n=>nrm(n)===nrm(fname(id)));
    const one=(list, exclude, bothList)=>{ const ix=items.map((it,i)=>({it,i})).filter(x=>!x.it.ex && x.it.a!==exclude && x.it.b!==exclude); const bl=bothList||list;
      const both=shuffle(ix.filter(x=>inC(bl,x.it.a)&&inC(bl,x.it.b))); if(both.length) return {...both[0], both:true};
      const single=shuffle(ix.filter(x=>inC(list,x.it.a)||inC(list,x.it.b))); return single.length ? {...single[0], both:false} : null; };
    if(q){ const x=one(RQ_CREW, null, RQ_TRUE); if(x){ if(x.both) add(q, fill(pk(PATRON_TX.quesadaBoth),{a:fname(x.it.a), b:fname(x.it.b)}), 1, x.i);
        else { const me=inC(RQ_CREW,x.it.a)?x.it.a:x.it.b, o=me===x.it.a?x.it.b:x.it.a; add(q, fill(pk(PATRON_TX.quesadaJ),{n:fname(me), o:fname(o)}), 1, x.i); } } }
    if(gz){ const x=one(GZ_CREW, gz.id); if(x && Math.random()<(x.both?0.85:0.45)){ const ga={handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)};
        if(x.both) add(ga, fill(pk(PATRON_TX.gazirBoth),{a:twHandle(fname(x.it.a)), b:twHandle(fname(x.it.b))}), 1, x.i);
        else { const me=inC(GZ_CREW,x.it.a)?x.it.a:x.it.b, o=me===x.it.a?x.it.b:x.it.a; add(ga, fill(pk(PATRON_TX.gazirJ),{h:twHandle(fname(me)), o:fname(o)}), 1, x.i); } } } }
  // batalla por el descenso (liga nacional, desde la J4): del 7º al 10º
  if(!isWS(k) && j>=3){ const st=computeStandings(L); const low=new Set(st.slice(6,10).map(r=>r.id));
    items.forEach((it,i)=>{ if(it.ex || !low.has(it.a) || !low.has(it.b)) return; let n=0;
      accs.filter(a=>!used.has(a.handle)).forEach(a=>{ if(n>=2) return; const la=like(a,it.a), lb=like(a,it.b), da=dis(a,it.a), db=dis(a,it.b);
        let cat=null, o=null; if(la!==lb){ cat='relFav'; o = la ? {f:fname(it.a), o:fname(it.b)} : {f:fname(it.b), o:fname(it.a)}; }
        else if(!la && !lb && da!==db){ cat='relAnti'; o = da ? {f:fname(it.b), o:fname(it.a)} : {f:fname(it.a), o:fname(it.b)}; }
        if(!cat || (!isLocal(a) && Math.random()<0.6)) return; used.add(a.handle); n++; add(a, fill(pk(TWDS[twDia(a.country)==='es'?'es':'la'][cat]), o), cat==='relFav'?1:0, i); });
      if(Math.random()<0.7){ const a=free(); add(a, fill(pk(TWDS[twDia(a.country)==='es'?'es':'la'].rel),{a:fname(it.a), b:fname(it.b)}), 0, i); } }); }
  // a partir de la J4 (J3 en World Series): los fans de los que van de 6º para abajo piden que dejen de robarles
  if(j >= (isWS(k)?2:3)){ const st=computeStandings(L); const low=st.slice(5).map((r,i)=>({id:r.id, pos:i+6})).filter(x=>accs.some(a=>like(a,x.id)));
    shuffle(low).slice(0,2).forEach(x=>{ const fans=accs.filter(a=>like(a,x.id) && !used.has(a.handle)).sort((p,q)=>(q.country===fby(x.id).country)-(p.country===fby(x.id).country)); fans.slice(0,rint(1,2)).forEach(a=>{ used.add(a.handle); const d=twDia(a.country);
      const f=fby(x.id); const foreign = lc && !lc.includes(f.country) && a.country===f.country && CH_COUNTRY[k];
      const txt = foreign ? pk(TWR_FOR[d==='es'?'es':'la']) : pk((TWR_DIA[d]||[]).concat(TWR[d==='es'?'es':'la']));
      add(a, fill(txt,{n:fname(x.id), pos:x.pos, g:foreign?CH_COUNTRY[k][1]:'', pais:(ldef(k).countries||[''])[0], liga}), -1, Math.max(0,items.findIndex(it=>it.a===x.id||it.b===x.id))); }); }); }
  // pelea por el título (top 3 entre sí desde la J3) y campeón ya decidido al final
  { const st=computeStandings(L); const left=nJ(k)-j; const decided = j>0 && st.length>1 && (st[0].pts-st[1].pts) > 3*left;
    if(decided && j >= nJ(k)-2){ for(let q=0;q<rint(1,2);q++){ const a=free(); add(a, fill(pk(TWT[twDia(a.country)==='es'?'es':'la'].decided),{n:fname(st[0].id), liga}), -1, items.length); } }
    else if(j>=2){ const top=new Set(st.slice(0,3).map(r=>r.id)); const last=j===nJ(k)-1;
      items.forEach((it,i)=>{ if(it.ex || !top.has(it.a) || !top.has(it.b)) return; for(let q=0;q<rint(1,2);q++){ const a=free(); add(a, fill(pk(TWT[twDia(a.country)==='es'?'es':'la'][last?'titleLast':'title']),{a:fname(it.a), b:fname(it.b), liga}), 1, i); } }); } }
  // uno o dos competidores calientan su batalla (nunca entre rivales con mala sangre)
  shuffle(items.filter(it=>!it.ex && !isRival(it.a,it.b))).slice(0,rint(1,2)).forEach(it=>{ const me=Math.random()<0.5?it.a:it.b, other=me===it.a?it.b:it.a; const f=fby(me);
    add({handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}, fill(pick(TWP_COMP[twDia(f.country)]||TWP_COMP.neu),{a:fname(me), b:fname(other), h:twHandle(fname(other))}), 0, items.findIndex(x=>x===it)); });
  // resumen oficial: Info Freestyle o McNoticias (50/50)
  { const jn=j+1, last=jn===nJ(k), lf=leagueFlag(k); const nat=id=> !isWS(k) && lc.includes(fby(id).country); const order=items.filter(x=>!x.ex).concat(items.filter(x=>x.ex));
    const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; let text;
    if(nw.special==='info'){ const adj=isWS(k)?'FMS World Series':(PV_ADJ[k]||liga);
      const intro = jn===1 ? `Arranca la ${adj}: estos son los primeros enfrentamientos de la temporada. 🎤` : (last ? (()=>{ const st=computeStandings(L); return st.length>1 && st[0].pts-st[1].pts>3 ? `Llega la última jornada de la ${adj}, con ${fname(st[0].id)} ya proclamado campeón. 🏆` : `Hoy viviremos la última jornada de la ${adj}, donde conoceremos al campeón del torneo. 🏆`; })() : pick([`Nueva jornada de la ${adj}. Estos son los enfrentamientos:`,`La ${adj} sigue: así quedan los cruces de la jornada ${jn}.`,`Vuelve la ${adj} con una nueva jornada.`]));
      const nm=id=>nrm(fname(id)).toUpperCase()+(nat(id)?'':' '+flagOf(fby(id).country));
      text=`¡Oficial! - Jornada ${jn} de ${liga} ${lf}\n\n${intro}\n\n${order.map(x=>`- ${nm(x.a)} vs ${nm(x.b)}${x.ex?'(Exhibición)':(x.ep?' (Extraplayer)':'')}`).join('\n')}`; }
    else text=`${liga.toUpperCase()} - JORNADA ${jn} ${lf}\n\n${order.map(x=>`${flagOf(fby(x.a).country)} ${fname(x.a)} 🆚 ${fname(x.b)} ${flagOf(fby(x.b).country)}`).join('\n')}`;
    add(acc, text, 0, items.length+1); }
  tw.sort((a,b)=>a.at-b.at || Math.random()-0.5);
  const S=tw.reduce((a,t)=>a+t.sent,0); const delta=clamp(Math.round(S*0.8),-6,6);
  L.hype=clamp(L.hype+delta,5,100);
  if(!L.pv) L.pv={}; L.pv[j]={items, tweets:tw, delta, shown:false};
  addLog(s, s.day, `📣 Oficiales los cruces de la J${j+1} de ${liga}: ${delta>0?'la comunidad está con ganas':(delta<0?'hay quejas en redes':'opiniones divididas')} (${delta>=0?'+':''}${delta} de hype).`, delta>0?'good':(delta<0?'bad':''));
}
var PV_ANIM=null;
function openPairs(key, j){
  const s=cur(); const L=s.leagues[key]; if(j==null) j=L.played; const pv=L.pv&&L.pv[j]; if(!pv) return; document.body.classList.add('noscroll');
  const replay=pv.shown; pv.shown=true; save(); const def=ldef(key); const tok={}; PV_ANIM=tok;
  const cards=pv.items.map((it,i)=>`<div class="pv-card" id="pvc${i}">${it.ex?'<span class="pv-tag">Exhibición</span>':''}${it.ep?'<span class="pv-tag ep">Extraplayer</span>':''}
      <div class="pv-side">${fmFace(it.a)}<b>${fnameH(it.a)}</b></div><span class="pv-vs">VS</span><div class="pv-side r"><b>${fnameH(it.b)}</b>${fmFace(it.b)}</div></div>`).join('');
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} Enfrentamientos · ${esc(def.name)} J${j+1}</h3>
    <div class="lu-wrap"><div class="pv-list">${cards}</div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(def.short||def.name).replace(/\s+/g,'')}J${j+1}</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="lu-res" id="luRes"></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="pvSkip()">Revelar todo</button><button class="btn primary" onclick="PV_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed'); const showTw=i=>{ const t=pv.tweets[i]; if(t && feed) feed.insertAdjacentHTML('afterbegin', luTweetHtml(t)); };
  const res=()=>{ const r=document.getElementById('luRes'); if(!r) return; const d=pv.delta;
    r.innerHTML=emoHtml(`<span class="lu-verdict ${d>0?'pos':(d<0?'neg':'')}">${d>=4?'🔥 Hay ganas de jornada':(d>0?'👍 Buenos cruces':(d===0?'🤷 Opiniones divididas':'👎 Quejas en redes'))}</span> Hype de la liga <b>${d>=0?'+':''}${d}</b>`); const b=document.getElementById('luSkip'); if(b) b.disabled=true; };
  let ti=0; const step=i=>{ if(PV_ANIM!==tok) return;
    if(i<pv.items.length){ const c=document.getElementById('pvc'+i); if(c) c.classList.add('on');
      let n=0; while(ti<pv.tweets.length && pv.tweets[ti].at<=i){ const idx=ti++; setTimeout(()=>{ if(PV_ANIM===tok) showTw(idx); }, 350+n*420); n++; }
      setTimeout(()=>step(i+1), 750+n*420); }
    else { let n=0; while(ti<pv.tweets.length){ const idx=ti++; setTimeout(()=>{ if(PV_ANIM===tok) showTw(idx); }, 300+n*450); n++; } setTimeout(()=>{ if(PV_ANIM===tok) res(); }, 500+n*450); } };
  window.pvSkip=()=>{ PV_ANIM=null; pv.items.forEach((x,i)=>{ const c=document.getElementById('pvc'+i); if(c) c.classList.add('on'); }); if(feed){ feed.innerHTML=''; pv.tweets.forEach((t,i)=>showTw(i)); } res(); };
  if(replay) window.pvSkip(); else setTimeout(()=>step(0), 400);
}

/* =========================================================================
   X: CAMPEÓN DE LIGA (después de la animación de campeón)
========================================================================= */
var WOMEN_FS=['NG','Azuky','Marithea','Sara Socas','Pandora','Sumeria','Necia','Bohemia','Piromana','Roma','Sandra','Eskai','Arcoiris','Adriana','Dalia','Dalia Castella','Sophia','Papicha','Babi'];
function isWoman(id){ const f=fby(id); return !!(f && WOMEN_FS.some(n=>nrm(n)===nrm(f.name))); }
var CH_COUNTRY={fms_espana:['ESPAÑA','españoles'],fms_argentina:['ARGENTINA','argentinos'],fms_mexico:['MÉXICO','mexicanos'],fms_chile:['CHILE','chilenos'],fms_peru:['PERÚ','peruanos'],fms_colombia:['COLOMBIA','colombianos'],fms_caribe:['CARIBE','caribeños']};
function champWord(n, fem){ const w=['','campeón','bicampeón','tricampeón','tetracampeón','pentacampeón','hexacampeón','heptacampeón','octacampeón'][n] || `${n} veces campeón`; return fem ? w.replace('campeón','campeona') : w; }
function leagueTitles(k, id){ let n=0, streak=0, broken=false; for(let i=state.seasons.length-1;i>=0;i--){ const o=state.seasons[i]; const L=o.leagues&&o.leagues[k];
    const won=!!(L && (o.activeKeys||[]).includes(k) && (L.finalStandings||[])[0]===id); if(won) n++; if(!broken){ if(won) streak++; else broken=true; } } return {n, streak}; }
var TWC={
  es:{ fan:['¡¡{CW}!! {n} campeón de {liga}, lo sabía desde la J1 🏆','{n} se lo ha ganado a pulso. Enhorabuena, máquina','Lloro. {n} {cw} de {liga} 🏆','Qué temporada se ha marcado {n}. Merecidísimo','Lo dije y lo repito: {n} es el mejor de {liga}','{n} campeón. Hoy es un gran día, tío 🔥'],
       neu:['Enhorabuena a {n}, {cw} de {liga}. Temporada muy sólida','Merecido el título de {n}, ha sido el más regular','Felicidades a {n}. Gran nivel durante toda la liga','{n} campeón de {liga}. Poco que discutir'],
       hateSoft:['No era mi favorito, pero enhorabuena a {n}. Se lo ha currado','Me esperaba otro campeón, pero chapó por {n}','{n} campeón… no es lo que quería, pero hay que reconocerlo'],
       rep:['¿Otra vez {n}? {t} títulos de {liga} ya. Siempre gana el mismo','{n} {cw}. {liga} empieza a ser aburrida','Que alguien le gane a {n}, por favor. {t} ligas ya','Ya ni me sorprende: {n} gana otra vez {liga}'],
       streak:['{k} años seguidos ganando {n}. Así no hay emoción','Otra temporada, otro título de {n}. Van {k} seguidos','{n} lleva {k} ligas seguidas. Hay que darle una vuelta a esto'] },
  la:{ fan:['¡¡{CW}!! {n} campeón de {liga}, lo sabía desde la fecha 1 🏆','{n} se lo ganó con todo. Felicitaciones, crack','Lloro. {n} {cw} de {liga} 🏆','Qué temporada hizo {n}. Merecidísimo','Lo dije y lo repito: {n} es el mejor de {liga}','{n} campeón. Hoy es un gran día 🔥'],
       neu:['Felicitaciones a {n}, {cw} de {liga}. Temporada muy sólida','Merecido el título de {n}, fue el más regular','Felicidades a {n}. Gran nivel en toda la liga','{n} campeón de {liga}. Poco que discutir'],
       hateSoft:['No era mi favorito, pero felicitaciones a {n}. Se lo trabajó','Esperaba otro campeón, pero respeto para {n}','{n} campeón… no es lo que quería, pero hay que reconocerlo'],
       rep:['¿Otra vez {n}? {t} títulos de {liga} ya. Siempre gana el mismo','{n} {cw}. {liga} se está volviendo aburrida','Que alguien le gane a {n}, por favor. {t} ligas ya','Ya ni me sorprende: {n} gana otra vez {liga}'],
       streak:['{k} años seguidos ganando {n}. Así no hay emoción','Otra temporada, otro título de {n}. Van {k} seguidos','{n} lleva {k} ligas seguidas. Algo hay que cambiar'] },
};
var TWC_DIA={ ar:{fan:['¡CAMPEÓÓÓN! {n} {cw} de {liga}, loco 🏆','Re merecido lo de {n}, posta'], rep:['Siempre {n}, siempre {n}… ya aburre, loco']},
  mx:{fan:['¡No manches, {n} {cw}! Bien merecido, carnal 🏆','Qué chido lo de {n}, se lo ganó'], rep:['Siempre {n}… ya aburre la neta']},
  cl:{fan:['¡{n} {cw} po! La raja 🏆','Bacán lo de {n}, se lo ganó'], rep:['Siempre {n}, weón… ya aburre']},
  pe:{fan:['¡Asu, {n} {cw}! Bien merecido, causa 🏆'], rep:['Siempre {n}… ya aburre, causa']},
  co:{fan:['¡Qué chimba, {n} {cw}! Merecido, parce 🏆'], rep:['Siempre {n}… ya aburre, parce']},
  car:{fan:['¡Brutal, {n} {cw}! Merecido, pana 🏆'], rep:['Siempre {n}… ya aburre esa vaina']},
  es:{fan:['Madre mía, {n} {cw}. Qué pasada 🏆'], rep:['Siempre {n}… ya cansa, tío']} };
var TWC_COMP={ es:['Enhorabuena, @{h}. Merecidísimo, campeón 🏆','Felicidades @{h}, ha sido un placer competir contigo esta temporada','Grande @{h}. El año que viene voy a por ti 😅'],
  la:['Felicitaciones, @{h}. Merecidísimo, campeón 🏆','Felicidades @{h}, fue un placer competir con vos esta temporada','Grande @{h}. El año que viene voy por vos 😅'] };
var TWC_OFF={ es:['🏆 ¡{n} es el {cw} de {liga} {y}! Enhorabuena, {campeon}','Tenemos {campeon}: {n} se corona en {liga} {y} 🏆','{n}, {cw} de {liga}. Gracias a todos por esta temporada 🏆'],
  la:['🏆 ¡{n} es el {cw} de {liga} {y}! Felicitaciones, {campeon}','Tenemos {campeon}: {n} se corona en {liga} {y} 🏆','{n}, {cw} de {liga}. Gracias a todos por esta temporada 🏆'] };
function chGenerate(s, k){
  const L=s.leagues[k]; const id=L.finalStandings[0]; if(!id) return; const liga=ldef(k).name; const fem=isWoman(id);
  const T=leagueTitles(k,id); const cw=champWord(T.n, fem); const campeon=fem?'campeona':'campeón';
  const real=TWITTEROS.filter(t=>!t.special).map(twAcc); const accs=shuffle(real);
  const lc = isWS(k) ? null : ldef(k).countries; const isLocal=a=> !lc || (a.country && lc.includes(a.country));
  const usedT=new Set(); const pk=list=>{ const f=list.filter(x=>!usedT.has(x)); const t=pick(f.length?f:list); usedT.add(t); return t; };
  const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,x)=>o[x]!=null?o[x]:m);
  const C=(a,cat)=>{ const d=twDia(a&&a.country); return pk(((TWC_DIA[d]||{})[cat]||[]).concat(TWC[d==='es'?'es':'la'][cat])); };
  const o={n:fname(id), liga, cw, CW:cw.toUpperCase(), t:T.n, k:T.streak, y:s.year, campeon};
  const tw=[]; const add=(acc, text, sent)=>tw.push({h:acc.handle, n:acc.name, c:acc.country||null, v:!!acc.verified, img:acc.img||null, text, sent, at:0, likes:Math.round(Math.pow(Math.random(),2)*5000)+rint(10,90), rts:rint(5,600), cm:rint(5,120)});
  const used=new Set(); const like=a=>(a.fav||[]).some(n=>nrm(n)===nrm(fname(id))), dis=a=>(a.hate||[]).some(n=>nrm(n)===nrm(fname(id)));
  const off=leagueAcc(k); add(off, fill(pick(TWC_OFF[twDia(off.country)==='es'?'es':'la']), o), 1);
  accs.filter(like).slice(0,4).forEach(a=>{ used.add(a.handle); add(a, fill(C(a,'fan'),o), 1); });
  const repN = T.n>=3 ? (T.streak>=3 ? 3 : (T.streak>=2 ? 2 : 1)) : 0;
  accs.filter(a=>dis(a) && !used.has(a.handle)).slice(0, T.n>=3?2:1).forEach(a=>{ used.add(a.handle); add(a, fill(C(a, T.n>=3 ? (T.streak>=2?'streak':'rep') : 'hateSoft'),o), T.n>=3?-1:0); });
  accs.filter(a=>!used.has(a.handle) && !like(a) && isLocal(a)).slice(0,repN).forEach(a=>{ used.add(a.handle); add(a, fill(C(a, T.streak>=2 && Math.random()<0.6 ? 'streak':'rep'),o), -1); });
  accs.filter(a=>!used.has(a.handle) && !dis(a) && (isLocal(a) || Math.random()<0.15)).slice(0,rint(2,3)).forEach(a=>{ used.add(a.handle); add(a, fill(C(a,'neu'),o), 1); });
  // compañeros de liga felicitan (el subcampeón incluido), nunca un rival
  [L.finalStandings[1], ...shuffle(L.finalStandings.slice(2))].filter(x=>x && !isRival(x,id)).slice(0,rint(1,2)).forEach(x=>{ const f=fby(x);
    add({handle:twHandle(f.name), name:f.name, country:f.country, verified:true, img:photoOf(f)}, fill(pick(TWC_COMP[twDia(f.country)==='es'?'es':'la']),{h:twHandle(fname(id))}), 1); });
  if(GZ_CREW.some(n=>nrm(n)===nrm(fname(id)))){ const gz=state.freestylers.find(f=>f.name==='Gazir'); if(gz && gz.id!==id) add({handle:'gazir', name:'Gazir', country:gz.country, verified:true, img:photoOf(gz)}, fill(pick(PATRON_TX.gazirCH),{h:twHandle(fname(id)), cw, liga}), 1); }
  // última jornada: contra quién jugó
  const lastR=L.rounds[L.rounds.length-1]||[]; const fm=lastR.find(m=>m.a===id||m.b===id); const opp=fm ? (fm.a===id?fm.b:fm.a) : null; const won=fm && fm.result && fm.result.winner===id;
  const intl = !isWS(k) && s.intlEnabled && s.intl && s.intl.sede; const sedeF = intl ? flagOf(s.intl.sede) : '';
  const lf=leagueFlag(k); const nw=TW_NEWS[Math.random()<0.5?0:1]; const acc={...nw, img:EXTRA_IMG[nw.img]||null}; let text;
  const CC=CH_COUNTRY[k]||[isWS(k)?'LA WORLD SERIES':liga.toUpperCase(),'suyos'];
  if(nw.special==='mcn'){
    text=`${lf} ${fname(id).toUpperCase()} - ${cw.toUpperCase()} ${liga.toUpperCase()} ${s.year} ${lf}\n\n${fname(id)} ${opp?(won?`vence a ${fname(opp)} en la jornada final y gana`:`cae ante ${fname(opp)} en la jornada final, pero gana`):'gana'} ${isWS(k)?`la FMS World Series ${s.year}`:`la FMS Nacional de ${ldef(k).countries[0]==='Caribe'?'Caribe':ldef(k).countries[0]} ${s.year}`}!!!${T.n>1?` (${T.n}º título)`:''}${intl?`\n\nEstará en la FMS Internacional ${s.year}, en ${s.intl.sede} ${sedeF}`:''}`;
  } else {
    text=`¡El${fem?'la':''} ${(fem?'CAMPEONA':'CAMPEÓN')} de ${CC[0]} ${lf}! 🏆\n\n${nrm(fname(id)).toUpperCase()} se convirtió en ${fem?'la':'el'} ${cw} de la ${liga} ${lf} ${opp?(won?`tras vencer a ${fname(opp)} en la última jornada.`:`pese a caer ante ${fname(opp)} en la última jornada.`):''} 🔥${intl?`\n\n${fname(id)} estará representando a los ${CC[1]} en la FMS Internacional que se disputará en ${s.intl.sede} ${sedeF}.`:''}\n\n#FMS${nrm(liga.replace(/^FMS\s*/i,'')).replace(/[^a-z0-9]/g,'').replace(/^./,c=>c.toUpperCase())} 🏆`;
    text=text.replace('¡Ella CAMPEONA','¡La CAMPEONA');
  }
  add(acc, text, 0);
  L.champTw={id, cw, titles:T.n, streak:T.streak, tweets:tw, shown:false};
}
function openChamp(key){
  const s=cur(); const L=s.leagues[key]; const c= key===INTL.key ? (s.intl&&s.intl.champTw) : (L&&L.champTw); if(!c) return; c.shown=true; save(); document.body.classList.add('noscroll');
  const f=fby(c.id); const def=ldef(key); const tok={}; PV_ANIM=tok;
  openModal(`<h3 class="lu-title">${leagueHeadLogo(key)} ${esc(def.name)} ${s.year} · ${c.cw.charAt(0).toUpperCase()+c.cw.slice(1)}</h3>
    <div class="lu-wrap"><div class="ch-card"><div class="ch-ph" style="${avatarDivStyle(f)}">${avatarContent(f)}</div><div class="ch-trophy">${emoHtml('🏆')}</div>
      <div class="ch-name">${fnameH(c.id)}</div><div class="ch-word">${esc(c.cw.toUpperCase())}</div><div class="ch-meta">${c.titles>1?`${c.titles} títulos de ${esc(def.name)}${c.streak>1?` · ${c.streak} seguidos`:''}`:'Primer título de '+esc(def.name)}</div></div>
      <div class="lu-x"><div class="lu-xhead"><span class="lu-xlogo">𝕏</span> Tendencias · <b>#${esc(twHandle(f.name).replace(/^./,x=>x.toUpperCase()))}${esc(nrm(c.cw).replace(/[^a-z]/g,'').replace(/^./,x=>x.toUpperCase()))}</b></div><div class="lu-feed" id="luFeed"></div></div></div>
    <div class="modal-actions"><button class="btn" id="luSkip" onclick="chSkip()">Revelar todo</button><button class="btn primary" onclick="PV_ANIM=null; closeModal(); render()">Seguir</button></div>`, 'lineup');
  themeEl(document.getElementById('modalRoot'), key);
  const feed=document.getElementById('luFeed'); const show=i=>{ if(feed && c.tweets[i]) feed.insertAdjacentHTML('afterbegin', luTweetHtml(c.tweets[i])); };
  c.tweets.forEach((t,i)=>setTimeout(()=>{ if(PV_ANIM===tok) show(i); }, 500+i*550));
  window.chSkip=()=>{ PV_ANIM=null; if(feed){ feed.innerHTML=''; c.tweets.forEach((t,i)=>show(i)); } const b=document.getElementById('luSkip'); if(b) b.disabled=true; };
}
/* ---- "dejen de robarle": a partir de la J4 (J3 en la World Series) los fans de los de abajo se quejan ---- */
var TWR={
  es:['Dejad de robarle a {n}, por favor. Esa batalla la ganó','Otra vez le roban a {n}. Así no hay quien compita','Los jueces tienen algo contra {n}, no es normal','{n} {pos}º en la tabla con el nivel que tiene… algo falla','Lo de {n} esta temporada es un robo tras otro','Que revisen las votaciones de {n}, que no puede ser','Justicia para {n}. Va {pos}º y no se lo merece','A {n} le están tongando puntos jornada tras jornada'],
  la:['Dejen de robarle a {n}, por favor. Esa batalla la ganó','Otra vez le roban a {n}. Así no se puede competir','Los jueces tienen algo contra {n}, no es normal','{n} {pos}º en la tabla con el nivel que tiene… algo anda mal','Lo de {n} esta temporada es un robo tras otro','Que revisen las votaciones de {n}, no puede ser','Justicia para {n}. Va {pos}º y no se lo merece','A {n} le están tongando puntos fecha tras fecha'],
};
var TWR_DIA={ar:['Le roban a {n} todas las fechas, loco. Una vergüenza'],mx:['Neta le están robando a {n}, no manches'],cl:['Le roban a {n} todas las fechas, weón'],pe:['Le roban a {n} cada fecha, causa'],co:['Le están robando a {n}, parce, no es justo'],car:['Le roban a {n} cada fecha, pana'],es:['Le roban a {n} cada jornada, tío. Qué vergüenza']};

(function(){   // más variaciones en general
  const D={ es:{fav:['Lo de {n} en {liga} me ha alegrado la semana','{n} confirmado. Ya tengo excusa para ver {liga}','Si me preguntáis por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería'],
               hate:['{n} no está entre mis preferidos, pero respeto la elección','Ojalá {n} me cierre la boca este año','A {n} le falta algo para convencerme'],
               otra:['Me llama la atención el cartel de {liga} este año','Puede que me enganche a {liga} esta temporada'],
               miss:['Sin {f}, {liga} pierde mucho','Me esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} antes que a {n}, la verdad']},
    ar:{fav:['Lo de {n} en {liga} me alegró la semana','{n} confirmado. Ya tengo excusa para mirar {liga}','Si me preguntan por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería'],
        hate:['{n} no está entre mis preferidos, pero respeto la elección','Ojalá {n} me cierre la boca este año','A {n} le falta algo para convencerme'],
        otra:['Me llama la atención el cartel de {liga} este año','Capaz que me engancho a {liga} esta temporada'],
        miss:['Sin {f}, {liga} pierde un montón','Esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} antes que a {n}, posta']},
    mx:{fav:['Lo de {n} en {liga} me alegró la semana','{n} confirmado. Ya tengo pretexto para ver {liga}','Si me preguntan por un nombre del cartel: {n}','{n} en {liga} es justo lo que quería, neta'],
        hate:['{n} no está entre mis favoritos, pero respeto la decisión','Ojalá {n} me calle la boca este año','A {n} le falta algo para convencerme'],
        otra:['Me llama la atención el cartel de {liga} este año','A lo mejor me engancho a {liga} esta temporada'],
        miss:['Sin {f}, {liga} pierde mucho','Esperaba a {f} sí o sí en {liga}'], missVs:['Prefiero mil veces a {f} que a {n}, la neta']},
    neu:{fav:['{n} en {liga} es justo lo que quería'], hate:['{n} no está entre mis favoritos, pero respeto la elección'], otra:['Me llama la atención el cartel de {liga}'], miss:['Sin {f}, {liga} pierde mucho'], missVs:['Prefiero a {f} antes que a {n}']} };
  for(const d in D) for(const c in D[d]) TWD[d][c]=(TWD[d][c]||[]).concat(D[d][c]);
  ['cl','pe','co','car'].forEach(d=>{ for(const c in D.neu) TWD[d][c]=(TWD[d][c]||[]).concat(D.neu[c]); });
  const G={ es:{meh:['{n} es la incógnita del cartel','Veremos si {n} está a la altura de {liga}','{n} tiene una oportunidad de oro este año'], rep:['{n} en {liga} por {k}ª vez seguida. Tocaría un descanso'], nuevo:['{n} estrena FMS. Mucha suerte'], top:['Este cartel de {liga} es de los que se recuerdan'], low:['Cartel discreto en {liga}. A ver si sorprenden'], styleOk:['Un estilo de cada, como debe ser'], bomb:['No me lo creo: {n} en {liga}']},
            la:{meh:['{n} es la incógnita del cartel','Veremos si {n} está a la altura de {liga}','{n} tiene una oportunidad de oro este año'], rep:['{n} en {liga} por {k}ª vez seguida. Tocaría un descanso'], nuevo:['{n} estrena FMS. Mucha suerte'], top:['Este cartel de {liga} es de los que se recuerdan'], low:['Cartel discreto en {liga}. A ver si sorprenden'], styleOk:['Un estilo de cada uno, como debe ser'], bomb:['No lo puedo creer: {n} en {liga}']} };
  for(const d in G) for(const c in G[d]) TWG[d][c]=(TWG[d][c]||[]).concat(G[d][c]);
  const P={ both:['{a} vs {b}: la que más ganas tengo de ver en toda la temporada','Ojalá {a} vs {b} vaya a réplica y dure más'], hateBoth:['{a} vs {b}, no es mi tipo de batalla'], vs:['Que {a} demuestre contra {b} quién manda'],
    fav:['{a} contra {b}, voy con {a} a muerte','Seguro que {a} saca algo grande contra {b}','{a} vs {b}, la tengo marcada en el calendario'], rep:['{a} vs {b} otra vez. Ya podrían cambiar algo'],
    rival:['{a} y {b} se tienen ganas. Se va a notar'], ex:['La exhibición {a} vs {b} me parece un acierto'], gen:['{a} vs {b} tiene pinta de sorpresa','No sé quién gana el {a} vs {b}, y eso me encanta','{a} vs {b}: duelo de estilos'] };
  for(const c in P) TWP_BASE[c]=TWP_BASE[c].concat(P[c]);
  const C={ es:{fan:['{n}, {cw}. Te lo has ganado, máquina 🏆','Lo que he disfrutado esta temporada de {n}. Campeón merecido'], neu:['Campeón justo: {n} ha sido el más constante'], hateSoft:['No es mi campeón, pero {n} ha hecho una gran temporada'], rep:['Otro título para {n}. Esto ya parece un monólogo']},
            la:{fan:['{n}, {cw}. Te lo ganaste, crack 🏆','Lo que disfruté esta temporada de {n}. Campeón merecido'], neu:['Campeón justo: {n} fue el más constante'], hateSoft:['No es mi campeón, pero {n} hizo una gran temporada'], rep:['Otro título para {n}. Esto ya parece un monólogo']} };
  for(const d in C) for(const c in C[d]) TWC[d][c]=TWC[d][c].concat(C[d][c]);
  TWR.es.push('{n} merece estar más arriba. Algo raro pasa con sus votaciones','Robo tras robo a {n}. Y luego dicen que no hay favoritismos');
  TWR.la.push('{n} merece estar más arriba. Algo raro pasa con sus votaciones','Robo tras robo a {n}. Y después dicen que no hay favoritismo');
  // competidores
  const GO={ es:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo distinto. {liga}, preparaos','Agradecido de estar en {liga} un año más. A disfrutar','Mucho trabajo detrás de esta temporada. Ahora toca demostrarlo','A por el título. Ni más ni menos','Que nadie se confíe conmigo este año en {liga}'],
    ar:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo distinto. {liga}, prepárense','Agradecido de estar en {liga} un año más. A disfrutar','Mucho laburo detrás de esta temporada. Ahora toca demostrarlo','Vamos por el título. Ni más ni menos'],
    mx:['Último día de preparación. Nos vemos en {liga}','Esta temporada vengo diferente. {liga}, prepárense','Agradecido de estar en {liga} un año más. A disfrutar, raza','Mucha chamba detrás de esta temporada. Ahora toca demostrarlo','Vamos por el título, carnal'],
    cl:['Esta temporada vengo distinto po. {liga}, prepárense','Harta pega detrás de esta temporada. A demostrarlo'], pe:['Esta temporada vengo distinto, causa. {liga}, prepárense','Mucha chamba detrás de esta temporada. A demostrarlo'],
    co:['Esta temporada vengo distinto, parce. {liga}, prepárense','Mucho camello detrás de esta temporada. A demostrarlo'], car:['Esta temporada vengo distinto, pana. {liga}, prepárense','Mucho trabajo detrás de esta temporada. A demostrarlo'],
    neu:['Esta temporada vengo distinto. {liga}, prepárense','Mucho trabajo detrás de esta temporada. Ahora toca demostrarlo'] };
  for(const d in GO) TW_GO[d]=(TW_GO[d]||[]).concat(GO[d]);
  const PC={ es:['Ganas de que llegue el día. @{h}, nos vemos','Buena batalla la que nos espera, @{h}','A dejarlo todo contra @{h}. Que disfrute la gente','Contra @{h} siempre salen cosas buenas. Allí estaré'],
    ar:['Ganas de que llegue el día. @{h}, nos vemos','Linda batalla nos espera, @{h}','A dejar todo contra @{h}. Que disfrute la gente','Contra @{h} siempre salen cosas buenas. Ahí voy a estar'],
    mx:['Ya quiero que llegue el día. @{h}, nos vemos','Buena batalla nos espera, @{h}','A dejarlo todo contra @{h}. Que disfrute la raza'],
    cl:['Buena batalla nos espera, @{h} po'], pe:['Buena batalla nos espera, @{h}, causa'], co:['Buena batalla nos espera, @{h}, parce'], car:['Buena batalla nos espera, @{h}, pana'], neu:['Buena batalla nos espera, @{h}'] };
  for(const d in PC) TWP_COMP[d]=(TWP_COMP[d]||[]).concat(PC[d]);
  TWC_COMP.es.push('Felicidades @{h}. Te lo has currado toda la temporada','Campeón con todas las letras, @{h}. Enhorabuena','Chapó, @{h}. Nos vemos el año que viene');
  TWC_COMP.la.push('Felicidades @{h}. Te lo trabajaste toda la temporada','Campeón con todas las letras, @{h}. Felicitaciones','Respeto, @{h}. Nos vemos el año que viene');
})();

(function(){   // gran tanda de variaciones para los tuiteros
  const add=(obj,key,arr)=>{ obj[key]=(obj[key]||[]).concat(arr); };
  const D={
    es:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada jornada','{n} en el cartel. Mi temporada acaba de empezar','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya me he comprado las palomitas','Lo de meter a {n} es de diez','{n} en {liga}. Esto pinta muy bien'],
         hate:['{n} no termina de engancharme, pero suerte','Con {n} no conecto, qué le vamos a hacer','Por mí habría ido otro antes que {n}','{n} en {liga}… vale, lo acepto','{n} no es mi estilo, pero le daré una oportunidad'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni con la mejor jornada me veo {liga} con {n}'],
         favF:['Me hago de {liga} este año solo por {n}','{n} en {liga}: tocará trasnochar','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Fichar a {n} habiendo {f}… no lo pillo','{f} estaba ahí y traen a {n}. En fin','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Ha vuelto {n}. Ya era hora','La vuelta de {n} es lo mejor del cartel','{n} de vuelta. Ahora sí'],
         otra:['El cartel de {liga} me ha sorprendido para bien','{liga} tiene buena pinta desde aquí','Puede que {liga} sea la liga del año'],
         miss:['¿Y {f}? Que alguien me lo explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Vale, vale…','Cambiaría a {n} por {f} sin pensarlo'] },
    ar:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada fecha','{n} en el cartel. Mi temporada arrancó','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya preparé el mate','Lo de meter a {n} es de diez','{n} en {liga}. Pinta re bien'],
         hate:['{n} no me termina de enganchar, pero suerte','Con {n} no conecto, qué le vamos a hacer','Para mí tendría que haber ido otro antes que {n}','{n} en {liga}… bueno, lo acepto','{n} no es mi estilo, pero le voy a dar una chance'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni en pedo miro {liga} con {n}'],
         favF:['Me hago de {liga} este año solo por {n}','{n} en {liga}: habrá que trasnochar','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Traer a {n} habiendo {f}… no lo entiendo','{f} estaba ahí y traen a {n}. Bueno','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Volvió {n}. Ya era hora','La vuelta de {n} es lo mejor del cartel','{n} de vuelta. Ahora sí'],
         otra:['El cartel de {liga} me sorprendió para bien','{liga} pinta bien desde acá','Capaz que {liga} es la liga del año'],
         miss:['¿Y {f}? Que alguien me lo explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Dale, dale…','Cambiaría a {n} por {f} sin pensarlo'] },
    mx:{ fav:['Con {n} en {liga} ya sé dónde voy a estar cada jornada','{n} en el cartel. Mi temporada ya empezó','No hay cartel malo si está {n}','{n} y yo, otra temporada juntos','Que alguien me pellizque: {n} en {liga}','{n} confirmado. Ya tengo las palomitas','Meter a {n} fue un acierto, neta','{n} en {liga}. Se ve bien chido'],
         hate:['{n} no me termina de enganchar, pero suerte','Con {n} no conecto, ni modo','Para mí debió ir otro antes que {n}','{n} en {liga}… bueno, lo acepto','{n} no es mi estilo, pero le daré chance'],
         hateF:['Con {n} ahí, {liga} me la ahorro','{liga} con {n}: no es para mí este año','Ni de chiste veo {liga} con {n}'],
         favF:['Me hago de {liga} este año nomás por {n}','{n} en {liga}: tocará desvelarse','Por {n} sigo {liga} aunque no sea la mía'],
         swap:['Traer a {n} habiendo {f}… no le entiendo','{f} estaba ahí y traen a {n}. Ni modo','Con {f} disponible, lo de {n} no tiene sentido'],
         ret:['Regresó {n}. Ya era hora','El regreso de {n} es lo mejor del cartel','{n} de regreso. Ahora sí'],
         otra:['El cartel de {liga} me sorprendió para bien','{liga} se ve bien desde acá','A lo mejor {liga} es la liga del año'],
         miss:['¿Y {f}? Que alguien me explique','Me falta {f} en este cartel','{liga} sin {f} no es {liga}'], missVs:['{n} sí y {f} no. Ajá…','Cambiaría a {n} por {f} sin pensarlo'] },
  };
  ['cl','pe','co','car','neu'].forEach(d=>{ D[d]={}; for(const c in D.mx) D[d][c]=D.mx[c].filter(t=>!/neta|chido|ni modo|ajá|no le entiendo|Ni de chiste|nomás|desvelarse/i.test(t)); });
  for(const d in D) for(const c in D[d]) add(TWD[d],c,D[d][c]);
  const G={ es:{ styleRep:['Un cartel con tantos {st}s va a hacerse largo','{c} {st}s… pedazo de monotonía'], styleOk:['Estilos variados en {liga}. Bien pensado','Para todos los gustos este cartel'], styleMid:['Algún {st} de más en {liga}, pero bueno'],
                 rep:['{n} parece fijo en {liga}. {k} años ya','Respeto a {n}, pero {k} temporadas seguidas es mucho'], same:['El cartel de {liga} me suena de algo… del año pasado'], nuevo:['Primera temporada de {n} en FMS. Ojalá le vaya bien','{n} llega nuevo a FMS. Ganas de verle'],
                 top:['Este cartel de {liga} no tiene ni un punto débil','Pocas veces se ha visto un {liga} así'], low:['Cartel corto de nombres en {liga}','Esperaba un {liga} con más pegada'], meh:['Ni frío ni calor con {n}','{n} puede ser la revelación o pasar sin pena ni gloria','A {n} le toca dar un paso adelante'], bomb:['Lo de {n} en {liga} no me lo esperaba nadie','Fichajazo: {n} en {liga}'], wsLow:['{n} en la World Series… se supone que aquí están los mejores'] },
            la:{ styleRep:['Un cartel con tantos {st}s se va a hacer largo','{c} {st}s… qué monotonía'], styleOk:['Estilos variados en {liga}. Bien pensado','Para todos los gustos este cartel'], styleMid:['Algún {st} de más en {liga}, pero bueno'],
                 rep:['{n} parece fijo en {liga}. {k} años ya','Respeto a {n}, pero {k} temporadas seguidas es mucho'], same:['El cartel de {liga} me suena de algo… del año pasado'], nuevo:['Primera temporada de {n} en FMS. Ojalá le vaya bien','{n} llega nuevo a FMS. Ganas de verlo'],
                 top:['Este cartel de {liga} no tiene ni un punto débil','Pocas veces se vio un {liga} así'], low:['Cartel corto de nombres en {liga}','Esperaba un {liga} con más peso'], meh:['Ni frío ni calor con {n}','{n} puede ser la revelación o pasar sin pena ni gloria','A {n} le toca dar un paso adelante'], bomb:['Lo de {n} en {liga} no se lo esperaba nadie','Fichajazo: {n} en {liga}'], wsLow:['{n} en la World Series… se supone que acá están los mejores'] } };
  for(const d in G) for(const c in G[d]) add(TWG[d],c,G[d][c]);
  const P={ both:['{a} vs {b}, mis dos debilidades en la misma batalla','Batalla soñada: {a} contra {b}','{a} y {b}: no puedo perder','Que dure veinte minutos el {a} vs {b}','La batalla de la temporada: {a} vs {b}'],
    hateBoth:['{a} vs {b}… ni fu ni fa','{a} contra {b}: pausa para el café','No me interesa el {a} vs {b}, la verdad'],
    vs:['{a}, gánale a {b} y alégrame el día','Que {a} se imponga a {b}, por favor','{a} tiene que demostrarle a {b} quién es'],
    fav:['{a} contra {b}: mi batalla de la jornada','Pendiente del {a} vs {b}','{a} llega fino para medirse a {b}','Hoy toca sufrir con {a} contra {b}','Con {a} enfrente de {b} no me lo pierdo','{a} vs {b}, ojalá salga una batallón'],
    rep:['{a} vs {b} otra vez, ya se sabe hasta el guion','Cambiar los cruces no cuesta tanto: {a} vs {b} de nuevo','{a} contra {b} por {k}ª temporada. Sin palabras'],
    rival:['{a} vs {b}: pique asegurado','Se tienen ganas: {a} contra {b}','{a} y {b} cara a cara. Saltan chispas seguro'],
    ex:['Exhibición {a} vs {b}: puro espectáculo','La exhibición {a} vs {b} me parece de diez'],
    gen:['{a} vs {b} puede ir a réplica','Cruce raro el {a} vs {b}, pero interesante','{a} contra {b}: a ver quién se adapta mejor','{a} vs {b} me tiene intrigado','No descarto sorpresa en el {a} vs {b}'] };
  for(const c in P) add(TWP_BASE,c,P[c]);
  const C={ es:{ fan:['Lo sabía, {n}. Sabía que eras el mejor 🏆','{n} {cw}. Qué temporada, qué orgullo','Me he emocionado con lo de {n}. Campeonazo'], neu:['Título merecido para {n}, sin discusión','{n} ha sido el mejor de {liga} y ahí está el resultado'], hateSoft:['Enhorabuena a {n}, aunque mi favorito era otro'], rep:['Otra liga para {n}… alguien que le pare','{n} gana {liga} otra vez. Ya se veía venir'], streak:['{k} seguidas de {n}. Hay que buscarle rival ya'] },
            la:{ fan:['Lo sabía, {n}. Sabía que eras el mejor 🏆','{n} {cw}. Qué temporada, qué orgullo','Me emocioné con lo de {n}. Campeonazo'], neu:['Título merecido para {n}, sin discusión','{n} fue el mejor de {liga} y ahí está el resultado'], hateSoft:['Felicitaciones a {n}, aunque mi favorito era otro'], rep:['Otra liga para {n}… que alguien lo pare','{n} gana {liga} otra vez. Se veía venir'], streak:['{k} seguidas de {n}. Hay que buscarle rival ya'] } };
  for(const d in C) for(const c in C[d]) add(TWC[d],c,C[d][c]);
  add(TWR,'es',['Que alguien le explique a los jueces lo de {n}','{n} merece más puntos de los que le dan','No es normal cómo están puntuando a {n}']);
  add(TWR,'la',['Que alguien le explique a los jueces lo de {n}','{n} merece más puntos de los que le dan','No es normal cómo están puntuando a {n}']);
  add(TWDS.es,'rel',['{a} vs {b}: duelo por la permanencia','Quien pierda el {a} vs {b} lo tiene muy negro']); add(TWDS.la,'rel',['{a} vs {b}: duelo por la permanencia','El que pierda el {a} vs {b} la tiene muy difícil']);
  add(TWDS.es,'relFav',['Vamos {f}, tú no bajas. A por {o}']); add(TWDS.la,'relFav',['Vamos {f}, vos no bajás. A ganarle a {o}']);
  add(TWT.es,'title',['El {a} vs {b} puede decidir quién se lleva {liga}']); add(TWT.la,'title',['El {a} vs {b} puede definir quién se lleva {liga}']);
  add(TWT.es,'decided',['Liga sentenciada. Lo que queda es de trámite']); add(TWT.la,'decided',['Liga sentenciada. Lo que queda es puro trámite']);
})();

/* ---- pantalla del creador al abrir el juego ---- */
function showCreator(){
  const img=(typeof EXTRA_IMG!=='undefined' && EXTRA_IMG.creator) || '';
  openModal(`<div class="creator">${img?`<img class="creator-img" src="${img}" alt="Perfil de X de Medster">`:''}
    <h3 style="margin:14px 0 6px">FMS CEO · un juego de Medster</h3>
    <p>¡Hola! Soy <b>Medster</b> (<a href="https://x.com/MedsterRM" target="_blank" rel="noopener">@MedsterRM</a> en X), el creador de este proyecto.</p>
    <p>Es un juego hecho por y para fans de las batallas de freestyle, gratuito y sin ánimo de lucro.</p>
    <p>Si encuentras <b>fallos</b> en el juego o tienes <b>sugerencias</b>, escríbeme por X y lo miro. ¡Gracias por jugar!</p></div>
    <div class="modal-actions"><a class="btn" href="https://x.com/MedsterRM" target="_blank" rel="noopener">Ir a @MedsterRM</a><button class="btn primary" onclick="closeModal()">Jugar</button></div>`);
}

/* ---- ajustes: reiniciar y añadir competidores ---- */
var GEAR_SVG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19.14 12.94a7.07 7.07 0 0 0 .05-.94 7.07 7.07 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.03 7.03 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.8a.5.5 0 0 0-.49.42l-.36 2.54c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.7 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.07 7.07 0 0 0 0 1.88l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.3.61.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.59-.24 1.13-.56 1.63-.94l2.39.96c.22.08.48 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>';
function gameMark(){ const l=(typeof EXTRA_IMG!=='undefined' && EXTRA_IMG.gamelogo); return l ? `<img class="mark mark-img" src="${l}" alt="FMS CEO">` : '<div class="mark">F</div>'; }
var CUSTOM_KEY='fms_ceo_custom_fs';
function customFS(){ try{ return JSON.parse(localStorage.getItem(CUSTOM_KEY)||'[]'); }catch(e){ return []; } }
function saveCustomFS(list){ try{ localStorage.setItem(CUSTOM_KEY, JSON.stringify(list)); }catch(e){ toast('No se pudo guardar el competidor (almacenamiento lleno).'); } }
function customToF(c){ return ensureAttrs({id:uid('f'), name:c.name, country:c.country, nivel:50, fama:50, hype:randHype(50), style:c.style, photo:c.photo||null, custom:true}); }
var CUSTOM_COUNTRIES=['España','Argentina','México','Chile','Perú','Colombia','Uruguay','Venezuela','Cuba','Puerto Rico','República Dominicana','Panamá','Costa Rica','Guatemala','Honduras','El Salvador','Nicaragua','Ecuador','Bolivia','Paraguay','EEUU'];
function openSettings(){
  openModal(`<h3>⚙️ Ajustes</h3>
    <div class="set-list">
      <button class="set-item" onclick="openAddFS()"><span class="set-ic">➕</span><span><b>Añadir competidor</b><small>Crea un freestyler nuevo con su nacionalidad, foto y estilo</small></span></button>
      <button class="set-item danger" onclick="confirmRestart()"><span class="set-ic">🔄</span><span><b>Reiniciar juego</b><small>Borra la partida actual y empieza de cero</small></span></button>
    </div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Cerrar</button></div>`);
}
function confirmRestart(){
  openModal(`<h3>Reiniciar juego</h3><p class="step-note">Se borrará la partida actual. Los competidores que hayas creado se mantienen. Si quieres conservar la partida, expórtala antes.</p>
    <div class="modal-actions"><button class="btn" onclick="openSettings()">Cancelar</button><button class="btn danger" onclick="doReset()">Reiniciar</button></div>`);
}
function openAddFS(){
  const d=state.ui.newFS||(state.ui.newFS={name:'', country:'España', style:'Punchline', photo:null});
  openModal(`<h3>➕ Añadir competidor</h3>
    <div class="nf-wrap"><label class="nf-photo" title="Elegir imagen">${d.photo?`<img src="${d.photo}" alt="">`:'<span>Subir<br>imagen</span>'}<input type="file" accept="image/*" onchange="nfPhoto(this)"></label>
      <div class="nf-fields">
        <label class="field-label">Nombre (aka)<input id="nf_name" value="${esc(d.name)}" maxlength="30" oninput="state.ui.newFS.name=this.value" placeholder="Nombre del freestyler"></label>
        <label class="field-label">Nacionalidad<select onchange="state.ui.newFS.country=this.value">${CUSTOM_COUNTRIES.map(c=>`<option ${c===d.country?'selected':''}>${c}</option>`).join('')}</select></label>
        <label class="field-label">Estilo<select onchange="state.ui.newFS.style=this.value; openAddFS()">${STYLE_NAMES.map(st=>`<option ${st===d.style?'selected':''}>${st}</option>`).join('')}</select></label>
        <p class="step-note" style="margin:2px 0 0">${esc(STYLES[d.style].txt)}</p>
        <p class="step-note" style="margin:6px 0 0">Empieza con <b>50 de nivel</b> y <b>50 de fama</b>.</p>
      </div></div>
    ${customFS().length?`<div class="field-label" style="margin-top:12px">Creados por ti</div><div class="un-people">${customFS().map(c=>`<span class="un-p">${c.photo?`<img class="nf-mini" src="${c.photo}" alt="">`:''}${esc(c.name)} <small>${esc(c.country)}</small></span>`).join('')}</div>`:''}
    <div class="modal-actions"><button class="btn" onclick="openSettings()">Volver</button><button class="btn primary" onclick="nfSave()">Añadir</button></div>`);
}
function nfPhoto(inp){ const f=inp.files&&inp.files[0]; if(!f) return; const r=new FileReader();
  r.onload=()=>{ const im=new Image(); im.onload=()=>{ const S=160, c=document.createElement('canvas'); c.width=S; c.height=S; const g=c.getContext('2d');
      const k=Math.max(S/im.width, S/im.height), w=im.width*k, h=im.height*k; g.drawImage(im,(S-w)/2,(S-h)/2.6,w,h);
      state.ui.newFS.photo=c.toDataURL('image/jpeg',0.82); openAddFS(); }; im.src=r.result; }; r.readAsDataURL(f); }
function nfSave(){ const d=state.ui.newFS; const name=(d.name||'').trim(); if(!name){ toast('Ponle un nombre.'); return; }
  const all=customFS(); if(all.some(c=>c.name.toLowerCase()===name.toLowerCase()) || (state.freestylers||[]).some(f=>f.name.toLowerCase()===name.toLowerCase())){ toast('Ya existe un competidor con ese nombre.'); return; }
  const c={name, country:d.country, style:d.style, photo:d.photo||null}; all.push(c); saveCustomFS(all);
  if(state.company && state.freestylers){ state.freestylers.push(customToF(c)); save(); }
  state.ui.newFS=null; toast(`${name} añadido a la base de competidores.`); openAddFS(); render(); }
