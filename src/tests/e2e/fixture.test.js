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
import { getRedisClient } from '../../config/redis';

const fixturesUrl = '/api/v1/fixtures';

let userToken;
let adminToken;

beforeAll(async () => {
  await Team.deleteMany({});
  await User.deleteMany({});
  await Fixture.deleteMany({});
  const users = await User.insertMany([mockAdmin, mockUser]);
  await Team.insertMany([mockTeam1, mockTeam2]);
  adminToken = await generateToken({ id: users[0]._id, role: 'ADMIN' }, '1h');
  userToken = await generateToken({ id: users[1]._id, role: 'USER' }, '1h');
});

afterAll(async done => {
  getRedisClient().quit();
  await mongoose.connection.close();
  done();
});

describe('E2E Fixture creation', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .send(mocks.healthyFixture);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should throw an error when the user making the request does not have admin rights', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${userToken}`)
      .send(mocks.healthyFixture);
    expect(res.status).toBe(403);
  });

  it('should create a fixture successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .post(fixturesUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.healthyFixture);
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
      .send(mocks.healthyFixture);
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

describe('E2E Fetch all fixtures', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app).get(fixturesUrl);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should fetch all fixtures', async () => {
    await Fixture.insertMany([
      {
        date: '1-22-2020',
        homeTeamId: mockTeam1._id,
        awayTeamId: mockTeam2._id,
        referee: 'Phil Dowd',
        date: '1-23-2021',
        status: 'PLAYED',
        createdBy: mocks.mockFixture1.createdBy,
        uniqueLink: Math.random(),
      },
      {
        date: '1-22-2021',
        homeTeamId: mockTeam2._id,
        awayTeamId: mockTeam1._id,
        referee: 'Phil Dowd',
        date: '1-23-2022',
        status: 'POSTPONED',
        createdBy: mocks.mockFixture1.createdBy,
        uniqueLink: Math.random(),
      },
    ]);

    const res = await request(app)
      .get(fixturesUrl)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should only return pending fixtures when the query is passed', async () => {
    const res = await request(app)
      .get(fixturesUrl)
      .query({ status: 'pending' })
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].status).toBe('PENDING');
  });

  it('should only return played fixtures when the query is passed', async () => {
    const res = await request(app)
      .get(fixturesUrl)
      .query({ status: 'played' })
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].status).toBe('PLAYED');
  });

  it('should only return postponed fixtures when the query is passed', async () => {
    const res = await request(app)
      .get(fixturesUrl)
      .query({ status: 'postponed' })
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].status).toBe('POSTPONED');
  });
});

describe('E2E Fetch a single fixture', () => {
  let fixture;
  it('should throw an error when a token is not present in the request header', async () => {
    fixture = await Fixture.findOne();
    const res = await request(app).get(`${fixturesUrl}/${fixture._id}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should fetch a fixture successfully', async () => {
    const res = await request(app)
      .get(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.referee).toBe(fixture.referee);
  });

  it('should return a 404 response when the fixture cannot be found', async () => {
    const res = await request(app)
      .get(`${fixturesUrl}/5e1b70de48bd99411c09389e`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('This fixture does not exist');
  });

  it('should return a 422 response when the fixtureId passed is not a valid mongodb objectId', async () => {
    const res = await request(app)
      .get(`${fixturesUrl}/5e1b70de48bd99411c09389e---`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe(
      'fixtureId must be a valid mongodb objectId',
    );
  });
});

let newAdminToken;
let fixture;
describe('E2E Fixture Update', () => {
  const updateBody = {
    date: '9-25-2022',
    referee: 'Joane Pipi',
    status: 'PLAYED',
  };

  it('should throw an error when a token is not present in the request header', async () => {
    fixture = await Fixture.findOne();
    const newAdminUser = await User.insertMany([
      {
        _id: '507f1f77bcf95cd799439011',
        fullName: 'Test Admin',
        email: 'test-admin@example.com',
        password: 'password1',
        role: 'ADMIN',
      },
    ]);

    newAdminToken = await generateToken(
      { id: newAdminUser[0]._id, role: 'ADMIN' },
      '5m',
    );

    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .send(updateBody);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should throw an error when the user making the request does not have admin rights', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${userToken}`)
      .send(updateBody);
    expect(res.status).toBe(403);
  });

  it('should throw an error when the user making the request is an admin but is not the creator of the resource', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${newAdminToken}`)
      .send(updateBody);
    expect(res.status).toBe(403);
  });

  it('should update a fixture successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(updateBody);
    expect(res.status).toBe(200);
    expect(Object.keys(res.body.data).includes('referee')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('date')).toBeTruthy();
  });

  it('should throw an error when an invalid value is passed in the status field', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...updateBody, status: 'new status' });

    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe(
      'status must be one of [PENDING, PLAYED, POSTPONED, CANCELLED]',
    );
  });

  it('should throw an error when an invalid value is passed into the referee field', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...updateBody, referee: 'boss ---!' });
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe(
      'referee can only contain alphabets and whitespace between words',
    );
  });

  it('should throw an error when the fixtureId passed is not a valid MongoDB ObjectId', async () => {
    const res = await request(app)
      .patch(`${fixturesUrl}/p-=872---`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(updateBody);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe(
      'fixtureId must be a valid mongodb objectId',
    );
  });
});

describe('E2E Delete a fixture', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app).delete(`${fixturesUrl}/${fixture._id}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should throw an error when the user making the request is an admin but is not the creator of the resource', async () => {
    const res = await request(app)
      .delete(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${newAdminToken}`);
    expect(res.status).toBe(403);
  });

  it('should delete a fixture successfully', async () => {
    const res = await request(app)
      .delete(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Fixture Deleted');
  });

  it('should return a 403 response if the user does not have admin privileges', async () => {
    const res = await request(app)
      .delete(`${fixturesUrl}/${fixture._id}`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('should return a 404 response when the team cannot be found', async () => {
    const res = await request(app)
      .delete(`${fixturesUrl}/5e1b70de48bd99411c09389e`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('This resource does not exist');
  });

  it('should return a 422 response when the teamId passed is not a valid mongodb objectId', async () => {
    const res = await request(app)
      .delete(`${fixturesUrl}/5e1b70de48bd99411c09389e---`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(422);
  });
});
