/**
 * Harm Reduction Supply Ordering System
 * Watch Dogs inspired UI for supply management
 */

class SupplyOrderingSystem {
    constructor() {
        this.cart = [];
        this.categories = [
            'Injection Supplies',
            'Smoking Supplies',
            'Safety Equipment',
            'Testing Supplies',
            'First Aid',
            'General Supplies'
        ];
        
        this.supplies = this.initializeSupplies();
        this.currentCategory = 'all';
        this.searchQuery = '';
        
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.setupEventListeners();
    }

    initializeSupplies() {
        return [
            // Injection Supplies
            {
                id: 'syringe-1ml',
                name: '1mL Sterile Syringe',
                category: 'Injection Supplies',
                description: 'Single-use 1mL syringe with safety cap',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQwIDEySDI0VjQwSDQwVjEyWiIgZmlsbD0iIzAwRDRGRiIvPgo8cGF0aCBkPSJNMzIgNDBWNTIiIHN0cm9rZT0iIzAwRDRGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iOCIgcj0iNCIgZmlsbD0iIzAwRDRGRiIvPgo8L3N2Zz4K',
                stock: 150,
                maxOrder: 25,
                tags: ['sterile', 'injection', '1ml'],
                ctosIcon: 'injection'
            },
            {
                id: 'syringe-3ml',
                name: '3mL Sterile Syringe',
                category: 'Injection Supplies',
                description: 'Single-use 3mL syringe with safety cap',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQyIDEwSDIyVjQ0SDQyVjEwWiIgZmlsbD0iIzAwRDRGRiIvPgo8cGF0aCBkPSJNMzIgNDRWNTQiIHN0cm9rZT0iIzAwRDRGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iNiIgcj0iNCIgZmlsbD0iIzAwRDRGRiIvPgo8L3N2Zz4K',
                stock: 200,
                maxOrder: 20,
                tags: ['sterile', 'injection', '3ml'],
                ctosIcon: 'injection'
            },
            {
                id: 'needle-25g',
                name: '25G Sterile Needles',
                category: 'Injection Supplies',
                description: '25 gauge sterile needles, individually wrapped',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeDE9IjMyIiB5MT0iOCIgeDI9IjMyIiB5Mj0iNTYiIHN0cm9rZT0iIzAwRDRGRiIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxwYXRoIGQ9Ik0yOCA1NkgzNkwzNCA2MEgzMEwyOCA1NloiIGZpbGw9IiMwMEQ0RkYiLz4KPC9zdmc+Cg==',
                stock: 300,
                maxOrder: 50,
                tags: ['sterile', 'needle', '25gauge'],
                ctosIcon: 'needle'
            },
            {
                id: 'tourniquet',
                name: 'Elastic Tourniquet',
                category: 'Injection Supplies',
                description: 'Reusable elastic tourniquet for safer injection',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjMyIiBjeT0iMzIiIHJ4PSIyNCIgcnk9IjgiIGZpbGw9IiMwMEQ0RkYiLz4KPGVsbGlwc2UgY3g9IjMyIiBjeT0iMzIiIHJ4PSIxNiIgcnk9IjQiIGZpbGw9IiMwMDk5Q0MiLz4KPC9zdmc+Cg==',
                stock: 75,
                maxOrder: 5,
                tags: ['tourniquet', 'safety', 'injection'],
                ctosIcon: 'medical'
            },
            {
                id: 'alcohol-swabs',
                name: 'Alcohol Prep Swabs',
                category: 'Injection Supplies',
                description: '70% isopropyl alcohol prep pads, sterile',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjMDBENEZGIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iYmxhY2siIGZvbnQtc2l6ZT0iMTIiPjcwJTwvdGV4dD4KPC9zdmc+Cg==',
                stock: 500,
                maxOrder: 100,
                tags: ['alcohol', 'sterile', 'prep', 'safety'],
                ctosIcon: 'sanitize'
            },

            // Smoking Supplies
            {
                id: 'crack-pipes',
                name: 'Glass Stem Pipes',
                category: 'Smoking Supplies',
                description: 'Clean glass pipes with screens included',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjMyIiBjeT0iMzIiIHJ4PSIyNCIgcnk9IjQiIGZpbGw9IiMwMEQ0RkYiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIzMiIgcj0iNiIgZmlsbD0iIzAwRDRGRiIvPgo8L3N2Zz4K',
                stock: 100,
                maxOrder: 10,
                tags: ['glass', 'pipe', 'smoking', 'harm-reduction'],
                ctosIcon: 'pipe'
            },
            {
                id: 'brass-screens',
                name: 'Brass Pipe Screens',
                category: 'Smoking Supplies',
                description: 'Small brass screens for pipes, pack of 10',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMTYiIGZpbGw9IiNGRkE1MDAiLz4KPGcgc3Ryb2tlPSIjRkY2QjM1IiBzdHJva2Utd2lkdGg9IjEiPgo8bGluZSB4MT0iMjAiIHkxPSIzMiIgeDI9IjQ0IiB5Mj0iMzIiLz4KPHN5Wj0iMjAiIHgxPSIzMiIgeDI9IjMyIiB5Mj0iNDQiLz4KPC9nPgo8L3N2Zz4K',
                stock: 250,
                maxOrder: 25,
                tags: ['brass', 'screen', 'filter', 'smoking'],
                ctosIcon: 'filter'
            },
            {
                id: 'mouthpieces',
                name: 'Disposable Mouthpieces',
                category: 'Smoking Supplies',
                description: 'Individual silicone mouthpieces for sharing safety',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjMyIiBjeT0iMzIiIHJ4PSIyMCIgcnk9IjEwIiBmaWxsPSIjMDBENEZGIi8+CjxlbGxpcHNlIGN4PSIzMiIgY3k9IjMyIiByeD0iMTIiIHJ5PSI2IiBmaWxsPSIjMDA5OUNDIi8+Cjwvc3ZnPgo=',
                stock: 200,
                maxOrder: 50,
                tags: ['mouthpiece', 'silicone', 'safety', 'sharing'],
                ctosIcon: 'protection'
            },

            // Safety Equipment
            {
                id: 'naloxone-kit',
                name: 'Naloxone Emergency Kit',
                category: 'Safety Equipment',
                description: 'Life-saving naloxone kit with instructions',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTIiIHk9IjEyIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSI0IiBmaWxsPSIjRkYzMzY2Ii8+Cjxwb2x5Z29uIHBvaW50cz0iMzIsOCAzOCwyMCAyNiwyMCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMjkiIHk9IjI0IiB3aWR0aD0iNiIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
                stock: 50,
                maxOrder: 3,
                tags: ['naloxone', 'emergency', 'overdose', 'life-saving'],
                ctosIcon: 'emergency',
                priority: 'high'
            },
            {
                id: 'latex-gloves',
                name: 'Latex-Free Gloves',
                category: 'Safety Equipment',
                description: 'Nitrile gloves, powder-free, box of 100',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIwSDQ0VjQ4SDIwVjIwWiIgZmlsbD0iIzAwRDRGRiIvPgo8cGF0aCBkPSJNMjQgMTZIMjhWMjBIMjRWMTZaIiBmaWxsPSIjMDBENEZGIi8+CjxwYXRoIGQ9Ik0zMiAxNkgzNlYyMEgzMlYxNloiIGZpbGw9IiMwMEQ0RkYiLz4KPHBhdGggZD0iTTQwIDE2SDQ0VjIwSDQwVjE2WiIgZmlsbD0iIzAwRDRGRiIvPgo8L3N2Zz4K',
                stock: 80,
                maxOrder: 5,
                tags: ['gloves', 'nitrile', 'safety', 'protection'],
                ctosIcon: 'protection'
            },

            // Testing Supplies
            {
                id: 'fentanyl-strips',
                name: 'Fentanyl Test Strips',
                category: 'Testing Supplies',
                description: 'Rapid fentanyl detection strips, pack of 10',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMjAiIHk9IjEyIiB3aWR0aD0iMjQiIGhlaWdodD0iNDAiIHJ4PSIyIiBmaWxsPSIjRkZBQTAwIi8+CjxsaW5lIHgxPSIyNCIgeTE9IjIwIiB4Mj0iNDAiIHkyPSIyMCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxsaW5lIHgxPSIyNCIgeTE9IjI4IiB4Mj0iNDAiIHkyPSIyOCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=',
                stock: 120,
                maxOrder: 10,
                tags: ['fentanyl', 'test', 'strips', 'safety', 'detection'],
                ctosIcon: 'scan',
                priority: 'high'
            },

            // First Aid
            {
                id: 'bandages',
                name: 'Sterile Bandages',
                category: 'First Aid',
                description: 'Assorted sterile adhesive bandages',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTYiIHk9IjI4IiB3aWR0aD0iMzIiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9IiMwMEQ0RkYiLz4KPHJlY3QgeD0iMjgiIHk9IjE2IiB3aWR0aD0iOCIgaGVpZ2h0PSIzMiIgcng9IjQiIGZpbGw9IiMwMEQ0RkYiLz4KPC9zdmc+Cg==',
                stock: 200,
                maxOrder: 30,
                tags: ['bandage', 'sterile', 'first-aid', 'wound-care'],
                ctosIcon: 'medical'
            },

            // General Supplies
            {
                id: 'sharps-container',
                name: 'Sharps Disposal Container',
                category: 'General Supplies',
                description: 'Safe disposal container for used needles',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjRkYzMzY2Ii8+CjxwYXRoIGQ9Ik0yOCAyOEgzNkwzNCAzNkgzMEwyOCAyOFoiIGZpbGw9InllbGxvdyIvPgo8L3N2Zz4K',
                stock: 25,
                maxOrder: 2,
                tags: ['sharps', 'disposal', 'safety', 'container'],
                ctosIcon: 'container'
            }
        ];
    }

    setupEventListeners() {
        // Will be called when the supplies page is loaded
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="view-supplies"]')) {
                this.renderSuppliesPage();
            }
        });
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('supplyCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    saveCartToStorage() {
        localStorage.setItem('supplyCart', JSON.stringify(this.cart));
    }

    renderSuppliesPage() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        // Hide all other page content
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });

        // Create or get supplies page
        let suppliesPage = document.getElementById('suppliesPage');
        if (!suppliesPage) {
            suppliesPage = document.createElement('div');
            suppliesPage.id = 'suppliesPage';
            suppliesPage.className = 'page-content';
            mainContent.appendChild(suppliesPage);
        }

        suppliesPage.innerHTML = this.generateSuppliesHTML();
        suppliesPage.classList.add('active');

        // Setup page-specific event listeners
        this.setupSuppliesPageListeners();

        // Add CTOS-style animations
        this.initializeCTOSEffects();
    }

    generateSuppliesHTML() {
        return `
            <div class="supplies-interface">
                <!-- CTOS-Style Header -->
                <div class="ctos-header">
                    <div class="container-fluid">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <h1 class="ctos-title">
                                    <span class="ctos-icon">◉</span>
                                    HARM REDUCTION SUPPLY NETWORK
                                    <span class="ctos-status">ONLINE</span>
                                </h1>
                                <div class="ctos-subtitle">Secure Supply Distribution Protocol</div>
                            </div>
                            <div class="col-md-6 text-end">
                                <div class="ctos-stats">
                                    <div class="stat-item">
                                        <span class="stat-value">${this.getAvailableItems()}</span>
                                        <span class="stat-label">Items Available</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-value">${this.cart.length}</span>
                                        <span class="stat-label">Cart Items</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Control Panel -->
                <div class="ctos-control-panel">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="search-interface">
                                    <div class="search-container">
                                        <input type="text" id="supplySearch" placeholder="SEARCH SUPPLIES..." class="ctos-search">
                                        <button class="search-scan-btn" id="scanBtn">
                                            <i class="fas fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="category-filters">
                                    <button class="filter-btn active" data-category="all">ALL SUPPLIES</button>
                                    ${this.categories.map(cat => 
                                        `<button class="filter-btn" data-category="${cat}">${cat.toUpperCase()}</button>`
                                    ).join('')}
                                </div>
                            </div>
                            <div class="col-md-4 text-end">
                                <button class="ctos-btn cart-btn" id="viewCartBtn">
                                    <i class="fas fa-shopping-cart"></i>
                                    VIEW CART (${this.cart.length})
                                </button>
                                <button class="ctos-btn emergency-order-btn" id="emergencyOrderBtn">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    EMERGENCY ORDER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Supply Grid -->
                <div class="container-fluid mt-4">
                    <div class="supply-grid" id="supplyGrid">
                        ${this.renderSupplyItems()}
                    </div>
                </div>

                <!-- Cart Sidebar -->
                <div class="cart-sidebar" id="cartSidebar">
                    <div class="cart-header">
                        <h3>SUPPLY CART</h3>
                        <button class="close-cart" id="closeCartBtn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cart-content">
                        ${this.renderCartItems()}
                    </div>
                    <div class="cart-footer">
                        <button class="ctos-btn submit-order-btn" id="submitOrderBtn">
                            <i class="fas fa-paper-plane"></i>
                            SUBMIT ORDER
                        </button>
                    </div>
                </div>

                <!-- Supply Details Modal -->
                <div class="supply-modal" id="supplyModal">
                    <div class="supply-modal-content">
                        <!-- Modal content will be dynamically populated -->
                    </div>
                </div>
            </div>

            <style>
                .supplies-interface {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                    color: var(--text-primary);
                    position: relative;
                    overflow-x: hidden;
                }

                .ctos-header {
                    background: rgba(0, 0, 0, 0.9);
                    border-bottom: 2px solid var(--accent-primary);
                    padding: 1.5rem 0;
                    position: relative;
                }

                .ctos-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
                    opacity: 0.1;
                    animation: scan 3s ease-in-out infinite;
                }

                .ctos-title {
                    font-family: var(--primary-font);
                    font-size: 1.8rem;
                    font-weight: 900;
                    color: var(--accent-primary);
                    text-shadow: 0 0 20px var(--accent-primary);
                    margin: 0;
                }

                .ctos-icon {
                    color: var(--secondary-color);
                    margin-right: 1rem;
                    animation: pulse 2s infinite;
                }

                .ctos-status {
                    font-size: 0.8rem;
                    background: var(--success-color);
                    color: black;
                    padding: 0.2rem 0.5rem;
                    margin-left: 1rem;
                    border-radius: 3px;
                }

                .ctos-subtitle {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .ctos-stats {
                    display: flex;
                    gap: 2rem;
                    justify-content: flex-end;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    display: block;
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--accent-primary);
                    text-shadow: 0 0 15px var(--accent-primary);
                }

                .stat-label {
                    display: block;
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-transform: uppercase;
                }

                .ctos-control-panel {
                    background: rgba(0, 212, 255, 0.05);
                    border-bottom: 1px solid var(--border-color);
                    padding: 1.5rem 0;
                }

                .search-container {
                    position: relative;
                    margin-bottom: 1rem;
                }

                .ctos-search {
                    width: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid var(--accent-primary);
                    color: var(--text-primary);
                    padding: 0.75rem 1rem;
                    font-family: var(--primary-font);
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .ctos-search::placeholder {
                    color: var(--text-muted);
                }

                .ctos-search:focus {
                    outline: none;
                    box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
                }

                .search-scan-btn {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--accent-primary);
                    border: none;
                    color: black;
                    padding: 0.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .search-scan-btn:hover {
                    background: var(--secondary-color);
                    box-shadow: 0 0 15px var(--secondary-color);
                }

                .category-filters {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    background: rgba(0, 0, 0, 0.8);
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: var(--primary-font);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .filter-btn:hover,
                .filter-btn.active {
                    background: rgba(0, 212, 255, 0.2);
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .ctos-btn {
                    background: linear-gradient(45deg, var(--accent-primary), var(--secondary-color));
                    border: 2px solid var(--accent-primary);
                    color: black;
                    padding: 0.75rem 1.5rem;
                    font-family: var(--primary-font);
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-left: 0.5rem;
                }

                .ctos-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(0, 212, 255, 0.4);
                }

                .emergency-order-btn {
                    background: linear-gradient(45deg, var(--danger-color), #ff6b35);
                    border-color: var(--danger-color);
                    animation: pulse 2s infinite;
                }

                .supply-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 2rem 0;
                }

                .supply-item {
                    background: rgba(0, 0, 0, 0.8);
                    border: 2px solid transparent;
                    border-radius: 8px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .supply-item:hover {
                    border-color: var(--accent-primary);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
                }

                .supply-item::before {
                    content: '';
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    background: linear-gradient(45deg, var(--accent-primary), var(--secondary-color));
                    z-index: -1;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .supply-item:hover::before {
                    opacity: 0.1;
                }

                .supply-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .supply-image {
                    width: 64px;
                    height: 64px;
                    background: var(--accent-primary);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .supply-priority {
                    background: var(--danger-color);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 3px;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    font-weight: bold;
                }

                .supply-name {
                    font-family: var(--primary-font);
                    font-size: 1.2rem;
                    color: var(--accent-primary);
                    margin-bottom: 0.5rem;
                }

                .supply-category {
                    color: var(--text-muted);
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }

                .supply-description {
                    color: var(--text-secondary);
                    line-height: 1.4;
                    margin-bottom: 1rem;
                }

                .supply-stats {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding: 0.5rem;
                    background: rgba(0, 212, 255, 0.1);
                    border-radius: 4px;
                }

                .stock-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--success-color);
                }

                .stock-low {
                    color: var(--warning-color);
                }

                .stock-critical {
                    color: var(--danger-color);
                }

                .supply-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .action-btn {
                    flex: 1;
                    background: rgba(0, 212, 255, 0.1);
                    border: 1px solid var(--accent-primary);
                    color: var(--accent-primary);
                    padding: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    font-weight: bold;
                }

                .action-btn:hover {
                    background: rgba(0, 212, 255, 0.2);
                    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
                }

                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    border-left: 2px solid var(--accent-primary);
                    backdrop-filter: blur(20px);
                    transition: right 0.3s ease;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                }

                .cart-sidebar.active {
                    right: 0;
                }

                .cart-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .cart-header h3 {
                    margin: 0;
                    color: var(--accent-primary);
                    font-family: var(--primary-font);
                }

                .close-cart {
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .close-cart:hover {
                    color: var(--accent-primary);
                }

                .cart-content {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                }

                .cart-footer {
                    padding: 1.5rem;
                    border-top: 1px solid var(--border-color);
                }

                .submit-order-btn {
                    width: 100%;
                    margin: 0;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .ctos-stats {
                        justify-content: center;
                        margin-top: 1rem;
                    }
                    
                    .supply-grid {
                        grid-template-columns: 1fr;
                        gap: 1rem;
                    }
                    
                    .cart-sidebar {
                        width: 100%;
                        right: -100%;
                    }
                    
                    .category-filters {
                        justify-content: center;
                    }
                    
                    .filter-btn {
                        font-size: 0.7rem;
                        padding: 0.4rem 0.8rem;
                    }
                }
            </style>
        `;
    }

    renderSupplyItems() {
        const filteredSupplies = this.getFilteredSupplies();
        
        return filteredSupplies.map(supply => {
            const stockLevel = this.getStockLevel(supply.stock);
            const stockClass = stockLevel === 'low' ? 'stock-low' : stockLevel === 'critical' ? 'stock-critical' : '';
            
            return `
                <div class="supply-item animate-fade-in" data-supply-id="${supply.id}">
                    <div class="supply-header">
                        <div>
                            ${supply.priority === 'high' ? '<span class="supply-priority">High Priority</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="supply-image">
                        <img src="${supply.image}" alt="${supply.name}" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    
                    <h3 class="supply-name">${supply.name}</h3>
                    <div class="supply-category">${supply.category}</div>
                    <p class="supply-description">${supply.description}</p>
                    
                    <div class="supply-stats">
                        <div class="stock-indicator ${stockClass}">
                            <i class="fas fa-box"></i>
                            <span>Stock: ${supply.stock}</span>
                        </div>
                        <div class="max-order">
                            <span>Max: ${supply.maxOrder}</span>
                        </div>
                    </div>
                    
                    <div class="supply-tags">
                        ${supply.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    </div>
                    
                    <div class="supply-actions">
                        <button class="action-btn" onclick="supplySystem.addToCart('${supply.id}')">
                            <i class="fas fa-plus"></i> ADD TO CART
                        </button>
                        <button class="action-btn" onclick="supplySystem.viewDetails('${supply.id}')">
                            <i class="fas fa-info"></i> DETAILS
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderCartItems() {
        if (this.cart.length === 0) {
            return '<div class="empty-cart">Cart is empty</div>';
        }

        return this.cart.map(item => {
            const supply = this.supplies.find(s => s.id === item.id);
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${supply.name}</h4>
                        <div class="quantity-controls">
                            <button onclick="supplySystem.updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="supplySystem.updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="supplySystem.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');
    }

    setupSuppliesPageListeners() {
        // Search functionality
        const searchInput = document.getElementById('supplySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.updateSupplyGrid();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.getAttribute('data-category');
                this.updateSupplyGrid();
            });
        });

        // Cart functionality
        const viewCartBtn = document.getElementById('viewCartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCartBtn = document.getElementById('closeCartBtn');

        if (viewCartBtn && cartSidebar) {
            viewCartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('active');
            });
        }

        if (closeCartBtn && cartSidebar) {
            closeCartBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }

        // Submit order
        const submitOrderBtn = document.getElementById('submitOrderBtn');
        if (submitOrderBtn) {
            submitOrderBtn.addEventListener('click', () => this.submitOrder());
        }

        // Emergency order
        const emergencyOrderBtn = document.getElementById('emergencyOrderBtn');
        if (emergencyOrderBtn) {
            emergencyOrderBtn.addEventListener('click', () => this.handleEmergencyOrder());
        }
    }

    getFilteredSupplies() {
        return this.supplies.filter(supply => {
            const matchesCategory = this.currentCategory === 'all' || supply.category === this.currentCategory;
            const matchesSearch = this.searchQuery === '' || 
                supply.name.toLowerCase().includes(this.searchQuery) ||
                supply.description.toLowerCase().includes(this.searchQuery) ||
                supply.tags.some(tag => tag.toLowerCase().includes(this.searchQuery));
            
            return matchesCategory && matchesSearch;
        });
    }

    getAvailableItems() {
        return this.supplies.filter(supply => supply.stock > 0).length;
    }

    getStockLevel(stock) {
        if (stock <= 10) return 'critical';
        if (stock <= 30) return 'low';
        return 'normal';
    }

    updateSupplyGrid() {
        const grid = document.getElementById('supplyGrid');
        if (grid) {
            grid.innerHTML = this.renderSupplyItems();
        }
    }

    addToCart(supplyId) {
        const supply = this.supplies.find(s => s.id === supplyId);
        if (!supply) return;

        const existingItem = this.cart.find(item => item.id === supplyId);
        
        if (existingItem) {
            if (existingItem.quantity < supply.maxOrder) {
                existingItem.quantity++;
            } else {
                window.outreachApp.showNotification(`Maximum order quantity reached for ${supply.name}`, 'warning');
                return;
            }
        } else {
            this.cart.push({ id: supplyId, quantity: 1 });
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        window.outreachApp.showNotification(`${supply.name} added to cart`, 'success');
    }

    removeFromCart(supplyId) {
        this.cart = this.cart.filter(item => item.id !== supplyId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartContent();
    }

    updateQuantity(supplyId, change) {
        const item = this.cart.find(item => item.id === supplyId);
        const supply = this.supplies.find(s => s.id === supplyId);
        
        if (item && supply) {
            const newQuantity = item.quantity + change;
            
            if (newQuantity <= 0) {
                this.removeFromCart(supplyId);
            } else if (newQuantity <= supply.maxOrder) {
                item.quantity = newQuantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
                this.updateCartContent();
            } else {
                window.outreachApp.showNotification(`Maximum order quantity is ${supply.maxOrder}`, 'warning');
            }
        }
    }

    updateCartDisplay() {
        const cartBtn = document.getElementById('viewCartBtn');
        if (cartBtn) {
            cartBtn.innerHTML = `<i class="fas fa-shopping-cart"></i> VIEW CART (${this.cart.length})`;
        }
    }

    updateCartContent() {
        const cartContent = document.querySelector('.cart-content');
        if (cartContent) {
            cartContent.innerHTML = this.renderCartItems();
        }
    }

    submitOrder() {
        if (this.cart.length === 0) {
            window.outreachApp.showNotification('Cart is empty', 'warning');
            return;
        }

        // Simulate order submission
        const orderId = 'ORD-' + Date.now();
        
        window.outreachApp.showNotification('Order submitted successfully!', 'success');
        
        // Clear cart
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartContent();
        
        // Close cart sidebar
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
        }

        // Show order confirmation
        setTimeout(() => {
            window.outreachApp.showNotification(`Order ${orderId} is being processed`, 'info');
        }, 2000);
    }

    handleEmergencyOrder() {
        // Priority items for emergency orders
        const emergencyItems = this.supplies.filter(supply => supply.priority === 'high');
        
        if (emergencyItems.length === 0) {
            window.outreachApp.showNotification('No emergency items available', 'warning');
            return;
        }

        // Add emergency items to cart automatically
        emergencyItems.forEach(item => {
            const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
            if (!existingItem) {
                this.cart.push({ id: item.id, quantity: 1 });
            }
        });

        this.saveCartToStorage();
        this.updateCartDisplay();
        
        window.outreachApp.showNotification('Emergency supplies added to cart!', 'success');
        
        // Open cart automatically
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
        }
    }

    viewDetails(supplyId) {
        const supply = this.supplies.find(s => s.id === supplyId);
        if (!supply) return;

        // Show detailed modal (implementation would go here)
        window.outreachApp.showNotification(`Viewing details for ${supply.name}`, 'info');
    }

    initializeCTOSEffects() {
        // Add Watch Dogs CTOS-style visual effects
        this.addScanLines();
        this.addGlitchEffect();
    }

    addScanLines() {
        const header = document.querySelector('.ctos-header');
        if (header) {
            const scanLine = document.createElement('div');
            scanLine.className = 'ctos-scan-line';
            scanLine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
                animation: scan 4s ease-in-out infinite;
            `;
            header.appendChild(scanLine);
        }
    }

    addGlitchEffect() {
        // Add subtle glitch effect to title
        const title = document.querySelector('.ctos-title');
        if (title) {
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance every interval
                    title.style.animation = 'glitch 0.3s ease-in-out';
                    setTimeout(() => {
                        title.style.animation = '';
                    }, 300);
                }
            }, 3000);
        }
    }
}

// Initialize the supply system
const supplySystem = new SupplyOrderingSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupplyOrderingSystem;
}