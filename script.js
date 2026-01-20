class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.volume = 0.5;
        
        this.init();
        this.setupEventListeners();
        this.loadSamplePlaylist();
        this.initTelegramWebApp();
    }

    init() {
        this.elements = {
            playBtn: document.getElementById('playBtn'),
            playIcon: document.getElementById('playIcon'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            volumeBtn: document.getElementById('volumeBtn'),
            volumeIcon: document.getElementById('volumeIcon'),
            volumeSlider: document.getElementById('volumeSlider'),
            progressBar: document.getElementById('progressBar'),
            currentTime: document.getElementById('currentTime'),
            duration: document.getElementById('duration'),
            songTitle: document.getElementById('songTitle'),
            artistName: document.getElementById('artistName'),
            albumArt: document.getElementById('albumArt'),
            playlist: document.getElementById('playlist'),
            searchInput: document.getElementById('searchInput'),
            searchBtn: document.getElementById('searchBtn'),
            addMusicBtn: document.getElementById('addMusicBtn'),
            fileInput: document.getElementById('fileInput'),
            addModal: document.getElementById('addModal'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            addUrlBtn: document.getElementById('addUrlBtn'),
            addFileBtn: document.getElementById('addFileBtn'),
            addSearchBtn: document.getElementById('addSearchBtn'),
            repeatBtn: document.getElementById('repeatBtn'),
            shuffleBtn: document.getElementById('shuffleBtn'),
            playlistBtn: document.getElementById('playlistBtn'),
            userInfo: document.getElementById('userInfo')
        };

        this.audio.volume = this.volume;
        this.elements.volumeSlider.value = this.volume * 100;
    }

    initTelegramWebApp() {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            
            const user = Telegram.WebApp.initDataUnsafe?.user;
            if (user) {
                this.elements.userInfo.innerHTML = `
                    👤 ${user.first_name || 'Пользователь'} 
                    ${user.last_name || ''} 
                    ${user.username ? `(@${user.username})` : ''}
                `;
            }
            
            // Отправка данных в бот
            this.sendTelegramData('webapp_opened');
        }
    }

    sendTelegramData(action, data = {}) {
        if (window.Telegram && Telegram.WebApp) {
            Telegram.WebApp.sendData(JSON.stringify({
                action: action,
                ...data,
                timestamp: Date.now()
            }));
        }
    }

    setupEventListeners() {
        // Управление воспроизведением
        this.elements.playBtn.addEventListener('click', () => this.togglePlay());
        this.elements.prevBtn.addEventListener('click', () => this.prevTrack());
        this.elements.nextBtn.addEventListener('click', () => this.nextTrack());

        // Громкость
        this.elements.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value / 100;
            this.audio.volume = this.volume;
            this.updateVolumeIcon();
        });

        this.elements.volumeBtn.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                this.audio.volume = 0;
                this.elements.volumeSlider.value = 0;
            } else {
                this.audio.volume = this.volume;
                this.elements.volumeSlider.value = this.volume * 100;
            }
            this.updateVolumeIcon();
        });

        // Прогресс трека
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Завершение трека
        this.audio.addEventListener('ended', () => {
            if (this.isRepeat) {
                this.playCurrentTrack();
            } else {
                this.nextTrack();
            }
        });

        // Поиск
        this.elements.searchBtn.addEventListener('click', () => this.searchMusic());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchMusic();
        });

        // Добавление музыки
        this.elements.addMusicBtn.addEventListener('click', () => {
            this.elements.addModal.classList.add('active');
        });

        this.elements.closeModalBtn.addEventListener('click', () => {
            this.elements.addModal.classList.remove('active');
        });

        this.elements.addFileBtn.addEventListener('click', () => {
            this.elements.fileInput.click();
        });

        this.elements.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));

        this.elements.addUrlBtn.addEventListener('click', () => {
            const url = prompt('Введите URL музыки (YouTube, Spotify и т.д.):');
            if (url) this.addMusicFromUrl(url);
        });

        this.elements.addSearchBtn.addEventListener('click', () => {
            const query = prompt('Введите название трека или исполнителя:');
            if (query) this.searchOnlineMusic(query);
        });

        // Повтор и перемешивание
        this.elements.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());

        // Клик по прогресс-бару
        this.elements.progressBar.addEventListener('click', (e) => {
            const rect = this.elements.progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });
    }

    loadSamplePlaylist() {
        // Пример плейлиста
        this.playlist = [
            {
                title: "Bohemian Rhapsody",
                artist: "Queen",
                duration: "5:55",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Queen"
            },
            {
                title: "Shape of You",
                artist: "Ed Sheeran",
                duration: "3:54",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Ed+Sheeran"
            },
            {
                title: "Blinding Lights",
                artist: "The Weeknd",
                duration: "3:22",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Weeknd"
            },
            {
                title: "Dance Monkey",
                artist: "Tones and I",
                duration: "3:29",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
                image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Tones+and+I"
            },
            {
                title: "Someone You Loved",
                artist: "Lewis Capaldi",
                duration: "3:02",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
                image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Lewis+Capaldi"
            }
        ];

        this.renderPlaylist();
        this.loadTrack(0);
    }

    renderPlaylist() {
        this.elements.playlist.innerHTML = '';
        
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = index === this.currentTrackIndex ? 'playing' : '';
            li.innerHTML = `
                <div class="song-details">
                    <div class="song-title">${track.title}</div>
                    <div class="song-artist">${track.artist}</div>
                </div>
                <div class="song-duration">${track.duration}</div>
            `;
            
            li.addEventListener('click', () => {
                this.loadTrack(index);
                this.playCurrentTrack();
            });
            
            this.elements.playlist.appendChild(li);
        });
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentTrackIndex = index;
        const track = this.playlist[index];
        
        this.audio.src = track.url;
        this.elements.songTitle.textContent = track.title;
        this.elements.artistName.textContent = track.artist;
        this.elements.albumArt.src = track.image;
        
        this.renderPlaylist();
        
        // Отправляем данные в бот о начале прослушивания
        this.sendTelegramData('track_started', {
            track: track.title,
            artist: track.artist
        });
    }

    playCurrentTrack() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.elements.playIcon.className = 'fas fa-pause';
        }).catch(error => {
            console.error('Ошибка воспроизведения:', error);
            alert('Ошибка воспроизведения аудио. Проверьте ссылку или файл.');
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.elements.playIcon.className = 'fas fa-play';
        } else {
            this.playCurrentTrack();
        }
        this.isPlaying = !this.isPlaying;
    }

    prevTrack() {
        let newIndex = this.currentTrackIndex - 1;
        if (newIndex < 0) newIndex = this.playlist.length - 1;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.playCurrentTrack();
    }

    nextTrack() {
        let newIndex = this.currentTrackIndex + 1;
        if (this.isShuffle) {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        }
        if (newIndex >= this.playlist.length) newIndex = 0;
        this.loadTrack(newIndex);
        if (this.isPlaying) this.playCurrentTrack();
    }

    updateProgress() {
        if (!isNaN(this.audio.duration)) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.elements.progressBar.style.background = `
                linear-gradient(90deg, 
                    #4ade80 ${percent}%, 
                    rgba(255, 255, 255, 0.2) ${percent}%
                )
            `;
            
            const currentMinutes = Math.floor(this.audio.currentTime / 60);
            const currentSeconds = Math.floor(this.audio.currentTime % 60);
            this.elements.currentTime.textContent = 
                `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
        }
    }

    updateDuration() {
        if (!isNaN(this.audio.duration)) {
            const durationMinutes = Math.floor(this.audio.duration / 60);
            const durationSeconds = Math.floor(this.audio.duration % 60);
            this.elements.duration.textContent = 
                `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        }
    }

    updateVolumeIcon() {
        if (this.audio.volume === 0) {
            this.elements.volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.audio.volume < 0.5) {
            this.elements.volumeIcon.className = 'fas fa-volume-down';
        } else {
            this.elements.volumeIcon.className = 'fas fa-volume-up';
        }
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.elements.repeatBtn.classList.toggle('active', this.isRepeat);
        this.sendTelegramData('repeat_toggled', { state: this.isRepeat });
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.elements.shuffleBtn.classList.toggle('active', this.isShuffle);
        this.sendTelegramData('shuffle_toggled', { state: this.isShuffle });
    }

    searchMusic() {
        const query = this.elements.searchInput.value.toLowerCase();
        if (!query) return;
        
        const filtered = this.playlist.filter(track =>
            track.title.toLowerCase().includes(query) ||
            track.artist.toLowerCase().includes(query)
        );
        
        // В реальном приложении здесь был бы запрос к API
        alert(`Найдено ${filtered.length} треков по запросу "${query}"`);
        this.sendTelegramData('search_performed', { query: query, results: filtered.length });
    }

    async addMusicFromUrl(url) {
        // Здесь должна быть логика парсинга URL
        // Для примера добавляем заглушку
        const newTrack = {
            title: `Трек из ${new URL(url).hostname}`,
            artist: "Неизвестен",
            duration: "0:00",
            url: url,
            image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=New+Track"
        };
        
        this.playlist.push(newTrack);
        this.renderPlaylist();
        this.elements.addModal.classList.remove('active');
        
        this.sendTelegramData('track_added', {
            source: 'url',
            url: url
        });
        
        alert('Трек добавлен в плейлист!');
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('audio/')) {
            alert('Пожалуйста, выберите аудиофайл');
            return;
        }
        
        const url = URL.createObjectURL(file);
        const newTrack = {
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Локальный файл",
            duration: "0:00",
            url: url,
            image: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Local+File"
        };
        
        this.playlist.push(newTrack);
        this.renderPlaylist();
        this.elements.addModal.classList.remove('active');
        
        this.sendTelegramData('track_added', {
            source: 'file',
            filename: file.name,
            size: file.size
        });
        
        alert('Файл добавлен в плейлист!');
    }

    searchOnlineMusic(query) {
        // Здесь должна быть интеграция с API музыкальных сервисов
        alert(`Поиск онлайн музыки для: "${query}"\n\nВ реальном приложении здесь будет интеграция с YouTube, Spotify и другими сервисами.`);
        this.sendTelegramData('online_search', { query: query });
    }
}

// Инициализация плеера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
});
