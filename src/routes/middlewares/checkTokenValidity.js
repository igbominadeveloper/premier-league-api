import dotenv from 'dotenv';

import * as helpers from '../../utils/helpers';

dotenv.config();

/**
 *
 * @export
 * @param {object} req Express request object
 * @param {object} res Express response object
 * @param {void} next call the next function
 * @returns {void}
 */
export const checkTokenValidity = async (req, res, next) => {
  let token = req.headers.authorization || req.headers['x-access-token'];

  if (!token || !token.length > 0) {
    return helpers.errorResponse(res, 401, 'Unauthorized user, please login');
  }

  token = token.split(' ')[1];

  try {
    const verifiedToken = await helpers.verifyToken(token);

    if (!verifiedToken) {
      return helpers.errorResponse(res, 401, 'Unauthorized user, please login');
    }

    const existingUser = await helpers.checkIfUserExists({
      _id: verifiedToken.id,
    });

    if (!existingUser) {
      return helpers.errorResponse(
        res,
        401,
        'Unauthorized user, please signup',
      );
    }

    req.user = existingUser;
    next();
  } catch (error) {
    return helpers.errorResponse(res, 400, error.message);
  }
};
