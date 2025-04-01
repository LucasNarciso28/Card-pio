document.addEventListener('DOMContentLoaded', function() {

    // --- Utilities ---
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // --- Data Management Module ---
    const menuData = {
        _rawData: [
             { id: "agua-01", nome: "Água gelada", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTCcrQiAJUipgE7yo5z9mmJre0EcLv-cYaWw&s", descricao: "Água fresquinha...", preco: "R$9.99", info: "LIVRE DE LACTOSE.", tags: ["bebida", "sem-lactose"] },
             { id: "batata-01", nome: "Batata Frita", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOJYRilamYNqM8OKYjvvtUK4uNC1g2fGfXyw&s", descricao: "Porção generosa...", preco: "R$15.00", tags: ["acompanhamento", "vegetariano"] },
             { id: "burger-01", nome: "Hambúrguer Clássico", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyG4HkWXNbsy5FPJyDd8yuoQgpE-Msusu3wQ&s", descricao: "Pão brioche, carne...", preco: "R$25.50", tags: ["principal", "carne"] },
             { id: "agua-02", nome: "Água gelada", imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTCcrQiAJUipgE7yo5z9mmJre0EcLv-cYaWw&s", descricao: "Versão premium.", preco: "R$10.99", info: "LIVRE DE LACTOSE.", tags: ["bebida", "sem-lactose"] },
        ],
        _uniqueItems: [],
        _currentFilter: 'all',

        /** Initializes the data module, processing raw data. */
        init() {
            this._processData();
        },

        _processData() {
            const nomesUnicos = new Set();
            this._uniqueItems = this._rawData.filter(item => {
                if (!nomesUnicos.has(item.nome)) {
                    nomesUnicos.add(item.nome);
                    return true;
                }
                return false;
            });
        },

        /** Sets the current filter tag. */
        setFilter(newFilter) {
            this._currentFilter = newFilter;
        },

        /** Gets the current filter tag. */
        getCurrentFilter() {
            return this._currentFilter;
        },

        /** Gets menu items based on the current filter. */
        getItems() {
            if (this._currentFilter === 'all') {
                return [...this._uniqueItems];
            }
            return this._uniqueItems.filter(item =>
                item.tags && item.tags.includes(this._currentFilter)
            );
        },

         /** Gets a single item by its ID. */
        getItemById(id) {
            return this._uniqueItems.find(item => item.id === id);
        }
    };

    // --- UI Management Module ---
    const menuUI = {
        _container: null,
        _cartCountElement: null,
        _filterControls: null,
        _imageObserver: null,

        /** Initializes the UI module, selects elements and sets up observers. */
        init(selectors) {
            this._container = document.querySelector(selectors.container);
            this._cartCountElement = document.querySelector(selectors.cartCount);
            this._filterControls = document.querySelector(selectors.filterControls);

            if (!this._container || !this._cartCountElement || !this._filterControls) {
                console.error("One or more UI elements not found:", selectors);
                return false;
            }

            this._setupImageObserver();
            return true;
        },

        _setupImageObserver() {
            this._imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                             img.onload = () => img.classList.remove('lazy-image');
                        }
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '0px 0px 100px 0px', // Load images 100px before viewport entry
                threshold: 0.01
            });
        },

        _menuItemTemplate(itemData) {
            const infoHTML = itemData.info ? `<h3 class="info"><em>${itemData.info}</em></h3>` : '';
            return `
                <article class="prato" tabindex="0">
                    <img data-src="${itemData.imagem}" alt="${itemData.nome}" class="lazy-image" width="150" height="150">
                    <div class="item-details">
                        <h2>${itemData.nome}</h2>
                        ${infoHTML}
                        <p class="descricao">${itemData.descricao}</p>
                        <p class="preco">${itemData.preco}</p>
                        <button class="add-to-cart-btn" data-id="${itemData.id}">Adicionar</button>
                    </div>
                </article>
            `;
        },

        /** Renders the provided menu items into the container. */
        renderMenu(items) {
            if (!this._container) return;

            if (this._imageObserver) {
                 this._container.querySelectorAll('.lazy-image').forEach(img => this._imageObserver.unobserve(img));
            }

            this._container.innerHTML = '';

            if (items.length === 0) {
                this._container.innerHTML = '<p>Nenhum item encontrado para esta categoria.</p>';
                return;
            }

            let menuHTML = '';
             items.forEach(item => {
                 menuHTML += this._menuItemTemplate(item);
             });
             this._container.innerHTML = menuHTML;

            this._container.querySelectorAll('.lazy-image').forEach(img => {
                 if(this._imageObserver) {
                    this._imageObserver.observe(img);
                 }
             });
        },

        /** Updates the cart count display. */
        updateCartCount(count) {
            if (!this._cartCountElement) return;
            this._cartCountElement.textContent = count;

            const parent = this._cartCountElement.parentNode;
            parent.classList.remove('updated');
            void parent.offsetWidth;
            parent.classList.add('updated');
        },

        /** Sets the 'active' class on the correct filter button. */
        updateActiveFilterButton(activeFilter) {
            if (!this._filterControls) return;
            const filterButtons = this._filterControls.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === activeFilter) {
                    btn.classList.add('active');
                }
            });
        },

        /** Binds a handler function to filter button clicks. */
        bindFilterClick(handler) {
            if (!this._filterControls) return;
            this._filterControls.addEventListener('click', (event) => {
                if (event.target.classList.contains('filter-btn')) {
                    const selectedFilter = event.target.dataset.filter;
                    handler(selectedFilter);
                }
            });
        },

        /** Binds a handler function to 'Add to Cart' button clicks. */
        bindAddToCartClick(handler) {
            if (!this._container) return;
            this._container.addEventListener('click', (event) => {
                if (event.target.classList.contains('add-to-cart-btn')) {
                    const button = event.target;
                    const itemId = button.dataset.id;
                    handler(itemId, button);
                }
            });
        }
    };

    // --- Application Controller Module ---
    const app = {
        _cartCount: 0,

        /** Initializes the application modules and renders the initial state. */
        init() {
            menuData.init();

            const uiInitialized = menuUI.init({
                container: '#cardapio-container',
                cartCount: '#cart-count',
                filterControls: '#filter-controls'
            });

            if (!uiInitialized) {
                 console.error("App initialization failed: UI elements missing.");
                 return;
            }

            this._renderFilteredMenu();
            menuUI.updateCartCount(this._cartCount);
            menuUI.updateActiveFilterButton(menuData.getCurrentFilter());

            menuUI.bindFilterClick(this._handleFilterChange.bind(this));
            menuUI.bindAddToCartClick(this._handleAddToCart.bind(this));

            console.log("App Initialized");
        },

        _renderFilteredMenu() {
             const items = menuData.getItems();
             menuUI.renderMenu(items);
         },

        _handleFilterChange(newFilter) {
            const currentFilter = menuData.getCurrentFilter();
            if (newFilter !== currentFilter) {
                 menuData.setFilter(newFilter);
                 menuUI.updateActiveFilterButton(newFilter);
                 this._renderFilteredMenu(); // Render immediately on filter change
            }
        },

        _handleAddToCart(itemId, buttonElement) {
            this._cartCount++;
            menuUI.updateCartCount(this._cartCount);

            // Provide visual feedback on the button
            buttonElement.textContent = 'Adicionado!';
            buttonElement.disabled = true;
            setTimeout(() => {
                 buttonElement.textContent = 'Adicionar';
                 buttonElement.disabled = false;
            }, 1500);
        }
    };

    // --- Start the Application ---
    app.init();

});