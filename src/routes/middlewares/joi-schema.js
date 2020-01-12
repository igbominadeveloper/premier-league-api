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

export const createTeamSchema = Joi.object()
  .keys({
    name: stringSchema.min(4).required(),
    stadium: stringSchema.min(4).required(),
    manager: stringSchema
      .regex(/^[A-Za-z ]+$/)
      .min(4)
      .required(),
  })
  .options({ ...options });

export const updateTeamSchema = Joi.object()
  .keys({
    name: stringSchema.min(4),
    stadium: stringSchema.min(4),
    manager: stringSchema.regex(/^[A-Za-z ]+$/).min(4),
  })
  .options({ ...options });

export const objectIdSchema = Joi.object()
  .keys({
    teamId: Joi.string()
      .regex(/^[a-fA-F0-9]{24}$/)
      .required()
      .error(() => ({
        message: 'ID must be a valid mongodb objectId.',
      })),
  })
  .options({ ...options });
