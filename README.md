# GoldenCity

A full-stack TypeScript monorepo demonstrating modern web3 authentication practices for real-world asset investment platforms. This demo project showcases wallet connection and a stub for a KYC workflow.

**Live Demo:** https://goldencity-ymzw2sanaa-uc.a.run.app/

## Overview

GoldenCity is a demonstration project that democratizes real estate investment through blockchain technology. In a finished product, users would connect their crypto wallets, complete KYC verification, and invest in fractional property ownership using cryptocurrency. This project is a stub for a real-world asset investment platform.

## Architecture

### Monorepo Structure

The project follows a classic JavaScript/TypeScript monorepo structure:

```text
goldencity/
├── apps/                      # Application servers and clients
│   ├── goldencity-api/        # Express.js API server
│   └── goldencity-web/        # React Router V7 web application
├── packages/                  # Shared packages
│   ├── contracts-goldencity/  # Shared Zod schemas
│   └── goldencity-utils-node/ # Node.js utilities
└── docker/                    # Docker configurations
```

### Key Technologies

- **TypeScript**: End-to-end TypeScript across API, web client, and shared packages
- **React Router V7**: Framework mode with SSR support and pre-rendering for static pages
- **Wagmi**: Multi-wallet support (MetaMask, Coinbase Wallet, etc.)
- **SIWE (Sign-In with Ethereum)**: Web3 authentication compatible with mobile apps
- **Automatic User Creation**: When a user connects their wallet, their address is automatically searched in the database and a new user record is created if not found
- **Session Management**: Cookie-based session handling for authenticated API requests
- **Supabase**: PostgreSQL database with migration-based schema management
- **Express.js**: RESTful API server with middleware stack

### Database Schema

Supabase migrations manage incremental schema changes:

- **Users Table**: Stores wallet addresses, KYC status, and onboarding completion
- **Sessions Table**: Manages user authentication sessions

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Yarn 4.9.2 (package manager)
- Supabase CLI (for local development)
- Docker (for containerized builds)

### Development

```bash
# Install dependencies
yarn install

# Run type checking
yarn typecheck

# Run individual services
cd apps/goldencity-api && yarn dev
cd apps/goldencity-web && yarn dev

# Build the applications
yarn build
```

### Environment Variables

The API server requires environment variables for:

- Database connection (Supabase)
- CORS origins
- SIWE domain configuration
- Server host/port

See `apps/goldencity-api/src/config.ts` for required environment variables.

### Database Migrations

```bash
# Apply migrations locally
cd apps/goldencity-api
yarn supabase migration up
```

Migrations are located in `apps/goldencity-api/supabase/migrations/`.

## Deployment

Dockerfiles are located in `docker/goldencity-api/` and `docker/goldencity-web/`.

## Demo Limitations

This is a demo project. Next steps include:

- Adding comprehensive test coverage
- Implementing full feature-oriented API architecture where each feature has its own controller, middleware, routes, service, and OpenAPI definitions
- Enhancing the web UI with more sophisticated components
- Adding monitoring and observability
- Implementing rate limiting and security hardening
- Adding API documentation (OpenAPI/Swagger) with Swagger UI

## License

```text
MIT License

Copyright (c) 2026 Damon Revoe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
