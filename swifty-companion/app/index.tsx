// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
      <Stack.Navigator screenOptions={{ headerTitle: 'Swifty Companion' }}>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ title: 'Connexion' }}
        />
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{ title: 'Profil' }}
        />
      </Stack.Navigator>
  );
}
