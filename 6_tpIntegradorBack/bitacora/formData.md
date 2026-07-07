## Como enviabamos informacion desde un formulario en nuestro tp?

## 1. Envio de informacion con la web api `fetch`
1. Recogiamos la info del formulario en un objeto nativo del DOM que es `FormData`
2. Transformabamos este objeto FormData en un objeto literal JavaScript para poder aplicarle el `JSON.stringify()` a este objeto **para enviar la informacion en JSON**
3. En el endpoint recibiamos la informacion de JSON parseada (ya como objetos) gracias al middleware `express.json()`


---


## 2. Envio de informacion con html `<form>`
1. Enviamos directamente toda la informacion no en `JSON` sino en un tipo de data que es `application/x-www-form-urlencoded`
2. En el endpoint recibimos la informacion parseada (ya como objetos) gracias al middleware `app.use(express.urlencoded({ extended: true }));`


---


## En conclusion, estos middlewares se encargan de procesar la informacion para que el endpoint reciba todo como objetos JavaScript
```js
// Middleware para parsear el JSON de las peticiones POST y PUT con la api fetch
app.use(express.json()); 

// Middleware para parsear info enviada con <forms>
app.use(express.urlencoded({ extended: true }));
```

Los middlewares interceptan la peticion, detectan que tipo de dato es y parsean la info antes de derivarsela al controlador. Gracias a esto, nuestro controlador puede directamente recibir objetos en el `req.body`

Ejemplo con el controlador `createProduct` de `product.controllers.js`
```js
// Gracias al middleware router.use(express.json()) -> Recibimos un objeto JS ya parseado
// console.log(req.body);

// Extraemos los valores que vienen en el CUERPO (body) de la peticion http (HTTP Request)
const { name, image, category, price } = req.body;

// Si lo que recibieramos fuera JSON no podriamos trabajar con estos datos, guardarlos en variables ni parsarselos a la Base de Datos
```

Sin estos middlewares, en cada endpoint tendriamos que chequear que tipo de info contiene el req.body
- `JSON`
- `application/x-www-form-urlencoded`

Tendriamos filtrar que parsear manualmente en cada endpoint los datos para ya luego poder trabajarlos y hacer destructuring como hacemos aca
```js
// Gracias al destructuring podemos guardar como variables sueltas la informacion de arrays y objetos
const { name, image, category, price } = req.body; // Aca guardamos en las variables name, image, category y price todo lo que trae el req.body
```


---


## 1 / Que es FormData en JavaScript?

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


---



## 2/ El HTML envia FormData?
No necesariamente. Cuando envías un formulario HTML de manera tradicional (usando un botón `<button type="submit">` o `<input type="submit">` sin interceptar el evento con JavaScript), el navegador recopila y envía los datos automáticamente utilizando el formato **`multipart/form-data`** o **`application/x-www-form-urlencoded`**, pero **no crea explícitamente un objeto `FormData` de JavaScript** a menos que tú lo hagas mediante código.

El objeto **`FormData`** es una interfaz de JavaScript que permite:

- Capturar los datos de un formulario HTML fácilmente.
- Manipularlos antes de enviarlos.
- Enviarlos de forma asíncrona usando `fetch()` o `XMLHttpRequest`.

### ¿Cuándo se usa `FormData`?

Se usa principalmente en dos casos:

1. **Creación automática desde un formulario existente:**

```javascript
const formulario = document.querySelector('#miFormulario');
const datos = new FormData(formulario);
```

Esto captura automáticamente todos los campos del formulario que tengan el atributo `name`.

2. **Creación manual:**

```javascript
const datos = new FormData();
datos.append('nombre', 'Juan');
datos.append('email', 'juan@example.com');
```

Útil cuando necesitas agregar datos dinámicamente o no hay un formulario HTML involucrado.

### Ejemplo de envío con `fetch` y `FormData`:

```html
<form id="miFormulario">
  <input type="text" name="nombre" value="Ana">
  <input type="email" name="email" value="ana@example.com">
  <button type="submit">Enviar</button>
</form>

<script>
  document.getElementById('miFormulario').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita el envío tradicional

    const formData = new FormData(this);

    fetch('/enviar', {
      method: 'POST',
      body: formData
      // No es necesario establecer Content-Type, el navegador lo hace automáticamente
    })
    .then(resp => resp.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
  });
</script>
```



En resumen: **el navegador no usa el objeto `FormData` de JavaScript por defecto**, pero sí usa un formato similar (`multipart/form-data`) al enviar formularios. El objeto `FormData` es una herramienta de JavaScript que facilita trabajar con esos datos antes de enviarlos de forma asíncrona.



## 3 / FormData -> Objeto JS -> JSON
Para enviar un formulario HTML como **JSON**, no puedes usar el objeto `FormData` directamente en el cuerpo de la petición, ya que `FormData` está diseñado para codificaciones tipo `multipart/form-data` o `application/x-www-form-urlencoded`.

Debes seguir estos pasos:

1.  **Capturar los datos:** Usa `new FormData(formulario)` para leer los valores fácilmente.
2.  **Convertir a JSON:** Transforma ese objeto `FormData` en un objeto plano de JavaScript y luego a una cadena JSON con `JSON.stringify()`.
3.  **Configurar la petición:** Establece el encabezado `Content-Type` en `application/json`.

### Ejemplo de código:

```javascript
const formulario = document.querySelector('#miFormulario');

formulario.addEventListener('submit', function (e) {
  e.preventDefault();

  // 1. Capturar datos con FormData
  const formData = new FormData(this);

  // 2. Convertir FormData a Objeto Plano
  const datosObjeto = Object.fromEntries(formData.entries());

  // 3. Enviar como JSON
  fetch('/api/enviar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Importante para que el servidor sepa que es JSON
    },
    body: JSON.stringify(datosObjeto) // Convertir objeto a cadena JSON
  })
  .then(response => response.json())
  .then(data => console.log('Éxito:', data))
  .catch(error => console.error('Error:', error));
});
```

### Puntos clave:
*   **`Object.fromEntries(formData.entries())`**: Es la forma más rápida de convertir los datos del formulario a un objeto estándar de JavaScript.
*   **`Content-Type`**: A diferencia de `FormData`, cuando envías JSON **debes** especificar manualmente el header `Content-Type: application/json`.
*   **Archivos**: Si el formulario contiene archivos (`<input type="file">`), `JSON.stringify()` no los enviará correctamente por sí solo (solo enviará el nombre del archivo). Para enviar archivos junto con datos JSON, generalmente se usa `FormData` tradicional (`multipart/form-data`) o se convierte el archivo a Base64 antes de stringifyar.

