document.addEventListener('DOMContentLoaded', function() {
  // Elementos del menú lateral
  const sideMenu = document.getElementById('side-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuIngredients = document.getElementById('menu-ingredients');
  const menuPrice = document.getElementById('menu-price');
  const menuTitle = document.getElementById('menu-title');

  // Configuración de imágenes
  const placeholderImage = 'placeholder.webp'; // Ruta de tu imagen de reserva
  const baseImagePath = '/images/ID'; // Ruta base de las imágenes

  // Determinar la URL base del API según el dominio actual
  const apiBaseUrl = window.location.hostname === 'acksok.github.io'
    ? 'https://acksok.github.io'
    : 'http://localhost:3000';

  // Cargar productos
  function loadProducts() {
    fetch(`${apiBaseUrl}/products`, {
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
    });
  }

  // Renderizar productos con gestión de imágenes
  function renderProducts(products) {
    const container = document.querySelector('.productos-container');
    if (!container) {
      console.error('Contenedor de productos no encontrado');
      return;
    }

    container.innerHTML = products.map(product => {
      const imagePath = `${baseImagePath}${product.id}.jpg`;

      return `
        <div class="producto"
             data-ingredients="${product.ingredients.join(', ')}"
             data-price="${product.price.toFixed(2)}"
             data-image="${imagePath}">
          <img src="${placeholderImage}"
               data-src="${imagePath}"
               alt="${product.name}"
               loading="lazy"
               class="lazy-image"
               onerror="handleImageError(this)">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
      `;
    }).join('');

    initLazyLoading();
  }

  // Manejo de errores de imágenes mejorado
  window.handleImageError = function(imgElement) {
    const container = imgElement.closest('.producto');
    const fallbackImage = container.dataset.image ? placeholderImage : 'error-image.webp';

    imgElement.onerror = null; // Prevenir bucles infinitos
    imgElement.src = fallbackImage;
    imgElement.style.opacity = '0.7';
    imgElement.title = 'Imagen no disponible';
  };

  // Lazy loading de imágenes optimizado
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.1
    });

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
