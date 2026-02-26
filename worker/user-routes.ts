import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ContactEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
/**
 * Secure random string generator for passwords and IDs.
 * Uses bitmasking to avoid modulo bias.
 */
function secureRandomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // ALIAS ROUTES FOR GO SPECIFICATION
  app.post('/new', async (c) => createUser(c));
  app.post('/share', async (c) => createShare(c));
  app.get('/qr', async (c) => ok(c, { message: '��ز پروتکل dclogin: برای نمایش QR کد استفاده کنید' }));
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
  // Dynamic mux pattern for public links
  app.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const reserved = ['api', 'docs', 'info', 'share', 'security', 'deploy', 'health'];
    if (reserved.includes(slug)) {
      return c.notFound();
    }
    return getContact(c);
  });
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
}
async function createUser(c: any) {
  const { name } = (await c.req.json()) as { name?: string };
  const username = secureRandomString(8);
  const password = secureRandomString(12);
  // Synchronized with src/lib/config.ts simulation
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
  let slug = requestedSlug?.trim().toLowerCase() || secureRandomString(8);
  slug = slug.replace(/[^a-z0-9-]/g, '');
  if (slug.length < 3) slug = secureRandomString(8);
  const existing = new ContactEntity(c.env, slug);
  if (await existing.exists()) {
     slug = `${slug}-${secureRandomString(4)}`;
  }
  const contact = await ContactEntity.create(c.env, {
    id: slug,
    name: name?.trim() || 'کاربر ناشناس',
    url: url.trim()
  });
  return ok(c, { slug: contact.id });
}
async function getContact(c: any) {
  const slug = c.req.param('slug');
  const contact = new ContactEntity(c.env, slug);
  if (!(await contact.exists())) {
    return notFound(c, 'لینک ��شتراک یافت نشد');
  }
  return ok(c, await contact.getState());
}