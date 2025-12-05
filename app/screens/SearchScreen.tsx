import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import ResponsiveLayout from '../../components/ResponsiveLayout';
Ionicons

import { clearTokens, getTokens } from '../../lib/auth';
import { getCoalition } from '../../lib/getCoalition';
import { getUser } from '../../lib/getUser';

export default function SearchScreen({ navigation }: any) {
  const [login, setLogin] = useState('');
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {

    const tokenExist = async () => {
      const token = await getTokens();
      if (!token?.access_token) {
        console.log('Session expirée', 'Veuillez vous reconnecter.');
        navigation.replace('Login');
        return;
      } else setAuthStatus('connecté');
    };
    tokenExist();
  }, []);

  const onSubmit = async () => {
    const login42 = login.trim();
    if (!login42) {
      Alert.alert('Erreur', 'Veuillez entrer un login avant de continuer.');
      return;
    }

    const token = await getTokens();
    if (!token?.access_token) {
      console.log('Erreur', 'Token manquant. Reconnectez-vous.');
      navigation.replace('Login');
      return;
    }Ionicons

    setLoading(true);
    try {
      const user = await getUser(login42, token.access_token);
      if (!user) {
        Alert.alert(
          `Aucun utilisateur trouvé pour "${login42}"`
        );
        return;
      }

      const coalition = await getCoalition(user.id, token.access_token);
      setLogin('');
      
      navigation.navigate('Profile', { user, coalition });
    } catch (e) {
      console.log('Erreur', 'Impossible de récupérer les données.');
    } finally {
      setLoading(false);
    }
  };

    const logout = async () => {
    try {
      const t = await getTokens();
      if (t?.access_token) {
        await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${t.access_token}` },
        });Ionicons
      }
    } catch (e) {
      console.log('[logout] backend error', e);
    } finally {
      await clearTokens();
      navigation.replace('Login');
    }
  };

  
  const disabled = loading || login.trim().length === 0;

  return (
    <ImageBackground
      source={require('../../assets/bgSearchScreen.png')}
      style={styles.background}
      resizeMode='cover'
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ResponsiveLayout>
          <View
            style={[
              styles.overlay,
              styles.screenPad,
              isLandscape && { paddingHorizontal: 80 },
            ]}
          >
            <Text style={[styles.subtitle, { marginBottom: 16 }]}>
              {authStatus === 'connecté'
                ? 'Connecté via OAuth 42'
                : 'Vérification de connexion...'}
            </Text>

            <View
              style={[styles.card, { width: '100%', maxWidth: 420, gap: 12 }]}
            >
              <Text style={styles.label}>Nom d’utilisateur 42</Text>

              <TextInput
                value={login}
                onChangeText={setLogin}
                placeholder='ex: jdupont'
                placeholderTextColor='#9aa3af'
                style={styles.input}
                autoCapitalize='none'
                autoCorrect={false}
                returnKeyType='done'
                onSubmitEditing={onSubmit}
              />

              <TouchableOpacity
                style={[styles.button, disabled && { opacity: 0.5 }]}
                onPress={onSubmit}
                disabled={disabled}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color='#fff' />
                ) : (
                  <Text style={styles.buttonText}>Afficher le profil</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.boxButton}>
          {/* 
             <TouchableOpacity
              onPress={logout}
              style={[styles.button, styles.dangerBtn]}
              activeOpacity={0.8}
            >
              <AntDesign name='logout' size={26} color='#FFF' />
            </TouchableOpacity>
          */}
          {/* 
            <TouchableOpacity
                style={[styles.button, styles.dangerBtn]}
                activeOpacity={0.8}
                onPress={async () => {
                const result = await forceRefreshToken();
                if (result) {
                  Alert.alert(
                    'Refresh OK',
                    'Le token a été rafraîchi avec succès !'
                  );
                } else {
                  Alert.alert('Refresh KO', 'Impossible de rafraîchir le token.');
                }
              }}>
                <Ionicons name="reload-sharp" size={26} color='#FFF' />
              </TouchableOpacity>
            */}
          </View>
        </ResponsiveLayout>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { flex: 1 },

  screenPad: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  label: { fontSize: 16, fontWeight: '700', color: '#111827' },

  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111827',
  },

  boxButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  button: {
    backgroundColor: '#3969B3',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 10,
  },

  dangerBtn: {
    marginTop: 10,
    backgroundColor: '#d95f5f',
    paddingVertical: 10,
    width: 45,
    alignSelf: 'center',
    borderRadius: 12,
  },

  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
