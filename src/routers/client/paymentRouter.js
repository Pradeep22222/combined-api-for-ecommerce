import express from "express";
import stripe from "stripe";
import { userAuth } from "../../middlewares/client/authMiddleware.js";
import { checkItemDetailsAndGetDimensions } from "../../models/common/itemModel/itemModel.js";
import { calculateDeliveryFee } from "../../helpers/client/auPostAPI.js";

const stripeInitiation = stripe(process.env.STRIPE_SECRET);
const router = express.Router();

// GST rate
const gstRate = 0.1;

router.post("/", userAuth, async (req, res, next) => {
  try {
    const { items } = req.body;
    const fromPostCode = 6107;
    const toPostCode = req.userInfo.address.postCode;

    // Validate items and get dimensions
    const validationResult = await checkItemDetailsAndGetDimensions(items);
    if (!validationResult.success) {
      return res.status(400).json({
        status: "error",
        message: validationResult.message,
      });
    }

    const { dimensions } = validationResult;

    // 1. Calculate delivery fee once based on combined dimension
    const deliveryDetails = await calculateDeliveryFee(
      fromPostCode,
      toPostCode,
      {
        length: dimensions.length,
        height: dimensions.height,
        width: dimensions.width,
      },
      dimensions.weight
    );

    const totalDeliveryFee = Number(deliveryDetails.total_cost);

    // 2. Calculate total product price
    let totalPriceWithoutGST = 0;

    const productsWithDelivery = items.map((item) => {
      const productTotalPrice = item.price * item.count;
      totalPriceWithoutGST += productTotalPrice;
      return {
        ...item,
        productTotalPrice,
      };
    });

    // 3. Calculate GST ONLY on product total
    const gstAmount = gstRate * totalPriceWithoutGST;

    // 4. Prepare Stripe line items
    const lineItems = productsWithDelivery.map((item) => ({
      price_data: {
        currency: "aud",
        product_data: {
          name: item.name,
          images: [item.thumbnail],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.count,
    }));

    // Add GST as a separate line item
    lineItems.push({
      price_data: {
        currency: "aud",
        product_data: { name: "GST" },
        unit_amount: Math.round(gstAmount * 100),
      },
      quantity: 1,
    });

    // Add delivery fee as a separate line item (not included in GST)
    if (totalDeliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: { name: "Delivery Charge" },
          unit_amount: Math.round(totalDeliveryFee * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripeInitiation.checkout.sessions.create({
      payment_method_types: ["card", "afterpay_clearpay", "zip"],
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["AU"] },
      mode: "payment",
      success_url: "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentsuccessful",
      cancel_url: "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentfailed",
    });

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    next(error);
  }
});

export default router;
