class MiniPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = -1;
        this.history = [];
        this.isPlaying = false;
        this.audio = document.getElementById('audio');
        this.songText = document.getElementById('songText');
        this.playBtn = document.getElementById('playBtn');
        this.mbmboxElement = document.getElementById('mbmbox');
        this.mbmbElement = document.getElementById('mbmb');
        this.bfpngElement = document.getElementById('bfpng');
        this.ztpngElement = document.getElementById('ztpng');
        this.initEvents();
        this.loadPlaylist();
    }

    initEvents() {
        document.getElementById('playBtn').onclick = () => this.togglePlay();
        document.getElementById('prevBtn').onclick = () => this.prevSong();
        document.getElementById('nextBtn').onclick = () => this.nextSong();

        // 修复：歌曲结束后自动播放下一首
        this.audio.onended = () => {
            console.log('歌曲播放完毕，自动播放下一首');
            this.nextSong();
        };

        this.audio.onloadstart = () => this.updateDisplay();

        // 修复：音频可以播放时自动开始播放
        this.audio.oncanplay = () => {
            if (this.isPlaying) {
                this.updateDisplay(); // 显示歌曲名
                this.audio.play().catch(e => {
                    console.error('自动播放失败:', e);
                    this.updateDisplay('播放失败');
                });
            }
        };

        this.audio.onerror = (e) => {
            console.error('音频加载错误:', e);
            this.updateDisplay('播放错误');
            // 如果当前歌曲加载失败，尝试播放下一首
            setTimeout(() => this.nextSong(), 1000);
        };
        //暂停更新元素
        this.audio.onpause = () => {
            this.bfpngElement.style.display = 'block'
            this.ztpngElement.style.display = 'none'
            this.isPlaying = false;
            this.mbmboxElement.style.animationPlayState = 'paused';
        };
        // 播放更新元素
        this.audio.onplay = () => {
            this.bfpngElement.style.display = 'none'
            this.ztpngElement.style.display = 'block'
            this.isPlaying = true;
            this.mbmboxElement.style.animation = 'mbmbzqq 20s linear infinite';
            this.mbmbElement.style.transform = 'scale(0.7)';
        };

        // 添加等待数据状态处理
        this.audio.onwaiting = () => {
            this.updateDisplay('缓冲中...');
        };
    }

    async loadPlaylist() {
        try {
            const response = await fetch('others/mp3list.json');
            const data = await response.json();

            this.playlist = data;
            console.log('播放列表加载成功，共', this.playlist.length, '首歌曲');

            if (this.playlist.length > 0) {
                //初始化时设置默认文字，不加载歌曲
                // this.updateDisplay('属于你的星空和Music');
            }
        } catch (error) {
            console.error('加载歌单失败:', error);
            this.updateDisplay('加载失败');
        }
    }

    // 新增：只加载歌曲但不播放
    loadRandomSong() {
        if (this.playlist.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.loadSong(randomIndex);
    }

    // 播放随机歌曲
    playRandomSong() {
        if (this.playlist.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.playlist.length);
        this.playSong(randomIndex);
    }

    // 新增：只加载歌曲不播放
    loadSong(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentIndex = index;
        const song = this.playlist[index];

        // 设置音频源
        this.audio.src = 'https://d2p9jl7ea6zcas.cloudfront.net/' + song.name;
        // this.audio.src = 'https://mp3.855655.xyz/' + song.name;


        console.log('加载歌曲:', song.name);
    }

    // 修复：播放指定歌曲
    playSong(index) {
        if (index < 0 || index >= this.playlist.length) return;

        // 记录历史
        if (this.currentIndex !== -1 && this.currentIndex !== index) {
            this.history.push(this.currentIndex);
            if (this.history.length > 10) {
                this.history.shift();
            }
        }

        const wasPlaying = this.isPlaying;
        this.currentIndex = index;
        const song = this.playlist[index];

        console.log('播放歌曲:', song.name);

        // 设置播放状态
        this.isPlaying = true;

        // 设置音频源
        this.audio.src = 'https://d2p9jl7ea6zcas.cloudfront.net/' + song.name;
        // this.audio.src = 'https://mp3.855655.xyz/' + song.name;

        // 更新显示
        this.updateDisplay(song.name.replace('.mp3', ''));

        // 尝试播放
        this.audio.play().catch(e => {
            console.error('播放失败:', e);
            this.updateDisplay('播放失败');
            this.isPlaying = false;
        });
    }

    togglePlay() {
        if (this.currentIndex === -1) {
            // 如果没有选中歌曲，播放随机歌曲
            this.playRandomSong();
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.isPlaying = true;
            this.audio.play().catch(e => {
                console.error('播放失败:', e);
                this.updateDisplay('播放失败');
                this.isPlaying = false;
            });
        }
    }

    prevSong() {
        if (this.history.length > 0) {
            const prevIndex = this.history.pop();
            this.playSong(prevIndex);
        } else {
            // 如果没有历史记录，播放随机歌曲
            this.playRandomSong();
        }
    }

    nextSong() {
        // 总是播放下一首随机歌曲
        this.playRandomSong();
    }

    updateDisplay(text) {
        if (text) {
            this.songText.textContent = text;
        } else if (this.currentIndex !== -1) {
            const songName = this.playlist[this.currentIndex].name.replace('.mp3', '');
            this.songText.textContent = songName;
        } else {
            this.songText.textContent = '准备播放...';
        }

        // 重新触发滚动动画
        this.songText.style.animation = 'none';
        setTimeout(() => {
            this.songText.style.animation = 'scroll 12s linear infinite';
        }, 10);
    }
}

// 初始化播放器
new MiniPlayer();