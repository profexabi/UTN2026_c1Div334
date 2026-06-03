# TP Integrador 2026 c1 Div334 / Backend

# ////////////////////////////////////////////////////
# CRUD version I: *MVC con EJS*
# ////////////////////////////////////////////////////

1. Crear endpoints minimos e consumilos dende o cliente
2. Optimizar endpoints
3. Consumir dende front e crear middlewares
4. Refactorizacion e MVC. Modularizar con router, middlewares, controladores e modelos
5. Setup e renderizado con EJS

---

## 1. Arrancando un servidor minimo

### 1.1 Configuracion inicial del proyecto
Antes de nada, vamos a asegurarnos de que nuestro entorno está preparado y crearemos el proyecto

```sh
# Comprobamos la version de Node.js y NPM
node -v
# v20.5.0

npm -v
# 9.8.0

# Creamos un directorio para nueestro proyecto y navegamos a el
mkdir nombreProyecto_Back
cd nombreProyecto_Back

# Inicializamos el proyecto
npm init -y
```

---

### 1.2 Instalacion de dependencias y setup básico con sintaxis ESM

```sh
# Instalamos las dependencias necesarias, que iran a parar a la carpeta node_modules
npm install express ejs mysql2 nodemon dotenv
```
#### Qué estamos instalando?
- **`express`**: Framework web.
- **`ejs`**: Motor de plantillas.
- **`mysql2`**: Cliente MySQL para Node.js.
- **`nodemon`**: Herramienta que reinicia automáticamente la aplicación Node.js cuando detecta cambios en los archivos durante el desarrollo.
- **`dotenv`**: Módulo que carga variables de entorno desde un archivo .env al entorno de ejecución de Node.js.

#### Nuevo script de arranque y sintaxis ESM
- Agregamos type module en el `package.json`
- Agregamos script `dev`

```json
"type": "module",
"scripts": {
    "dev": "nodemon index.js"
}
```

#### Creamos el archivo principal `index.js` como lo indica el `package.json`
```js
import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Hola mundo!");
});

app.listen(3000, () => {
    console.log(`Servidor corriendo en el puerto 3000`);
});
```

Ahora ejecutamos nuestro servidor con nuestro nuevo script
```sh
npm run dev
```

Listo!


---


## 2. Conectando a una BBDD

---

### 2.0 Necesitamos instalar mysql y phpmyadmin
**Para Windows, usar [xampp](https://www.apachefriends.org/es/index.html)**
#### [Que es xampp?](https://www.polimetro.com/que-es-xampp/)
XAMPP es un entorno de desarrollo local que reúne en un solo paquete todos los componentes necesarios para instalar un servidor web completo en tu propio ordenador, independientemente de si usas Windows, Linux o macOS. Su denominación es un acrónimo que refleja los elementos que lo componen y su naturaleza multiplataforma:

- X: Representa la capacidad multiplataforma (Windows, Linux, macOS).
- A: Hace referencia a Apache, el servidor web líder en la entrega de sitios y aplicaciones.
- M: Alude a MariaDB o MySQL, sistemas de gestión de bases de datos relacionales ampliamente utilizados. Actualmente, XAMPP integra MariaDB como alternativa a MySQL.
- P: Por PHP, el lenguaje de programación más empleado en el desarrollo de aplicaciones web dinámicas.
- P: Indica la inclusión de Perl, otro lenguaje orientado a tareas de administración, scripting y desarrollo web complejo.

Componentes extra: Incluye herramientas complementarias como **phpMyAdmin** (gestión visual de bases de datos), FileZilla (servidor FTP), Mercury (servidor de correo), OpenSSL y otros, dependiendo del sistema operativo.
Software libre: Tanto XAMPP como sus componentes principales son open source, de uso gratuito incluso en entornos comerciales, siempre que se respeten las licencias de cada componente.
Actualizaciones periódicas: La comunidad y los desarrolladores de XAMPP lanzan frecuentemente nuevas versiones con mejoras y actualizaciones de sus módulos principales.

---

### 2.1 Crear archivos `.gitignore` y `.env` en la raiz del proyecto
- `.gitignore` nos permite no enviar a git nuestros paquetes de npm y nuestras variables de entorno
- `.env`sirve para almacenar localmente variables sensibles como el usuario y password de la conexion a la BBDD, el puerto, entre otros datos

#### Dentro de `.gitignore` escribimos 
```
node_modules
.env
```

#### Creamos nuestras variables de entorno en `.env`
Previamente instalamos el paquete dotenv, que sirve para cargar las variables de entorno desde un archivo .env, lo cual es especialmente útil para manejar configuraciones de desarrollo, producción, y otras configuraciones específicas.

```
PORT=3000
DB_HOST="localhost"
DB_NAME="nombreDB"
DB_USER="nombreUser"
DB_PASSWORD="passUser"
```

---

### 2.2 Crear estructura de directorios (carpetas) de nuestro proyecto para almacenar la configuracion de nuestro proyecto y la conexion a la BBDD

- Creamos `src/api/config/environments.js`
```js
// Importamos el modulo dotenv para importar las variables de entorno
import dotenv from "dotenv";

dotenv.config();
//config(); // Cargamos las variables de entorno desde el archivo .env

export default {
    port: process.env.PORT || 3000,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}
```

- Creamos `src/api/database/db.js`
```js
// Importamos el modulo mysql2 en modo promesas, para poder hacer peticiones asincronas a la BBDD
import mysql from "mysql2/promise";

// Importamos la informacion de la conexion a la BBDD
import environments from "../config/environments.js";

// Traemos la informacion del .env que importa y exporta el archivo environments.js
const { database } = environments; 

// Creamos la conexion (un pool de conexiones) a la BBDD
const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

/*  
- mysql es el módulo.

- createPool(...) es una función que crea un grupo (pool) de conexiones a la base de datos.
    - Crea un gestor de conexiones automático.
    - Se conecta a la base de datos usando los parámetros (host, user, password, etc.).
    - Por defecto, abre hasta 10 conexiones simultáneas (esto es configurable).
    - Permite usar await connection.query(...) para ejecutar SQL.
    - Le pasamos la configuración desde el objeto database.

Este objeto connection va a ser el que uses en otras partes de la aplicación para ejecutar consultas.*/

export default connection; // Exportamos el pool de conexiones para que pueda ser usado en otros archivos
```

#### Qué es un Pool de Conexiones?
Un pool de conexiones es un conjunto de conexiones activas y reutilizables a la base de datos. En lugar de abrir y cerrar una nueva conexión cada vez que haces una consulta, el pool:

- Mantiene abiertas varias conexiones.
- Las reutiliza para distintas consultas.
- El rendimiento y eficiencia del servidor.
- Controla cuántas conexiones pueden usarse al mismo tiempo.

Ventajas del Pool:
- Evita crear y destruir conexiones constantemente.
- Reduce la carga en la base de datos.
- Mejora la velocidad y capacidad de respuesta de la app.


---


### 2.3 Creamos un endpoint minimo para probar la conexion a la BBDD

#### Creamos el endpoint **GET all products** en `index.js`
```js
import express from "express";
import connection from "./src/api/database/db.js"; // Importamos la conexion de nuestra BBDD
import environments from "./src/api/config/environments.js"; // Traemos el puerto del .env

const PORT = environments.port;
const app = express();

app.get("/", (req, res) => {
    res.send("Hola mundo!");
});

// Creamos un endpoint minimo para verificar la conexion a la BBDD
// localhost:3000/products es nuestro endpoint, es decir la URL especifica de nuestra API Rest para obtener un recurso

app.get("/api/products", async (req, res) => { // Nuestra app atenderá peticiones get a la url /products
    try {
        const [rows] = await connection.query("SELECT * FROM products"); // Le pasamos la siguiente consulta SQL
        res.status(200).json({ // La respuesta que nos proporciona el objeto res devolverá el JSON
            payload: rows
        });

    } catch (error) {
        console.error("Error obteniendo productos: ", error.message)
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
```

---


### 2.4 Incorporamos un front minimo para consumir esa informacion
#### Consumimos el endpoint GET desde el front
```js
// Variables globales
let contenedorProductos = document.querySelector(".contenedor-productos");

async function mostrarProductos() {
    try {
        let respuesta = await fetch("http://localhost:3000/api/products");
        let formato = await respuesta.json();
        let productos = formato.payload;

        renderizarProductos(productos);

    } catch(error) {
        console.error(error);
    }
}

function renderizarProductos(array) {
    let htmlProducto = "";

    array.forEach(producto => {
        htmlProducto += `
            <div class="card-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <h3>${producto.name}</h3>
                <p>Id: ${producto.id}</p>
                <p>$${producto.price}</p>
            </div>
        `;
    });
    
    contenedorProductos.innerHTML = htmlProducto;
}
```

#### Vamos a encontrar un error!

---

### 2.5 Explicacion de CORS y los middlewares
Desde el front hacemos un fetch y encontraremos el siguiente fallo en la consola del navegador

```js
/*
Bloqueouse a solicitude Cross-Origin: a política «Same Origin» impide ler un recurso remoto en http://localhost:3000/api/products. (Razón: falta a cabeceira «Access-Control-Allow-Origin»). Código do estado: 200.
TypeError: NetworkError when attempting to fetch resource.
*/
```
#### Qué es CORS y por qué bloquea API

**CORS (Cross-Origin Resource Sharing)** es un mecanismo de seguridad implementado por los navegadores para restringir las solicitudes HTTP que se realizan desde un dominio diferente al del servidor de destino. Su propósito principal es prevenir ataques maliciosos, evitando que un sitio web malicioso acceda a recursos protegidos (como cookies o tokens de autenticación) de otro sitio sin autorización.

Cuando intentas consumir tu API REST desde una aplicación web alojada en un dominio distinto (por ejemplo, tu frontend en `http://localhost:3000` y tu API en `http://localhost:8080`), el navegador bloquea la solicitud si el servidor de la API no incluye las cabeceras adecuadas de CORS. Esto ocurre porque el **origen** (protocolo, dominio y puerto) de la aplicación cliente no coincide con el del servidor de la API, activando la **política de mismo origen**.

#### ¿Por qué no permite consumir tu API REST?
- El navegador bloquea la solicitud si el servidor no responde con las cabeceras de CORS necesarias.
- El error típico en la consola es: *"No 'Access-Control-Allow-Origin' header is present"*, lo que indica que el servidor no autoriza el acceso desde tu origen.

#### Solución
Para permitir el acceso desde tu frontend, debes configurar tu API REST para que responda con las siguientes cabeceras HTTP:
```http
Access-Control-Allow-Origin: https://tufrontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```
- Usa `*` como valor de `Access-Control-Allow-Origin` solo si la API es pública (no recomendado para APIs con credenciales).
- Para desarrollo local, puedes usar `http://localhost:3000` o `http://localhost:*`.
- En entornos de producción, especifica los dominios exactos permitidos.

#### Ejemplos de implementación:
- **PHP**: Usa `header('Access-Control-Allow-Origin: *');` al inicio del script.
- **Node.js/Express**: Usa el middleware `cors()` o configura manualmente las cabeceras.
- **Spring Boot**: Usa `@CrossOrigin` en el controlador o configura globalmente.
- **API Gateway (AWS, Oracle, Google)**: Activa CORS directamente en la consola o mediante políticas de solicitud.

Sin esta configuración, el navegador **bloqueará cualquier solicitud entre orígenes**, incluso si tu API está funcionando correctamente.

---


### 2.6 Incorporamos Middlewares en nuestra app

#### Que es un Middleware?
Los middlewares en Express son funciones que se ejecutan durante el ciclo de solicitud y respuesta de una aplicación. Estas funciones tienen acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo, que se denota normalmente como next Los middlewares pueden realizar tareas como ejecutar código, modificar los objetos de solicitud y respuesta, finalizar el ciclo de solicitud/respuesta o invocar a la siguiente función de middleware

Además, los middlewares pueden ser de diferentes tipos, como el middleware de nivel de aplicación, que se registra usando app.use() y se aplica a todas las rutas y métodos de una aplicación Express También existen middlewares de nivel de direccionador, que se enlazan a una instancia de express.Router() y se cargan utilizando las funciones router.use() y router.METHOD()


Los middlewares de terceros son funciones desarrolladas por la comunidad y publicadas en npm, que permiten agregar funcionalidades adicionales a las aplicaciones Express, como el análisis de cookies con el módulo cookie-parser Estos middlewares ayudan a separar las preocupaciones y gestionar rutas complejas de manera más eficiente

#### Instalamos cors
```sh
npm install cors
```

#### Hacemos uso de los siguientes middlewares en nuestro `index.js`
```js
//////////////////
// Middlewares //

// 1. Middlewares de aplicacion -> Aplicados a nivel de aplicacion para todas las solicitudes (autenticacion global, registro de solicitudes (logging), analisis del cuerpo de la solicitud (body parsing))

// 1.1 -> Middleware para parsear JSON en las solicitudes POST, PUT
app.use(express.json()); // Middleware para parsear JSON en body (sin el express no parseara la informacion en el body de la peticion y aparecera como undefined)
// It parses requests with a Content-Type header of application/json, storing the resulting data in req.body, making the JSON content easily accessible

// 1.2 -> Middleware CORS basico para permitir las solicitudes
app.use(cors()); // Middleware CORS básico que permite todas las solicitudes

// 1.3 -> Middleware para analizar las solicitudes por la consola
app.use((req, res, next) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	next(); // Pasa al siguiente middleware
});
```

Ahora podremos consumir los datos que proporciona nuestra API Rest desde una aplicacion frontend!


---


## 3. Creamos los endpoints basicos sin optimizar de nuestro CRUD

### 3.0 Conceptos fundamentales

- **GET**: Para obtener datos del servidor. Es lo que usamos para acceder a páginas web o buscar información.
- **POST**: Para enviar datos al servidor. Se usa comúnmente en formularios de registro, login, etc.
- **PUT**: Para actualizar información en el servidor.
- **DELETE**: Para eliminar información.

---

### 3.1 Creamos el endpoint **GET products by id**
```js
// GET product by id
app.get("/api/products/:id", async (req, res) => {

    // Hacer destructuring con const { id } = req.params;
    let id = req.params.id;
    
    // Evitamos consultas vulnerables usando placeholders
    // Ej: `SELECT * FROM products where products.id = ${id}`
    const [rows] = await connection.query("SELECT * FROM products where products.id = ?", [id]);

    res.status(200).json({
        payload: rows
    });
});
```

---

#### Consumimos el endpoint GET by id desde el front
```js
 getProduct_form.addEventListener("submit", async (event) => {

    event.preventDefault(); // Prevenimos el envio por defecto del formulario

    let formData = new FormData(event.target); // Creamos un nuevo objeto FormData a partir de los datos del formulario
    
    let data = Object.fromEntries(formData.entries()); // Transformamos a objetos JS los valores de FormData
    
    let idProd = data.idProd;
    
    try {
        // Hacemos el fetch a la url personalizada
        let response = await fetch(`http://localhost:3000/api/products/${idProd}"`);
        console.log(response);

        // Optimizacion 1 -> Evaluamos si el servidor respondio correctamente
        if(response.ok) {
            // Procesamos los datos que devuelve el servidor
            let datos = await response.json();
            console.log(datos);
            let producto = datos.payload[0];
            console.log(producto);

            // TO DO (pasarlo a function mostrarProducto)
                let htmlProducto = `
                    <li class="li-listados">
                        <img src="${producto.image}" alt="${producto.name}" class="img-listados">
                        <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${producto.price}</strong></p>
                    </li>
                `;

            getId_list.innerHTML = htmlProducto;
        } else {
            alert("Error, TO DO agardar a optimizacion")
        }

    } catch(error) {
        console.log(error);
        console.error("Error al obtener el producto: ", error.message);
    }
});
```

---

Listo! Ahora faltan los endpoints post, put y delete. 