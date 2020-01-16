/* istanbul ignore file */

import { Types } from 'mongoose';

import Fixture from '../Fixture';
import Team from '../Team';
import User from '../User';
import { stripAllSpaces } from '../../../utils/helpers';

const seedFixture = async () => {
  const teams = await Team.find();
  const user = await User.findOne({ email: 'Nathan@yesenia.net' });

  console.log('seeding fixtures now');
  await Fixture.insertMany([
    {
      _id: Types.ObjectId(),
      date: '2-22-2020',
      homeTeamId: teams[0]._id,
      awayTeamId: teams[1]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[0].name) + '-vs-' + stripAllSpaces(teams[1].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '3-12-2020',
      homeTeamId: teams[1]._id,
      awayTeamId: teams[0]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[1].name) + '-vs-' + stripAllSpaces(teams[0].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '1-12-2020',
      homeTeamId: teams[2]._id,
      awayTeamId: teams[3]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[2].name) + '-vs-' + stripAllSpaces(teams[3].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '4-20-2020',
      homeTeamId: teams[3]._id,
      awayTeamId: teams[2]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[3].name) + '-vs-' + stripAllSpaces(teams[2].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '5-22-2020',
      homeTeamId: teams[4]._id,
      awayTeamId: teams[5]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[4].name) + '-vs-' + stripAllSpaces(teams[5].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '3-22-2020',
      homeTeamId: teams[5]._id,
      awayTeamId: teams[4]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[5].name) + '-vs-' + stripAllSpaces(teams[4].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '9-13-2020',
      homeTeamId: teams[6]._id,
      awayTeamId: teams[7]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[6].name) + '-vs-' + stripAllSpaces(teams[7].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '1-28-2020',
      homeTeamId: teams[7]._id,
      awayTeamId: teams[6]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[7].name) + '-vs-' + stripAllSpaces(teams[6].name),
      createdBy: user._id,
    },
    {
      _id: Types.ObjectId(),
      date: '6-29-2020',
      homeTeamId: teams[8]._id,
      awayTeamId: teams[9]._id,
      referee: 'Phil Dowd',
      status: 'PENDING',
      uniqueLink:
        stripAllSpaces(teams[8].name) + '-vs-' + stripAllSpaces(teams[9].name),
      createdBy: user._id,
    },
  ]);

  console.log('fixtures seeded successfully');
  console.log(`
  ⊂_ヽ
 　 ＼＼ 
 　　 ＼( ͡° ͜ʖ ͡°)
 　　　 >　⌒ヽ
 　　　/ 　 へ＼
 　　 /　　/　＼＼
 　　 ﾚ　ノ　　 ヽ_つ
 　　/　/
 　 /　/|
 　(　(ヽ
 　|　|、＼
 　| 丿 ＼ ⌒)
 　| |　　) /
 ノ )　　Lﾉ
 (_／)
 All seeds completed
 `);
};

export default seedFixture;
