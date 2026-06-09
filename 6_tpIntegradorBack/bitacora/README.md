## Objeto `FormData` en JavaScript
**Es el objeto encargado de representar los datos de los formularios HTML.**

**FormData** es una interfaz nativa de JavaScript que permite construir y gestionar conjuntos de pares clave-valor para representar datos de formularios HTML. Su función principal es facilitar el envío de información, **incluyendo archivos y binarios**, mediante solicitudes AJAX o fetch sin recargar la página.

A diferencia de los objetos JSON, FormData utiliza el formato **multipart/form-data**, lo que permite adjuntar archivos nativamente y configurar automáticamente los encabezados HTTP necesarios (como el boundary). Esto simplifica el manejo de formularios complejos, ya que puede capturar automáticamente todos los campos de un elemento `<form>` o construirse manualmente mediante métodos como `append()`.

### Características clave:
*   **Envío de archivos:** Soporta tipos `File`, `Blob` y cadenas, ideal para cargas de imágenes o documentos.
*   **Integración con Fetch/XMLHttpRequest:** Se pasa directamente como cuerpo (`body`) de la petición, permitiendo que el navegador gestione la codificación correcta.
*   **Manipulación dinámica:** Permite agregar, eliminar o modificar campos antes del envío usando métodos como `formData.append()`, `formData.get()` y `formData.delete()`.

### Ejemplo básico de uso:

```javascript
// Crear FormData desde un formulario HTML existente
const formElement = document.querySelector('form');
const formData = new FormData(formElement);

// O crear uno manualmente y agregar datos
const manualData = new FormData();
manualData.append('nombre', 'Juan');
manualData.append('archivo', fileInput.files[0]);

// Enviar con fetch
fetch('/endpoint', {
  method: 'POST',
  body: formData
  // No configurar 'Content-Type' manualmente; el navegador lo hace automáticamente
})
.then(response => response.json())
.then(data => console.log(data));
```