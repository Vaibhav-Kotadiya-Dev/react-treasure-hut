import express from "express";
import { Response } from "express";
import { Request } from "express";
import mainRoute from "./routes";
import DataBaseServer from "./libs/DataBase";
import cors from 'cors';
import IConfig from "./config/IConfig";
import { verifyPaymentWebhook } from "./controller/payments/routes";
import { startBroadcastJob } from "./cron/broadcast";
import { seedQuestionsIfEmpty } from "./seed/questions";


export default class Server {
  private app: express.Express;

  constructor(private config: IConfig) {
    this.app = express();
  }

  bootstrap = (): Server => {
    this.setUpWebhookRoute();
    this.initBodyParser();
    this.setUpRoutes();
    return this;
  };

  setUpWebhookRoute = (): void => {
      const { app } = this;
      app.post('/api/payment/verify', express.raw({ type: 'application/json' }), verifyPaymentWebhook); // mount it before bodyParser
  };
  
  initBodyParser = (): void => {
    const { app } = this;
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  };

  setUpRoutes = (): Server => {
    const { app } = this;
    app.use(cors());
    app.get("/health", (req: Request, res: Response) => {
      res.send(":::SERVER IS WORKING:::::");
    });
    app.use("/api", mainRoute);
    return this;
  };

  run = (): void => {
    const {
      app,
      config: { PORT: port, MONGO_URL: mongoUrl },
    } = this;

    DataBaseServer.open(mongoUrl)
      .then(() => {
        app.listen(port, () => {
          console.log(`:::App is running successfully at port number: ${port}:::::::`);
          seedQuestionsIfEmpty();
          startBroadcastJob();
        });
      })
      .catch((err) => {
        console.error("ERROR", err);
      });
  };
}
