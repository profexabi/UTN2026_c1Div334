/*=========================
    Rutas de vistas
==========================*/

import { Router } from "express";
import { createView, deleteView, getView, indexView, updateView } from "../controllers/view.controllers.js";
import { requireLogin } from "../middlewares/middlewares.js";
const router = Router();

// Vista principal del dashboard
router.get("/index", requireLogin, indexView);

// Vista consultar producto
router.get("/get", requireLogin, getView);

// Vista crear producto
router.get("/post", requireLogin, createView);

// Vista modificar producto
router.get("/put", requireLogin, updateView);

// Vista eliminar producto
router.get("/delete", requireLogin, deleteView);

export default router;