import { Request, Response, NextFunction } from "express";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';
import Stripe from "stripe";
import PaymentRepository from '../../repositories/payments/PaymentRepositories';
import UserRepository from "../../repositories/user/UserRepositories";
import IUserModel from "../../repositories/user/IUserModel";
import { Permission, UserType } from "../../utils/constant";

class PaymentController {
  private config: IConfig;
  private stripe: Stripe;
  static instance: PaymentController;
  private userRepository: UserRepository = new UserRepository();
  private paymentRepository: PaymentRepository = new PaymentRepository();
  constructor(config: IConfig) {
    this.config = config;
    this.stripe = new Stripe(this.config.STRIPE_SECRET_KEY);
  }
  static getInstance = (): PaymentController => {
    if (!PaymentController.instance) {
      return (PaymentController.instance = new PaymentController(config));
    }
    return PaymentController.instance;
  };
  initiatePayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { amount = 100, registrationDate, mobileNumber, teamMemberCount } = req.body;
      if (!amount || !mobileNumber) {
        return res.status(400).json({ error: "Missing required fields" });
      };
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Treasure Hunt Entry" },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        metadata: {
          mobileNumber,
          registrationDate,
          teamMemberCount
        },
      });
      const checkoutUrl = session.url;
      return res.status(200).json({ checkoutUrl });
    } catch (error) {
      console.error("Stripe session error:", error);
      return res
        .status(500)
        .json({ error: "Failed to create checkout session" });
    }
  };
  webhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const sig = req.headers["stripe-signature"]!;
    const rawBody = req.body;
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        sig,
        this.config.WEB_HOOK_SECRET!
      );
      const session = event.data.object as Stripe.Checkout.Session;
      if (event.type === 'checkout.session.completed' && session.payment_status === "paid") {
        const metadata = session?.metadata as {
          mobileNumber?: string;
          registrationDate?: string;
          teamMemberCount?: string;
        };
        console.log(`:::METADATA::::${JSON.stringify(metadata)}`);
        const mobileNumber = metadata?.mobileNumber;
        const registrationDate = metadata?.registrationDate
          ? new Date(metadata.registrationDate)
          : new Date();
        const teamMemberCount = metadata?.teamMemberCount
          ? parseInt(metadata.teamMemberCount, 10)
          : 2;
        const payment = await this.paymentRepository.create({
          mobileNumber,
          stripeSessionId: session.id,
          amount: session.amount_total,
          currency: session.currency,
          status: session.status,
        });
        if (payment._id) {
            const regDate: Date = new Date(registrationDate)
            regDate.setHours(0, 0, 0, 0);
            const userResponse: IUserModel = await this.userRepository.create({
            mobileNumber,
            paymentId: payment._id,
            isPaymentSuccessful: true,
            isPaymentPending: false,
            isPaymentError: false,
            registrationDate: regDate.toISOString(),
            teamMemberCount,
            userType: UserType.USER,
            permissions: [Permission.CREATE, Permission.READ]
          });
          if(!userResponse._id){
             throw new Error('User is not added succesfully');
          }
        }
        return res.status(200).json({ success: true, payment });
      }
      res.status(400).json({ error: "Payment not completed" });
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };
}

export default PaymentController.getInstance();