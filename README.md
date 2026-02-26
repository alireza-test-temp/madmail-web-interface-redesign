# Cloudflare Workers Full-Stack Chat Demo

[cloudflarebutton]

A production-ready full-stack chat application built with Cloudflare Workers, Durable Objects for scalable entity storage (Users, Chats, Messages), React, Vite, Tailwind CSS, and shadcn/ui. Demonstrates real-time messaging, indexed entity listing, CRUD operations, and seamless deployment to Cloudflare's global edge network.

## Features

- **Scalable Entity Storage**: One Durable Object per User/Chat with automatic indexing for efficient listing and pagination.
- **Real-Time Chat**: Serverless chat boards storing messages directly in Durable Objects.
- **Modern UI**: Responsive design with shadcn/ui components, Tailwind CSS, dark mode, and animations.
- **Type-Safe APIs**: Shared TypeScript types between frontend and worker, Hono routing.
- **React Query Integration**: Optimistic updates, caching, and infinite scrolling.
- **Error Handling & Observability**: Client/server error reporting, structured logging.
- **Seed Data**: Pre-populated mock users, chats, and messages for instant demo.
- **Mobile-Responsive**: Hooks for mobile detection, sidebar collapse.

## Tech Stack

- **Backend**: Cloudflare Workers, Durable Objects, Hono
- **Frontend**: React 18, Vite, TypeScript, TanStack Query
- **UI**: shadcn/ui, Tailwind CSS, Lucide icons, Framer Motion
- **State & Forms**: Zustand, React Hook Form, Zod
- **Other**: Immer, Sonner (toasts), Recharts

## Quick Start

1. **Install Dependencies**
   ```bash
   bun install
   ```

2. **Development**
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`).

3. **Build & Preview**
   ```bash
   bun run build
   bun run preview
   ```

4. **Type Generation**
   ```bash
   bun run cf-typegen
   ```

## Usage Examples

### API Endpoints (via Hono in `worker/user-routes.ts`)

- `GET /api/users` - List users (paginated)
- `POST /api/users` - Create user `{ "name": "John" }`
- `GET /api/chats` - List chats
- `POST /api/chats` - Create chat `{ "title": "My Chat" }`
- `GET /api/chats/:chatId/messages` - Get messages
- `POST /api/chats/:chatId/messages` - Send message `{ "userId": "u1", "text": "Hello" }`

### Frontend Integration

Uses `api-client.ts` for type-safe fetches:
```tsx
import { api } from '@/lib/api-client';
const users = await api<User[]>('/api/users');
```

Extend entities in `worker/entities.ts` and routes in `worker/user-routes.ts`.

## Development Workflow

- **Frontend**: Edit `src/` – hot reloads automatically.
- **Worker**: Edit `worker/` – `bun run dev` rebuilds and proxies `/api/*`.
- **Custom Routes**: Add to `worker/user-routes.ts` (auto-loaded dynamically).
- **Entities**: Extend `IndexedEntity` in `worker/entities.ts` for new models.
- **Styling**: Tailwind config in `tailwind.config.js`.
- **Linting**: `bun run lint`
- **Seeds**: Run `UserEntity.ensureSeed(env)` on first deploy.

Proxied assets serve the Vite-built SPA. APIs hit the Worker first.

## Deployment

Deploy to Cloudflare Workers with one command:

```bash
bun run deploy
```

This builds the frontend, bundles the Worker, and deploys both. Assets are automatically served from KV (SPA mode).

Configure via `wrangler.jsonc`:
- Durable Objects: `GlobalDurableObject`
- Migrations: SQLite-backed storage

[cloudflarebutton]

## License

MIT – see [LICENSE](LICENSE) (add if needed).