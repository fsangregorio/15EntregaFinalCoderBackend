
import Stripe from "stripe";
import container from "../../container.js";

class PaymentManager {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.orderRepository = container.resolve("OrderRepository");
  }
  async payOrder({ id, amount, currency = "USD", purchaser }) {
    const order = await this.orderRepository.getOrder(id);
    if (order.status === "Complete") {
      throw new Error("Error");
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      receipt_email: purchaser,
      confirm: true,
      return_url: `${process.env.FRONTEND_URL}/success`,
      payment_method: "pm_card_visa",
    });

    return paymentIntent;
  }
}

export default PaymentManager;
