## Refactorizacion y modularizacion
La **refactorización** es el proceso de mejorar la estructura interna del código sin alterar su comportamiento externo, mientras que la **modularización** implica dividir el código en unidades independientes y cohesivas para mejorar la organización. En el contexto de **Express**, esto significa extraer rutas, modelos y configuraciones de un archivo único (como `index.js`) a archivos separados, previniendo el crecimiento desordenado y facilitando el mantenimiento.

**Beneficios principales:**

*   **Evita colisiones de nombres:** Cada módulo tiene su propio alcance, impidiendo conflictos entre variables globales.
*   **Mejora la legibilidad:** El código se vuelve más limpio, fácil de entender y reducir la curva de aprendizaje para nuevos desarrolladores.
*   **Facilita el mantenimiento:** Permite modificar o escalar funcionalidades específicas sin afectar el resto de la aplicación.
*   **Reduce la deuda técnica:** Elimina código duplicado y soluciones temporales que complican el sistema a largo plazo.

**Técnicas comunes en Express:**

*   **Separación de rutas:** Mover las definiciones de rutas (`router.get`, `router.post`) a un archivo dedicado en una carpeta como `routes/`.
*   **Aislamiento de modelos:** Definir esquemas de base de datos (ej. **Mongoose**) en archivos separados dentro de una carpeta `models/`.
*   **Gestión de dependencias:** Importar módulos creados en el archivo principal (`index.js`) en lugar de definir toda la lógica allí.
*   **Renombrado y simplificación:** Usar nombres descriptivos para variables y funciones, y dividir métodos extensos en rutinas más pequeñas.

Esta práctica debe respaldarse con **pruebas automatizadas** para garantizar que los cambios estructurales no introduzcan errores ni alteren la funcionalidad actual de la aplicación.


---

## Donde usar `await`, en el controlador o en el modelo?
La opción más común y recomendable es usar `await` en el **controlador**, no en el modelo.

Tu modelo debería limitarse a devolver la promesa que genera la consulta:

```js
const selectAllProducts = () => {
    const sql = "SELECT id, name, price, image FROM products";
    return connection.query(sql);
}
```

Y luego resolverla en el controlador:

```js
const [rows] = await ProductsModel.selectAllProducts();
```

### ¿Por qué?

Porque el modelo se mantiene más flexible:

* Si mañana necesitas combinar varias consultas con `Promise.all()`, puedes hacerlo fácilmente.
* El controlador decide cuándo esperar el resultado.
* Mantienes una separación clara de responsabilidades:

  * **Modelo:** acceso a datos.
  * **Controlador:** flujo de negocio y manejo de errores HTTP.

### ¿Y si pongo `await` en el modelo?

También funciona:

```js
const selectAllProducts = async () => {
    const sql = "SELECT id, name, price, image FROM products";
    const [rows] = await connection.query(sql);
    return rows;
}
```

Y en el controlador:

```js
const rows = await ProductsModel.selectAllProducts();
```

Esto tiene la ventaja de ocultar detalles de la base de datos (`fields`, estructura de respuesta de mysql2, etc.), dejando una API más limpia para el controlador.

### Mi recomendación

En proyectos pequeños o medianos, prefiero que el modelo devuelva los datos ya procesados:

```js
// model
const selectAllProducts = async () => {
    const sql = "SELECT id, name, price, image FROM products";
    const [rows] = await connection.query(sql);
    return rows;
};
```

```js
// controller
const rows = await ProductsModel.selectAllProducts();

if (rows.length === 0) {
    return res.status(404).json({
        message: "No se encontraron productos"
    });
}
```

Así el controlador no conoce que estás usando `mysql2` ni que la consulta devuelve `[rows, fields]`. Si en el futuro cambias de ORM o de driver, solo modificas el modelo. Esto suele considerarse una mejor encapsulación.

---


### Middleware `Router`
El **middleware Router** en Express es un sistema de enrutamiento y middleware aislado que se ejecuta únicamente en una instancia de `express.Router()`. A menudo se le denomina una **"mini-aplicación"** porque posee su propia pila de middleware y rutas, independiente de la aplicación principal.

Su función principal es permitir la **modularidad**, facilitando la organización de rutas en archivos separados (por ejemplo, separar rutas de usuarios, administración o APIs) y aplicar lógica específica (como autenticación o logs) solo a ese grupo de rutas.

## Características Principales

El middleware Router funciona de manera similar al middleware a nivel de aplicación (`app.use`), pero con un alcance limitado al router donde se define.

*   **Aislamiento:** El código definido dentro de un router no afecta a otras partes de la aplicación a menos que el router sea montado explícitamente.
*   **Encadenamiento:** Permite definir múltiples funciones middleware y rutas que se ejecutan secuencialmente cuando se coincide con la ruta base.
*   **Reutilización:** Un router puede exportarse como un módulo y utilizarse en diferentes partes de una aplicación o en proyectos distintos.
*   **Control de Flujo:** Al igual que en la aplicación principal, se utiliza la función `next()` para pasar el control al siguiente middleware y `next('router')` para saltar el resto de las funciones del router actual y devolver el control a la aplicación padre.


---


### Que es MVC?
El **patrón MVC** (Modelo-Vista-Controlador) es una arquitectura de software que organiza una aplicación separando sus responsabilidades en tres componentes interconectados pero independientes. Su objetivo principal es desacoplar la lógica de negocio de la interfaz de usuario y la gestión de eventos, facilitando el mantenimiento y la escalabilidad del código.

Los tres componentes fundamentales son:

*   **Modelo (Model)**: Gestiona los datos y la lógica de negocio de la aplicación. Es responsable de recuperar, validar y persistir la información (por ejemplo, interactuando con una base de datos), sin conocer cómo se mostrarán esos datos.
*   **Vista (View)**: Se encarga de la presentación y la interfaz de usuario. Muestra la información proporcionada por el modelo en un formato legible (como HTML o JSON) y captura las interacciones del usuario, pero no procesa la lógica de los datos.
*   **Controlador (Controller)**: Actúa como intermediario. Recibe las entradas del usuario (peticiones HTTP), interactúa con el modelo para obtener o modificar datos y selecciona la vista adecuada para renderizar la respuesta.

### Flujo de trabajo típico

1.  El usuario interactúa con la **Vista** (ej. hace clic en un botón).
2.  La vista notifica al **Controlador** sobre la acción.
3.  El controlador procesa la solicitud y actualiza o consulta el **Modelo**.
4.  El modelo devuelve los datos actualizados al controlador.
5.  El controlador envía los datos a la **Vista** para que se actualice la interfaz.

### Beneficios clave

*   **Separación de preocupaciones**: Cada componente tiene una responsabilidad única, lo que hace el código más limpio y organizado.
*   **Desarrollo paralelo**: Diferentes desarrolladores pueden trabajar simultáneamente en la interfaz (vista), la lógica (controlador) y los datos (modelo).
*   **Reutilización**: Un mismo modelo puede ser utilizado por múltiples vistas (ej. una web y una API móvil) sin duplicar código.
*   **Mantenibilidad**: Los cambios en la interfaz no afectan la lógica de negocio y viceversa.

En el contexto de **Express.js**, aunque es un framework minimalista que no impone MVC por defecto, este patrón se implementa manualmente creando carpetas separadas para `models`, `views` (o plantillas) y `controllers`, utilizando `express.Router()` para conectar las rutas con sus respectivos controladores.


---


### Qué es modularizar una aplicacion?
**Modularizar una aplicación Express** es la práctica de dividir el código en archivos y módulos independientes para mejorar la organización, la mantenibilidad y la escalabilidad del proyecto. En lugar de concentrar toda la lógica (rutas, controladores, modelos y configuración) en un solo archivo, se separan las responsabilidades en unidades cohesivas.

Esta práctica ofrece varios beneficios clave:

*   **Aislamiento de responsabilidades**: Se pueden crear archivos separados para el manejo de rutas (`express.Router()`), la lógica de negocio, los modelos de datos y el middleware, evitando que el archivo principal (`index.js` o `server.js`) crezca excesivamente.
*   **Gestión del espacio de nombres**: Al usar módulos (ya sea con CommonJS `require`/`module.exports` o ES6 `import`/`export`), se evita la colisión de variables globales, ya que cada archivo tiene su propio alcance.
*   **Reutilización y claridad**: El código se vuelve más fácil de entender, probar y reutilizar, permitiendo que cada módulo se enfoque en una funcionalidad específica del dominio (por ejemplo, gestión de usuarios, blogs, etc.).

Para implementarlo, se suele utilizar `express.Router()` para definir rutas en archivos dedicados (como `routes/usuarios.js`) y luego montar esos routers en la aplicación principal, o se estructuran los directorios separando modelos, controladores y servicios.
