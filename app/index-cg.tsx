// App.js (ou app/index.js) — Expo, sans TypeScript
import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import * as AuthSession from 'expo-auth-session';

// tes variables d'env Expo
const CLIENT_ID = process.env.EXPO_PUBLIC_42_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_42_CLIENT_SECRET;
const API_BASE = process.env.EXPO_PUBLIC_42_API_BASE; // "https://api.intra.42.fr"

// IMPORTANT : avec Expo, on utilise le proxy et on génère l'URI de redirection
const redirectUri = AuthSession.makeRedirectUri({
  useProxy: true,
  scheme: process.env.EXPO_PUBLIC_REDIRECT_SCHEME, // "swiftycompanion"
  // pas besoin d'ajouter le path ici; Expo gère le proxy (auth.expo.io/...)
});

// endpoints OAuth 42
const discovery = {
  authorizationEndpoint: `${API_BASE}/oauth/authorize`,
  tokenEndpoint: `${API_BASE}/oauth/token`,
};

export default function App() {
  const [me, setMe] = useState(null);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Prépare la requête OAuth (Authorization Code)
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      responseType: AuthSession.ResponseType.Code,
      scopes: ['public'],
      redirectUri,
    },
    discovery
  );

  // Quand on revient de 42 avec ?code=...
  useEffect(() => {
    (async () => {
      if (response?.type === 'success' && response.params?.code) {
        try {
          const body = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: response.params.code,
            redirect_uri: redirectUri, // doit être identique à celui passé à useAuthRequest
          }).toString();

          const res = await fetch(`${API_BASE}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
          });
          if (!res.ok) throw new Error(`Token ${res.status}`);
          const json = await res.json();
          setAccessToken(json.access_token);
        } catch (e) {
          setError(String(e.message || e));
        }
      }
    })();
  }, [response]);

  // Appel API 42 avec le token
  useEffect(() => {
    if (!accessToken) return;
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/v2/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!r.ok) throw new Error(`API ${r.status}`);
        setMe(await r.json());
      } catch (e) {
        setError(String(e.message || e));
      }
    })();
  }, [accessToken]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
      }}
    >
      {!me && (
        <Button
          title='Se connecter avec 42'
          onPress={() => promptAsync({ useProxy: true })} // remplace startAsync
          disabled={!request}
        />
      )}
      {error && <Text>❌ {error}</Text>}
      {me && (
        <>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>Connecté :</Text>
          <Text>{me.login}</Text>
          <Text>{me.email}</Text>
        </>
      )}
    </View>
  );
}
