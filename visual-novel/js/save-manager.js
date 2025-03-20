class SaveManager {
    constructor() {
        this.AUTO_SAVE_KEY = 'farsi_vn_autosave';
        this.SAVE_SLOTS_KEY = 'farsi_vn_save_slots';
        this.MAX_SAVE_SLOTS = 5;
    }

    saveGame(slotId = 'auto') {
        try {
            const gameState = {
                currentScene: window.visualNovelEngine.currentScene,
                currentDialogId: window.visualNovelEngine.currentDialogId,
                gameFlags: window.visualNovelEngine.gameFlags,
                timestamp: new Date().toISOString()
            };

            if (slotId === 'auto') {
                localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(gameState));
                console.log('Game auto-saved successfully');
            } else {
                const slots = this.getSaveSlots();
                slots[slotId] = gameState;
                localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(slots));
                console.log(`Game saved to slot ${slotId}`);
            }
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }

    loadGame(slotId = 'auto') {
        try {
            let savedState;
            if (slotId === 'auto') {
                const autoSave = localStorage.getItem(this.AUTO_SAVE_KEY);
                if (!autoSave) {
                    console.log('No auto-save found');
                    return null;
                }
                savedState = JSON.parse(autoSave);
            } else {
                const slots = this.getSaveSlots();
                if (!slots[slotId]) {
                    console.log(`No save found in slot ${slotId}`);
                    return null;
                }
                savedState = slots[slotId];
            }

            if (savedState && savedState.currentScene) {
                window.visualNovelEngine.loadGameState(savedState);
                console.log(`Game loaded from ${slotId === 'auto' ? 'auto-save' : `slot ${slotId}`}`);
                return savedState;
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
        return null;
    }

    getSaveSlots() {
        try {
            const slots = localStorage.getItem(this.SAVE_SLOTS_KEY);
            return slots ? JSON.parse(slots) : {};
        } catch (error) {
            console.error('Failed to get save slots:', error);
            return {};
        }
    }

    clearSave(slotId = 'auto') {
        try {
            if (slotId === 'auto') {
                localStorage.removeItem(this.AUTO_SAVE_KEY);
                console.log('Auto-save cleared');
            } else {
                const slots = this.getSaveSlots();
                delete slots[slotId];
                localStorage.setItem(this.SAVE_SLOTS_KEY, JSON.stringify(slots));
                console.log(`Save slot ${slotId} cleared`);
            }
        } catch (error) {
            console.error('Failed to clear save:', error);
        }
    }

    clearAllSaves() {
        try {
            localStorage.removeItem(this.AUTO_SAVE_KEY);
            localStorage.removeItem(this.SAVE_SLOTS_KEY);
            console.log('All saves cleared');
        } catch (error) {
            console.error('Failed to clear all saves:', error);
        }
    }
}
