# Angular Todo App

A full-stack todo application with Angular frontend, GraphQL server, and PostgreSQL database.

## Tech Stack

- **Frontend**: Angular 21 with Apollo Client
- **Backend**: Apollo Server with GraphQL
- **Database**: PostgreSQL with Drizzle ORM
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development without Docker)

### Running with Docker

```bash
docker-compose up --build
```

Or run in detached mode:

```bash
docker-compose up --build -d
```

Services will be available at:
- **Client**: http://localhost:4200
- **Server**: http://localhost:4000
- **PostgreSQL**: localhost:5432

### Running Locally

```bash
# Start PostgreSQL with Docker
docker-compose up postgres

# Install dependencies
cd server && npm install
cd client && npm install

# Start server (with hot reload)
cd server && npm start

# Start client (in another terminal)
cd client && ng serve
```

## Project Structure

```
├── client/                 # Angular frontend
│   ├── src/
│   │   └── app/
│   │       ├── components/ # Angular components
│   │       ├── services/   # Apollo Client services
│   │       ├── graphql/    # GraphQL queries & mutations
│   │       └── models/     # TypeScript interfaces
│   ├── angular.json        # Angular configuration
│   └── package.json
│
├── server/                 # GraphQL server
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts   # Drizzle schema
│   │   │   └── index.ts    # Database connection
│   │   ├── resolvers.ts    # GraphQL resolvers
│   │   └── schema.ts       # GraphQL type definitions
│   ├── drizzle.config.ts   # Drizzle configuration
│   ├── nodemon.json        # Hot reload configuration
│   └── package.json
│
├── docker-compose.yml      # Docker services configuration
└── README.md
```

## Database Schema

The `todos` table has the following fields:
- `id` (UUID) - Primary key
- `title` (text) - Todo title
- `completed` (boolean) - Completion status
- `completedAt` (timestamp) - When the todo was completed
- `createdAt` (timestamp) - Creation timestamp
- `updatedAt` (timestamp) - Last update timestamp

## Todo Ordering

Todos are ordered as follows:
1. Uncompleted todos first (by createdAt ascending)
2. Completed todos last (by completedAt descending)

## Hot Reload

Both frontend and backend support hot reload in Docker:

- **Server**: Uses nodemon with polling - changes to `server/src` auto-restart
- **Client**: Uses Angular's dev server with polling - changes to `client/src` auto-rebuild

The polling configuration is set in:
- `server/nodemon.json` - Server file watching
- `client/angular.json` - Client file watching (poll: 2000ms)

To rebuild after configuration changes:

```bash
docker-compose down && docker-compose up --build
```

## Available Scripts

### Server
```bash
cd server
npm start              # Start with hot reload (nodemon)
npx drizzle-kit push   # Push schema changes to database
```

### Client
```bash
cd client
ng serve               # Start development server
ng build               # Build for production
```

## Environment Variables

Create a `.env` file in the `server` directory:

```env
DATABASE_URL=postgresql://todouser:todopass@localhost:5432/tododb
```

## Docker Services

| Service   | Port | Description          |
|-----------|------|----------------------|
| client    | 4200 | Angular dev server   |
| server    | 4000 | GraphQL Apollo Server|
| postgres  | 5432 | PostgreSQL database  |

## Database Credentials

The default database credentials (configured in docker-compose.yml):
- **User**: todouser
- **Password**: todopass
- **Database**: tododb
