import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getTokens, saveTokens } from '../../lib/auth';

WebBrowser.maybeCompleteAuthSession();

const randState = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

async function fetchWithTimeout(resource: string, ms = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(resource, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

export default function LoginScreen({ navigation }: any) {
  const [loadingOAuth, setLoadingOAuth] = useState(false);
  const [oauthMsg, setOauthMsg] = useState('');

  useEffect(() => {
    const tokenExist = async () => {
      const token = await getTokens();
      if (!token) {
        return;
      }
      navigation.replace('SearchScreen');
    };

    tokenExist();
  }, []);


  const startOAuth = async () => {
    setLoadingOAuth(true); 

    try {
      const state = randState();
      const redirectUri = makeRedirectUri({ useProxy: true });
      console.log('redirectUri', redirectUri)
      const startUrl =
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/oauth/42/start` +
        `?state=${encodeURIComponent(state)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`;

      const result = await WebBrowser.openAuthSessionAsync(
        startUrl,
        redirectUri
      );

      if (result.type === 'success' && result.url) {
        const parsed = Linking.parse(result.url);
        const queryParams: any = parsed.queryParams ?? {};
        const url = new URL(result.url);
        const hash = new URLSearchParams(url.hash.replace(/^#/, ''));

        const ok = String(queryParams.status ?? hash.get('status') ?? '');
        if (ok === 'ok') {
          const access_token = String(
            queryParams.access_token ?? hash.get('access_token') ?? ''
          );
          const refresh_token = String(
            queryParams.refresh_token ?? hash.get('refresh_token') ?? ''
          );
          const expires_in = Number(
            queryParams.expires_in ?? hash.get('expires_in') ?? 0
          );

          await saveTokens({
            access_token,
            refresh_token,
            expires_in,
            obtained_at: Date.now(),
          });
          navigation.replace('SearchScreen');
          return;
        }

        const code = String(queryParams.code ?? hash.get('code') ?? '');
        if (code) {
          console.log(
            'OAuth',
            'Flux code reçu mais non implémenté côté front.'
          );
          return;
        }

        console.log('OAuth', 'Réponse inattendue du serveur.');
      } else if (result.type === 'cancel') {
        setOauthMsg('Annulé');
      } else {
        setOauthMsg('Fermé / échec');
      }
    } catch (e: any) {
      console.log('Erreur OAuth', e?.message ?? 'Inconnue');
    } finally {
      setLoadingOAuth(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bgLoginScreen.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <View style={styles.overlay}>
        {loadingOAuth ? (
          <ActivityIndicator color='#FFF' size='large' />
        ) : (
          <TouchableOpacity
            style={[styles.button, loadingOAuth && { opacity: 0.6 }]}
            onPress={startOAuth}
            disabled={loadingOAuth}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        )}

        {oauthMsg && <Text style={styles.small}>{oauthMsg}</Text>}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#00babc',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 25,
    color: '#FFF',
    fontWeight: 700,
  },
  small: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 13,
    color: '#FFF',
  },
});
