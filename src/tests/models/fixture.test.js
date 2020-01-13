import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Fixture from '../../db/models/Fixture';

import { mockFixture1, mockFixture2 } from '../mocks/fixtures';

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

describe('Unit tests for fixture model', () => {
  it('Should create a new fixture successfully', async () => {
    const newFixture = await Fixture.create(mockFixture1);
    await Fixture.create(mockFixture2);
    const fixtureCount = await Fixture.countDocuments();

    expect(fixtureCount).toEqual(2);
    expect(newFixture.homeTeamId).toEqual(mockFixture1.homeTeamId);
    expect(newFixture.referee).toEqual(mockFixture1.referee);
    expect(newFixture.uniqueLink).toEqual(mockFixture1.uniqueLink);
  });

  it('Should retrieve fixures from the database', async () => {
    const fixtures = await Fixture.find();
    const fixturesCount = await Fixture.countDocuments();
    expect(fixturesCount).toEqual(2);
    expect(Array.isArray(fixtures)).toBe(true);
  });

  it('Should update a fixture in the database', async () => {
    await Fixture.updateOne(
      { _id: mockFixture1._id },
      { referee: 'Favour Afolayan' },
    );
    const updatedFixture = await Fixture.findById(mockFixture1._id);
    expect(updatedFixture.referee).toEqual('Favour Afolayan');
  });

  it('Should delete a fixture from the database', async () => {
    await Fixture.deleteOne({ _id: mockFixture1._id });
    const currentCount = await Fixture.countDocuments();
    expect(currentCount).toEqual(1);
  });
});
