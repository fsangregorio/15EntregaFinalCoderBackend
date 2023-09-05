
import { Router } from 'express';
import { payOrder } from '../controllers/paymentController.js';

import authenticate from '../../presentation/middleware/auth.js';

const paymentRouter = Router();

paymentRouter.post('/:orderId', authenticate, payOrder);

export default paymentRouter;
