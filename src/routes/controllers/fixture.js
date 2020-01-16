import Fixture from '../../db/models/Fixture';
import * as helpers from '../../utils/helpers';

export const create = async (req, res) => {
  const { date, homeTeamId, awayTeamId } = req.body;
  const reqUser = helpers.getRequestUser(req);

  try {
    const existingFixture = await helpers.checkIfFixtureExists({
      date,
      homeTeamId,
      awayTeamId,
    });

    if (existingFixture) {
      return helpers.errorResponse(res, 409, 'This Fixture exists already');
    }

    const homeTeam = await helpers.checkIfTeamExists({
      _id: homeTeamId,
    });

    const awayTeam = await helpers.checkIfTeamExists({
      _id: awayTeamId,
    });

    if (!homeTeam) {
      return helpers.errorResponse(
        res,
        404,
        `This team ${homeTeamId} cannot be found`,
      );
    }
    if (!awayTeam) {
      return helpers.errorResponse(
        res,
        404,
        `This team ${awayTeamId} cannot be found`,
      );
    }

    // strip all spaces in between the words
    const homeTeamName = helpers.stripAllSpaces(homeTeam.name);
    const awayTeamName = helpers.stripAllSpaces(awayTeam.name);
    const fixtureLink = `${homeTeamName}-vs-${awayTeamName}-${Math.random()
      .toString()
      .replace('.', '')}`;

    const newFixture = await Fixture.create({
      ...req.body,
      createdBy: reqUser.id,
      uniqueLink: fixtureLink,
    });

    helpers.storeToRedis(`fixture:${newFixture._id}`, newFixture);
    Fixture.find()
      .then(fixtures => helpers.storeToRedis('fixtures', fixtures))
      .catch(error => {
        throw new Error(error);
      });

    return helpers.successResponse(res, 201, 'Fixture created successfully', {
      date: new Date(newFixture.date).toUTCString(),
      stadium: homeTeam.stadium,
      referee: newFixture.referee,
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
      uniqueLink: newFixture.uniqueLink,
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const all = async (req, res) => {
  const { status } = req.query;

  try {
    const key = status ? `fixtures:${status}` : 'fixtures';

    return helpers.getFromRedis(key, async result => {
      if (result) {
        return helpers.successResponse(
          res,
          200,
          'Fetched all fixtures from redis',
          JSON.parse(result),
        );
      }

      const fixtures = await Fixture.find(
        status && {
          status: status.toUpperCase(),
        },
      );

      if (fixtures.length) {
        helpers.storeToRedis(key, fixtures);
      }

      return helpers.successResponse(
        res,
        200,
        'Fetched all fixtures from db',
        fixtures,
      );
    });
  } catch (error) {
    return helpers.serverError(res, error.message);
  }
};

export const find = async (req, res) => {
  const { fixtureId } = req.params;

  try {
    return helpers.getFromRedis(`fixtures:${fixtureId}`, async result => {
      if (result) {
        return helpers.successResponse(
          res,
          200,
          'Fixture found in redis',
          JSON.parse(result),
        );
      }

      const fixture = await helpers.checkIfFixtureExists({ _id: fixtureId });

      if (!fixture) {
        return helpers.errorResponse(res, 404, 'This fixture does not exist');
      }

      helpers.storeToRedis(`fixtures:${fixtureId}`, fixture);

      return helpers.successResponse(res, 200, 'Fixture found in db', fixture);
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const update = async (req, res) => {
  const { fixtureId } = req.params;

  try {
    const updatedFixture = await Fixture.findOneAndUpdate(
      { _id: fixtureId },
      { ...req.body },
      { new: true },
    );

    helpers.storeToRedis(`fixtures:${fixtureId}`, updatedFixture);

    Fixture.find()
      .then(result => helpers.storeToRedis('fixtures', result))
      .catch(error => {
        throw new Error(error);
      });

    return helpers.successResponse(res, 200, 'Fixture updated successfully', {
      name: updatedFixture.name,
      referee: updatedFixture.referee,
      date: updatedFixture.date,
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const deleteOne = async (req, res) => {
  const { fixtureId } = req.params;

  try {
    const deletedFixture = await Fixture.findByIdAndDelete({ _id: fixtureId });
    if (deletedFixture) {
      helpers.removeFromRedis(`fixtures:${fixtureId}`);

      Fixture.find()
        .then(result => helpers.storeToRedis('fixtures', result))
        .catch(error => {
          throw new Error(error);
        });

      return helpers.successResponse(res, 200, 'Fixture Deleted');
    }
    /* istanbul ignore next */
    throw new Error('What could ever happen here anyways?');
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};
