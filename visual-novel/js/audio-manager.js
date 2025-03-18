class AudioManager {
    constructor() {
        this.bgm = null;
        this.currentBgm = '';
        this.sfxVolume = 0.5;
        this.bgmVolume = 0.3;
        this.sounds = {};
        this.hasInteracted = false;
        this.pendingBgm = null;
        
        // Initialize sound effects
        this.loadSoundEffects();
        
        // Add event listeners for user interaction
        const interactionEvents = ['click', 'touchstart', 'keydown'];
        interactionEvents.forEach(event => {
            document.addEventListener(event, () => {
                if (!this.hasInteracted) {
                    console.log('User interaction detected, enabling audio');
                    this.hasInteracted = true;
                    // Try to play pending BGM
                    if (this.pendingBgm) {
                        console.log('Playing pending BGM:', this.pendingBgm);
                        this.playBGM(this.pendingBgm);
                        this.pendingBgm = null;
                    }
                }
            }, { once: false });
        });
    }

    loadSoundEffects() {
        const sfxList = {
            'door_bell': 'assets/audio/sfx/door-bell.mp3',
            'paper_rustle': 'assets/audio/sfx/paper-rustle.mp3',
            'coffee_machine': 'assets/audio/sfx/coffee-machine.mp3',
            'pour_tea': 'assets/audio/sfx/pour-tea.mp3',
            'button_click': 'assets/audio/sfx/button-click.mp3',
            'transition': 'assets/audio/sfx/transition.mp3'
        };

        for (const [name, path] of Object.entries(sfxList)) {
            const audio = new Audio(path);
            audio.volume = this.sfxVolume;
            this.sounds[name] = audio;
        }
    }

    async playBGM(trackName) {
        console.log('Attempting to play BGM:', trackName);
        
        if (this.currentBgm === trackName) {
            console.log('BGM already playing:', trackName);
            return;
        }
        
        const bgmList = {
            'cafe_ambience': 'assets/audio/bgm/cafe-ambience.mp3',
            'main_theme': 'assets/audio/bgm/main-theme.mp3',
            'street_ambience': 'assets/audio/bgm/street-ambience.mp3'
        };

        if (!this.hasInteracted) {
            console.log('User has not interacted yet, storing as pending BGM');
            this.pendingBgm = trackName;
            return;
        }

        if (this.bgm) {
            console.log('Fading out current BGM');
            try {
                await this.fadeOut(this.bgm);
                this.bgm.pause();
            } catch (error) {
                console.error('Error fading out BGM:', error);
            }
        }

        if (!trackName || !bgmList[trackName]) {
            console.error('Invalid BGM track name:', trackName);
            return;
        }

        console.log('Creating new audio for BGM:', trackName);
        this.bgm = new Audio(bgmList[trackName]);
        this.bgm.volume = 0;
        this.bgm.loop = true;
        this.currentBgm = trackName;
        
        try {
            console.log('Playing BGM with fade in');
            const playPromise = this.bgm.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('BGM playback started successfully');
                        this.fadeIn(this.bgm);
                    })
                    .catch(error => {
                        console.error('BGM playback failed:', error);
                        // If autoplay is still prevented, store as pending
                        if (error.name === 'NotAllowedError') {
                            this.pendingBgm = trackName;
                        }
                    });
            }
        } catch (error) {
            console.error('Error starting BGM playback:', error);
        }
    }

    async fadeOut(audio, duration = 1000) {
        if (!audio || audio.volume === 0) return;
        
        const steps = 20;
        const stepTime = duration / steps;
        const stepVolume = audio.volume / steps;
        const startVolume = audio.volume;

        for (let i = steps; i > 0; i--) {
            audio.volume = startVolume * (i / steps);
            await new Promise(resolve => setTimeout(resolve, stepTime));
        }
        
        audio.volume = 0;
    }

    async fadeIn(audio, duration = 1000) {
        if (!audio) return;
        
        const steps = 20;
        const stepTime = duration / steps;
        const targetVolume = this.bgmVolume;

        audio.volume = 0;
        for (let i = 1; i <= steps; i++) {
            audio.volume = targetVolume * (i / steps);
            await new Promise(resolve => setTimeout(resolve, stepTime));
        }
        
        audio.volume = targetVolume;
    }

    playSFX(soundName) {
        if (this.sounds[soundName]) {
            // Clone the audio to allow multiple plays
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.sfxVolume;
            
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error('SFX playback failed:', error);
                });
            }
        } else {
            console.warn('Sound effect not found:', soundName);
        }
    }

    setVolume(type, value) {
        if (type === 'bgm') {
            this.bgmVolume = value;
            if (this.bgm) this.bgm.volume = value;
        } else if (type === 'sfx') {
            this.sfxVolume = value;
            Object.values(this.sounds).forEach(sound => sound.volume = value);
        }
    }

    stopAll() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
