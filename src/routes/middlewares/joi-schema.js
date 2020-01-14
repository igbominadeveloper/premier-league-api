import Joi from 'joi';

const stringSchema = Joi.string().trim();
const roleSchema = Joi.string()
  .trim()
  .uppercase()
  .valid(['ADMIN', 'USER'])
  .required();

const options = {
  stripUnknown: true,
  convert: true,
};

const email = stringSchema
  .email({
    minDomainAtoms: 2,
  })
  .required();

const fullNameSchema = stringSchema
  .lowercase()
  .min(4)
  .required();

const objectIdSchema = Joi.string()
  .regex(/^[a-fA-F0-9]{24}$/)
  .error(errors => {
    const [error] = errors;
    const { type, context } = error;
    if (type === 'string.regex.base') {
      return {
        message: `${context.key} must be a valid mongodb objectId`,
      };
    }
    if (type === 'any.required') {
      return {
        message: `${context.key} is required`,
      };
    }
  });

const alphabetsOnlySchema = Joi.string()
  .regex(/^[A-Za-z ]+$/)
  .error(errors => {
    const [error] = errors;
    const { type, context } = error;
    if (type === 'string.regex.base') {
      return {
        message: `${context.key} can only contain alphabets and whitespace between words`,
      };
    }
    if (type === 'any.required') {
      return {
        message: `${context.key} is required`,
      };
    }
    if (type === 'any.empty') {
      return {
        message: `${context.key} is not allowed to be empty`,
      };
    }

    if (type === 'string.min') {
      return {
        message: `${context.key} value cannot be less than ${context.limit} `,
      };
    }
  });

// Authentication schemas
export const signupSchema = Joi.object()
  .keys({
    fullName: fullNameSchema,
    email,
    password: Joi.string()
      .min(4)
      .required(),
    role: roleSchema,
  })
  .options({ ...options });

export const loginSchema = Joi.object()
  .keys({
    email,
    password: stringSchema.required(),
  })
  .options({ ...options });

// Teams schemas
export const createTeamSchema = Joi.object()
  .keys({
    name: stringSchema.min(4).required(),
    stadium: stringSchema.min(4).required(),
    manager: alphabetsOnlySchema.min(4).required(),
  })
  .options({ ...options });

export const updateTeamSchema = Joi.object()
  .keys({
    name: stringSchema.min(4),
    stadium: stringSchema.min(4),
    manager: alphabetsOnlySchema.min(4),
  })
  .options({ ...options });

export const teamIdSchema = Joi.object()
  .keys({
    teamId: objectIdSchema.required(),
  })
  .options({ ...options });

// Fixtures

const fixtureDateSchema = Joi.date()
  .min('now')
  .error(errors => {
    const [error] = errors;
    const { type, context } = error;
    if (type === 'any.required') {
      return {
        message: `${context.key} is required`,
      };
    }
    if (type === 'any.empty') {
      return {
        message: `${context.key} is required`,
      };
    }

    if (type === 'date.min') {
      return {
        message: `${context.key} must be later than or equal to today`,
      };
    }
    if (type === 'date.base') {
      return {
        message: `${context.key} must be later than or equal to today`,
      };
    }
    return `${context.key} must be a valid date type and must be greater than or equal to today`;
  });

export const createFixtureSchema = Joi.object()
  .keys({
    date: fixtureDateSchema.required(),
    homeTeamId: objectIdSchema.required(),
    awayTeamId: objectIdSchema.required(),
    referee: alphabetsOnlySchema.min(4).required(),
  })
  .options({ ...options });

export const fixtureIdSchema = Joi.object()
  .keys({
    fixtureId: objectIdSchema.required(),
  })
  .options({ ...options });

export const updateFixtureSchema = Joi.object()
  .keys({
    date: fixtureDateSchema,
    referee: alphabetsOnlySchema.min(4),
    status: stringSchema
      .uppercase()
      .valid(['PENDING', 'PLAYED', 'POSTPONED', 'CANCELLED']),
  })
  .options({ ...options });

export const searchSchema = Joi.object()
  .keys({
    q: alphabetsOnlySchema.required(),
  })
  .options({ ...options });
