# Modo carrera · diseño

Documento de diseño, sin código. Describe cómo encajar en FMS CEO un modo en el que el jugador no dirige la empresa sino a **un solo freestyler**, desde el Under hasta el retiro, en el mismo mundo de 344 reales con sus ligas, torneos, progresión y relevo generacional.

Decisiones ya tomadas por el autor del juego:

- Modo aparte en el mismo mundo. Sin empresa, plantillas ni sueldos.
- Las ligas y torneos corren solos con el auto-fichaje.
- El jugador crea nombre, país y estilo y reparte puntos entre los cinco atributos.
- Empieza abajo, en el Under.
- Cada temporada elige qué atributo entrena y a qué torneos se presenta, y recibe ofertas de patrocinadores y de ligas.
- Termina al retirarse, por decisión propia o por edad, con un Salón de la fama.

## 1. Qué dice el código hoy

Lo investigado antes de diseñar, con el sitio exacto en `js/game.js`.

### 1.1 ¿Puede correr una temporada sin decisiones del CEO?

Casi. `advance('year')` recorre los días con `simulateDay(auto=true)`, y con `auto` el motor ya resuelve solo: eventos UQ (`uqAuto`), sustitutos (`uqAutoReplace`), directos, exhibiciones, alineaciones y parejas de World Series, portavoces de la Internacional, presentaciones de Under, Red Bull, jornadas e Internacional. Quedan **tres huecos** que hoy obligan a decidir:

| Hueco | Dónde | Qué hace falta |
|---|---|---|
| Votación de comodines de Red Bull | `simulateDay`, la pausa `vote` se devuelve aunque `auto` sea true | Auto-voto: `rbResolveVote` ya mete siempre a los 3 de más fama se vote lo que se vote, así que basta con llamarla con votos vacíos |
| Pretemporada | `preseasonIssues`: 10 fichajes, 9 fechas y un host por liga; sede y fecha de la Internacional | Auto-fichaje sin dinero (hoy `devAutoSign` comprueba `state.company.money`), colocador automático de fechas (no existe: `L.dates.push` solo se llama desde el calendario manual), host por defecto, sede y fecha de la Internacional por defecto |
| Modo infinito y estrellas | `maxLeagues(stars)` decide cuántas ligas hay; con menos de 4 no hay Internacional | El mundo de la carrera debe nacer con 5 estrellas y las 7 ligas activas |

Conclusión: hace falta una función `autoPretemporada(s)` y un auto-voto. El resto del año ya es autónomo.

### 1.2 Competidores propios: `customFS` y `customToF`

- `customFS()` lee una lista aparte de `localStorage` (clave `fms_ceo_custom_fs`) con `{name, country, style, photo}`. `saveCustomFS` la escribe. Se inyecta en el pool al crear partida y al cargar, si el nombre no existe ya.
- `customToF(c)` convierte uno en freestyler: nivel 50, fama 50, hype aleatorio, `custom:true`, atributos deterministas por nombre con `ensureAttrs` y carrera de 2 a 4 años con `ensureCarrera` (`EXP_CUSTOM`).
- Desde la fase 6 los `custom` **nunca se retiran** (`retirarFreestylers` los salta).

Lo reutilizable es la forma del objeto y la idea de inyección por nombre. Lo que no sirve tal cual: el nivel fijo 50, la fama 50, la experiencia 2-4 y la exención de retiro.

### 1.3 Guardado

Un único volcado en `fms_ceo_v1`: `{company, freestylers, seasons, _counter}`. `load()` devuelve `false` si no hay `company`, y cientos de líneas leen `state.company.stars`, `.money`, `.reputation`, `.sponsors`, `.tut`. Exportar e importar usan el mismo JSON. La versión interna es `company.dbv` (hoy 7).

### 1.4 Cómo se sube del Under al Internacional

| Peldaño | Quién entra | Dónde |
|---|---|---|
| Under nacional (Cuna de Oro, General Rap, Chess, DEM) y BDM | fama ≤ 83-85 y país; sorteo `underPick` sesgado a la calidad (0,6·nivel + 0,4·fama) con exponente 1,6 | `underDraw`, `underEligible` |
| Monster Fu | solo España, fama ≤ 83, 10 plazas por fecha, 3 fechas al año | `runUnder` |
| Red Bull nacional | por país; `probPick` sobre los aptos ordenados por calidad con 60 % de participación; podio anterior directo | `rbDraw`, `RB_PARTICIPATION` |
| Torneo de Plazas | uno por país, sin estrellas | `rbDraw` |
| Red Bull Internacional | 10 campeones nacionales + podio anterior + 3 por fama (la votación no cambia el resultado) + vacantes por fama | `rbResolveVote` |
| Liga FMS | el auto-fichaje toma los 10 de mayor nivel del país de la liga que no estén fichados; un extranjero solo si faltan locales | `devAutoSign`, `preselectRoster` mantiene la plantilla anterior |
| FMS Internacional | top 4 / top 3 + comodín / top 2 + cupo de campeón según haya 4, 5 o 6 ligas | `intlQualifiers` |
| World Series | plantilla propia con 5 estrellas | `WS` |

La fama solo se mueve en las ligas (`endSeason`: +8 campeón, +4 podio, −1 si no estás fichado) y los torneos dan hype, no fama. Para que un novato suba por la escalera hace falta que **ganar torneos dé fama** (ver 5.2).

## 2. Bucle de cada temporada

```
Pretemporada
  1. Correo del año: ofertas de liga (si las hay), ofertas de patrocinio, torneos abiertos.
  2. El jugador decide: liga (aceptar una oferta o seguir libre), patrocinador, atributo a entrenar,
     torneos a los que se presenta (Under, Monster Fu, Red Bull nacional, Plazas).
  3. autoPretemporada(s): auto-fichaje de las 7 ligas sin dinero, fechas, hosts, sede y fecha de la
     Internacional. Si el jugador aceptó una liga, entra en su plantilla antes del auto-fichaje.
Temporada en directo
  4. advance en modo auto, con dos pausas nuevas solo para el jugador:
     · "Tu batalla": se abre showBattle de cada combate del jugador (opcional, se puede saltar).
     · "Tu torneo": cuadro del Under o Red Bull con el jugador dentro.
  5. Auto-voto de comodines de Red Bull.
Cierre
  6. endSeason: evolución de la fase 5 + entrenamiento (sección 5) + relevo de la fase 6.
  7. Resumen personal: récord, títulos, nivel y atributos ▲▼, fama, dinero, ofertas para el año que viene.
  8. ¿Retiro? Si el jugador lo pide, o si la edad lo impone (sección 6), se cierra la carrera y se abre el Salón de la fama.
```

Decisiones del jugador por temporada: **liga, patrocinador, atributo, torneos**. Nada más. Todo lo demás es automático y se puede ver, no tocar.

## 3. Modelo de datos

### 3.1 Estado raíz

El modo se distingue por `state.company.modo`. Para no tocar los cientos de lecturas de `state.company`, la carrera lleva una **empresa fantasma** con valores que abren todo el mundo:

```js
state.company = {
  modo: 'carrera',               // ausente o 'ceo' en las partidas de siempre
  name: 'Mundo',                 // no se muestra
  stars: 5, infinite: true,      // 7 ligas, Internacional y World Series desde el año 1
  money: 0, reputation: 0,       // no se usan; el auto-fichaje de carrera no mira el dinero
  dbv: 8,
  carrera: { ... }               // sección 3.2
};
```

Las ligas activas en carrera son siempre las 7 nacionales más la Internacional. World Series queda apagada en la primera versión (su alineación y parejas son decisiones de CEO).

### 3.2 La carrera

```js
carrera: {
  fid: 'f123',                   // id del freestyler del jugador en state.freestylers
  inicio: 2027,                  // año de debut
  entreno: 'flow',               // atributo elegido esta temporada
  inscrito: ['u_gr','rb_esp'],   // torneos a los que se presenta esta temporada
  ligaOferta: [{key:'fms_espana', puesto: 9, year: 2031}],   // ofertas de liga pendientes
  sponsor: {name, cat, bg, fg, pago, hasta},                  // patrocinador vigente o null
  sponsorOfertas: [...],         // ofertas de esta pretemporada
  dinero: 0,                     // ganancias acumuladas (solo marcador)
  temporadas: [                  // una entrada por año cerrado
    { year, nivel, attrs, fama, liga, puesto, record:{v,d}, titulos:[], dinero, entreno, torneos:[] }
  ],
  retiro: null                   // {year, motivo:'propio'|'edad', salon:{...}} al terminar
}
```

### 3.3 El freestyler del jugador

Es un freestyler normal del pool, con tres marcas:

```js
{ id, name, country, style, nivel, fama: 20, hype,
  attrs: {punchline, metrica, flow, impro, mentalidad},   // repartidos por el jugador
  carrera: { exp: 0, pot: POT_CARRERA },                   // ver 5.1
  jugador: true,                                           // nueva bandera
  custom: false, generado: false }
```

No se guarda en `fms_ceo_custom_fs`: es de esta partida. `jugador:true` lo excluye de `retirarFreestylers` (el retiro lo decide la sección 6) y lo señala en listas y fichas.

### 3.4 Guardado separado y dbv 8

- La carrera se guarda en **otra clave**: `fms_ceo_carrera_v1`. Las dos partidas, CEO y carrera, conviven en el mismo navegador y la pantalla de inicio ofrece continuar cualquiera de las dos.
- `save()` y `load()` reciben la clave según `state.company.modo`. Exportar e importar escriben el mismo JSON de siempre; al importar, `modo` decide a qué clave va.
- Migración dbv 8 para las partidas de siempre: añade `modo:'ceo'` y nada más. Las partidas de carrera nacen en 8. `CLAUDE.md` pasa a decir «hoy 8».
- `syncRealPool` y la inyección de `customFS` siguen igual en los dos modos: los competidores propios del jugador también viven en el mundo de la carrera.

## 4. Qué se reutiliza y qué se crea

### Se reutiliza tal cual

- Todo el motor: `simulateFMSBattle`, `runKnockout`, jueces, estilos, `evolveFreestylers`, `retirarFreestylers`, `generarNovatos`.
- El año en automático: `advance`, `simulateDay(auto)`, `uqAuto`, `uqAutoReplace`, `rbDraw`, `underDraw`, `runUnder`, `intlQualifiers`, Twitter interno.
- `showBattle`, cuadros, resumen de temporada (pestañas Evolución y Relevo), historial, `titlesOf`.
- `SPONSOR_BRANDS` y la forma de oferta de `sponsorOffers` para los patrocinios personales.
- La forma de freestyler de `customToF` y `attrsFromNivel` para construir al jugador.
- Exportar e importar partidas.

### Se adapta

- `devAutoSign` → `autoFicharLigas(s)`: el mismo criterio (país primero, luego nivel) sin mirar `state.company.money` y respetando la liga que el jugador aceptó.
- `rbNeedsVote` → auto-voto cuando `modo==='carrera'`.
- `underDraw` y `rbDraw`: si el jugador está inscrito y es apto, ocupa una plaza fija antes del sorteo.
- `endSeason`: añade el entrenamiento (5.2), la fama por torneos (5.3), el pago del patrocinador y el resumen personal; no toca estrellas, reputación ni ofertas de la empresa cuando `modo==='carrera'`.
- `renderDashboard`: en carrera muestra el panel «Mi carrera» en lugar de las tarjetas de empresa.
- `retirarFreestylers`: salta a `jugador`.

### Se crea

- `autoPretemporada(s)`: fechas (9 por liga, fines de semana, sin solapar con Red Bull ni Under), host por defecto, sede y fecha de la Internacional.
- Pantalla de creación: nombre, país, estilo, reparto de puntos.
- Pretemporada de carrera: ofertas de liga, patrocinio, entrenamiento, inscripciones.
- Resumen personal de temporada y panel «Mi carrera».
- Retiro y Salón de la fama.
- En `tools/simular.js`, el flag `--carrera N`: N carreras pasivas y N activas, con los criterios de la sección 8.

## 5. Progresión: cómo el entrenamiento se suma a la fase 5

### 5.1 Creación

- Puntos a repartir: **300** entre los cinco atributos (media 60), mínimo 45 y máximo 75 por atributo. Nivel inicial = media = 60. El estilo elegido no añade sesgo: el jugador ya lo expresa con el reparto.
- Experiencia 0. Fama 20 (apto para todo el Under). Hype con `randHype(20)`.
- Potencial `POT_CARRERA = 92`, oculto. Es alto a propósito: la historia debe poder llegar arriba, y el ritmo lo ponen el entrenamiento y la actividad.

### 5.2 Entrenamiento

La fase 5 ya mueve cada atributo por etapa (joven crece hacia el potencial, madurez ruido y crecimiento con holgura, veterano declive) y suma empujones por títulos. El entrenamiento es **un empujón más, elegido**, con las mismas reglas de tope:

| Etapa | Atributo entrenado | Resto |
|---|---|---|
| Joven (0-4) | +1,5 además del crecimiento normal | sin cambio |
| Madurez (5-9) | +1,0 | sin cambio |
| Veterano (10+) | el declive de ese atributo se reduce a la mitad | declive normal |

- El entrenamiento no pasa del potencial más `BOOST_OVER_POT` (2), igual que los empujones de títulos.
- Repetir el mismo atributo tres años seguidos rinde la mitad el tercero (`ENTRENO_REPETICION`), para que el reparto importe.
- La inactividad de la fase 5 (`INACTIVE_PENALTY`, no competir en nada) se aplica igual: quien no se inscribe en nada ese año pierde 0,3 en todo.

Constantes nuevas en el bloque del modelo: `ENTRENO_JOVEN = 1.5`, `ENTRENO_MADUREZ = 1.0`, `ENTRENO_VETERANO = 0.5` (fracción del declive), `ENTRENO_REPETICION = 3`, `POT_CARRERA = 92`.

### 5.3 Fama por torneos

Hoy la fama solo cambia en las ligas. Para que la escalera funcione, en todos los modos los torneos dan fama al cerrar la temporada: Under +3 al campeón y +1 al finalista, Monster Fu +1 por batalla ganada, Red Bull nacional +6 / +3 / +2 al podio, Plazas +3, Red Bull Internacional +12 / +6 / +4, y cada batalla ganada en un cuadro +0,5. Es un cambio de reglas del juego base y se valida con `npm run simular`: el favorito en liga debe seguir ≤ 70 % y el informe de relevo debe seguir en verde.

### 5.4 Escalera de acceso vista desde el jugador

| Peldaño | Condición para inscribirse | Qué garantiza |
|---|---|---|
| Under de su país y BDM | fama ≤ famaMax del torneo (83-85) | plaza fija en el cuadro de 16 |
| Monster Fu | ser de España, fama ≤ 83 | plaza en una de las 3 fechas |
| Red Bull nacional de su país | siempre | plaza fija entre los 16 |
| Torneo de Plazas | fama ≤ 83 | plaza fija si su país no la ocupa ya |
| Red Bull Internacional | ganar la nacional, podio anterior o estar entre los 3 de más fama | automático |
| Liga FMS | oferta: estar entre los 10 de mayor nivel del país de una liga en pretemporada, o entre los 14 con un 50 % de probabilidad («apuesta de la liga») | plaza en la plantilla si acepta |
| FMS Internacional | clasificación de liga | automático |

Un jugador libre (sin liga) puede inscribirse en todo lo demás a la vez; con liga, solo en Red Bull nacional y Plazas, como hacen los reales.

## 6. Final y Salón de la fama

### 6.1 Retiro

- **Propio**: botón «Retirarme» en cualquier pretemporada a partir de la experiencia 8. Pide confirmación.
- **Por edad**: al cerrar la temporada, si `exp ≥ 12` se tira `retiroProb` de la fase 6 con un suavizado (`RET_JUGADOR_MULT = 0.6`); y es forzoso a `exp ≥ 20` o si el nivel cae por debajo de 55. Se avisa el año anterior («última temporada») cuando la probabilidad supera el 50 %.

Al retirarse, el freestyler queda `retirado:true` en el pool como los demás y la partida pasa a solo lectura con el Salón abierto; el historial sigue consultable.

### 6.2 Salón de la fama

Pantalla final con:

- Ficha: nombre, país, estilo, años (debut y retiro), foto si la hay.
- Cifras: temporadas, batallas y récord, nivel máximo y año, fama máxima, dinero total, patrocinadores.
- Palmarés con `titlesOf`: ligas, Internacionales, Red Bull, Under.
- Curva de nivel por temporada (una barra por año) y el atributo entrenado cada año.
- **Rango** por puntos: 1 punto por victoria de cuadro, 3 por batalla de liga ganada, 15 por Under, 25 por Red Bull nacional, 60 por liga FMS, 100 por FMS Internacional o Red Bull Internacional. Rangos: Promesa (< 100), Figura (< 300), Referente (< 700), Leyenda (≥ 700).
- Galería persistente: `fms_ceo_salon` guarda el resumen de cada carrera terminada (nombre, país, años, rango, títulos) para verlas todas desde la pantalla de inicio.

## 7. Riesgos

1. **`state.company` por todas partes.** La empresa fantasma evita tocar cientos de líneas, pero cualquier lectura de `money`, `stars` o patrocinios en carrera puede producir textos absurdos («subes a 6★»). Mitigación: recorrer `addLog`, `showSummary`, `showTutorial` y `sponsorOffers` y cortarlos con `modo==='carrera'`; el simulador comprueba que una carrera no deje mensajes de empresa en el registro.
2. **Pausas que ignoran `auto`.** Hoy solo la votación; si aparece otra, el año se queda colgado. Mitigación: criterio medible en el simulador (20 años sin ninguna pausa).
3. **Fama por torneos** cambia el juego base: puede inflar la fama de los que encadenan Red Bull y alterar fichajes y cuadros. Mitigación: cifras pequeñas y los informes de `npm run simular` como barrera.
4. **Plaza fija del jugador** quita una plaza a un real en Under y Red Bull. Es un solo cupo en cuadros de 16 y hoy el sorteo ya es aleatorio; se documenta y se acepta.
5. **Ritmo.** Si el jugador pasivo tarda más de 8 temporadas en entrar a una liga, el modo aburre; si tarda menos de 4, no hay escalera. Por eso el criterio de la sección 8 y las constantes de entrenamiento en el bloque del modelo.
6. **Eventos con nombres reales** (Papo, Khan, Zasko, Skone) siguen ocurriendo en el mundo y pueden afectar a la liga del jugador (un sustituto, una baja). Es deseable: es el mismo mundo. Solo hay que comprobar que `uqAuto` no requiera al CEO.
7. **Tamaño del guardado.** Dos partidas en el navegador duplican el uso de `localStorage`; la carrera guarda las mismas temporadas que el modo CEO. Mitigación: la misma poda de tuits de temporadas pasadas que ya hace `nextSeason`, y el aviso de exportar que ya existe.

## 8. Fases, commits y criterios medibles

Cada fase termina con `npm run simular` en verde (incluido lo nuevo) y commits pequeños. Las cifras se miden con `--carrera 50`: 50 carreras pasivas (sin elegir entrenamiento, se inscriben en todo lo que pueden, aceptan la primera oferta de liga) y 50 activas (entrenan el atributo más bajo, igual inscripción), semillas 1, 2, 3 y 7.

### Fase C1 · El mundo corre solo

- Commits: `autoPretemporada` (fechas, hosts, sede y fecha de la Internacional); `autoFicharLigas` sin dinero; auto-voto de Red Bull; flag `--carrera` en el simulador que crea un mundo de carrera y lo hace avanzar 20 años con `advance('year')`.
- Criterios: 20 temporadas seguidas sin ninguna pausa ni error en las 4 semillas; las 7 ligas arrancan cada año con 10 fichados y 9 fechas; el favorito en liga sigue ≤ 70 % y el informe de relevo sigue en verde.

### Fase C2 · Partida de carrera y guardado

- Commits: `modo` y dbv 8 con migración; clave `fms_ceo_carrera_v1` en `save`, `load`, exportar e importar; pantalla de inicio con las dos partidas; pantalla de creación (nombre, país, estilo, 300 puntos); `jugador:true` y exención de retiro.
- Criterios: una partida CEO de dbv 7 carga y queda en dbv 8 sin cambios de nivel ni atributos; CEO y carrera guardadas a la vez y se abren ambas; exportar e importar una carrera la deja idéntica; el reparto de puntos siempre produce nivel = media de atributos.

### Fase C3 · Escalera, inscripciones y entrenamiento

- Commits: fama por torneos (todos los modos); plaza fija del jugador en Under, Monster Fu, Red Bull y Plazas; ofertas de liga en pretemporada; entrenamiento en `endSeason`; medición en `--carrera`.
- Criterios: el jugador pasivo recibe su primera oferta de liga entre la temporada 4 y la 8 en al menos el 80 % de las carreras, y nunca antes de la 3; el activo entre la 3 y la 6 en al menos el 80 %; mediana de nivel del activo a los 10 años entre 84 y 90; el favorito en liga ≤ 70 % y el relevo en verde con la fama por torneos.

### Fase C4 · Interfaz de temporada

- Commits: panel «Mi carrera» en el inicio (ficha, próximo compromiso, récord, ofertas); pretemporada de carrera (liga, entrenamiento, inscripciones); pausas «Tu batalla» y «Tu torneo» con opción de saltar; resumen personal al cerrar el año; registro filtrable «solo lo mío».
- Criterios: una temporada completa se juega con como mucho 4 decisiones y N pausas opcionales; con «saltar todo» marcado, cero pausas; sin textos de empresa en el registro de una carrera (comprobación en el simulador).

### Fase C5 · Patrocinadores

- Commits: ofertas personales con `SPONSOR_BRANDS` según fama (1 oferta con fama < 40, 2 con < 70, 3 después), pago por temporada y prima por título; dinero como marcador en el panel y el resumen.
- Criterios: el pasivo acumula entre 50 K y 300 K a los 10 años; el activo entre 150 K y 800 K; ninguna oferta repite marca mientras esté vigente.

### Fase C6 · Retiro y Salón de la fama

- Commits: retiro propio y por edad con aviso de última temporada; pantalla del Salón con rango y curva; galería `fms_ceo_salon`; partida en solo lectura.
- Criterios: en 50 carreras pasivas la edad de retiro queda entre 14 y 20 años de experiencia, mediana 16 a 18; el rango del pasivo es Promesa o Figura en al menos el 80 % y el del activo Figura o Referente en al menos el 60 %; una carrera cerrada se reabre desde la galería sin errores.

## 9. Preguntas abiertas

1. **World Series en la carrera**: ¿la dejamos apagada en la primera versión o la jugamos también en automático, con alineación y parejas por defecto, para que el jugador pueda recibir su oferta?
2. **Plaza fija al inscribirse**: ¿te vale que la inscripción garantice la plaza en Under y Red Bull nacional, o prefieres que el jugador entre por el mismo sorteo que los reales con una ventaja (por ejemplo, el doble de probabilidad)?
3. **Potencial del jugador**: ¿fijo y oculto (92) para todos, o elegido en la creación con un intercambio, por ejemplo más puntos iniciales a cambio de menos techo?
