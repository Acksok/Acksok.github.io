// Función global para manejo de errores de imágenes
window.handleImageError = function(imgElement) {
    const errorSVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlbiBubyBlbmNvbnRyYWRhPC90ZXh0Pjwvc3ZnPg==';
    imgElement.onerror = null;
    imgElement.src = errorSVG;
    imgElement.style.opacity = '1';
    imgElement.style.backgroundColor = 'transparent';
  };
  
  // Objeto para almacenar las selecciones
  const selections = {
    "Tamaño": { main: "", sub: [] },
    "Quesos": { main: "", sub: [] },
    "Frutas": { main: "", sub: [] },
    "Carnes": { main: "", sub: [] }
  };
  
  // Función para cargar imágenes con transición
  function loadImageWithPlaceholder(target, newSrc) {
    const tempImage = new Image();
    const placeholder = target.dataset.placeholder || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmNWY1ZjUiPjwvc3ZnPg==';
    
    target.style.opacity = '0.5';
    target.src = placeholder;
    
    tempImage.onload = () => {
      target.src = newSrc;
      target.style.opacity = '1';
    };
    
    tempImage.onerror = () => {
      handleImageError(target);
      target.style.opacity = '1';
    };
    
    tempImage.src = newSrc;
  }
  
  // Función para actualizar el resumen
  function updateSummary() {
    const summaryElements = [];
    
    Object.entries(selections).forEach(([category, data]) => {
      if (data.main) {
        let categoryText = data.main.split(':')[0].trim();
        if (data.sub.length > 0) {
          categoryText += `: ${data.sub.join(', ')}`;
        }
        summaryElements.push(categoryText);
      }
    });
  
    const summaryBox = document.getElementById('summary-box');
    summaryBox.textContent = summaryElements.join('. ') || 'Selecciona opciones para ver la descripción aquí.';
  }
  
  // Función para generar sub-opciones
  function generateSubOptions(category, options) {
    const container = document.querySelector(`.sub-options[data-category="${category}"]`);
    container.innerHTML = '';
    
    if (options?.length > 0) {
      options.forEach(option => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option;
        checkbox.checked = selections[category].sub.includes(option);
        
        checkbox.addEventListener('change', () => {
          selections[category].sub = checkbox.checked 
            ? [...selections[category].sub, option]
            : selections[category].sub.filter(item => item !== option);
          
          updateSummary();
        });
        
        label.append(checkbox, document.createTextNode(option));
        container.appendChild(label);
      });
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  }
  
  // Inicialización al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    // Ocultar sub-opciones inicialmente
    document.querySelectorAll('.sub-options').forEach(container => {
      container.style.display = 'none';
    });
  
    // Configurar imagen principal
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
      mainImage.dataset.placeholder = mainImage.src;
      if (mainImage.complete) mainImage.style.opacity = '1';
    }
  
    // Eventos para botones de opción
    document.querySelectorAll('.option-btn').forEach(button => {
      button.addEventListener('click', function() {
        const section = this.closest('.option-section');
        const category = section.querySelector('h3').textContent.trim();
        const isSizeCategory = category === 'Tamaño';
        
        // Actualizar clase activa
        section.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Actualizar imagen principal
        if (this.dataset.image) {
          loadImageWithPlaceholder(mainImage, this.dataset.image);
        }
        
        // Manejar selecciones
        selections[category].main = this.dataset.description;
        
        if (!isSizeCategory) {
          // Ocultar otras sub-opciones
          document.querySelectorAll('.sub-options').forEach(container => {
            if (container.dataset.category !== category) {
              container.style.display = 'none';
            }
          });
          
          // Generar nuevas sub-opciones
          if (this.dataset.suboptions) {
            const options = this.dataset.suboptions.split(',').map(opt => opt.trim());
            generateSubOptions(category, options);
          }
        } else {
          // Reiniciar sub-opciones al cambiar tamaño
          document.querySelectorAll('.sub-options').forEach(container => {
            container.style.display = 'none';
          });
        }
        
        updateSummary();
      });
    });
  
    // Evento WhatsApp
    document.getElementById('btn-cotizar').addEventListener('click', () => {
      const phone = '5219982255404';
      const message = encodeURIComponent(
        `🚀 Cotización Quesos Sagrados:\n${document.getElementById('summary-box').textContent}`
      );
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
  });