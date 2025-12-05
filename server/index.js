require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const { CLIENT_ID, CLIENT_SECRET, BACKEND_BASE_URL, PORT = 3001 } = process.env;
if (!CLIENT_ID || !CLIENT_SECRET || !BACKEND_BASE_URL) {
  console.error('❌ Env var manquantes: CLIENT_ID, CLIENT_SECRET, BACKEND_BASE_URL');
  process.exit(1);
}

const SESSIONS = new Map();

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.get('/oauth/42/start', (req, res) => {
  const { state, redirect_uri } = req.query;
  console.log(state)
  console.log(redirect_uri)
  if (!state) return res.status(400).json({ error: "missing_state" });

  const cb = new URL(`${BACKEND_BASE_URL}/oauth/42/callback`);
  cb.searchParams.set('redirect_uri', String(redirect_uri)); // on propage

  const u = new URL('https://api.intra.42.fr/oauth/authorize');
  u.searchParams.set('client_id', CLIENT_ID);
  u.searchParams.set('redirect_uri', cb.toString());
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('scope', 'public');
  u.searchParams.set('state', String(state));

  return res.redirect(u.toString());
});

app.get('/oauth/42/callback', async (req, res) => {
  const { code, state, redirect_uri: finalRedirect } = req.query;

  if (!code || !state || !finalRedirect) {
    return res.status(400).send('missing code/state/redirect_uri');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: `${BACKEND_BASE_URL}/oauth/42/callback?redirect_uri=${encodeURIComponent(finalRedirect)}`,
  });

  try {
    const r = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const tokens = await r.json();
    if (!r.ok) {
      console.error('Token error:', tokens);
      return res.status(r.status).json({ error: 'api_token_failed' });
    }

    const out = new URL(String(finalRedirect));
    const frag = new URLSearchParams({
      status: 'ok',
      access_token: tokens.access_token || '',
      refresh_token: tokens.refresh_token || '',
      expires_in: String(tokens.expires_in || ''),
    });
    out.hash = frag.toString();
    return res.redirect(out.toString());
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'token_exchange_failed' });
  }
});

app.get('/oauth/42/status', (req, res) => {
  const state = String(req.query.state || '');
  if (!state) return res.status(400).json({ error: 'missing_state' });
  const session = SESSIONS.get(state);
  if (!session) return res.json({ status: 'pending' });
  const tokens = session.tokens;
  SESSIONS.delete(state);
  return res.json({ status: 'ok', tokens });
});

app.post('/oauth/42/refresh', async (req, res) => {
  const refresh_token = req.body?.refresh_token;
  if (!refresh_token) return res.status(400).json({ error: 'missing_refresh_token' });

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token,
  });

  try {
    const r = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const tokens = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: 'api_refresh_failed' });
    return res.status(200).json(tokens);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'network_error' });
  }
});

// 5) logout (frontend va juste nettoyer ses tokens)
app.post('/logout', (_req, res) => {
  return res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on ${BACKEND_BASE_URL} (PORT=${PORT})`);
  console.log(`✅ Health: ${BACKEND_BASE_URL}/health`);
});


