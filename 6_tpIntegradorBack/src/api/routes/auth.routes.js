/*===========================
    Rutas de autenticacion
============================*/

import { Router } from "express";
import { destroySession, getAdminUser, loginView } from "../controllers/auth.controllers.js";

const router = Router();

/////////////////
// Vista login
router.get("/", loginView);


///////////////////////////
// Obtener usuarios admin
router.post("/", getAdminUser);


////////////////////
// Destruir sesion
router.post("/destroy", destroySession);



export default router;