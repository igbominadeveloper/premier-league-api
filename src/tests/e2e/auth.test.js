import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../server';
import * as mocks from '../mocks/users';
import User from '../../db/models/User';

const signupUrl = '/api/v1/auth/signup';

beforeAll(async () => await User.deleteMany({}));

afterAll(async done => {
  await User.deleteMany({});
  await mongoose.connection.close();
  done();
});

describe('User registration', () => {
  it('should create a user successfully when valid input are supplied', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.mockUser);
    expect(res.status).toBe(201);
    expect(Object.keys(res.body.data).includes('token')).toBeTruthy();
    expect(res.body.data.token).not.toBe('');
  });

  it('should throw an error when email is missing', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.missingEmail);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('email is required');
  });

  it('should throw an error when fullName is missing', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.missingfirstName);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('fullName is required');
  });

  it('should throw an error when password is missing', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.missingPassword);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('password is required');
  });

  it('should throw an error when role is missing', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.missingRole);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('role is required');
  });

  it('should throw an error when a wrong role is passed', async () => {
    const res = await request(app)
      .post(signupUrl)
      .send(mocks.wrongRole);
    expect(res.status).toBe(422);
    expect(res.body.error[0]).toBe('role must be one of [ADMIN, USER]');
  });
});
