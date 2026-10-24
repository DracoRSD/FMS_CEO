// FMS CEO · genera dist/index.html con todo incrustado (CSS, JS, fuentes e imágenes en base64).
// Uso: npm run build:single
const fs = require('fs'), path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT = path.join(OUT_DIR, 'index.html');
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };

// Los archivos pueden venir con CRLF (core.autocrlf): se normalizan a LF al leer.
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
let embedded = 0;

// Convierte toda referencia a un archivo de assets/ en un data URL.
function inlineAssets(text) {
  return text.replace(/(["'(])((?:\.\.\/)?assets\/[^"')\s]+)(["')])/g, (m, open, rel, close) => {
    const abs = path.join(ROOT, rel.replace(/^\.\.\//, ''));
    if (!fs.existsSync(abs) || !fs.statSync(abs).isFile()) return m;
    const mime = MIME[path.extname(abs).toLowerCase()];
    if (!mime) throw new Error('Extensión sin tipo MIME: ' + rel);
    embedded++;
    return open + `data:${mime};base64,` + fs.readFileSync(abs).toString('base64') + close;
  });
}

let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="css\/style\.css">/, () => '<style>\n' + inlineAssets(read('css/style.css')).trimEnd() + '\n</style>');
html = html.replace(/<script src="js\/images\.js"><\/script>\n<script src="js\/game\.js"><\/script>/, () =>
  '<script>\n' + inlineAssets(read('js/images.js')).trimEnd() + '\n' + inlineAssets(read('js/game.js')).trimEnd() + '\n</script>');
html = inlineAssets(html); // favicon y cualquier otra ruta suelta

if (/(["'(])(?:\.\.\/)?assets\//.test(html.replace(/'assets\/'/g, ''))) throw new Error('Quedan rutas a assets/ sin incrustar');
if (/<link rel="stylesheet"|<script src=/.test(html)) throw new Error('Quedan enlaces externos sin incrustar');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, html);
console.log(`Generado ${path.relative(ROOT, OUT)} (${(Buffer.byteLength(html) / 1048576).toFixed(2)} MB, ${embedded} archivos incrustados)`);
