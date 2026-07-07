# Backup bitacora div 131
## Bitacora

## Objetos literales y objetos `FormData`
Un objeto normal de JavaScript se denomina **objeto literal** (o simplemente **objeto**).

Se diferencia de un `FormData` en que:

*   Un **objeto** es una colección genérica de pares clave-valor (`{ clave: valor }`), utilizada para almacenar cualquier tipo de dato en el lado del cliente.
*   Un **FormData** es un objeto específico del DOM diseñado exclusivamente para construir y manejar datos de formularios HTML, facilitando el envío de información (incluyendo archivos) mediante `XMLHttpRequest` o `fetch`.


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


## Qué hacen los controladores en una aplicacion express?
**Los controladores en Express** son funciones que reciben las solicitudes HTTP (request) y generan las respuestas HTTP (response). Su responsabilidad principal es **gestionar la lógica de la ruta**, lo que incluye:

*   **Validar** los parámetros de entrada, el cuerpo de la solicitud y las consultas.
*   **Orquestar** la lógica de negocio, generalmente delegando operaciones complejas en capas de **Servicios** (lógica pura) y **Repositorios** (acceso a datos).
*   **Formatear y devolver** la respuesta adecuada al cliente con el código de estado HTTP correspondiente (ej. 200, 404, 500).

Para mantener el código limpio y escalable, se recomienda **no incluir la lógica de negocio o consultas a bases de datos directamente en el controlador**, sino actuar como un intermediario que conecta la capa de presentación (HTTP) con la lógica de la aplicación.

---



## Qué es `phpmyadmin`?

**phpMyAdmin** es una herramienta de código abierto escrita en **PHP** diseñada para administrar bases de datos **MySQL** y **MariaDB** a través de una interfaz gráfica web. Permite a los usuarios gestionar sus bases de datos mediante un navegador, facilitando operaciones como **crear, eliminar y modificar** bases de datos, tablas, campos e índices, así como **ejecutar sentencias SQL**, importar/exportar datos en diversos formatos (CSV, SQL, PDF, XML) y administrar privilegios de usuarios.

Es una solución popular porque no requiere conocimientos avanzados de comandos para tareas básicas, aunque también soporta consultas complejas. Se utiliza frecuentemente en entornos de desarrollo local (como **XAMPP**) y es el administrador de base de datos por defecto en muchos paneles de control de hosting (como **cPanel**). El proyecto, lanzado originalmente en 1998, está disponible bajo la licencia **GPL Versión 2** y se encuentra actualmente en mantenimiento activo, con la última versión estable 5.2.2 publicada en enero de 2025.

### Que hace la palabra clave `return`
La palabra clave **return** en **JavaScript** cumple dos funciones principales: **finaliza inmediatamente la ejecución** de la función actual y **devuelve un valor** específico al código que llamó a la función.

*   **Control de flujo:** Al encontrarse con `return`, el intérprete sale de la función sin ejecutar ninguna línea de código posterior, lo que permite crear **finalizaciones tempranas** (early exits) para optimizar el código.
*   **Devolución de datos:** El valor especificado después de `return` se envía al contexto llamador y puede ser almacenado en una variable o usado en expresiones. Si la expresión se omite, la función devuelve **`undefined`**.

Por ejemplo, en `function sumar(a, b) { return a + b; }`, la función detiene su ejecución al calcular la suma y entrega ese resultado para su uso posterior.


---

### Que hace el middleware `app.use(express.json())`?
*Por que si no uso app.use(express.json()); me devuelve undefined el req.body?*

**Express no parsea automáticamente el cuerpo de las peticiones** porque su diseño es minimalista; desconoce si los datos entrantes son JSON, formularios o archivos binarios.

Sin la middleware `express.json()`, la propiedad `req.body` permanece como **undefined** porque nadie procesa el flujo de datos del cliente. Para solucionarlo, debes agregar `app.use(express.json());` antes de definir tus rutas, lo que permite que Express identifique el tipo `application/json` y convierta el cuerpo en un objeto accesible.

*   En **Express 4.16.0+**, `express.json()` está integrado nativamente.
*   En versiones anteriores, requería instalar el paquete externo `body-parser`.
*   Si envías formularios HTML en lugar de JSON, necesitarías `express.urlencoded({ extended: true })`.


---

### Que es el `FormData` en JavaScript?

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

#### EXTRA / Para parsear los datos enviados de forma nativa con HTML `<forms>` usariamos el siguiente middleware
```js
app.use(
    express.urlencoded({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 5000,
        type: "application/x-www-form-urlencoded",
    })
);
```


---


### Que significa `payload` cuando devolvemos datos de una BBDD?
**La convención payload** se refiere principalmente a dos conceptos distintos según el contexto técnico:

*   **En programación y APIs:** Es una convención que denomina **payload** al **conjunto de datos o información relevante** transmitidos dentro de un mensaje (como JSON, XML o una solicitud HTTP), excluyendo los encabezados y metadatos de control. Por ejemplo, en una solicitud POST, el payload contiene la información necesaria para crear o actualizar un objeto.
*   **En ciberseguridad (Metasploit):** Es una convención de **nomenclatura de payloads** que indica su estructura y tipo mediante el uso de guiones bajos o barras diagonales:
    *   **Payload Individual (Singles):** Utiliza un guion bajo (`_`) en su nombre; está diseñado para ejecutarse de forma autónoma sin necesidad de conexión externa adicional.
    *   **Payload Montable (Stager/Stages):** Utiliza una barra diagonal (`/`) entre el tipo y el payload; actúa como una primera etapa que establece la conexión para descargar y ejecutar un payload más complejo.

---

### Que puertos solemos usar en el desarrollo de servidores

En el desarrollo de servidores, la elección de puertos depende del entorno y la tecnología, priorizando la **evitación de conflictos** con servicios del sistema y otras aplicaciones locales.

*   **Entorno de Producción**: Se utilizan exclusivamente los **puertos 80 (HTTP)** y **443 (HTTPS)**, ya que son los estándares para el tráfico web público.
*   **Desarrollo Local (JavaScript/Node.js)**: Es predominante el uso del **puerto 3000**, seguido del **3001** para APIs o servicios adicionales en arquitecturas de microservicios.
*   **Desarrollo Local (Python)**: Comúnmente se emplea el **puerto 8000**, que es el valor predeterminado en herramientas como Django o `http.server`.
*   **Desarrollo Local (Java/Apache Tomcat)**: El **puerto 8080** es la convención estándar para evitar conflictos con el puerto 80 y facilitar la simulación de servidores web.
*   **Otros Frameworks**: **Angular** usa por defecto el **puerto 4200**, mientras que desarrolladores suelen usar rangos personalizados (como **9900-9999** o secuencias como **3001, 3002**) para proyectos paralelos.

Es crucial verificar que el puerto elegido no esté en uso por otro servicio del sistema operativo (especialmente en el rango **0-1023**, que requiere permisos de administrador) antes de iniciar el servidor.

---

### Que hace y significa localhost

**Localhost** es el nombre de dominio reservado que se utiliza para referirse a la **interfaz de loopback** de una computadora, permitiendo que el dispositivo se comunique consigo mismo. Técnicamente, este alias resuelve la dirección IP **127.0.0.1** (en IPv4) o **::1** (en IPv6), creando un circuito virtual interno donde los datos nunca salen de la máquina.

Su función principal es actuar como un **servidor local** o anfitrión propio, lo que resulta esencial en el desarrollo de software y administración de sistemas por las siguientes razones:

*   **Desarrollo y Pruebas:** Permite a los programadores ejecutar servidores web (como Apache o Nginx), bases de datos y aplicaciones en su equipo local para probar código sin necesidad de conexión a Internet ni de publicar en un servidor externo.
*   **Seguridad y Control:** Al mantener el tráfico dentro del dispositivo, se elimina la exposición a amenazas externas y se reduce la latencia, ofreciendo un entorno aislado y rápido para depurar errores.
*   **Comunicación Interna:** Facilita la interacción entre diferentes programas o servicios que residen en el mismo equipo, simulando una red sin requerir hardware adicional.

En resumen, localhost significa **"esta computadora"** en el contexto de redes, funcionando como un espacio de trabajo privado y autónomo antes de implementar cualquier proyecto en producción.

---

## Comprendiendo las APIs REST
**REST** son las siglas de **Representational State Transfer** (Transferencia de Estado Representacional) y es un **estilo arquitectónico** definido por Roy Fielding en 2000 para diseñar sistemas distribuidos. **RESTful** es el término utilizado para describir una **implementación** o una API que sigue estrictamente los principios de este estilo arquitectónico.

Las API RESTful se caracterizan por:
*   Utilizar el protocolo **HTTP** para las comunicaciones.
*   Ser **sin estado** (stateless), donde cada solicitud contiene toda la información necesaria.
*   Utilizar un **lenguaje uniforme** de métodos (GET, POST, PUT, DELETE) para operar sobre recursos identificados por **URI**.
*   Permitir que los datos se intercambien en formatos como **JSON** o XML.

La diferencia clave es que **REST** es el conjunto de principios teóricos, mientras que **RESTful** denota que un servicio web o API los ha implementado correctamente.


---


### Otra definicion más técnica
Una **API REST** (Interfaz de Programación de Aplicaciones de Transferencia de Estado Representacional) es un conjunto de reglas y convenciones arquitectónicas para crear servicios web que permiten la comunicación entre sistemas informáticos a través de la web.

**Características principales:**

*   **Arquitectura Cliente-Servidor:** Separa la interfaz de usuario (cliente) del almacenamiento de datos (servidor) para mejorar la escalabilidad.
*   **Sin Estado (Stateless):** Cada solicitud del cliente contiene toda la información necesaria para ser procesada; el servidor no guarda datos de sesiones previas.
*   **Interfaz Uniforme:** Utiliza métodos HTTP estándar (**GET**, **POST**, **PUT**, **DELETE**) para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre recursos identificados por **URLs** (URI).
*   **Formato de Datos:** Intercambia información típicamente en formato **JSON** o XML, que es legible por humanos y máquinas.
*   **Capas y Caché:** Permite el uso de intermediarios y permite que las respuestas se almacenen en caché para optimizar el rendimiento.

A diferencia de otras tecnologías como SOAP, las API REST no son un protocolo rígido, sino un estilo arquitectónico que prioriza la **simplicidad**, la **velocidad** y la **flexibilidad**, siendo el estándar predominante en el desarrollo web moderno y arquitecturas de microservicios.

---

## Diferencia entre endpoint y url
La diferencia fundamental radica en que la **URL** (Localizador Uniforme de Recursos) es la dirección completa y técnica para localizar un recurso en internet, mientras que el **endpoint** es la ruta específica dentro de una API que indica qué recurso o acción se va a interactuar.

*   **URL**: Es el identificador completo que incluye el protocolo, el dominio y la ruta (ej. `https://api.ejemplo.com/v1/usuarios`). Define **dónde** se encuentra el servidor.
*   **Endpoint**: Es la parte de la URL que identifica el recurso o servicio específico dentro de la API (ej. `/v1/usuarios`). Define **qué** recurso se va a acceder o la función que se va a ejecutar.

En resumen, la URL es la "dirección postal" completa hacia el edificio (servidor), y el endpoint es la "puerta específica" o "oficina" dentro de ese edificio a la que deseas entrar para interactuar con un recurso particular.

---

## Diferencia entre frameworks y librerias
La diferencia principal radica en el **control del flujo de ejecución**, concepto conocido como **Inversión de Control**.

*   **Librería**: Es un conjunto de funciones reutilizables para tareas específicas. **Tú controlas el flujo** y decides cuándo llamar a la librería desde tu código. Ofrece alta flexibilidad pero requiere que el desarrollador gestione la arquitectura y compatibilidad. Ejemplos: React, jQuery, Lodash.
*   **Framework**: Es un marco de trabajo completo que define la estructura de la aplicación. **El framework controla el flujo** y llama a tu código en momentos específicos. Impone convenciones y patrones, ofreciendo estabilidad y herramientas integradas, pero con menor flexibilidad. Ejemplos: Angular, Django, Laravel.

En resumen, con una librería **tú llamas a la herramienta**, mientras que con un framework **la herramienta llama a tu código**.


---

# Backup bitacora div 132
# Bitacora

## Que son los ataques con tablas rainbow?
Un **ataque con tabla rainbow** (o tabla arcoíris) es una técnica criptográfica que utiliza **tablas precalculadas** de pares de contraseñas en texto plano y sus valores hash correspondientes para descifrar contraseñas hasheadas de forma rápida y eficiente.

A diferencia de los ataques de fuerza bruta que calculan hashes en tiempo real, este método **intercambia tiempo de cálculo previo por espacio de almacenamiento**, permitiendo a los atacantes recuperar contraseñas originales al comparar hashes robados con las entradas de la tabla preexistente.

*   **Mecanismo**: Se basa en la propiedad determinista de las funciones hash, donde la misma entrada siempre produce el mismo resultado, permitiendo la creación de cadenas de hash y reducción que optimizan el espacio de almacenamiento.
*   **Efectividad**: Es altamente efectivo contra sistemas que utilizan **hashes sin sal** o algoritmos débiles, pero es completamente ineficaz contra contraseñas saladas, ya que la sal única para cada usuario hace que los hashes precalculados sean inútiles.
*   **Defensa**: Las contramedidas principales incluyen el uso de **salting** (añadir datos aleatorios a la contraseña antes de hashear), algoritmos de hash lentos como **bcrypt** o **Argon2**, y la eliminación de contraseñas en favor de la autenticación sin contraseña o biométrica.


---


## Que es hashear una contraseña?
El **hash de contraseña** es el proceso de convertir una contraseña en texto plano mediante un **algoritmo criptográfico unidireccional** para generar una cadena de caracteres de longitud fija y única, conocida como hash. Este mecanismo es fundamental en la ciberseguridad porque **no es reversible**, lo que significa que, a diferencia del cifrado, no existe una clave para descifrar el hash y recuperar la contraseña original.

Cuando un usuario se registra, el sistema almacena únicamente este valor hash en la base de datos. Durante el inicio de sesión, el sistema vuelve a aplicar el algoritmo hash a la contraseña ingresada y compara el resultado con el almacenado; si coinciden, se concede el acceso. Esta práctica asegura que, incluso si una base de datos es comprometida, los atacantes no obtienen las contraseñas reales, sino solo cadenas ilegibles que requieren costosos procesos de fuerza bruta o ataques de diccionario para intentar descifrar.


---


## Objetos literales y objetos `FormData`
Un objeto normal de JavaScript se denomina **objeto literal** (o simplemente **objeto**).

Se diferencia de un `FormData` en que:

*   Un **objeto** es una colección genérica de pares clave-valor (`{ clave: valor }`), utilizada para almacenar cualquier tipo de dato en el lado del cliente.
*   Un **FormData** es un objeto específico del DOM diseñado exclusivamente para construir y manejar datos de formularios HTML, facilitando el envío de información (incluyendo archivos) mediante `XMLHttpRequest` o `fetch`.


---


## Que formato de informacion manda un `<form>` HTML?
Los formularios HTML envían la información utilizando dos formatos de codificación principales, definidos por el atributo `enctype` de la etiqueta `<form>`:

*   **application/x-www-form-urlencoded**: Es el formato **predeterminado**. Codifica los datos como pares nombre-valor, sustituyendo los espacios por el símbolo `+` y convirtiendo los caracteres especiales en secuencias de escape, separando las parejas con el símbolo `&`. Es ideal para formularios con texto estándar y volúmenes de datos pequeños.
*   **multipart/form-data**: Se debe utilizar cuando el formulario incluye **archivos** o un gran volumen de información. Codifica los datos como un mensaje MIME de múltiples partes, donde cada campo se envía como una parte distinta (`form-data`), permitiendo la transferencia binaria segura.

Además del formato de codificación, los datos se transmiten al servidor mediante métodos HTTP definidos en el atributo `method`:

*   **GET**: Envía los datos visibles en la URL de destino (ej. `pagina.php?nombre=valor`). Se usa para búsquedas o datos no sensibles.
*   **POST**: Envía los datos en el cuerpo de la solicitud HTTP, manteniéndolos ocultos de la URL. Es el estándar para enviar datos confidenciales o archivos.


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


## Qué hacen los controladores en una aplicacion express?
**Los controladores en Express** son funciones que reciben las solicitudes HTTP (request) y generan las respuestas HTTP (response). Su responsabilidad principal es **gestionar la lógica de la ruta**, lo que incluye:

*   **Validar** los parámetros de entrada, el cuerpo de la solicitud y las consultas.
*   **Orquestar** la lógica de negocio, generalmente delegando operaciones complejas en capas de **Servicios** (lógica pura) y **Repositorios** (acceso a datos).
*   **Formatear y devolver** la respuesta adecuada al cliente con el código de estado HTTP correspondiente (ej. 200, 404, 500).

Para mantener el código limpio y escalable, se recomienda **no incluir la lógica de negocio o consultas a bases de datos directamente en el controlador**, sino actuar como un intermediario que conecta la capa de presentación (HTTP) con la lógica de la aplicación.

---



## Qué es `phpmyadmin`?

**phpMyAdmin** es una herramienta de código abierto escrita en **PHP** diseñada para administrar bases de datos **MySQL** y **MariaDB** a través de una interfaz gráfica web. Permite a los usuarios gestionar sus bases de datos mediante un navegador, facilitando operaciones como **crear, eliminar y modificar** bases de datos, tablas, campos e índices, así como **ejecutar sentencias SQL**, importar/exportar datos en diversos formatos (CSV, SQL, PDF, XML) y administrar privilegios de usuarios.

Es una solución popular porque no requiere conocimientos avanzados de comandos para tareas básicas, aunque también soporta consultas complejas. Se utiliza frecuentemente en entornos de desarrollo local (como **XAMPP**) y es el administrador de base de datos por defecto en muchos paneles de control de hosting (como **cPanel**). El proyecto, lanzado originalmente en 1998, está disponible bajo la licencia **GPL Versión 2** y se encuentra actualmente en mantenimiento activo, con la última versión estable 5.2.2 publicada en enero de 2025.

### Que hace la palabra clave `return`
La palabra clave **return** en **JavaScript** cumple dos funciones principales: **finaliza inmediatamente la ejecución** de la función actual y **devuelve un valor** específico al código que llamó a la función.

*   **Control de flujo:** Al encontrarse con `return`, el intérprete sale de la función sin ejecutar ninguna línea de código posterior, lo que permite crear **finalizaciones tempranas** (early exits) para optimizar el código.
*   **Devolución de datos:** El valor especificado después de `return` se envía al contexto llamador y puede ser almacenado en una variable o usado en expresiones. Si la expresión se omite, la función devuelve **`undefined`**.

Por ejemplo, en `function sumar(a, b) { return a + b; }`, la función detiene su ejecución al calcular la suma y entrega ese resultado para su uso posterior.


---

### Que hace el middleware `app.use(express.json())`?
*Por que si no uso app.use(express.json()); me devuelve undefined el req.body?*

**Express no parsea automáticamente el cuerpo de las peticiones** porque su diseño es minimalista; desconoce si los datos entrantes son JSON, formularios o archivos binarios.

Sin la middleware `express.json()`, la propiedad `req.body` permanece como **undefined** porque nadie procesa el flujo de datos del cliente. Para solucionarlo, debes agregar `app.use(express.json());` antes de definir tus rutas, lo que permite que Express identifique el tipo `application/json` y convierta el cuerpo en un objeto accesible.

*   En **Express 4.16.0+**, `express.json()` está integrado nativamente.
*   En versiones anteriores, requería instalar el paquete externo `body-parser`.
*   Si envías formularios HTML en lugar de JSON, necesitarías `express.urlencoded({ extended: true })`.


---

### Que es el `FormData` en JavaScript?

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

#### EXTRA / Para parsear los datos enviados de forma nativa con HTML `<forms>` usariamos el siguiente middleware
```js
app.use(
    express.urlencoded({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 5000,
        type: "application/x-www-form-urlencoded",
    })
);
```


---


### Que significa `payload` cuando devolvemos datos de una BBDD?
**La convención payload** se refiere principalmente a dos conceptos distintos según el contexto técnico:

*   **En programación y APIs:** Es una convención que denomina **payload** al **conjunto de datos o información relevante** transmitidos dentro de un mensaje (como JSON, XML o una solicitud HTTP), excluyendo los encabezados y metadatos de control. Por ejemplo, en una solicitud POST, el payload contiene la información necesaria para crear o actualizar un objeto.
*   **En ciberseguridad (Metasploit):** Es una convención de **nomenclatura de payloads** que indica su estructura y tipo mediante el uso de guiones bajos o barras diagonales:
    *   **Payload Individual (Singles):** Utiliza un guion bajo (`_`) en su nombre; está diseñado para ejecutarse de forma autónoma sin necesidad de conexión externa adicional.
    *   **Payload Montable (Stager/Stages):** Utiliza una barra diagonal (`/`) entre el tipo y el payload; actúa como una primera etapa que establece la conexión para descargar y ejecutar un payload más complejo.

---

### Que puertos solemos usar en el desarrollo de servidores

En el desarrollo de servidores, la elección de puertos depende del entorno y la tecnología, priorizando la **evitación de conflictos** con servicios del sistema y otras aplicaciones locales.

*   **Entorno de Producción**: Se utilizan exclusivamente los **puertos 80 (HTTP)** y **443 (HTTPS)**, ya que son los estándares para el tráfico web público.
*   **Desarrollo Local (JavaScript/Node.js)**: Es predominante el uso del **puerto 3000**, seguido del **3001** para APIs o servicios adicionales en arquitecturas de microservicios.
*   **Desarrollo Local (Python)**: Comúnmente se emplea el **puerto 8000**, que es el valor predeterminado en herramientas como Django o `http.server`.
*   **Desarrollo Local (Java/Apache Tomcat)**: El **puerto 8080** es la convención estándar para evitar conflictos con el puerto 80 y facilitar la simulación de servidores web.
*   **Otros Frameworks**: **Angular** usa por defecto el **puerto 4200**, mientras que desarrolladores suelen usar rangos personalizados (como **9900-9999** o secuencias como **3001, 3002**) para proyectos paralelos.

Es crucial verificar que el puerto elegido no esté en uso por otro servicio del sistema operativo (especialmente en el rango **0-1023**, que requiere permisos de administrador) antes de iniciar el servidor.

---

### Que hace y significa localhost

**Localhost** es el nombre de dominio reservado que se utiliza para referirse a la **interfaz de loopback** de una computadora, permitiendo que el dispositivo se comunique consigo mismo. Técnicamente, este alias resuelve la dirección IP **127.0.0.1** (en IPv4) o **::1** (en IPv6), creando un circuito virtual interno donde los datos nunca salen de la máquina.

Su función principal es actuar como un **servidor local** o anfitrión propio, lo que resulta esencial en el desarrollo de software y administración de sistemas por las siguientes razones:

*   **Desarrollo y Pruebas:** Permite a los programadores ejecutar servidores web (como Apache o Nginx), bases de datos y aplicaciones en su equipo local para probar código sin necesidad de conexión a Internet ni de publicar en un servidor externo.
*   **Seguridad y Control:** Al mantener el tráfico dentro del dispositivo, se elimina la exposición a amenazas externas y se reduce la latencia, ofreciendo un entorno aislado y rápido para depurar errores.
*   **Comunicación Interna:** Facilita la interacción entre diferentes programas o servicios que residen en el mismo equipo, simulando una red sin requerir hardware adicional.

En resumen, localhost significa **"esta computadora"** en el contexto de redes, funcionando como un espacio de trabajo privado y autónomo antes de implementar cualquier proyecto en producción.


---

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