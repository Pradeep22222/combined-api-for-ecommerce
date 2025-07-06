import express from "express";
import { userAuth } from "../../middlewares/client/authMiddleware.js";
import { getAllPurchasesItems } from "../../models/client/purchase-model/purchaseModel.js";
const router = express.Router();
router.get("/", userAuth, async (req, res, next) => {
  try {
    const { _id } = req.userInfo;
    const purchases = await getAllPurchasesItems(_id);
      res.json({
        status: "success",
        message: "purchases  are returned",
        purchases,
      });
  } catch (error) {
    next(error);
  }
});


export default router;
