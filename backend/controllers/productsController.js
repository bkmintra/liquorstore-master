const productsService = require('../services/productsService');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productsService.fetchProducts();
    res.json({ products });
  } catch (error) {
    console.error('ProductsController.getAllProducts error:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
};
