import express from "express";
import stripe from "stripe";
import { decreaseItemQuantity } from "../../models/common/itemModel/itemModel.js";
import { insertPurchase } from "../../models/client/purchase-model/purchaseModel.js";

const stripeWebhook = stripe(process.env.STRIPE_SECRET);
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeWebhook.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("💬 Stripe session object:", session);

    const userId = session.metadata?.userId;

    try {
      // 1️⃣ List line items with product metadata
      const { data: items } = await stripeWebhook.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ["data.price.product"],
      });

      const products = items
        .map(({ price, quantity }) => {
          const itemId = price.product.metadata?.itemId;
          const itemPrice = price.unit_amount / 100;
          return itemId ? { _id: itemId, count: quantity, itemPrice } : null;
        })
        .filter(Boolean);

      if (!products.length) {
        console.warn("No valid product metadata found.");
        return res.sendStatus(200);
      }

      // 2️⃣ Get payment intent
      const paymentIntent = await stripeWebhook.paymentIntents.retrieve(session.payment_intent);
      console.log("💬 PaymentIntent object:", paymentIntent);

      if (!paymentIntent.latest_charge) {
        throw new Error("No latest_charge found in paymentIntent");
      }

      // 3️⃣ Retrieve charge to get card info
      const charge = await stripeWebhook.charges.retrieve(paymentIntent.latest_charge);

      const paymentMethod = charge.payment_method_details.card;
      const cardEnding = paymentMethod.last4;
      const cardHolderName = charge.billing_details.name;
      const totalPaid = session.amount_total / 100;
      const timePlaced = new Date();
      const orderNumber = session.id;

      // 4️⃣ Get address from session or customer details
      const deliveryAddr = session.customer_details?.address;
      const deliveryAddress = deliveryAddr
        ? [
            deliveryAddr.line1,
            deliveryAddr.line2,
            deliveryAddr.city,
            deliveryAddr.state,
            deliveryAddr.postal_code,
            deliveryAddr.country,
          ]
            .filter(Boolean)
            .join(", ")
        : "Unknown Address";

      // 5️⃣ Decrease stock
      await Promise.all(products.map(({ _id, count }) => decreaseItemQuantity(_id, count)));
      console.log("✅ Item quantities decreased.");

      // 6️⃣ Save purchases
      await Promise.all(
        products.map(({ _id, itemPrice, count }) =>
          insertPurchase({
            userID: userId,
            itemId: _id,
            cardEnding,
            cardHolderName,
            totalPaid,
            timePlaced,
            orderNumber,
            deliveryAddress,
            itemPrice,
            duplicate: count > 1,
          })
        )
      );

      console.log("✅ Purchases saved successfully.");
    } catch (err) {
      console.error("❌ Error processing purchase records:", err);
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
