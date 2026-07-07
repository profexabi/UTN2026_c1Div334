# 1 / En ES Modules (ESM) tenes varias formas de exportar

### 1. Exportaciones nombradas

```js
export const nombre = "Juan";

export function saludar() {
  console.log("Hola");
}

export class Usuario {}
```

Importación:

```js
import { nombre, saludar, Usuario } from "./modulo.js";
```

---

### 2. Exportar al declarar

```js
export const PI = 3.1416;
export function sumar(a, b) {
  return a + b;
}
```

---

### 3. Exportar después de declarar

```js
const PI = 3.1416;

function sumar(a, b) {
  return a + b;
}

export { PI, sumar };
```

También puedes renombrar:

```js
export { PI as constantePI, sumar as add };
```

---

### 4. Exportación por defecto

```js
export default function App() {
  return "Hola";
}
```

o

```js
const App = () => "Hola";

export default App;
```

Importación:

```js
import App from "./modulo.js";
```

---

### 5. Mezclar `default` y nombradas

```js
export const version = "1.0";

export default function App() {}
```

Importación:

```js
import App, { version } from "./modulo.js";
```

---

### 6. Re-exportar desde otro módulo

```js
export { sumar } from "./math.js";
```

o varias:

```js
export { sumar, restar } from "./math.js";
```

---

### 7. Re-exportar todo

```js
export * from "./math.js";
```

Esto vuelve a exportar todas las exportaciones nombradas de `math.js`.

---

### 8. Re-exportar todo bajo un namespace

```js
export * as math from "./math.js";
```

Importación:

```js
import { math } from "./modulo.js";

math.sumar(1, 2);
```

---

### Sobre tu ejemplo

Si haces:

```js
export default { modulo };
```

Estás exportando **un objeto anónimo como exportación por defecto**:

```js
// modulo.js
const modulo = {
  saludar() {}
};

export default { modulo };
```

Y se importa así:

```js
import algo from "./modulo.js";

algo.modulo.saludar();
```

Muchas veces es más simple exportar directamente:

```js
export default modulo;
```

o usar exportaciones nombradas:

```js
export { modulo };
```

que se importaría como:

```js
import { modulo } from "./modulo.js";
```

Esta última suele ser la opción preferida cuando un archivo expone varias funciones o constantes.




---




# 2 / Que hace la keyword `default` en la exportacion

`default` marca **la exportación principal** de un módulo.

Sin `default`, las exportaciones tienen nombre y debes importarlas usando exactamente ese nombre:

```js
// math.js
export function sumar(a, b) {
  return a + b;
}
```

```js
import { sumar } from "./math.js";
```

---

Con `default`, puedes importar el valor con cualquier nombre:

```js
// math.js
export default function sumar(a, b) {
  return a + b;
}
```

```js
import miFuncion from "./math.js";

miFuncion(1, 2);
```

Fíjate que el nombre `sumar` no importa al hacer el `import`; podrías escribir:

```js
import pepe from "./math.js";
```

y seguiría funcionando.

---

### Diferencia visual

**Named export:**

```js
export const PI = 3.14;
```

```js
import { PI } from "./math.js";
```

**Default export:**

```js
export default 3.14;
```

```js
import PI from "./math.js";
```

---

### Regla importante

Solo puede haber **un `export default` por archivo**:

```js
// ✅ válido
export default function App() {}
```

```js
// ❌ error
export default function App() {}
export default function Otra() {}
```

En cambio, puedes tener muchas exportaciones nombradas:

```js
export const PI = 3.14;
export const E = 2.71;
export function sumar() {}
```

---

Un ejemplo típico en React:

```js
// Button.jsx
export default function Button() {
  return <button>Click</button>;
}
```

Luego:

```js
import Button from "./Button.jsx";
```

La idea es que el archivo tiene una cosa principal (`Button`), por eso se exporta como `default`. Cuando el archivo expone varias utilidades relacionadas, suele preferirse usar exportaciones nombradas.
