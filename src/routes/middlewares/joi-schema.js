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

export const teamSchema = Joi.object()
  .keys({
    name: stringSchema.min(4).required(),
    stadium: stringSchema.min(4).required(),
    manager: stringSchema
      .regex(/^[A-Za-z ]+$/)
      .min(4)
      .required(),
  })
  .options({ ...options });
