/*===================================
    Controladores de usuario
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

export const createAdminUser = async (req, res) => {
    try {

        const { nameUser, emailUser, passwordUser } = req.body;

        if (!nameUser || !emailUser || !passwordUser) {
            return res.status(400).json({
                message: "Datos invalidos, faltan campos"
            });
        }

        // Definimos las rondas de sal para aleatorizar los valores del password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordUser, saltRounds);

        const sql = "INSERT into users (name, email, password) values (?, ?, ?)";

        const [rows] = await connection.query(sql, [nameUser, emailUser, hashedPassword]);

        res.status(201).json({
            message: "Usuario admin creado con exito"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}