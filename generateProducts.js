const fs = require('fs');
const path = require('path');

// Datos de ejemplo
const cheeseTypes = [
  "Cheddar", "Gouda", "Brie", "Camembert", "Mozzarella", 
  "Parmesano", "Azul", "Feta", "Provolone", "Roquefort"
];

const ingredients = [
  "Leche de vaca", "Leche de cabra", "Cuajo", "Sal marina",
  "Hierbas provenzales", "Trufa", "Nueces", "Miel",
  "Pimienta negra", "Ajo", "Romero", "Tomillo", "Chile"
];

const descriptions = [
  "Exquisito sabor que perdura", "Ideal para acompañar con vino",
  "Elaborado con técnicas tradicionales", "Perfecto para tablas gourmet",
  "Con un toque especial de la región", "Madurado por expertos",
  "Selección premium", "Con ingredientes 100% naturales"
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProducts(count) {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const product = {
      id: i,
      name: `Tabla ${getRandomItem(cheeseTypes)} ${getRandomItem(["Clásica", "Especial", "Gourmet", "Premium"])}`,
      description: `${getRandomItem(descriptions)}. ${getRandomItem(descriptions)}.`,
      image: `tabla${Math.floor(Math.random() * 5) + 1}.jpg`,
      ingredients: Array.from({length: Math.floor(Math.random() * 5) + 3}, () => getRandomItem(ingredients)),
      price: parseFloat((Math.random() * (50 - 15) + 15).toFixed(2))
    };
    products.push(product);
  }

  return products;
}

// Generar 1000 productos
const products = generateProducts(1000);

// Guardar en archivo
fs.writeFileSync(
  path.join(__dirname, 'public', 'products.json'),
  JSON.stringify(products, null, 2)
);

console.log(`Generados ${products.length} productos en products.json`);