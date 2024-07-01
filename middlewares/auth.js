const constants = require("../constants");
const { errorHandler } = require("../helpers/outputHandler");
const { isAdmin } = require("../helpers/isAdmin");
const { users } = require("../models/users");

const Auth = async (req, res, next) => {
  // Allow unprotected paths
  for (let path of constants.unprotectedPaths) {
    path = path.replace(/:variable/g, ".*?");
    const requestedResource = req.method + "-" + req.path;
    if (requestedResource.match(path)) {
      return next();
    }
  }

  // check for content type
  // if (!req.headers.accept.includes('application/json')) {
  //     return res.status(401).json({ message: 'Incorrect Content Type' });
  // }

  // check for the auth property added by express-jwt
  if (!req.auth) {
    return errorHandler(
      {
        code: 401,
        message: "Missing Authorization Header",
      },
      req,
      res
    );
  }
  if (req.auth._id) {
    let userRecord = await users.findById(req.auth._id);
    if (!userRecord) {
      return errorHandler(
        {
          code: 403,
          message: "Account doesn't exist",
        },
        req,
        res
      );
    }
  }

  if (req.path.indexOf("admin") > -1 && !isAdmin(req)) {
    return errorHandler(
      {
        code: 401,
        message: "Non admin cannot access admin routes",
      },
      req,
      res
    );
  }
  next();
};

module.exports = {
  Auth,
};
