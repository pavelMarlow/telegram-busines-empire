const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'music-bot-webapp' });
});

app.post('/api/music/add', (req, res) => {
    const { url, title, artist } = req.body;
    // Здесь должна быть логика обработки музыки
    console.log('Adding music:', { url, title, artist });
    res.json({ success: true, message: 'Music added successfully' });
});

app.get('/api/music/search', (req, res) => {
    const { query } = req.query;
    // Здесь должна быть логика поиска музыки
    console.log('Searching for:', query);
    res.json({ 
        success: true, 
        results: [
            { title: `${query} - Sample 1`, artist: 'Artist 1', duration: '3:45' },
            { title: `${query} - Sample 2`, artist: 'Artist 2', duration: '4:20' }
        ] 
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Web app server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
