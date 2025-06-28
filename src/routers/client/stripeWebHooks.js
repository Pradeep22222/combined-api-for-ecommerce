import express from "express";
import stripe from "stripe";
import { decreaseItemQuantity } from "../../models/common/itemModel/itemModel.js";

const stripeWebhookInitiation = stripe(process.env.STRIPE_SECRET);
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  console.log("webhook page is triggered");

  try {
    event = stripeWebhookInitiation.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("⚠️  Webhook signature verification failed:", err.message);
    return res.sendStatus(400);
  }

  console.log("pradeep", event);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Session object:", session);

      try {
        const lineItems = await stripeWebhookInitiation.checkout.sessions.listLineItems(
          session.id,
          { limit: 100 }
        );

        console.log("Retrieved line items:", lineItems);

        const products = lineItems.data.map((item) => ({
          _id: item.price.product, // This assumes `product` in Stripe matches MongoDB `_id`
          count: item.quantity,
        }));

        if (products.length > 0) {
          await Promise.all(
            products.map((product) =>
              decreaseItemQuantity(product._id, product.count)
            )
          );
          console.log("Product quantities have been updated successfully.");
        } else {
          console.warn("No products found in line items.");
        }
      } catch (error) {
        console.error("Error processing line items or updating quantity:", error);
      }

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});

export default router;
