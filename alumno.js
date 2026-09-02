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

const database = {
    categories: ["Todos", "Desayunos", "Comidas", "Bebidas"],
    products: [
        { id: 1, name: "Torta de jamón", price: 25, category: "Desayunos", image: "https://via.placeholder.com/150", desc: "Clásica y deliciosa.", available: true, tag: "Popular" },
        { id: 2, name: "Sándwich", price: 30, category: "Desayunos", image: "https://via.placeholder.com/150", desc: "Pan integral con vegetales.", available: true, tag: "" },
        { id: 3, name: "Chilaquiles", price: 40, category: "Comidas", image: "https://via.placeholder.com/150", desc: "Rojos o verdes con pollo.", available: true, tag: "Nuevo" },
        { id: 4, name: "Agua fresca", price: 15, category: "Bebidas", image: "https://via.placeholder.com/150", desc: "Sabor del día.", available: true, tag: "" }
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

searchInput.addEventListener('input', e => renderProducts(e.target.value));
studentIdInput.addEventListener('input', updateCartUI);
document.getElementById('btnEmptyCart').addEventListener('click', () => { cart = []; updateCartUI(); });

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

function listenToMyOrder(docId) {
    onSnapshot(doc(db, "pedidos", docId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('trackOrderNumber').textContent = `ORDEN #${data.orderNumber}`;
            document.getElementById('trackOrderTotal').textContent = `$${data.total.toFixed(2)}`;
            
            const ul = document.getElementById('trackOrderItems');
            ul.innerHTML = data.items.map(i => `<li style="display:flex; justify-content:space-between;"><span>${i.qty} × ${i.name}</span> <span>$${(i.price * i.qty).toFixed(2)}</span></li>`).join('');

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
    document.getElementById(viewId).classList.add('active');
    navButtons.forEach(b => {
        if(b.dataset.target === viewId) b.classList.add('active');
        else b.classList.remove('active');
    });
}

function setupNavigation() {
    navButtons.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.target)));
}

init();