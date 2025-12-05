export async function getUser(id: string, accessToken: string): Promise<any | null> {
  try {
    const response = await fetch(
      `https://api.intra.42.fr/v2/users/${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status == 404)
    {
      return null;
    }
    
    if (!response.ok) {
      throw new Error("Erreur API:', response.status, response.statusText");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur:', error);
    return null;
  }
}
