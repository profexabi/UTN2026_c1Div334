/*===============================
    Controladores productos
================================*/

// Los controladores se encargan de gestionar toda la logica de las peticiones (req) y respuestas (res)

// Importamos el modelo de los productos para poder comunicarlos con la BBDD. Los importo con un nombre para poder entender mejor la llamada al modelo (para que el codigo sea mas entendible, explicito y por tanto mantenible)
import ProductModels from "../models/product.models.js"

//////////////////////
// GET all products
export const getAllProducts = async (req, res) => {
    try {

        // Aca el controlador (que no debe hacer mas que la logica de gestion de req y res) llama al modelo
        const [rows] = await ProductModels.selectAllProducts();
        // En rows guardamos los resultados de nuestra sentencia SQL
        // console.log(rows);
        // el objeto res nos permitira devolver un codigo de estado y un tipo de respuesta

        ///////////////////
        // Optimizacion 2: Respuesta 404 si la BBDD no devuelve productos
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            })
        }
        
        res.status(200).json({
            ///////////////////
            // Optimizacion 3: Opcional, podemos devolver la cantidad de productos
            total: rows.length,
            payload: rows
        });


    } catch (error) {
        // En caso de que la promise del modelo se haya resuelto como REJECTED, vere en la consola del editor el mensaje del error para obtener informacion sobre el fallo y poder depurarlo
        console.log("Error obteniendo productos: ", error.message);

        ///////////////////
        // Optimizacion 4: Si fallo la conexion a la BBDD, tardo demasiado, la tabla no existe o hay error de sintaxis
        res.status(500).json({
            message: "Error interno al obtener productos"
        });
    }
}



//////////////////////
// GET product by id
export const getProductById = async (req, res) => {
    try {
        /*//////////////////////
        // Optimizacion 1:  Ahora el id ya lo obtiene el middleware validateId
        // Gracias al destructuring, agarramos el valor id de req.params
        const { id } = req.params;
        // const id = req.params.id -> misma solucion
        */

        const [rows] = await ProductModels.selectProductById(req.id);
        // console.log(rows);

        //////////////////////
        // Optimizacion 3: Si no encontramos un producto con ese id, devolvemos 404
        if(rows.length === 0) {
            return res.status(404).json({
                message: `No se encontro producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows[0]
        });

    } catch (error) {
        console.log("Error obteniendo producto con id: ", error.message);

        ///////////////////
        // Optimizacion 4: Le devolvemos un status 500 al cliente
        res.status(500).json({
            message: `Error interno al obtener un producto con id ${req.id}`
        });
    }
}



//////////////////
// POST product
export const createProduct = async (req, res) => {

    try {
        // Optimizacion 1: Validamos los datos recibidos en el middleware validateProduct (validaciones mas especificas por campo y separadas en un middleware reutilizable)

        // Gracias al middleware app.use(express.json()) puedo recibir la informacion como objetos en el req.body
        // console.log(req.body); 

        // Comprobamos que efectivamente vienen los datos del req.body parseados
        /*{
            name: 'Fernet Branca',
            image: 'https://http2.mlstatic.com/D_Q_NP_2X_685551-MLA99433693010_112025-E.webp',
            category: 'drink',
            price: '123'
        }*/

        // Con destructuring, extraigo los datos del req.body en variables sueltas
        const { name, image, category, price } = req.body;

        // Optimizacion 2: Verificamos los datos de entrada
        if (!name || !image || !category || !price) {
            return res.status(400).json({
                message: "Datos invalidos, asegurate de incluir todas las categorias"
            });
        }

        // Optimizacion 3: Sanitizamos los strings antes de insertar para normalizar los datos
        const cleanName = name.trim();

        /*
        console.log(`URL del refrigerio: ${image}`);
        console.log(`Nombre del fernetazo: ${name}`);
        console.log(price);
        */
        const [rows] = await ProductModels.insertProduct(cleanName, image, category, price);

        // Optimizacion 5: En lugar de 200 OK, mejor 201 Created
        res.status(201).json({
            message: `Producto creado con exito con id ${rows.insertId}`,
            productId: rows.insertId // Optimizacion 4: Obtenemos tambien el id creado
        });

    } catch (error) {
        console.log(error);

        // Optimizacion 6: Devolvemos una respuesta 500
        res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}



//////////////////
// PUT product
export const modifyProduct = async (req, res) => {

    try {
        // Con el destructuring, recibimos todos los datos del producto
        const { id, name, image, category, price, active } = req.body;

        // Optimizacion 1: Validamos que vengan los campos necesarios antes de tocar la BBDD
        if (!name || !image || !price || !category) {
            return res.status(400).json({
                message: "Todos los campos son requeridos (name, image, price, category"
            });
        }

       
        const [result] = await ProductModels.updateProduct(name, image, category, price, active, id);

        // Optimizacion 2: Verificamos si realmente se actualizo algo
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No se actualizó el producto"
            });
        }


        return res.status(200).json({
            message: `Producto con id ${id} actualizado correctamente`
        });

    } catch (error) {
        console.log(error);

        // Optimizacion 3: Devolvemos un error 500 si fallo algo en el servidor
        res.status(500).json({
            message: "Error interno al actualizar el producto"
        })
    }
}


// DELETE product
export const removeProduct = async (req, res) => {
    // Optimizacion 1: El middleware validateId ya limpia e incorpora el id en la req.id (no hace falta extraerlo)
    // const { id } = req.params;

    // Optimizacion 2: Manejar errores con un bloque try...catch
    try {
       
        await ProductModels.deleteProduct(req.id);
    
        // OPCION 1: 200 normal, devolvemos un 200 con un mensaje en el res.body
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente`
        });

        // OPCION 2: 204: Para un DELETE exitoso, la convencion REST es devolver 204 No Content sin body

    } catch (error) {
        console.log("Error en peticion DELETE: ", error);

        // Optimizacion 3: Devolvemos un codigo de estado 500 y le enviamos un mensaje generico (no enviamos el error crudo al cliente)
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}