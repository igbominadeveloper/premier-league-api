import User from '../../db/models/User';
import Fixture from '../../db/models/Fixture';
import Team from '../../db/models/Team';

import {
  checkIfAnyMatchingRecordExists,
  successResponse,
  errorResponse,
} from '../../utils/helpers';

export const find = async (req, res) => {
  const { q } = req.query;

  try {
    const userSearch = checkIfAnyMatchingRecordExists(User, {
      fullName: q,
    });
    const teamSearch = checkIfAnyMatchingRecordExists(Team, {
      name: q,
      stadium: q,
      manager: q,
    });

    const fixtureSearch = checkIfAnyMatchingRecordExists(Fixture, {
      referee: q,
      uniqueLink: q,
      status: q,
    });

    const results = await Promise.all([userSearch, teamSearch, fixtureSearch]);

    return successResponse(res, 200, 'Matches', {
      users: results[0],
      teams: results[1],
      fixtures: results[2],
    });
  } catch (error) {
    /* istanbul ignore next */
    return errorResponse(res, error.message);
  }
};
