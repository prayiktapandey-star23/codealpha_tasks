const API = 'https://shopeasy-backend-0tar.onrender.com/api';

const DUMMY_PRODUCTS = [
  { _id: '1', name: 'Wireless Headphones', description: 'Premium sound quality with noise cancellation and 30hr battery life', price: 2999, image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg', category: 'Electronics' },
  { _id: '2', name: 'Running Shoes', description: 'Lightweight and comfortable shoes perfect for daily running', price: 1999, image: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_640.jpg', category: 'Footwear' },
  { _id: '3', name: 'Smart Watch', description: 'Track fitness, notifications and more with this stylish smartwatch', price: 4999, image: 'https://cdn.pixabay.com/photo/2020/05/07/09/45/smart-watch-5141044_640.jpg', category: 'Electronics' },
  { _id: '4', name: 'Backpack', description: 'Durable 30L backpack with laptop compartment, perfect for travel', price: 1499, image: 'https://cdn.pixabay.com/photo/2016/03/27/22/05/backpack-1284635_640.jpg', category: 'Bags' },
  { _id: '5', name: 'Sunglasses', description: 'UV400 protection polarized sunglasses with stylish frame', price: 899, image: 'https://cdn.pixabay.com/photo/2019/09/16/15/21/sunglasses-4480542_640.jpg', category: 'Accessories' },
  { _id: '6', name: 'Gaming Keyboard', description: 'Mechanical gaming keyboard with RGB backlight and tactile keys', price: 1299, image: 'https://cdn.pixabay.com/photo/2018/05/08/21/28/keyboard-3383082_640.jpg', category: 'Electronics' },
  { _id: '7', name: 'Coffee Mug', description: 'Insulated stainless steel mug keeps drinks hot for 12 hours', price: 499, image: 'https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2558822_640.jpg', category: 'Kitchen' },
  { _id: '8', name: 'Water Bottle', description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours', price: 799, image: 'https://cdn.pixabay.com/photo/2017/03/27/13/50/water-bottle-2179254_640.jpg', category: 'Fitness' },
];

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { errorMsg.textContent = data.message; return; }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';
  } catch (err) {
    errorMsg.textContent = 'Something went wrong!';
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { errorMsg.textContent = data.message; return; }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'index.html';
  } catch (err) {
    errorMsg.textContent = 'Something went wrong!';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
}

function updateNavAuth() {
  const token = localStorage.getItem('token');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');
  if (token) {
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';
  }
  updateCartCount();
}

let allProductsData = [];

async function loadAllProducts() {
  const grid = document.getElementById('all-products');
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    allProductsData = products;
    renderProducts(products, grid);
  } catch {
    allProductsData = DUMMY_PRODUCTS;
    renderProducts(DUMMY_PRODUCTS, grid);
  }
  updateNavAuth();
}

async function loadFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  try {
    const res = await fetch(`${API}/products`);
    const products = await res.json();
    renderProducts(products.slice(0, 4), grid);
  } catch {
    renderProducts(DUMMY_PRODUCTS.slice(0, 4), grid);
  }
  updateNavAuth();
}

function renderProducts(products, container) {
  if (products.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;grid-column:1/-1">No products found.</p>';
    return;
  }
  container.innerHTML = products.map(p => `
    <div class="product-card" onclick="window.location.href='product-detail.html?id=${p._id}'" style="cursor:pointer">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Product'"/>
      <div class="product-info">
        <span class="category">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description.substring(0, 60)}...</p>
        <div class="price">₹${p.price}</div>
        <button class="btn" onclick="addToCart('${p._id}', '${p.name}', ${p.price}, '${p.image}')">
          Add to Cart 🛒
        </button>
      </div>
    </div>
  `).join('');
}

function filterProducts() {
  const search = document.getElementById('search').value.toLowerCase();
  const filtered = allProductsData.filter(p =>
    p.name.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search)
  );
  renderProducts(filtered, document.getElementById('all-products'));
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
}

function addToCart(id, name, price, image) {
  const cart = getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  saveCart(cart);
  alert(`✅ ${name} added to cart!`);
}

function loadCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  updateNavAuth();
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center;padding:40px">Your cart is empty. <a href="products.html">Shop now!</a></p>';
    cartSummary.innerHTML = '';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/80?text=Item'"/>
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>₹${item.price} x ${item.quantity}</p>
      </div>
      <div>
        <button class="btn" onclick="changeQty('${item.id}', -1)" style="padding:5px 12px">-</button>
        <span style="margin:0 10px">${item.quantity}</span>
        <button class="btn" onclick="changeQty('${item.id}', 1)" style="padding:5px 12px">+</button>
        <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:#e11d48;cursor:pointer;margin-left:15px;font-size:20px">🗑️</button>
      </div>
    </div>
  `).join('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartSummary.innerHTML = `
    <h2>Total: ₹${total}</h2>
    <br/>
    <a href="order.html" class="btn">Proceed to Checkout →</a>
  `;
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) cart.splice(cart.indexOf(item), 1);
  }
  saveCart(cart);
  loadCart();
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  loadCart();
}

function showOrderSummary() {
  const cart = getCart();
  const summary = document.getElementById('order-summary');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  summary.innerHTML = `
    <strong>Order Summary:</strong><br/>
    ${cart.map(i => `${i.name} x${i.quantity} = ₹${i.price * i.quantity}`).join('<br/>')}
    <br/><strong>Total: ₹${total}</strong>
  `;
}

async function placeOrder() {
  const token = localStorage.getItem('token');
  const errorMsg = document.getElementById('error-msg');
  if (!token) {
    errorMsg.textContent = 'Please login first!';
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const postalCode = document.getElementById('postalCode').value;
  const cart = getCart();
  if (!address || !city || !postalCode) {
    errorMsg.textContent = 'Please fill all fields!';
    return;
  }
  const items = cart.map(i => ({
    product: i.id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image
  }));
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ items, totalPrice, shippingAddress: { address, city, postalCode } })
    });
    const data = await res.json();
    if (!res.ok) { errorMsg.textContent = data.message; return; }
    localStorage.removeItem('cart');
    document.querySelector('.auth-box').innerHTML = `
      <div class="success-msg">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Order ID: ${data._id}</p>
        <p>Total: ₹${totalPrice}</p>
        <br/>
        <a href="products.html" class="btn">Continue Shopping</a>
      </div>
    `;
  } catch {
    errorMsg.textContent = 'Something went wrong!';
  }
}

updateNavAuth();