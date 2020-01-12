import Team from '../../db/models/Team';
import * as helpers from '../../utils/helpers';

export const create = async (req, res) => {
  const { name, manager } = req.body;

  try {
    const existingTeam = await helpers.checkIfTeamExists(name, manager);

    if (existingTeam.length) {
      return helpers.errorResponse(res, 409, 'This Team exists already');
    }

    const newTeam = await Team.create(req.body);

    return helpers.successResponse(res, 201, 'Team created successfully', {
      name: newTeam.name,
      stadium: newTeam.stadium,
      manager: newTeam.manager,
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const all = async (req, res) => {
  try {
    const allTeams = await Team.find();
    return helpers.successResponse(res, 200, 'Got all teams', allTeams);
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};
