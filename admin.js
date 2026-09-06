import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
let currentFilter = 'todos';

const container = document.getElementById('adminOrdersContainer');
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-btn');

const statusLabels = ["Recibido", "Preparando", "Listo", "Entregado"];

document.addEventListener("DOMContentLoaded", () => {
    if (db) {
        const q = query(collection(db, "pedidos"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            allOrders = [];
            snapshot.forEach((docSnap) => {
                allOrders.push({ id: docSnap.id, ...docSnap.data() });
            });
            renderOrders();
        });
    } else {
        if (container) {
            container.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 3rem;">Firebase no está conectado en el panel.</p>`;
        }
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

// Filtros de Admin
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

// Simulador de Escáner QR / Entrega
const btnSimulateScan = document.getElementById('btnSimulateScan');
if (btnSimulateScan) {
    btnSimulateScan.addEventListener('click', () => {
        const resultDiv = document.getElementById('scanResult');
        const orderToDeliver = allOrders.find(o => o.status === 2); // Busca órdenes listas
        
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
