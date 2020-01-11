import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Team from '../../db/models/Team';

import { mockTeam1, mockTeam2 } from '../mocks/teams';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (err) console.error(err);
    },
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Unit tests for team model', () => {
  it('Should create a new team successfully', async () => {
    const newTeam = await Team.create(mockTeam1);
    await Team.create(mockTeam2);
    const teamCount = await Team.countDocuments();

    expect(teamCount).toEqual(2);
    expect(newTeam.name).toEqual(mockTeam1.name);
    expect(newTeam.stadium).toEqual(mockTeam1.stadium);
    expect(newTeam.manager).toEqual(mockTeam1.manager);
    expect(newTeam.capacity).toEqual(mockTeam1.capacity);
  });

  it('Should retrieve teams from the database', async () => {
    const teams = await Team.find();
    const teamCount = await Team.countDocuments();
    expect(teamCount).toEqual(2);
    expect(Array.isArray(teams)).toBe(true);
  });

  it('Should update a team in the database', async () => {
    await Team.updateOne({ _id: mockTeam1._id }, { capacity: 90000 });
    const updatedTeam = await Team.findById(mockTeam1._id);
    expect(updatedTeam.capacity).toEqual(90000);
  });

  it('Should delete a team from the database', async () => {
    await Team.deleteOne({ _id: mockTeam1._id });
    const currentCount = await Team.countDocuments();
    expect(currentCount).toEqual(1);
  });
});
