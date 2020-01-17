/* istanbul ignore file */

import { Types } from 'mongoose';

import User from '../User';
import { hashPassword } from '../../../utils/helpers';

const seedUsers = async () => {
  const users = [
    {
      _id: Types.ObjectId(),
      fullName: 'Leanne Graham',
      password: await hashPassword('password1'),
      email: 'Sincere@april.biz',
      role: 'USER',
    },
    {
      _id: Types.ObjectId(),
      fullName: 'Ervin Howell',
      password: await hashPassword('password1'),
      email: 'Shanna@melissa.tv',
      role: 'USER',
    },
    {
      _id: Types.ObjectId(),
      fullName: 'Clementine Bauch',
      password: await hashPassword('password1'),
      email: 'Nathan@yesenia.net',
      role: 'ADMIN',
    },
  ];

  console.log('seeding users now');
  await User.insertMany(users);
  console.log('users seeded successfully');
};

export default seedUsers;
