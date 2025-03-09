document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM corregidos
  const sideMenu = document.getElementById('side-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const menuIngredients = document.getElementById('menu-ingredients');
  const menuPrice = document.getElementById('menu-price');
  const menuTitle = document.getElementById('menu-title');
  const menuDescription = document.getElementById('menu-description');
  const botonCotizar = document.getElementById('botonCotizar');

  // Configuración de Pixabay
  const PIXABAY_API = 'https://pixabay.com/api/';
  const API_KEY = '22416110-02d4f44097d21b949a8b99751';
  const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjYiPlRhYmxhIGRlIFF1ZXNvczwvdGV4dD48L3N2Zz4=';

  // Cargar productos
  function loadProducts() {
    fetch('https://acksok.github.io/products', {
      method: 'GET',
      mode: 'no-cors',
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

  // Renderizar productos con imágenes de Pixabay
  function renderProducts(products) {
    const container = document.querySelector('.productos-container');
    if (!container) {
      console.error('Contenedor de productos no encontrado');
      return;
    }
    console.log('Productos recibidos para renderizar:', products);

    container.innerHTML = products.map(product => {
      const searchQuery = generateSearchQuery(product.name);
      const imageUrl = `${PIXABAY_API}?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=3`;

      return `
        <div class="producto" 
             data-ingredients="${product.ingredients.join(', ')}" 
             data-price="${product.price.toFixed(2)}"
             data-description="${product.description}">
          <img src="${FALLBACK_IMAGE}"
               data-src="${imageUrl}"
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

  // Generar consulta de búsqueda inteligente
  function generateSearchQuery(productName) {
    return `cheese+board+${productName.toLowerCase()
      .replace(/[^\w\sáéíóú]/gi, '')
      .replace(/\b(tabla|clásica|especial|de|la|el|los|las|del)\b/gi, '')
      .trim()
      .replace(/\s+/g, '+')}`;
  }

  // Manejo de errores de imágenes
  window.handleImageError = function(imgElement) {
    imgElement.src = FALLBACK_IMAGE;
    imgElement.onerror = null;
  }

  // Lazy loading de imágenes
  function initLazyLoading() {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          fetch(img.dataset.src)
            .then(response => response.json())
            .then(data => {
              if (data.hits?.length > 0) {
                img.src = data.hits[0].webformatURL;
              }
              img.classList.add('loaded');
            })
            .catch(() => img.src = FALLBACK_IMAGE);
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    document.querySelectorAll('.lazy-image').forEach(img => observer.observe(img));
  }

  // Manejadores de eventos para productos
  function initProductHandlers() {
    document.querySelectorAll('.producto').forEach(producto => {
      producto.addEventListener('click', function() {
        const productData = {
          title: this.querySelector('h3').textContent,
          description: this.querySelector('p').textContent,
          ingredients: this.dataset.ingredients,
          price: this.dataset.price
        };
        updateSideMenu(productData);
      });
    });
  }

  // Actualizar contenido del menú lateral (corregido)
  function updateSideMenu({ title, description, ingredients, price }) {
    console.group('Actualizando menú lateral');
    
    try {
      const elements = {
        menuTitle,
        menuDescription,
        menuIngredients,
        menuPrice
      };

      // Validación detallada
      Object.entries(elements).forEach(([name, element]) => {
        if (!element) throw new Error(`Elemento ${name} no encontrado`);
      });

      console.log('Datos recibidos:', {title, description, ingredients, price});
      
      menuTitle.textContent = title;
      menuDescription.textContent = description;
      menuPrice.textContent = `$${parseFloat(price).toFixed(2)}`;
      
      menuIngredients.innerHTML = ingredients.split(', ')
        .map(ingredient => `
          <div class="ingredient-item">
            ${ingredient.trim()}
          </div>`
        ).join('');

      console.log('Contenido actualizado correctamente');
      toggleSideMenu(true);
    } catch (error) {
      console.error('Error al actualizar el menú:', error);
      showError('Error al cargar los detalles del producto');
    }
    
    console.groupEnd();
  }

  // Controlar visibilidad del menú lateral
  function toggleSideMenu(show = true) {
    const overlay = document.querySelector('.menu-overlay');
    if (show) {
      overlay.classList.add('active');
      sideMenu.classList.add('open');
    } else {
      overlay.classList.remove('active');
      sideMenu.classList.remove('open');
    }
  }

  // Cerrar menú al hacer clic fuera
  function handleOutsideClick(e) {
    if (sideMenu && !sideMenu.contains(e.target) && !e.target.closest('.producto')) {
      toggleSideMenu(false);
    }
  }

  // Mostrar mensajes de error
  function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.textContent = message;
    document.body.prepend(errorContainer);
    
    setTimeout(() => errorContainer.remove(), 5000);
  }

  // Event Listeners
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => toggleSideMenu(false));
  }
  
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleSideMenu(false);
  });

  // Configuración de WhatsApp
  if (botonCotizar) {
    botonCotizar.addEventListener('click', () => {
      const phone = '5528491408';
      const messageData = {
        product: menuTitle?.textContent || '',
        description: menuDescription?.textContent || '',
        ingredients: Array.from(menuIngredients?.children || [])
                       .map(item => item.textContent.trim()),
        price: menuPrice?.textContent || ''
      };

      const message = `
🚀 *Cotización Quesos Sagrados*

*Producto:* ${messageData.product}


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