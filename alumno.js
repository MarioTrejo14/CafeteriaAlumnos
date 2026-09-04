import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCLhub133VwdXlQEq4PZ4A6vOYrttSOtR0",
    authDomain: "cafeteria-udc.firebaseapp.com",
    projectId: "cafeteria-udc",
    storageBucket: "cafeteria-udc.firebasestorage.app",
    messagingSenderId: "721300284933",
    appId: "1:721300284933:web:2ab2826531918e0edcde6c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Menú completo extraído de Danni's
const database = {
    categories: ["Todos", "Desayunos y Comidas", "Tacos", "Tortas y Más", "Hamburguesas", "Menú Verde", "Bebidas", "Paquetes"],
    products: [
        // Desayunos y Comidas
        { id: 1, name: "Desayuno", price: 55, category: "Desayunos y Comidas", image: "https://via.placeholder.com/150", desc: "3 complementos + agua fresca chica.", available: true, tag: "Popular" },
        { id: 2, name: "Comida", price: 75, category: "Desayunos y Comidas", image: "https://via.placeholder.com/150", desc: "1 guisado + 2 acompañamientos + tortillas + agua.", available: true, tag: "" },
        { id: 3, name: "Comida Light", price: 85, category: "Desayunos y Comidas", image: "https://via.placeholder.com/150", desc: "Pollo/pescado a la plancha + 2 acompañamientos.", available: true, tag: "Saludable" },

        // Tacos
        { id: 4, name: "Taco Adobada o Longaniza", price: 20, category: "Tacos", image: "https://via.placeholder.com/150", desc: "Delicioso taco tradicional.", available: true, tag: "" },
        { id: 5, name: "Taco Barbacoa o Arrachera", price: 25, category: "Tacos", image: "https://via.placeholder.com/150", desc: "Carne seleccionada.", available: true, tag: "" },
        { id: 6, name: "Quesabirria", price: 28, category: "Tacos", image: "https://via.placeholder.com/150", desc: "Con queso fundido y consomé.", available: true, tag: "Favorito" },

        // Tortas y Más
        { id: 7, name: "Tortas Sencillas", price: 50, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Adobada, lomo, panela, jamón o salchicha.", available: true, tag: "" },
        { id: 8, name: "Tortas Especiales", price: 55, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Milanesa, Chicharrón o Pierna.", available: true, tag: "" },
        { id: 9, name: "Las Favoritas (Tortas)", price: 65, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Adobada, Mexicana, Suiza o Barbacoa.", available: true, tag: "Top" },
        { id: 10, name: "Quesadilla Sencilla", price: 18, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Tortilla de harina con queso.", available: true, tag: "" },
        { id: 11, name: "Quesadilla con Carne", price: 23, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Tortilla de harina con carne y queso.", available: true, tag: "" },
        { id: 12, name: "Burritos", price: 50, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "2 piezas con carne deshebrada, frijol y ensalada.", available: true, tag: "" },
        { id: 13, name: "Gringa", price: 40, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Adobada con queso mozzarella.", available: true, tag: "" },
        { id: 14, name: "Sincronizada", price: 40, category: "Tortas y Más", image: "https://via.placeholder.com/150", desc: "Jamón, queso amarillo y queso mozzarella.", available: true, tag: "" },

        // Hamburguesas
        { id: 15, name: "Hamburguesa Clásica", price: 60, category: "Hamburguesas", image: "https://via.placeholder.com/150", desc: "Carne, queso americano y aderezos.", available: true, tag: "" },

        // Menú Verde
        { id: 16, name: "Sándwich con Ensalada", price: 60, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Jamón con panela/salami, vegetales y germinado.", available: true, tag: "Verde" },
        { id: 17, name: "Bowl de Pollo", price: 60, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Pollo, arroz cocido, queso crema, zanahoria y aguacate.", available: true, tag: "Verde" },
        { id: 18, name: "Bowl de Arrachera", price: 60, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Arrachera, arroz, pico de gallo, aguacate y elote.", available: true, tag: "Verde" },
        { id: 19, name: "Baguette Clásico o Italiano", price: 55, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Jamón, salami o panela con vegetales frescos.", available: true, tag: "Verde" },
        { id: 20, name: "Baguette de Pollo", price: 75, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Pollo a la plancha con vegetales.", available: true, tag: "Verde" },
        { id: 21, name: "Baguette Mexa", price: 85, category: "Menú Verde", image: "https://via.placeholder.com/150", desc: "Arrachera y mozzarella con vegetales.", available: true, tag: "Verde" },

        // Bebidas
        { id: 22, name: "Café", price: 25, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Café caliente recién hecho.", available: true, tag: "" },
        { id: 23, name: "Chocomilk", price: 30, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Bebida dulce de chocolate.", available: true, tag: "" },
        { id: 24, name: "Licuado", price: 30, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Licuado de temporada.", available: true, tag: "" },
        { id: 25, name: "Licuado Energético", price: 35, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Especial para dar energía.", available: true, tag: "" },
        { id: 26, name: "Frappé", price: 45, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Bebida fría con café/sabor.", available: true, tag: "" },
        { id: 27, name: "Smoothies", price: 40, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "A base de fruta natural.", available: true, tag: "" },
        { id: 28, name: "Agua Fresca ½ L", price: 20, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Sabor del día.", available: true, tag: "" },
        { id: 29, name: "Agua Fresca 1 L", price: 30, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Sabor del día grande.", available: true, tag: "" },

        // Paquetes
        { id: 30, name: "Paquete Torta", price: 65, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "1 torta sencilla + 1 agua fresca chica.", available: true, tag: "Oferta" },
        { id: 31, name: "Paquete Tacos", price: 75, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "3 tacos adobada + 1 agua fresca chica.", available: true, tag: "Oferta" },
        { id: 32, name: "Paquete Burger", price: 75, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "1 hamburguesa clásica + 1 agua fresca chica.", available: true, tag: "Oferta" },
        { id: 33, name: "Paquete Baguette", price: 70, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "1 baguette (clásico/italiano/vegetariano) + agua.", available: true, tag: "Oferta" },
        { id: 34, name: "Paquete Burritos", price: 65, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "2 burritos + 1 agua fresca chica.", available: true, tag: "Oferta" },
        { id: 35, name: "Paquete Pachuco", price: 55, category: "Paquetes", image: "https://via.placeholder.com/150", desc: "1 pachuco con carne adobada + 1 agua fresca chica.", available: true, tag: "Oferta" }
    ]
};

let cart = [];
let currentCategory = "Todos";
let activeOrderDocId = localStorage.getItem('myActiveOrderId') || null;

const productsContainer = document.getElementById('productsContainer');
const categoriesContainer = document.getElementById('categoriesContainer');
const searchInput = document.getElementById('searchInput');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const studentIdInput = document.getElementById('studentId');
const btnConfirmOrder = document.getElementById('btnConfirmOrder');
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-btn');

function init() {
    renderCategories();
    renderProducts();
    setupNavigation();
    
    if (activeOrderDocId) {
        switchView('view-tracking');
        listenToMyOrder(activeOrderDocId);
    }
}

function renderCategories() {
    categoriesContainer.innerHTML = '';
    database.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${cat === currentCategory ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => { currentCategory = cat; renderCategories(); renderProducts(); };
        categoriesContainer.appendChild(btn);
    });
}

function renderProducts(filterText = '') {
    productsContainer.innerHTML = '';
    let filtered = database.products.filter(p => p.available);
    if (currentCategory !== "Todos") filtered = filtered.filter(p => p.category === currentCategory);
    if (filterText) filtered = filtered.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
            <img src="${p.image}" class="product-img">
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <span class="product-price">$${p.price.toFixed(2)}</span>
                <button class="btn-add" data-id="${p.id}">Agregar al carrito</button>
            </div>
        `;
        productsContainer.appendChild(card);
    });

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => addToCart(parseInt(e.target.dataset.id)));
    });
}

window.changeQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
        updateCartUI();
    }
}

function addToCart(productId) {
    const product = database.products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty++;
    else cart.push({ ...product, qty: 1 });
    updateCartUI();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalItems;
    cartBadge.classList.toggle('hidden', totalItems === 0);

    cartItemsContainer.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Tu carrito está vacío.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            cartItemsContainer.innerHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; background: white; padding: 1rem; border-radius: 10px; border: 1px solid var(--border);">
                    <div><strong>${item.name}</strong><br><small style="color: var(--text-muted);">$${item.price.toFixed(2)} c/u</small></div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="changeQty(${item.id}, -1)" style="width: 32px; height: 32px; padding: 0; background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border);">-</button>
                        <span style="font-weight: 600;">${item.qty}</span>
                        <button onclick="changeQty(${item.id}, 1)" style="width: 32px; height: 32px; padding: 0; background: #f1f5f9; color: var(--text-main); border: 1px solid var(--border);">+</button>
                    </div>
                </div>`;
        });
    }

    cartTotalEl.textContent = `$${total.toFixed(2)}`;
    btnConfirmOrder.disabled = !(cart.length > 0 && studentIdInput.value.trim().length >= 4);
}

if (searchInput) searchInput.addEventListener('input', e => renderProducts(e.target.value));
if (studentIdInput) studentIdInput.addEventListener('input', updateCartUI);
const btnEmptyCart = document.getElementById('btnEmptyCart');
if (btnEmptyCart) btnEmptyCart.addEventListener('click', () => { cart = []; updateCartUI(); });

if (btnConfirmOrder) {
    btnConfirmOrder.addEventListener('click', async () => {
        btnConfirmOrder.disabled = true;
        btnConfirmOrder.textContent = "Procesando...";

        const studentId = studentIdInput.value.trim();
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const orderNumber = `A-${Math.floor(1000 + Math.random() * 9000)}`;
        const maskedId = studentId.length > 4 ? '••••' + studentId.slice(-4) : studentId;

        try {
            const docRef = await addDoc(collection(db, "pedidos"), {
                orderNumber,
                studentId,
                maskedId,
                items: cart,
                total,
                status: 0,
                timestamp: serverTimestamp()
            });

            localStorage.setItem('myActiveOrderId', docRef.id);
            cart = [];
            studentIdInput.value = '';
            updateCartUI();
            btnConfirmOrder.textContent = "Confirmar Pedido";
            
            switchView('view-tracking');
            listenToMyOrder(docRef.id);
        } catch (e) {
            console.error("Error:", e);
            alert("Hubo un error al conectar con la cafetería.");
            btnConfirmOrder.disabled = false;
            btnConfirmOrder.textContent = "Confirmar Pedido";
        }
    });
}

function listenToMyOrder(docId) {
    onSnapshot(doc(db, "pedidos", docId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const trackNum = document.getElementById('trackOrderNumber');
            const trackTot = document.getElementById('trackOrderTotal');
            if (trackNum) trackNum.textContent = `ORDEN #${data.orderNumber}`;
            if (trackTot) trackTot.textContent = `$${data.total.toFixed(2)}`;
            
            const ul = document.getElementById('trackOrderItems');
            if (ul) {
                ul.innerHTML = data.items.map(i => `<li style="display:flex; justify-content:space-between;"><span>${i.qty} × ${i.name}</span> <span>$${(i.price * i.qty).toFixed(2)}</span></li>`).join('');
            }

            for(let i = 0; i <= 3; i++){
                const step = document.getElementById(`step-${i}`);
                if (step) {
                    step.style.color = "var(--text-muted)";
                    if (i <= data.status) {
                        step.style.color = "var(--primary)";
                        step.style.fontWeight = "700";
                    }
                }
            }
        }
    });
}

function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');
    
    navButtons.forEach(b => {
        if(b.dataset.target === viewId) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setupNavigation() {
    navButtons.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.target)));
}

init();
