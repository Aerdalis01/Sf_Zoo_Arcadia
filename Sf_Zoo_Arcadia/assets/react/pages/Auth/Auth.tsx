import { jwtDecode, JwtPayload } from 'jwt-decode';


export const fetchAuth = async (url: string,  options: RequestInit = {}) => {
  const token = localStorage.getItem('jwt_token');

  if (!token) {
    throw new Error("Utilisateur non authentifié");
  }

 const isTokenExpired = (token: string): boolean => {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  };

  if (isTokenExpired(token)) {
    throw new Error("Token expiré, veuillez vous reconnecter.");
  }

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
      headers.append(key, value);
    });
  }

  const response = await fetch(url, {
    ...options,
    headers, 
  });

  if (!response.ok) {
    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
  }

  return response.json();
};


