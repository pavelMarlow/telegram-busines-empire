<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔓 Сервис разблокировок | Web App</title>
    <style>
        /* ВСТАВЬТЕ ВЕСЬ СОДЕРЖИМОЕ ФАЙЛА webapp/styles.css СЮДА */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        /* ... ВСТАВЬТЕ ВЕСЬ ОСТАЛЬНОЙ CSS КОД ... */
    </style>
    <script>
        // Эмуляция Telegram Web App для GitHub Pages
        window.Telegram = {
            WebApp: {
                initData: '',
                initDataUnsafe: {
                    user: {
                        id: 123456789,
                        first_name: 'Демо',
                        last_name: 'Пользователь',
                        username: 'demo_user',
                        language_code: 'ru'
                    }
                },
                version: '6.7',
                platform: 'web',
                colorScheme: 'dark',
                themeParams: {
                    bg_color: '#212121',
                    text_color: '#ffffff',
                    hint_color: '#aaaaaa',
                    link_color: '#8774e1',
                    button_color: '#8774e1',
                    button_text_color: '#ffffff'
                },
                isExpanded: true,
                viewportHeight: 600,
                viewportStableHeight: 600,
                MainButton: {
                    text: '',
                    color: '',
                    textColor: '',
                    isVisible: false,
                    isActive: true,
                    show: () => {},
                    hide: () => {},
                    enable: () => {},
                    disable: () => {}
                },
                expand: () => console.log('Expanded'),
                ready: () => console.log('Ready'),
                close: () => console.log('Closed'),
                sendData: (data) => console.log('Data sent:', data),
                openTelegramLink: (url) => window.open(url, '_blank'),
                onEvent: (event, callback) => console.log('Event listener added:', event)
            }
        };
    </script>
</head>
<body>
    <!-- ВСТАВЬТЕ ВЕСЬ HTML КОД ИЗ webapp/index.html СЮДА -->
    <div class="app-container">
        <!-- ... ВСТАВЬТЕ ВЕСЬ ОСТАЛЬНОЙ HTML КОД ... -->
    </div>
    
    <script>
        // ВСТАВЬТЕ ВЕСЬ СОДЕРЖИМОЕ ФАЙЛА webapp/script.js СЮДА
        // Удалите или закомментируйте строки с tg.expand() и tg.ready() 
        // так как мы эмулируем Telegram Web App
        
        const tg = window.Telegram.WebApp;
        let currentState = {};
        let navigationStack = [];
        
        function initApp() {
            // Не вызываем tg.expand() в веб-версии
            // tg.expand();
            
            // ... остальной код без изменений ...
        }
        
        // ... остальной код без изменений ...
        
        // Инициализация
        document.addEventListener('DOMContentLoaded', initApp);
        
        // Не вызываем tg.ready() в веб-версии
        // tg.ready();
    </script>
</body>
</html>
