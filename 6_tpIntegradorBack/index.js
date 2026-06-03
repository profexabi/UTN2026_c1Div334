//////////////////
// Importaciones
// Esta es la sintaxis nueva de importar y exportar modulos de ESM -> type: module en el package.jjson
import express from "express"; 
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";



///////////
// Config
const app = express();
const PORT = environments.port;



/////////////////
// Middlewares
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

// Middleware logegr para mostrar todas las solicitudes por consola
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // Pasa al siguiente middleware o continua a procesar la respuesta
});

// TO DO:  Middleware para parsear a JSON en las solicitudes POST y PUT



/////////////
// Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

// GET all products
app.get("/api/products", async (req, res) => {
    try {
        const sql = "SELECT * FROM products";
        const [rows] = await connection.query(sql); // En rows guardamos los resultados de nuestra sentencia SQL
        // console.log(rows);

        // el objeto res nos permitira devolver un codigo de estado y un tipo de respuesta
        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error.message);
    }
});


// Get product by id
app.get("/api/products/:id", async (req, res) => {
    try {
        // Gracias al destructuring, agarramos el valor id de req.params
        const { id } = req.params;
        // const id = req.params.id -> misma solucion

        // Este interrogante es el placeholder
        const sql = "SELECT * FROM products where products.id = ?";
        const [rows] = await connection.query(sql, [id]);
        // console.log(rows);

        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo producto con id: ", error.message);
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});