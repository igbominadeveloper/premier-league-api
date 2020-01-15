import * as helpers from '../../utils/helpers';

export const checkResourceOwner = (Model, key) => async (req, res, next) => {
  const { params } = req;
  let resource;
  const redisKey = `${Model.modelName.toLowerCase()}s:${params[key]}`;

  return helpers.getFromRedis(redisKey, async result => {
    if (!result) {
      resource = await Model.findOne({ _id: params[key] });
    } else {
      resource = JSON.parse(result);
    }

    if (!resource) {
      return helpers.errorResponse(res, 404, 'This resource does not exist');
    }

    // check if the resource owner is the request user
    if (String(resource.createdBy) !== String(req.user._id)) {
      return helpers.errorResponse(
        res,
        403,
        'You have been caught with your hands in the cookie jar, contact your admin',
      );
    }

    req[Model.modelName.toLowerCase()] = resource;
    helpers.storeToRedis(redisKey, resource);
    next();
  });
};
