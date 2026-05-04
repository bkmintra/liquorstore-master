const path = require('path');
const fs = require('fs').promises;

const productsFile = path.join(__dirname, '../data/products.json');

exports.fetchProducts = async () => {
  const fileContents = await fs.readFile(productsFile, 'utf8');
  const products = JSON.parse(fileContents);
  return products;
};
