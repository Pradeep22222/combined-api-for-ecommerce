import express from "express";
import {
  newPaymentMethodValidation,
  updatePaymentMethodValidation,
} from "../../middlewares/admin/joi-validation/joiValidation.js";
import {
  deletePaymentMethodById,
  getPaymentMethods,
  insertPaymentMethod,
  updatePaymentMethodById,
} from "../../models/admin/paymentMethods/paymentMethodModel.js";
const router = express.Router();
router.get("/", async (req, res, next) => {
  try {
    const paymentMethods = await getPaymentMethods();
    res.json({
      status: "success",
      message: "to do payment get",
      paymentMethods,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});
router.post("/", newPaymentMethodValidation, async (req, res, next) => {
  try {
    const paymentMethod = await insertPaymentMethod(req.body);
    paymentMethod._id
      ? res.json({
          status: "success",
          message: "New payment method has been added",
        })
      : res.json({
          status: "error",
          message: "unable to add payment method, please try again later",
        });
  } catch (error) {
    error.status = 500;
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "This payment method has been already added";
      error.status = 200;
    }

    next(error);
  }
});

router.put("/", updatePaymentMethodValidation, async (req, res, next) => {
  try {
    const paymentMethod = await updatePaymentMethodById(req.body);
    paymentMethod._id
      ? res.json({
          status: "success",
          message: "The payment method has been updated",
        })
      : res.json({
          status: "error",
          message:
            "unable to update the payment method, please try again later",
        });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});




router.delete("/:_id", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const paymentMethod = await deletePaymentMethodById(_id);
    paymentMethod._id
      ? res.json({
          status: "success",
          message: "The payment method has been deleted",
        })
      : res.json({
          status: "error",
          message:
            "unable to delete the payment method, please try again later",
        });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});
export default router;
