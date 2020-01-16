/* istanbul ignore file */

import { connection } from 'mongoose';

import seedUsers from './seeders/user';
import seedFixture from './seeders/fixture';
import seedTeam from './seeders/team';

const up = async () => {
  try {
    await seedUsers();
    await seedTeam();
    await seedFixture();
  } catch (error) {
    console.log(error.message);
  }
};

const down = async () => {
  await connection.dropDatabase();
};

export default { up, down };
