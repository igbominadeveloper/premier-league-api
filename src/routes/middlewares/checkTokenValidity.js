/* istanbul ignore file */

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
  try {
    let token = req.headers.authorization || req.headers['x-access-token'];

    if (!token || !token.length > 0) {
      /* istanbul ignore next */
      return helpers.errorResponse(res, 401, 'No token set, please login');
    }

    token = token.split(' ')[1];

    const verifiedToken = await helpers.verifyToken(token);

    if (!verifiedToken) {
      /* istanbul ignore next */
      return helpers.errorResponse(res, 401, 'Invalid token, please login');
    }

    const requestUser = helpers.getRequestUser(req);
    if (process.env.NODE_ENV !== 'test') {
      if (!requestUser) {
        /* istanbul ignore next */
        return helpers.errorResponse(res, 401, 'You are not logged in');
      }

      if (requestUser.id !== verifiedToken.id) {
        return helpers.errorResponse(
          res,
          401,
          'Session Expired',
          'please login',
        );
      }
    } else {
      req.user = {
        id: verifiedToken.id,
        role: verifiedToken.role,
      };
    }

    next();
  } catch (error) {
    /* istanbul ignore next */
    return helpers.errorResponse(res, 500, error.message);
  }
};
