import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let allOrders = [];
let menuProducts = [];
let currentFilter = 'todos';

const container = document.getElementById('adminOrdersContainer');
const inventoryContainer = document.getElementById('adminInventoryContainer');
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-btn');

const statusLabels = ["Recibido", "Preparando", "Listo", "Entregado"];

// Menú base por si es necesario respaldar
const defaultProducts = [
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
];

document.addEventListener("DOMContentLoaded", () => {
    if (db) {
        // Escuchar Pedidos
        const q = query(collection(db, "pedidos"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            allOrders = [];
            snapshot.forEach((docSnap) => {
                allOrders.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderOrders();
        });

        // Escuchar Inventario / Menú
        onSnapshot(collection(db, "menu"), (snapshot) => {
            menuProducts = [];
            snapshot.forEach((docSnap) => {
                menuProducts.push({ id: docSnap.id, ...docSnap.data() });
            });
            
            // Si Firestore está vacío, inicializamos con los productos por defecto
            if (menuProducts.length === 0) {
                defaultProducts.forEach(async (p) => {
                    await setDoc(doc(db, "menu", String(p.id)), p);
                });
            } else {
                renderInventory();
            }
        });
    } else {
        if (container) container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">Firebase no está conectado.</p>`;
    }
});

function renderOrders() {
    if (!container) return;
    container.innerHTML = '';
    
    let displayOrders = allOrders;
    if (currentFilter === 'pendientes') {
        displayOrders = allOrders.filter(o => o.status < 3);
    }

    if (displayOrders.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: white; border-radius: var(--radius); border: 1px solid var(--border);">
                <i class="fas fa-box-open" style="font-size: 3rem; color: var(--border); margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">No hay pedidos registrados</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Las órdenes de los alumnos aparecerán aquí en tiempo real.</p>
            </div>`;
        return;
    }

    displayOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.padding = '1.25rem';
        
        let itemsHtml = order.items.map(i => `
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding: 3px 0;">
                <span><strong>${i.qty}×</strong> ${i.name}</span> 
                <span style="color:var(--text-muted);">$${(i.price * i.qty).toFixed(2)}</span>
            </div>
        `).join('');
        
        let timeString = "Reciente";
        if(order.timestamp && typeof order.timestamp.toDate === 'function') {
            timeString = order.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        const currentStatusText = statusLabels[order.status] || "Desconocido";

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                <div>
                    <span style="font-weight: 800; font-size: 1.05rem; color: var(--primary);">ORDEN ${order.orderNumber}</span>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Cuenta: <strong>${order.maskedId}</strong></div>
                </div>
                <span class="order-status-pill status-badge-${order.status}">${currentStatusText}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 2px; background: var(--bg-color); padding: 10px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 0.75rem;">
                ${itemsHtml}
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="far fa-clock"></i> ${timeString}</span>
                <span style="font-weight: 800; font-size: 1.1rem; color: var(--primary);">$${order.total.toFixed(2)}</span>
            </div>
            
            <div class="admin-card-actions">
                <button class="${order.status===0?'active':''}" data-id="${order.id}" data-status="0">Recibido</button>
                <button class="${order.status===1?'active':''}" data-id="${order.id}" data-status="1">Preparando</button>
                <button class="${order.status===2?'active':''}" data-id="${order.id}" data-status="2">Listo</button>
                <button class="${order.status===3?'active':''}" data-id="${order.id}" data-status="3">Entregado</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.admin-card-actions button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const orderId = e.target.dataset.id;
            const newStatus = parseInt(e.target.dataset.status);
            try {
                await updateDoc(doc(db, "pedidos", orderId), { status: newStatus });
            } catch (err) {
                console.error("Error al actualizar estado:", err);
            }
        });
    });
}

function renderInventory() {
    if (!inventoryContainer) return;
    inventoryContainer.innerHTML = '';

    menuProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.padding = '1.25rem';
        card.innerHTML = `
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <img src="${p.image}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/150'">
                <div>
                    <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem;">${p.name}</h4>
                    <span style="font-size: 0.85rem; color: var(--primary); font-weight: 800;">$${p.price.toFixed(2)}</span>
                </div>
            </div>
            <button class="btn-toggle-stock" data-id="${p.id}" style="background: ${p.available ? '#10b981' : '#ef4444'}; color: white; padding: 0.6rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; width: 100%;">
                ${p.available ? '<i class="fas fa-check-circle"></i> Disponible (Agotar)' : '<i class="fas fa-times-circle"></i> Agotado (Activar)'}
            </button>
        `;
        inventoryContainer.appendChild(card);
    });

    document.querySelectorAll('.btn-toggle-stock').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const productId = e.currentTarget.dataset.id;
            const product = menuProducts.find(item => String(item.id) === String(productId));
            if (product) {
                const newStatus = !product.available;
                try {
                    await updateDoc(doc(db, "menu", String(productId)), { available: newStatus });
                } catch (err) {
                    console.error("Error al actualizar stock:", err);
                }
            }
        });
    });
}

const btnFilterAll = document.getElementById('btnFilterAll');
const btnFilterPending = document.getElementById('btnFilterPending');

if (btnFilterAll && btnFilterPending) {
    btnFilterAll.addEventListener('click', (e) => {
        currentFilter = 'todos';
        e.target.classList.add('active');
        btnFilterPending.classList.remove('active');
        renderOrders();
    });

    btnFilterPending.addEventListener('click', (e) => {
        currentFilter = 'pendientes';
        e.target.classList.add('active');
        btnFilterAll.classList.remove('active');
        renderOrders();
    });
}

const btnSimulateScan = document.getElementById('btnSimulateScan');
if (btnSimulateScan) {
    btnSimulateScan.addEventListener('click', () => {
        const resultDiv = document.getElementById('scanResult');
        const orderToDeliver = allOrders.find(o => o.status === 2);
        
        if (orderToDeliver) {
            resultDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <h3 style="color: var(--primary); font-size: 1rem;">ORDEN ${orderToDeliver.orderNumber}</h3>
                    <span class="order-status-pill status-badge-2">Listo para entregar</span>
                </div>
                <p style="font-size: 0.9rem; margin-bottom: 0.3rem;"><strong>Matrícula:</strong> ${orderToDeliver.maskedId}</p>
                <p style="font-size: 0.9rem; margin-bottom: 1rem;"><strong>Total:</strong> $${orderToDeliver.total.toFixed(2)}</p>
                <button class="btn-primary" id="btnConfirmDelivery" style="padding: 0.7rem; font-size: 0.9rem;">Confirmar Entrega Final</button>
            `;
            resultDiv.classList.remove('hidden');

            document.getElementById('btnConfirmDelivery').addEventListener('click', async () => {
                await updateDoc(doc(db, "pedidos", orderToDeliver.id), { status: 3 });
                resultDiv.classList.add('hidden');
                alert('¡Orden entregada con éxito!');
            });
        } else {
            resultDiv.innerHTML = `
                <p style="color: var(--text-muted); text-align: center; margin: 0; font-size: 0.9rem;">
                    <i class="fas fa-info-circle"></i> No hay órdenes en estado <strong>"Listo"</strong> para entregar.
                </p>`;
            resultDiv.classList.remove('hidden');
        }
    });
}

function switchView(viewId) {
    views.forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
    
    navButtons.forEach(b => {
        if(b.dataset.target === viewId) b.classList.add('active');
        else b.classList.remove('active');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.target)));
