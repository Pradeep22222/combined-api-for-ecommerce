import Joi from "joi";
import {
  ADDRESS,
  DATE,
  EMAIL,
  FNAME,
  LNAME,
  PASSWORD,
  PHONE,
  SHORTSTR,
  STATUS,
  LONGSTR,
  NUMBER,
} from "./constant.js";
const validator = (schema, req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    error.status = 200;
    return next(error);
  }
  next();
};
export const newAdminUserValidation = (req, res, next) => {
  // define rules
  const schema = Joi.object({
    firstName: FNAME.required(),
    lastName: LNAME.required(),
    email: EMAIL.required(),
    phone: PHONE,
    dob: DATE,
    address: ADDRESS,
    password: PASSWORD.required(),
  });
  // give data to the rules
  validator(schema, req, res, next);
};
export const updateAdminUserValidation = (req, res, next) => {
  // define rules
  const schema = Joi.object({
    firstName: FNAME.required(),
    lastName: LNAME.required(),
    phone: PHONE,
    dob: DATE,
    address: ADDRESS,
    _id: SHORTSTR.required(),
  });
  // give data to the rules
  validator(schema, req, res, next);
};
// update password validation
export const updatePasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR.required(),
    originalPassword: PASSWORD.required(),
    newPassword: PASSWORD.required(),
  });
  // give data to the rules
  validator(schema, req, res, next);
};
// reset admin password validation
export const resetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL.required(),
    password: PASSWORD.required(),
    otp: NUMBER.required(),
  });
  // give data to the rules
  validator(schema, req, res, next);
};
export const emailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL.required(),
    emailValidationCode: SHORTSTR.required(),
  });
  validator(schema, req, res, next);
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: EMAIL.required(),
    password: PASSWORD.required(),
  });
  validator(schema, req, res, next);
};
export const newCategoryValidation = (req, res, next) => {
  req.body.catId = req.body.catId ? req.body.catId : null;
  const schema = Joi.object({
    status: STATUS,
    name: SHORTSTR.required(),
    catId: SHORTSTR.allow(null),
  });
  validator(schema, req, res, next);
};

export const updateCategoryValidation = (req, res, next) => {
  req.body.catId = req.body.catId ? req.body.catId : null;
  const schema = Joi.object({
    status: STATUS,
    name: SHORTSTR.required(),
    catId: SHORTSTR.allow(null),
    _id: SHORTSTR.required(),
  });
  validator(schema, req, res, next);
};
// ============Payment methods

export const newPaymentMethodValidation = (req, res, next) => {
  const schema = Joi.object({
    status: STATUS.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });
  validator(schema, req, res, next);
};
export const updatePaymentMethodValidation = (req, res, next) => {
  const schema = Joi.object({
    _id: SHORTSTR.required(),
    status: STATUS.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
  });
  validator(schema, req, res, next);
};

// ==================== Product

export const newItemValidation = (req, res, next) => {
  const { salesPrice, salesStartDate, salesEndDate } = req.body;
  req.body.salesPrice = salesPrice ? salesPrice : 0;
  req.body.salesStartDate =
    !salesStartDate || salesStartDate === "null" ? null : salesStartDate;
  req.body.salesEndDate =
    !salesEndDate || salesEndDate === "null" ? null : salesEndDate;
  const schema = Joi.object({
    status: STATUS.required(),
    name: SHORTSTR.required(),
    sku: SHORTSTR.required(),
    description: LONGSTR.required(),
    quantity: NUMBER.required(),
    price: NUMBER.required(),
    length: NUMBER.required(),
    width: NUMBER.required(),
    height: NUMBER.required(),
    weight: NUMBER.required(),
    fromSuburb: LONGSTR.required(),
    salesPrice: NUMBER,
    salesStartDate: DATE.allow(null),
    salesEndDate: DATE.allow(null),
    catId: SHORTSTR.required(),
    subCatId: SHORTSTR.required(),
    productId: SHORTSTR.required(),
    images: Joi.array().required(),
    filterName: SHORTSTR.allow(""),
    filters: Joi.array(),
  });

  validator(schema, req, res, next);
};

export const updateItemValidation = (req, res, next) => {
  const { salesPrice, salesStartDate, salesEndDate } = req.body;
  req.body.salesPrice = salesPrice ? salesPrice : 0;
  req.body.salesStartDate =
    !salesStartDate || salesStartDate === "null" ? null : salesStartDate;
  req.body.salesEndDate =
    !salesEndDate || salesEndDate === "null" ? null : salesEndDate;
  const schema = Joi.object({
    status: STATUS.required(),
    _id: SHORTSTR.required(),
    name: SHORTSTR.required(),
    description: LONGSTR.required(),
    quantity: NUMBER.required(),
    price: NUMBER.required(),
    length: NUMBER.required(),
    width: NUMBER.required(),
    height: NUMBER.required(),
    weight: NUMBER.required(),
    fromSuburb: LONGSTR.required(),
    fromPostCode: NUMBER.required(),
    salesPrice: NUMBER,
    salesStartDate: DATE.allow(null),
    salesEndDate: DATE.allow(null),
    catId: SHORTSTR.required(),
    subCatId: SHORTSTR.required(),
    productId: SHORTSTR.required(),
    images: Joi.array().required(),
    thumbnail: LONGSTR.required(),
    imgToDelete: Joi.array(),
    newImages: Joi.array(),
    filterName: SHORTSTR.allow(""),
    filters: Joi.array(),
  });

  validator(schema, req, res, next);
};
