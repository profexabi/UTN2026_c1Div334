// Importamos el modulo dotenv para leer las variables de entorno de nuestro .env
import dotenv from "dotenv";

dotenv.config(); // Cargamos las variables de entorno desde el archivo .env

// Obtenidas las variables de entorno las exportamos para usarlas en los modulos donde las necesitemos, todo se centraliza en este archivo
export default {
    port: process.env.PORT || 3000,
    session_key: process.env.SESSION_KEY,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
}