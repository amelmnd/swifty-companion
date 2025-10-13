import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, Button } from 'react-native';

export default function ProfileScreen({ route, navigation }) {
  const { login } = route.params || {};
  return (
    <SafeAreaView>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>
          Profil: {login || '—'}
        </Text>
        <Text style={{ marginTop: 6 }}>
          (Données à venir – API 42 à brancher)
        </Text>
      </View>
      <Button title='Retour' onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}
