
import PaymentManager from '../../domain/managers/paymentManager.js';
import OrderManager from '../../domain/managers/orderManager.js';

export const payOrder = async (req, res, next) => {
  try {
    const orderManager = new OrderManager();
    const order = await orderManager.getOrder(req.params.orderId);

    const paymentManager = new PaymentManager();
    const payOrder = await paymentManager.payOrder(order);
    if (!payOrder.status === "Success") {
      return res.status(400).json({ status: "Failed", payload: payOrder.status });
    }
    const newOrder = await orderManager.completeOrder(order.id);

    return res.status(201).json({ status: "Success", payload: newOrder });
  } catch (err) {
    next(err);
  }
};
