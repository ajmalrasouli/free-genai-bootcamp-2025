# Farsi MUD Frontend

A React-based terminal interface for the Farsi Text Adventure MUD game, implementing the frontend portion of the command flow: User Input → Parser → Game Engine → Response Gen → UI.

## Features

- **Terminal Emulation**: 
  - Rich terminal-like interface using Textual.js
  - Mixed LTR/RTL text rendering with proper Farsi character support
  - Farsi words displayed in yellow, verbs in cyan
  - Bold formatting for emphasized Farsi words
  - Maximum response time < 200ms for commands

- **Command System**:
  - Full support for all 13 commands:
    - Navigation: `Look`, `Move`
    - Item Interaction: `Take`, `Drop`, `Use`, `Give`
    - Object Interaction: `Open`, `Close`
    - Character Actions: `Eat`, `Drink`, `Talk`
    - System: `Inventory`, `Help`
  - Command format: `[Verb] [Farsi Word] (on/to [Farsi Word])?`
  - Command history navigation with ↑/↓ keys
  - Regex-based command validation

- **Game State Management**:
  - Real-time room state updates
  - Dynamic inventory tracking
  - NPC and item state management
  - Save/Load game state functionality
  - Procedural content rendering

## Tech Stack

- **React 18** with TypeScript for type safety
- **Vite** for development and building
- **Textual.js** for terminal emulation
- **RTL Support Libraries** for proper Farsi text handling
- **Performance Target**: < 100MB memory usage for 500+ vocabulary words

## Project Structure
```
src/
├── components/
│   ├── Terminal/           # Terminal emulation
│   │   ├── CommandLine/    # Command input and validation
│   │   ├── Display/        # Text display with RTL support
│   │   └── History/        # Command history (↑/↓ navigation)
│   ├── Game/
│   │   ├── Room/          # Room state and description
│   │   ├── Inventory/     # Player inventory management
│   │   ├── NPCs/          # NPC interaction components
│   │   └── State/         # Game state management
│   └── UI/                # Common UI components
├── services/
│   ├── parser/           # Command parsing (regex-based)
│   ├── gameState/        # State management and persistence
│   ├── vocabulary/       # Farsi word validation and display
│   └── api/             # Backend communication
├── utils/
│   ├── rtl/             # RTL text handling
│   ├── formatting/      # Text formatting and colors
│   └── validation/      # Input validation
└── types/               # TypeScript definitions
    ├── commands.ts      # Command interface types
    ├── game.ts         # Game state types
    ├── items.ts        # Item and inventory types
    └── rooms.ts        # Room and NPC types
```

## Terminal Display Format
```plaintext
------------------------------
[Room Name] 
[Description with **Farsi** words in yellow] 
Items: **فارسی** (translation), **فارسی** (translation)
NPCs: **فارسی** (description)
Exits: North, East 
------------------------------
> [Command Input in cyan]
```

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Development Guidelines

### Command Processing
- Validate commands using regex pattern:
  ```js
  /^(?P<verb>\w+)\s+(?P<target>\S+)(?:\s+(on|to)\s+(?P<recipient>\S+))?$/
  ```
- Ensure proper RTL rendering for Farsi words
- Maintain < 200ms response time for command processing

### State Management
- Track player inventory (array of Item objects)
- Manage room connections (graph structure)
- Handle item/NPC states (locked, hidden, etc.)
- Implement save/load functionality

### Testing
- Unit tests for command parsing
- RTL rendering tests
- Performance tests under load (500+ vocabulary words)

## ESLint Configuration

```js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Add tests for new functionality
4. Ensure RTL support is maintained
5. Submit a pull request

## License

This project is licensed under the MIT License.
