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

let db = null;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) {
    console.warn("Firebase warning:", e);
}

const database = {
    categories: ["Todos", "Desayunos y Comidas", "Tacos", "Tortas y Más", "Menú Verde", "Bebidas", "Paquetes"],
    products: [
        { id: 1, name: "Desayuno Casero", price: 55, category: "Desayunos y Comidas", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80", desc: "3 complementos + agua fresca chica.", available: true, tag: "Popular" },
        { id: 2, name: "Comida Corrida", price: 75, category: "Desayunos y Comidas", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80", desc: "1 guisado + 2 acompañamientos + tortillas + agua.", available: true, tag: "" },
        { id: 3, name: "Comida Light", price: 85, category: "Desayunos y Comidas", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80", desc: "Pollo o pescado a la plancha + 2 acompañamientos + agua.", available: true, tag: "Saludable" },
        { id: 4, name: "Tacos de Adobada o Longaniza", price: 20, category: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", desc: "Deliciosos tacos tradicionales.", available: true, tag: "" },
        { id: 5, name: "Tacos de Barbacoa o Arrachera", price: 25, category: "Tacos", image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80", desc: "Carne suave y bien sazonada.", available: true, tag: "Favorito" },
        { id: 6, name: "Quesabirria", price: 28, category: "Tacos", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80", desc: "Con queso fundido y consomé.", available: true, tag: "Top" },
        { id: 7, name: "Torta Sencilla", price: 50, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80", desc: "Adobada, lomo, panela, jamón o salchicha.", available: true, tag: "" },
        { id: 8, name: "Torta Especial", price: 55, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80", desc: "Milanesa, chicharrón o pierna.", available: true, tag: "" },
        { id: 9, name: "Torta Las Favoritas", price: 65, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&q=80", desc: "Adobada, mexicana, suiza o barbacoa.", available: true, tag: "Especial" },
        { id: 10, name: "Quesadilla Sencilla", price: 18, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1618040994374-d02cc8565df0?w=400&q=80", desc: "Con tortilla de harina y queso fundido.", available: true, tag: "Antojo" },
        { id: 11, name: "Quesadilla con Carne", price: 23, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80", desc: "Tortilla de harina con abundante carne y queso.", available: true, tag: "Popular" },
        { id: 12, name: "Burritos (2 pzas)", price: 50, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80", desc: "Carne deshebrada, frijol y ensalada.", available: true, tag: "" },
        { id: 13, name: "Gringa", price: 40, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80", desc: "Tortilla de harina con queso y carne.", available: true, tag: "" },
        { id: 14, name: "Sincronizada", price: 40, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80", desc: "Jamón, queso amarillo y queso mozzarella.", available: true, tag: "" },
        { id: 15, name: "Hamburguesa Clásica", price: 60, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", desc: "Carne, queso y vegetales frescos.", available: true, tag: "Popular" },
        { id: 16, name: "Sándwich Clásico", price: 38, category: "Tortas y Más", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80", desc: "Jamón o salchicha con complementos.", available: true, tag: "" },
        { id: 17, name: "Sándwich con Ensalada", price: 60, category: "Menú Verde", image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&q=80", desc: "Jamón con panela o salami + vegetales y germinado.", available: true, tag: "Verde" },
        { id: 18, name: "Bowl de Pollo", price: 60, category: "Menú Verde", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", desc: "Pollo, arroz, queso crema, zanahoria, pepino y aguacate.", available: true, tag: "Fit" },
        { id: 19, name: "Bowl de Arrachera", price: 60, category: "Menú Verde", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", desc: "Arrachera, arroz, pico de gallo, aguacate y elote.", available: true, tag: "Fit" },
        { id: 20, name: "Baguette Clásico o Italiano", price: 55, category: "Menú Verde", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80", desc: "Jamón, panela o salami con vegetales frescos.", available: true, tag: "" },
        { id: 21, name: "Baguette de Pollo", price: 75, category: "Menú Verde", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80", desc: "Pollo a la plancha con vegetales.", available: true, tag: "" },
        { id: 22, name: "Baguette Mexa (Arrachera)", price: 85, category: "Menú Verde", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80", desc: "Arrachera y mozzarella con vegetales.", available: true, tag: "Especial" },
        { id: 23, name: "Café / Chocomilk / Licuado", price: 30, category: "Bebidas", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80", desc: "Bebidas calientes o licuado tradicional.", available: true, tag: "" },
        { id: 24, name: "Licuado Energético", price: 35, category: "Bebidas", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80", desc: "Para iniciar con energía el día.", available: true, tag: "" },
        { id: 25, name: "Frappé / Smoothies", price: 45, category: "Bebidas", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80", desc: "Fríos y refrescantes.", available: true, tag: "" },
        { id: 26, name: "Agua Fresca (1 Litro)", price: 30, category: "Bebidas", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", desc: "Sabor del día natural.", available: true, tag: "Refrescante" },
        { id: 27, name: "Paquete Torta", price: 65, category: "Paquetes", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80", desc: "1 torta sencilla + 1 agua fresca chica.", available: true, tag: "Paquete" },
        { id: 28, name: "Paquete Tacos", price: 75, category: "Paquetes", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", desc: "3 tacos de adobada + 1 agua fresca chica.", available: true, tag: "Paquete" },
        { id: 29, name: "Paquete Burger", price: 75, category: "Paquetes", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", desc: "1 hamburguesa clásica + 1 agua fresca chica.", available: true, tag: "Paquete" },
        { id: 30, name: "Paquete Baguette", price: 70, category: "Paquetes", image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&q=80", desc: "1 baguette (clásico, italiano o veg) + agua fresca.", available: true, tag: "Paquete" }
    ]
};

let cart = [];
let currentCategory = "Todos";
let activeOrderDocId = localStorage.getItem('myActiveOrderId') || null;

document.addEventListener("DOMContentLoaded", () => {
    init();
});

function init() {
    renderCategories();
    renderProducts();
    setupNavigation();
    
    if (activeOrderDocId && db) {
        switchView('view-tracking');
        listenToMyOrder(activeOrderDocId);
    }
}

function renderCategories() {
    const categoriesContainer = document.getElementById('categoriesContainer');
    if (!categoriesContainer) return;
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
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    let filtered = database.products.filter(p => p.available);
    if (currentCategory !== "Todos") filtered = filtered.filter(p => p.category === currentCategory);
    if (filterText) filtered = filtered.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
            <img src="${p.image}" class="product-img" onerror="this.src='https://via.placeholder.com/150'">
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
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartBadge = document.getElementById('cartBadge');
    const studentIdInput = document.getElementById('studentId');
    const btnConfirmOrder = document.getElementById('btnConfirmOrder');

    if (!cartItemsContainer || !cartTotalEl || !cartBadge) return;
    
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
    if (btnConfirmOrder) {
        btnConfirmOrder.disabled = !(cart.length > 0 && studentIdInput && studentIdInput.value.trim().length >= 4);
    }
}

const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', e => renderProducts(e.target.value));

const studentIdInput = document.getElementById('studentId');
if (studentIdInput) studentIdInput.addEventListener('input', updateCartUI);

const btnEmptyCart = document.getElementById('btnEmptyCart');
if (btnEmptyCart) btnEmptyCart.addEventListener('click', () => { cart = []; updateCartUI(); });

const btnConfirmOrder = document.getElementById('btnConfirmOrder');
if (btnConfirmOrder) {
    btnConfirmOrder.addEventListener('click', async () => {
        if (!db) {
            alert("Modo simulación: Firebase no está conectado.");
            return;
        }

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
            console.error("Error al guardar pedido:", e);
            alert("Hubo un error al conectar con la cafetería.");
            btnConfirmOrder.disabled = false;
            btnConfirmOrder.textContent = "Confirmar Pedido";
        }
    });
}

function listenToMyOrder(docId) {
    if (!db) return;
    onSnapshot(doc(db, "pedidos", docId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            const trackNum = document.getElementById('trackOrderNumber');
            const trackTot = document.getElementById('trackOrderTotal');
            const ul = document.getElementById('trackOrderItems');
            
            if (trackNum) trackNum.textContent = `ORDEN #${data.orderNumber}`;
            if (trackTot) trackTot.textContent = `$${data.total.toFixed(2)}`;
            if (ul) ul.innerHTML = data.items.map(i => `<li style="display:flex; justify-content:space-between;"><span>${i.qty} × ${i.name}</span> <span>$${(i.price * i.qty).toFixed(2)}</span></li>`).join('');

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
    const views = document.querySelectorAll('.view');
    const navButtons = document.querySelectorAll('.nav-btn');
    
    views.forEach(v => v.classList.remove('active'));
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.add('active');
    
    navButtons.forEach(b => {
        if(b.dataset.target === viewId) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.target)));
}
