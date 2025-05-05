import { Router } from 'express';
import PaymentController from './controller';

const paymentHandler= Router();

paymentHandler.post('/checkout', PaymentController.initiatePayment);
paymentHandler.get('/verify-session', PaymentController.verifyPayment);
export const verifyPaymentWebhook =  PaymentController.webhook;
export default paymentHandler;