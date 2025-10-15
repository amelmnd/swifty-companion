import * as AuthSession from "expo-auth-session";

// Génère automatiquement le bon redirect URI selon l’environnement
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "swiftycompanion", // le même que dans app.json
});

console.log(redirectUri);
