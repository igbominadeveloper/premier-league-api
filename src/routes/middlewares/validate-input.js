import Joi from 'joi';

import * as helpers from '../../utils/helpers';

/**
 * validator for request Query
 * @param {Object} schema - validation schema
 * @param {Object} res - Express response object
 * @param {Object} next - pass control to the next handler
 * @returns {Object} Error Response if validation fails
 */

export default function validateRequest(schema, slice) {
  return (req, res, next) => {
    const { error } = Joi.validate(req[slice], schema, {
      abortEarly: false,
      language: {
        key: '{{key}} ',
      },
    });

    if (error) {
      const validationError = error.details.map(errorItem => errorItem.message);
      return helpers.errorResponse(
        res,
        422,
        'validation error',
        validationError,
      );
    }

    next();
  };
}
