import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import * as AuthSession from "expo-auth-session";

export default function LoginScreen() {
  const redirectUri = AuthSession.makeRedirectUri({ scheme: "swiftycompanion" });
  console.log("redirectUri", redirectUri);
  console.log("CLIENT_ID:", process.env.EXPO_PUBLIC_CLIENT_ID);

  
  const discovery = {
    authorizationEndpoint: "https://api.intra.42.fr/oauth/authorize",
    tokenEndpoint: "https://api.intra.42.fr/oauth/token",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CLIENT_ID as string,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      scopes: ["public"],
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const code = response.params.code;
      console.log("Code OAuth reçu :", code);
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Login page</Text>
      <Button
        title="Se connecter"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
}
