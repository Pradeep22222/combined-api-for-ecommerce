import purchasesSchema from "./purchaseSchema.js";

export const insertPurchase = (obj) => {
  return purchasesSchema(obj).save();
};

export const getAllPurchasesItems = (_id) => {
  return purchasesSchema.find({ userId: _id });
};