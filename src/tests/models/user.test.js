import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from '../../db/models/User';

import { mockUser } from '../mocks/users';

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

describe('Unit tests for user model', () => {
  it('Should create a new user successfully', async () => {
    const newUser = await User.create(mockUser);
    const userCount = await User.countDocuments();

    expect(userCount).toEqual(1);
    expect(newUser.fullName).toEqual('John Doe');
    expect(newUser.email).toEqual('john.doe@example.com');
    expect(newUser.password).toEqual('password');
    expect(newUser.role).toEqual('USER');
  });

  it('Should retrieve users from the database', async () => {
    const users = await User.find();
    const userCount = await User.countDocuments();
    expect(userCount).toEqual(1);
    expect(Array.isArray(users)).toBe(true);
  });

  it('Should update a user in the database', async () => {
    const users = await User.find();
    await User.updateOne(
      { _id: users[0]._id },
      { fullName: 'John Doe updated name' },
    );
    const updatedUser = await User.findById(users[0]._id);
    expect(updatedUser.fullName).toEqual('John Doe updated name');
  });

  it('Should delete a user from the database', async () => {
    const users = await User.find();
    await User.deleteOne({ _id: users[0]._id });
    const currentCount = await User.countDocuments();
    expect(currentCount).toEqual(0);
  });
});
