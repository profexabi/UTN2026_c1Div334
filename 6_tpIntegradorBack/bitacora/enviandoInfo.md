## Que errores captura el bloque `catch` en un `fetch`?
El bloque `catch` en una solicitud `fetch` **solo captura errores de red o de redacción de la petición**, como la falta de conexión a internet, fallos de DNS o solicitudes abortadas.

Es crucial entender que `fetch` **no considera errores de estado HTTP** (como 404 Not Found o 500 Internal Server Error) como fallos de la promesa. Si el servidor responde con un código de error, la promesa se resuelve exitosamente y el control pasa a `.then`, no a `.catch`.

Para manejar estos casos, debes verificar manualmente la respuesta dentro de `.then` o `try/catch` (si usas `await`):

```javascript
try {
  const response = await fetch('https://api.ejemplo.com/datos');
  
  // Fetch no lanza error aquí, aunque el servidor diga 404 o 500
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }
  
  const data = await response.json();
} catch (error) {
  // Este catch captura:
  // 1. Errores de red (sin internet, DNS fallido)
  // 2. Errores lanzados manualmente (como el throw de response.ok)
  // 3. Errores al parsear JSON (SyntaxError)
  console.error(error.message);
}
```

**Resumen de lo que captura `catch`:**
*   **Errores de red:** Falta de conectividad, bloqueos de CORS, DNS inválido.
*   **Errores de parseo:** Intentar leer `.json()` de un cuerpo que no es JSON válido.
*   **Errores manuales:** Excepciones lanzadas con `throw` después de verificar `response.ok`.
*   **Solicitudes abortadas:** Cuando se usa `AbortController` para cancelar la petición.


---



## Que hace la keyword return en JavaScript
La palabra clave **`return`** en JavaScript tiene dos funciones principales dentro de una función:

1.  **Devuelve un valor:** Envía un resultado específico (número, texto, objeto, etc.) al lugar donde se llamó la función.
2.  **Detiene la ejecución:** Finaliza inmediatamente la función. Cualquier código escrito después de un `return` no se ejecutará.

Si una función no incluye una sentencia `return`, devolverá automáticamente **`undefined`**.

## Funcionamiento y Sintaxis

La sintaxis básica consiste en la palabra clave seguida de la expresión o valor que se desea retornar.

```javascript
function nombreFuncion(parametro) {
  // Lógica de la función
  return parametro * 2; // Devuelve el valor y termina la función
}

const resultado = nombreFuncion(5);
console.log(resultado); // Salida: 10
```

### Comportamiento Clave

*   **Finalización inmediata:** En cuanto el intérprete encuentra `return`, la función se cierra. Esto es útil para salir temprano de una función si se cumple cierta condición (por ejemplo, en validaciones o manejo de errores).
*   **Valor por defecto:** Si se usa `return` solo, o si no se usa ninguno, el valor de retorno es `undefined`.
*   **Ubicación:** Solo puede utilizarse dentro del cuerpo de una función.

## Tipos de Datos Retornables

JavaScript permite devolver **cualquier tipo de dato** desde una función.

| Tipo de Dato | Ejemplo de Retorno | Descripción |
| :--- | :--- | :--- |
| **Primitivos** | `return 42;` | Números, cadenas, booleanos, null, undefined. |
| **Objetos** | `return { id: 1 };` | Estructuras de datos complejos o colecciones. |
| **Arrays** | `return [1, 2, 3];` | Listas de valores. |
| **Funciones** | `return function() {};` | Permite crear funciones de orden superior o closures. |

### Ejemplo de Retorno de Objeto
```javascript
function obtenerUsuario() {
  return {
    nombre: "Ana",
    edad: 30
  };
}

const usuario = obtenerUsuario();
console.log(usuario.nombre); // Salida: "Ana"
```

## Control de Flujo y Múltiples Returns

Es posible utilizar varias sentencias `return` en una misma función, generalmente dentro de condicionales (`if/else`). La función devolverá el valor del **primer** `return` que encuentre y se detendrá ahí.

```javascript
function verificarAcceso(esAdmin, tieneToken) {
  if (!tieneToken) {
    return "Error: No hay token"; // Sale aquí si no hay token
  }
  
  if (!esAdmin) {
    return "Error: No es administrador"; // Sale aquí si no es admin
  }

  return "Acceso concedido"; // Solo llega aquí si pasa las dos validaciones
}
```

Este patrón se conoce como **"retorno temprano"** (early return) y ayuda a evitar niveles excesivos de anidación y hace el código más legible.



---



## Que hace fetch en javascript?

**Fetch** es una API nativa de JavaScript introducida en 2015 que permite realizar **peticiones HTTP asíncronas** a servidores para obtener o enviar datos sin recargar la página. Reemplaza a la antigua `XMLHttpRequest` utilizando **Promesas** para manejar operaciones asíncronas de forma más limpia y legible.

Funciona enviando una solicitud a una URL y devolviendo un objeto `Response` que contiene metadatos HTTP (como el estado y los encabezados) y métodos para extraer el cuerpo de la respuesta. Es fundamental para la comunicación con APIs, permitiendo leer recursos como **JSON**, texto, imágenes o archivos estáticos.

### Características clave y uso:

*   **Sintaxis asíncrona:** Devuelve una promesa que se resuelve con el objeto `Response`. Se maneja mediante `.then()/.catch()` o la sintaxis `async/await`.
*   **Métodos de lectura:** El objeto `Response` incluye métodos como `.json()` para convertir la respuesta a un objeto JavaScript, `.text()` para obtener texto plano, o `.blob()` para archivos binarios.
*   **Configuración flexible:** Acepta un segundo parámetro opcional (`init`) para definir el **método HTTP** (`GET`, `POST`, `PUT`, `DELETE`), **encabezados** (`headers`) y el **cuerpo** (`body`) de la petición.
*   **Manejo de errores:** La promesa solo se rechaza en fallos de red o si la petición no se puede completar; **no** rechaza automáticamente errores HTTP como 404 o 500. Es necesario verificar manualmente la propiedad `response.ok` o el `status` para detectar estos casos.

Ejemplo básico de una petición GET:
```javascript
fetch('https://api.ejemplo.com/datos')
  .then(response => {
    if (!response.ok) throw new Error('Error HTTP: ' + response.status);
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```