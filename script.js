// Telegram Web App initialization
const tg = window.Telegram.WebApp;
let currentState = {};
let navigationStack = [];

// Initialize the app
function initApp() {
    // Expand Web App to full screen
    tg.expand();
    
    // Set theme colors
    const theme = tg.themeParams;
    document.documentElement.style.setProperty('--bg-color', theme.bg_color || '#212121');
    document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
    
    // Load user info
    loadUserInfo();
    
    // Show main menu after loading
    setTimeout(() => {
        showScreen('mainMenu');
    }, 1000);
}

// Load user information
function loadUserInfo() {
    const user = tg.initDataUnsafe.user;
    const userInfo = document.getElementById('userInfo');
    
    if (user) {
        const userName = user.first_name || 'Пользователь';
        userInfo.innerHTML = `
            <div class="user-greeting">
                👋 Привет, ${userName}!
            </div>
        `;
    } else {
        userInfo.innerHTML = `
            <div class="user-greeting">
                👋 Добро пожаловать!
            </div>
        `;
    }
}

// Screen management
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id !== 'loadingScreen') {
            screen.classList.add('hidden');
        }
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    // Add to navigation stack
    if (screenId !== 'loadingScreen') {
        navigationStack.push(screenId);
    }
}

function backToPrevious() {
    if (navigationStack.length > 1) {
        navigationStack.pop(); // Remove current screen
        const previousScreen = navigationStack[navigationStack.length - 1];
        showScreen(previousScreen);
    } else {
        backToMain();
    }
}

function backToMain() {
    navigationStack = ['mainMenu'];
    showScreen('mainMenu');
}

// Main menu functions
function showUnlockMenu() {
    currentState.orderType = 'unlock';
    showScreen('unlockMenu');
}

function showKeyMenu() {
    currentState.orderType = 'access_key';
    showScreen('durationScreen');
}

function openSupport() {
    tg.openTelegramLink('https://t.me/your_support_bot');
}

function showMyOrders() {
    // In real app, load orders from server
    // For demo, show static orders
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Заказ #1001</div>
                <div class="order-status status-paid">Оплачен</div>
            </div>
            <div class="order-details">
                <div>🔓 Разблокировка iPhone 14</div>
                <div>Сумма: 15 000 ₽</div>
                <div>Дата: 25.12.2023</div>
            </div>
        </div>
        
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Заказ #1002</div>
                <div class="order-status status-paid">Оплачен</div>
            </div>
            <div class="order-details">
                <div>🔑 Ключ доступа (Месяц)</div>
                <div>Сумма: 8 000 ₽</div>
                <div>Дата: 20.12.2023</div>
                <div class="order-key">XXXX-XXXX-XXXX-XXXX</div>
            </div>
        </div>
        
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Заказ #1003</div>
                <div class="order-status status-pending">В обработке</div>
            </div>
            <div class="order-details">
                <div>🔓 Разблокировка iPad Pro</div>
                <div>Сумма: 20 000 ₽</div>
                <div>Дата: 26.12.2023</div>
            </div>
        </div>
    `;
    showScreen('ordersScreen');
}

function showInfo() {
    showScreen('infoScreen');
}

// Device selection
function selectDeviceType(deviceType) {
    currentState.deviceType = deviceType;
    
    // Update title
    const title = document.getElementById('deviceListTitle');
    title.textContent = deviceType === 'iphone' ? '📱 iPhone' : '💻 iPad';
    
    // Load devices
    loadDevices(deviceType);
    showScreen('deviceListScreen');
}

function loadDevices(deviceType) {
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = '';
    
    // Demo devices - in real app, load from server
    let devices = [];
    
    if (deviceType === 'iphone') {
        devices = [
            { id: 1, model: 'iPhone 5', basePrice: 3000 },
            { id: 2, model: 'iPhone 6', basePrice: 4500 },
            { id: 3, model: 'iPhone 7', basePrice: 6000 },
            { id: 4, model: 'iPhone 8', basePrice: 7500 },
            { id: 5, model: 'iPhone X', basePrice: 9000 },
            { id: 6, model: 'iPhone 11', basePrice: 10500 },
            { id: 7, model: 'iPhone 12', basePrice: 12000 },
            { id: 8, model: 'iPhone 13', basePrice: 13500 },
            { id: 9, model: 'iPhone 14', basePrice: 15000 },
            { id: 10, model: 'iPhone 15', basePrice: 16500 }
        ];
    } else {
        devices = [
            { id: 11, model: 'iPad Air 2', basePrice: 5000 },
            { id: 12, model: 'iPad 6th Gen', basePrice: 6500 },
            { id: 13, model: 'iPad 7th Gen', basePrice: 8000 },
            { id: 14, model: 'iPad 8th Gen', basePrice: 9500 },
            { id: 15, model: 'iPad 9th Gen', basePrice: 11000 },
            { id: 16, model: 'iPad 10th Gen', basePrice: 12500 }
        ];
    }
    
    // Display devices with increasing prices
    devices.forEach((device, index) => {
        const price = device.basePrice + (index * 1500);
        const deviceElement = document.createElement('div');
        deviceElement.className = 'device-item';
        deviceElement.innerHTML = `
            <div class="device-name">${device.model}</div>
            <div class="device-price">${price.toLocaleString()} ₽</div>
        `;
        deviceElement.onclick = () => selectDevice(device.model, price, device.id);
        deviceList.appendChild(deviceElement);
    });
}

function selectDevice(model, price, deviceId) {
    currentState.deviceModel = model;
    currentState.deviceId = deviceId;
    currentState.amount = price;
    
    // Show order summary
    showOrderSummary();
    showScreen('paymentScreen');
}

// Duration selection
function selectDuration(duration, price) {
    currentState.duration = duration;
    currentState.amount = price;
    
    // Show order summary
    showOrderSummary();
    showScreen('paymentScreen');
}

// Order summary
function showOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    
    if (currentState.orderType === 'unlock') {
        orderSummary.innerHTML = `
            <h3>Детали заказа:</h3>
            <div class="order-detail">
                <span>Услуга:</span>
                <span>🔓 Разблокировка</span>
            </div>
            <div class="order-detail">
                <span>Устройство:</span>
                <span>${currentState.deviceModel}</span>
            </div>
            <div class="order-detail">
                <span>Стоимость:</span>
                <span>${currentState.amount.toLocaleString()} ₽</span>
            </div>
            <div class="order-total">
                Итого: ${currentState.amount.toLocaleString()} ₽
            </div>
        `;
    } else {
        const durationText = currentState.duration.replace('_', ' ');
        orderSummary.innerHTML = `
            <h3>Детали заказа:</h3>
            <div class="order-detail">
                <span>Услуга:</span>
                <span>🔑 Ключ доступа</span>
            </div>
            <div class="order-detail">
                <span>Срок:</span>
                <span>${durationText}</span>
            </div>
            <div class="order-detail">
                <span>Стоимость:</span>
                <span>${currentState.amount.toLocaleString()} ₽</span>
            </div>
            <div class="order-total">
                Итого: ${currentState.amount.toLocaleString()} ₽
            </div>
        `;
    }
}

// Payment selection
function selectPayment(paymentMethod) {
    currentState.paymentMethod = paymentMethod;
    
    // In real app, send data to bot and process payment
    // For demo, simulate successful payment
    simulatePayment();
}

function simulatePayment() {
    // Show loading
    const successMessage = document.getElementById('successMessage');
    
    if (currentState.orderType === 'unlock') {
        successMessage.innerHTML = `
            ✅ <strong>Оплата прошла успешно!</strong><br><br>
            👨‍💻 Техподдержка скоро вам ответит.<br>
            ⏱ Ответ в течение 10-50 минут.<br><br>
            Номер заказа: #${Math.floor(1000 + Math.random() * 9000)}
        `;
    } else {
        // Generate demo access key
        const accessKey = generateAccessKey();
        successMessage.innerHTML = `
            ✅ <strong>Оплата прошла успешно!</strong><br><br>
            Ваш ключ доступа:<br>
            <strong>${accessKey}</strong><br><br>
            ⚠️ Сохраните этот ключ в надежном месте!<br>
            Он больше не будет показан.
        `;
    }
    
    showScreen('successScreen');
}

function generateAccessKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 3) key += '-';
    }
    
    return key;
}

// Navigation
function backToUnlockMenu() {
    showScreen('unlockMenu');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initApp);

// Telegram Web App ready
tg.ready();

// Send data to bot (if needed)
function sendDataToBot(data) {
    tg.sendData(JSON.stringify(data));
}

// Handle Web App data received
tg.onEvent('webAppDataReceived', (event) => {
    console.log('Data received from bot:', event);
});

// Handle theme changes
tg.onEvent('themeChanged', () => {
    const theme = tg.themeParams;
    document.documentElement.style.setProperty('--bg-color', theme.bg_color || '#212121');
    document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
});
