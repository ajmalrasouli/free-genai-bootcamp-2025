class SaveManager {
    constructor() {
        this.SAVE_KEY_PREFIX = 'farsi_vn_save_';
        this.MAX_SAVE_SLOTS = 5;
    }

    createSaveData(engine) {
        return {
            timestamp: new Date().toISOString(),
            currentScene: engine.currentScene,
            currentDialogId: engine.currentDialogId,
            currentLanguage: engine.currentLanguage,
            characterState: {
                id: engine.currentCharacterId,
                emotion: engine.currentDialogData?.emotion || 'neutral'
            },
            screenshot: this.captureScreenshot()
        };
    }

    captureScreenshot() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const gameContainer = document.getElementById('game-container');
        
        canvas.width = gameContainer.offsetWidth;
        canvas.height = gameContainer.offsetHeight;
        
        // Use html2canvas to capture the game state
        return html2canvas(gameContainer).then(canvas => {
            return canvas.toDataURL('image/jpeg', 0.5); // Compressed JPEG
        });
    }

    async saveGame(slot, engine) {
        try {
            const saveData = await this.createSaveData(engine);
            localStorage.setItem(
                this.SAVE_KEY_PREFIX + slot,
                JSON.stringify(saveData)
            );
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    loadGame(slot) {
        try {
            const saveData = localStorage.getItem(this.SAVE_KEY_PREFIX + slot);
            return saveData ? JSON.parse(saveData) : null;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    getSaveList() {
        const saves = [];
        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const saveData = this.loadGame(i);
            if (saveData) {
                saves.push({
                    slot: i,
                    timestamp: new Date(saveData.timestamp),
                    scene: saveData.currentScene,
                    screenshot: saveData.screenshot
                });
            }
        }
        return saves;
    }

    deleteSave(slot) {
        localStorage.removeItem(this.SAVE_KEY_PREFIX + slot);
    }

    createSaveLoadUI() {
        const container = document.createElement('div');
        container.id = 'save-load-menu';
        container.className = 'save-load-menu';
        container.style.display = 'none';

        const header = document.createElement('div');
        header.className = 'save-load-header';
        const title = document.createElement('h2');
        title.textContent = 'Save/Load Game';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.onclick = () => this.toggleSaveLoadMenu(false);
        header.appendChild(title);
        header.appendChild(closeBtn);

        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'save-slots';

        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const slot = this.createSaveSlot(i);
            slotsContainer.appendChild(slot);
        }

        container.appendChild(header);
        container.appendChild(slotsContainer);
        document.body.appendChild(container);

        return container;
    }

    createSaveSlot(slot) {
        const slotElement = document.createElement('div');
        slotElement.className = 'save-slot';
        
        const saveData = this.loadGame(slot);
        if (saveData) {
            const screenshot = document.createElement('img');
            screenshot.src = saveData.screenshot;
            screenshot.className = 'save-screenshot';
            
            const info = document.createElement('div');
            info.className = 'save-info';
            info.innerHTML = `
                <h3>Save ${slot}</h3>
                <p>${new Date(saveData.timestamp).toLocaleString()}</p>
                <p>Scene: ${storyData[saveData.currentScene].title}</p>
            `;
            
            const buttons = document.createElement('div');
            buttons.className = 'save-buttons';
            
            const loadBtn = document.createElement('button');
            loadBtn.textContent = 'Load';
            loadBtn.onclick = () => this.loadGameState(slot);
            
            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';
            saveBtn.onclick = () => this.saveGameState(slot);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => this.deleteSaveState(slot);
            
            buttons.appendChild(loadBtn);
            buttons.appendChild(saveBtn);
            buttons.appendChild(deleteBtn);
            
            slotElement.appendChild(screenshot);
            slotElement.appendChild(info);
            slotElement.appendChild(buttons);
        } else {
            slotElement.innerHTML = `
                <div class="empty-slot">
                    <h3>Empty Save Slot ${slot}</h3>
                    <button onclick="saveManager.saveGameState(${slot})">Save</button>
                </div>
            `;
        }
        
        return slotElement;
    }

    toggleSaveLoadMenu(show) {
        const menu = document.getElementById('save-load-menu');
        if (!menu) return;
        
        menu.style.display = show ? 'block' : 'none';
        if (show) {
            this.updateSaveSlots();
        }
    }

    updateSaveSlots() {
        const slotsContainer = document.querySelector('.save-slots');
        if (!slotsContainer) return;
        
        slotsContainer.innerHTML = '';
        for (let i = 1; i <= this.MAX_SAVE_SLOTS; i++) {
            const slot = this.createSaveSlot(i);
            slotsContainer.appendChild(slot);
        }
    }

    async saveGameState(slot) {
        const success = await this.saveGame(slot, window.visualNovelEngine);
        if (success) {
            this.updateSaveSlots();
            // Play save sound effect
            window.audioManager.playSFX('button_click');
        }
    }

    loadGameState(slot) {
        const saveData = this.loadGame(slot);
        if (saveData) {
            window.visualNovelEngine.loadGameState(saveData);
            this.toggleSaveLoadMenu(false);
            // Play load sound effect
            window.audioManager.playSFX('button_click');
        }
    }

    deleteSaveState(slot) {
        this.deleteSave(slot);
        this.updateSaveSlots();
        // Play delete sound effect
        window.audioManager.playSFX('button_click');
    }
}
