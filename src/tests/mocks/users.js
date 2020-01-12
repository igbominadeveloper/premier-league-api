export const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password',
  role: 'USER',
};

export const mockAdmin = {
  _id: '507f1f77bcf86cd799439012',
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
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
