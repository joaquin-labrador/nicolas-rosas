# Nicolás Rosas · Portfolio deportivo

Landing en **React 19 + TypeScript + Vite**. Diseñada en rojo y blanco, con las siete fotografías facilitadas, para presentar al jugador ante clubes, ojeadores y agencias. Sin backend, cuentas ni envío de formularios.

## Abrir la página ahora

En la entrega local, abrí **ABRIR.html** con doble clic. Conservá la carpeta `dist` junto a ese archivo: contiene las fotografías. No hace falta instalar nada para esta vista local. Las fuentes tipográficas usan Google Fonts y requieren conexión; sin ella se usan fuentes de respaldo.

Si clonaste el código desde GitHub, ejecutá primero `npm ci` y `npm run build` para generar `ABRIR.html` y `dist/`. Esos archivos generados no se guardan en el repositorio.

También hay una compilación convencional en `dist/`, lista para alojarse como web estática. Abrir `dist/index.html` directamente puede bloquear los módulos por las restricciones `file://` del navegador: para ese caso usá `ABRIR.html`.

## Desarrollo

Requisitos: Node.js 22.13 o posterior y npm.

```sh
npm install
npm run dev
```

Para comprobar la producción:

```sh
npm run build
npm run preview
```

Abrí la dirección que indique Vite (normalmente `http://127.0.0.1:4173/` para preview). En un entorno con restricciones que impidan al optimizador de Vite leer directorios, usá la compilación y `preview`; el build de producción no necesita el optimizador de desarrollo. La configuración nativa evita también empaquetar `vite.config.mjs` con esbuild.

## Qué incluye

- Diseño adaptable a móvil, tableta y escritorio, con navegación y animaciones discretas que respetan movimiento reducido.
- Ficha deportiva, edad calculada desde 29.11.2005 y contacto público en **@nicorosasd**, facilitado por el usuario.
- Trayectoria interactiva: formación argentina, experiencia formativa en Turquía, CD Proas, Conxo, Compostela, Negreira, Céltiga y Silva.
- Estadísticas **Silva 2025/26** contrastadas con el propio club: 6 partidos, 6 titularidades, 460 minutos. El 100% como titular es 6/6.
- Galería de siete fotos con ampliación, flechas, Escape, control de foco y créditos originales conservados en las imágenes completas.
- Sección de vídeo preparada editorialmente; todavía no se recibió ningún vídeo.
- Ficha limpia para imprimir o guardar como PDF desde **Guardar ficha deportiva**. La impresión depende del navegador y su cuadro de diálogo.
- Propuesta profesional que se prepara y copia localmente para pegar por DM en Instagram. **No envía mensajes automáticamente y no almacena datos**.
- Canales externos para consultar resultados, noticias y programación. No se afirma una retransmisión sin confirmación.
- Conexión opcional a un feed público validado, con actualización mientras la pestaña está visible y caducidad de datos.

## Editar contenido

- `src/data/player.ts`: biografía estructurada, trayectoria, Instagram, fotografías y fuentes.
- `src/App.tsx`: secciones, galería, propuesta profesional y versión imprimible.
- `src/styles.css`: diseño y reglas de móvil/impresión.
- `public/images/`: originales facilitados, copiados sin modificar.
- `src/lib/footballFeed.ts` y `useFootballFeed.ts`: contrato, validación, caducidad y consultas opcionales.

Tras modificar la página, ejecutá `npm run build`. Se actualizan `dist/` y `ABRIR.html`.

## Datos y emisiones

La primera versión usa datos históricos identificados por temporada. No hay una cuenta de proveedor conectada ni estadísticas en tiempo real activas. No se han contratado servicios, creado cuentas ni expuesto claves.

Leé **INTEGRACIONES.md** para conectar un endpoint propio y **INVESTIGACION.md** para consultar la investigación y sus límites. No guardes claves de API en variables `VITE_*`: el feed debe ser público y las credenciales permanecer en un futuro servidor o función serverless.

## Validación realizada

`npm run build` realiza comprobación estricta de TypeScript y compilación. `npm run test:feed` ejecuta seis pruebas de datos, URLs, estadísticas incoherentes y caducidad. Se revisaron en navegador el diseño de escritorio y móvil (390 px), menú, cambio de etapa, galería, navegación con teclado, pestañas, modales y preparación/actualización de la propuesta. No se enviaron mensajes externos.

## Publicación posterior

El proyecto se entrega local, según lo pedido. Para publicarlo más adelante, servir `dist/` en un hosting estático con HTTPS. No hace falta un backend para el portfolio. Antes de activar datos en directo, validar cobertura de la temporada y del jugador con el proveedor elegido. Confirmar también con Nicolás el contenido y los permisos de uso de las fotografías antes de la publicación pública.
