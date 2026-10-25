# Validación de la entrega

## Selector de idiomas personalizado · 25 de octubre de 2026

- Menú propio con banderas SVG locales, nombres nativos, idioma activo y estilo rojo y blanco.
- 22 pruebas y compilación aprobadas tanto localmente como en GitHub Actions.
- Revisión pública: cambio de idioma y foco restaurado; flechas, Home, Escape y Tab comprobados.
- Menú revisado a 320 px sin desbordamiento horizontal; alineación móvil anclada al grupo de acciones.

## Refactor y traducciones · 25 de octubre de 2026

- TypeScript estricto y compilación de producción: aprobados.
- `npm test`: 22 pruebas aprobadas (16 de idiomas, fechas y perfil; 6 de datos deportivos).
- Cinco diccionarios completos, sin parámetros ausentes, con validación de claves y longitudes.
- Revisión de código: componentes, navegación, formularios, persistencia, impresión y metadatos separados por responsabilidad.
- La vista previa local no pudo conectarse desde el navegador de este entorno; se verificó la versión pública de Pages después del despliegue.
- Verificados en navegador los cinco idiomas, metadatos, ficha imprimible, persistencia de preferencia, selección de trayectoria y pestañas conservadas al traducir, menú móvil y galería con teclado.
- Formulario en francés: validación requerida y borrador traducidos comprobados con datos de prueba, sin enviar mensajes externos.
- Diseño revisado a 390 px en los cinco idiomas; ajuste adicional de la portada para pantallas de 320 px.

## Primera entrega · 24 de octubre de 2026

24 de octubre de 2026.

- TypeScript estricto y build de producción: aprobados.
- Pruebas del feed: 6 aprobadas; cubren ceros válidos, datos incoherentes, enlaces, fechas y caducidad de las afirmaciones en directo.
- Respuesta HTTP de la página compilada: 200.
- Navegador de escritorio y viewport móvil de 390 × 844: revisados visualmente.
- Menú móvil, selección de etapas, navegación por teclado, galería y cambio de fotografías, pestañas de foto/vídeo, cierre de modales y propuesta local: comprobados.
- Edición de una propuesta después de copiarla: el borrador anterior se borra correctamente.
- Consola del navegador en la compilación final: sin errores ni advertencias capturados.
- No se enviaron mensajes a Instagram, no se creó un backend, no se contrató una API y no se publicó la web.

## Límites de la comprobación

La versión `ABRIR.html` se genera a partir del mismo bundle y lleva el JavaScript y CSS incorporados; sus fotografías se resuelven en `dist/images/`. Su apertura directa por protocolo `file://` no se pudo comprobar con el navegador automatizado, que admite HTTP/HTTPS. La vista de producción sí se verificó con un servidor HTTP local.

La ficha tiene una maquetación específica para impresión; la exportación final a PDF depende del cuadro de impresión del navegador y no se automatizó. Los datos de un proveedor real y la disponibilidad de emisiones deberán verificarse cuando se conecte ese servicio.
