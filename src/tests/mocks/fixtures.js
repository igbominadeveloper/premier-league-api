import faker from 'faker';

import { mockAdmin } from './users';
import * as teams from './teams';

export const mockFixture1 = {
  _id: '507f1f77bcf86cd799439016',
  date: '2020-01-11T08:27:01.471Z',
  homeTeamId: teams.mockTeam1._id,
  awayTeamId: teams.mockTeam2._id,
  referee: 'Phil Dowd',
  status: 'PENDING',
  uniqueLink: faker.internet.url(),
  createdBy: mockAdmin._id,
};

export const mockFixture2 = {
  _id: '507f1f77bcf86cd799439017',
  date: '2020-01-11T08:27:01.471Z',
  homeTeamId: teams.mockTeam2._id,
  awayTeamId: teams.mockTeam1._id,
  referee: 'Colina Pollins',
  status: 'PENDING',
  uniqueLink: faker.internet.url(),
  createdBy: mockAdmin._id,
};
