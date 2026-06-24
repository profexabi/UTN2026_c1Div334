/*=========================
    Rutas producto
==========================*/

import { Router } from "express"; // Importamos el modulo Router
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { createProduct, getAllProducts, getProductById, modifyProduct, removeProduct } from "../controllers/product.controllers.js";


const router = Router(); // Inicializamos el modulo router


// GET all products
router.get("/", getAllProducts);


// GET product by id
router.get("/:id", validateId, getProductById);


// POST product
router.post("/", validateProduct, createProduct);


// UPDATE product
router.put("/", modifyProduct);


// DELETE product
router.delete("/:id", validateId, removeProduct);


export default router;