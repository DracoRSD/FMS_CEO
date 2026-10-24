# FMS CEO

Juego de fans, gratuito y sin ánimo de lucro: un manager de batallas de freestyle al estilo Football Manager. El jugador dirige la empresa de la FMS: ligas nacionales, FMS Internacional, World Series, Red Bull y torneos Under, con más de 340 freestylers reales, jornadas en directo, fichajes, patrocinadores, eventos y un Twitter/X interno.

## Estructura

- `index.html`: esqueleto. Carga `css/style.css`, `js/images.js` (rutas de imágenes) y `js/game.js` (todo el juego). Sin servidor ni fetch: debe abrirse con doble clic y funcionar sin internet.
- `assets/`: fotos, logos, emojis y fuentes woff2.
- Motor de batallas: el bloque «Modelo de atributos y jueces» al inicio de js/game.js reúne todas las constantes ajustables (pesos por ronda, sesgos por estilo, mentalidad, jueces, carrera, progresión, retiros y nuevos talentos de fin de temporada). `npm run simular` comprueba que el favorito no gane más del 70 %, que el pool se mantenga estable tras 20 temporadas de relevo y que el mundo corra 20 años solo en modo carrera (`docs/modo-carrera.md`).
- `npm run build:single` genera `dist/index.html` con todo incrustado para publicar. `npm run build:win` genera el `.exe` con Electron.

## Reglas

- Todos los textos (interfaz, comentarios, commits) en español.
- No romper partidas guardadas: `STORAGE_KEY` es `fms_ceo_v1`. Si cambia el formato, migrar los datos viejos al cargar y subir la versión interna del guardado (`company.dbv`, hoy 8), nunca descartarlos.
- Una fase por vez: presentar el plan o el modelo de datos y esperar el OK antes de ejecutar. Commits pequeños.
- No cambiar las reglas del juego salvo que la fase lo pida.
