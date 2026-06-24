/*===============================
    Modelos de productos
================================*/

import connection from "../database/db.js";

///////////////////////////////
// Traer todos los productos
const selectAllProducts = () => {
    ///////////////////
    // Optimizacion 1: evitamos traer columnas innecesarias en la consulta SQL (mas eficiente en memoria y red)
    const sql = "SELECT id, name, price, image FROM products";

    return connection.query(sql); // En rows guardamos los resultados de nuestra sentencia SQL
}


///////////////////////////////
// Traer productos por id
const selectProductById = (id) => {
    //////////////////////
    // Optimizacion 2: Seleccionamos los campos necesarios
    // Este interrogante es el placeholder "?" que nos permite escribir sentencias SQL seguras (preveniendo ataques de inyeccion SQL)
    const sql = "SELECT id, name, price, image FROM products where products.id = ?";
    return connection.query(sql, [id]);
}



///////////////////////////////
// Crear nuevo producto
const insertProduct = (name, image, category, price) => {

    const sql = "INSERT INTO products (name, image, category, price) VALUES (?, ?, ?, ?)";

    // Optimizacion 4: Guardamos la respuesta en rows, para obtener el id rows.insertId
    return connection.query(sql, [name, image, category, price]);
}



///////////////////////////////
// Modificar producto
const updateProduct = (name, image, category, price, active, id) => {
    const sql = "UPDATE products SET name = ?, image = ?, category = ?, price = ?, active = ? WHERE id = ?";

    return connection.query(sql, [name, image, category, price, active, id]);
}


///////////////////////////////
// Eliminar producto
const deleteProduct = (id) => {
    const sql = "DELETE FROM products WHERE id = ?";
    return connection.query(sql, [id]);
}


// Gracias a la palabra clave default, podre ponerle otro nombre cuando importe
// Si no pongo default, tendre que importar con el mismo nombre
export default {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct
}