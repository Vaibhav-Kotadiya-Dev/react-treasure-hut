import { Request, Response, NextFunction } from "express";
import UserRepository from "../../repositories/user/UserRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import IUserModel from "../../repositories/user/IUserModel";

class UserController {
  private userRepository: UserRepository = new UserRepository();
  private questionRepository: QuestionRepository = new QuestionRepository();
  private config: IConfig;
  static instance: UserController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = (): UserController => {
    if (!UserController.instance) {
      return (UserController.instance = new UserController(config));
    }
    return UserController.instance;
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { mobileNumber, registrationDate, teamMemberCount = 5 } = req.body;
      const response: IUserModel = await this.userRepository.create({
        mobileNumber,
        registrationDate,
        teamMemberCount,
      });
      if (!response._id) {
        throw new Error("User has not added successfully");
      }
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {};

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {};
}

export default UserController.getInstance();
