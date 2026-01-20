class IdleBusinessGame {
    constructor() {
        this.cash = 100;
        this.totalTaps = 0;
        this.tapMultiplier = 1.0;
        this.autoTapsPerSecond = 0;
        this.lastUpdateTime = Date.now();
        this.lastSaveTime = Date.now();
        this.totalNetWorth = 100;
        this.hourlyIncome = 0;
        this.playerName = "Игрок";
        this.playerId = null;
        this.gameVersion = "1.0";
        this.isLoading = true;
        
        // Игровые данные
        this.upgrades = {
            tapBonus: { level: 1, cost: 1000, multiplier: 1.5 },
            autoTap: { level: 0, cost: 5000, tapsPerSecond: 1 },
            businessIncome: { level: 1, cost: 10000, multiplier: 1.2 },
            offlineEarnings: { level: 1, cost: 20000, multiplier: 1.5 }
        };
        
        this.businesses = [
            { id: 1, name: "Ларёк", icon: "🏪", basePrice: 1000, price: 1000, count: 0, incomePerHour: 360, multiplier: 1.15, upgradeCost: 5000, level: 1, managerCost: 50000, hasManager: false },
            { id: 2, name: "Кофейня", icon: "☕", basePrice: 5000, price: 5000, count: 0, incomePerHour: 1800, multiplier: 1.15, upgradeCost: 25000, level: 1, managerCost: 250000, hasManager: false },
            { id: 3, name: "IT Компания", icon: "💻", basePrice: 25000, price: 25000, count: 0, incomePerHour: 9000, multiplier: 1.15, upgradeCost: 100000, level: 1, managerCost: 1000000, hasManager: false },
            { id: 4, name: "Завод", icon: "🏭", basePrice: 100000, price: 100000, count: 0, incomePerHour: 36000, multiplier: 1.15, upgradeCost: 500000, level: 1, managerCost: 5000000, hasManager: false },
            { id: 5, name: "Корпорация", icon: "🏢", basePrice: 500000, price: 500000, count: 0, incomePerHour: 180000, multiplier: 1.15, upgradeCost: 2500000, level: 1, managerCost: 25000000, hasManager: false }
        ];
        
        this.investments = [
            { id: 1, name: "Акции Tesla", icon: "📈", basePrice: 1000, price: 1000, count: 0, volatility: 0.05, lastUpdate: Date.now() },
            { id: 2, name: "Криптовалюта", icon: "₿", basePrice: 500, price: 500, count: 0, volatility: 0.1, lastUpdate: Date.now() },
            { id: 3, name: "Облигации", icon: "📊", basePrice: 2000, price: 2000, count: 0, volatility: 0.02, lastUpdate: Date.now() },
            { id: 4, name: "Золото", icon: "🥇", basePrice: 1500, price: 1500, count: 0, volatility: 0.03, lastUpdate: Date.now() }
        ];
        
        this.properties = [
            { id: 1, name: "Квартира", icon: "🏠", basePrice: 50000, price: 50000, count: 0, incomePerHour: 7200, priceGrowth: 1.01 },
            { id: 2, name: "Загородный дом", icon: "🏡", basePrice: 200000, price: 200000, count: 0, incomePerHour: 36000, priceGrowth: 1.015 },
            { id: 3, name: "Офисное здание", icon: "🏢", basePrice: 1000000, price: 1000000, count: 0, incomePerHour: 180000, priceGrowth: 1.02 },
            { id: 4, name: "Торговый центр", icon: "🛍️", basePrice: 5000000, price: 5000000, count: 0, incomePerHour: 900000, priceGrowth: 1.025 }
        ];
        
        this.assets = [
            { id: 1, name: "Спорткар", icon: "🏎️", basePrice: 100000, price: 100000, count: 0, prestige: 10 },
            { id: 2, name: "Яхта", icon: "🛥️", basePrice: 1000000, price: 1000000, count: 0, prestige: 100 },
            { id: 3, name: "Частный самолёт", icon: "✈️", basePrice: 5000000, price: 5000000, count: 0, prestige: 500 },
            { id: 4, name: "Редкая картина", icon: "🖼️", basePrice: 10000000, price: 10000000, count: 0, prestige: 1000 }
        ];
        
        this.forbes = [];
        
        this.tg = null;
        this.initTelegram();
    }
    
    async init() {
        await this.initTelegram();
        this.initGame();
        this.setupEventListeners();
        await this.loadGame();
        this.startGameLoop();
        this.hideLoading();
    }
    
    async initTelegram() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = Telegram.WebApp;
            
            // Расширяем на весь экран
            this.tg.expand();
            this.tg.ready();
            
            // Получаем данные пользователя
            const user = this.tg.initDataUnsafe?.user;
            if (user) {
                this.playerId = user.id;
                this.playerName = user.username || user.first_name || "Игрок";
            }
            
            // Устанавливаем тему
            const theme = this.tg.colorScheme;
            document.documentElement.setAttribute('data-theme', theme);
            
            // Слушаем изменение темы
            this.tg.onEvent('themeChanged', () => {
                const newTheme = this.tg.colorScheme;
                document.documentElement.setAttribute('data-theme', newTheme);
            });
            
            // Обработка данных от бота
            this.tg.onEvent('webAppDataReceived', (event) => {
                console.log('Data received from bot:', event);
            });
            
            return true;
        }
        return false;
    }
    
    initGame() {
        this.updateDisplay();
        this.renderTab('businesses');
        this.updateSaveTime();
    }
    
    setupEventListeners() {
        // Кнопка подписки
        document.getElementById('subscribeBtn').addEventListener('click', () => {
            window.open('https://t.me/aiforproduct', '_blank');
            this.showNotification('Спасибо за подписку! +$1000 бонус!');
            this.cash += 1000;
            this.updateDisplay();
            this.autoSave();
        });
        
        // Кнопка тапа
        const tapButton = document.getElementById('tapButton');
        tapButton.addEventListener('click', (e) => this.handleTap(e));
        tapButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTap(e);
        });
        
        // Кнопка сохранения
        document.getElementById('saveBtn').addEventListener('click', () => this.saveGameToServer());
        
        // Навигация по вкладкам
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTab(btn.dataset.tab);
                
                // Если открываем Forbes - обновляем данные
                if (btn.dataset.tab === 'forbes') {
                    this.loadForbesFromServer();
                }
            });
        });
    }
    
    handleTap(event) {
        const tapValue = Math.floor(100 * this.tapMultiplier);
        this.cash += tapValue;
        this.totalTaps++;
        
        this.createCoinAnimation(event, tapValue);
        this.updateDisplay();
        this.showNotification(`+$${this.formatNumber(tapValue)}`);
        
        // Автосохранение после каждых 10 тапов
        if (this.totalTaps % 10 === 0) {
            this.autoSave();
        }
    }
    
    createCoinAnimation(event, value) {
        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.innerHTML = `💰 +$${value}`;
        coin.style.left = `${event.clientX || (event.touches && event.touches[0].clientX) || 50}px`;
        coin.style.top = `${event.clientY || (event.touches && event.touches[0].clientY) || 50}px`;
        document.body.appendChild(coin);
        
        setTimeout(() => coin.remove(), 1000);
    }
    
    // ... остальные методы игры остаются такими же, как в предыдущей версии ...
    // buyBusiness, upgradeBusiness, calculateHourlyIncome и т.д.
    
    async saveGameToServer() {
        const gameData = this.getSaveData();
        
        if (this.tg && this.tg.sendData) {
            try {
                this.tg.sendData(JSON.stringify({
                    type: "save_game",
                    data: gameData
                }));
                
                this.lastSaveTime = Date.now();
                this.updateSaveTime();
                this.showNotification("✅ Игра сохранена на сервере!");
                
            } catch (error) {
                console.error('Save error:', error);
                this.saveToLocalStorage();
                this.showNotification("⚠️ Сохранено локально (ошибка сервера)");
            }
        } else {
            this.saveToLocalStorage();
            this.showNotification("✅ Игра сохранена локально");
        }
    }
    
    async loadGame() {
        // Пытаемся загрузить с сервера через Telegram
        if (this.tg) {
            try {
                // Запрашиваем данные у бота
                // В реальном приложении здесь должен быть запрос к API
                
                // Пока загружаем из localStorage
                const saved = localStorage.getItem('idleBusinessGame');
                if (saved) {
                    const gameData = JSON.parse(saved);
                    this.loadFromData(gameData);
                    
                    // Рассчитываем офлайн доход
                    if (gameData.lastSave) {
                        const offlineTime = Date.now() - gameData.lastSave;
                        const offlineHours = offlineTime / 3600000;
                        
                        if (offlineHours > 0) {
                            const hourlyIncome = gameData.hourlyIncome || this.calculateHourlyIncome();
                            const offlineMultiplier = this.upgrades.offlineEarnings.multiplier;
                            const offlineEarnings = Math.floor(hourlyIncome * offlineHours * offlineMultiplier);
                            
                            if (offlineEarnings > 0) {
                                this.cash += offlineEarnings;
                                this.showNotification(`💤 Офлайн доход: $${this.formatNumber(offlineEarnings)} за ${offlineHours.toFixed(1)}ч`);
                            }
                        }
                    }
                    
                    this.showNotification("🎮 Прогресс загружен!");
                }
                
            } catch (error) {
                console.error('Load error:', error);
                this.showNotification("⚠️ Не удалось загрузить с сервера");
            }
        }
        
        this.updateDisplay();
    }
    
    async loadForbesFromServer() {
        if (this.tg && this.tg.sendData) {
            try {
                this.tg.sendData(JSON.stringify({
                    type: "get_forbes"
                }));
                
                // В реальном приложении здесь должен быть ответ от бота
                // Пока используем заглушку
                setTimeout(() => {
                    this.forbes = this.generateForbesData();
                    if (document.querySelector('.tab-btn.active')?.dataset.tab === 'forbes') {
                        this.renderTab('forbes');
                    }
                }, 1000);
                
            } catch (error) {
                console.error('Forbes load error:', error);
            }
        }
    }
    
    generateForbesData() {
        const players = [];
        
        // Добавляем текущего игрока
        players.push({
            id: this.playerId || 1,
            name: this.playerName,
            netWorth: this.calculateNetWorth(),
            isPlayer: true,
            rank: 1
        });
        
        // Добавляем ботов
        const botNames = ["Алексей", "Дмитрий", "Сергей", "Андрей", "Михаил", "Иван", "Владимир"];
        for (let i = 0; i < 9; i++) {
            const netWorth = Math.floor(this.calculateNetWorth() * (0.1 + Math.random() * 0.9));
            players.push({
                id: 1000 + i,
                name: botNames[i % botNames.length] + " " + (i + 1),
                netWorth: netWorth,
                isPlayer: false,
                rank: i + 2
            });
        }
        
        // Сортируем по состоянию
        players.sort((a, b) => b.netWorth - a.netWorth);
        
        // Обновляем ранги
        players.forEach((p, i) => {
            p.rank = i + 1;
        });
        
        return players;
    }
    
    hideLoading() {
        this.isLoading = false;
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }
    }
    
    showLoading() {
        this.isLoading = true;
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10);
        }
    }
    
    // ... остальные методы остаются такими же ...
    
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return Math.floor(num);
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    window.game = new IdleBusinessGame();
    await window.game.init();
});

// Добавляем стили для загрузки
const style = document.createElement('style');
style.textContent = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    opacity: 1;
    transition: opacity 0.3s ease;
}

.loading-content {
    text-align: center;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 600;
}
`;
document.head.appendChild(style);
