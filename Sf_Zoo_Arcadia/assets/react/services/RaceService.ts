// src/services/RaceService.js
export const fetchRaces = async () => {
  const res = await fetch('/api/race');
  return res.json();
};

export const createRace = async (raceData) => {
  const res = await fetch('/api/race/new', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raceData),
  });
  return res.json();
};

export const updateRace = async (raceId, raceData) => {
  const res = await fetch(`/api/races/${raceId}/edit`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raceData),
  });
  return res.json();
};

export const deleteRace = async (raceId) => {
  await fetch(`/api/races/${raceId}/delete`, { method: 'DELETE' });
};
