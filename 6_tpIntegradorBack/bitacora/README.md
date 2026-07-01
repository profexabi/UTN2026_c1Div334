# Bitacora 

## Que es el hasheo de contraseñas?
El **hash de contraseña** es el proceso de convertir una contraseña en texto plano mediante un **algoritmo criptográfico unidireccional** para generar una cadena de caracteres de longitud fija y única, conocida como hash. Este mecanismo es fundamental en la ciberseguridad porque **no es reversible**, lo que significa que, a diferencia del cifrado, no existe una clave para descifrar el hash y recuperar la contraseña original.

Cuando un usuario se registra, el sistema almacena únicamente este valor hash en la base de datos. Durante el inicio de sesión, el sistema vuelve a aplicar el algoritmo hash a la contraseña ingresada y compara el resultado con el almacenado; si coinciden, se concede el acceso. Esta práctica asegura que, incluso si una base de datos es comprometida, los atacantes no obtienen las contraseñas reales, sino solo cadenas ilegibles que requieren costosos procesos de fuerza bruta o ataques de diccionario para intentar descifrar.

---

## Que formato de informacion manda un `<form>` HTML?
Los formularios HTML envían la información utilizando dos formatos de codificación principales, definidos por el atributo `enctype` de la etiqueta `<form>`:

*   **application/x-www-form-urlencoded**: Es el formato **predeterminado**. Codifica los datos como pares nombre-valor, sustituyendo los espacios por el símbolo `+` y convirtiendo los caracteres especiales en secuencias de escape, separando las parejas con el símbolo `&`. Es ideal para formularios con texto estándar y volúmenes de datos pequeños.
*   **multipart/form-data**: Se debe utilizar cuando el formulario incluye **archivos** o un gran volumen de información. Codifica los datos como un mensaje MIME de múltiples partes, donde cada campo se envía como una parte distinta (`form-data`), permitiendo la transferencia binaria segura.

Además del formato de codificación, los datos se transmiten al servidor mediante métodos HTTP definidos en el atributo `method`:

*   **GET**: Envía los datos visibles en la URL de destino (ej. `pagina.php?nombre=valor`). Se usa para búsquedas o datos no sensibles.
*   **POST**: Envía los datos en el cuerpo de la solicitud HTTP, manteniéndolos ocultos de la URL. Es el estándar para enviar datos confidenciales o archivos.


### Enviando datos con `get` vs `post`
La diferencia fundamental radica en **cómo se transportan los datos** desde el cliente al servidor. El método **GET** envía la información **visiblemente en la URL** como parámetros de consulta (ej. `?clave=valor`), mientras que el método **POST** envía los datos **ocultos dentro del cuerpo** del mensaje HTTP.

*   **Visibilidad y Seguridad:** Los datos de **GET** son visibles en la barra de direcciones, el historial del navegador y los registros del servidor, lo que los hace **menos seguros** para información sensible (como contraseñas). Los datos de **POST** no aparecen en la URL, ofreciendo mayor privacidad.
*   **Capacidad y Uso:** **GET** tiene un límite estricto de tamaño (generalmente **2 KB** o menos) y se usa idealmente para **consultas, búsquedas o filtros** (operaciones idempotentes). **POST** no tiene un límite de tamaño estricto (soporta **archivos y datos grandes**) y se usa para **enviar información, crear registros o modificar datos**.
*   **Comportamiento:** Las peticiones **GET** pueden ser **almacenadas en caché**, marcadas como favoritas y reenviadas fácilmente sin advertencias. Las peticiones **POST** no suelen cachearse y el navegador suele advertir al usuario si intenta reenviar los datos para evitar duplicados.

En resumen, usa **GET** para **recuperar datos** que pueden compartirse o repetirse, y **POST** para **enviar o modificar datos** que requieren privacidad o superan el límite de caracteres de la URL.


---

## Entendiendo los objetos `req` y `res`
En un addEventListener tenemos una estructura calcada de un endpoint
    1. Es un proceso que esta continuamente escuchando (en este caso acciones del usuario)
    2. El primer parametro es un string (no la url, sino que describe la accion)
    3. El tercer parametro es un callback que realiza una funcion
    4. Este callback puede contener un objeto que proporcione metodos e info 
        - event para proporcionar metodos e info asociados a esta accion 
        - req y res proporcionan metodos e info asociados a la peticion y la respuesta

#### Comparacion a ojo de addEventListeners y endpoints
```js
elemento.addEventListener("keydown", (event) => {

    // Objeto para proporcionar informacion del evento
    // event.preventDefault() -> Evitamos el envio por defecto de un form
    event.stopPropagation() // Evitamos la propagacion de eventos
    
    console.log("Se presiono la tecla", event.key)
});

app.get("url", (req, res) => {
    // Objeto para proporcionar informacion sobre la req

    // Objeto para proporcionar informacion sobre la res
});
```


---


### Entendiendo el objeto `req`
Los métodos y propiedades más utilizados del objeto **req** (Request) en **Express.js** para acceder a datos en un endpoint son:

*   **`req.params`**: Obtiene los **parámetros de la ruta** (ej. `/user/:id` se accede como `req.params.id`).
*   **`req.query`**: Obtiene los **parámetros de consulta** (query string) de la URL (ej. `?page=1` se accede como `req.query.page`).
*   **`req.body`**: Obtiene los datos enviados en el **cuerpo** de la petición (común en POST/PUT); requiere middleware como `express.json()` o `express.urlencoded()`.
*   **`req.headers`** o **`req.get('NombreHeader')`**: Accede a los **encabezados HTTP** de la solicitud (ej. autenticación, tipo de contenido).
*   **`req.method`**: Indica el **método HTTP** utilizado (GET, POST, PUT, DELETE, etc.).
*   **`req.ip`** y **`req.protocol`**: Proporcionan la **IP del cliente** y el protocolo (http/https) utilizado.
*   **`req.cookies`**: Accede a las **cookies** enviadas por el cliente (requiere el middleware `cookie-parser`).


---


### Entendiendo el objeto `res`
Los métodos del objeto `res` en Express permiten construir y enviar respuestas HTTP, estableciendo códigos de estado, encabezados y el cuerpo de la respuesta. A continuación se detallan los más utilizados:

*   **`res.send()`**: Envía una respuesta versátil que detecta automáticamente el tipo de contenido; acepta strings, objetos (JSON), arrays o buffers.
*   **`res.json()`**: Envía específicamente una respuesta en formato JSON, convirtiendo automáticamente el objeto pasado a string JSON.
*   **`res.status(código)`**: Establece el código de estado HTTP (ej. 200, 404, 500) y permite encadenarlo con otros métodos como `.json()` o `.send()`.
*   **`res.set()` o `res.header()`**: Configura uno o múltiples encabezados HTTP de respuesta (ej. `Content-Type`, `X-API-Version`).
*   **`res.type(tipo)`**: Establece el encabezado `Content-Type` usando el nombre del tipo MIME (ej. `'application/json'`).
*   **`res.render()`**: Procesa una vista utilizando el motor de plantillas configurado (como EJS o Pug) y envía el HTML resultante.
*   **`res.download()`**: Envía un archivo al cliente forzando su descarga, permitiendo especificar el nombre del archivo.
*   **`res.redirect()`**: Redirige la solicitud a una nueva URL, utilizando por defecto el código de estado 302.
*   **`res.end()`**: Finaliza el proceso de respuesta sin enviar datos adicionales, útil para enviar solo encabezados o estados.

Estos métodos se invocan dentro de la función de ruta, recibiendo `res` como el segundo parámetro, para determinar qué información, formato y metadatos recibe el cliente.


---

## Como hacer refresh de la cache
Para **refrescar la caché** del navegador y forzar la carga de contenido actualizado sin limpiar toda la memoria, se utiliza el **refresco duro** (hard refresh). Los atajos de teclado estándar son:

*   **Windows/Linux**: `Ctrl` + `F5` o `Ctrl` + `Shift` + `R`.
*   **Mac**: `Cmd` + `Shift` + `R` o `Option` + `Cmd` + `E` (para vaciar la caché de Safari) seguido de `Cmd` + `R`.

Si necesitas **vaciar la caché** de forma permanente para un sitio específico, puedes usar las herramientas de desarrollo del navegador (`F12`), hacer clic derecho en el botón de recargar y seleccionar **"Empty Cache and Hard Reload"**, o borrar los datos de navegación desde la configuración del navegador. En el desarrollo web, también es común actualizar los archivos añadiendo un parámetro de consulta (ej. `archivo.js?v=2`) para invalidar la caché automáticamente.


---

## Que es el middleware `Router`?
El **middleware Router** en Express es un sistema de enrutamiento y middleware aislado que se ejecuta únicamente en una instancia de `express.Router()`. A menudo se le denomina una **"mini-aplicación"** porque posee su propia pila de middleware y rutas, independiente de la aplicación principal.

Su función principal es permitir la **modularidad**, facilitando la organización de rutas en archivos separados (por ejemplo, separar rutas de usuarios, administración o APIs) y aplicar lógica específica (como autenticación o logs) solo a ese grupo de rutas.

## Características Principales

El middleware Router funciona de manera similar al middleware a nivel de aplicación (`app.use`), pero con un alcance limitado al router donde se define.

*   **Aislamiento:** El código definido dentro de un router no afecta a otras partes de la aplicación a menos que el router sea montado explícitamente.
*   **Encadenamiento:** Permite definir múltiples funciones middleware y rutas que se ejecutan secuencialmente cuando se coincide con la ruta base.
*   **Reutilización:** Un router puede exportarse como un módulo y utilizarse en diferentes partes de una aplicación o en proyectos distintos.
*   **Control de Flujo:** Al igual que en la aplicación principal, se utiliza la función `next()` para pasar el control al siguiente middleware y `next('router')` para saltar el resto de las funciones del router actual y devolver el control a la aplicación padre.


---


## Que es refactorizar, modularizar y mvc en una aplicacion express

**Refactorizar** en **Express** implica reestructurar el código existente para mejorar su legibilidad, mantenibilidad o rendimiento sin alterar su comportamiento externo, como separar lógica de enrutamiento de la lógica de negocio. 

**Modularizar** consiste en dividir la aplicación en unidades lógicas independientes y reutilizables (módulos), utilizando la estructura de carpetas y `express.Router()` para agrupar rutas, controladores y modelos, evitando que toda la lógica viva en un solo archivo. 

El patrón **MVC** (Modelo-Vista-Controlador) es la arquitectura que organiza esta modularización separando la aplicación en tres capas claras: el **Modelo** (gestión de datos y base de datos), el **Controlador** (lógica de negocio y manejo de peticiones HTTP) y la **Vista** (representación de datos al usuario, como JSON en APIs o HTML en sitios web).

La implementación de MVC en **Express** sigue una estructura de directorios específica para cumplir con la separación de responsabilidades:

*   **Modelos**: Archivos que manejan la lógica de datos y la comunicación con la base de datos o archivos, sin conocimiento de HTTP.
*   **Controladores**: Funciones que reciben la petición, extraen datos del modelo y deciden la respuesta a enviar.
*   **Rutas**: Definiciones que asocian URLs y métodos HTTP con los controladores correspondientes usando `express.Router()`.
*   **Vistas**: En APIs REST, la vista es el objeto JSON devuelto; en aplicaciones web, son archivos de plantilla (como Jade/Pug o EJS) renderizados por el servidor.

Esta arquitectura facilita la escalabilidad y la prueba unitaria, ya que los ingenieros pueden modificar la lógica de datos o las rutas sin afectar la presentación, y cada componente puede ser testeado de forma aislada.