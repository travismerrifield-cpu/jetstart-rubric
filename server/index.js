import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { db, initDb } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── List sessions ─────────────────────────────────────────────────────────────
app.get('/api/sessions', async (_req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, trainer, cohort_name, dates, created_at, updated_at FROM sessions ORDER BY updated_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Create session ────────────────────────────────────────────────────────────
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      trainer = '',
      cohort_name = '',
      dates = '',
      students = Array.from({ length: 12 }, (_, i) => `Student ${i + 1}`),
      grades = {},
      notes = {},
    } = req.body;

    const { rows } = await db.query(
      `INSERT INTO sessions (trainer, cohort_name, dates, students, grades, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [trainer, cohort_name, dates, JSON.stringify(students), JSON.stringify(grades), JSON.stringify(notes)]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get session ───────────────────────────────────────────────────────────────
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM sessions WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Update session ────────────────────────────────────────────────────────────
app.put('/api/sessions/:id', async (req, res) => {
  try {
    const { trainer, cohort_name, dates, students, grades, notes } = req.body;
    const { rows } = await db.query(
      `UPDATE sessions SET
        trainer     = COALESCE($1, trainer),
        cohort_name = COALESCE($2, cohort_name),
        dates       = COALESCE($3, dates),
        students    = COALESCE($4, students),
        grades      = COALESCE($5, grades),
        notes       = COALESCE($6, notes),
        updated_at  = NOW()
       WHERE id = $7 RETURNING *`,
      [
        trainer ?? null,
        cohort_name ?? null,
        dates ?? null,
        students ? JSON.stringify(students) : null,
        grades   ? JSON.stringify(grades)   : null,
        notes    ? JSON.stringify(notes)    : null,
        req.params.id,
      ]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Delete session ────────────────────────────────────────────────────────────
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sessions WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Serve built frontend in production ────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  await initDb();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
