import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button } from 'react-native';
import { useState } from 'react';


export default function SearchScreen({ navigation }) {
  const [loginSearch, setLoginSearch] = useState<string>('');

  const goToProfile = () => {
	const trimmed = loginSearch.trim().toLowerCase();
    if (trimmed) navigation.navigate('Profile', { login: trimmed });
  };

  return (
    <SafeAreaView>
      <Text>Swifty Companion</Text>
      <Text style={{ marginBottom: 8 }}>Entrer un login 42 :</Text>
      <TextInput
        placeholder='ex: login 42'
        value={loginSearch}
        onChangeText={setLoginSearch}
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='search'
        onSubmitEditing={goToProfile}
      />
      <Button
        title='Voir le profil'
        disabled={!loginSearch.trim()}
        onPress={goToProfile}
      />
    </SafeAreaView>
  );
}
/*
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button } from 'react-native';
import { useState } from 'react';


export default function SearchScreen({ navigation }) {
  const [loginSearch, setLoginSearch] = useState<string>('');

  const goToProfile = () => {
	const trimmed = loginSearch.trim().toLowerCase();
    if (trimmed) navigation.navigate('Profile', { login: trimmed });
  };

  return (
    <SafeAreaView>
      <Text>Swifty Companion</Text>
      <Text style={{ marginBottom: 8 }}>Entrer un login 42 :</Text>
      <TextInput
        placeholder='ex: login 42'
        value={loginSearch}
        onChangeText={setLoginSearch}
        autoCapitalize='none'
        autoCorrect={false}
        returnKeyType='search'
        onSubmitEditing={goToProfile}
      />
      <Button
        title='Voir le profil'
        disabled={!loginSearch.trim()}
        onPress={goToProfile}
      />
    </SafeAreaView>
  );
}
*/