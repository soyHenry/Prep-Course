# Brand Icons — iconos animados con identidad propia

Familia de iconos animados estilo Lordicon: mismo lienzo, mismo trazo, dos colores
y el mismo vocabulario de movimiento. Se exportan como Lottie (`lottie.json`).

Basado en el reproductor Skia Skottie de [diffusionstudio/lottie](https://github.com/diffusionstudio/lottie) (MIT, ver `LICENSE`).

## Puesta en marcha

```bash
cd icons
npm install        # también copia canvaskit.wasm a public/
npm run dev        # reproductor en http://localhost:3030
```

## Crear un icono

```bash
npm run icon -- lucide:bell --preset reveal,attention
npm run icon -- tabler:heart --preset heartbeat --accent 0
npm run icon -- ./mi-icono.svg --name mi-icono --preset reveal
```

- Fuentes: `lucide:<nombre>` (~2.000), `tabler:<nombre>` (~5.000) o cualquier SVG de trazo de 24×24.
- `--preset`: `reveal` (dibujo + pop), `attention` (vaivén), `jump` (salto),
  `loading` (giro), `heartbeat` (latido). También se pueden encadenar pasos sueltos:
  `draw`, `pop`, `wiggle`, `bounce`, `spin`, `pulse`.
- `--accent`: índices de los elementos en color secundario (por defecto, el detalle
  más pequeño; `none` para monocromo).

Resultado: `public/projects/brand-icons/<nombre>/lottie.json`, visible en el reproductor,
con los controles *Primary color*, *Secondary color* y *Stroke width*.

## Vista previa

```bash
npm run icons:snap -- bell     # previews/bell.png (requiere npm run dev)
```

## Cambiar la identidad

Edita `brand/identity.json` (colores, grosor, velocidades, curvas, presets) y regenera toda la familia:

```bash
npm run icons:build
```

## Usar en una web

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
<div id="bell" style="width:64px;height:64px"></div>
<script>
  const anim = lottie.loadAnimation({ container: bell, renderer: 'svg', loop: false, autoplay: false, path: 'bell/lottie.json' })
  bell.addEventListener('mouseenter', () => anim.goToAndPlay(0, true))
</script>
```
