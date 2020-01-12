import User from '../../db/models/User';

import * as helpers from '../../utils/helpers';

export const signup = async (req, res) => {
  const { email, password, fullName } = req.body;

  try {
    const existingAccount = await helpers.checkDuplicateUser(email, fullName);
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
    });
    const tokenPayload = {
      id: user.id,
      email: user.email,
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
