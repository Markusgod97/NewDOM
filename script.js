// Variables globales
let productos   = [];
let contadorId  = 1;
let modoEdicion = false;   // ← NUEVO
let idEditando  = null;    // ← NUEVO

//Referencias a elementos del DOM

const inputImagen      = document.getElementById("input-imagen");
const inputTitulo      = document.getElementById("input-titulo");
const inputDescripcion = document.getElementById("input-descripcion");
const inputValor       = document.getElementById("input-precio");
const inputCupon       = document.getElementById("input-cupon");
const btnGuardar       = document.getElementById("btn-guardar");
const listaProductos   = document.getElementById("lista-productos");
const tituloFormulario = document.getElementById("titulo-formulario");

// Agregar o guardar producto al hacer click en el botón
btnGuardar.addEventListener("click", function() {

  const imagen      = inputImagen.value.trim();
  const titulo      = inputTitulo.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const valor       = parseFloat(inputValor.value);
  const cupon       = inputCupon.value.trim().toUpperCase();

  if (!titulo || !descripcion || isNaN(valor)) {
    alert(" Por favor completa Título, Descripción y Valor");
    return;
  }

  // Calcular descuento
 let descuentos = {
  "DESC10": 0.1, // 10% de descuento
  "DESC20": 0.2, // 20% de descuento
  "MITAD":  0.5  // 50% de descuento
};

let descuento = descuentos[cupon] ? valor * descuentos[cupon] : 0;
let precioFinal = valor - descuento;

  // --- ¿Estamos editando o agregando? ---
  if (modoEdicion) {
    // MODO EDICIÓN: actualizar el producto existente
    const posicion = productos.findIndex(function(p) {
      return p.id === idEditando;
    });

    productos[posicion] = {
      id:          idEditando,
      imagen:      imagen || "https://via.placeholder.com/300x180?text=Sin+Imagen",
      titulo:      titulo,
      descripcion: descripcion,
      valor:       valor,
      precioFinal: precioFinal,
      cupon:       cupon,
      descuento:   descuento
    };

    // Volver al modo normal
    modoEdicion = false;
    idEditando  = null;
    tituloFormulario.textContent = "Agregar Producto";
    btnGuardar.textContent       = " Guardar Producto";

  } else {
    // agregar producto nuevo
    const nuevoProducto = {
      id:          contadorId,
      imagen:      imagen || "https://via.placeholder.com/300x180?text=Sin+Imagen",
      titulo:      titulo,
      descripcion: descripcion,
      valor:       valor,
      precioFinal: precioFinal,
      cupon:       cupon,
      descuento:   descuento
    };

    productos.push(nuevoProducto);
    contadorId++;
  }

  mostrarProductos();
  limpiarFormulario();
});

//Mostrar todos los productos en el DOM
function mostrarProductos() {

  listaProductos.innerHTML = "";

  if (productos.length === 0) {
    listaProductos.innerHTML = "<p style='text-align:center; color:#aaa;'>No hay productos aún. ¡Agrega el primero! 🛍️</p>";
    return;
  }

  productos.forEach(function(producto) {
    const tarjeta = crearTarjeta(producto);
    listaProductos.appendChild(tarjeta);
  });
}

//Crear una Tarjeta HTML para un producto dado
function crearTarjeta(producto) {

  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta");

  tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.titulo}"
         onerror="this.src='https://via.placeholder.com/300x180?text=Imagen+no+encontrada'">

    <div class="tarjeta-info">
      <h3>${producto.titulo}</h3>
      <p>${producto.descripcion}</p>

      ${producto.descuento > 0 ? `
        <p class="precio-tachado">$ ${producto.valor.toLocaleString()}</p>
        <p class="tarjeta-precio">$ ${producto.precioFinal.toLocaleString()}</p>
        <span class="cupon-aplicado"> Cupón: ${producto.cupon} (-${Math.round(producto.descuento / producto.valor * 100)}%)</span>
      ` : `
        <p class="tarjeta-precio">$ ${producto.valor.toLocaleString()}</p>
      `}
    </div>

    <div class="tarjeta-botones">
      <button class="btn-editar"   onclick="editarProducto(${producto.id})">✏️ Editar</button>
      <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">🗑️ Eliminar</button>
    </div>
  `;

  return tarjeta;
}

// Cargar los datos de un producto en el formulario para editarlo
function editarProducto(id) {

  //Encontrar el producto en el array
  const producto = productos.find(function(p) {
    return p.id === id;
  });

  //Cargar sus datos en el formulario
  inputImagen.value      = producto.imagen;
  inputTitulo.value      = producto.titulo;
  inputDescripcion.value = producto.descripcion;
  inputValor.value       = producto.valor;
  inputCupon.value       = producto.cupon;

  //Activar el modo edición
  modoEdicion              = true;
  idEditando               = id;
  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent       = "Guardar Cambios";

  //Hacer scroll hacia arriba para ver el formulario
  window.scrollTo({ top: 0, behavior: "smooth" });
}

//Eliminar un producto por su ID
function eliminarProducto(id) {

  const confirmar = confirm("¿Seguro que deseas eliminar este producto?");

  if (confirmar) {
    productos = productos.filter(function(p) {
      return p.id !== id;
    });
    mostrarProductos();
  }
}

//Limpiar los campos del formulario
function limpiarFormulario() {
  inputImagen.value      = "";
  inputTitulo.value      = "";
  inputDescripcion.value = "";
  inputValor.value       = "";
  inputCupon.value       = "";
}
// Mostrar productos al cargar la página
mostrarProductos();