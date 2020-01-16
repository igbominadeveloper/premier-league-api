import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../server';

import * as mocks from '../mocks/teams';
import { mockUser, mockAdmin } from '../mocks/users';

import User from '../../db/models/User';
import Team from '../../db/models/Team';

import { generateToken } from '../../utils/helpers';
import redisClient from '../../config/redis';

const teamsUrl = '/api/v1/teams';

let userToken;
let adminToken;

beforeAll(async () => {
  await User.deleteMany({});
  await Team.deleteMany({});
  const users = await User.insertMany([mockAdmin, mockUser]);
  adminToken = await generateToken({ id: users[0]._id, role: 'ADMIN' }, '1h');
  userToken = await generateToken({ id: users[1]._id, role: 'USER' }, '1h');
});

afterAll(async done => {
  redisClient.quit();
  await mongoose.connection.close();
  done();
});

describe('E2E Team creation', () => {
  it('should throw an error when a token is not present in the request header', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .send(mocks.mockTeam1);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
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
      .send(mocks.healthyTeam);

    expect(res.status).toBe(201);
    expect(Object.keys(res.body.data).includes('name')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('stadium')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('manager')).toBeTruthy();
  });

  it('should throw an error when the team is existing already', async () => {
    const res = await request(app)
      .post(teamsUrl)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.healthyTeam);
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
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should fetch all teams', async () => {
    const res = await request(app)
      .get(teamsUrl)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('E2E Team Update', () => {
  let team;
  const updateBody = {
    name: 'Arsenal Ladies FC',
    stadium: 'Emirates Mini Stadium',
    manager: 'Nigel Pearson',
  };

  it('should throw an error when a token is not present in the request header', async () => {
    team = await Team.findOne();

    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .send(updateBody);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should throw an error when the user making the request does not have admin rights', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${userToken}`)
      .send(updateBody);
    expect(res.status).toBe(403);
  });

  it('should update a team successfully when valid inputs are supplied', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(updateBody);
    expect(res.status).toBe(200);
    expect(Object.keys(res.body.data).includes('name')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('stadium')).toBeTruthy();
    expect(Object.keys(res.body.data).includes('manager')).toBeTruthy();
  });

  it('should throw an error when the user tries passing an empty string in the name field', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...updateBody, name: '' });

    expect(res.status).toBe(422);
    expect(
      res.body.error.includes('name is not allowed to be empty'),
    ).toBeTruthy();
  });

  it('should throw an error when the stadium field is an empty string', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...updateBody, stadium: '' });
    expect(res.status).toBe(422);
    expect(
      res.body.error.includes('stadium is not allowed to be empty'),
    ).toBeTruthy();
  });

  it('should throw an error when the manager field is an empty string', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send({ ...updateBody, manager: '' });
    expect(res.status).toBe(422);
    expect(
      res.body.error.includes('manager is not allowed to be empty'),
    ).toBeTruthy();
  });

  it('should throw an error when the manager name is not a valid string', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(mocks.invalidManagerName);
    expect(res.status).toBe(422);
  });

  it('should throw an error when the teamId passed is not a valid MongoDB ObjectId', async () => {
    const res = await request(app)
      .patch(`${teamsUrl}/p-=872---`)
      .set('authorization', `Bearer ${adminToken}`)
      .send(updateBody);
    expect(res.status).toBe(422);
  });
});

describe('E2E Fetch a single team', () => {
  let team;
  it('should throw an error when a token is not present in the request header', async () => {
    team = await Team.findOne();
    const res = await request(app).get(`${teamsUrl}/${team._id}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should fetch a team successfully', async () => {
    const res = await request(app)
      .get(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe(team.name);
  });

  it('should return a 404 response when the team cannot be found', async () => {
    const res = await request(app)
      .get(`${teamsUrl}/5e1b70de48bd99411c09389e`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('This team does not exist');
  });

  it('should return a 422 response when the teamId passed is not a valid mongodb objectId', async () => {
    const res = await request(app)
      .get(`${teamsUrl}/5e1b70de48bd99411c09389e---`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(422);
  });
});

describe('E2E Delete a team', () => {
  let team;
  it('should throw an error when a token is not present in the request header', async () => {
    team = await Team.findOne();

    const res = await request(app).delete(`${teamsUrl}/${team._id}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No token set, please login');
  });

  it('should delete a team successfully', async () => {
    const res = await request(app)
      .delete(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Team Deleted');
  });

  it('should return a 403 response if the user does not have admin privileges', async () => {
    const res = await request(app)
      .delete(`${teamsUrl}/${team._id}`)
      .set('authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('should return a 404 response when the team cannot be found', async () => {
    const res = await request(app)
      .delete(`${teamsUrl}/5e1b70de48bd99411c09389e`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('This team does not exist');
  });

  it('should return a 422 response when the teamId passed is not a valid mongodb objectId', async () => {
    const res = await request(app)
      .delete(`${teamsUrl}/5e1b70de48bd99411c09389e---`)
      .set('authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(422);
  });
});
