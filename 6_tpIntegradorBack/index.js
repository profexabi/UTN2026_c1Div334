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


// Middleware de ruta para filtrar ids no validos
const validateId = (req, res, next) => {
    const { id } = req.params;

    // REGEX para aceptar solo digitos enteros positivos (filtrando "42abc", "0" o "-1", espacios)
    if(!/^\d+$/.test(id)) {
        return res.status(400).json({
            error: "El ID debe ser un numero entero positivo"
        });
    }

    // Convertimos el string a numero entero integer en base 10 decimal, y lo adjuntamos al objeto req
    const parsedId = parseInt(id, 10);

    if(parsedId === 0) {
        return res.status(400).json({
            error: "El id debe ser mayor a 0"
        });
    }

    req.id = parsedId;

    next(); // Pasamos al siguiente middleware o a la respuesta
}




/////////////
// Endpoints
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

// GET all products
app.get("/api/products", async (req, res) => {
    try {

        ///////////////////
        // Optimizacion 1: evitamos traer columnas innecesarias en la consulta SQL (mas eficiente en memoria y red)
        const sql = "SELECT id, name, price, image FROM productssss";

        const [rows] = await connection.query(sql); // En rows guardamos los resultados de nuestra sentencia SQL
        // console.log(rows);
        // el objeto res nos permitira devolver un codigo de estado y un tipo de respuesta

        ///////////////////
        // Optimizacion 2: Respuesta 404 si la BBDD no devuelve productos
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            })
        }

        res.status(200).json({

            ///////////////////
            // Optimizacion 3: Opcional, podemos devolver la cantidad de productos
            total: rows.length,
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error.message);

        ///////////////////
        // Optimizacion 4: Si fallo la conexion a la BBDD, tardo demasiado, la tabla no existe o hay error de sintaxis
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
});


// GET product by id
app.get("/api/products/:id", validateId, async (req, res) => {
    try {
        /*//////////////////////
        // Optimizacion 1:  Ahora el id ya lo obtiene el middleware validateId
        // Gracias al destructuring, agarramos el valor id de req.params
        const { id } = req.params;
        // const id = req.params.id -> misma solucion
        */

        //////////////////////
        // Optimizacion 2: Seleccionamos los campos necesarios
        // Este interrogante es el placeholder "?" que nos permite escribir sentencias SQL seguras (preveniendo ataques de inyeccion SQL)
        const sql = "SELECT id, name, price, image FROM products where products.id = ?";
        const [rows] = await connection.query(sql, [req.id]);
        // console.log(rows);

        //////////////////////
        // Optimizacion 3: Si no encontramos un producto con ese id, devolvemos 404
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontro producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows[0]
        });

    } catch (error) {
        console.log("Error obteniendo producto con id: ", error.message);

        ///////////////////
        // Optimizacion 4: Le devolvemos un status 500 al cliente
        res.status(500).json({
            error: "Error interno al obtener un producto con id"
        })
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