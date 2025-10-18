// src/screens/HomeScreen.tsx
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { BACKEND } from '../../lib/api';
import { getAccessToken, getRefreshToken } from '../../lib/auth';

export default function HomeScreen({ navigation }: any) {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    setLoading(true);
    try {
      let access = await getAccessToken();
      if (!access) {
        setLoading(false);
        return Alert.alert('Non connecté', 'Reviens te connecter.', [
          { text: 'Login', onPress: () => navigation.replace('Login') },
        ]);
      }

      // 1) appel direct API 42
      let r = await fetch('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${access}` },
      });

      // 2) token expiré ? -> refresh
      if (r.status === 401) {
        const refresh = await getRefreshToken();
        if (!refresh) {
          setLoading(false);
          return Alert.alert('Session expirée', 'Reconnecte-toi.', [
            { text: 'Login', onPress: () => navigation.replace('Login') },
          ]);
        }
        const rr = await fetch(`${BACKEND}/oauth/42/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refresh }),
        });

        if (!rr.ok) {
          setLoading(false);
          return Alert.alert('Session expirée', 'Reconnecte-toi.', [
            { text: 'Login', onPress: () => navigation.replace('Login') },
          ]);
        }

        const tokens = await rr.json();
        if (tokens.access_token) {
          // on écrase l'ancien access_token (option: stocker ici si tu veux)
          access = tokens.access_token;
        }

        // rejoue la requête
        r = await fetch('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${access}` },
        });
      }

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`API error ${r.status}: ${t}`);
      }

      const json = await r.json();
      setMe(json);
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Impossible de récupérer le profil');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Chargement du profil…</Text>
      </View>
    );
  }

  if (!me) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <Text>Profil introuvable</Text>
        <Button title='Recharger' onPress={fetchMe} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>
        Bonjour {me.displayname || me.login}
      </Text>
      {me.image?.link ? (
        <Image
          source={{ uri: me.image.link }}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      ) : null}
      <Text>Login: {me.login}</Text>
      <Text>Email: {me.email}</Text>
      <Text>Campus: {me.campus?.[0]?.name ?? '—'}</Text>

      <Button title='Recharger' onPress={fetchMe} />
    </ScrollView>
  );
}
