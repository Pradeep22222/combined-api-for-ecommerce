import jwt from "jsonwebtoken";
import { deleteSession, insertSession } from "../../models/client/sessions/sessionModel.js";
import { updateOneUser } from "../../models/client//user-model/userModel.js";
export const signAccessJWT = async (payload) => {
  const accessJWT = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_CLIENT, {
    expiresIn: "15m",
  });
  const obj = {
    token: accessJWT,
    type: "accessJWT",
  };
  await insertSession(obj);
  return accessJWT;
};
const signRefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_CLIENT, {
    expiresIn: "30d",
  });
  await updateOneUser(payload, { refreshJWT });
  return refreshJWT;
};
export const createJWTs = async (payload) => {
  return {
    accessJWT: await signAccessJWT(payload),
    refreshJWT: await signRefreshJWT(payload),
  };
};

export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET_CLIENT);
  } catch ({ message }) {
    if (message === "jwt expired") {
      deleteSession({
        type: "accessJWT",
        token,
      });
    }
    return message;
  }
};

export const verifyRefreshJWT = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET_CLIENT);
};