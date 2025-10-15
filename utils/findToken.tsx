import { findData } from "./findData";

export const callApi42 = async () => {
  const clientId = process.env.EXPO_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.EXPO_PUBLIC_CLIENT_SECRET;

  if (!clientId || !clientSecret)
    throw "Env var undefined";


  try {
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: {
        //le type de données dans le corps de la requête ici envoies un formulaire encodé
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // Crée un objet spécial contenant les données encodées au format application/x-www-form-urlencoded
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }).toString(),
      //transformer l’objet de paramètres en chaîne “formulaire” que l’API comprend.
    });

    if (response.ok) {
      const data = await response.json();
      if (data.length === 0 )
        throw "empty data";
      console.log("Token data:", data);
      findData('amennad',data.access_token)
    
    } else {
      throw `Error fetch`;
    }
  } catch (error) {
    console.log("Error :", error);
    return null;
  }
};
