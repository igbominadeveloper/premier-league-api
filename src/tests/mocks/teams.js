import { Types } from 'mongoose';

export const mockTeam1 = {
  _id: Types.ObjectId(),
  name: 'Arsenal',
  stadium: 'Emirates Stadium',
  manager: 'Mikel Arteta',
};

export const mockTeam2 = {
  _id: Types.ObjectId(),
  name: 'Manchester City',
  stadium: 'Etihad Stadium',
  manager: 'Pep Guardiola',
};

export const healthyTeam = {
  name: 'Arsenal Ladies',
  stadium: 'Emirates Stadium Extended',
  manager: 'Mikel Arteta Jnr',
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
