import { Types } from 'mongoose';

export const mockUser = {
  _id: Types.ObjectId(),
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password',
  role: 'USER',
};

export const mockAdmin = {
  _id: Types.ObjectId(),
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  password: 'password',
  role: 'ADMIN',
};

export const healthyAdmin = {
  fullName: 'Test Admin',
  email: 'test-admin@example.com',
  password: 'password',
  role: 'ADMIN',
};

export const healthyUser = {
  fullName: 'Test User',
  email: 'test-user@example.com',
  password: 'password',
  role: 'ADMIN',
};

export const missingEmail = {
  fullName: 'John Doe',
  password: 'password',
  role: 'USER',
};

export const missingfirstName = {
  password: 'password',
  email: 'jane.doe@example.com',
  role: 'USER',
};

export const missingPassword = {
  fullName: 'John Doe',
  email: 'jane.doe@example.com',
  role: 'USER',
};

export const wrongRole = {
  fullName: 'John Doe',
  email: 'jane.doe@example.com',
  role: 'OWNER',
  password: 'password',
};

export const missingRole = {
  fullName: 'John Doe',
  email: 'jane.doe@example.com',
  password: 'password',
};
