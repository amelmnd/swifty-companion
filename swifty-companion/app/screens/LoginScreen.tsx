// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import { randState, openLoginInBrowser, pollTokens } from '../../lib/auth';

export default function LoginScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const state = randState();
    setLoading(true);
    try {
      await openLoginInBrowser(state); // ouvre la page 42 (via ton backend)
      const ok = await pollTokens(state, 90_000); // attend les tokens (max 90s)
      if (!ok) {
        Alert.alert('Connexion', 'Temps dépassé, réessaie.');
        setLoading(false);
        return;
      }
      navigation.replace('Home'); // go Home dès que les tokens sont stockés
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Connexion impossible');
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: '700' }}>swifty-companion</Text>
      <Button title='Se connecter avec 42' onPress={handleLogin} />
      {loading && (
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Connexion en cours…</Text>
        </View>
      )}
    </View>
  );
}
