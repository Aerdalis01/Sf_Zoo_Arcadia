const registerUser = async (email, password) => {
  try {
      const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: email,
              plainPassword: password,
          }),
      });

      const data = await response.json();
      if (response.ok) {
          console.log('Inscription réussie');
      } else {
          console.error('Erreurs:', data.errors);
      }
  } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
  }
};