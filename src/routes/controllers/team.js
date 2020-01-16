import Team from '../../db/models/Team';
import * as helpers from '../../utils/helpers';

export const create = async (req, res) => {
  const { name, manager, stadium } = req.body;

  try {
    const existingTeam = await helpers.checkIfAnyMatchingRecordExists(Team, {
      name,
      manager,
    });

    if (existingTeam.length) {
      return helpers.errorResponse(res, 409, 'This Team exists already');
    }

    const newTeam = await Team.create({ name, manager, stadium });
    helpers.storeToRedis(`teams:${newTeam._id}`, newTeam);

    Team.find()
      .then(teams => helpers.storeToRedis('teams', teams))
      .catch(error => {
        throw new Error(error);
      });
    return helpers.successResponse(res, 201, 'Team created successfully', {
      id: newTeam._id,
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
    return helpers.getFromRedis('teams', async result => {
      if (result) {
        return helpers.successResponse(
          res,
          200,
          'Got all teams from redis',
          JSON.parse(result),
        );
      }
      const allTeams = await Team.find();

      if (allTeams.length) {
        helpers.storeToRedis('teams', allTeams);
      }

      return helpers.successResponse(
        res,
        200,
        'Got all teams from db',
        allTeams,
      );
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const update = async (req, res) => {
  // These fields are not compulsory to be there but
  // they better not be empty strings or unmatched types
  const { name, manager } = req.body;
  const { teamId } = req.params;

  try {
    return helpers.getFromRedis(`teams:${teamId}`, async result => {
      if (!result) {
        const teamToUpdate = await Team.findById({ _id: teamId });
        if (!teamToUpdate) {
          return helpers.errorResponse(res, 404, 'This team does not exist');
        }
      }

      const existingTeams = await helpers.checkIfAnyMatchingRecordExists(Team, {
        name,
        manager,
      });

      const matchFound = existingTeams.find(
        team => String(team._id) === teamId,
      );

      if (existingTeams.length && !matchFound) {
        return helpers.errorResponse(
          res,
          409,
          'A team with these details exists already',
        );
      }

      const updatedTeam = await Team.findOneAndUpdate(
        { _id: teamId },
        { ...req.body },
        { new: true },
      );

      helpers.storeToRedis(`teams:${teamId}`, updatedTeam);

      Team.find()
        .then(teams => helpers.storeToRedis('teams', teams))
        .catch(error => {
          throw new Error(error);
        });

      return helpers.successResponse(res, 200, 'Team updated successfully', {
        name: updatedTeam.name,
        stadium: updatedTeam.stadium,
        manager: updatedTeam.manager,
      });
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const find = async (req, res) => {
  const { teamId } = req.params;

  try {
    return helpers.getFromRedis(`teams:${teamId}`, async result => {
      if (result) {
        return helpers.successResponse(
          res,
          200,
          'Response from redis',
          JSON.parse(result),
        );
      }

      const team = await Team.findOne({ _id: teamId });
      if (!team) {
        return helpers.errorResponse(res, 404, 'This team does not exist');
      }

      helpers.storeToRedis(`teams:${teamId}`, team);
      return helpers.successResponse(res, 200, 'Response from db', team);
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const deleteOne = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({ _id: teamId });
    if (!team) {
      return helpers.errorResponse(res, 404, 'This team does not exist');
    }
    const deletedTeam = await Team.findByIdAndDelete({ _id: teamId });

    if (deletedTeam) {
      helpers.removeFromRedis(`teams:${teamId}`);
      Team.find()
        .then(result => helpers.storeToRedis('teams', result))
        .catch(error => {
          throw new Error(error);
        });

      return helpers.successResponse(res, 200, 'Team Deleted');
    }
    /* istanbul ignore next */
    throw new Error('What could ever happen here anyways?');
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};
