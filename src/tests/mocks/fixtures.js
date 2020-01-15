import faker from 'faker';
import { Types } from 'mongoose';

import { mockAdmin } from './users';
import * as teams from './teams';

export const mockFixture1 = {
  _id: Types.ObjectId(),
  date: '1-22-2020',
  homeTeamId: teams.mockTeam1._id,
  awayTeamId: teams.mockTeam2._id,
  referee: 'Phil Dowd',
  status: 'PENDING',
  uniqueLink: faker.internet.url(),
  createdBy: mockAdmin._id,
};

export const mockFixture2 = {
  _id: Types.ObjectId(),
  date: '1-22-2020',
  homeTeamId: teams.mockTeam2._id,
  awayTeamId: teams.mockTeam1._id,
  referee: 'Colina Pollins',
  status: 'PENDING',
  uniqueLink: faker.internet.url(),
  createdBy: mockAdmin._id,
};

export const healthyFixture = {
  date: '1-22-2024',
  homeTeamId: teams.mockTeam1._id,
  awayTeamId: teams.mockTeam2._id,
  referee: 'Phil Dowd',
};

export const missingDate = {
  homeTeamId: teams.mockTeam2._id,
  awayTeamId: teams.mockTeam1._id,
  referee: 'Colina Pollins',
};

export const missingReferee = {
  date: '1-22-2020',
  homeTeamId: teams.mockTeam2._id,
  awayTeamId: teams.mockTeam1._id,
};

export const missingHomeTeam = {
  date: '1-22-2020',
  awayTeamId: teams.mockTeam1._id,
  referee: 'Colina Pollins',
};

export const missingAwayTeam = {
  date: '1-22-2020',
  homeTeamId: teams.mockTeam2._id,
  referee: 'Colina Pollins',
};

export const pastDate = {
  date: '1-22-2019',
  homeTeamId: teams.mockTeam2._id,
  awayTeamId: teams.mockTeam1._id,
  referee: 'Colina Pollins',
};
