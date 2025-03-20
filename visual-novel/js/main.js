// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    
    // Create global game instance
    window.visualNovelEngine = new VisualNovelEngine();
    
    // Set up volume control listeners
    document.getElementById('bgm-volume').addEventListener('input', (e) => {
        window.visualNovelEngine.audioManager.setVolume('bgm', e.target.value);
    });
    
    document.getElementById('sfx-volume').addEventListener('input', (e) => {
        window.visualNovelEngine.audioManager.setVolume('sfx', e.target.value);
    });
    
    document.getElementById('dialog-volume').addEventListener('input', (e) => {
        window.visualNovelEngine.audioManager.setVolume('dialog', e.target.value);
    });
    
    // Set up menu button handlers
    document.getElementById('save-button').addEventListener('click', () => {
        window.visualNovelEngine.saveManager.saveGame();
    });
    
    document.getElementById('load-button').addEventListener('click', () => {
        window.visualNovelEngine.saveManager.loadGame();
    });
    
    // Load saved game state or start new game
    const savedState = localStorage.getItem('farsi_vn_autosave');
    if (savedState) {
        try {
            console.log('Found saved state, attempting to load...');
            const state = JSON.parse(savedState);
            window.visualNovelEngine.loadGameState(state);
        } catch (error) {
            console.warn('Failed to load autosave:', error);
            console.log('Starting new game with scene001...');
            window.visualNovelEngine.loadScene('scene001', '0');
        }
    } else {
        console.log('No saved state found, starting new game with scene001...');
        window.visualNovelEngine.loadScene('scene001', '0');
    }
});
