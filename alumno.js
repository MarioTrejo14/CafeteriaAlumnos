:root {
    --primary: #006633;       /* Verde institucional UdeC */
    --primary-hover: #004d26; 
    --bg-color: #f4f6f8;      
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border: #cbd5e1;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 12px 20px -3px rgba(0, 102, 51, 0.15);
    --radius: 14px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* Header Institucional UdeC con animación suave */
.app-header {
    background: #ffffff;
    border-bottom: 2px solid var(--primary);
    padding: 1rem 2rem;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    animation: slideDown 0.4s ease;
}

@keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.header-content h1 {
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--primary);
}

.header-content h2 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-main);
    margin-top: 0.1rem;
}

.academic-badge {
    display: inline-block;
    background: #e6f4ed;
    color: var(--primary);
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    margin-top: 0.3rem;
}

/* Contenedor principal con animación de aparición */
#app-container {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    padding-bottom: 6rem;
    animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Vistas */
.view {
    display: none;
}
.view.active {
    display: block;
    animation: fadeIn 0.3s ease;
}

/* Barra de búsqueda */
.search-bar {
    position: relative;
    margin-bottom: 1.5rem;
}

.search-bar i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.search-bar input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: 1rem;
    outline: none;
    background: var(--card-bg);
    box-shadow: var(--shadow);
    transition: all 0.25s ease;
}

.search-bar input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 102, 51, 0.15);
}

/* Contenedor de Categorías */
.categories-scroll {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    scrollbar-width: thin;
}

.cat-btn {
    background: var(--card-bg);
    border: 1px solid var(--border);
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    font-weight: 600;
    color: var(--text-muted);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.25s ease;
    box-shadow: var(--shadow);
}

.cat-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.cat-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(0, 102, 51, 0.25);
    transform: scale(1.03);
}

/* Grid de Productos */
.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
}

.product-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
}

.product-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--primary);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    background: #e2e8f0;
    transition: transform 0.5s ease;
}

.product-card:hover .product-img {
    transform: scale(1.05);
}

.product-info {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    background: var(--card-bg);
    z-index: 1;
}

.product-name {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.product-desc {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    flex: 1;
}

.product-price {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--primary);
    margin-bottom: 1rem;
}

/* Botones con animaciones fluidas */
button, .btn-primary {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,102,51,0.2);
}

button:hover {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,102,51,0.3);
}

button:active {
    transform: scale(0.97);
}

button:disabled {
    background-color: var(--border);
    color: var(--text-muted);
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
}

.btn-danger {
    background-color: #ef4444;
    color: white;
    border: none;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.5rem;
    width: 100%;
    transition: all 0.2s ease;
}

.btn-danger:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
}

/* Barra de navegación inferior móvil con efecto flotante */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-around;
    padding: 0.5rem 0;
    z-index: 1000;
    box-shadow: 0 -4px 15px rgba(0,0,0,0.08);
}

.bottom-nav .nav-btn {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem;
    width: auto;
    box-shadow: none;
    transition: color 0.2s ease, transform 0.2s ease;
}

.bottom-nav .nav-btn i {
    font-size: 1.25rem;
    transition: transform 0.2s ease;
}

.bottom-nav .nav-btn:hover i {
    transform: translateY(-2px);
}

.bottom-nav .nav-btn.active, .bottom-nav .nav-btn:hover {
    color: var(--primary);
    background: transparent;
}

/* Carrito y Badge con animación */
.badge {
    position: absolute;
    top: 4px;
    right: calc(50% - 18px);
    background: #ef4444;
    color: white;
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: 700;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
}

.hidden {
    display: none !important;
}

/* Pantalla de éxito / rastreo */
.success-screen {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    box-shadow: var(--shadow-lg);
    animation: scaleUp 0.3s ease;
}

@keyframes scaleUp {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}

.success-icon {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 1rem;
    animation: bounce 0.6s ease;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
}

.progress-container {
    margin: 2rem 0;
}

.progress-bar {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.progress-step {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted);
    transition: color 0.3s ease;
}
