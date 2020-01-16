/* istanbul ignore file */

import { name, company } from 'faker';
import { Types } from 'mongoose';

import Team from '../Team';

const seedTeam = async () => {
  const teams = [
    {
      _id: Types.ObjectId(),
      name: 'Romaguera Crona',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Deckow Crist',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Romaguera Jacomanageron',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Robel Corkery',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Keebler LLC',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Considine Lockman',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Johns Group',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Abernathy Group',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Yost and Sons',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },

    {
      _id: Types.ObjectId(),
      name: 'Hoeger LLC',
      stadium: company.companyName() + ' stadium',
      manager: name.firstName() + ' ' + name.lastName(),
    },
  ];

  console.log('seeding teams now');
  await Team.insertMany(teams);
  console.log('teams seeded successfully');
};

export default seedTeam;
