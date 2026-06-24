```js

/* Gracias al CDN
    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js"></script>
*/
    
// Extraemos la clase jspdf que se anexa al objeto global window
const { jsPDF } = window.jspdf;

// Creamos una nueva instancia de jsPDF
const doc = new jsPDF();

// Vamos a trabajar con dos ejes: x (horizontal) e y (vertical)
let y = 10;

// Definimos el tama;o de la fuente para el primer texto
doc.setFontSize(18);

// Escribimos el texto "Llama-ticket de compra" en las posiciones x=10 y 10 del pdf
doc.text("Llama-ticket de compra:", 10, y);

// Aumentamos 10px el espacio despues del titulo
y += 10;

// Reducimos el tamaño dela fuente para los productos
doc.setFontSize(12);

carrito.forEach(producto => {
    idProductos.push(producto.id); // Llenando el array de ids de producto

    doc.text(`${producto.name} / ${producto.price}`, 20, y);

    // La posicion verftical se incrementa en 7 puntos en cada linea para evitar solapamiento
    y += 7;
});

// Calculamos el precio total usando reduce
const precioTotal = carrito.reduce((total, producto) => total + parseInt(producto.price) ,0);

// Añadimos otro espacio vertical de 5 para separar los productos del total
y +=5;

// Escribimos el total del ticket en el pdf, debajo del listado de productos
doc.text(`Total $${precioTotal}`, 10, y);

// Imprimimos el ticket
doc.save("ticket.pdf"); // Sugerencia: Usen fechas para poner de nombre

```