// OutreachX - Supplies Management System
// Comprehensive harm reduction supplies inventory

class SuppliesSystem {
    constructor() {
        this.cart = [];
        this.currentFilters = {
            search: '',
            category: '',
            availability: ''
        };
        this.currentPage = 0;
        this.itemsPerPage = 12;
        this.allItems = this.generateSupplyInventory();
        this.filteredItems = [...this.allItems];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCartFromStorage();
        this.displayItems();
        this.updateUI();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Search and filters
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value;
            this.applyFilters();
        });

        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        document.getElementById('availabilityFilter').addEventListener('change', (e) => {
            this.currentFilters.availability = e.target.value;
            this.applyFilters();
        });

        // Clear filters
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // Cart actions
        document.getElementById('viewCartBtn').addEventListener('click', () => {
            this.showCartModal();
        });

        document.getElementById('cartFab').addEventListener('click', () => {
            this.showCartModal();
        });

        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.processOrder();
        });

        // Load more
        document.getElementById('loadMoreBtn').addEventListener('click', () => {
            this.loadMoreItems();
        });

        // Emergency panel
        document.getElementById('emergencyFab').addEventListener('click', () => {
            this.toggleEmergencyPanel();
        });

        document.getElementById('closeEmergencyBtn').addEventListener('click', () => {
            this.hideEmergencyPanel();
        });

        // Emergency quick add
        document.addEventListener('click', (e) => {
            if (e.target.closest('.emergency-item-btn')) {
                const itemType = e.target.closest('.emergency-item-btn').dataset.item;
                this.addEmergencyItem(itemType);
            }
        });

        // Item actions (delegated events)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-add-cart')) {
                const itemId = e.target.closest('.supply-item').dataset.itemId;
                this.addToCart(itemId);
            }

            if (e.target.closest('.btn-details')) {
                const itemId = e.target.closest('.supply-item').dataset.itemId;
                this.showItemDetails(itemId);
            }

            if (e.target.closest('.quantity-btn')) {
                const action = e.target.dataset.action;
                const itemId = e.target.closest('.cart-item').dataset.itemId;
                this.updateCartQuantity(itemId, action);
            }

            if (e.target.closest('.remove-item-btn')) {
                const itemId = e.target.closest('.cart-item').dataset.itemId;
                this.removeFromCart(itemId);
            }
        });

        // Search on Enter
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFilters();
            }
        });
    }

    generateSupplyInventory() {
        return [
            // Harm Reduction Supplies
            {
                id: 'naloxone-kit',
                name: 'Naloxone Kit (Narcan)',
                description: 'Life-saving opioid overdose reversal medication. Includes 2 doses and instructions.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 45,
                icon: 'fas fa-syringe',
                imageClass: 'naloxone',
                priority: true,
                details: {
                    contents: '2 doses of naloxone nasal spray',
                    expiration: '2025-12-31',
                    instructions: 'Detailed overdose response guide included',
                    training: 'No training required - instructions provided'
                }
            },
            {
                id: 'fentanyl-strips',
                name: 'Fentanyl Test Strips',
                description: 'Test for fentanyl contamination in substances. Pack of 10 strips with instructions.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 120,
                icon: 'fas fa-vial',
                imageClass: 'test-strips',
                details: {
                    contents: '10 test strips per pack',
                    accuracy: '99%+ accuracy rate',
                    substances: 'Tests cocaine, heroin, methamphetamine, MDMA',
                    results: 'Results in 5 minutes'
                }
            },
            {
                id: 'clean-needles',
                name: 'Sterile Needles & Syringes',
                description: 'Pack of 10 sterile needles and syringes. Various gauges available.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 200,
                icon: 'fas fa-syringe',
                imageClass: 'needles',
                details: {
                    contents: '10 sterile 1ml syringes with needles',
                    gauges: '25G, 27G, 29G available',
                    safety: 'Safety caps included',
                    disposal: 'Disposal container provided'
                }
            },
            {
                id: 'cookers-filters',
                name: 'Cookers & Cotton Filters',
                description: 'Sterile bottle caps for cooking and cotton filters. Pack of 20 each.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 85,
                icon: 'fas fa-flask',
                imageClass: 'needles',
                details: {
                    contents: '20 bottle cap cookers, 20 cotton filters',
                    material: 'Medical grade materials',
                    sterility: 'Individually packaged sterile items',
                    instructions: 'Safe preparation guide included'
                }
            },
            {
                id: 'tourniquets',
                name: 'Disposable Tourniquets',
                description: 'Single-use elastic tourniquets. Pack of 5.',
                category: 'harm-reduction',
                availability: 'low-stock',
                stock: 8,
                icon: 'fas fa-band-aid',
                imageClass: 'needles',
                details: {
                    contents: '5 disposable elastic tourniquets',
                    length: '18 inch length',
                    material: 'Latex-free elastic material',
                    single_use: 'Designed for single use only'
                }
            },

            // Safety Equipment
            {
                id: 'sharps-container',
                name: 'Sharps Disposal Container',
                description: 'Safe disposal container for used needles and syringes. 1 quart capacity.',
                category: 'safety',
                availability: 'in-stock',
                stock: 25,
                icon: 'fas fa-trash-alt',
                imageClass: 'test-strips',
                details: {
                    capacity: '1 quart (32 fl oz)',
                    material: 'Puncture-resistant plastic',
                    closure: 'Permanent locking lid',
                    disposal: 'Return when 3/4 full for safe disposal'
                }
            },
            {
                id: 'gloves',
                name: 'Disposable Gloves',
                description: 'Nitrile examination gloves. Powder-free, latex-free. Box of 100.',
                category: 'safety',
                availability: 'in-stock',
                stock: 50,
                icon: 'fas fa-hand-paper',
                imageClass: 'test-strips',
                details: {
                    quantity: '100 gloves per box (50 pairs)',
                    material: 'Nitrile rubber - latex-free',
                    sizes: 'Small, Medium, Large, X-Large',
                    standards: 'Medical grade, powder-free'
                }
            },
            {
                id: 'face-masks',
                name: 'Disposable Face Masks',
                description: '3-layer disposable face masks for protection. Box of 50.',
                category: 'safety',
                availability: 'in-stock',
                stock: 75,
                icon: 'fas fa-head-side-mask',
                imageClass: 'test-strips',
                details: {
                    quantity: '50 masks per box',
                    layers: '3-layer protection',
                    material: 'Non-woven polypropylene',
                    style: 'Elastic ear loops, adjustable nose bridge'
                }
            },

            // Medical Supplies
            {
                id: 'first-aid-kit',
                name: 'Compact First Aid Kit',
                description: 'Complete first aid kit with bandages, antiseptic, and medical supplies.',
                category: 'medical',
                availability: 'in-stock',
                stock: 15,
                icon: 'fas fa-first-aid',
                imageClass: 'naloxone',
                details: {
                    contents: 'Bandages, gauze, tape, antiseptic wipes',
                    extras: 'Scissors, tweezers, thermometer',
                    case: 'Waterproof carrying case',
                    capacity: 'Treats 1-2 people for minor injuries'
                }
            },
            {
                id: 'bandages',
                name: 'Adhesive Bandages',
                description: 'Assorted adhesive bandages for cuts and scrapes. Pack of 50.',
                category: 'medical',
                availability: 'in-stock',
                stock: 100,
                icon: 'fas fa-band-aid',
                imageClass: 'naloxone',
                details: {
                    quantity: '50 bandages per pack',
                    sizes: 'Assorted sizes for different wounds',
                    material: 'Flexible fabric with adhesive',
                    sterility: 'Individually wrapped sterile bandages'
                }
            },
            {
                id: 'antiseptic-wipes',
                name: 'Antiseptic Wipes',
                description: 'Alcohol-based antiseptic wipes for wound cleaning. Pack of 100.',
                category: 'medical',
                availability: 'in-stock',
                stock: 80,
                icon: 'fas fa-spray-can',
                imageClass: 'test-strips',
                details: {
                    quantity: '100 wipes per pack',
                    active_ingredient: '70% isopropyl alcohol',
                    size: '2" x 2" individual packets',
                    use: 'Wound cleaning and surface disinfection'
                }
            },

            // Hygiene Items
            {
                id: 'soap-bars',
                name: 'Antibacterial Soap Bars',
                description: 'Individual antibacterial soap bars. Pack of 5.',
                category: 'hygiene',
                availability: 'in-stock',
                stock: 60,
                icon: 'fas fa-soap',
                imageClass: 'condoms',
                details: {
                    quantity: '5 soap bars per pack',
                    weight: '3 oz per bar',
                    formula: 'Antibacterial with moisturizers',
                    scent: 'Mild, hypoallergenic fragrance'
                }
            },
            {
                id: 'toothbrush-kit',
                name: 'Travel Toothbrush Kit',
                description: 'Toothbrush with travel-size toothpaste. Individual hygiene kit.',
                category: 'hygiene',
                availability: 'in-stock',
                stock: 90,
                icon: 'fas fa-tooth',
                imageClass: 'condoms',
                details: {
                    contents: 'Soft-bristle toothbrush + 0.85oz toothpaste',
                    toothpaste: 'Fluoride toothpaste for cavity protection',
                    case: 'Protective carrying case included',
                    travel_size: 'TSA compliant size'
                }
            },
            {
                id: 'deodorant',
                name: 'Travel Deodorant',
                description: 'Travel-size antiperspirant deodorant. 1.7 oz stick.',
                category: 'hygiene',
                availability: 'low-stock',
                stock: 12,
                icon: 'fas fa-spray-can',
                imageClass: 'condoms',
                details: {
                    size: '1.7 oz travel stick',
                    type: 'Antiperspirant and deodorant',
                    scent: 'Fresh, unisex scent',
                    duration: '24-hour protection'
                }
            },
            {
                id: 'feminine-hygiene',
                name: 'Feminine Hygiene Kit',
                description: 'Menstrual pads and tampons variety pack with disposal bags.',
                category: 'hygiene',
                availability: 'in-stock',
                stock: 35,
                icon: 'fas fa-venus',
                imageClass: 'condoms',
                details: {
                    contents: '10 pads (various absorbencies), 10 tampons',
                    extras: '5 disposal bags, wet wipes',
                    absorbency: 'Light, regular, and super absorbency',
                    organic: 'Organic cotton materials'
                }
            },

            // Nutrition Support
            {
                id: 'protein-bars',
                name: 'High-Protein Energy Bars',
                description: 'Nutritious energy bars with 20g protein. Pack of 6 bars.',
                category: 'nutrition',
                availability: 'in-stock',
                stock: 40,
                icon: 'fas fa-cookie-bite',
                imageClass: 'condoms',
                details: {
                    quantity: '6 bars per pack',
                    protein: '20g protein per bar',
                    calories: '300 calories per bar',
                    flavors: 'Chocolate chip, peanut butter, berry'
                }
            },
            {
                id: 'electrolyte-packets',
                name: 'Electrolyte Drink Mix',
                description: 'Powder packets to make electrolyte drinks. Pack of 10.',
                category: 'nutrition',
                availability: 'in-stock',
                stock: 70,
                icon: 'fas fa-tint',
                imageClass: 'condoms',
                details: {
                    quantity: '10 powder packets',
                    preparation: 'Mix with 16-20 oz water',
                    electrolytes: 'Sodium, potassium, magnesium',
                    flavors: 'Orange, lemon-lime, berry'
                }
            },
            {
                id: 'multivitamins',
                name: 'Daily Multivitamins',
                description: 'Complete daily multivitamin supplements. 30-day supply.',
                category: 'nutrition',
                availability: 'in-stock',
                stock: 25,
                icon: 'fas fa-pills',
                imageClass: 'naloxone',
                details: {
                    quantity: '30 tablets (30-day supply)',
                    vitamins: 'Complete A-Z vitamin complex',
                    minerals: 'Essential minerals included',
                    dosage: 'One tablet daily with food'
                }
            },

            // Additional Harm Reduction
            {
                id: 'condoms',
                name: 'Latex Condoms',
                description: 'Lubricated latex condoms for safe sex. Pack of 12.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 150,
                icon: 'fas fa-shield-alt',
                imageClass: 'condoms',
                details: {
                    quantity: '12 condoms per pack',
                    material: 'Natural rubber latex',
                    lubrication: 'Pre-lubricated with spermicide',
                    testing: 'Electronically tested for quality'
                }
            },
            {
                id: 'lubricant',
                name: 'Personal Lubricant',
                description: 'Water-based personal lubricant. Individual packets.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 200,
                icon: 'fas fa-tint',
                imageClass: 'condoms',
                details: {
                    quantity: '10 individual packets',
                    type: 'Water-based, long-lasting formula',
                    compatible: 'Safe with latex condoms',
                    ingredients: 'Paraben-free, glycerin-free'
                }
            },
            {
                id: 'crack-pipes',
                name: 'Glass Crack Pipes',
                description: 'Clean glass pipes for safer smoking. Pack of 3 with screens.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 30,
                icon: 'fas fa-smoking',
                imageClass: 'needles',
                details: {
                    quantity: '3 glass pipes per pack',
                    extras: 'Screens and cleaning supplies included',
                    material: 'Borosilicate glass',
                    safety: 'Reduces risk of cuts and infections'
                }
            },
            {
                id: 'alcohol-swabs',
                name: 'Alcohol Prep Swabs',
                description: 'Sterile alcohol preparation swabs. Pack of 100.',
                category: 'harm-reduction',
                availability: 'in-stock',
                stock: 90,
                icon: 'fas fa-circle',
                imageClass: 'test-strips',
                details: {
                    quantity: '100 swabs per pack',
                    concentration: '70% isopropyl alcohol',
                    size: '1" x 1" saturated pads',
                    sterility: 'Individually packaged sterile'
                }
            },

            // Emergency Supplies
            {
                id: 'emergency-blanket',
                name: 'Emergency Thermal Blanket',
                description: 'Reflective emergency blanket for warmth and shelter.',
                category: 'safety',
                availability: 'in-stock',
                stock: 20,
                icon: 'fas fa-fire',
                imageClass: 'test-strips',
                details: {
                    size: '52" x 82" when unfolded',
                    material: 'Reflective metallized polyethylene',
                    weight: 'Lightweight - 2 oz',
                    uses: 'Hypothermia prevention, emergency shelter'
                }
            },
            {
                id: 'flashlight',
                name: 'LED Flashlight',
                description: 'Compact LED flashlight with batteries included.',
                category: 'safety',
                availability: 'low-stock',
                stock: 5,
                icon: 'fas fa-flashlight',
                imageClass: 'test-strips',
                details: {
                    brightness: '100 lumens LED',
                    battery: '2 AA batteries included',
                    runtime: '8+ hours continuous use',
                    durability: 'Water-resistant design'
                }
            }
        ];
    }

    applyFilters() {
        const { search, category, availability } = this.currentFilters;
        
        this.filteredItems = this.allItems.filter(item => {
            const matchesSearch = !search || 
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase());
            
            const matchesCategory = !category || item.category === category;
            
            const matchesAvailability = !availability || item.availability === availability;
            
            return matchesSearch && matchesCategory && matchesAvailability;
        });
        
        this.currentPage = 0;
        this.displayItems();
        this.updateAvailableCount();
    }

    clearFilters() {
        this.currentFilters = { search: '', category: '', availability: '' };
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('availabilityFilter').value = '';
        
        this.filteredItems = [...this.allItems];
        this.currentPage = 0;
        this.displayItems();
        this.updateAvailableCount();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification('Filters cleared', 'info');
        }
    }

    displayItems() {
        const grid = document.getElementById('inventoryGrid');
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const itemsToShow = this.filteredItems.slice(0, endIndex);
        
        if (this.currentPage === 0) {
            grid.innerHTML = '';
        }
        
        itemsToShow.slice(startIndex).forEach(item => {
            const itemElement = this.createItemElement(item);
            grid.appendChild(itemElement);
        });
        
        // Update load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (endIndex >= this.filteredItems.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `supply-item ${item.priority ? 'priority' : ''}`;
        itemDiv.dataset.itemId = item.id;
        
        const isInCart = this.cart.some(cartItem => cartItem.id === item.id);
        const isOutOfStock = item.availability === 'out-of-stock';
        
        itemDiv.innerHTML = `
            <div class="item-image ${item.imageClass}">
                <i class="${item.icon}"></i>
                <div class="item-availability availability-${item.availability}">
                    ${this.getAvailabilityText(item.availability)}
                </div>
            </div>
            <div class="item-content">
                <div class="item-header">
                    <h3 class="item-name">${item.name}</h3>
                    <span class="item-category">${item.category.replace('-', ' ')}</span>
                </div>
                <p class="item-description">${item.description}</p>
                <div class="item-details">
                    <div class="item-detail">
                        <span class="detail-label">Stock</span>
                        <span class="detail-value">${item.stock} units</span>
                    </div>
                    <div class="item-detail">
                        <span class="detail-label">Category</span>
                        <span class="detail-value">${item.category.replace('-', ' ')}</span>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn-add-cart" ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-${isInCart ? 'check' : 'cart-plus'}"></i>
                        <span>${isInCart ? 'In Cart' : (isOutOfStock ? 'Out of Stock' : 'Add to Cart')}</span>
                    </button>
                    <button class="btn-details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            </div>
        `;
        
        return itemDiv;
    }

    getAvailabilityText(availability) {
        const texts = {
            'in-stock': 'In Stock',
            'low-stock': 'Low Stock',
            'out-of-stock': 'Out of Stock'
        };
        return texts[availability] || 'Unknown';
    }

    addToCart(itemId, quantity = 1) {
        const item = this.allItems.find(i => i.id === itemId);
        if (!item || item.availability === 'out-of-stock') return;
        
        const existingCartItem = this.cart.find(cartItem => cartItem.id === itemId);
        
        if (existingCartItem) {
            existingCartItem.quantity += quantity;
        } else {
            this.cart.push({
                ...item,
                quantity: quantity
            });
        }
        
        this.saveCartToStorage();
        this.updateUI();
        this.displayItems(); // Refresh to show updated "In Cart" status
        
        // Visual feedback
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
        if (itemElement) {
            itemElement.classList.add('item-added-animation');
            setTimeout(() => {
                itemElement.classList.remove('item-added-animation');
            }, 600);
        }
        
        // Cart fab animation
        const cartFab = document.getElementById('cartFab');
        if (cartFab) {
            cartFab.classList.add('cart-bounce');
            setTimeout(() => {
                cartFab.classList.remove('cart-bounce');
            }, 500);
        }
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(`${item.name} added to cart`, 'success');
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateUI();
        this.displayItems();
        this.updateCartModal();
        
        const item = this.allItems.find(i => i.id === itemId);
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification(`${item.name} removed from cart`, 'info');
        }
    }

    updateCartQuantity(itemId, action) {
        const cartItem = this.cart.find(item => item.id === itemId);
        if (!cartItem) return;
        
        if (action === 'increase') {
            cartItem.quantity++;
        } else if (action === 'decrease') {
            cartItem.quantity--;
            if (cartItem.quantity <= 0) {
                this.removeFromCart(itemId);
                return;
            }
        }
        
        this.saveCartToStorage();
        this.updateUI();
        this.updateCartModal();
    }

    addEmergencyItem(itemType) {
        const emergencyItems = {
            'naloxone': 'naloxone-kit',
            'test-strips': 'fentanyl-strips',
            'first-aid': 'first-aid-kit'
        };
        
        const itemId = emergencyItems[itemType];
        if (itemId) {
            this.addToCart(itemId);
            this.hideEmergencyPanel();
        }
    }

    showCartModal() {
        this.updateCartModal();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    }

    updateCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartTotalItems = document.getElementById('cartTotalItems');
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (this.cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
            checkoutBtn.disabled = true;
            cartTotalItems.textContent = '0';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            checkoutBtn.disabled = false;
            
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotalItems.textContent = totalItems;
            
            cartItems.innerHTML = this.cart.map(item => this.createCartItemElement(item)).join('');
        }
    }

    createCartItemElement(item) {
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <i class="${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-category">${item.category.replace('-', ' ')}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-item-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    showItemDetails(itemId) {
        const item = this.allItems.find(i => i.id === itemId);
        if (!item) return;
        
        const modal = document.getElementById('itemModal');
        const title = document.getElementById('itemModalTitle');
        const body = document.getElementById('itemModalBody');
        const addBtn = document.getElementById('addToCartFromModal');
        
        title.textContent = item.name;
        addBtn.dataset.itemId = itemId;
        
        body.innerHTML = `
            <div class="item-details-modal">
                <div class="modal-item-image ${item.imageClass}">
                    <i class="${item.icon}"></i>
                </div>
                <div class="modal-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-description-full">${item.description}</p>
                    
                    <div class="item-specifications">
                        <h5>Specifications</h5>
                        ${Object.entries(item.details).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key.replace(/_/g, ' ').toUpperCase()}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="item-availability-info">
                        <div class="availability-status availability-${item.availability}">
                            ${this.getAvailabilityText(item.availability)} (${item.stock} units)
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Handle add to cart from modal
        addBtn.onclick = () => {
            this.addToCart(itemId);
            bootstrap.Modal.getInstance(modal).hide();
        };
        
        const itemModal = new bootstrap.Modal(modal);
        itemModal.show();
    }

    processOrder() {
        if (this.cart.length === 0) return;
        
        // Generate order ID
        const orderId = `#ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        
        // Calculate pickup time (next day, 2 PM)
        const pickupDate = new Date();
        pickupDate.setDate(pickupDate.getDate() + 1);
        pickupDate.setHours(14, 0, 0, 0);
        const pickupTime = pickupDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
        
        // Update order modal
        document.getElementById('orderIdDisplay').textContent = orderId;
        document.getElementById('pickupTimeDisplay').textContent = pickupTime;
        
        // Clear cart
        this.cart = [];
        this.saveCartToStorage();
        this.updateUI();
        
        // Close cart modal and show confirmation
        bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
        
        setTimeout(() => {
            const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
            orderModal.show();
        }, 500);
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification('Order placed successfully!', 'success');
        }
    }

    loadMoreItems() {
        this.currentPage++;
        this.displayItems();
        
        if (typeof outreachX !== 'undefined') {
            outreachX.showNotification('More items loaded', 'info');
        }
    }

    toggleEmergencyPanel() {
        const panel = document.getElementById('emergencyPanel');
        panel.classList.toggle('show');
    }

    hideEmergencyPanel() {
        const panel = document.getElementById('emergencyPanel');
        panel.classList.remove('show');
    }

    updateUI() {
        const cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update all cart indicators
        document.getElementById('cartCount').textContent = cartCount;
        document.getElementById('cartIndicator').textContent = cartCount;
        document.getElementById('fabCartCount').textContent = cartCount;
        
        // Show/hide fab badge
        const fabBadge = document.querySelector('.fab-badge');
        if (fabBadge) {
            fabBadge.style.display = cartCount > 0 ? 'flex' : 'none';
        }
    }

    updateAvailableCount() {
        document.getElementById('availableCount').textContent = this.filteredItems.length;
    }

    saveCartToStorage() {
        localStorage.setItem('outreachx_cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('outreachx_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }
        }, 1500);
    }

    // Public API
    getCart() {
        return [...this.cart];
    }

    getInventory() {
        return [...this.allItems];
    }

    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateUI();
        this.displayItems();
    }
}

// Additional CSS for modal item details
const suppliesModalCSS = `
.item-details-modal {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.modal-item-image {
    width: 120px;
    height: 120px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.modal-item-image i {
    font-size: 3rem;
    color: var(--primary-color);
}

.modal-item-info {
    flex: 1;
}

.item-description-full {
    color: var(--text-secondary);
    margin-bottom: 25px;
    line-height: 1.6;
}

.item-specifications h5 {
    color: var(--primary-color);
    font-family: var(--font-primary);
    font-weight: 600;
    margin-bottom: 15px;
    border-bottom: 1px solid var(--border-glow);
    padding-bottom: 8px;
}

.spec-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.spec-item:last-child {
    border-bottom: none;
}

.spec-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    text-transform: capitalize;
}

.spec-value {
    color: var(--text-primary);
    font-weight: 600;
    text-align: right;
}

.item-availability-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--border-glow);
}

@media (max-width: 768px) {
    .item-details-modal {
        flex-direction: column;
        text-align: center;
    }
    
    .modal-item-image {
        margin: 0 auto;
    }
    
    .spec-item {
        flex-direction: column;
        gap: 5px;
        text-align: center;
    }
    
    .spec-value {
        text-align: center;
    }
}
`;

// Inject supplies modal CSS
const suppliesModalStyleSheet = document.createElement('style');
suppliesModalStyleSheet.textContent = suppliesModalCSS;
document.head.appendChild(suppliesModalStyleSheet);

// Initialize supplies system
let suppliesSystem;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        suppliesSystem = new SuppliesSystem();
    });
} else {
    suppliesSystem = new SuppliesSystem();
}

// Global functions for supplies
function getSuppliesCart() {
    return suppliesSystem ? suppliesSystem.getCart() : [];
}

function clearSuppliesCart() {
    if (suppliesSystem) {
        suppliesSystem.clearCart();
    }
}

function logout() {
    if (typeof authSystem !== 'undefined') {
        authSystem.logout();
    } else {
        window.location.href = 'index.html';
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuppliesSystem;
}