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
    /* istanbul ignore next */
    return helpers.errorResponse(res, 401, 'No token set, please login');
  }

  token = token.split(' ')[1];

  try {
    const verifiedToken = await helpers.verifyToken(token);

    if (!verifiedToken) {
      /* istanbul ignore next */
      return helpers.errorResponse(res, 401, 'Invalid token, please login');
    }

    const existingUser = await helpers.checkIfUserExists({
      _id: verifiedToken.id,
    });

    if (!existingUser) {
      /* istanbul ignore next */
      return helpers.errorResponse(
        res,
        401,
        'Unauthorized user, please signup',
      );
    }

    req.user = existingUser;
    next();
  } catch (error) {
    /* istanbul ignore next */
    return helpers.errorResponse(res, 500, error.message);
  }
};
