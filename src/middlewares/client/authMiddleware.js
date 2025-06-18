import { verifyAccessJWT } from "../../helpers/client/jwtHelper.js";
import { getSession } from "../../models/client/sessions/sessionModel.js";
import { findOneUser } from "../..//models/client/user-model/userModel.js";

export const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const decoded = await verifyAccessJWT(authorization);
      if (decoded === "jwt expired") {
        return res.status(403).json({
          status: "error",
          message: "jwt expired",
        });
      }
      if (decoded?.email) {
        const existInDb = await getSession({
          token: authorization,
          type: "accessJWT",
        });
        if (existInDb?._id) {
          const userInfo = await findOneUser({ email: decoded.email });
          if (userInfo?._id) {
            req.userInfo = userInfo;
            return next();
          }
        }
      }
    }
    res.status(401).json({
      status: "error",
      message: "Please login first!",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
};
