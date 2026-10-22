import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'skype@123';
const TOKEN_SECRET = process.env.ADMIN_SECRET || crypto.createHash('sha256').update(`skype:${ADMIN_PASSWORD}`).digest('hex');
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const ROOT = process.cwd();
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const DATA_DIR = path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'gallery.json');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

interface MediaItem {
  id: string;
  file: string;
  type: 'photo' | 'video';
  caption: string;
  trip: string;
  uploadedAt: string;
}

const readDb = (): MediaItem[] => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch {
    return [];
  }
};
const writeDb = (items: MediaItem[]) => fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2));

// --- Auth: stateless HMAC-signed token ---
const sign = (payload: string) => crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('hex');
const issueToken = () => {
  const payload = Buffer.from(JSON.stringify({ u: ADMIN_USERNAME, exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
};
const verifyToken = (token?: string) => {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
};
const safeEqual = (a: string, b: string) => {
  const ha = crypto.createHash('sha256').update(a).digest();
  const hb = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
};

const requireAdmin: express.RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

// --- Uploads ---
const ALLOWED = /^(image\/(jpeg|png|webp|gif)|video\/(mp4|webm|quicktime))$/;
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '') || '';
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024, files: 20 },
  fileFilter: (_req, file, cb) => cb(null, ALLOWED.test(file.mimetype)),
});

async function main() {
  const app = express();
  app.use(express.json());

  app.post('/api/admin/login', (req, res) => {
    const { username = '', password = '' } = req.body || {};
    if (safeEqual(String(username), ADMIN_USERNAME) && safeEqual(String(password), ADMIN_PASSWORD)) {
      return res.json({ token: issueToken() });
    }
    res.status(401).json({ error: 'Invalid username or password' });
  });

  app.get('/api/gallery', (_req, res) => {
    res.json(readDb().sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt)));
  });

  app.post('/api/gallery', requireAdmin, upload.array('files', 20), (req, res) => {
    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length === 0) return res.status(400).json({ error: 'No valid photo or video files uploaded' });
    const caption = String(req.body.caption || '').slice(0, 200);
    const trip = String(req.body.trip || '').slice(0, 100);
    const added: MediaItem[] = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f.filename,
      type: f.mimetype.startsWith('video/') ? 'video' : 'photo',
      caption,
      trip,
      uploadedAt: new Date().toISOString(),
    }));
    writeDb([...readDb(), ...added]);
    res.json(added);
  });

  app.delete('/api/gallery/:id', requireAdmin, (req, res) => {
    const items = readDb();
    const item = items.find((i) => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    fs.rmSync(path.join(UPLOAD_DIR, path.basename(item.file)), { force: true });
    writeDb(items.filter((i) => i.id !== item.id));
    res.json({ ok: true });
  });

  app.use('/uploads', express.static(UPLOAD_DIR, { index: false, dotfiles: 'deny' }));

  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(400).json({ error: err?.message || 'Request failed' });
  });

  if (isProd) {
    const dist = path.join(ROOT, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Skype Tours server running on http://localhost:${PORT}`));
}

main();
