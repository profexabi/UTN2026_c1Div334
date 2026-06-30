/*===============================
    Controladores  de vistas
================================*/

// Importamos el modelo de los productos para poder comunicarlos con la BBDD
import ProductModels from "../models/product.models.js"

// Vista index
export const indexView = async (req, res) => {

    try {
        const [rows] = await ProductModels.selectAllProducts();

        res.render("index", {
            title: "Inicio",
            about: "Nuestros productos",
            productsArray: rows
        });

    } catch (error) {
        console.log(error);
    }
}

// Vista GET
export const getView = (req, res) => {
    res.render("get", {
        title: "Consultar",
        about: "Consultar producto por id:"
    });
}

// Vista POST
export const createView = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear producto"
    });
}

// Vista PUT
export const updateView = (req, res) => {
    res.render("put", {
        title: "Modificar",
        about: "Consultar producto por id:"
    });
}

// Vista DELETE
export const deleteView = (req, res) => {
    res.render("delete", {
        title: "Eliminar",
        about: "Consultar producto por id:"
    });
}