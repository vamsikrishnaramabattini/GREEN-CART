import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js"; // Make sure User model is imported for the cart cleanup loop
import Stripe from "stripe";

// Initialize Stripe with your Secret Key from the .env file
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ==========================================
// PLACE ORDER COD : /api/order/cod
// ==========================================
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    // Calculate total amount using product prices
    let amount = await items.reduce(async (accPromise, item) => {
      const acc = await accPromise;
      const product = await Product.findById(item.product);
      
      const priceToUse = product.offerPrice !== undefined ? product.offerPrice : product.price;
      
      return acc + (priceToUse * item.quantity);
    }, Promise.resolve(0));

    // Add a standard 2% tax fee
    amount += Math.floor(amount * 0.02);

    const newOrder = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
      isPaid: false
    });

    res.json({ success: true, message: "Order Placed Successfully", order: newOrder });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// PLACE ORDER STRIPE : /api/order/stripe
// ==========================================
export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    const origin = req.headers.origin || "http://localhost:5173"; // Frontend base URL

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let totalAmount = 0;
    const line_items = [];

    // 1. Resolve product values and construct Stripe Checkout Line Items structure
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      const priceToUse = product.offerPrice !== undefined ? product.offerPrice : product.price;
      totalAmount += priceToUse * item.quantity;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: Array.isArray(product.image) ? [product.image[0]] : [product.image],
          },
          unit_amount: Math.round(priceToUse * 100),
        },
        quantity: item.quantity,
      });
    }

    // 2. Compute 2% Tax item matching your COD implementation structure
    const taxAmount = Math.floor(totalAmount * 0.02);
    totalAmount += taxAmount;

    if (taxAmount > 0) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Tax Fee (2%)",
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    // 3. Document order as "Online" (Unpaid initially) inside MongoDB Atlas
    const newOrder = await Order.create({
      userId,
      items,
      amount: totalAmount,
      address,
      paymentType: "Online",
      isPaid: false,
    });

    // 4. Construct Stripe Checkout Session 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      // 🚀 CRITICAL FOR WEBHOOKS: Metadata attaches properties to recover on events
      metadata: {
        orderId: String(newOrder._id),
        userId: String(userId)
      },
      success_url: `${origin}/loader?next=myorders&success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/loader?next=cart&success=false&orderId=${newOrder._id}`,
    });

    // Return the link session URL to your client window browser redirect handler
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// GET USER ORDERS (For Customer History) : /api/order/user
// ==========================================
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await Order.find({ userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// VERIFY STRIPE PAYMENT STATUS : /api/order/verifyStripe
// ==========================================
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;

    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      res.json({ success: true, message: "Payment Cleared Successfully" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment Denied" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// 🚀 NEW FEATURE: STRIPE WEBHOOKS VERIFY PAYMENTS ACTION : /stripe
// ==========================================
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId, userId } = session.data[0].metadata;
      
      // Mark Payment as Paid
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      
      // Clear user cart
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { orderId } = session.data[0].metadata;
      await Order.findByIdAndDelete(orderId);
      break;
    }

    default:
      console.error(`Unhandled event type ${event.type}`);
      break;
  }

  response.json({ received: true });
};