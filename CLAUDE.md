# FMS CEO

Juego de fans, gratuito y sin ánimo de lucro: un manager de batallas de freestyle al estilo Football Manager. El jugador dirige la empresa de la FMS: ligas nacionales, FMS Internacional, World Series, Red Bull y torneos Under, con más de 340 freestylers reales, jornadas en directo, fichajes, patrocinadores, eventos y un Twitter/X interno.

## Estructura

- `index.html`: esqueleto. Carga `css/style.css`, `js/images.js` (rutas de imágenes) y `js/game.js` (todo el juego). Sin servidor ni fetch: debe abrirse con doble clic y funcionar sin internet.
- `assets/`: fotos, logos, emojis y fuentes woff2.
- `npm run build:single` genera `dist/index.html` con todo incrustado para publicar. `npm run build:win` genera el `.exe` con Electron.

## Reglas

- Todos los textos (interfaz, comentarios, commits) en español.
- No romper partidas guardadas: `STORAGE_KEY` es `fms_ceo_v1`. Si cambia el formato, migrar los datos viejos al cargar y subir la versión interna del guardado, nunca descartarlos.
- Una fase por vez: presentar el plan o el modelo de datos y esperar el OK antes de ejecutar. Commits pequeños.
- No cambiar las reglas del juego salvo que la fase lo pida.
