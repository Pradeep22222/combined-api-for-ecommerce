import paymentMethodsSchema from "./paymentMethodsSchema.js";
export const insertPaymentMethod = (obj) => {
  return paymentMethodsSchema(obj).save();
};

export const getPaymentMethods = () => {
  return paymentMethodsSchema.find();
};

export const updatePaymentMethodById = ({_id, ...update}) => {
  return paymentMethodsSchema.findByIdAndUpdate(_id, update);
};

export const deletePaymentMethodById = (_id) => {
  return paymentMethodsSchema.findByIdAndDelete(_id);
};
