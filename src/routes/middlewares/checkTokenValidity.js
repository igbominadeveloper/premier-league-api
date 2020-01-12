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

  if (!token) {
    return helpers.errorResponse(res, 401, 'Unauthorized user, please login');
  }

  token = token.split(' ')[1];

  const verifiedToken = await helpers.verifyToken(token);

  if (!verifiedToken) {
    return helpers.errorResponse(res, 401, 'Unauthorized user, please login');
  }

  try {
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
    return errorResponse(res, 400, error.message);
  }
};
