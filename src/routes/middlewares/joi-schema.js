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
      .alphanum()
      .min(4)
      .required(),
    role: roleSchema,
  })
  .options({ ...options });

export const loginSchema = Joi.object()
  .keys({
    email,
    password: stringSchema.alphanum().required(),
  })
  .options({ ...options });
