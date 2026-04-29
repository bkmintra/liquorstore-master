# Search Box Implementation Guide

## Overview
The Search Box component is a modern, responsive search functionality for the Liquor Store website that allows customers to quickly find products by name or category.

## Features
- **Real-time Search**: Results appear as users type
- **Dropdown Results**: Shows up to 8 matching products with images, names, categories, and prices
- **Product Filtering**: Searches through product names and categories
- **Responsive Design**: Automatically adapts to mobile devices
- **Click-Outside Detection**: Results close when user clicks elsewhere
- **Form Submission**: Users can submit search and redirect to products page

## Files Created/Modified

### 1. **search-box.html** (Reference Component)
- Contains standalone search box HTML, CSS, and JavaScript
- Can be used as a reference for implementation

### 2. **product.html** (Updated with Search Box)
- ✅ Search box integrated in navbar
- ✅ Full styling included
- ✅ JavaScript functionality implemented

## How to Integrate Search Box in Other Pages

### Quick Integration Steps:

1. **Add HTML to Navbar** (in your navbar section):
```html
<!-- Search Box Component -->
<div class="search-box-wrapper">
    <form class="search-box-form" id="searchForm">
        <div class="input-group">
            <input 
                type="text" 
                class="form-control search-box-input" 
                id="searchInput" 
                placeholder="Search products..."
                autocomplete="off"
            >
            <div class="input-group-append">
                <button class="btn btn-outline-secondary search-btn" type="submit">
                    <span class="fa fa-search"></span>
                </button>
            </div>
        </div>
        <div class="search-results-dropdown" id="searchResults" style="display: none;">
            <div class="search-results-list" id="resultsList"></div>
        </div>
    </form>
</div>
```

**Placement**: Insert between `<a class="navbar-brand">` and `<div class="order-lg-last btn-group">`

2. **Add CSS Styling** (before closing `</head>` tag or in your style.css):
```css
.search-box-wrapper {
    flex: 1;
    margin: 0 20px;
    position: relative;
}

.search-box-form {
    width: 100%;
}

.search-box-input {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 15px;
    font-size: 14px;
    color: #333;
    transition: all 0.3s ease;
    width: 100%;
}

.search-box-input:focus {
    background-color: #fff;
    border-color: #f96d00;
    box-shadow: 0 0 5px rgba(249, 109, 0, 0.3);
    outline: none;
}

.search-btn {
    background-color: transparent;
    border: none;
    color: #f96d00;
    padding: 0 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-btn:hover {
    color: #ff8c1f;
}

.search-btn:focus {
    box-shadow: none;
}

.search-results-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 5px 5px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-results-list {
    padding: 0;
    margin: 0;
    list-style: none;
}

.search-result-item {
    padding: 12px 15px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.search-result-item:hover {
    background-color: #f5f5f5;
}

.search-result-item:last-child {
    border-bottom: none;
}

.search-result-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    width: 100%;
}

.search-result-img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
    border-radius: 3px;
    background-size: cover;
    background-position: center;
}

.search-result-info h4 {
    margin: 0 0 5px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.search-result-price {
    color: #f96d00;
    font-weight: 600;
    font-size: 13px;
}

.search-result-category {
    color: #999;
    font-size: 12px;
}

.search-no-results {
    padding: 20px;
    text-align: center;
    color: #999;
}

/* Responsive */
@media (max-width: 768px) {
    .search-box-wrapper {
        margin: 10px 0;
    }
    
    .search-box-input {
        font-size: 13px;
        padding: 6px 10px;
    }
}

@media (max-width: 576px) {
    .search-box-wrapper {
        display: none;
    }
}
```

3. **Add JavaScript** (before closing `</body>` tag):
```javascript
// Search Box Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const searchResults = document.getElementById('searchResults');
    const resultsList = document.getElementById('resultsList');

    let allProducts = [];

    // Load products from JSON
    async function loadProducts() {
        try {
            const response = await fetch('./data/products.json');
            if (!response.ok) throw new Error('Failed to load products');
            allProducts = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Initialize on page load
    loadProducts();

    // Search functionality on input
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (query.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        // Filter products
        const filteredProducts = allProducts.filter(product => {
            return (
                product.name.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        });

        displayResults(filteredProducts, query);
    });

    // Display results
    function displayResults(products, query) {
        resultsList.innerHTML = '';

        if (products.length === 0) {
            resultsList.innerHTML = '<div class="search-no-results">No products found</div>';
            searchResults.style.display = 'block';
            return;
        }

        products.slice(0, 8).forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            const priceHtml = product.original_price 
                ? `<span class="search-result-price">$${product.price.toFixed(2)}</span>`
                : `<span class="search-result-price">$${product.price.toFixed(2)}</span>`;

            resultItem.innerHTML = `
                <a href="product-single.html?id=${product.id}" class="search-result-link">
                    <div class="search-result-img" style="background-image: url(${product.image_url});"></div>
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <div class="search-result-category">${product.category}</div>
                        <div>${priceHtml}</div>
                    </div>
                </a>
            `;

            resultsList.appendChild(resultItem);
        });

        searchResults.style.display = 'block';
    }

    // Close results on outside click
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-box-wrapper')) {
            searchResults.style.display = 'none';
        }
    });

    // Form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `product.html?search=${encodeURIComponent(query)}`;
        }
    });
});
```

## Pages to Update

Add the search box to these pages for full site coverage:

- [ ] `index.html` - Home page
- [ ] `about.html` - About page
- [ ] `blog.html` - Blog page
- [ ] `blog-single.html` - Single blog post
- [ ] `product-single.html` - Single product page
- [ ] `contact.html` - Contact page
- [ ] `cart.html` - Shopping cart page
- [ ] `checkout.html` - Checkout page
- [x] `product.html` - Products page (✅ Already updated)

## Data Requirements

The search box requires `./data/products.json` with the following structure:

```json
[
  {
    "id": 1,
    "name": "Bacardi 151",
    "category": "Brandy",
    "price": 49.00,
    "original_price": 69.00,
    "image_url": "images/prod-1.jpg",
    "badge": "Sale"
  },
  {
    "id": 2,
    "name": "Jim Beam Kentucky Straight",
    "category": "Gin",
    "price": 69.00,
    "image_url": "images/prod-2.jpg",
    "badge": "Best Seller"
  }
]
```

## Customization Options

### Change Search Colors
- Update `#f96d00` (orange) with your brand color
- Update `#f5f5f5` (light gray) for backgrounds

### Change Result Count
- In JavaScript, find: `products.slice(0, 8)` 
- Change `8` to desired number of results

### Change Placeholder Text
- In HTML: `placeholder="Search products..."` 
- Modify text to your preference

### Adjust Responsive Breakpoints
- Mobile hide: `@media (max-width: 576px)`
- Tablet adjustments: `@media (max-width: 768px)`

## Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Search results not appearing
- Verify `./data/products.json` exists and is properly formatted
- Check browser console for errors (F12)
- Ensure product IDs are present in JSON

### Search box not showing
- Verify CSS is loaded properly
- Check for CSS class conflicts
- Ensure JavaScript loads after DOM is ready

### Results styling looks broken
- Check if Bootstrap CSS is loaded
- Verify Font Awesome icons are loading
- Check for CSS specificity conflicts

## Performance Tips
- Search is client-side (fast, no server calls)
- Results limited to 8 items (prevents overwhelming dropdown)
- Debounce search on large product lists (>1000 items)

## Future Enhancements
- Add search history
- Filter by price range
- Sort results (relevance, price, rating)
- Add keyboard navigation (arrow keys)
- Implement server-side search for large catalogs
