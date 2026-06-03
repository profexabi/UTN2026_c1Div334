// Importamos el modulo mysql2 en modo promesas, apra poder hacer peticiones asincronas a la BBDD
import mysql2 from "mysql2/promise";
import environments from "../config/environments.js"; // Importamos la info de la conexion a la BBDD

// Traemos la info del .env que lee y exporta el archivo
const { database } = environments;


// Creamos la conexion (un pool de conexinoes a la BBDD)
const connection = mysql2.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection; // Exportamos el pool de conexiones para que pueda ser usando en otros archivos

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

