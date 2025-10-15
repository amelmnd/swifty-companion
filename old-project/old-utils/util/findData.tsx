
export  const findData = async (
  id: string,
  accessToken: string
): Promise<User | null> => {
  try {
    const response = await fetch(`https://api.intra.42.fr/v2/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erreur API:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('USER DATA', data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l’utilisateur:', error);
    return null;
  }
};
