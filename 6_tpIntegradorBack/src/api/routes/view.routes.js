/*=========================
    Rutas de vistas
==========================*/

import { Router } from "express";
import { createView, deleteView, getView, indexView, updateView } from "../controllers/view.controllers.js";
const router = Router();

// Vista principal del dashboard
router.get("/index", indexView);

// Vista consultar producto
router.get("/get", getView);

// Vista crear producto
router.get("/post", createView);

// Vista modificar producto
router.get("/put", updateView);

// Vista eliminar producto
router.get("/delete", deleteView);

export default router;