import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { getTokens } from '../../lib/auth';

export default function LoadingScreen({ navigation }: any) {
  useEffect(() => {
    const check = async () => {
      const token = await getTokens();
      if (token?.access_token) {
        navigation.replace('SearchScreen');
      } else {
        navigation.replace('Login');
      }
    };
    check();
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size='large' color='#00babc' />
    </View>
  );
}
