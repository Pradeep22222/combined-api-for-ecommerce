import purchasesSchema from "./purchaseSchema.js";

export const insertPurchase = (obj) => {
  return purchasesSchema(obj).save();
};