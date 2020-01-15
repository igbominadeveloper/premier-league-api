import User from '../../db/models/User';
import Fixture from '../../db/models/Fixture';
import Team from '../../db/models/Team';

import {
  checkIfAnyMatchingRecordExists,
  successResponse,
  errorResponse,
  getFromRedis,
  storeToRedis,
} from '../../utils/helpers';

export const find = async (req, res) => {
  const { q } = req.query;

  try {
    const redisKey = `search:${q}`;
    return getFromRedis(redisKey, async result => {
      if (result) {
        const responseBody = JSON.parse(result);

        return successResponse(res, 200, 'Results from redis', {
          users: responseBody[0],
          teams: responseBody[1],
          fixtures: responseBody[2],
        });
      }

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

      const results = await Promise.all([
        userSearch,
        teamSearch,
        fixtureSearch,
      ]);

      storeToRedis(redisKey, results);

      return successResponse(res, 200, 'Results from db', {
        users: results[0],
        teams: results[1],
        fixtures: results[2],
      });
    });
  } catch (error) {
    /* istanbul ignore next */
    return errorResponse(res, error.message);
  }
};
