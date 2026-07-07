/*=========================
    Rutas producto
==========================*/

import { Router } from "express"; // Importamos el modulo Router
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";


const router = Router(); // Inicializamos el modulo router

// Las rutas se encargan de redirigir todo el trafico (todas las peticiones) de una URL a un UNICO archivo gestionado por el middleware router. Este se encargara de llamar a los respectivos middlewares de ruta (si los hay) y tambien al controlador para derivarle la gestion de peticiones y respuestas


// GET all products
router.get("/", getAllProducts); // Esta consulta a /api/products/ con la peticion GET la redirige al controlador getAllProducts


// GET product by id
router.get("/:id", validateId, getProductById); // Esta consulta a /api/products/:id con la peticion GET, llama al middleware de ruta (para validar el id) y si pasa este filtro, llama luego al controlador


// POST product
router.post("/", validateProduct, createProduct); // Esta consulta a /api/products/ con la peticion POST llama al middleware de ruta para validar el nuevo producto y si pasa el filtro, luego llama al contorlador


// UPDATE product
router.put("/", modifyProduct);


// DELETE product
router.delete("/:id", validateId, removeProduct);


export default router;