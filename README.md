# VOLUTION

**O destino gira. Você decide.**

A geopolitical grand strategy game where you lead a nation through the complexities of modern statecraft.

## Overview

VOLUTION is a mobile strategy game that puts you in control of a major world power. Navigate economics, diplomacy, internal politics, and military affairs while managing the expectations of diverse social groups within your country.

### Playable Countries

- 🇧🇷 **Brazil** - Emerging power balancing development and social demands
- 🇺🇸 **USA** - Superpower managing global influence and domestic polarization
- 🇨🇳 **China** - Rising power balancing growth with control
- 🇷🇺 **Russia** - Regional power navigating sanctions and strategic interests
- 🇮🇳 **India** - Diverse democracy managing rapid development
- 🇿🇦 **South Africa** - Rainbow nation confronting inequality and infrastructure

## Tech Stack

- **Client**: Unity 2022.3 LTS (C#)
- **Backend**: Node.js + Fastify + TypeScript
- **Database**: PostgreSQL + Redis
- **AI**: Claude API (Anthropic) for narrative and advisor features
- **Vector DB**: Pinecone for semantic search

## Project Structure

```
├── backend/           # API server
├── client/            # Unity game client
├── docs/              # Game design documents
│   ├── data/          # Country data, events
│   └── GDD-*.md       # Design documents
└── infrastructure/    # Terraform configs
```

## Getting Started

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup instructions.

### Quick Start (Backend)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Documentation

- [Game Design Document](./docs/README.md)
- [Technical Architecture](./docs/GDD-technical-architecture.md)
- [Implementation Plan](./docs/GDD-implementation-plan.md)
- [NPC AI Logic](./docs/GDD-npc-ai-logic.md)

## Status

🚧 **In Development** - Phase 0: Project Setup

## License

UNLICENSED - Private repository
