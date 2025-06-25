import express from "express";
import stripe from "stripe";
import { userAuth } from "../../middlewares/client/authMiddleware.js";
import { checkItemDetailsAndGetDimensions } from "../../models/common/itemModel/itemModel.js";
import { calculateDeliveryFee } from "../../helpers/client/auPostAPI.js";

const stripeInitiation = stripe(process.env.STRIPE_SECRET);
const router = express.Router();

// GST rate
const gstRate = 0.1;

router.post("/",userAuth, async (req, res, next) => {
  try {
    const { items } = req.body;
    const fromPostCode = 6107; // Define your source post code
    const toPostCode = req.userInfo.address.postCode;
    // Validate the items and get their dimensions asynchronously
    const validationResult = await checkItemDetailsAndGetDimensions(items);
   
    console.log(validationResult);

    if (!validationResult.success) {
      return res.status(400).json({
        status: "error",
        message: validationResult.message,
      });
    }

    // Extract the item details (dimensions) if validation is successful
    const { dimensions } = validationResult;
    // return;
    // Initialize total price and delivery variables
  

  //   // Calculate the total price of products and total delivery fee for each product
  //   const productsWithDelivery = await Promise.all(
  // items.map(async (item, index) => {
  //       const { length, height, width, weight } = itemDetails[index];

  //       const deliveryDetails = await calculateDeliveryFee(
  //         fromPostCode,
  //         toPostCode,
  //         { length, height, width }, // Pass dimensions object
  //         weight
  //       );

  //       const productTotalPrice = item.price * item.count;
  //       const productTotalDeliveryFee =
  //         deliveryDetails.total_cost * item.count;

  //       totalPriceWithoutGST += productTotalPrice;
  //       totalDeliveryFee += productTotalDeliveryFee;

  //       return {
  //         ...item,
  //         productTotalPrice,
  //         productTotalDeliveryFee,
  //       };
  //     })
  //   );
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
console.log(deliveryDetails);
const totalDeliveryFee = Number(deliveryDetails.total_cost).toFixed(2);

// 2. Calculate total product price and prepare line items
let totalPriceWithoutGST = 0;

const productsWithDelivery = items.map((item) => {
  const productTotalPrice = item.price * item.count;
  totalPriceWithoutGST += productTotalPrice;

  return {
    ...item,
    productTotalPrice,
  };
});
    // Calculate GST based on total price + total delivery fee
    const totalBeforeGST = totalPriceWithoutGST + totalDeliveryFee;
    const gstAmount = Math.ceil(gstRate * totalBeforeGST);

    // Prepare line items for Stripe payment
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

    // Push GST as a separate line item
    lineItems.push({
      price_data: {
        currency: "aud",
        product_data: { name: "GST" },
        unit_amount: Math.ceil(gstAmount * 100),
      },
      quantity: 1,
    });

    // Push the total delivery charge as a separate line item
    if (totalDeliveryFee) {
      lineItems.push({
        price_data: {
          currency: "aud",
          product_data: { name: "Delivery Charge" },
          unit_amount: Math.ceil(totalDeliveryFee * 100),
        },
        quantity: 1,
      });
    }
console.log("Success URL:", "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentsuccessful");
console.log("Cancel URL:", "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentfailed");
    // Create Stripe session for checkout
    const session = await stripeInitiation.checkout.sessions.create({
      payment_method_types: ["card", "afterpay_clearpay", "zip"],
      line_items: lineItems,
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["AU"] },
      mode: "payment",
success_url: "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentsuccessful",
cancel_url: "https://" + process.env.CLIENT_ROOT_DOMAIN + "/paymentfailed",
    });

    // Return session ID
    res.status(200).json({ sessionId: session.id });  
    
  } catch (error) {
    next(error);
  }
});

export default router;
