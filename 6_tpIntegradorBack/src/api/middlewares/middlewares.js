/*=========================
    Middlewares
=========================*/

// Middleware logger para mostrar todas las solicitudes por consola
const loggerURL = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); // Pasa al siguiente middleware o continua a procesar la respuesta (para poder cerrar la conexion HTTP)
}


// Middleware de ruta para filtrar ids no validos
const validateId = (req, res, next) => {
    const { id } = req.params;

    // REGEX para aceptar solo digitos enteros positivos (filtrando "42abc", "0" o "-1", espacios)
    if(!/^\d+$/.test(id)) {
        return res.status(400).json({
            message: "El ID debe ser un numero entero positivo"
        });
    }

    // Convertimos el string a numero entero integer en base 10 decimal, y lo adjuntamos al objeto req
    const parsedId = parseInt(id, 10);

    if(parsedId === 0) {
        return res.status(400).json({
            message: "El id debe ser mayor a 0"
        });
    }

    req.id = parsedId;

    next(); // Pasamos al siguiente middleware o a la respuesta
}


// Middleware de ruta para validar los campos de un formulario
const categoriasValidas = ["food", "drink"];
const validateProduct = (req, res, next) => {

    // Recogemos los datos del body
    const { name, price, category } = req.body;

    // Creamos un array de errores
    const errores = [];

    if (typeof name !== "string" || name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof price !== "number" || price <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // No validaremos imagenes porque posteriormente usaremos Multer
    // https://www.npmjs.com/package/multer

    if (!categoriasValidas.includes(category)) {
        errores.push("Categoria invalida");
    }

    // Detectamos si existe algun error en la lista y lo devolvemos en un "400"
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos", errores
        })
    }

    next();
}



// Middleware de ruta basico para proteccion de rutas
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}




// Exportamos nuestros middlewares para poder utilizarlos donde los vayamos a necesitar
export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}