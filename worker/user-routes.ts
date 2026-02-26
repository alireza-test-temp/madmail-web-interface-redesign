import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
function generateRandomSlug(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CONTACTS / SHARING
  app.post('/api/share', async (c) => {
    const { name, slug: requestedSlug, url } = (await c.req.json()) as { name?: string; slug?: string; url?: string };
    if (!url || !url.startsWith('https://i.delta.chat/#')) {
      return bad(c, 'لینک دعوت معتبر DeltaChat الزامی است');
    }
    let slug = requestedSlug?.trim().toLowerCase() || generateRandomSlug(8);
    // Sanitize slug
    slug = slug.replace(/[^a-z0-9-]/g, '');
    if (slug.length < 3) slug = generateRandomSlug(8);
    // Collision check for random slugs
    let attempts = 0;
    while (attempts < 10) {
      const existing = new ContactEntity(c.env, slug);
      if (!(await existing.exists())) break;
      slug = generateRandomSlug(8);
      attempts++;
    }
    const contact = await ContactEntity.create(c.env, {
      id: slug,
      name: name?.trim() || '',
      url: url.trim()
    });
    return ok(c, { slug: contact.id });
  });
  app.get('/api/contact/:slug', async (c) => {
    const slug = c.req.param('slug');
    const contact = new ContactEntity(c.env, slug);
    if (!(await contact.exists())) {
      return notFound(c, 'لینک یافت نشد');
    }
    return ok(c, await contact.getState());
  });
  // CHATS (Existing)
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // DELETE
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
}