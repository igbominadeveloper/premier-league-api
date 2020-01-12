export const mockTeam1 = {
  _id: '507f1f77bcf86cd799439013',
  name: 'Arsenal',
  stadium: 'Emirates Stadium',
  manager: 'Mikel Arteta',
};

export const mockTeam2 = {
  _id: '507f1f77bcf86cd799439014',
  name: 'Manchester City',
  stadium: 'Etihad Stadium',
  manager: 'Pep Guardiola',
};

export const missingName = {
  stadium: 'Etihad Stadium',
  manager: 'Pep Guardiola',
};

export const missingStadium = {
  name: 'Manchester City',
  manager: 'Pep Guardiola',
};

export const missingManager = {
  name: 'Manchester City',
  stadium: 'Etihad Stadium',
};

export const invalidManagerName = {
  name: 'Manchester City',
  stadium: 'Etihad Stadium',
  manager: '-----00',
};
