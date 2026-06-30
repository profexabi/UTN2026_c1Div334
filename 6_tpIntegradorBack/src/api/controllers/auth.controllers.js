/*===================================
    Controladores de autenticacion
===================================*/

import connection from "../database/db.js";

/////////////////
// Vista Login
export const loginView = (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introduci tu email y password"
    })
}


/////////////////
// Obtener usuarios admin
export const getAdminUser = async (req, res) => {
    // TODO crear modelo de usuarios!!

    try {
        // Vamos a recibir los datos que me envia el form del login
        const { email, password } = req.body;

        // Evitamos consulta innecesaria
        if (!email, !password) {
            return res.render("login", {
                error: "Todos los campos son obligatorios"
            });
        }

        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);

        if (rows.length === 0) {
            return res.render("login", {
                error: "Credenciales incorrectas"
            });
        }

        const user = rows[0];
        console.table(user);

        // Guardamos una sesion
        req.session.user = {
            id: user.id,
            nombre: user.name,
            email: user.email
        }

        // Con la sesion creada, redirigimos, ahora si al dashboard
        res.redirect("/dashboard/index");

    } catch (error) {
        console.log(error);
    }
}