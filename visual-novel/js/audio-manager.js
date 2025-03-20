class AudioManager {
    constructor() {
        this.bgmAudio = new Audio();
        this.sfxAudio = new Audio();
        this.dialogAudio = new Audio();
        
        this.bgmVolume = 0.5;
        this.sfxVolume = 0.7;
        this.dialogVolume = 1.0;
        
        this.preloadedAudio = new Map();
        this.userInteractionDetected = false;
        
        // Detect first user interaction
        document.addEventListener('click', () => {
            console.log('User interaction detected');
            this.userInteractionDetected = true;
        }, { once: true });
    }
    
    setVolume(type, volume) {
        volume = Math.max(0, Math.min(1, volume));
        switch(type) {
            case 'bgm':
                this.bgmVolume = volume;
                this.bgmAudio.volume = volume;
                break;
            case 'sfx':
                this.sfxVolume = volume;
                this.sfxAudio.volume = volume;
                break;
            case 'dialog':
                this.dialogVolume = volume;
                this.dialogAudio.volume = volume;
                break;
        }
    }
    
    async preloadAudio(path) {
        if (this.preloadedAudio.has(path)) {
            return this.preloadedAudio.get(path);
        }
        
        try {
            const audio = new Audio();
            audio.src = path;
            await new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', resolve, { once: true });
                audio.addEventListener('error', reject, { once: true });
                audio.load();
            });
            this.preloadedAudio.set(path, audio);
            return audio;
        } catch (error) {
            console.warn(`Error preloading audio ${path}:`, error);
            throw error;
        }
    }
    
    async playBGM(filename) {
        if (!filename) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            return;
        }
        
        try {
            const path = `assets/audio/bgm/${filename}`;
            const audio = await this.preloadAudio(path);
            
            // Fade out current BGM if playing
            if (!this.bgmAudio.paused) {
                await this.fadeOut(this.bgmAudio);
            }
            
            // Set up new BGM
            this.bgmAudio = audio;
            this.bgmAudio.loop = true;
            this.bgmAudio.volume = this.bgmVolume;
            
            // Start playing
            if (this.userInteractionDetected) {
                await this.bgmAudio.play();
            }
        } catch (error) {
            console.warn(`BGM not found: ${filename}`);
        }
    }
    
    async playSFX(filename) {
        try {
            const path = `assets/audio/sfx/${filename}`;
            const audio = await this.preloadAudio(path);
            
            // Stop any currently playing SFX
            this.sfxAudio.pause();
            this.sfxAudio.currentTime = 0;
            
            this.sfxAudio = audio;
            this.sfxAudio.volume = this.sfxVolume;
            
            if (this.userInteractionDetected) {
                await this.sfxAudio.play();
            }
        } catch (error) {
            console.warn(`SFX not found: ${filename}`);
        }
    }
    
    formatDialogId(id) {
        // Convert single digit IDs to have leading zeros (e.g., "1" -> "001")
        return id.padStart(3, '0');
    }
    
    async stopCurrentDialog() {
        // Stop any currently playing dialog audio
        if (this.dialogAudio) {
            this.dialogAudio.pause();
            this.dialogAudio.currentTime = 0;
        }
    }
    
    async playDialog(sceneId, dialogId) {
        try {
            // Stop any currently playing dialog
            await this.stopCurrentDialog();
            
            const formattedDialogId = this.formatDialogId(dialogId);
            const filename = `${sceneId}_${formattedDialogId}.mp3`;
            console.log('Playing dialog:', `assets/audio/dialog/${filename}`);
            const path = `assets/audio/dialog/${filename}`;
            const audio = await this.preloadAudio(path);
            
            this.dialogAudio = audio;
            this.dialogAudio.volume = this.dialogVolume;
            
            if (this.userInteractionDetected) {
                await this.dialogAudio.play();
            }
        } catch (error) {
            console.warn(`Dialog audio not found: ${sceneId}_${dialogId}.mp3`);
        }
    }
    
    async playDialogChoice(sceneId, dialogId, choiceIndex) {
        try {
            // Stop any currently playing dialog
            await this.stopCurrentDialog();
            
            const formattedDialogId = this.formatDialogId(dialogId);
            const filename = `${sceneId}_${formattedDialogId}_choice_${choiceIndex}.mp3`;
            console.log('Playing choice:', `assets/audio/dialog/${filename}`);
            const path = `assets/audio/dialog/${filename}`;
            const audio = await this.preloadAudio(path);
            
            this.dialogAudio = audio;
            this.dialogAudio.volume = this.dialogVolume;
            
            if (this.userInteractionDetected) {
                await this.dialogAudio.play();
            }
        } catch (error) {
            console.warn(`Choice audio not found: ${sceneId}_${dialogId}_choice_${choiceIndex}.mp3`);
        }
    }
    
    async playDialogResponse(sceneId, dialogId, choiceIndex) {
        try {
            // Stop any currently playing dialog
            await this.stopCurrentDialog();
            
            const formattedDialogId = this.formatDialogId(dialogId);
            const filename = `${sceneId}_${formattedDialogId}_response_${choiceIndex}.mp3`;
            console.log('Playing response:', `assets/audio/dialog/${filename}`);
            const path = `assets/audio/dialog/${filename}`;
            const audio = await this.preloadAudio(path);
            
            this.dialogAudio = audio;
            this.dialogAudio.volume = this.dialogVolume;
            
            if (this.userInteractionDetected) {
                await this.dialogAudio.play();
            }
        } catch (error) {
            console.warn(`Response audio not found: ${sceneId}_${dialogId}_response_${choiceIndex}.mp3`);
        }
    }
    
    async fadeOut(audio, duration = 1000) {
        const startVolume = audio.volume;
        const steps = 20;
        const volumeStep = startVolume / steps;
        const timeStep = duration / steps;
        
        for (let i = steps - 1; i >= 0; i--) {
            audio.volume = volumeStep * i;
            await new Promise(resolve => setTimeout(resolve, timeStep));
        }
        
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVolume;
    }
}
