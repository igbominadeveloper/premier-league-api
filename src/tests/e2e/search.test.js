import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../server';

import * as userMocks from '../mocks/users';
import * as teamMocks from '../mocks/teams';
import * as fixtureMocks from '../mocks/fixtures';

import User from '../../db/models/User';
import Team from '../../db/models/Team';
import Fixture from '../../db/models/Fixture';
import { getRedisClient } from '../../config/redis';

const searchUrl = '/api/v1/search';

beforeAll(async done => {
  await User.deleteMany({});
  await Team.deleteMany({});
  await Fixture.deleteMany({});

  await User.insertMany([userMocks.mockUser, userMocks.mockAdmin]);
  await Team.insertMany([teamMocks.mockTeam1, teamMocks.mockTeam2]);
  await Fixture.insertMany([
    fixtureMocks.mockFixture1,
    fixtureMocks.mockFixture2,
  ]);
  done();
});

afterAll(async done => {
  // await User.deleteMany({});
  // await Team.deleteMany({});
  // await Fixture.deleteMany({});
  getRedisClient().quit();
  await mongoose.connection.close();
  done();
});

describe('E2E Search Functionality', () => {
  it('should search across the application successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .get(searchUrl)
      .query({ q: 'jo' });

    expect(res.status).toBe(200);
    expect(res.body.data.users.length).toBe(1);
  });

  it('should return an error when no query string is passed to the request', async () => {
    const res = await request(app)
      .get(searchUrl)
      .query({ q: '' });

    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('q is not allowed to be empty');
  });
});
