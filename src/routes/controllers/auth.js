import User from '../../db/models/User';

import * as helpers from '../../utils/helpers';

export const signup = async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    const existingAccount = await helpers.checkIfUserExists({
      email,
      fullName,
    });
    if (existingAccount) {
      return helpers.errorResponse(
        res,
        409,
        'Account with these credentials exists already',
      );
    }

    const hashedPassword = await helpers.hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      fullName,
      role,
    });

    const tokenPayload = {
      id: user.id,
      role: user.role,
    };
    const token = helpers.generateToken(tokenPayload);

    return helpers.successResponse(res, 201, 'Account created successfully', {
      token,
      ...{ email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingAccount = await helpers.checkIfUserExists({ email });
    if (!existingAccount) {
      return helpers.errorResponse(
        res,
        400,
        'Invalid credentials, please login again',
      );
    }
    const passwordCheckedOut = await helpers.comparePassword(
      password,
      existingAccount.password,
    );

    if (!passwordCheckedOut) {
      return helpers.errorResponse(
        res,
        400,
        'Invalid credentials, please login again',
      );
    }

    const tokenPayload = {
      id: existingAccount.id,
      role: existingAccount.role,
    };
    const token = helpers.generateToken(tokenPayload);

    return helpers.successResponse(res, 200, 'Login successful', {
      token,
      ...{ email: existingAccount.email, fullName: existingAccount.fullName },
    });
  } catch (error) {
    /* istanbul ignore next */
    return helpers.serverError(res, error.message);
  }
};
