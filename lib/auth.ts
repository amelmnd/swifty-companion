import * as SecureStore from 'expo-secure-store';

const KEY = 'oauth42_tokens';

export type StoredTokens = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  obtained_at?: number;
};

export async function saveTokens(tokens: StoredTokens) {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(tokens));
  } catch (e) {
    console.log("Erreur saveTokens:", e?.message || e);
  }
}

async function refreshToken(refresh_token?: string){
  if (!refresh_token) {
    throw new Error("Aucun refresh_token fourni");
  }

  console.log("Refresh token en cours…");

  try {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/oauth/42/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Erreur refresh (${res.status}): ${errorText || "Réponse invalide"}`
      );
    }

    const data = await res.json();

    const newTokens: StoredTokens = {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? refresh_token,
      expires_in: data.expires_in,
      obtained_at: Date.now(),
    };

    await SecureStore.setItemAsync(KEY, JSON.stringify(newTokens));

    console.log("Refresh OK — nouveau token sauvegardé");
    return newTokens;

  } catch (e: any) {
    console.log("Refresh échoué:", e?.message || e);
  }
}

export async function getTokens() {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    if (!raw) {
      throw new Error("Aucun token enregistré");
    }

    const tokens: StoredTokens = JSON.parse(raw);

    const now = Date.now();
    const expiresAt =
      (tokens.obtained_at ?? 0) + (tokens.expires_in ?? 0) * 1000;

    if (now < expiresAt) {
      return tokens; // encore valide
    }

    console.log("⏳ Token expiré — refresh requis");

    return await refreshToken(tokens.refresh_token);

  } catch (e: any) {
    if(e?.message == 'Aucun token enregistré')
      console.info(e?.message);
    else
      console.log("Erreur getTokens:", e?.message || e);
  }
}

/**
 * ==========================
 *     UTILITAIRES
 * ==========================
 */

export async function clearTokens() {
  try {
    await SecureStore.deleteItemAsync(KEY);
  } catch {}
}

export async function debugTokens() {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    console.log('------------------------');
    console.log(raw ? JSON.stringify(JSON.parse(raw), null, 2) : "Aucun token");
    console.log('------------------------');
  } catch {
    console.log("Erreur debugTokens");
  }
}

export async function forceRefreshToken() {
  const raw = await SecureStore.getItemAsync(KEY);

  if (!raw) {
    throw new Error("Aucun token trouvé pour refresh forcé");
  }

  const stored: StoredTokens = JSON.parse(raw);

  if (!stored.refresh_token) {
    throw new Error("Aucun refresh_token disponible");
  }

  console.log("Refresh forcé demandé…");
  console.log("Ancien token:");
  await debugTokens();

  try {
    const newTokens = await refreshToken(stored.refresh_token);

    console.log("Refresh forcé réussi !");
    console.log("Nouveau token:");
    await debugTokens();

    return newTokens;

  } catch (e: any) {
    console.log("Erreur refresh forcé:", e?.message || e);
    throw new Error(e?.message || "Erreur inconnue lors du refresh forcé");
  }
}
