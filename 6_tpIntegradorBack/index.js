//////////////////
// Importaciones
// Esta es la sintaxis nueva de importar y exportar modulos de ESM -> type: module en el package.jjson
import express from "express"; 
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { productRoutes, viewRoutes } from "./src/api/routes/index.js";
import { join, __dirname } from "./src/api/utils/index.js";



///////////
// Config
const app = express();
const PORT = environments.port;

app.set("view engine", "ejs"); // Configuramos EJS como motor de plantillas
app.set("views", join(__dirname, "src/views")); // Ahora la app sabe donde encontrar estas vistas para servirlas con res.render("index")


/////////////////
// Middlewares
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

// Middleware logger para mostrar todas las solicitudes por consola
app.use(loggerURL);

/* Middleware para parsear JSON en las solicitudes POST y PUT
Sin este middleware express no parsear la informacion en el request.body
Parsea peticiones con el Content-Type application/json, guardando la informacion en el req.body*/
app.use(express.json());

// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public")));
// Gracias a esto, podremos acceder a un fichero CSS poniendo localhost:3000/css/styles.css



/////////////
// Rutas
app.use("/api/products", productRoutes)
app.use("/dashboard", viewRoutes);
/*
app.use("/api/users", rutasUsuario);
app.use("/login", rutasAutenticacion)
*/


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
