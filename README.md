# PM Board - Task Management Application

PM Board is a modern task management application built with React and TypeScript that helps users organize and track tasks across different projects. This application follows specification-first development principles with a strong focus on engineering best practices.

## Features

- **Project Management**: Create and manage multiple projects
- **Task Organization**: Organize tasks by status (todo, in-progress, done)
- **Kanban Board**: Visual kanban-style interface for task management
- **Drag and Drop**: Intuitive drag-and-drop functionality for status updates
- **Task Details**: Track priorities, assignees, due dates, and descriptions
- **Responsive Design**: Works seamlessly across devices of all sizes
- **Type Safety**: Strong TypeScript typing throughout the codebase

## Screenshots

*(Screenshots will be added once the UI is finalized)*

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge
- **Build Tool**: Vite
- **Package Manager**: npm
- **Code Quality**: ESLint, TypeScript

## Project Structure

```
/src
  /features - Feature-specific modules
    /project_board - Project board components and logic
    /task_management - Task CRUD operations and management
  /ui - UI components
    /base - Primitive UI components
    /features - Feature-specific UI components
  /lib - Utility functions and helpers
    /utils.ts - Common utility functions
    /hooks - Custom React hooks
    /drag_drop - Drag and drop functionality
  /types - Type definitions
  /app.tsx - Main application
  /main.tsx - Entry point
  /*.specs.md - Specification files
```

## Development Principles

PM Board follows a strict specification-first development process:

1. **Specification-First Development**: All code is written based on detailed specifications
2. **Single Responsibility Principle**: Each component has one clear responsibility
3. **Type Safety**: Rigorous TypeScript typing with minimal use of type assertions
4. **Component Extension**: Components are designed for extension without modification
5. **Interface Segregation**: Props interfaces are focused and specific
6. **Dependency Inversion**: High-level modules depend on abstractions

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/pm-board-experiment.git
   cd pm-board-experiment
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

### Coding Conventions

PM Board follows specific coding conventions:

- **File and directory names**: Use snake_case
- **Component definition**: Use React.FC with explicit props type
- **Import paths**: Use absolute imports with @/ prefix
- **Event handlers**: Prefix with 'handle'
- **Styling**: Use className with Tailwind CSS utilities and cn utility for conditionals
- **Type definitions**: Use types instead of interfaces for most cases
- **State and parameters**: Use explicit type annotations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern kanban tools like Trello and Jira
- Built with an emphasis on clean architecture and maintainable code
- Designed for developers who value specification-first development and type safety
