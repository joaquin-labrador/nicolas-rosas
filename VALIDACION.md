# Validación de la entrega

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
