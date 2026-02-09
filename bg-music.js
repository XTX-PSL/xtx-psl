// bg-music.js - 背景音乐控制脚本

// 音乐配置
const MUSIC_CONFIG = {
    file: 'bg.mp3',  // 音乐文件路径
    defaultVolume: 0.3,           // 默认音量（0-1）
    storageKey: 'website_music'   // localStorage 的键名
};

// 初始化音乐系统
function initBackgroundMusic() {
    // 创建全局音频对象
    window.websiteMusic = {
        audio: null,
        isInitialized: false,
        controls: null
    };
    
    // 创建音频元素
    createAudioElement();
    
    // 创建控制面板
    createControlPanel();
    
    // 加载保存的设置
    loadSavedSettings();
    
    // 尝试自动播放（需要用户交互后才能工作）
    tryAutoPlay();
    
    console.log('背景音乐系统已初始化');
}

// 创建隐藏的音频元素
function createAudioElement() {
    const audio = document.createElement('audio');
    audio.id = 'website-bg-music';
    audio.loop = true;
    audio.preload = 'auto';
    
    const source = document.createElement('source');
    source.src = MUSIC_CONFIG.file;
    source.type = 'audio/mpeg';
    
    audio.appendChild(source);
    document.body.appendChild(audio);
    
    window.websiteMusic.audio = audio;
    
    // 添加错误处理
    audio.addEventListener('error', function(e) {
        console.error('音乐加载失败:', e);
        showErrorMessage('音乐加载失败，请检查文件路径');
    });
    
    // 添加可以播放事件（用户交互后）
    audio.addEventListener('canplaythrough', function() {
        console.log('音乐可以播放了');
    });
}

// 创建控制面板
function createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'music-control-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    // 播放/暂停按钮
    const playBtn = document.createElement('button');
    playBtn.id = 'music-play-btn';
    playBtn.innerHTML = '▶';
    playBtn.style.cssText = `
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // 音量滑块
    const volumeSlider = document.createElement('input');
    volumeSlider.id = 'music-volume-slider';
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '30';
    volumeSlider.style.cssText = `
        width: 80px;
        cursor: pointer;
    `;
    
    // 静音按钮
    const muteBtn = document.createElement('button');
    muteBtn.id = 'music-mute-btn';
    muteBtn.innerHTML = '🔊';
    muteBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0 5px;
    `;
    
    // 添加到面板
    panel.appendChild(playBtn);
    panel.appendChild(volumeSlider);
    panel.appendChild(muteBtn);
    document.body.appendChild(panel);
    
    // 保存控制元素引用
    window.websiteMusic.controls = {
        panel: panel,
        playBtn: playBtn,
        volumeSlider: volumeSlider,
        muteBtn: muteBtn
    };
    
    // 添加事件监听
    setupEventListeners();
}

// 设置事件监听
function setupEventListeners() {
    const { audio, controls } = window.websiteMusic;
    
    // 播放/暂停按钮
    controls.playBtn.addEventListener('click', function() {
        if (audio.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });
    
    // 音量滑块
    controls.volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        audio.volume = volume;
        updateMuteButton();
        saveSettings();
    });
    
    // 静音按钮
    controls.muteBtn.addEventListener('click', function() {
        audio.muted = !audio.muted;
        updateMuteButton();
        saveSettings();
    });
    
    // 音频事件
    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);
    audio.addEventListener('volumechange', updateMuteButton);
}

// 播放音乐
function playMusic() {
    const { audio } = window.websiteMusic;
    
    // 现代浏览器需要用户交互后才能播放
    audio.play()
        .then(() => {
            console.log('音乐开始播放');
            updatePlayButton();
            saveSettings();
        })
        .catch(error => {
            console.log('自动播放被阻止:', error);
            showPlayPrompt();
        });
}

// 暂停音乐
function pauseMusic() {
    const { audio } = window.websiteMusic;
    audio.pause();
    updatePlayButton();
    saveSettings();
}

// 尝试自动播放
function tryAutoPlay() {
    // 检查是否保存了播放状态
    const settings = getSavedSettings();
    
    if (settings && settings.playing) {
        // 延迟一点尝试播放
        setTimeout(() => {
            playMusic();
        }, 500);
    }
}

// 加载保存的设置
function loadSavedSettings() {
    const settings = getSavedSettings();
    const { audio, controls } = window.websiteMusic;
    
    if (settings) {
        // 加载音量
        if (settings.volume !== undefined) {
            audio.volume = settings.volume;
            controls.volumeSlider.value = settings.volume * 100;
        } else {
            audio.volume = MUSIC_CONFIG.defaultVolume;
            controls.volumeSlider.value = MUSIC_CONFIG.defaultVolume * 100;
        }
        
        // 加载静音状态
        if (settings.muted !== undefined) {
            audio.muted = settings.muted;
        }
        
        console.log('已加载保存的音乐设置');
    } else {
        // 使用默认设置
        audio.volume = MUSIC_CONFIG.defaultVolume;
        controls.volumeSlider.value = MUSIC_CONFIG.defaultVolume * 100;
    }
    
    updatePlayButton();
    updateMuteButton();
}

// 保存设置到 localStorage
function saveSettings() {
    const { audio } = window.websiteMusic;
    
    const settings = {
        playing: !audio.paused,
        volume: audio.volume,
        muted: audio.muted,
        lastSave: Date.now()
    };
    
    localStorage.setItem(MUSIC_CONFIG.storageKey, JSON.stringify(settings));
}

// 获取保存的设置
function getSavedSettings() {
    const saved = localStorage.getItem(MUSIC_CONFIG.storageKey);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('解析保存的设置失败:', e);
            return null;
        }
    }
    return null;
}

// 更新播放按钮
function updatePlayButton() {
    const { audio, controls } = window.websiteMusic;
    
    if (audio.paused) {
        controls.playBtn.innerHTML = '▶';
        controls.playBtn.style.background = '#4CAF50';
    } else {
        controls.playBtn.innerHTML = '⏸';
        controls.playBtn.style.background = '#ff9800';
    }
}

// 更新静音按钮
function updateMuteButton() {
    const { audio, controls } = window.websiteMusic;
    
    if (audio.muted || audio.volume === 0) {
        controls.muteBtn.innerHTML = '🔇';
        controls.volumeSlider.style.opacity = '0.5';
    } else if (audio.volume < 0.5) {
        controls.muteBtn.innerHTML = '🔉';
        controls.volumeSlider.style.opacity = '1';
    } else {
        controls.muteBtn.innerHTML = '🔊';
        controls.volumeSlider.style.opacity = '1';
    }
}

// 显示播放提示
function showPlayPrompt() {
    // 可以在这里添加一个提示，告诉用户需要点击播放按钮
    const { controls } = window.websiteMusic;
    
    controls.panel.style.background = '#ff9800';
    setTimeout(() => {
        controls.panel.style.background = 'rgba(0, 0, 0, 0.8)';
    }, 1000);
}

// 显示错误信息
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 10001;
        font-family: Arial, sans-serif;
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initBackgroundMusic);

// 页面离开时保存状态
window.addEventListener('beforeunload', saveSettings);

// 提供全局控制函数（可选）
window.controlBackgroundMusic = {
    play: playMusic,
    pause: pauseMusic,
    setVolume: function(volume) {
        const { audio, controls } = window.websiteMusic;
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume));
            controls.volumeSlider.value = volume * 100;
            saveSettings();
        }
    },
    toggleMute: function() {
        const { audio, controls } = window.websiteMusic;
        if (audio) {
            controls.muteBtn.click();
        }
    }
};