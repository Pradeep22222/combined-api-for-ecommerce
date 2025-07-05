import express from "express";
import stripe from "stripe";
import { decreaseItemQuantity } from "../../models/common/itemModel/itemModel.js";

const stripeWebhook = stripe(process.env.STRIPE_SECRET);
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  let event;
  const sig = req.headers["stripe-signature"];

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

    try {
      const { data: items } = await stripeWebhook.checkout.sessions.listLineItems(session.id, {
        limit: 100,
        expand: ["data.price.product"],
      });

      const products = items
        .map(({ price, quantity }) => {
          const itemId = price.product.metadata?.itemId;
          return itemId ? { _id: itemId, count: quantity } : null;
        })
        .filter(Boolean);

      if (!products.length) {
        console.warn("No valid product metadata found.");
        return res.sendStatus(200);
      }

      await Promise.all(
        // products.map(({ _id, count }) => decreaseItemQuantity(_id, count))
        
      );
      console.log("item count decreased locally")
      console.log("purchases:session",session)
      console.log("purchases:products",products)
    } catch (err) {
      console.error("❌ Error processing line items:", err);
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
