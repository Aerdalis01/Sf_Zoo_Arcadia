
export const fetchRaces = async () => {
  const res = await fetch('/api/race/');
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des races');
  }
  const data = await res.json();
  console.log("Races reçues depuis l'API:", data);
  return data;
};

export const createRace = async (raceData) => {
  const res = await fetch('/api/race/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raceData),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la création de la race');
  }
  return res.json();
};

export const updateRace = async (raceId, raceData) => {
  const res = await fetch(`/api/race/${raceId}`, {
    method: 'POST',  
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raceData),
  });
  if (!res.ok) {
    throw new Error('Erreur lors de la mise à jour de la race');
  }
  return res.json();
};

export const deleteRace = async (raceId) => {
  const res = await fetch(`/api/race/delete/${raceId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Erreur lors de la suppression de la race');
  }
};