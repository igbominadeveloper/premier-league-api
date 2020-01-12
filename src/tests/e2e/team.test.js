import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../server';

import * as mocks from '../mocks/teams';
import { mockUser, mockAdmin } from '../mocks/users';

import User from '../../db/models/User';
import Team from '../../db/models/Team';

import { generateToken } from '../../utils/helpers';

const teamsUrl = '/api/v1/teams';

let userToken;
let adminToken;

beforeAll(async () => {
  await Team.deleteMany({});
  const users = await User.insertMany([mockAdmin, mockUser]);
  adminToken = await generateToken({ id: users[0]._id }, '5m');
  userToken = await generateToken({ id: users[1]._id }, '5m');
});

afterAll(async done => {
  await Team.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
  done();
});

describe('E2E Team creation', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .send(mocks.mockTeam1);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized user, please login');
  });

  it('should throw an error when the user making the request does not have admin rights', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${userToken}`)
      .send(mocks.mockTeam1);
    expect(res.status).toBe(403);
  });

  it('should create a team successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.mockTeam1);
    expect(res.status).toBe(201);
    expect(Object.keys(res.body.data).includes('name')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('stadium')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('manager')).toBeTruthy();
  });

  it('should throw an error when the team is existing already', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.mockTeam1);
    expect(res.status).toBe(409);
    expect(res.body.message).toBe('This Team exists already');
  });

  it('should throw an error when the team name is missing', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingName);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('name is required');
  });

  it('should throw an error when manager name is missing', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingManager);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('manager is required');
  });

  it('should throw an error when stadium name is missing', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.missingStadium);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('stadium is required');
  });

  it('should throw an error when the manager name is not a valid string', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.invalidManagerName);
    expect(res.status).toBe(422);
  });
});

describe('E2E Fetch all teams', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app).get(teamsUrl);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized user, please login');
  });

  it('should fetch all teams', async () => {
    const res = await request(app)
      .get(teamsUrl)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
