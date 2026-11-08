# FMS CEO

Juego de fans, gratuito y sin ánimo de lucro: un manager de batallas de freestyle al estilo Football Manager. El jugador dirige la empresa de la FMS: ligas nacionales, FMS Internacional, World Series, Red Bull y torneos Under, con más de 340 freestylers reales, jornadas en directo, fichajes, patrocinadores, eventos y un Twitter/X interno.

## Estructura

- `index.html`: esqueleto. Carga `css/style.css`, `js/images.js` (rutas de imágenes), `js/mapas.js` (mapas de sedes) y `js/game.js` (todo el juego). Sin servidor ni fetch: debe abrirse con doble clic y funcionar sin internet.
- `assets/`: fotos, logos, emojis y fuentes woff2.
- Motor de batallas: el bloque «Modelo de atributos y jueces» al inicio de js/game.js reúne todas las constantes ajustables (pesos por ronda, sesgos por estilo, mentalidad, jueces, carrera, progresión, retiros y nuevos talentos de fin de temporada). `npm run simular` comprueba que el favorito no gane más del 70 %, que el pool se mantenga estable tras 20 temporadas de relevo y que el mundo corra 20 años solo en modo carrera (`docs/modo-carrera.md`).
- `npm run build:single` genera `dist/index.html` con todo incrustado para publicar. `npm run build:win` genera el `.exe` con Electron.

## Reglas

- Todos los textos (interfaz, comentarios, commits) en español.
- No romper partidas guardadas: el CEO guarda en 3 ranuras (`fms_ceo_slot_N`, con las temporadas viejas comprimidas; `migrateSlots` pasa la clave antigua `fms_ceo_v1` a la ranura 1) y la carrera en `fms_ceo_carrera_v1`. Si cambia el formato, migrar los datos viejos al cargar y subir la versión interna del guardado (`company.dbv`, hoy `DBV_ACTUAL` = 18; nuestras v4-v9 y después las del creador renumeradas), nunca descartarlos.
- Una fase por vez: presentar el plan o el modelo de datos y esperar el OK antes de ejecutar. Commits pequeños.
- No cambiar las reglas del juego salvo que la fase lo pida.
