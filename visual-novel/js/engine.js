class VisualNovelEngine {
    constructor() {
        this.background = document.getElementById('background');
        this.character = document.getElementById('character');
        this.characterName = document.getElementById('character-name');
        this.dialogueText = document.getElementById('dialogue-text');
        this.choicesContainer = document.getElementById('choices');
        
        this.currentScene = null;
        this.currentDialogId = null;
        this.currentState = {
            flags: {},
            inventory: [],
            relationships: {}
        };
        
        // Bind click handler to advance dialogue
        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('choice')) {
                this.advance();
            }
        });

        // Add language toggle button
        this.addLanguageToggle();
        this.currentLanguage = 'english'; // Default to English
        this.isTyping = false;
        
        // Initialize audio manager
        window.audioManager = new AudioManager();
        
        // Initialize save manager
        window.saveManager = new SaveManager();
        window.saveManager.createSaveLoadUI();
        
        // Add save/load button
        this.addSaveLoadButton();
        
        // Initialize audio controls
        this.initializeAudioControls();
        
        this.typingSpeed = {
            slow: 100,
            normal: 50,
            excited: 30,
            instant: 0
        };
    }

    addLanguageToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'language-toggle';
        toggle.textContent = 'Switch to Farsi';
        toggle.style.position = 'absolute';
        toggle.style.top = '10px';
        toggle.style.right = '10px';
        toggle.style.padding = '8px 16px';
        toggle.style.backgroundColor = '#4CAF50';
        toggle.style.color = 'white';
        toggle.style.border = 'none';
        toggle.style.borderRadius = '4px';
        toggle.style.cursor = 'pointer';
        
        toggle.addEventListener('click', () => {
            this.currentLanguage = this.currentLanguage === 'english' ? 'farsi' : 'english';
            toggle.textContent = this.currentLanguage === 'english' ? 'Switch to Farsi' : 'Switch to English';
            
            // Apply language-specific styling
            const isFarsi = this.currentLanguage === 'farsi';
            document.documentElement.lang = isFarsi ? 'fa' : 'en';
            
            // Update dialogue text direction
            const dialogueText = document.getElementById('dialogue-text');
            dialogueText.style.direction = isFarsi ? 'rtl' : 'ltr';
            dialogueText.style.textAlign = isFarsi ? 'right' : 'left';
            
            // Update click hint text based on language
            const clickHint = document.getElementById('click-hint');
            clickHint.textContent = isFarsi ? 'برای ادامه کلیک کنید...' : 'Click to continue...';
            clickHint.style.direction = isFarsi ? 'rtl' : 'ltr';
            clickHint.style.textAlign = 'center';
            
            // Add Farsi font to character name
            const characterName = document.getElementById('character-name');
            if (isFarsi) {
                characterName.style.fontFamily = "'Noto Naskh Arabic', serif";
                characterName.style.direction = 'rtl';
                characterName.style.textAlign = 'right';
            } else {
                characterName.style.fontFamily = "'Noto Sans', Arial, sans-serif";
                characterName.style.direction = 'ltr';
                characterName.style.textAlign = 'left';
            }
            
            // Update the dialogue display
            this.updateDialogueDisplay();
            
            // Also update character name
            if (this.currentDialogData) {
                const characterNames = {
                    'player': this.currentLanguage === 'english' ? 'You' : 'شما',
                    'alex': this.currentLanguage === 'english' ? 'Alex Thompson' : 'الکس تامپسون',
                    'teacher': this.currentLanguage === 'english' ? 'Dr. Fatima Ahmadi' : 'دکتر فاطمه احمدی',
                    'student1': this.currentLanguage === 'english' ? 'Park Ji-eun' : 'پارک جی-اون',
                    'student2': this.currentLanguage === 'english' ? 'Garcia Carlos' : 'گارسیا کارلوس',
                    'clerk': this.currentLanguage === 'english' ? 'Ali Hosseini' : 'علی حسینی',
                    'barista': this.currentLanguage === 'english' ? 'Reza' : 'رضا'
                };
                this.characterName.textContent = characterNames[this.currentDialogData.speaker] || '';
            }
            
            // Update any displayed choices
            if (this.currentDialogData && this.currentDialogData.choices) {
                this.showChoices(this.currentDialogData.choices);
            }
        });
        
        document.getElementById('game-container').appendChild(toggle);
    }

    addSaveLoadButton() {
        const button = document.createElement('button');
        button.id = 'save-load-button';
        button.textContent = 'Save/Load';
        button.onclick = () => window.saveManager.toggleSaveLoadMenu(true);
        document.getElementById('game-container').appendChild(button);
    }

    initializeAudioControls() {
        const bgmSlider = document.getElementById('bgm-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        
        if (!bgmSlider || !sfxSlider) {
            console.error('Volume sliders not found in the DOM');
            return;
        }
        
        // Set initial values
        bgmSlider.value = window.audioManager.bgmVolume;
        sfxSlider.value = window.audioManager.sfxVolume;
        
        // BGM volume control
        bgmSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            window.audioManager.setVolume('bgm', volume);
            
            // Update current BGM volume if playing
            if (window.audioManager.bgm) {
                window.audioManager.bgm.volume = volume;
            }
        });
        
        // SFX volume control
        sfxSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            window.audioManager.setVolume('sfx', volume);
            
            // Play a test sound when adjusting SFX volume
            if (volume > 0) {
                window.audioManager.playSFX('button_click');
            }
        });
    }

    createDialogueBox() {
        const dialogueBox = document.createElement('div');
        dialogueBox.id = 'dialogue-box';
        dialogueBox.classList.add('dialogue-box');
        
        this.characterName = document.createElement('div');
        this.characterName.id = 'character-name';
        
        this.dialogueText = document.createElement('div');
        this.dialogueText.id = 'dialogue-text';
        
        const clickHint = document.createElement('div');
        clickHint.id = 'click-hint';
        clickHint.textContent = 'Click to continue...';
        
        dialogueBox.appendChild(this.characterName);
        dialogueBox.appendChild(this.dialogueText);
        dialogueBox.appendChild(clickHint);
        
        dialogueBox.addEventListener('click', () => {
            this.handleDialogueClick();
        });
        
        return dialogueBox;
    }

    async setBackground(locationId) {
        const backgroundMap = {
            'apartment': 'assets/backgrounds/apartment.jpg',
            'school_exterior': 'assets/backgrounds/school-exterior.jpg',
            'classroom': 'assets/backgrounds/classroom.jpg',
            'post_office': 'assets/backgrounds/post-office.jpg',
            'cafe': 'assets/backgrounds/cafe-interior.jpg'
        };

        const imagePath = backgroundMap[locationId];
        if (!imagePath) {
            this.background.style.backgroundImage = '';
            return;
        }
        
        this.background.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
        this.background.style.backgroundImage = `url(${imagePath})`;
        this.background.style.opacity = '1';
    }

    async setCharacter(characterId) {
        const characterMap = {
            'alex': 'assets/characters/alex.png',
            'teacher': 'assets/characters/teacher.png',
            'student1': 'assets/characters/student1.png',
            'student2': 'assets/characters/student2.png',
            'clerk': 'assets/characters/clerk.png'
        };

        if (characterId === 'none') {
            this.character.style.display = 'none';
            return;
        }

        const imagePath = characterMap[characterId];
        if (!imagePath) {
            this.character.style.backgroundImage = '';
            return;
        }
        
        this.character.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, 300));
        this.character.style.backgroundImage = `url(${imagePath})`;
        this.character.style.opacity = '1';

        // Apply emotional state if present
        if (this.currentDialogData && this.currentDialogData.emotion) {
            this.applyEmotionalState(this.currentDialogData.emotion);
        }
    }

    applyEmotionalState(emotion) {
        // Remove any existing emotion classes
        const emotionClasses = ['neutral', 'happy', 'sad', 'excited', 'professional', 'helpful', 'understanding', 'supportive', 'curious', 'enthusiastic'];
        this.character.classList.remove(...emotionClasses);
        
        // Add new emotion class
        this.character.classList.add(emotion);

        // Apply visual effects based on emotion
        switch (emotion) {
            case 'excited':
            case 'enthusiastic':
                this.character.style.transform = 'scale(1.05)';
                break;
            case 'helpful':
            case 'understanding':
                this.character.style.filter = 'brightness(1.1)';
                break;
            case 'professional':
                this.character.style.filter = 'contrast(1.1)';
                break;
            default:
                this.character.style.transform = '';
                this.character.style.filter = '';
        }
    }

    async typeText(text, speed) {
        this.isTyping = true;
        this.dialogueText.textContent = ''; // Clear previous text
        const delay = this.typingSpeed[speed] || this.typingSpeed.normal;
        
        if (delay === 0) {
            this.dialogueText.textContent = text;
            this.isTyping = false;
            return;
        }

        // Add each character with a delay
        for (let i = 0; i < text.length; i++) {
            if (!this.isTyping) break;
            this.dialogueText.textContent = text.substring(0, i+1); // Use substring instead of appending
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        this.isTyping = false;
    }

    skipTyping() {
        this.isTyping = false;
        if (this.currentDialogData) {
            this.dialogueText.textContent = this.currentDialogData[this.currentLanguage];
        }
    }

    async setDialogue(dialogData) {
        this.currentDialogData = dialogData;
        
        // Simple character name mapping
        const characterNames = {
            'player': this.currentLanguage === 'english' ? 'You' : 'شما',
            'alex': this.currentLanguage === 'english' ? 'Alex Thompson' : 'الکس تامپسون',
            'teacher': this.currentLanguage === 'english' ? 'Dr. Fatima Ahmadi' : 'دکتر فاطمه احمدی',
            'student1': this.currentLanguage === 'english' ? 'Park Ji-eun' : 'پارک جی-اون',
            'student2': this.currentLanguage === 'english' ? 'Garcia Carlos' : 'گارسیا کارلوس',
            'clerk': this.currentLanguage === 'english' ? 'Ali Hosseini' : 'علی حسینی',
            'barista': this.currentLanguage === 'english' ? 'Reza' : 'رضا'
        };

        this.characterName.textContent = characterNames[dialogData.speaker] || '';
        
        // Apply emotional state if present
        if (dialogData.emotion) {
            this.applyEmotionalState(dialogData.emotion);
        }

        // Play SFX if specified
        if (dialogData.sfx) {
            window.audioManager.playSFX(dialogData.sfx);
        }

        // Type out the text with specified speed
        await this.typeText(
            dialogData[this.currentLanguage],
            dialogData.typing_speed || 'normal'
        );
    }

    updateDialogueDisplay(dialogData = null) {
        if (!dialogData) {
            dialogData = storyData[this.currentScene].dialog[this.currentDialogId];
        }
        this.currentDialogData = dialogData;
        
        // Update character name when language changes
        const characterNames = {
            'player': this.currentLanguage === 'english' ? 'You' : 'شما',
            'alex': this.currentLanguage === 'english' ? 'Alex Thompson' : 'الکس تامپسون',
            'teacher': this.currentLanguage === 'english' ? 'Dr. Fatima Ahmadi' : 'دکتر فاطمه احمدی',
            'student1': this.currentLanguage === 'english' ? 'Park Ji-eun' : 'پارک جی-اون',
            'student2': this.currentLanguage === 'english' ? 'Garcia Carlos' : 'گارسیا کارلوس',
            'clerk': this.currentLanguage === 'english' ? 'Ali Hosseini' : 'علی حسینی',
            'barista': this.currentLanguage === 'english' ? 'Reza' : 'رضا'
        };
        
        this.characterName.textContent = characterNames[dialogData.speaker] || '';
        
        // Set click hint text based on language
        const clickHint = document.getElementById('click-hint');
        clickHint.textContent = this.currentLanguage === 'farsi' ? 'برای ادامه کلیک کنید...' : 'Click to continue...';

        // Skip any current typing animation
        this.skipTyping();
        
        // Start new typing animation
        this.typeText(
            dialogData[this.currentLanguage],
            dialogData.typing_speed || 'normal'
        );
        
        // Update choices if present
        if (dialogData.choices) {
            this.showChoices(dialogData.choices);
        } else {
            this.choicesContainer.innerHTML = '';
        }
    }

    showChoices(choices) {
        this.choicesContainer.innerHTML = '';
        if (!choices || choices.length === 0) return;

        choices.forEach(choice => {
            const button = document.createElement('div');
            button.classList.add('choice');
            
            // Set text in the current language
            button.textContent = choice[this.currentLanguage];
            
            // Apply Farsi styling to choices
            if (this.currentLanguage === 'farsi') {
                button.style.fontFamily = "'Noto Naskh Arabic', serif";
                button.style.direction = 'rtl';
                button.style.textAlign = 'right';
            } else {
                button.style.fontFamily = "'Noto Sans', Arial, sans-serif";
                button.style.direction = 'ltr';
                button.style.textAlign = 'left';
            }
            
            button.addEventListener('click', () => {
                this.handleChoice(choice);
            });
            this.choicesContainer.appendChild(button);
        });
    }

    handleChoice(choice) {
        if (choice.response) {
            this.setDialogue(choice.response);
            setTimeout(() => {
                if (choice.next_id) {
                    this.currentDialogId = choice.next_id;
                    this.updateDialogueDisplay();
                } else if (choice.next_scene_id) {
                    this.loadScene(choice.next_scene_id);
                }
            }, 2000); // Wait 2 seconds before advancing after response
        } else {
            if (choice.next_id) {
                this.currentDialogId = choice.next_id;
                this.updateDialogueDisplay();
            } else if (choice.next_scene_id) {
                this.loadScene(choice.next_scene_id);
            }
        }
        
        // Play button click sound
        window.audioManager.playSFX('button_click');
    }

    async loadScene(sceneId) {
        const scene = storyData[sceneId];
        if (!scene) {
            console.error(`Scene ${sceneId} not found`);
            return;
        }

        this.currentScene = sceneId;
        this.currentDialogId = "000"; // Start from first dialogue

        await this.setBackground(scene.location_id);
        await this.setCharacter(scene.character_id);
        
        // Play scene BGM if specified
        if (storyData[sceneId].bgm) {
            await window.audioManager.playBGM(storyData[sceneId].bgm);
        }
        
        // Play transition sound
        window.audioManager.playSFX('transition');
        
        this.setDialogue(scene.dialog[this.currentDialogId]);
    }

    advance() {
        if (this.isTyping) {
            this.skipTyping();
            return;
        }

        if (this.choicesContainer.children.length > 0) {
            return; // Don't advance if choices are showing
        }

        const currentDialog = storyData[this.currentScene].dialog[this.currentDialogId];
        
        if (currentDialog.next_scene_id) {
            this.loadScene(currentDialog.next_scene_id);
        } else if (currentDialog.default_next_id) {
            this.currentDialogId = currentDialog.default_next_id;
            this.updateDialogueDisplay();
        }
    }

    loadGameState(saveData) {
        this.currentScene = saveData.currentScene;
        this.currentDialogId = saveData.currentDialogId;
        this.currentLanguage = saveData.currentLanguage;
        
        // Load scene and dialog
        this.loadScene(this.currentScene);
        this.updateDialogueDisplay(storyData[this.currentScene].dialog[this.currentDialogId]);
        
        // Update language
        document.getElementById('language-toggle').textContent = 
            this.currentLanguage === 'english' ? 'Switch to Farsi' : 'Switch to English';
    }

    start(initialSceneId = 'scene001') {
        this.currentState = {
            flags: {},
            inventory: [],
            relationships: {}
        };
        this.loadScene(initialSceneId);
    }
}
