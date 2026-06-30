/*=========================
    Archivo de barril
==========================*/

// Contiene todas las rutas, la importa, las centraliza aca y las exporta con un nombre
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js"

// import userRoutes from "./user.routes.js"

export {
    productRoutes,
    viewRoutes,
    authRoutes
}
