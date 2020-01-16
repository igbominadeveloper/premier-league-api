import { errorResponse, getRequestUser } from '../../utils/helpers';

/**
 * Check if the user making a request has admin rights
 * This middleware must always be called after checkTokenValidity
 * because that is where the request user is got from.
 * Don't mess this up!!!
 *
 * @param {object} req
 * @param {object} res
 * @param {void} next
 * @returns {Object} error if the user is not an administrator
 * @returns {void}
 */

const verifyAdminUser = async (req, res, next) => {
  const reqUser = getRequestUser(req);

  if (reqUser.role !== 'ADMIN') {
    return errorResponse(
      res,
      403,
      'You have been caught with your hands in the cookie jar, contact your admin',
    );
  }

  return next();
};

export default verifyAdminUser;
