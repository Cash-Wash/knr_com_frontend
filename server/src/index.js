const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Données en mémoire (scaffold)
let users = [
  { id: 'u1', name: 'Alice', email: 'alice@knr.com', role: 'editor', active: true },
  { id: 'u2', name: 'Boubacar', email: 'boubacar@knr.com', role: 'presenter', active: true },
  { id: 'u3', name: 'Fatou', email: 'fatou@knr.com', role: 'admin', active: true }
];

let emissions = [
  { id: 'e1', titre: 'Business Africa — Épisode 12', date: '2026-07-10', vues: '4.2K' },
  { id: 'e2', titre: 'Tech Talk — L\'IA en Afrique', date: '2026-07-09', vues: '3.1K' }
];

let reunions = [
  { id: 'r1', titre: 'Réu. équipe édito', heure: '2026-07-12 10:00', participants: 5 }
];

app.get('/api/users', (req, res) => res.json(users));
app.get('/api/emissions', (req, res) => res.json(emissions));
app.get('/api/reunions', (req, res) => res.json(reunions));

// Créer une réunion (body: { titre, heure, participants: [userIds] })
app.post('/api/reunions', (req, res) => {
  const { titre, heure, participants } = req.body;
  const id = `r${Date.now()}`;
  const newR = { id, titre, heure, participants: (participants || []).length };
  reunions.push(newR);
  io.emit('reunion:created', newR);
  res.status(201).json(newR);
});

// Démarrer un live (body: { emissionId }) -> broadcast
app.post('/api/start-live', (req, res) => {
  const { emissionId } = req.body;
  const e = emissions.find((x) => x.id === emissionId);
  if (!e) return res.status(404).json({ error: 'Emission not found' });
  io.emit('live:started', e);
  res.json({ ok: true, emission: e });
});

io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('join', (room) => socket.join(room));
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend scaffold listening on http://localhost:${PORT}`));
