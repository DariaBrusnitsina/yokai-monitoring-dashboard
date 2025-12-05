# Yokai Monitoring Dashboard

Real-time monitoring dashboard for spiritual anomalies (yokai) in Tokyo.

## Features

- Real-time monitoring of yokai (spiritual anomalies)
- Capture functionality with optimistic updates
- Server-Sent Events (SSE) for live threat level updates
- Feature Sliced Design (FSD) architecture
- Built with Next.js 14 (App Router), React 18, TanStack Query, and Zod

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18+
- **State Management**: TanStack Query
- **Validation**: Zod
- **Styling**: SCSS Modules
- **Architecture**: Feature Sliced Design (FSD)

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Docker

```bash
docker-compose up
```

## Project Structure

```
dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API Route Handlers
│   ├── monitoring/        # Monitoring page
│   └── layout.tsx         # Root layout
├── shared/                # Shared code (FSD)
│   ├── api/              # API clients
│   ├── lib/              # Utilities
│   └── types/            # Type definitions
├── entities/             # Business entities (FSD)
│   └── yokai/           # Yokai entity
├── widgets/              # UI widgets (FSD)
│   ├── yokai-card/      # Yokai card component
│   └── yokai-list/      # Yokai list component
└── features/             # Page components (FSD)
    └── monitoring/       # Monitoring page component
```

## API Endpoints

- `GET /api/yokai` - Get list of all yokai
- `POST /api/yokai/[id]/capture` - Capture a yokai (30% failure rate)
- `GET /api/yokai/stream` - SSE stream for real-time updates

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

Test suite includes:
- **Components**: Tests for YokaiCard and YokaiList components
- **Hooks**: Tests for useYokaiSSE (SSE real-time updates)
- **E2E**: Playwright tests for full user flows
