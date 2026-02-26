import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ContactEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
function generateRandomCredential(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function generateRandomSlug(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'MadMail API' }}));
  // ACCOUNTS / USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    const username = generateRandomCredential(8);
    const password = generateRandomCredential(12);
    const domain = "madmail.example.com"; // In production this comes from env/config
    const account = await UserEntity.create(c.env, { 
      id: crypto.randomUUID(), 
      name: (name?.trim() || username),
      password,
      email: `${username}@${domain}`
    });
    return ok(c, account);
  });
  // CONTACTS / SHARING
  app.post('/api/share', async (c) => {
    const { name, slug: requestedSlug, url } = (await c.req.json()) as { name?: string; slug?: string; url?: string };
    if (!url || !url.startsWith('https://i.delta.chat/#')) {
      return bad(c, 'لینک دع��ت معتبر DeltaChat الزامی است');
    }
    let slug = requestedSlug?.trim().toLowerCase() || generateRandomSlug(8);
    slug = slug.replace(/[^a-z0-9-]/g, '');
    if (slug.length < 3) slug = generateRandomSlug(8);
    const existing = new ContactEntity(c.env, slug);
    if (await existing.exists()) {
       slug = `${slug}-${generateRandomSlug(4)}`;
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
  // DELETE
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
}