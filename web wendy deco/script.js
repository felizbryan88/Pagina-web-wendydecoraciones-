document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // VARIABLES Y SELECTORES
    // =================================================================
    const listaProductos = document.getElementById('lista-1');
    const contenedorCarrito = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');
    let articulosCarrito = [];

    // =================================================================
    // EVENT LISTENERS
    // =================================================================
    cargarEventListeners();
    function cargarEventListeners() {
        // Acciones sobre productos (solo si existe el contenedor de productos)
        if (listaProductos) {
            listaProductos.addEventListener('click', agregarProducto);
        }

        // Acciones del carrito
        contenedorCarrito.addEventListener('click', eliminarDelCarrito);
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
        finalizarCompraBtn.addEventListener('click', enviarPedidoPorWhatsApp);

        // Cargar carrito desde LocalStorage al iniciar
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        renderizarCarrito();
    }

    // =================================================================
    // FUNCIONES DEL CARRITO DE COMPRAS
    // =================================================================
    function agregarProducto(e) {
        e.preventDefault();
        if (e.target.classList.contains('agregar-carrito')) {
            const productoSeleccionado = e.target.closest('.product');
            leerDatosProducto(productoSeleccionado);
        }
    }

    function leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h3').textContent,
            precio: producto.querySelector('.precio').textContent,
            id: producto.querySelector('.agregar-carrito').getAttribute('data-id'),
            cantidad: 1
        };

        const existe = articulosCarrito.some(prod => prod.id === infoProducto.id);
        if (existe) {
            articulosCarrito = articulosCarrito.map(prod => {
                if (prod.id === infoProducto.id) {
                    prod.cantidad++;
                    return prod;
                } else {
                    return prod;
                }
            });
        } else {
            articulosCarrito = [...articulosCarrito, infoProducto];
        }
        renderizarCarrito();
    }
    
    function renderizarCarrito() {
        limpiarHTML(contenedorCarrito);

        articulosCarrito.forEach(producto => {
            const { imagen, titulo, precio, cantidad, id } = producto;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${imagen}" alt="${titulo}"></td>
                <td>
                    ${titulo}
                    <br>
                    <span>${precio}</span>
                </td>
                <td>${cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto" data-id="${id}">X</a>
                </td>
            `;
            contenedorCarrito.appendChild(row);
        });
        
        guardarCarritoEnLocalStorage();
    }
    
    function eliminarDelCarrito(e) {
        e.preventDefault();
        if (e.target.classList.contains('borrar-producto')) {
            const productoId = e.target.getAttribute('data-id');
            articulosCarrito = articulosCarrito.filter(producto => producto.id != productoId);
            renderizarCarrito();
        }
    }

    function vaciarCarrito() {
        articulosCarrito = [];
        limpiarHTML(contenedorCarrito);
        renderizarCarrito();
    }

    function enviarPedidoPorWhatsApp(e) {
        e.preventDefault();
        const telefono = '18295275768';

        if(articulosCarrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos para finalizar la compra.');
            return;
        }

        let mensaje = '¡Hola Wendy Decoraciones! 👋 Me gustaría hacer el siguiente pedido:\n\n';
        let total = 0;

        articulosCarrito.forEach(producto => {
            const precioNumero = parseFloat(producto.precio.replace('$', ''));
            const subtotal = precioNumero * producto.cantidad;
            mensaje += `*Producto:* ${producto.titulo}\n`;
            mensaje += `*Cantidad:* ${producto.cantidad}\n`;
            mensaje += `*Subtotal:* $${subtotal.toFixed(2)}\n\n`;
            total += subtotal;
        });

        mensaje += `*Total a pagar: $${total.toFixed(2)}*`;
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }

    // =================================================================
    // LÓGICA PARA LA GALERÍA (LIGHTBOX)
    // =================================================================
    const modal = document.getElementById("modal");
    if (modal) {
        const modalImg = document.getElementById("modal-image");
        const captionText = document.getElementById("modal-caption");
        const closeModalBtn = document.querySelector(".close-modal");

        const imagesToPreview = document.querySelectorAll('.preview-image');

        imagesToPreview.forEach(image => {
            image.addEventListener('click', function() {
                modal.classList.add('active');
                modalImg.src = this.src;
                captionText.innerHTML = this.dataset.title || this.alt;
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
        };

        closeModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // =================================================================
    // HELPERS
    // =================================================================
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
    }

    function limpiarHTML(contenedor) {
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }
    }
});

