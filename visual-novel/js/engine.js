class VisualNovelEngine {
    constructor() {
        this.currentScene = null;
        this.currentDialogId = "0";
        this.currentDialogData = null;
        this.audioManager = new AudioManager();
        this.saveManager = new SaveManager();
        this.isChoiceActive = false;
        this.gameFlags = {};
        
        // Initialize UI elements
        this.initializeDOMElements();
        this.setupClickHandlers();
        this.setupVolumeControls();
        this.initializeAudioSettings();
    }

    initializeDOMElements() {
        // Get DOM elements
        this.background = document.getElementById('background');
        this.character = document.getElementById('character');
        this.dialogBox = document.getElementById('dialog-box');
        this.farsiText = document.getElementById('farsi-text');
        this.englishText = document.getElementById('english-text');
        this.choicesContainer = document.getElementById('choices-container');
        
        // Add save/load button
        const menuButton = document.createElement('button');
        menuButton.id = 'menu-button';
        menuButton.textContent = 'Save/Load';
        menuButton.onclick = () => this.saveManager.toggleSaveLoadMenu();
        document.getElementById('game-container').appendChild(menuButton);
        
        // Add volume controls if they don't exist
        if (!document.getElementById('volume-controls')) {
            const volumeControls = document.createElement('div');
            volumeControls.id = 'volume-controls';
            volumeControls.innerHTML = `
                <div class="volume-control">
                    <label for="bgm-volume">BGM</label>
                    <input type="range" id="bgm-volume" min="0" max="1" step="0.1" value="0.5">
                </div>
                <div class="volume-control">
                    <label for="sfx-volume">SFX</label>
                    <input type="range" id="sfx-volume" min="0" max="1" step="0.1" value="0.7">
                </div>
                <div class="volume-control">
                    <label for="dialog-volume">Dialog</label>
                    <input type="range" id="dialog-volume" min="0" max="1" step="0.1" value="1.0">
                </div>
            `;
            document.getElementById('game-container').appendChild(volumeControls);
        }
    }

    initializeAudioSettings() {
        // Set initial volume levels
        this.audioManager.setVolume('bgm', 0.5);
        this.audioManager.setVolume('sfx', 0.7);
        this.audioManager.setVolume('dialog', 1.0);
        
        // Set initial volume control values
        document.getElementById('bgm-volume').value = 0.5;
        document.getElementById('sfx-volume').value = 0.7;
        document.getElementById('dialog-volume').value = 1.0;

        // Start with main theme
        this.audioManager.playBGM('main-theme.mp3');
    }

    setupVolumeControls() {
        const bgmVolume = document.getElementById('bgm-volume');
        const sfxVolume = document.getElementById('sfx-volume');
        const dialogVolume = document.getElementById('dialog-volume');

        bgmVolume.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audioManager.setVolume('bgm', volume);
        });

        sfxVolume.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audioManager.setVolume('sfx', volume);
            // Play a test sound when adjusting SFX volume
            if (volume > 0) {
                this.audioManager.playSFX('button-click.mp3');
            }
        });

        dialogVolume.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audioManager.setVolume('dialog', volume);
        });
    }

    setupClickHandlers() {
        // Dialog box click handler for advancing text
        this.dialogBox.addEventListener('click', () => {
            if (!this.isChoiceActive) {
                this.advanceDialog();
            }
        });

        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                if (!this.isChoiceActive) {
                    this.advanceDialog();
                }
            }
        });
    }

    async loadScene(sceneId, startDialogId = "0") {
        console.log('Loading scene:', sceneId, 'with dialog:', startDialogId);
        const scene = storyData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        // Stop any currently playing audio
        await this.audioManager.playBGM(null);

        this.currentScene = scene;
        this.currentDialogId = startDialogId;

        // Set background
        if (scene.location_id) {
            await this.setBackground(scene.location_id);
        }

        // Set character
        if (scene.character_id) {
            await this.setCharacter(scene.character_id);
        }

        // Play BGM if specified
        if (scene.bgm) {
            await this.audioManager.playBGM(`${scene.bgm}.mp3`);
        }

        // Display initial dialog
        await this.setDialogue(scene.dialog[this.currentDialogId]);
    }

    async setBackground(locationId) {
        console.log('Setting background:', locationId);
        const imagePath = locationMap[locationId];
        if (imagePath) {
            this.background.style.backgroundImage = `url(${imagePath})`;
            // Play transition sound
            await this.audioManager.playSFX('transition.mp3');
        }
    }

    async setCharacter(characterId) {
        console.log('Setting character:', characterId);
        const imagePath = characterMap[characterId];
        if (imagePath) {
            this.character.style.backgroundImage = `url(${imagePath})`;
        }
    }

    async setDialogue(dialogData) {
        if (!dialogData) {
            console.warn('No dialog data provided');
            return;
        }

        console.log('Setting dialogue:', dialogData);
        this.currentDialogData = dialogData;
        
        // Display text
        this.farsiText.textContent = dialogData.farsi || '';
        this.englishText.textContent = dialogData.english || '';
        
        // Play dialog audio
        if (dialogData.farsi) {
            try {
                await this.audioManager.playDialog(this.currentScene.id, this.currentDialogId);
            } catch (error) {
                console.warn(`Failed to play dialog audio for ${this.currentScene.id}_${this.currentDialogId}:`, error);
            }
        }

        // Handle choices if present
        if (dialogData.choices) {
            this.displayChoices(dialogData.choices);
        }
    }

    async displayChoices(choices) {
        console.log('Displaying choices:', choices);
        this.isChoiceActive = true;
        this.choicesContainer.innerHTML = '';
        
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const button = document.createElement('button');
            button.className = 'choice-button';
            
            // Create spans for Farsi and English text
            const farsiSpan = document.createElement('span');
            farsiSpan.className = 'farsi-text';
            farsiSpan.textContent = choice.farsi;
            
            const englishSpan = document.createElement('span');
            englishSpan.className = 'english-text';
            englishSpan.textContent = choice.english;
            
            button.appendChild(farsiSpan);
            button.appendChild(englishSpan);
            
            // Add click handler
            button.addEventListener('click', async () => {
                // Play choice audio
                await this.audioManager.playDialogChoice(this.currentScene.id, this.currentDialogId, i);
                
                // Play response audio if available
                if (choice.response) {
                    await this.audioManager.playDialogResponse(this.currentScene.id, this.currentDialogId, i);
                }
                
                // Clear choices
                this.isChoiceActive = false;
                this.choicesContainer.innerHTML = '';
                
                if (choice.next_scene_id) {
                    await this.loadScene(choice.next_scene_id);
                } else if (choice.next_id) {
                    this.currentDialogId = choice.next_id;
                    await this.setDialogue(this.currentScene.dialog[this.currentDialogId]);
                }
            });
            
            this.choicesContainer.appendChild(button);
        }
    }

    async advanceDialog() {
        if (!this.currentDialogData) return;
        
        // If there are no choices and there's a default next dialog
        if (!this.currentDialogData.choices && this.currentDialogData.default_next_id) {
            this.currentDialogId = this.currentDialogData.default_next_id;
            await this.setDialogue(this.currentScene.dialog[this.currentDialogId]);
        }
        // If there's a next scene
        else if (this.currentDialogData.next_scene_id) {
            await this.loadScene(this.currentDialogData.next_scene_id);
        }
    }

    async handleChoice(choiceIndex) {
        if (!this.currentDialogData || !this.currentDialogData.choices) return;
        
        const choice = this.currentDialogData.choices[choiceIndex];
        if (!choice) return;
        
        // Clear choices
        this.isChoiceActive = false;
        this.choicesContainer.innerHTML = '';
        
        // If the choice has a response, display it
        if (choice.response) {
            this.farsiText.textContent = choice.response.farsi || '';
            this.englishText.textContent = choice.response.english || '';
        }
        
        // Update game flags if needed
        if (choice.flags) {
            Object.assign(this.gameFlags, choice.flags);
        }
        
        // Move to next dialog or scene
        if (choice.next_id) {
            if (choice.next_id.includes('scene')) {
                await this.loadScene(choice.next_id);
            } else {
                this.currentDialogId = choice.next_id;
                await this.setDialogue(this.currentScene.dialog[this.currentDialogId]);
            }
        }
    }

    loadGameState(state) {
        if (state && state.currentScene && state.currentDialogId) {
            this.loadScene(state.currentScene.id, state.currentDialogId);
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.visualNovelEngine = new VisualNovelEngine();
    
    // Load saved game state or start new game
    const savedState = window.saveManager.loadGameState();
    if (savedState) {
        window.visualNovelEngine.loadGameState(savedState);
    } else {
        window.visualNovelEngine.loadScene('scene001');
    }
});
