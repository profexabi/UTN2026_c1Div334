//////////////////
// Importaciones
// Esta es la sintaxis nueva de importar y exportar modulos de ESM -> type: module en el package.jjson
import express from "express"; 
import environments from "./src/api/config/environments.js";
import cors from "cors";
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { authRoutes, productRoutes, userRoutes, viewRoutes } from "./src/api/routes/index.js";
import { join, __dirname } from "./src/api/utils/index.js";
import session from "express-session";


///////////
// Config
const { port, session_key } = environments;
const app = express();
const PORT = port;

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

// Middleware para parsear los datos enviados de forma nativa con el <form> HTML
app.use(express.urlencoded({ extended: true })); // Ahora los datos del <form> llegaran como objetos a nuestro endpoint

// Middleware para servir archivos estaticos
app.use(express.static(join(__dirname, "src/public")));
// Gracias a esto, podremos acceder a un fichero CSS poniendo localhost:3000/css/styles.css

// Middleware de sesion
app.use(session({
    secret: session_key, // Firma las cookies para evitar manipulacion
    resave: false, // Evita guardar la sesion si no hubo cambios
    saveUninitialized: true // No guarda sesiones vacias
}));


/////////////
// Rutas
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/dashboard", viewRoutes);
app.use("/login", authRoutes);
/*
app.use("/api/users", rutasUsuario);
*/


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
