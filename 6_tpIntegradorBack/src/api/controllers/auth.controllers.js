/*===================================
    Controladores de autenticacion
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

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
                title: "Login",
                about: "Introduci tu email y password",
                error: "Todos los campos son obligatorios"
            });
        }

        // Previo al bcrypt
        /*
        const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        const [rows] = await connection.query(sql, [email, password]);
        */

        // Bcrypt 1 -> Pedir solo el usuario que exista con ese email
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await connection.query(sql, [email]);

        

        
        
        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introduci tu email y password",
                error: "Credenciales incorrectas"
            });
        }
        
        const user = rows[0];
        console.table(user);

        // Bcrypt 2 -> Traemos el password del req.body y comprobamos si su hasheo es el mismo que el de la BBDD
        const match = await bcrypt.compare(password, user.password);
        console.log(match);
        
        // Si los passwords hasheados coinciden, match es true y pasamos a crear la sesion y redirigir
        if (match) {
            // Guardamos una sesion
            req.session.user = {
                id: user.id,
                nombre: user.name,
                email: user.email
            }
    
            // Con la sesion creada, redirigimos, ahora si al dashboard
            res.redirect("/dashboard/index");

        } else {
            return res.render("login", {
                title: "Login",
                about: "Introduci tu email y password",
                error: "Contraseña incorrecta"
            })
        }

    } catch (error) {
        console.log(error);
    }
}


/////////////////
// Destruir sesion
export const destroySession = (req, res) => {
    req.session.destroy((err) => {

        // Si hubiera algun error, mandamos un aviso por consola y por un alert y retornamos un error 500
        if (err) {
            console.error("Error al destruir la sesion: ", err);
            alert("Error al destruir la sesion: ", err);

            return res.status(500).json({
                message: "Error al cerrar sesion"
            })
        }

        // Si no existiera ningun error, redirigimos a la pagina de login
        res.redirect("/login");
    })
}