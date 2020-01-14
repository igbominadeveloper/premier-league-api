import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../db/models/User';
import Fixture from '../db/models/Fixture';
import Team from '../db/models/Team';

dotenv.config();

/**
 * Check User account existence
 *
 * @param {Object} keys
 * @returns {Object} if record exists
 * @returns {null} if record does not exist
 */
export const checkIfUserExists = keys => User.findOne({ ...keys });

/**
 * custom error response function
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} errors
 */
export const errorResponse = (res, statusCode, message, error = {}) =>
  res.status(statusCode).json({
    status: 'error',
    message,
    error,
  });

/**
 * custom success response function
 * @param {Object} res
 * @param {Number} statusCode
 * @param {String} message
 * @param {Object} data
 */
export const successResponse = (res, statusCode, message = '', data) =>
  res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });

/**
 * Clean formatted server error based on application environment
 * @param {Object} res
 * @param {String} error
 */
export const serverError = (res, error) =>
  res.status(500).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Your request could not be processed at this time. Kindly try again later.'
        : error,
  });

/**
 * Password Hasher
 *
 * @export
 * @param {string} password
 * @param {number} [salt=10]
 * @returns {string} hash
 */
export const hashPassword = (password, salt = 10) =>
  bcrypt.hash(password, salt);

/**
 * Password Compare
 *
 * @export
 * @param {string} password
 * @param {string} existingUserPassword
 * @returns {string} hash
 */
export const comparePassword = (password, existingUserPassword) =>
  bcrypt.compareSync(password, existingUserPassword);

/**
 * Generate JWT Token for authenticated users
 *
 * @export
 * @param {Object} payload
 * @param {string} [expiresIn='30days']
 * @returns {string} token
 */
export const generateToken = (payload, expiresIn = '30days') =>
  jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn,
  });

/**
 * Check if Matching record exists
 *
 * @param {Object} fields model fields
 * @param {Model} MongooseModel to user to search with
 */
export const checkIfAnyMatchingRecordExists = async (Model, fields) => {
  const query = Model.find();
  Object.keys(fields).forEach(field =>
    query.or({ [field]: new RegExp(fields[field], 'ig') }),
  );
  return query;
};

/**
 *
 * @param {String} token
 * @returns {Boolean} decoded token if token is valid
 * @returns {Boolean} false if token is invalid
 */
export const verifyToken = token => jwt.verify(token, process.env.SECRET_KEY);

/**
 * Check Fixture existence
 *
 * @param {Object} keys
 * @returns {Object} if record exists
 * @returns {null} if record does not exist
 */
export const checkIfFixtureExists = keys => Fixture.findOne({ ...keys });

/**
 * strip all whitespaces from a word or words
 *
 * @param {String} words
 */
export const stripAllSpaces = words => words.replace(/\s/gi, '');

/**
 * Check Team existence
 *
 * @param {Object} keys
 * @returns {Object} if record exists
 * @returns {null} if record does not exist
 */
export const checkIfTeamExists = keys => Team.findOne({ ...keys });
