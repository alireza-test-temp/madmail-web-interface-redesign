import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ContactEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
function generateRandomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ALIAS ROUTES FOR GO SPECIFICATION
  app.post('/new', async (c) => createUser(c));
  app.post('/share', async (c) => createShare(c));
  app.get('/qr', async (c) => ok(c, { message: 'Use dclogin: protocol for QR' }));
  // ORIGINAL API ROUTES
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => createUser(c));
  app.post('/api/share', async (c) => createShare(c));
  app.get('/api/contact/:slug', async (c) => getContact(c));
  app.get('/:slug', async (c) => getContact(c)); // Dynamic mux pattern
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
}
async function createUser(c: any) {
  const { name } = (await c.req.json()) as { name?: string };
  const username = generateRandomString(8);
  const password = generateRandomString(12);
  const domain = "madmail.example.com";
  const account = await UserEntity.create(c.env, {
    id: crypto.randomUUID(),
    name: (name?.trim() || username),
    password,
    email: `${username}@${domain}`
  });
  return ok(c, account);
}
async function createShare(c: any) {
  const { name, slug: requestedSlug, url } = (await c.req.json()) as { name?: string; slug?: string; url?: string };
  if (!url || !url.startsWith('https://i.delta.chat/#')) {
    return bad(c, 'لینک دعوت معتبر DeltaChat الزامی است');
  }
  let slug = requestedSlug?.trim().toLowerCase() || generateRandomString(8);
  slug = slug.replace(/[^a-z0-9-]/g, '');
  if (slug.length < 3) slug = generateRandomString(8);
  const existing = new ContactEntity(c.env, slug);
  if (await existing.exists()) {
     slug = `${slug}-${generateRandomString(4)}`;
  }
  const contact = await ContactEntity.create(c.env, {
    id: slug,
    name: name?.trim() || '',
    url: url.trim()
  });
  return ok(c, { slug: contact.id });
}
async function getContact(c: any) {
  const slug = c.req.param('slug');
  if (slug === 'api' || slug === 'docs') return c.notFound();
  const contact = new ContactEntity(c.env, slug);
  if (!(await contact.exists())) {
    return notFound(c, 'لینک یافت نشد');
  }
  return ok(c, await contact.getState());
}