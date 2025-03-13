document.addEventListener('DOMContentLoaded', function() {
  const sideMenu = document.getElementById('side-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuIngredients = document.getElementById('menu-ingredients');
  const menuPrice = document.getElementById('menu-price');
  const menuTitle = document.getElementById('menu-title');
  const menuFullDescription = document.getElementById('menu-full-description'); // Nuevo campo para la descripción completa
  const botonCotizar = document.getElementById('botonCotizar');

  const placeholderImage = 'placeholder.webp'; // Imagen de reserva
  const baseImagePath = '/images/ID'; // Ruta base de imágenes

  function loadProducts() {
    fetch(`products.json`, {
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
                 data-title="${product.name}"
                 data-description="${product.description}"
                 data-ingredients='${JSON.stringify(product.ingredients)}'
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



  window.handleImageError = function(imgElement) {
    const container = imgElement.closest('.producto');
    const fallbackImage = container.dataset.image ? placeholderImage : 'error-image.webp';

    imgElement.onerror = null;
    imgElement.src = fallbackImage;
    imgElement.style.opacity = '0.7';
    imgElement.title = 'Imagen no disponible';
  };

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

  function initProductHandlers() {
    document.querySelectorAll('.producto').forEach(producto => {
      producto.addEventListener('click', function() {
        const productData = {
          title: this.dataset.title,
          description: this.dataset.description, // Agregamos la descripción completa
          ingredients: this.dataset.ingredients,
          price: this.dataset.price
        };
        updateSideMenu(productData);
        toggleSideMenu(true);
      });
    });
  }

  function updateSideMenu({ title, description, ingredients, price }) {
      menuTitle.textContent = title;
      menuFullDescription.innerHTML = `<strong>Descripción:</strong> ${description}`;

      // Formatear ingredientes por categorías
      let ingredientsHTML = "";
      const ingredientsObj = JSON.parse(ingredients); // Convertir texto a objeto

      for (let category in ingredientsObj) {
          ingredientsHTML += `<strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong><br>`;
          ingredientsHTML += `${ingredientsObj[category].map(item => `• ${item}`).join('<br>')}<br><br>`;
      }

      menuIngredients.innerHTML = ingredientsHTML;
      menuPrice.innerHTML = `<strong>Precio:</strong> $${price}`;
  }



  function toggleSideMenu(show = true) {
    sideMenu.classList.toggle('open', show);
  }

  function handleOutsideClick(e) {
    if (!sideMenu.contains(e.target) && !e.target.closest('.producto')) {
      toggleSideMenu(false);
    }
  }

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
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => toggleSideMenu(false));
  }

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSideMenu(false);
  });

  if (botonCotizar) {
    botonCotizar.addEventListener('click', () => {
      const phone = '5528491408';
      const messageData = {
        product: menuTitle?.textContent || '',
        description: menuFullDescription?.textContent || '', // Agregamos la descripción
        ingredients: Array.from(menuIngredients?.children || [])
                        .map(item => item.textContent.trim()),
        price: menuPrice?.textContent || ''
      };

      const message = `
 🚀 *Cotización Quesos Sagrados*

 *Producto:* ${messageData.product}

 *Descripción:* ${messageData.description}

 *Ingredientes:*
 ${messageData.ingredients.map(i => `• ${i}`).join('\n')}

 *Precio:* ${messageData.price}

 ¡Hola! Estoy interesado en esta tabla, ¿podrían ayudarme con mi pedido?
      `.trim();

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    });
  }

  // Iniciar carga de productos
  loadProducts();
});
