require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ----- Config & mémoire simple -----
const {
  CLIENT_ID,
  CLIENT_SECRET,
  BACKEND_BASE_URL,
  PORT = 3001, // défaut si non défini
} = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !BACKEND_BASE_URL) {
  console.error("❌ Env vars manquantes: CLIENT_ID, CLIENT_SECRET, BACKEND_BASE_URL");
  process.exit(1);
}

const REDIRECT_URI = `${BACKEND_BASE_URL}/oauth/42/callback`;
const SESSIONS = new Map();

// ----- Healthcheck -----
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// ----- 1) Démarrer OAuth (redirige vers 42) -----
// GET /oauth/42/start?state=xyz
app.get("/oauth/42/start", (req, res) => {
  const { state } = req.query;
  if (!state) return res.status(400).json({ error: "missing_state" });

  // Utilise URL + searchParams pour encodage sûr
  const u = new URL("https://api.intra.42.fr/oauth/authorize");
  u.searchParams.set("client_id", CLIENT_ID);
  u.searchParams.set("redirect_uri", REDIRECT_URI);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", "public");
  u.searchParams.set("state", String(state));

  return res.redirect(u.toString());
});

// ----- 2) Callback (échange code -> tokens) -----
// Doit matcher EXACTEMENT REDIRECT_URI
app.get("/oauth/42/callback", async (req, res) => {
  const {
    code,
    state,
    error: apiError,
    error_description: apiErrorDescription,
  } = req.query;

  if (apiError) {
    return res
      .status(400)
      .send(`OAuth error: ${apiError}${apiErrorDescription ? " - " + apiErrorDescription : ""}`);
  }
  if (!code || !state) return res.status(400).json({ error: "missing_code_or_state" });

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokens = await response.json();
    if (!response.ok) {
      console.error("Token error:", tokens);
      return res.status(response.status).json({ error: "api_token_failed" });
    }

    SESSIONS.set(String(state), { tokens, createdAt: Date.now() });

    return res.send(`<html><body style="font-family:system-ui">
      <h3>Connexion 42 réussie ✅</h3>
      <p>Tu peux revenir dans l’application.</p>
    </body></html>`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "token_exchange_failed" });
  }
});

// ----- 3) Polling des tokens par l’app -----
// GET /oauth/42/status?state=xyz
app.get("/oauth/42/status", (req, res) => {
  const state = String(req.query.state || "");
  if (!state) return res.status(400).json({ error: "missing_state" });

  const session = SESSIONS.get(state);
  if (!session) return res.json({ status: "pending" });

  const tokens = session.tokens;
  SESSIONS.delete(state); // one-shot
  return res.json({ status: "ok", tokens });
});

// ----- 4) Refresh token -----
// POST /oauth/42/refresh  { refresh_token }
app.post("/oauth/42/refresh", async (req, res) => {
  const refresh_token = req.body?.refresh_token;
  if (!refresh_token) return res.status(400).json({ error: "missing_refresh_token" });

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token,
  });

  try {
    const r = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const tokens = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: "api_refresh_failed" });
    }
    return res.status(200).json(tokens);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "network_error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on ${BACKEND_BASE_URL} (PORT=${PORT})`);
  console.log(`   Health: ${BACKEND_BASE_URL}/health`);
});
