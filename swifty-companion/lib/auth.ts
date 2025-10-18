// src/lib/auth.ts
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { BACKEND } from './api';

export function randState() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function openLoginInBrowser(state: string) {
  const url = `${BACKEND}/oauth/42/start?state=${encodeURIComponent(state)}`;
  await WebBrowser.openBrowserAsync(url);
}

export async function pollTokens(state: string, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await fetch(
      `${BACKEND}/oauth/42/status?state=${encodeURIComponent(state)}`
    );
    const data = await r.json();
    if (data.status === 'ok' && data.tokens?.access_token) {
      // Sauvegarde
      await SecureStore.setItemAsync('access_token', data.tokens.access_token);
      if (data.tokens.refresh_token) {
        await SecureStore.setItemAsync(
          'refresh_token',
          data.tokens.refresh_token
        );
      }
      return true;
    }
    await new Promise((res) => setTimeout(res, 1000));
  }
  return false; // timeout
}

export async function getAccessToken() {
  return SecureStore.getItemAsync('access_token');
}
export async function getRefreshToken() {
  return SecureStore.getItemAsync('refresh_token');
}
