// Cart system for persistent cart badge state and add-to-cart support
const CartManager = {
    init() {
        if (!localStorage.getItem('liquorCart')) {
            localStorage.setItem('liquorCart', JSON.stringify({}));
        }
    },

    getCart() {
        return JSON.parse(localStorage.getItem('liquorCart') || '{}');
    },

    addItem(productId, productName, price) {
        const cart = this.getCart();

        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = {
                id: productId,
                name: productName,
                price: parseFloat(price),
                quantity: 1
            };
        }

        localStorage.setItem('liquorCart', JSON.stringify(cart));
        return cart;
    },

    getTotalQuantity() {
        const cart = this.getCart();
        let total = 0;
        for (let id in cart) {
            total += cart[id].quantity;
        }
        return total;
    }
};

function updateCartBadge() {
    const cartBadge = document.querySelector('.btn-cart small');
    if (!cartBadge) {
        return;
    }

    const totalQuantity = CartManager.getTotalQuantity();
    cartBadge.textContent = totalQuantity;
    cartBadge.style.transform = 'scale(1.3)';
    cartBadge.style.color = '#fff';
    cartBadge.style.backgroundColor = '#f96d00';
    cartBadge.style.display = 'inline-block';
    cartBadge.style.padding = '2px 6px';
    cartBadge.style.borderRadius = '50%';
    cartBadge.style.fontWeight = 'bold';
    cartBadge.style.minWidth = '20px';
    cartBadge.style.textAlign = 'center';

    setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
    }, 300);
}

function handleAddToCart(event) {
    const button = event.target.closest('.add-to-cart');
    if (!button) {
        return;
    }

    event.preventDefault();

    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = button.getAttribute('data-price');
    if (!productId || !productName || !productPrice) {
        return;
    }

    CartManager.addItem(productId, productName, productPrice);

    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="fa fa-check"></span>';
    button.style.color = '#28a745';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.color = '';
        button.disabled = false;
    }, 1200);

    updateCartBadge();
}

document.addEventListener('DOMContentLoaded', function() {
    CartManager.init();
    updateCartBadge();

    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.addEventListener('click', handleAddToCart);
    }
});
