/*===========================
    Rutas de autenticacion
============================*/

import { Router } from "express";
import { getAdminUser, loginView } from "../controllers/auth.controllers.js";

const router = Router();

// Vista login
router.get("/", loginView);


// Obtener usuarios admin
router.post("/", getAdminUser);



export default router;