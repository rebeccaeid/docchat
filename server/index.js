import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret',
  resave: false,
  saveUninitialized: false,
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is alive' });
});

app.post('/api/register', async (req, res) => {
  const { email, name, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, name, password: hash },
    });
    req.session.userId = user.id;
    res.json({ id: user.id, name: user.name });
  } catch (e) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'No such user' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Wrong password' });

  req.session.userId = user.id;
  res.json({ id: user.id, name: user.name });
});

app.get('/api/me', async (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
  res.json({ user: user ? { id: user.id, name: user.name } : null });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));