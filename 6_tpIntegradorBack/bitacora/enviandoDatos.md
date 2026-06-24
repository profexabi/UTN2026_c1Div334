## Que optimizaciones hicimos en los endpoitns y las vistas?

### Con las optimizaciones en los endpoints nos referimos a 

1. Manejar errores con try...cach

2. Dar mas respuestas que 200, respuesta 500, respuesta 400, 404 -> Aca entran middlewares

### Con las optimizaciones en las vistas nos referimos a 

1. Emprolijar el código, 

2. Hacer validaciones previas en el cliente (no mandarle al servidor campos vacios)

3. Poder trabajar y mostrar visualmente (feedback visual) los errores de las respuesta 400, 500 -> if (!response.ok) {}


---


## Errores http 400
El **error HTTP 400 Bad Request** es un código de estado del cliente que indica que el servidor no puede procesar la solicitud debido a una **sintaxis incorrecta**, datos corruptos o un formato de petición inválido. A diferencia del error 404 (recurso no encontrado), este fallo se origina en el lado del usuario o del cliente, no en la ausencia del servidor o la página.

Las causas más comunes incluyen:
*   **URL mal formateadas:** Errores tipográficos, caracteres especiales incorrectos o codificación errónea.
*   **Caché y cookies corruptas:** Datos almacenados localmente que el navegador envía de forma defectuosa.
*   **Encabezados demasiado grandes:** El tamaño de los datos en los encabezados HTTP supera los límites permitidos.
*   **Problemas de DNS:** Caché de DNS obsoleta que dirige la solicitud a una IP incorrecta.

Para solucionarlo, se recomienda **limpiar la caché y cookies** del navegador, verificar la **URL** por caracteres extraños, desactivar extensiones conflictivas y **vaciar la caché de DNS**. Si el error persiste al acceder a un sitio web propio, puede requerir revisar la configuración del servidor o los logs de error.


---


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