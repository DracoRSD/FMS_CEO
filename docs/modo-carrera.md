# Modo carrera · diseño

Documento de diseño, sin código. La visión completa de la carrera, con las seis fases que faltan (entrenamiento en temporada, mercado, billetera y patrocinadores, entrevistas y retos, redes con memoria, retiro y Salón), está en la sección 12. Describe cómo encajar en FMS CEO un modo en el que el jugador no dirige la empresa sino a **un solo freestyler**, desde el Under hasta el retiro, en el mismo mundo de 344 reales con sus ligas, torneos, progresión y relevo generacional.

Decisiones ya tomadas por el autor del juego:

- Modo aparte en el mismo mundo. Sin empresa, plantillas ni sueldos.
- Las ligas y torneos corren solos con el auto-fichaje.
- El jugador crea nombre, país y estilo y reparte puntos entre los cinco atributos.
- Empieza abajo, en el Under.
- Cada temporada elige qué atributo entrena y a qué torneos se presenta, y recibe ofertas de patrocinadores y de ligas.
- Termina al retirarse, por decisión propia o por edad, con un Salón de la fama.
- World Series queda apagada en la primera versión.
- La inscripción en un torneo garantiza la plaza (no se entra por el sorteo de los reales).
- El potencial del jugador es fijo y oculto: 92.
- Las ofertas de liga se miden por país, con las 7 ligas por separado, porque el décimo mejor tiene nivel 84 en España y 74 en México.

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

La fama se mueve en las ligas (`endSeason`: +8 campeón, +4 podio) y en los torneos al jugarse (5.3). Quien no está fichado en ninguna liga ya no pierde un punto fijo: su fama tiende hacia su nivel (`famaSinLiga`: si lo supera baja un 15 % de la distancia por año, al menos 1 punto; si está por debajo sube un 30 % de la distancia, el valor más bajo que con los torneos mantiene la fama del top 100 a ±3 en las semillas 1, 2, 3 y 7 y los dos mundos; con 0,25 la carrera de la semilla 1 queda a −3,9). Sin esa regla el relevo de la fase 6 hundía la fama media del top 100 de 85 a 40 en 20 temporadas; con ella y los torneos queda a ±3. Para que un novato suba por la escalera, además, **ganar torneos da fama** (5.3).

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
  stars: 5, infinite: true,      // 7 ligas e Internacional desde el año 1 (World Series apagada)
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
- Potencial `POT_CARRERA = 92`, fijo y oculto para todos (decidido). Es alto a propósito: la historia debe poder llegar arriba, y el ritmo lo ponen el entrenamiento y la actividad.

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

Constantes en el bloque del modelo: `ENTRENO_JOVEN = 7`, `ENTRENO_MADUREZ = 1.0`, `ENTRENO_VETERANO = 0.5` (fracción del declive), `ENTRENO_REPETICION = 3`, `POT_CARRERA = 92`. El empujón va concentrado en los años jóvenes: calibrado con la escalera (sección 8), con 1,5 de joven el activo llegaba a su primera liga solo media temporada antes que el pasivo; con 7 llega de 1,5 a 2,5 antes en cinco países (una en México y Perú, donde el tope de crecimiento joven marca el paso) y su nivel a los 10 años se queda en 88-89,5. Subir la madurez separa lo mismo y pasa de 90.

### 5.3 Fama por torneos

Antes solo las ligas y Red Bull (+5/+2/+1 al podio nacional, Plazas incluido, y +10/+4/+2 en la Internacional) movían la fama; el Under y Monster Fu daban solo hype. Para que la escalera funcione, en todos los modos los torneos dan fama **en el momento de jugarse** (así cuenta para los comodines de la Internacional y la elegibilidad del Under de ese mismo año), con las constantes `FAMA_*` del bloque del modelo: Under +3 al campeón y +1 al finalista, Monster Fu +1 por batalla ganada, Red Bull nacional +6 / +3 / +2 al podio, Plazas +3 al campeón, Red Bull Internacional +12 / +6 / +4, y cada batalla ganada en cualquier cuadro (Red Bull, Plazas, las dos Internacionales y el Under) +0,5; los medios puntos se acumulan en `famaResto` y la fama guardada sigue siendo entera. Las cifras de Red Bull sustituyen a las anteriores. Es un cambio de reglas del juego base y se valida con `npm run simular`: el favorito en liga debe seguir ≤ 70 %, el informe de relevo en verde, y la fama media del top 100 y el salario medio del top 60 a 20 años dentro de sus tolerancias (sección 1.1).

### 5.4 Escalera de acceso vista desde el jugador

| Peldaño | Condición para inscribirse | Qué garantiza |
|---|---|---|
| Under de su país y BDM | sin tope de fama para el jugador (el resto, 83-85); con liga, si no choca con sus jornadas | plaza fija en el cuadro de 16 |
| Monster Fu | ser de España, fama ≤ 83 | plaza en una de las 3 fechas |
| Red Bull nacional de su país | siempre | plaza fija entre los 16 |
| Torneo de Plazas | fama ≤ 83 | plaza fija si su país no la ocupa ya |
| Red Bull Internacional | ganar la nacional, podio anterior o estar entre los 3 de más fama | automático |
| Liga FMS | oferta relativa al país (5.5) | plaza en la plantilla si acepta |
| FMS Internacional | clasificación de liga | automático |

La inscripción garantiza la plaza (decidido): el jugador no pasa por `underPick` ni por `probPick`, ocupa un cupo fijo y el sorteo reparte los 15 restantes. Un jugador libre (sin liga) puede inscribirse en todo lo demás a la vez; con liga, solo en Red Bull nacional y Plazas, como hacen los reales. Plazas es para quien no juega su nacional: inscrito en la nacional, Plazas deja de estar disponible. Y al revés también: los jugadores **no entran en ningún sorteo al azar**, así que si no se inscriben no juegan (Red Bull Internacional sigue siendo automática). En Monster Fu cada inscrito juega una de las tres fechas. Las decisiones viven en el freestyler (`f.plan`: `liga`, `entreno`, `inscrito`, `ofertas`, `racha`) para que el simulador pueda llevar varios jugadores en un mismo mundo; `torneosDelJugador` da la lista con la aptitud y el motivo.

### 5.5 Regla de oferta de liga, relativa al país

El auto-fichaje elige por nivel dentro del país de cada liga, así que el listón de entrada no es un número fijo: el décimo mejor de España tiene nivel 84 y el de México 74. Una regla absoluta («nivel ≥ 80») haría imposible España y regalaría México. Por eso la oferta es **relativa al país**:

- En cada pretemporada, para cada una de las 7 ligas, se ordena a los activos del país de la liga por nivel (el mismo orden que usa el auto-fichaje). Sea `p` el puesto del jugador en esa lista.
- Oferta segura si `p ≤ 10`: el auto-fichaje lo ficharía de todos modos.
- «Apuesta de la liga» si `11 ≤ p ≤ 14`: la liga ofrece con probabilidad 50 %, y el jugador ocupa la plaza del décimo.
- Solo las ligas de **su país** ofrecen; una liga ficha extranjeros únicamente cuando le faltan locales, y en carrera eso no pasa. Caribe agrupa varios países pequeños, así que el jugador caribeño compite por puesto con todos ellos.

Consecuencia: el tiempo hasta la primera oferta depende del país. Con los niveles del pool actual, entrar a España exige unos 84 puntos y a México unos 74; con el crecimiento joven (+3 por atributo y año más el entrenamiento) un jugador de México recibe oferta hacia la temporada 4-5 y uno de España hacia la 7-8. Esa diferencia es deseable (España es la liga más dura), pero los criterios de la fase C3 se miden por país para que ninguna quede fuera del rango.

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

Cada fase termina con `npm run simular` en verde (incluido lo nuevo) y commits pequeños. Las cifras de carrera se miden con `--carreras 10`: diez mundos de carrera (semillas 1 a 10) de 20 temporadas, cada uno con **un jugador pasivo y uno activo por país de liga** (14 jugadores, todos con 60 en cada atributo). El pasivo no entrena, el activo entrena su atributo más bajo; los dos se inscriben en todo lo que pueden y aceptan la primera oferta de liga. Cada país y perfil da así 10 muestras por ejecución.

### Fase C1 · El mundo corre solo

- Commits: `autoPretemporada` (fechas, hosts, sede y fecha de la Internacional); `autoFicharLigas` sin dinero; auto-voto de Red Bull; flag `--carrera` en el simulador que crea un mundo de carrera y lo hace avanzar 20 años con `advance('year')`.
- Criterios: 20 temporadas seguidas sin ninguna pausa ni error en las 4 semillas; las 7 ligas arrancan cada año con 10 fichados y 9 fechas; el favorito en liga sigue ≤ 70 % y el informe de relevo sigue en verde.

### Fase C2 · Partida de carrera y guardado

- Commits: `modo` y dbv 8 con migración; clave `fms_ceo_carrera_v1` en `save`, `load`, exportar e importar; pantalla de inicio con las dos partidas; pantalla de creación (nombre, país, estilo, 300 puntos); `jugador:true` y exención de retiro.
- Criterios: una partida CEO de dbv 7 carga y queda en dbv 8 sin cambios de nivel ni atributos; CEO y carrera guardadas a la vez y se abren ambas; exportar e importar una carrera la deja idéntica; el reparto de puntos siempre produce nivel = media de atributos.

### Fase C3 · Escalera, inscripciones y entrenamiento

- Commits: C3a, fama por torneos en todos los modos (hecha, con la deflación de fama); C3b, plan del jugador y ofertas de liga por país, plaza fija en Under, Monster Fu, Red Bull y Plazas, entrenamiento en la progresión, pantalla provisional con liga, entrenamiento y torneos, y medición con `--carreras`.
- Criterios, medidos **por país** con las 7 ligas por separado (España, Argentina, México, Chile, Perú, Colombia y Caribe, con un dominicano) sobre las 10 muestras por país y perfil: el pasivo recibe su primera oferta de liga entre la temporada 6 y la 11 en al menos 8 de 10, nunca antes de la 3, y su mediana queda dentro de ese rango; el activo entre la 4 y la 8 con las mismas condiciones; la mediana del activo llega al menos 1,5 temporadas antes que la del pasivo en 5 de los 7 países y al menos 1 en todos (rangos fijados con las cifras medidas tras calibrar el entrenamiento: el pasivo no se acelera); la mediana de España y la del país más blando no se separan más de 3 temporadas, y si se separan se ajusta la apuesta de la liga (`11 ≤ p ≤ 14`, 50 %) antes que el entrenamiento; la mediana de nivel del activo a los 10 años entre 84 y 90 en todos los países; el favorito en liga ≤ 70 %, el relevo y la fama en verde. El simulador imprime una fila por país: mediana, percentiles 10 y 90 y cuántas de las 10 quedan dentro, para el pasivo y el activo, más el nivel del activo a los 10 años y las temporadas en liga.

### Fase C4 · Interfaz de temporada

- Commits: `simulateDay(auto, soloFid)` separa decisiones de CEO (se resuelven solas en carrera) y presentaciones (line up, cruces, shows), con `pasoCarrera(modo)` y los botones «Siguiente fecha», «Hasta mi próxima batalla» y «Saltar el resto del año»; pausa «Tu batalla» con `showBattle` tal cual (o «Tu torneo» con varias el mismo día); registro sin textos de empresa y resumen personal al cerrar; próximo compromiso y rivales con récord a partir de los datos; calendario con la marca «Tú» y el panel de torneos (inscrito, sin inscribir o por qué no entras); comprobación en el simulador.
- Criterios: con «Saltar el resto del año» cero pausas; 20 temporadas seguidas sin errores en los dos recorridos; en «Hasta mi próxima batalla» cada parada concierne al jugador y cada batalla suya tiene su pausa «Tu batalla» (el simulador cuenta `s.pausasJugador` contra `batallasDe`); ninguna entrada del registro de una carrera habla de taquilla, euros, reputación, estrellas, caja, patrocinio o plantilla. Las decisiones del jugador siguen siendo las de la pretemporada (liga, entrenamiento, torneos); el patrocinador llega en C5.

### Fase C5 · Patrocinadores

- Commits: ofertas personales con `SPONSOR_BRANDS` según fama (1 oferta con fama < 40, 2 con < 70, 3 después), pago por temporada y prima por título; dinero como marcador en el panel y el resumen.
- Criterios: el pasivo acumula entre 50 K y 300 K a los 10 años; el activo entre 150 K y 800 K; ninguna oferta repite marca mientras esté vigente.

### Fase C6 · Retiro y Salón de la fama

- Commits: retiro propio y por edad con aviso de última temporada; pantalla del Salón con rango y curva; galería `fms_ceo_salon`; partida en solo lectura.
- Criterios: en 50 carreras pasivas la edad de retiro queda entre 14 y 20 años de experiencia. La mediana objetivo (16 a 18) es provisional: `RET_JUGADOR_MULT` y el umbral de nivel se calibran en C6 con el simulador, porque la fase 6 ya mostró que estas probabilidades por año se desvían del cálculo a mano cuando se encadenan con el declive. El rango del pasivo es Promesa o Figura en al menos el 80 % y el del activo Figura o Referente en al menos el 60 %; una carrera cerrada se reabre desde la galería sin errores.

## 10. Fase T · Las redes comentan la carrera

Los tuits del juego (line up, cruces, campeón) salían de 3 a 6 plantillas por categoría y en una temporada el 60 % repetía plantilla. La fase T hace dos cosas: baja esa repetición en todo el juego y pone a las redes a hablar del jugador.

- **Anti-repetición, en los dos modos.** `s.twUsados` registra por temporada las plantillas usadas y `twElige` elige siempre entre las menos usadas; `s.twTextos` cuenta los textos exactos y `twUnico` añade un remate del país cuando uno ya salió 3 veces (`TW_TOPE`). Las categorías de cruces que más se repetían se **componen**: arranque y remate con la muletilla del país del autor (`TWX_PRE`, `TWX_POST`) más una frase de un fondo por grupo (`TWX_CORE`, España con vosotros y el resto con ustedes). Medida en el simulador con la semilla 1 (`TW_BASE_PLANTILLA`): de 60,2 % a 20,2 % de plantilla repetida dentro de la temporada, límite 24,1 %, y ningún texto exacto más de 3 veces.
- **Redes de la carrera.** `company.carrera.redes = {fans, haters, racha, feed, hitos}`; el feed guarda los últimos 60 tuits (unos 15 KB) y el panel enseña 30. Tras cada batalla del jugador, `twCarreraBatalla` genera reacciones con datos reales: rival, votos de los jueces, competición, racha, nivel del rival y fama. Siempre al menos un tuit: de desconocido (fama < 30, sin fans) son dudas de cuentas de su país; el volumen sube con la fama (1, 2-3, 3-5, 5-8 y 8-12 por batalla en los tramos 30, 50, 70 y 85) y el tono lo ponen fans, haters, medios ficticios del país (`MEDIOS_PAIS`) y reaccionadores (`REACCIONADORES`). Ganar a alguien con 5 o más de nivel (`REDES_SORPRESA`) da fans y tuits de sorpresa; perder con uno con 8 menos (`REDES_BATACAZO`) da haters. Fans y haters son cuentas reales del juego asignadas al jugador, con tope 15 y 8.
- **Eventos e hitos.** `twCarreraEvento` reacciona a la oferta de liga, la no renovación, la clasificación a la Internacional, cada título y subir o bajar 2 o más de nivel al cierre. Siete hitos de una sola vez (`HITOS`, guardados con el año en `redes.hitos`) con el doble de volumen: debut, primera victoria, primera liga, primer título, primera Internacional, top 10 y top 1 de su país por nivel.
- **Dónde se ve.** Bloque «Las redes» dentro de «Tu batalla» (showBattle intacto por dentro), panel «Redes» en Mi carrera y «Las redes este año» en el resumen personal.
- **Criterios (simulador, mundo de carrera de 20 temporadas con la semilla 1):** plantilla repetida un 60 % por debajo de la base, ningún texto exacto más de 3 veces por temporada, al menos un tuit por batalla del jugador, las batallas con fama de 85 o más reciben al menos el doble de tuits que las de fama menor de 50 (`REDES_CRECE`), feed dentro del tope, guardado bajo 1,5 MB, favorito en liga ≤ 70 % y relevo en verde.

## 11. Fase torneos · Más batallas en la carrera

Medido antes de la fase (semilla 1, jugador con 60 en todo): libre, de 3 a 7 batallas por temporada según el país (Perú, Colombia y Caribe no tienen Under nacional y solo juegan Red Bull y BDM); con liga, de 10 a 13. Tres cambios, solo en modo carrera:

- **Circuito local por país** (`LOCAL_DEFS`): 3 o 4 torneos al año por país de liga, de 8 o 16, fama máxima 70 (`LOCAL_FAMA_MAX`), +1 de fama al campeón, +0,25 por victoria de cuadro y +2 de hype. Nombres ficticios salvo Combate Mortal Freestyle (CMF) en el Caribe, con 16. Van en `s.under` con los Under y se generan en `underGenerate` solo si `modoCarrera()`: el modo CEO no cambia. Participan activos del país sin liga; si no hay 16 aptos el torneo baja a 8. Los locales de otros países no paran «Siguiente fecha» y los del país del jugador se abren con el cuadro en modal. En las temporadas cerradas, `aligerarLocales` deja los locales que no jugó el jugador en campeón, finalista y tercero (los suyos se conservan enteros), para dejar sitio en el guardado a patrocinadores y Salón de la fama.
- **Con liga, hasta tres torneos más** (`LIGA_TORNEOS_EXTRA`): Under o locales, siempre que no caigan a 2 días o menos (`LIGA_CHOQUE_DIAS`) de una jornada suya. Las fechas de liga se fijan al empezar la temporada, así que el choque se detecta en el sorteo y deja al jugador fuera de ese torneo; la pantalla y el calendario lo dicen. Monster Fu sigue cerrado con liga.
- **Invitaciones a exhibiciones** (`invitacionesExhibicion`, al arrancar la temporada): por jornada de las ligas de su país, 10 % entre 40 y 69 de fama con tope 2 al año, 20 % desde 70 con tope 3 y también de otras ligas; con liga, solo de otras ligas y sin chocar. Rival del país sin liga y fama a ±15. Reutiliza `L.fexhib`; la exhibición ganada da +1 de fama. Interruptor «Aceptar invitaciones a exhibiciones» en la pretemporada, encendido por defecto.
- **Criterios (simulador, 14 jugadores × 10 semillas × 20 temporadas, media por país):** libre entre 10 y 14 batallas por temporada en los países con Under nacional (España, Argentina, México, Chile) y entre 8 y 12 en los demás; con liga entre 13 y 19 (el jugador entra al Under sin tope de fama y eso suma 4 o 5 batallas al año con liga); el mundo de CEO sin torneos locales; favorito en liga ≤ 70 %, relevo y fama en verde. La escalera (sección 8, C3) sigue pendiente de calibrar.

## 12. Visión · vivir la vida de un freestyler

La carrera tiene que sentirse como el modo carrera del FIFA: un freestyler con nombre que empieza en un local de barrio y, temporada a temporada, entrena, firma contratos, gana dinero, habla con la prensa, se gana fans y haters, cambia de país, levanta títulos y se retira con un sitio en el Salón de la fama. Lo que hay hoy (C1 a C4, T y torneos) es el esqueleto: el mundo corre solo, el jugador elige liga, entrenamiento y torneos en la pretemporada, juega fecha a fecha y las redes le comentan. Esta sección fija las seis fases siguientes, en orden, con reglas, cifras y criterios medibles. Cada una es una rama propia y acaba con `npm run simular` en verde con salida 0 en las semillas 1, 2 y 3.

### 12.0 Invariantes de todas las fases

- **Escalera** (sección 8, C3, calibrada): pasivo con primera oferta entre T6 y T11, activo entre T4 y T8, 8 de 10 dentro, nunca antes de T3, activo al menos 1,5 temporadas antes que el pasivo en 5 de 7 países y 1 en todos, nivel del activo a los 10 años entre 84 y 90, España y el país más blando a 3 temporadas o menos. Ninguna fase puede adelantar la primera oferta del pasivo más de 0,5 temporadas, medida como la media de las 10 muestras por país frente a la misma medida sin la fase (la mediana de 10 muestras salta una temporada entera por azar): la carrera no se acelera.
- **Mundo**: favorito en liga ≤ 70 %, relevo en verde, fama media del top 100 a ±3 y salario del top 60 a ±15 % a los 20 años, 7 ligas con 10 y 9 fechas, Internacional con 16 distintos.
- **Batallas** (sección 11): libre 10-14 con Under nacional y 8-12 sin él, con liga 13-19.
- **Redes** (sección 10): repetición de plantilla ≤ 24,1 %, ningún texto más de 3 veces por temporada, al menos un tuit por batalla, ×2 entre fama < 50 y ≥ 85.
- **Guardado** bajo 1,5 MB a 20 temporadas. Hoy la carrera ocupa 1.290 KB, así que quedan unos 245 KB para todo lo nuevo. Presupuesto por fase, medido en el simulador al final de cada una: D1 10 KB, D2 15 KB, D3 15 KB, D4 30 KB, D5 20 KB, D6 25 KB (115 KB en total; el resto es margen). Lo que crezca por temporada va a las temporadas ligeras o se acota con un tope de entradas.
- **Pausas**: con «Saltar el resto del año» cero pausas; todo lo nuevo tiene un valor por defecto sensato y se puede ignorar. Las decisiones del jugador por temporada pasan de 4 (liga, entrenamiento, torneos, exhibiciones) a como mucho 8, y ninguna es obligatoria.
- **Modo CEO**: nada de esto cambia el juego de empresa; todo va detrás de `modoCarrera()`.

### 12.1 Fase D1 · Entrenamiento usable durante la temporada

Hoy el entrenamiento es un atributo elegido en pretemporada y un empujón al cierre (`ENTRENO_JOVEN = 7`, `ENTRENO_MADUREZ = 1`). Pasa a vivirse mes a mes sin cambiar la suma anual, para que la escalera no se mueva.

- **Sesiones por mes**: cada mes el jugador tiene 4 sesiones (`SESIONES_MES = 4`) que reparte entre tres cosas: *entrenar* un atributo, *sparring* y *descanso*. El plan del mes se repite solo si no se toca; en la pretemporada se fija el plan por defecto («entrenar el más bajo, 1 descanso»). **Cada sesión de entrenamiento sube el atributo en el momento**, no al cerrar el año: de joven `ENTRENO_JOVEN / (12 × SESIONES_MES)` = 7 / 48 ≈ 0,15 por sesión, en la madurez 1 / 48 ≈ 0,02, y de veterano cada sesión descuenta una parte proporcional del declive de ese atributo. Los atributos del jugador guardan décimas (`f.attrs` con un decimal para `jugador:true`; el resto del pool sigue en enteros), la barra de la ficha enseña las décimas (63,4) y el nivel sigue siendo la media, mostrada también con una décima. Entrenar un solo atributo las 48 sesiones equivale al empujón anual de hoy, así que la escalera no se mueve; el empujón de cierre desaparece para el jugador. Se pueden tocar como mucho 3 atributos al año; la penalización por repetir tres años seguidos pasa a medirse por atributo con más del 50 % de las sesiones. El tope `pot + BOOST_OVER_POT` se aplica en cada sesión.
- **Sparring**: una sesión de sparring es una batalla de entrenamiento sin público contra un freestyler del país de nivel a ±5 del jugador (elegido por el juego). Da +0,1 de impro y +0,1 de mentalidad por sesión, con tope +1 al año cada una (dentro del tope `pot + BOOST_OVER_POT`), y descubre al rival: aparece en «Rivales» con su nivel y estilo.
- **Fatiga y forma**: `fatiga` de 0 a 100 en el jugador. Sube +8 por batalla oficial y +3 por sesión de entreno o sparring; baja −15 por sesión de descanso y −10 por mes sin batallas; nunca baja de 0. En cada batalla, por liga o por cuadro, fatiga ≥ 70 resta hasta −10 de nivel efectivo (lineal de 70 a 100); no hay premio por estar fresco (`FATIGA_PENAL = 10`, `FATIGA_BONUS = 0`). Medido sobre unas 2.000 batallas por perfil en la escalera: con −3 la diferencia de victorias entre descansar y no descansar era de 7 puntos, con −6 de 6 y con −10 de 12; un +1 por debajo de 30 daba ventaja al que no entrena y descansa siempre, y recortaba la separación activo-pasivo. La forma se enseña como barra en «Mi carrera» y en el próximo compromiso.
- **Nivel medio de cada torneo**: en la pantalla de inscripciones y en el panel de torneos del calendario, cada torneo muestra el nivel medio y el máximo de sus participantes del año pasado (o de los aptos de hoy si es nuevo) y el récord del jugador en él. La escalera se ve: un local de 8 con media 62, el Under con media 74, la liga con su décimo en 77 u 84.
- **Interfaz**: una pausa opcional «Plan del mes» el día 1 de cada mes en «Siguiente fecha» y «Hasta mi próxima batalla» (se puede desactivar en la pretemporada); en «Saltar el resto» no aparece.
- **Datos**: `plan.mes = {entreno:{attr:n}, sparring:n, descanso:n}`, `carrera.sesiones[año][mes]` acotado a la temporada en curso (las cerradas guardan solo el resumen anual: sesiones por atributo, sparrings, descansos), `f.fatiga`.
- **Criterios**: en la escalera el pasivo descansa las 4 sesiones (no entrena) y el activo usa el plan por defecto (3 entrenos del más bajo y 1 descanso), y los rangos de la sección 8 siguen en verde; en cada mundo de la escalera hay dos jugadores más de México con el mismo entreno (3 al mes), uno «sin descanso» (la cuarta sesión es sparring) y otro «con descanso»: sobre las 10 semillas, el primero cierra las temporadas con fatiga media ≥ 70 y gana al menos 10 puntos menos de porcentaje contra rivales a ±5 de nivel; el sparring no sube ningún atributo más de 1 al año; guardado +10 KB como mucho.

### 12.2 Fase D2 · Mercado: ligas de otros países y contratos

Hoy solo ofrecen las ligas del país del jugador y nadie cobra. Pasan a existir cupos de extranjeros y contratos con salario y duración; el dinero cae en la billetera de D3 (en D2 se acumula sin gastarse).

- **Plantillas por nivel cada año**: en carrera `preselectRoster` (la renovación automática de plantillas del modo CEO) no hace nada; antes renovaba a toda la plantilla anterior con la taquilla de la empresa fantasma, solo quedaban libres las plazas de los descensos y la liga que elegía el jugador no contaba.
- **Cupo de extranjeros**: cada liga nacional admite 1 extranjero (`CUPO_EXTRANJEROS = 1`; con 2 el pasivo de la escalera llegaba una temporada más tarde en México, Chile y Perú). El auto-fichaje de carrera llena 9 plazas con locales por nivel y la décima con un extranjero que supere en 3 o más de nivel al octavo local (`EXTRANJERO_MARGEN = 3`); medido, todas las ligas llevan siempre uno. Caribe no cuenta a los caribeños como extranjeros entre sí. Solo en carrera: el modo CEO no cambia.
- **Oferta extranjera al jugador**: desde fama ≥ 60 (`OFERTA_EXT_FAMA = 60`) y con al menos una temporada de liga jugada (`plan.ligasJugadas`; sin esa condición las ligas pequeñas fichaban a todos los jugadores de la escalera a T6, antes que su propia liga, y la carrera se aceleraba), al vencer el contrato o estando libre, una liga de otro país ofrece si el jugador queda entre sus 14 mejores contando al jugador (`puestoComoExtranjero`); p ≤ 10 segura, 11-14 apuesta al 50 %, como en 5.5. Como mucho 2 ofertas extranjeras por pretemporada (`OFERTA_EXT_MAX`), las de mayor salario, y cada liga ofrece a como mucho tantos jugadores de fuera como cupo tiene (los de más nivel); en el auto-fichaje los jugadores que aceptaron entran antes que nadie, pero los de fuera solo hasta el cupo. Con contrato en vigor las ligas interesadas quedan en `plan.interes` y las redes sueltan rumores («se dice que FMS Colombia sigue a…»); la cláusula para irse a mitad de contrato llega con la billetera en D3.
- **Contratos**: toda oferta trae salario anual y duración. Salario = `salaryOf(f)` × multiplicador de liga (`MULT_LIGA`: España 1,3, Argentina 1,1, México 1,0, Chile 0,9, Perú 0,85, Colombia 0,85, Caribe 0,8) × 1,25 si es extranjero (`FOREIGN_MULT`), redondeado a cientos. Medido: un recién llegado a FMS España desde el puesto 11 cobra 11,8 k, y las renovaciones de un top 8 suben a 18,7 k y 34,9 k. Duración a elegir entre 1, 2 y 3 años (`CONTRATO_ANOS`, 2 por defecto): salario fijo y la liga no puede no renovar mientras dure. Al vencer: renovación con el salario recalculado y la prima por puesto medio del contrato (`PRIMA_PUESTO`: top 3 +20 %, del 4.º al 7.º +5 %, el resto −10 %). La cláusula del 50 % para irse antes (`CLAUSULA`) queda para D3, cuando el dinero se pueda gastar. Las partidas de antes de D2 reciben un contrato de un año al arrancar. Reacciones con el generador de la fase T y diez frases por grupo: fichaje extranjero, rumor, renovación y último año de contrato.
- **Arraigo**: al cambiar de país, los patrocinadores locales (D3) tratan al jugador como si tuviera 10 de fama menos durante 2 temporadas (`ARRAIGO = 10`); las redes del país nuevo arrancan con dudas (D5).
- **Datos**: en el freestyler, como el resto del plan, para que los 14 jugadores del simulador tengan el suyo: `plan.contrato = {liga, salario, desde, hasta, extranjero, puestos}`, `plan.ofertas` con salario, `plan.anos`, `plan.interes`, `plan.arraigoHasta`, `plan.dinero` (ingresos acumulados, sin gastos hasta D3); la entrada de `carrera.temporadas` lleva el salario del año. Los extranjeros de una liga se derivan de los países.
- **Criterios**: con cupo 2, las 7 ligas siguen arrancando con 10 y la Internacional con 16 distintos; favorito, relevo y fama en verde; la mediana del pasivo en la escalera no se adelanta más de 0,5 temporadas (las ofertas extranjeras llegan después de la primera nacional porque exigen fama 60); al menos el 30 % de los 14 jugadores de la escalera reciben una oferta extranjera en 20 temporadas y al menos el 5 % cambian de país (el objetivo era el 10 %: con un extranjero por liga y las ofertas de fuera solo tras una temporada de liga, lo medido es el 5 %); el dinero acumulado del activo a los 10 años, solo con salario de liga, queda entre 80 k y 300 k y el del pasivo entre 30 k y 200 k (los premios y patrocinios de D3 subirán estos rangos hacia los de C5); la escalera mide la primera oferta de una liga del país del jugador; guardado +15 KB.

### 12.3 Fase D3 · Billetera, tienda y patrocinadores

Absorbe la fase C5 (sección 8). El dinero deja de ser un marcador: entra por contratos, premios, patrocinios y exhibiciones, y sale por la tienda y las cláusulas.

- **Billetera**: `moverDinero` lleva el saldo (`plan.dinero`, en el freestyler como el resto del plan, para que los jugadores del simulador tengan el suyo), los últimos 60 movimientos (`plan.movimientos`) y los totales del año por concepto (`plan.cuentas`, tres años). Panel «Billetera» en Mi carrera y balance del año en el resumen personal.
- **Ingresos**: salario de liga (D2); premios por torneo al campeón y finalista: local 1.500 / 500, Under 6.000 / 2.000, Red Bull nacional 15.000 / 5.000, Plazas 8.000 / 3.000, Red Bull Internacional 60.000 / 20.000, FMS Internacional 50.000 / 15.000 (`PREMIOS`); exhibición por invitación 1.000 + 2 % del salario de la liga que invita; patrocinadores.
- **Patrocinadores**: ofertas en pretemporada con `SPONSOR_BRANDS` según fama (1 oferta con fama < 40, 2 con < 70, 3 después, como mucho 3 contratos a la vez; la fama cuenta 10 menos durante el arraigo de D2), una por categoría (bebida, ropa, tecnología, otros, agrupando los sectores de las marcas) y nunca dos de la misma marca vigentes. Cada categoría da una ayuda mientras está vigente, que se ve en la oferta: bebida −5 de fatiga al mes, ropa +5 % de seguidores al año, tecnología +0,5 de fama por victoria (hasta +5 al año), otros sin ayuda pero un 25 % más de pago. Pago por temporada en curva de 1 k (fama 30) a 15 k (fama 95): con 3 k-60 k, como decía la primera versión, y una prima por cada título, el activo de la escalera pasaba de 1,46 M a los 10 años porque la fama del jugador llega pronto a 90-99. Prima igual al pago anual en la temporada en que gana un título que cuente (Under, Red Bull, Plazas, ligas e Internacionales; los locales no), y un objetivo («gana 8 batallas», «llega a una Internacional», «gana un título», «acaba entre los 3 primeros de tu liga») con bonus del 50 %. Duración 1 o 2 años. Por defecto se firman todas; se desmarcan en la pretemporada. Se pierden si la fama baja 15 por debajo de la que tenía al firmar o tras un escándalo de D4.
- **Tienda**: objetos con precio y efecto acotado, comprables en la pretemporada y entre meses: *pack de beats y productor* (+1 métrica, 8 k, máximo 2 al año), *coach mental* (+1 mentalidad, 10 k, máximo 1), *viaje a una jam internacional* (+1 impro, 6 k, máximo 1), *vídeo y edit viral* (+3 de fama y +10 % de seguidores, 5 k, máximo 1 por temporada), *merchandising* (+5 % de seguidores y 2 k de ingresos al año siguiente, 3 k). Los atributos de tienda respetan el tope `pot + BOOST_OVER_POT` y suman como mucho +3 de atributo al año (`TIENDA_TOPE_ATTR = 3`), para que el dinero ayude pero no sustituya al entrenamiento.
- **Interfaz**: panel «Billetera» en «Mi carrera» con saldo, ingresos y gastos del año; tienda y patrocinadores en la pretemporada; en el resumen personal, el balance del año.
- **Cláusula**: con contrato en vigor, las ligas de fuera interesadas pasan de rumor a oferta real con su coste, el 50 % de lo que queda de contrato contando la temporada que empieza (`CLAUSULA`). Se elige si hay dinero, se descuenta al empezar la temporada y las redes reaccionan (evento `clausula`). No hay cláusula para quedarse libre, y los jugadores del simulador nunca la pagan.
- **Datos** (en el freestyler): `plan.dinero`, `plan.movimientos` (60), `plan.cuentas`, `plan.sponsors`, `plan.spOfertas`, `plan.segMult`, `plan.compras[año]` (tres años), `plan.merch`.
- **Criterios**: dinero acumulado a los 10 años con la mediana al menos un 20 % por encima del suelo: activo entre 360 k y 800 k (medido 448 k, un 24 % por encima del suelo) y pasivo entre 210 k y 340 k (medido 266 k, un 26 % por encima; techo de C5 subido para dejar margen); los jugadores del simulador, con patrocinadores, no adelantan la primera oferta del pasivo más de 0,5 de media respecto a antes de D3; un perfil «comprador» (activo de México que gasta en atributos todo lo que la tienda deja) no adelanta su primera oferta más de 0,5 respecto al activo ni pasa de 90 de nivel a los 10 años; ninguna oferta repite marca vigente; cambio de país al menos el 3 % (medido 4,3 %); la oferta extranjera la reciben el 86 % porque ahora cuentan también las que llegan con cláusula, que van detrás de las de jugadores libres en el cupo de cada liga; favorito, relevo y fama en verde; guardado +15 KB.

### 12.4 Fase D4 · Entrevistas, ruedas de prensa y retos

El jugador habla. Lo que dice mueve fans, haters, fama y mentalidad, y puede acabar en una batalla.

- **Cuándo**: entrevista tras «Tu batalla» con fama ≥ 40 en el 30 % de las batallas y siempre tras un título o un hito; rueda de prensa antes de una Internacional o de la final de una Red Bull con el jugador dentro; entrevista de pretemporada cuando hay oferta de liga o cambio de país. **Con fama menor de 40** también se vive desde el Under: un medio pequeño del país (los mismos `MEDIOS_PAIS`, o un canal de barrio ficticio por país) entrevista en el 10 % de las batallas y siempre tras el primer título o la primera victoria, con 1 pregunta y efectos a la mitad (fama ±2 y fans y haters ±2 por temporada; la mentalidad igual). Cada entrevista es 1 o 2 preguntas con 3 respuestas: *humilde*, *picante* y *neutra*.
- **Efectos** (por respuesta, acotados por temporada): humilde +1 fan, +0,2 de mentalidad; picante +1 de fama, +1 o 2 haters, +0,5 de mentalidad y «presión»: si pierde la siguiente batalla, −2 de fama y +2 haters; neutra nada. Topes por temporada: fama ±5, mentalidad ±1,5 (dentro del tope del empujón), fans y haters ±6. La respuesta por defecto es la neutra, así «Saltar el resto» no habla por ti.
- **Retos públicos**: desde fama ≥ 50 (`RETO_FAMA = 50`), una vez al mes el jugador puede retar a un freestyler activo. El retado acepta con probabilidad 0,8 si está a ±10 de fama, 0,4 si tiene más de 10 de fama que el jugador y 0,95 si ya son rivales. Un reto aceptado se juega como exhibición en el siguiente evento donde ambos puedan (jornada de liga de cualquiera de los dos, Under o local del país) y hasta 2 retos por temporada se juegan en un evento propio «Cara a cara». Ganar da +3 de fama y +2 fans; perder +2 haters; un reto rechazado resta 1 de fama al retado si tiene menos fama que el jugador. Tres cruces en 2 temporadas con la misma persona crean rivalidad (`isRival` ya existe para los reales) y las redes la cuentan.
- **Escándalo**: tres respuestas picantes seguidas con derrota abren un «escándalo» de una temporada: −5 de fama, +4 haters y el patrocinador de la categoría «ropa» o «bebida» se va. Es raro a propósito y siempre consecuencia de decisiones.
- **Interfaz**: la entrevista es un modal al cerrar «Tu batalla» o antes del show; los retos se lanzan desde la ficha del rival o desde «Rivales»; el historial de declaraciones va en «Mi carrera».
- **Datos**: `carrera.entrevistas` acotado a 40 entradas `{año, día, contexto, pregunta, respuesta, efecto}`, `carrera.retos` acotado a 20, `carrera.presion`.
- **Criterios**: en el simulador dos perfiles de 20 temporadas, «humilde» y «bocazas» (siempre picante): el bocazas acaba con al menos el doble de haters y entre 3 y 8 de fama más al año que el humilde; ninguno gana más de 5 de fama al año por entrevistas; el 60 % o más de los retos a ±10 de fama acaban en batalla y ninguno se queda pendiente al cerrar el año; con «Saltar el resto» cero pausas; escalera, favorito, relevo y fama en verde; guardado +30 KB.

### 12.5 Fase D5 · Redes que leen la historia real de la carrera

Hoy las redes reaccionan a la batalla y a los hitos. Pasan a tener memoria: leen títulos, racha, puesto, revanchas, entrevistas y retos, y lo dicen.

- **Contexto por batalla**: antes de generar las reacciones, un resumen `ctx` del momento: revancha (el rival ganó el último cruce), racha (3 o más), puesto en la liga (líder, en zona de descenso, pelea por el título), título que se defiende, última entrevista (si fue picante, se le recuerda), reto pendiente o cumplido, extranjero en liga nueva (arraigo), rivalidad, número de cruces con ese rival y balance. Cada tuit lleva la etiqueta del contexto que usa (`t.ctx`).
- **Plantillas con memoria**: por cada contexto, 10 frases por grupo (vosotros / ustedes) con los mismos arranques y remates por país, y las cuentas con memoria propia: el hater recuerda la entrevista, el medio del país recuerda el puesto, el fan recuerda la revancha. Las entrevistas picantes generan réplicas del retado o del rival en su propia voz.
- **Temporada en perspectiva**: al cierre, las redes resumen el año con datos (récord, títulos, puesto, mejor racha, batalla del año por visitas) y, al final de la carrera (D6), la cuentan entera.
- **Criterios**: al menos el 60 % de las reacciones de batalla con liga llevan un contexto distinto de «ninguno»; cada contexto que se da al menos 10 veces en 20 temporadas tiene al menos 10 textos distintos; repetición de plantilla ≤ 24,1 % y ningún texto más de 3 veces; ×2 entre fama < 50 y ≥ 85; el feed guardado sigue en 60 tuits (≤ 20 KB); escalera, favorito, relevo y fama en verde.

### 12.6 Fase D6 · Retiro y Salón de la fama

Absorbe la fase C6 (sección 8) y cierra la historia.

- **Retiro propio**: desde 8 temporadas de experiencia, botón «Retirarme al acabar esta temporada» en la pretemporada; la temporada de despedida se anuncia y trae homenajes en redes y una jornada de despedida (exhibición en su liga o en el torneo de su país que elija).
- **Retiro por edad**: desde 12 temporadas se tira cada año `retiroProb` con `RET_JUGADOR_MULT = 0.6`; forzoso a las 20 o si el nivel baja de 55; cuando la probabilidad del año que viene supera el 50 % se avisa «última temporada» con un año de margen. Las dos cifras se calibran con el simulador para que el pasivo se retire entre las 14 y las 20 temporadas con mediana de 16 a 18.
- **Salón de la fama**: puntos por títulos (liga 10, FMS Internacional 20, Red Bull nacional 6, Red Bull Internacional 15, Plazas 4, Under 2, local 0,5), por temporadas en liga (1 por temporada), por ser número 1 de su país (5 por año), por la Internacional (3 por clasificación) y por el dinero (1 por cada 100 k). Rangos: Promesa (< 20), Figura (20 a 59), Referente (60 a 119), Leyenda (120 o más). La pantalla del Salón muestra rango, curva de nivel y fama por temporada, títulos, récord total, rivales, mejores batallas, dinero, patrocinadores y el resumen que escriben las redes (D5).
- **Galería y solo lectura**: la carrera cerrada se guarda en `fms_ceo_salon` como ficha de 5 KB como mucho (nombre, país, estilo, años, rango, puntos, títulos, curva, récord, dinero) y la galería guarda hasta 10 carreras; la partida completa queda en solo lectura y se puede reabrir para mirar sin jugar. Al cerrar, se ofrece empezar otra carrera en el mismo mundo (el pool sigue envejeciendo) o en uno nuevo.
- **Criterios**: en las 10 semillas de la escalera el pasivo se retira entre las 14 y las 20 temporadas con mediana entre 16 y 18; el rango del pasivo es Promesa o Figura en al menos el 80 % y el del activo Figura o Referente en al menos el 60 %; una carrera cerrada se reabre desde la galería sin errores y no se puede modificar; la galería con 10 fichas no pasa de 50 KB; guardado +25 KB.

### 12.7 Orden, dependencias y lo que queda fuera

El orden es el de arriba porque cada fase alimenta a la siguiente: D1 da forma y sparring que D4 y D5 pueden contar; D2 da contratos y dinero que D3 gasta; D3 da patrocinadores que D4 puede perder; D4 da entrevistas y retos que D5 lee; D6 recoge todo. Antes de D1 se une la rama de torneos (hecho) y se mantiene la regla de una fase por rama, plan primero, commits pequeños y simulador en verde. Quedan fuera de esta visión, a propósito: World Series en carrera, varias carreras a la vez, modo en línea o comparación con otros jugadores, y cualquier cambio del motor de batallas.

## 9. Decisiones cerradas

Las tres preguntas abiertas de la primera versión ya están respondidas y recogidas al principio del documento:

1. World Series apagada en la primera versión; se revisa cuando el modo esté jugable.
2. La inscripción garantiza la plaza en Under, Monster Fu, Red Bull nacional y Plazas.
3. Potencial fijo y oculto en 92 para todos.

Queda por calibrar con el simulador, no por decidir: la apuesta de la liga (5.5) si algún país se sale del rango de C3, y la mediana del retiro por edad en C6.
