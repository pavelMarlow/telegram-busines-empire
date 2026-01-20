class IdleBusinessGame {
    constructor() {
        this.cash = 100;
        this.totalTaps = 0;
        this.tapsPerSecond = 0;
        this.lastTapTime = Date.now();
        this.lastUpdateTime = Date.now();
        this.offlineEarnings = 0;
        this.totalNetWorth = 100;
        
        // Игровые данные
        this.businesses = [
            {
                id: 1,
                name: "Ларёк",
                icon: "🏪",
                basePrice: 1000,
                price: 1000,
                count: 0,
                income: 10,
                multiplier: 1.15,
                upgradeCost: 5000,
                level: 1
            },
            {
                id: 2,
                name: "Кофейня",
                icon: "☕",
                basePrice: 5000,
                price: 5000,
                count: 0,
                income: 50,
                multiplier: 1.15,
                upgradeCost: 25000,
                level: 1
            },
            {
                id: 3,
                name: "IT Компания",
                icon: "💻",
                basePrice: 25000,
                price: 25000,
                count: 0,
                income: 250,
                multiplier: 1.15,
                upgradeCost: 100000,
                level: 1
            },
            {
                id: 4,
                name: "Завод",
                icon: "🏭",
                basePrice: 100000,
                price: 100000,
                count: 0,
                income: 1000,
                multiplier: 1.15,
                upgradeCost: 500000,
                level: 1
            },
            {
                id: 5,
                name: "Корпорация",
                icon: "🏢",
                basePrice: 500000,
                price: 500000,
                count: 0,
                income: 5000,
                multiplier: 1.15,
                upgradeCost: 2500000,
                level: 1
            }
        ];
        
        this.investments = [
            { id: 1, name: "Акции Tesla", icon: "📈", price: 1000, count: 0, volatility: 0.05 },
            { id: 2, name: "Криптовалюта", icon: "₿", price: 500, count: 0, volatility: 0.1 },
            { id: 3, name: "Облигации", icon: "📊", price: 2000, count: 0, volatility: 0.02 },
            { id: 4, name: "Фонды", icon: "📉", price: 5000, count: 0, volatility: 0.03 }
        ];
        
        this.properties = [
            { id: 1, name: "Квартира", icon: "🏠", price: 50000, count: 0, income: 500 },
            { id: 2, name: "Загородный дом", icon: "🏡", price: 200000, count: 0, income: 2000 },
            { id: 3, name: "Офисное здание", icon: "🏢", price: 1000000, count: 0, income: 10000 },
            { id: 4, name: "Торговый центр", icon: "🛍️", price: 5000000, count: 0, income: 50000 }
        ];
        
        this.assets = [
            { id: 1, name: "Спорткар", icon: "🏎️", price: 100000, count: 0 },
            { id: 2, name: "Яхта", icon: "🛥️", price: 1000000, count: 0 },
            { id: 3, name: "Частный самолёт", icon: "✈️", price: 5000000, count: 0 },
            { id: 4, name: "Редкая картина", icon: "🖼️", price: 10000000, count: 0 }
        ];
        
        this.forbes = [
            { id: 1, name: "Игрок", rank: 1, netWorth: 100, isPlayer: true },
            { id: 2, name: "Илон Маск", rank: 2, netWorth: 200000000000 },
            { id: 3, name: "Бернар Арно", rank: 3, netWorth: 190000000000 },
            { id: 4, name: "Джефф Безос", rank: 4, netWorth: 180000000000 },
            { id: 5, name: "Марк Цукерберг", rank: 5, netWorth: 120000000000 }
        ];
        
        this.tg = null;
        this.initTelegram();
        this.initGame();
        this.setupEventListeners();
        this.loadGame();
        this.startGameLoop();
    }
    
    initTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            this.tg.expand();
            this.tg.ready();
            
            // Устанавливаем тему
            const theme = this.tg.colorScheme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // Слушаем изменение темы
            this.tg.onEvent('themeChanged', () => {
                const newTheme = this.tg.colorScheme;
                document.documentElement.setAttribute('data-theme', newTheme);
            });
        }
    }
    
    initGame() {
        this.updateDisplay();
        this.renderTab('businesses');
    }
    
    setupEventListeners() {
        // Кнопка подписки
        document.getElementById('subscribeBtn').addEventListener('click', () => {
            window.open('https://t.me/aiforproduct', '_blank');
            this.showNotification('Спасибо за подписку!');
        });
        
        // Кнопка тапа
        const tapButton = document.getElementById('tapButton');
        tapButton.addEventListener('click', (e) => this.handleTap(e));
        tapButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTap(e);
        });
        
        // Навигация по вкладкам
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTab(btn.dataset.tab);
            });
        });
    }
    
    handleTap(event) {
        const tapValue = 100;
        this.cash += tapValue;
        this.totalTaps++;
        
        // Обновляем TPS
        const now = Date.now();
        const timeDiff = now - this.lastTapTime;
        this.tapsPerSecond = Math.min(1000, Math.floor(1000 / timeDiff));
        this.lastTapTime = now;
        
        // Создаем анимацию монеты
        this.createCoinAnimation(event);
        
        // Обновляем отображение
        this.updateDisplay();
        this.showNotification(`+$${tapValue}`);
        
        // Сохраняем игру
        this.saveGame();
    }
    
    createCoinAnimation(event) {
        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.innerHTML = '💰';
        coin.style.left = `${event.clientX || event.touches[0].clientX}px`;
        coin.style.top = `${event.clientY || event.touches[0].clientY}px`;
        document.body.appendChild(coin);
        
        setTimeout(() => coin.remove(), 1000);
    }
    
    buyBusiness(id) {
        const business = this.businesses.find(b => b.id === id);
        if (this.cash >= business.price) {
            this.cash -= business.price;
            business.count++;
            business.price = Math.floor(business.basePrice * Math.pow(business.multiplier, business.count));
            
            this.updateDisplay();
            this.renderTab('businesses');
            this.showNotification(`Куплен ${business.name}`);
            this.saveGame();
        } else {
            this.showNotification('Недостаточно денег!', 'error');
        }
    }
    
    upgradeBusiness(id) {
        const business = this.businesses.find(b => b.id === id);
        if (this.cash >= business.upgradeCost) {
            this.cash -= business.upgradeCost;
            business.level++;
            business.income = Math.floor(business.income * 1.5);
            business.upgradeCost = Math.floor(business.upgradeCost * 2.5);
            
            this.updateDisplay();
            this.renderTab('businesses');
            this.showNotification(`${business.name} улучшен до уровня ${business.level}`);
            this.saveGame();
        } else {
            this.showNotification('Недостаточно денег для улучшения!', 'error');
        }
    }
    
    buyInvestment(id) {
        const investment = this.investments.find(i => i.id === id);
        if (this.cash >= investment.price) {
            this.cash -= investment.price;
            investment.count++;
            
            // Обновляем цену с волатильностью
            investment.price = Math.floor(investment.price * (1 + (Math.random() - 0.5) * investment.volatility));
            
            this.updateDisplay();
            this.renderTab('investments');
            this.showNotification(`Куплены ${investment.name}`);
            this.saveGame();
        }
    }
    
    buyProperty(id) {
        const property = this.properties.find(p => p.id === id);
        if (this.cash >= property.price) {
            this.cash -= property.price;
            property.count++;
            
            this.updateDisplay();
            this.renderTab('properties');
            this.showNotification(`Куплена ${property.name}`);
            this.saveGame();
        }
    }
    
    buyAsset(id) {
        const asset = this.assets.find(a => a.id === id);
        if (this.cash >= asset.price) {
            this.cash -= asset.price;
            asset.count++;
            
            this.updateDisplay();
            this.renderTab('assets');
            this.showNotification(`Куплен ${asset.name}`);
            this.saveGame();
        }
    }
    
    calculateIncome() {
        let income = 0;
        
        // Доход от бизнесов
        this.businesses.forEach(b => {
            income += b.count * b.income * b.level;
        });
        
        // Доход от недвижимости
        this.properties.forEach(p => {
            income += p.count * p.income;
        });
        
        return income;
    }
    
    calculateNetWorth() {
        let netWorth = this.cash;
        
        // Стоимость бизнесов
        this.businesses.forEach(b => {
            netWorth += b.count * b.price * 0.5; // 50% от стоимости
            netWorth += b.level * b.upgradeCost * 0.3; // 30% от стоимости улучшений
        });
        
        // Стоимость инвестиций
        this.investments.forEach(i => {
            netWorth += i.count * i.price;
        });
        
        // Стоимость недвижимости
        this.properties.forEach(p => {
            netWorth += p.count * p.price;
        });
        
        // Стоимость активов
        this.assets.forEach(a => {
            netWorth += a.count * a.price;
        });
        
        this.totalNetWorth = Math.floor(netWorth);
        return this.totalNetWorth;
    }
    
    updateDisplay() {
        document.getElementById('cash').textContent = `$${this.formatNumber(this.cash)}`;
        document.getElementById('tapsPerSecond').textContent = this.tapsPerSecond;
        document.getElementById('totalTaps').textContent = this.formatNumber(this.totalTaps);
        
        const netWorth = this.calculateNetWorth();
        document.getElementById('netWorth').textContent = `$${this.formatNumber(netWorth)}`;
        
        // Обновляем позицию в Forbes
        this.forbes[0].netWorth = netWorth;
        this.forbes.sort((a, b) => b.netWorth - a.netWorth);
        this.forbes.forEach((item, index) => {
            item.rank = index + 1;
        });
    }
    
    renderTab(tabName) {
        const container = document.getElementById('tabContent');
        
        switch(tabName) {
            case 'businesses':
                container.innerHTML = this.renderBusinesses();
                this.setupBusinessEvents();
                break;
            case 'investments':
                container.innerHTML = this.renderInvestments();
                this.setupInvestmentEvents();
                break;
            case 'properties':
                container.innerHTML = this.renderProperties();
                this.setupPropertyEvents();
                break;
            case 'assets':
                container.innerHTML = this.renderAssets();
                this.setupAssetEvents();
                break;
            case 'forbes':
                container.innerHTML = this.renderForbes();
                break;
        }
    }
    
    renderBusinesses() {
        return `
            <div class="item-grid">
                ${this.businesses.map(business => `
                    <div class="item-card">
                        <div class="item-header">
                            <div class="item-name">
                                ${business.icon} ${business.name}
                                <span class="item-count">${business.count}</span>
                            </div>
                            <div class="item-level">Ур. ${business.level}</div>
                        </div>
                        <div class="item-income">Доход: $${this.formatNumber(business.income * business.level)}/сек</div>
                        <div class="item-price">Цена: $${this.formatNumber(business.price)}</div>
                        <button class="buy-btn" data-id="${business.id}" ${this.cash < business.price ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i>
                            Купить ($${this.formatNumber(business.price)})
                        </button>
                        <button class="upgrade-btn" data-id="${business.id}" ${this.cash < business.upgradeCost ? 'disabled' : ''}>
                            <i class="fas fa-arrow-up"></i>
                            Улучшить за $${this.formatNumber(business.upgradeCost)}
                        </button>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${Math.min(100, (business.count / 10) * 100)}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>Общий доход в секунду:</span>
                    <strong style="color: var(--success-color); font-size: 18px;">
                        $${this.formatNumber(this.calculateIncome())}
                    </strong>
                </div>
            </div>
        `;
    }
    
    renderInvestments() {
        return `
            <div class="item-grid">
                ${this.investments.map(inv => `
                    <div class="item-card">
                        <div class="item-header">
                            <div class="item-name">
                                ${inv.icon} ${inv.name}
                                <span class="item-count">${inv.count}</span>
                            </div>
                        </div>
                        <div class="item-price">
                            Цена: $${this.formatNumber(inv.price)}
                            <span style="color: var(${Math.random() > 0.5 ? '--success-color' : '--danger-color'}); font-size: 12px;">
                                ${Math.random() > 0.5 ? '↗' : '↘'}
                            </span>
                        </div>
                        <div style="margin: 8px 0; color: var(--text-secondary); font-size: 12px;">
                            Волатильность: ${(inv.volatility * 100).toFixed(1)}%
                        </div>
                        <button class="buy-btn" data-id="${inv.id}" ${this.cash < inv.price ? 'disabled' : ''}>
                            <i class="fas fa-chart-line"></i>
                            Купить за $${this.formatNumber(inv.price)}
                        </button>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 12px;">
                <div style="text-align: center; color: var(--text-secondary); font-size: 14px;">
                    <i class="fas fa-exclamation-circle"></i>
                    Цены на инвестиции меняются случайным образом
                </div>
            </div>
        `;
    }
    
    renderProperties() {
        return `
            <div class="item-grid">
                ${this.properties.map(prop => `
                    <div class="item-card">
                        <div class="item-header">
                            <div class="item-name">
                                ${prop.icon} ${prop.name}
                                <span class="item-count">${prop.count}</span>
                            </div>
                        </div>
                        <div class="item-income">Доход: $${this.formatNumber(prop.income)}/сек</div>
                        <div class="item-price">Цена: $${this.formatNumber(prop.price)}</div>
                        <button class="buy-btn" data-id="${prop.id}" ${this.cash < prop.price ? 'disabled' : ''}>
                            <i class="fas fa-home"></i>
                            Купить за $${this.formatNumber(prop.price)}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderAssets() {
        return `
            <div class="item-grid">
                ${this.assets.map(asset => `
                    <div class="item-card">
                        <div class="item-header">
                            <div class="item-name">
                                ${asset.icon} ${asset.name}
                                <span class="item-count">${asset.count}</span>
                            </div>
                        </div>
                        <div class="item-price">Цена: $${this.formatNumber(asset.price)}</div>
                        <div style="margin: 8px 0; color: var(--text-secondary); font-size: 12px;">
                            Престижный актив
                        </div>
                        <button class="buy-btn" data-id="${asset.id}" ${this.cash < asset.price ? 'disabled' : ''}>
                            <i class="fas fa-gem"></i>
                            Купить за $${this.formatNumber(asset.price)}
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderForbes() {
        return `
            <div style="overflow-x: auto;">
                <table class="forbes-table">
                    <thead>
                        <tr>
                            <th style="width: 60px;">Ранг</th>
                            <th>Имя</th>
                            <th style="text-align: right;">Состояние</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.forbes.map(person => `
                            <tr ${person.isPlayer ? 'style="background: var(--primary-color); color: white;"' : ''}>
                                <td class="rank position-${person.rank}">#${person.rank}</td>
                                <td>
                                    <strong>${person.name}</strong>
                                    ${person.isPlayer ? '<span style="font-size: 12px; opacity: 0.8;">(Вы)</span>' : ''}
                                </td>
                                <td style="text-align: right; font-weight: 700;">
                                    $${this.formatNumber(person.netWorth)}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 12px; text-align: center;">
                <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">
                    Ваше место в мировом рейтинге миллиардеров
                </div>
                <div style="font-size: 24px; font-weight: 700; color: var(--accent-color);">
                    #${this.forbes.find(p => p.isPlayer)?.rank || 1}
                </div>
            </div>
        `;
    }
    
    setupBusinessEvents() {
        document.querySelectorAll('.buy-btn[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.buyBusiness(id);
            });
        });
        
        document.querySelectorAll('.upgrade-btn[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.upgradeBusiness(id);
            });
        });
    }
    
    setupInvestmentEvents() {
        document.querySelectorAll('.buy-btn[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.buyInvestment(id);
            });
        });
    }
    
    setupPropertyEvents() {
        document.querySelectorAll('.buy-btn[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.buyProperty(id);
            });
        });
    }
    
    setupAssetEvents() {
        document.querySelectorAll('.buy-btn[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                this.buyAsset(id);
            });
        });
    }
    
    startGameLoop() {
        setInterval(() => {
            this.gameTick();
        }, 1000);
        
        // Автосохранение каждые 30 секунд
        setInterval(() => {
            this.saveGame();
        }, 30000);
    }
    
    gameTick() {
        const income = this.calculateIncome();
        this.cash += income;
        
        // Обновляем TPS
        const now = Date.now();
        const timeDiff = now - this.lastTapTime;
        if (timeDiff > 1000) {
            this.tapsPerSecond = Math.max(0, this.tapsPerSecond - 1);
        }
        
        this.updateDisplay();
        
        // Обновляем текущую вкладку
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            this.renderTab(activeTab.dataset.tab);
        }
    }
    
    showNotification(message, type = 'success') {
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.borderLeftColor = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
        notification.textContent = message;
        
        notifications.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return Math.floor(num);
    }
    
    saveGame() {
        const gameData = {
            cash: this.cash,
            totalTaps: this.totalTaps,
            businesses: this.businesses,
            investments: this.investments,
            properties: this.properties,
            assets: this.assets,
            lastSave: Date.now()
        };
        
        localStorage.setItem('idleBusinessGame', JSON.stringify(gameData));
    }
    
    loadGame() {
        const saved = localStorage.getItem('idleBusinessGame');
        if (saved) {
            try {
                const gameData = JSON.parse(saved);
                
                this.cash = gameData.cash || 100;
                this.totalTaps = gameData.totalTaps || 0;
                
                // Загружаем бизнесы
                if (gameData.businesses) {
                    this.businesses = gameData.businesses;
                }
                
                // Загружаем инвестиции
                if (gameData.investments) {
                    this.investments = gameData.investments;
                }
                
                // Загружаем недвижимость
                if (gameData.properties) {
                    this.properties = gameData.properties;
                }
                
                // Загружаем активы
                if (gameData.assets) {
                    this.assets = gameData.assets;
                }
                
                // Рассчитываем офлайн доход
                if (gameData.lastSave) {
                    const offlineTime = Date.now() - gameData.lastSave;
                    const offlineMinutes = Math.floor(offlineTime / 60000);
                    
                    if (offlineMinutes > 0) {
                        const offlineIncome = this.calculateIncome() * offlineMinutes * 60;
                        this.cash += offlineIncome;
                        this.offlineEarnings = offlineIncome;
                        
                        if (offlineIncome > 0) {
                            this.showNotification(`Офлайн доход: $${this.formatNumber(offlineIncome)} за ${offlineMinutes} мин.`);
                        }
                    }
                }
                
                this.updateDisplay();
            } catch (e) {
                console.error('Ошибка загрузки игры:', e);
            }
        }
    }
}

// Запуск игры
window.addEventListener('DOMContentLoaded', () => {
    window.game = new IdleBusinessGame();
});