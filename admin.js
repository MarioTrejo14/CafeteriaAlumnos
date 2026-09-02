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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let allOrders = [];
let currentFilter = 'todos';

const container = document.getElementById('adminOrdersContainer');
const views = document.querySelectorAll('.view');
const navButtons = document.querySelectorAll('.nav-btn');

const q = query(collection(db, "pedidos"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
    allOrders = [];
    snapshot.forEach((doc) => {
        allOrders.push({ id: doc.id, ...doc.data() });
    });
    renderOrders();
});

function renderOrders() {
    container.innerHTML = '';
    
    let displayOrders = allOrders;
    if (currentFilter === 'pendientes') {
        displayOrders = allOrders.filter(o => o.status < 3);
    }

    if (displayOrders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1; padding: 2rem;">No hay pedidos registrados.</p>';
        return;
    }

    displayOrders.forEach(order => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.padding = '1.25rem';
        
        let itemsHtml = order.items.map(i => `<div style="display:flex; justify-content:space-between; font-size:0.9rem;"><span>${i.qty} × ${i.name}</span> <span style="color:var(--text-muted);">$${(i.price * i.qty).toFixed(2)}</span></div>`).join('');
        
        let timeString = "Reciente";
        if(order.timestamp) {
            timeString = order.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: 700; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; margin-bottom: 0.75rem;">
                <span style="color: var(--primary);">ORDEN ${order.orderNumber}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${timeString}</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Matrícula:</strong> ${order.maskedId}</p>
            <div style="display: flex; flex-direction: column; gap: 4px; background: var(--bg-color); padding: 8px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 0.75rem;">
                ${itemsHtml}
            </div>
            <p style="font-weight: 800; font-size: 1.1rem; margin-bottom: 1rem;">Total: <span style="color: var(--primary);">$${order.total.toFixed(2)}</span></p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.4rem;">
                <button class="cat-btn ${order.status===0?'active':''}" style="font-size:0.75rem; padding:0.4rem;" data-id="${order.id}" data-status="0">Recibido</button>
                <button class="cat-btn ${order.status===1?'active':''}" style="font-size:0.75rem; padding:0.4rem;" data-id="${order.id}" data-status="1">Preparando</button>
                <button class="cat-btn ${order.status===2?'active':''}" style="font-size:0.75rem; padding:0.4rem;" data-id="${order.id}" data-status="2">Listo</button>
                <button class="cat-btn ${order.status===3?'active':''}" style="font-size:0.75rem; padding:0.4rem;" data-id="${order.id}" data-status="3">Entregado</button>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('#adminOrdersContainer button').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const orderId = e.target.dataset.id;
            const newStatus = parseInt(e.target.dataset.status);
            await updateDoc(doc(db, "pedidos", orderId), { status: newStatus });
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
                <h3 style="color: var(--primary);">ORDEN ${orderToDeliver.orderNumber}</h3>
                <p><strong>Alumno:</strong> ${orderToDeliver.maskedId}</p>
                <p style="margin: 0.5rem 0;"><strong>Estado:</strong> 🟢 LISTO PARA ENTREGAR</p>
                <button class="btn-primary" id="btnConfirmDelivery" style="margin-top:10px;">Confirmar entrega</button>
            `;
            resultDiv.classList.remove('hidden');

            document.getElementById('btnConfirmDelivery').addEventListener('click', async () => {
                await updateDoc(doc(db, "pedidos", orderToDeliver.id), { status: 3 });
                resultDiv.classList.add('hidden');
                alert('¡Orden marcada como entregada!');
            });
        } else {
            resultDiv.innerHTML = `<p style="color: var(--text-muted);">No hay órdenes "Listas" para entregar.</p>`;
            resultDiv.classList.remove('hidden');
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
navButtons.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.target)));