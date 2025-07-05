import express from "express";
import stripe from "stripe";
import { userAuth } from "../../middlewares/client/authMiddleware.js";
import { checkItemDetailsAndGetDimensions } from "../../models/common/itemModel/itemModel.js";
import { calculateDeliveryFee } from "../../helpers/client/auPostAPI.js";

const stripeInit = stripe(process.env.STRIPE_SECRET);
const router = express.Router();
const GST_RATE = 0.1;

router.post("/", userAuth, async (req, res, next) => {
  try {
    const { items } = req.body;
    const user = req.userInfo;
    const address = user.address;

    const validation = await checkItemDetailsAndGetDimensions(items);
    if (!validation.success) {
      return res.status(400).json({ status: "error", message: validation.message });
    }

    const { length, height, width, weight } = validation.dimensions;
    const delivery = await calculateDeliveryFee(6107, address.postCode, { length, height, width }, weight);
    const deliveryCost = Number(delivery.total_cost);

    let subtotal = 0;

    const productLineItems = items.map((item) => {
      const itemSubtotal = item.price * item.count;
      subtotal += itemSubtotal;

      return {
        price_data: {
          currency: "aud",
          product_data: {
            name: item.name,
            images: [item.thumbnail],
            metadata: {
              itemId: item._id, 
              userId:req.userInfo._id
            },
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.count,
      };
    });

    const gstAmount = subtotal * GST_RATE;

    const lineItems = [
      ...productLineItems,
      {
        price_data: {
          currency: "aud",
          product_data: { name: "GST" },
          unit_amount: Math.round(gstAmount * 100),
        },
        quantity: 1,
      },
    ];

    if (deliveryCost > 0) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: { name: "Delivery Charge" },
          unit_amount: Math.round(deliveryCost * 100),
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

    const customer = await stripeInit.customers.create({
      name: fullName,
      email: user.email,
      address: shippingAddress,
      shipping: { name: fullName, address: shippingAddress },
    });

    const session = await stripeInit.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card", "afterpay_clearpay", "zip"],
      line_items: lineItems,
      billing_address_collection: "required",
      mode: "payment",
      success_url: `https://${process.env.CLIENT_ROOT_DOMAIN}/paymentsuccessful`,
      cancel_url: `https://${process.env.CLIENT_ROOT_DOMAIN}/paymentfailed`,
       metadata: {
    userId: user._id.toString(),  
  },
    });

    res.status(200).json({ sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

export default router;
