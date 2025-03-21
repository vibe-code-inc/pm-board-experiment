# PM Board - Task Management Application

PM Board is a modern task management application built with React and TypeScript that helps users organize and track tasks across different projects.

## Features

- **Project Management**: Create and manage multiple projects
- **Task Organization**: Organize tasks by status (todo, in-progress, done)
- **Kanban Board**: Visual kanban-style interface for task management
- **Drag and Drop**: Intuitive drag-and-drop functionality for status updates
- **Task Details**: Track priorities, assignees, due dates, and descriptions
- **Responsive Design**: Works seamlessly across devices of all sizes

## Screenshots

*(Screenshots will be added once the UI is finalized)*

## Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
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
      /design_kit - Design system components
    /features - Complex reusable UI components
      /task_card - Task card component
      /task_modal - Task creation/editing modal
  /lib - Utility functions and helpers
  /types.ts - Type definitions
  /app.tsx - Main application
  /main.tsx - Entry point
```

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

- File and directory names use snake_case
- Components use functional component syntax with TypeScript interfaces
- Absolute imports with @/ prefix
- ESLint rules are enforced for code quality
- All features must have corresponding specifications
- Color coding for priorities and statuses is standardized

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern kanban tools like Trello and Jira
- Built on the shoulders of the amazing React ecosystem
- Designed for developers who value clean code and type safety
