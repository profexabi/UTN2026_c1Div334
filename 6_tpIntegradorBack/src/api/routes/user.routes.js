/*=========================
    Rutas usuario
==========================*/

import { Router } from "express"; // Importamos el modulo Router
import { createAdminUser } from "../controllers/user.controllers.js";
const router = Router(); // Inicializamos el modulo router


// POST user
router.post("/", createAdminUser);


export default router;