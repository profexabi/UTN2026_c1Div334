## Que pasa cuando hasheamos una misma contraseña?

La clave está en entender **qué hace la sal (salt)** y **cómo funciona `bcrypt.compare()`**. Hay un pequeño detalle en tu pregunta: **si vuelves a usar `bcrypt.hash()` normalmente NO deberían coincidir**. Lo que suele coincidir es el resultado de `bcrypt.compare()`.

Veámoslo paso a paso.

## 1. ¿Por qué se generan dos hashes distintos?

Supongamos que la contraseña es:

```text
miPassword123
```

Si haces:

```javascript
const bcrypt = require("bcrypt");

const hash1 = await bcrypt.hash("miPassword123", 10);
const hash2 = await bcrypt.hash("miPassword123", 10);

console.log(hash1);
console.log(hash2);
```

Obtendrás algo parecido a:

```text
$2b$10$4qV7Qh1fS9lX8...
$2b$10$Lp3KcM9Yd2WgF...
```

Son diferentes aunque la contraseña sea la misma.

### ¿Por qué?

Porque **cada vez que llamas a `bcrypt.hash()` se genera una sal aleatoria nueva**.

Internamente ocurre algo como esto:

```
Contraseña
     +
Sal aleatoria
     +
10 rondas
     ↓
Hash
```

Por ejemplo:

```
Contraseña: hola123

Sal 1:
xA72Kd...

→ Hash A
```

Luego:

```
Contraseña: hola123

Sal 2:
Pq81Lm...

→ Hash B
```

Como la sal cambia, el hash también cambia.

---

## 2. Entonces, ¿cómo sabe bcrypt que la contraseña es correcta?

Cuando guardas un hash de bcrypt, **la sal ya viene incluida dentro del propio hash**.

Por ejemplo:

```
$2b$10$Lp3KcM9Yd2WgF4gS8m0m.e2x4Y...
```

Ese texto contiene:

* algoritmo (`2b`)
* costo (`10`)
* sal
* hash

Es decir, no tienes que guardar la sal por separado.

---

## 3. ¿Qué hace `bcrypt.compare()`?

Cuando haces:

```javascript
await bcrypt.compare("miPassword123", hashGuardado);
```

bcrypt:

1. Lee la sal que está dentro del hash guardado.
2. Usa esa misma sal.
3. Aplica las mismas 10 rondas.
4. Genera un nuevo hash.
5. Compara ambos.

Visualmente:

```
Hash guardado

↓ extrae la sal

Sal = ABC123

↓

Contraseña ingresada
+
ABC123
+
10 rondas

↓

Nuevo hash

↓

¿Es igual al guardado?

Sí → contraseña correcta.
```

Por eso funciona aunque originalmente la sal fuera aleatoria.

---

## 4. ¿Qué pasa si vuelvo a usar `bcrypt.hash()`?

Si haces:

```javascript
const hashGuardado = await bcrypt.hash(password, 10);

const nuevoHash = await bcrypt.hash(password, 10);

console.log(hashGuardado === nuevoHash);
```

El resultado será:

```text
false
```

Porque la segunda llamada genera otra sal distinta.

---

## 5. ¿Cómo puedo obtener el mismo hash otra vez?

Tendrías que usar **exactamente la misma sal**.

Por ejemplo:

```javascript
const salt = await bcrypt.genSalt(10);

const hash1 = await bcrypt.hash(password, salt);
const hash2 = await bcrypt.hash(password, salt);

console.log(hash1 === hash2);
```

Resultado:

```text
true
```

Esto ocurre porque:

* contraseña = la misma
* sal = la misma
* rondas = las mismas

Entonces el algoritmo produce exactamente el mismo hash.

---

## Resumen

* `bcrypt.hash(contraseña, 10)` **genera una sal aleatoria nueva** en cada llamada, por lo que produce hashes distintos para la misma contraseña.
* El hash generado **incluye la sal y el costo**.
* `bcrypt.compare()` extrae esa sal del hash almacenado, vuelve a calcular el hash con la contraseña ingresada y compara ambos resultados.
* Si vuelves a llamar a `bcrypt.hash()` con solo el número de rondas (`10`), **no obtendrás el mismo hash**. Si observas que "coinciden", probablemente estás usando `bcrypt.compare()` o reutilizando la misma sal de forma explícita.
