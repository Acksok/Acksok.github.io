document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const sideMenu = document.getElementById('side-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuIngredients = document.getElementById('menu-ingredients');
  const menuPrice = document.getElementById('menu-price');
  const menuTitle = document.getElementById('menu-title');
  const container = document.getElementById('products-container');

  // Validación de elementos críticos
  if (!container) {
    console.error('Error: El contenedor de productos no existe en el DOM');
    return;
  }

  // Cargar productos
  function loadProducts() {
    fetch('https://acksok.github.io/products.json', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
      return response.json();
    })
    .then(products => {
      renderProducts(products);
      initProductHandlers();
    })
    .catch(error => {
      console.error('Error cargando productos:', error);
      showError('No pudimos cargar los productos. Intenta recargar la página.');

      // Datos de placeholder
      const placeholderProducts = [{
        name: 'Café Especial',
        description: 'Mezcla premium de granos arábicos',
        ingredients: ['Granos arábicos', 'Leche entera', 'Vainilla'],
        price: 4.99,
        image: 'coffee-placeholder.jpg'
      }];

      renderProducts(placeholderProducts);
    });
  }

  function renderProducts(products) {
    const placeholderSVG = 'data:image/svg+xml;base64,...';

    // Validación de datos
    if (!Array.isArray(products)) {
      console.error('Error: Los productos deben ser un array');
      return;
    }

    container.innerHTML = products.map(product => `
      <div class="producto"
           data-ingredients="${(product.ingredients || []).join(', ')}"
           data-price="${(product.price || 0).toFixed(2)}">
        <img src="${placeholderSVG}"
             data-src="/assets/images/${product.image || 'default.jpg'}"
             alt="${product.name || 'Producto'}"
             loading="lazy"
             class="lazy-image"
             onerror="window.handleImageError(this)">
        <h3>${product.name || 'Producto sin nombre'}</h3>
        <p>${product.description || 'Descripción no disponible'}</p>
      </div>
    `).join('');

    initLazyLoading();
  }

  // Manejo de errores de imágenes
  window.handleImageError = function(imgElement) {
    const errorSVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pjwvc3ZnPg==';
    imgElement.onerror = null;
    imgElement.src = errorSVG;
    imgElement.style.opacity = '1';
    imgElement.style.backgroundColor = 'transparent';
  }

  // Lazy loading de imágenes
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px 0px' });

    lazyImages.forEach(img => observer.observe(img));
  }

  // Manejadores de eventos para productos
  function initProductHandlers() {
    document.querySelectorAll('.producto').forEach(producto => {
      producto.addEventListener('click', function() {
        const productData = {
          title: this.querySelector('h3').textContent,
          ingredients: this.dataset.ingredients,
          price: this.dataset.price
        };
        updateSideMenu(productData);
        toggleSideMenu(true);
      });
    });
  }

  // Actualizar contenido del menú lateral
  function updateSideMenu({ title, ingredients, price }) {
    menuTitle.textContent = title;
    menuIngredients.innerHTML = `<strong>Ingredientes:</strong> ${ingredients}`;
    menuPrice.innerHTML = `<strong>Precio:</strong> $${price}`;
  }

  // Controlar visibilidad del menú lateral
  function toggleSideMenu(show = true) {
    sideMenu.classList.toggle('open', show);
  }

  // Cerrar menú al hacer clic fuera
  function handleOutsideClick(e) {
    if (!sideMenu.contains(e.target) && !e.target.closest('.producto')) {
      toggleSideMenu(false);
    }
  }

  // Mostrar mensajes de error
  function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    document.body.prepend(errorContainer);
    
    setTimeout(() => {
      errorContainer.remove();
    }, 5000);
  }

  // Event Listeners
  closeMenuBtn.addEventListener('click', () => toggleSideMenu(false));
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSideMenu(false);
  });

  // Iniciar carga de productos
  loadProducts();
});