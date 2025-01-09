// // Toggle class active
const navbarNav = document.querySelector('.navbar-nav'); 
// //ketika menu di klik
document.querySelector('#menu').onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

// //klik diluar sidebar untuk menghilangkan nav
const menu = document.querySelector('#menu');


document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active')
    }
   
})







////////////
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('#cart');
const checkoutBtn = document.querySelector('#checkout-btn'); // Added this line

const nameInput = document.querySelector('#name'); // Added this line
const phoneInput = document.querySelector('#phone'); // Added this line
const emailInput = document.querySelector('#email'); // Added this line
let cartCount = 0; // Added this line
let totalAmount = 0; // Added this line
// checkoutBtn.addEventListener('click', async function (e) {
//     e.preventDefault();
// });
  

        

        searchButton.onclick = (e) => {
            e.preventDefault();
            searchForm.classList.toggle('active');
            searchBox.focus();
            cart.style.display = 'none'; // Added this line
        };
        
        cartIcon.onclick = (e) => {
            e.preventDefault();
            cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
            searchForm.classList.remove('active'); // Added this line
        };
        
        document.addEventListener('click', function (e) {
            if (!searchButton.contains(e.target) && !searchForm.contains(e.target)) {
                searchForm.classList.remove('active');
            }
            // Removed the condition to close the cart when clicking outside
        });

        document.getElementById('search-box').addEventListener('input', function() {
            var filter = this.value.toLowerCase();
            var products = document.getElementsByClassName('product');
            Array.from(products).forEach(function(product) {
                var productName = product.getElementsByTagName('h3')[0].textContent.toLowerCase();
                if (productName.includes(filter)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });

        function addToCart(name, price, imageUrl) {
            var cartItems = document.getElementById('cart-items');
            var cartItem = document.createElement('div');
            cartItem.className = 'cart-item'; 
            cartItem.innerHTML = `
                <img src="${imageUrl}" alt="${name}" width="50" height="50">
                <div class="cart-item-details">
                    <h3>${name}</h3>
                    <p>Rp ${price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button onclick="decreaseQuantity(this, ${price})"><i class="fas fa-minus"></i></button>
                        <input type="number" value="1" min="1" readonly>
                        <button onclick="increaseQuantity(this, ${price})"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <button class="delete-btn" onclick="removeItem(this, ${price})">Delete</button>
            `;
            cartItems.appendChild(cartItem);
            updateCartCount(1);
            updateTotal(price);
        }

        function removeItem(button, price) {
            var cartItem = button.parentElement;
            var quantity = parseInt(cartItem.querySelector('.quantity-controls input').value);
            cartItem.remove();
            updateCartCount(-quantity);
            updateTotal(-price * quantity);
        }

        function increaseQuantity(button, price) {
            var input = button.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updateCartCount(1);
            updateTotal(price);
        }

        function decreaseQuantity(button, price) {
            var input = button.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartCount(-1);
                updateTotal(-price);
            }
        }

        function updateCartCount(change) {
            cartCount += change;
            var cartCountElement = document.getElementById('cart-count');
            if (cartCount > 0) {
                cartCountElement.style.display = 'inline';
                cartCountElement.textContent = cartCount;
            } else {
                cartCountElement.style.display = 'none';
            }
        }

        function updateTotal(change) {
            totalAmount += change;
            var totalElement = document.getElementById('total');
            totalElement.textContent = `Total: Rp ${totalAmount.toLocaleString()}`;
        }

        // Added this function to enable/disable the checkout button
        function validateCheckout() {
            if (nameInput.value && phoneInput.value && emailInput.value) {
                checkoutBtn.disabled = false;
                checkoutBtn.classList.add('active');
            } else {
                checkoutBtn.disabled = true;
                checkoutBtn.classList.remove('active');
            }
            
        }

        // Added event listeners to validate the checkout form
        nameInput.addEventListener('input', validateCheckout);
        phoneInput.addEventListener('input', validateCheckout);
        emailInput.addEventListener('input', validateCheckout);


checkoutBtn.addEventListener('click', async function (e) {
    e.preventDefault(); // Mencegah aksi default

   
        // Ambil semua item dari cart
        const cartItems = document.getElementById('cart-items').children;
        let items = [];
    
        // Loop melalui setiap item dalam cart
        for (let item of cartItems) {
            const name = item.querySelector('h3').textContent; // Ambil nama produk
            const price = parseInt(item.querySelector('p').textContent.replace(/[^0-9]/g, '')); // Ambil harga
            const quantity = parseInt(item.querySelector('.quantity-controls input').value); // Ambil jumlah
    
            // Tambahkan item ke array
            items.push({ name, price, quantity });
        }
    
        // Buat objek data untuk dikirim
        const formData = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            items: items,
            total: totalAmount
        };
    
        // Log data untuk verifikasi
         console.log(formData);
    try {
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Pastikan header ini ada
            },
            body: JSON.stringify(formData) // Mengubah objek menjadi JSON
        
        });
        
        const token = await response.text(); // Ambil token dari response
         console.log(token);
        //window.snap.pay('TRANSACTION_TOKEN_HERE');
        //window.snap.pay(token); // Gunakan token untuk memproses pembayaran
        // Cek apakah token valid
        if (token && token !== 'Data tidak lengkap') {
            window.snap.pay(token); // Gunakan token untuk memproses pembayaran
        } else {
            console.error('Token tidak valid:', token); // Tampilkan pesan error jika token tidak valid
        }
    } catch (err) {
        console.log(err.message); // Tampilkan error jika ada
    }

    
    
});