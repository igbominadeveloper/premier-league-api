import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../db/models/User';

dotenv.config();

/**
 * Check User duplication before signup
 *
 * @param {String} email
 * @param {String} fullName
 * @returns {Boolean} true if record exists
 * @returns {Boolean} false if record does not exist
 */
export const checkDuplicateUser = (email, fullName) =>
  User.findOne({ email, fullName });

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
