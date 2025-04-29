import { Request, Response, NextFunction } from "express";
import UserRepository from "../../repositories/user/UserRepositories";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';

class MessengerController {
  private messengerRepository: UserRepository = new UserRepository();
  private config: IConfig;
  static instance: MessengerController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = () : MessengerController => {
    if (!MessengerController.instance) {
      return (MessengerController.instance = new MessengerController(config));
    }
    return MessengerController.instance;
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {

  }
}

export default MessengerController.getInstance();