export async function getCoalition(userId: number, accessToken: string) {
  try {
    const response = await fetch(
      `https://api.intra.42.fr/v2/users/${userId}/coalitions`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.log('Erreur coalition:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    return data[0];
  } catch (e) {
    console.log('Erreur getCoalition:', e);
    return null;
  }
}
