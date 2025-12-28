# Contributing to VOLUTION

## Development Setup

### Prerequisites

- Node.js 20+
- Docker (for local PostgreSQL and Redis)
- Unity 2022.3 LTS
- Git with LFS enabled

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

4. Start the development database (requires Docker):
   ```bash
   docker-compose up -d postgres redis
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

### Unity Client Setup

1. Open Unity Hub
2. Add the `client` folder as a project
3. Ensure Unity 2022.3 LTS is selected
4. Open the project

## Code Style

### Backend (TypeScript)

- Use ESLint and Prettier (configs provided)
- Run `npm run lint` before committing
- Run `npm run format` to auto-fix formatting

### Unity (C#)

- Follow Unity coding conventions
- Use PascalCase for public members
- Use camelCase for private members

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Messages

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

Example:
```
feat: add economic policy decision system

- Implement fiscal policy options
- Add inflation/unemployment trade-offs
- Connect to social group satisfaction
```

## Testing

### Backend

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Project Structure

```
vanguard/
├── backend/           # Node.js + Fastify API
│   ├── src/
│   │   ├── api/       # Routes and controllers
│   │   ├── config/    # Configuration files
│   │   ├── middleware/# Express middleware
│   │   ├── services/  # Business logic
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utilities
│   └── tests/         # Test files
├── client/            # Unity project
│   ├── Assets/
│   │   ├── Scripts/   # C# game scripts
│   │   ├── Prefabs/   # Reusable game objects
│   │   ├── Scenes/    # Unity scenes
│   │   └── UI/        # UI assets
│   └── ProjectSettings/
├── docs/              # Game design documents
│   ├── data/          # Game data (countries, events)
│   └── *.md           # Design documents
└── infrastructure/    # Terraform configs
```

## Questions?

Open an issue for any questions about contributing.
