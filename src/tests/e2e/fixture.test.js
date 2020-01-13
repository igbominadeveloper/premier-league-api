import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../server';

import * as mocks from '../mocks/fixtures';
import { mockUser, mockAdmin } from '../mocks/users';
import { mockTeam1, mockTeam2 } from '../mocks/teams';

import User from '../../db/models/User';
import Fixture from '../../db/models/Fixture';
import Team from '../../db/models/Team';

import { generateToken } from '../../utils/helpers';

const fixturesUrl = '/api/v1/fixtures';

let userToken;
let adminToken;

beforeAll(async () => {
  const users = await User.insertMany([mockAdmin, mockUser]);
  await Team.insertMany([mockTeam1, mockTeam2]);
  adminToken = await generateToken({ id: users[0]._id }, '5m');
  userToken = await generateToken({ id: users[1]._id }, '5m');
});

afterAll(async done => {
  await User.deleteMany({});
  await Team.deleteMany({});
  await Fixture.deleteMany({});
  await mongoose.connection.close();
  done();
});

describe('E2E Fixture creation', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .send(mocks.mockFixture1);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized user, please login');
  });

  it('should throw an error when the user making the request does not have admin rights', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${userToken}`)
      .send(mocks.mockFixture1);
    expect(res.status).toBe(403);
  });

  it('should create a fixture successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.mockFixture1);
    expect(res.status).toBe(201);
    expect(Object.keys(res.body.data).includes('referee')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('homeTeam')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('awayTeam')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('uniqueLink')).toBeTruthy();
  });

  it('should throw an error when the fixture is existing already', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.mockFixture1);
    expect(res.status).toBe(409);
    expect(res.body.message).toBe('This Fixture exists already');
  });

  it('should throw an error when the fixture date is missing', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingDate);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('date is required');
  });

  it('should throw an error when referee name is missing', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingReferee);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('referee is required');
  });

  it('should throw an error when the awayTeamId is missing', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingAwayTeam);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('awayTeamId is required');
  });

  it('should throw an error when the homeTeamId is missing', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingHomeTeam);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('homeTeamId is required');
  });

  it('should throw an error when the date passed is later than the current date', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.pastDate);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('date must be later than or equal to today');
  });

  it('should throw an error when the homeTeamId is not tied to any existing team', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...mocks.mockFixture1, homeTeamId: '507f1f77bcf86cd799439011' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(
      'This team 507f1f77bcf86cd799439011 cannot be found',
    );
  });

  it('should throw an error when the awayTeam is not tied to any existing team', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...mocks.mockFixture1, awayTeamId: '507f1f77bcf86cd799439011' });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(
      'This team 507f1f77bcf86cd799439011 cannot be found',
    );
  });
});
