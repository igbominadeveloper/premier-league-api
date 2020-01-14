import Team from '../../db/models/Team';
import * as helpers from '../../utils/helpers';

export const create = async (req, res) => {
  const { name, manager } = req.body;

  try {
    const existingTeam = await helpers.checkIfAnyMatchingRecordExists(Team, {
      name,
      manager,
    });

    if (existingTeam.length) {
      return helpers.errorResponse(res, 409, 'This Team exists already');
    }

    const newTeam = await Team.create(req.body);

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
    const allTeams = await Team.find();
    return helpers.successResponse(res, 200, 'Got all teams', allTeams);
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
    const teamToUpdate = await Team.findById({ _id: teamId });
    if (!teamToUpdate) {
      return helpers.errorResponse(res, 404, 'This team does not exist');
    }

    const existingTeams = await helpers.checkIfAnyMatchingRecordExists(Team, {
      name,
      manager,
    });

    const matchFound = existingTeams.find(team => String(team._id) === teamId);

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

    return helpers.successResponse(res, 200, 'Team updated successfully', {
      name: updatedTeam.name,
      stadium: updatedTeam.stadium,
      manager: updatedTeam.manager,
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const find = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findOne({ _id: teamId });
    if (!team) {
      return helpers.errorResponse(res, 404, 'This team does not exist');
    }
    return helpers.successResponse(res, 200, 'Team found', team);
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
      return helpers.successResponse(res, 200, 'Team Deleted');
    }
    /* istanbul ignore next */
    throw Error('What could ever happen here anyways?');
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};
