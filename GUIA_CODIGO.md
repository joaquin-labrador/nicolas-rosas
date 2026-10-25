# Guía para empezar a leer y modificar el código

Esta landing está hecha con React y TypeScript. React organiza la interfaz en componentes; TypeScript comprueba que los datos y las funciones se utilicen con los tipos esperados. No hace falta entender todo a la vez: empezá por el recorrido siguiente.

## 1. Cómo arranca la página

`src/main.tsx` busca el elemento `root` del HTML y monta la aplicación:

```tsx
<I18nProvider>
  <App />
</I18nProvider>
```

`I18nProvider` comparte el idioma seleccionado con todos sus descendientes. `App.tsx` es corto a propósito: ordena las secciones y coordina qué ventana está abierta. El contenido está repartido así:

- `components/layout/`: cabecera, pie y selector de idioma.
- `components/sections/`: portada, estadísticas, perfil, trayectoria, galería, actualidad y contacto.
- `components/dialogs/`: formulario, fuentes, seguimiento de partidos y visor de fotografías.
- `components/ui/`: piezas reutilizables, como enlaces externos, marca, títulos, saltos de línea y ventana modal.
- `components/PrintProfile.tsx`: versión de la ficha preparada para imprimir o guardar como PDF.

Por ejemplo, para cambiar el aspecto de la galería buscá `MediaSection.tsx`; para cambiar sus textos, buscá la sección `media` de los diccionarios.

## 2. Datos, textos y comportamiento

Cada cosa tiene un lugar:

**Datos deportivos:** `data/player.ts` reúne nombre, nacimiento, enlaces, estadísticas históricas y archivos de fotografías. La edad se calcula en `utils/player.ts` desde la fecha de nacimiento, sin escribirla manualmente.

**Datos del formulario:** `data/contact.ts` define campos, límites y motivos estables como `sport` o `scouting`. Las etiquetas visibles se traducen aparte.

**Textos:** `i18n/locales/` contiene cinco diccionarios completos: `es.ts`, `en.ts`, `pt.ts`, `it.ts` y `fr.ts`. Incluyen navegación, textos accesibles, formularios, descripciones de fotos, fuentes, impresión y metadatos.

**Comportamiento:** vive en componentes y hooks. Por ejemplo, abrir una ventana y elegir una etapa de la carrera son interacciones, no datos deportivos.

## 3. React: estado, props y contexto

Los componentes son funciones; no se usan clases de React. `useState` recuerda un valor entre renderizados:

```tsx
const [dialog, setDialog] = useState<DialogName | null>(null);
```

`dialog` contiene la ventana activa; `setDialog("contact")` la cambia y React actualiza la pantalla. `null` significa que no hay ventana abierta.

Las **props** son valores que un componente recibe. Una prop también puede ser una función, llamada *callback*:

```tsx
<ContactSection onContact={() => setDialog("contact")} />
```

La sección llama a `onContact` cuando el visitante pulsa el botón. Así no necesita conocer cómo se gestionan las ventanas.

El **contexto** comparte información sin pasarla por cada componente intermedio. Aquí se consulta con:

```tsx
const { copy, language, setLanguage } = useI18n();
```

`copy` es el diccionario activo; `language`, su código; `setLanguage` permite cambiarlo.

## 4. Cambiar un texto o sumar un idioma

Para cambiar «El jugador» en la navegación:

1. Buscá `nav.player` en `locales/es.ts`.
2. Modificá su valor, conservando la clave `player`.
3. Actualizá la misma clave en inglés, portugués, italiano y francés.
4. Ejecutá las pruebas y revisá el resultado en pantalla.

No cambies nombres de claves solamente en un idioma. `Translation`, definido en `i18n/types.ts`, deriva de la estructura española mediante `typeof es`. Los otros diccionarios usan `satisfies Translation` para que TypeScript compruebe su forma. Las pruebas complementan esta comprobación verificando arrays y parámetros.

Para agregar, por ejemplo, alemán:

1. Creá `locales/de.ts` con todas las claves traducidas y exportá `de`.
2. Añadí `"de"` al tipo `Language` en `types.ts`.
3. Registrá código, nombre, abreviatura y configuración regional en `languages.ts`.
4. Importá `de` y añadilo al objeto de `translations.ts`.
5. Actualizá las pruebas que enumeran idiomas y verificá textos largos, ventanas y versión móvil.

No hace falta crear una página distinta por idioma.

## 5. Parámetros y fechas

Los textos dinámicos usan marcadores como `{name}`, `{date}` o `{minutes}`. Se pueden mover para respetar la gramática, pero deben conservarse.

```tsx
formatMessage(copy.print.stats, {
  appearances: 6,
  starts: 6,
  minutes: 460,
});
```

En español produce «6 partidos · 6 titularidades · 460 minutos». Si falta un parámetro, `formatMessage` avisa con un error; también conserva correctamente los ceros.

`i18n/helpers.ts` centraliza estas sustituciones y las fechas:

```tsx
formatDate(language, "2005-11-29");
formatDateTime(language, "2026-10-25T16:00:00Z");
```

La primera conserva el día de calendario. La segunda muestra horarios en Europe/Madrid, con formato según el idioma. Evitá escribir fechas traducidas manualmente en cada componente.

## 6. Idioma, animaciones y estadísticas

El idioma inicial sigue este orden: parámetro `?lang=fr` del enlace, elección guardada, preferencias del navegador y español. La elección se guarda en `localStorage` y se refleja en la URL sin recargar. Todo sucede en el navegador: no requiere servidor. El proveedor también actualiza el idioma del documento y sus metadatos.

`hooks/useReveal.ts` controla las animaciones al entrar en pantalla. `lib/useFootballFeed.ts` consulta el feed opcional y gestiona carga, caducidad y errores; `lib/footballFeed.ts` valida su contenido. Sin datos recientes válidos, aparecen las estadísticas históricas con su fuente y temporada.

## 7. Estilos y comprobaciones

`src/styles.css` es la entrada que importa archivos de `styles/`: portada, contacto, ventanas, impresión y adaptación móvil, entre otros. Son CSS separados por responsabilidad; no son CSS Modules.

Desde la carpeta del proyecto:

```sh
npm run dev
npm test
npm run build
```

El primer comando abre el servidor de desarrollo. `npm test` ejecuta las **22 pruebas** actuales sobre traducciones, idioma, fechas, edad y datos deportivos. El build comprueba TypeScript, genera `dist/` con Vite y prepara `ABRIR.html` para la vista local.

Cuando el próximo commit llegue a `main`, el workflow `.github/workflows/pages.yml` instalará dependencias, ejecutará pruebas y build, y publicará `dist/` con GitHub Pages. Esta guía no confirma una nueva publicación: describe el proceso configurado.


El selector personalizado está en `components/layout/LanguageSwitcher.tsx`: `open` controla si el menú está abierto y `activeIndex` indica la opción enfocada con el teclado. Al elegir un idioma llama a `setLanguage` del contexto. `components/ui/LanguageFlag.tsx` dibuja las banderas con SVG locales; su aspecto y el del menú se ajustan en `styles/language.css`. No necesita librerías adicionales ni servicios externos.
