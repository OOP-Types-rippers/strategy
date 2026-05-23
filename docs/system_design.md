# System Design: Strategy Game Engine

## 1. Overview
The "Strategy" game engine is built with a highly decoupled, modular architecture in TypeScript. By strictly separating core game rules, data structures, and input/output boundaries, the system ensures high testability and flexibility. The architecture heavily relies on Dependency Injection and the Memento design pattern for state management.

## 2. Module Architecture
The codebase (located in `src/`) is divided into clear functional domains:

### Core (`src/core`)
- **`GameController`**: The central orchestrator of the game. It manages the turn-based flow, resolves actions (movement, attacking), tracks the active faction, and enforces win conditions. It also acts as the caretaker for the game's state history.

### Map (`src/map`)
- **`GameMap`**: Represents the game world as a 2D spatial grid (`ITile[][]`). It is responsible for storing terrain data, tracking entity and building occupancy, and calculating movement and attack ranges (utilizing Breadth-First Search for distance calculations).
- Map generation is handled by specialized utilities (`MapGenerator`, `NoiseFunction`, `Seed`).

### Entities (`src/entities`)
- **`Entity`**: The base class for all game units, managing combat statistics (HP, Attack, Defense), movement points, and combat resolution (`takeDamage`, `toAttack`).
- Derived classes (e.g., `Soldier`, `Archer`, `Lizard`, `Wizard`, `Knight`, `Golem`) define unit ids (used for rendering) and specific base stats and unique traits (e.g., `Lizard` has specific `UnitTerrainStats` for moving through water).

### IO and Interfaces (`src/io` & `src/types`)
- **Input Controllers**: Handles issuing commands on a faction's turn. Supports both human players (`HumanInputController`) and bots (`RobotInputController`).
- **Game Saving (`FSGameSaver`)**: Serializes the game state to JSON files on the local filesystem.
- **Types (`src/types`)**: Defines strict TypeScript interfaces (e.g., `IGameMap`, `IRenderer`, `IGameState`) acting as contracts between modules to prevent tight coupling.

## 3. GameMap & Frontend Integration
Based on the technical specifications (`ТЗ GameMap.txt`), the visual layer is treated as an independent layer:
- **Dependency Injection**: The core business logic operates purely on data models. The frontend implements the `IRenderer` interface (e.g., an HTML Canvas renderer). This isolates the core engine, allowing the visual engine to be swapped or tested without graphical overhead.
- **Reverse Coordinate Conversion**: Because the Canvas is a pixel array, user interactions (mouse clicks) are converted back into logical grid coordinates. This formula accounts for camera pan and zoom, sending logical `(x, y)` coordinates to the `GameController` to resolve tile selection or unit actions.

## 4. Key Design Patterns
- **Dependency Injection**: Renderers, Savers, and Input Controllers are injected into the `GameController` upon instantiation. The engine does not care *how* it is rendered or *how* input is received.
- **Memento**: The system supports saving, loading, and turn-rollback capabilities. The `GameController`, `GameMap`, and `Entity` classes implement `getState()` and `restoreFromState()` methods. This allows the system to snapshot the entire simulation into an `IGameState` object, append it to a history stack, or persist it via `FSGameSaver`.
- **Strategy / State**: Handled implicitly through different input controllers (AI vs Human) managing the turn phases.
