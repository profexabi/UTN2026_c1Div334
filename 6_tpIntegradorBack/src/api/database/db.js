// Importamos el modulo mysql2 en modo promesas, apra poder hacer peticiones asincronas a la BBDD
import mysql2 from "mysql2/promise"; // Recuerden que usamos PROMESAS aca!
import environments from "../config/environments.js"; // Importamos la info de la conexion a la BBDD

// Traemos la info del .env que lee y exporta el archivo
const { database } = environments;


// Creamos la conexion, mas concretamente el CONJUNTO DE CONEXIONES ABIERTAS a la BBDD(a esto lo llamamos pool de conexiones)
const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection; // Exportamos el pool de conexiones para que pueda ser usando en otros archivos

// ESTA CONEXION LA IMPORTARA LA CARPETA MODELS/ que se encarga (segun el patron MVC) de la comunicacion con la BBDD

/*=================
    Explicacion
===================

mysql es el modulo

createPool es una funcion que crea un grupo (pool) de conexiones a la BBDD

    - Crea un gestor de conexiones automatico
    - Se conecta a la BBDD usando los parametros (host, user, password, etc)
    - Por defecto, abre hasta 1- conexiones simultaneas (esto es configurable)
    - Permite usar await connection.query() para ejecutar una sentencia SQL
    - Le pasamos la configuracion desde el objeto database
*/

