import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  findAdminUsers,
  findOneAdminUser,
  findOneAndDelete,
  insertAdminUser,
  updateOneAdminUser,
} from "../../models/admin/adminUserModel/AdminUserModel.js";
import { comparePassword, hashPassword } from "../../helpers/admin/bcryptHelper.js";
import {
  emailVerificationValidation,
  loginValidation,
  newAdminUserValidation,
  resetPasswordValidation,
  updateAdminUserValidation,
  updatePasswordValidation,
} from "../../middlewares/admin/joi-validation/joiValidation.js";
import {
  otpNotification,
  userVerifiedNotification,
  verificationEmail,
} from "../../helpers/admin/emailHelper.js";
import {
  createJWTs,
  signAccessJWT,
  verifyRefreshJWT,
} from"../../helpers/admin/jwtHelpers.js";
import { adminAuth } from "../../middlewares/admin/auth-middleware/authMiddleware.js";
import {
  deleteSession,
  insertSession,
} from "../../models/admin/sessions/SessionModel.js";
import { createOTP } from "../../utilities/randomGenerator.js";
const router = express.Router();
// get the logged in admin user
router.get("/", adminAuth, async (req, res, next) => {
  try {
    const user = req.adminInfo;
    user.password = undefined;
    user.refreshJWT = undefined;
    res.json({
      status: "success",
      message: "user has been returned",
      user,
    });
  } catch (error) {
    next(error);
  }
});
// get all admin users
router.get("/all-admins", adminAuth, async (req, res, next) => {
  try {
    const admins = await findAdminUsers();
    res.json({
      status: "success",
      message: "All admin users are returned",
      admins,
    });
  } catch (error) {}
});

// creating new admin user
router.post("/", newAdminUserValidation, async (req, res, next) => {
  try {
    const { password } = req.body;
    req.body.password = hashPassword(password);
    req.body.emailValidationCode = uuidv4();

    const user = await insertAdminUser(req.body);
    if (user?._id) {
      res.json({
        status: "success",
        message:
          "We have sent you an email to verify your account, please check your email including the junk folder",
      });
      const url = `${process.env.ROOT_DOMAIN}/admin/verify-email?c=${user.emailValidationCode}&e=${user.email}`;
      console.log(url);
      // send email
      verificationEmail({
        firstName: user.firstName,
        email: user.email,
        url,
      });
    } else {
      res.json({
        status: "error",
        message: "Unable to create new admin user, try again later",
      });
    }
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.status = 200;
      error.message =
        "There is already another user registered with the email you provided";
    }
    next(error);
  }
});
// delete admin user
router.delete("/:_id", adminAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    // check if this is the last user in db, if so say , can't delete being the last user in the db
    const users = await findAdminUsers();
    // if not the last user, delete from db
    if (users.length < 2) {
      return res.json({
        status: "error",
        message: "This is the only one admin user, can't complete the task",
      });
    }
    const result = await findOneAndDelete(_id);
    result._id
      ? res.json({
          status: "success",
          message: "The admin user has been deleted",
        })
      : res.json({
          status: "error",
          message: "The request was unsuccessful, please try again later",
        });
  } catch (error) {
    next(error);
  }
});
// update admin details
router.put(
  "/",
  adminAuth,
  updateAdminUserValidation,
  async (req, res, next) => {
    try {
      const { _id, ...rest } = req.body;
      const result = await updateOneAdminUser({ _id }, rest);
      result?._id
        ? res.json({
            status: "success",
            message: "profile updated successfully",
          })
        : res.json({
            status: "error",
            message:
              "The profile update was not successful, please try again later",
          });
    } catch (error) {
      next(error);
    }
  }
);
// Update admin password
router.patch(
  "/",
  adminAuth,
  updatePasswordValidation,
  async (req, res, next) => {
    try {
      const { _id, originalPassword, newPassword } = req.body;
      const userId = req.adminInfo._id.toString();
      if (_id !== userId) {
        return res.status(401).json({
          status: "error",
          message: "invalid user request",
        });
      }
      const passFromDb = req.adminInfo.password;
      // check if the password is valid
      const isMatched = comparePassword(originalPassword, passFromDb);
      if (!isMatched) {
        return res.json({
          status: "error",
          message:
            "The previous password you provided is incorrect, couldnot update the password",
        });
      }
      if (isMatched) {
        // encrypt the new password
        const hashedPassword = hashPassword(newPassword);
        // update the password in the db
        const result = await updateOneAdminUser(
          { _id },
          { password: hashedPassword }
        );
        if (result?._id) {
          return res.json({
            status: "success",
            message: "The password has been updated.",
          });
        }
      }
      res.json({
        status: "error",
        message: "Unable to update the password, please try again later",
      });
    } catch (error) {
      next(error);
    }
  }
);
// public routers

router.patch(
  "/verify-email",
  emailVerificationValidation,
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { email, emailValidationCode } = req.body;
      const user = await updateOneAdminUser(
        {
          emailValidationCode,
          email,
        },
        {
          status: "active",
          emailValidationCode: "",
        }
      );
      user?._id
        ? res.json({
            status: "success",
            message: "Your account has been verified, you may login now",
          }) && userVerifiedNotification(user)
        : res.json({
            status: "error",
            message: "Invalid or expired link, no action was taken",
          });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", loginValidation, async (req, res, next) => {
  try {
    const { password, email } = req.body;
    // find if admin user on the basis of given email
    const user = await findOneAdminUser({ email });
    // if we pass the registered email, we will get a user responded back
    if (user?._id) {
      if (user.status !== "active") {
        return res.json({
          status: "error",
          message:
            "Your account has not been verified, please check your email and verify your account",
        });
      }
      // We need to verify if the password sent by the user and the hashed password stored in our db is the same.
      const isMatched = comparePassword(password, user.password);
      if (isMatched) {
        user.password = undefined;
        // JWT
        const jwts = await createJWTs({ email });
        return res.json({
          status: "success",
          message: "logged in successfully",
          user,
          ...jwts,
        });
      } else res.json({ status: "error", message: "Password didn't match" });
    } else
      return res.json({
        status: "error",
        message: "There is no account registered on the email provided",
      });
  } catch (error) {
    next(error);
  }
});
// generate new accessJWT and send back to the client
router.get("/accessjwt", async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      // verify token
      const decoded = verifyRefreshJWT(authorization);
      if (decoded.email) {
        // check if exist on db
        const user = await findOneAdminUser({ email: decoded.email });
        if (user?._id) {
          // create new accessJWT and send  to frontend
          return res.json({
            status: "success",
            accessJWT: await signAccessJWT({ email: decoded.email }),
          });
        }
      }
    }
    res.status(401).json({ status: "error", message: "unauthenticated" });
  } catch (error) {
    error.status = 401;
    next(error);
  }
});
// password reset as logged out user
router.post("/request-pw-reset-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email.includes("@")) {
      // check if user exists already
      const user = await findOneAdminUser({ email });
      if (user?._id) {
        // create unique code and store in the database with the email
        const obj = {
          token: createOTP(),
          associate: email,
          type: "updatePassword",
        };
        const result = await insertSession(obj);

        if (result?._id) {
          // email the OTP to the token
          otpNotification({
            OTP: result.token,
            firstName: user.firstName,
            email,
          });
        }
      }
    }

    res.json({
      status: "success",
      message:
        "If there is a user registered in our system with the email, you will send you an OTP to reset the password",
    });
  } catch (error) {
    next(error);
  }
});

// Reset admin user password
router.patch("/reset-pw", resetPasswordValidation, async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, otp, password } = req.body;
    const filter = {
      token: otp,
      associate: email,
      type: "updatePassword",
    };
    // find if the filter exist in the session table and delete it.
    const result = await deleteSession(filter);
    // if delete is succeed
    if (result?._id) {
      //  then, encrypt the password and update the uset table by email id
      const encryptedPassword = hashPassword(password);
      const user = await updateOneAdminUser(
        { email },
        { password: encryptedPassword }
      );
      if (user?._id) {
        return res.json({
          status: "success",
          message:
            "Your password has been reset. You can go back and try loggin in.",
        });
      }
    }

    res.json({
      status: "error",
      message: "Invalid request",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
