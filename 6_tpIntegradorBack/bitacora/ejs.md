**EJS (Embedded JavaScript)** es un motor de plantillas para aplicaciones web en **Node.js** que permite incrustar código JavaScript dentro de archivos HTML para generar páginas dinámicas.

Se usa frecuentemente junto con frameworks como Express.js.

### ¿Cómo funciona?

En lugar de escribir HTML completamente estático, puedes insertar variables, bucles y condiciones usando una sintaxis especial.

Ejemplo:

```ejs
<!DOCTYPE html>
<html>
<head>
  <title><%= titulo %></title>
</head>
<body>
  <h1>Hola, <%= nombre %></h1>
</body>
</html>
```

Si el servidor envía:

```javascript
res.render('index', {
  titulo: 'Mi sitio',
  nombre: 'Juan'
});
```

El navegador recibirá:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi sitio</title>
</head>
<body>
  <h1>Hola, Juan</h1>
</body>
</html>
```

---

### Sintaxis principal de EJS

| Sintaxis            | Función                                  |
| ------------------- | ---------------------------------------- |
| `<%= valor %>`      | Imprime el valor escapando HTML          |
| `<%- valor %>`      | Imprime HTML sin escapar                 |
| `<% codigo %>`      | Ejecuta JavaScript sin mostrar resultado |
| `<%# comentario %>` | Comentario de EJS                        |

Ejemplo con un bucle:

```ejs
<ul>
  <% usuarios.forEach(usuario => { %>
    <li><%= usuario.nombre %></li>
  <% }) %>
</ul>
```

---

### Uso con Express

Instalación:

```bash
npm install ejs
```

Configuración:

```javascript
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    nombre: 'María'
  });
});

app.listen(3000);
```

---

### Ventajas

* Fácil de aprender si ya conoces JavaScript.
* Permite reutilizar componentes mediante `include`.
* Integración sencilla con Express.
* No requiere aprender una sintaxis completamente nueva.

Ejemplo de inclusión:

```ejs
<%- include('header') %>
```

---

### Desventajas

* La lógica puede mezclarse con la presentación si no se organiza bien.
* Para aplicaciones frontend modernas suele ser menos popular que tecnologías como React, Vue.js o Angular.
* El renderizado ocurre principalmente en el servidor.

### ¿Cuándo usar EJS?

EJS es una buena opción cuando desarrollas una aplicación en Node.js y necesitas generar páginas HTML dinámicas desde el servidor sin la complejidad de un framework frontend moderno. Es especialmente común en proyectos pequeños y medianos construidos con Express.
