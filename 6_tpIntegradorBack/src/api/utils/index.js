/*============================================================
    Logica para trabajar con archivos y rutas del proyecto
==============================================================

Aca realizaremos la logica para manejar rutas de archivos y directorios
Cuando trabajamos con Express.js y plantillas EJS necesitamos frecuentemente

    - Referenciar archivos de plantillas
    - Servir archivos estaticos (CSS, JS, imagenes, etc)
    - Construir rutas confiables independientes del sistema operativo

Las rutas absolutas son clave para evitar errores cuando la aplicacion se mueve entre directorios o servidores

En ESM no existen __dirname ni __filename, por eso tenemos que reconstruirlos manualmente, para poder

    1. Trabajar con rutas absolutas
    2. Resolver rutas de archivos estaticos
    3. Construir paths para enviar HTML, CSS, imagenes, sarasa
    4. Evitar errores como "Cannot find module" o rutas rotas en produccion

Antes con commonjs podiamos hacer
app.use(express.static(__dirname + "/src/public"))

*/

//////////////////////////////
// Importamos los modulos para trabajar con rutas

// Convierte una URL de archivo (file://) a una ruta del sistema de archivos
import { fileURLToPath } from "url"; 

// dirname resuelve el directorio padre de una ruta
// join Une segmentos de ruta de forma segura
import { dirname, join } from "path";


// Vamos a obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url); // Proporcionamos la URL del modulo actual y transformamos esa URL de archivo (de nuestro modulo) en una URL de sistema

/*
Pasamos de

import.meta.url
    file:///home/user/proyecto/src/api/utils/index.js

fileURLToPath
    /home/user/proyecto/src/api/utils/index.js
*/

// Obtenemos el directorio del archivo actual
const __dirname = join(dirname(__filename), "../../../");

// Gracias a esto, podremos construir rutas relativas desde la raiz de nuestro servidor
export {
    __dirname,
    join
}
