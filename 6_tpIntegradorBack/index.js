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
    next(); // Pasa al siguiente middleware o continua a procesar la respuesta (para poder cerrar la conexion HTTP)
});

/* Middleware para parsear JSON en las solicitudes POST y PUT

    Sin este middleware express no parsear la informacion en el request.body
    Parsea peticiones con el Content-Type application/json, guardando la informacion en el req.body
*/
app.use(express.json());

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


// GET product by id
app.get("/api/products/:id", async (req, res) => {
    try {
        // Gracias al destructuring, agarramos el valor id de req.params
        const { id } = req.params;
        // const id = req.params.id -> misma solucion

        // Este interrogante es el placeholder "?" que nos permite escribir sentencias SQL seguras (preveniendo ataques de inyeccion SQL)
        const sql = "SELECT * FROM products where products.id = ?";
        const [rows] = await connection.query(sql, [id]);
        // console.log(rows);

        res.status(200).json({
            payload: rows[0]
        });

    } catch (error) {
        console.log("Error obteniendo producto con id: ", error.message);
    }
});


// POST product
app.post("/api/products", async (req, res) => {
    try {
        // Gracias al middleware app.use(express.json()) puedo recibir la informacion como objetos en el req.body
        console.log(req.body); 
        // Comprobamos que efectivamente vienen los datos del req.body parseados
        /*{
            name: 'Fernet Branca',
            image: 'https://http2.mlstatic.com/D_Q_NP_2X_685551-MLA99433693010_112025-E.webp',
            category: 'drink',
            price: '123'
        }*/

        // Con destructuring, extraigo los datos del req.body en variables sueltas
        const { name, image, category, price } = req.body;
        /*
        console.log(`URL del refrigerio: ${image}`);
        console.log(`Nombre del fernetazo: ${name}`);
        console.log(price);
        */

        const sql = "INSERT INTO products (name, image, category, price) VALUES (?, ?, ?, ?)";

        await connection.query(sql, [name, image, category, price]);

        res.status(200).json({
            message: "Producto creado con exito"
        });

    } catch (error) {
        console.log(error);
    }
});


// UPDATE product
app.put("/api/products", async (req, res) => {

    try {
        // Con el destructuring, recibimos todos los datos del producto
        const { id, name, image, category, price, active } = req.body;

        const sql = "UPDATE products SET name = ?, image = ?, category = ?, price = ?, active = ? WHERE id = ?";

        await connection.query(sql, [name, image, category, price, active, id]);

        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.log(error);
    }
})


// DELETE product
app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;

    await connection.query("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).json({
        message: `Producto con id ${id} eliminado exitosamente`
    });
})



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});