import express from "express";
import stripe from "stripe";
import { userAuth } from "../../middlewares/client/authMiddleware.js";
import { checkItemDetailsAndGetDimensions } from "../../models/common/itemModel/itemModel.js";
import { calculateDeliveryFee } from "../../helpers/client/auPostAPI.js";

const stripeInitiation = stripe(process.env.STRIPE_SECRET);
const router = express.Router();
const GST_RATE = 0.1;

router.post("/", userAuth, async (req, res, next) => {
  try {
    const { items } = req.body;
    const user = req.userInfo;
    const address = user.address;

    const fromPostCode = 6107;
    const toPostCode = address.postCode;

    const validationResult = await checkItemDetailsAndGetDimensions(items);
    if (!validationResult.success) {
      return res.status(400).json({ status: "error", message: validationResult.message });
    }

    const { length, height, width, weight } = validationResult.dimensions;

    const deliveryDetails = await calculateDeliveryFee(fromPostCode, toPostCode, { length, height, width }, weight);
    const totalDeliveryFee = Number(deliveryDetails.total_cost);

    let totalPriceWithoutGST = 0;
    const productsWithDelivery = items.map((item) => {
      const productTotalPrice = item.price * item.count;
      totalPriceWithoutGST += productTotalPrice;
      return { ...item, productTotalPrice };
    });

    const gstAmount = GST_RATE * totalPriceWithoutGST;

    const lineItems = [
      ...productsWithDelivery.map((item) => ({
        price_data: {
          currency: "aud",
          product_data: { name: item.name, images: [item.thumbnail] },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.count,
      })),
      {
        price_data: {
          currency: "aud",
          product_data: { name: "GST" },
          unit_amount: Math.round(gstAmount * 100),
        },
        quantity: 1,
      },
    ];

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

    const fullName = `${user.firstName} ${user.lastName}`;
    const shippingAddress = {
      line1: address.streetAddress,
      city: address.suburb,
      state: address.state,
      postal_code: address.postCode,
      country: "AU",
    };

    const customer = await stripeInitiation.customers.create({
      name: fullName,
      email: user.email,
      address: shippingAddress,
      shipping: {
        name: fullName,
        address: shippingAddress,
      },
    });

    const session = await stripeInitiation.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card", "afterpay_clearpay", "zip"],
      line_items: lineItems,
      billing_address_collection: "required",
      mode: "payment",
      success_url: `https://${process.env.CLIENT_ROOT_DOMAIN}/paymentsuccessful`,
      cancel_url: `https://${process.env.CLIENT_ROOT_DOMAIN}/paymentfailed`,
    });

    res.status(200).json({ sessionId: session.id });

  } catch (error) {
    next(error);
  }
});

export default router;
