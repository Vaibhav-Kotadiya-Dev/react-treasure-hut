import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepository from "../../repositories/user/UserRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import IUserModel from "../../repositories/user/IUserModel";
import { Permission, UserType } from "../../utils/constant";
import { generateAccessToken, generateRefreshToken } from "../../utils/AuthService";
import sendWhatsAppMessage from "../../libs/twilio-client";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";

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
      const { mobileNumber, registrationDate = new Date().toISOString(), teamMemberCount = 5 } = req.body;
      const userPresented = await this.userRepository.get({ mobileNumber }, {}, { sort: { createdAt: -1 }});
      if(userPresented && !userPresented.hasVoucher){
        const { createdAt: lastRegistrationDate } = userPresented;
        const lastDate = new Date(lastRegistrationDate);
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        if(lastDate > oneDayAgo){
           const error = new Error('User can not re-registor in 24 hours') as any;
           error.statusCode = 409;
           throw error;
        }
      }
      const response: IUserModel = await this.userRepository.create({
        mobileNumber,
        registrationDate,
        teamMemberCount,
        userType: UserType.USER,
        permissions: [Permission.CREATE, Permission.READ]
      });
      if (!response._id) {
        const error = new Error('User has not added successfully') as any;
        error.statusCode = 500;
        throw error;
      }
      const question: any = await this.questionRepository.get({ isStart: true });
      if (!question) {
        const error = new Error('No Question found') as any;
        error.statusCode = 404;
        throw error;
      };
      await sendWhatsAppMessage(response?.mobileNumber, question?.clue);
      await this.userRepository.update({ mobileNumber }, { currentSequence: question.sequence });
      return res.status(200).json(response);
    } catch (error) {
      console.error(`Error in user create ${error}`);
      return next(error);
    }
  };

  adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { mobileNumber, password } = req.body;
      const user = await this.userRepository.get({ mobileNumber });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user?.hashedPassword);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Invalid mobile number or password" });
      }
      if (user.userType !== "admin") {
        return res
          .status(403)
          .json({ message: "Access Denied: Only admins can login here" });
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await this.userRepository.updateById(user._id, {
        refreshToken
      })
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: this.config.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).json({ accessToken });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  adminLogout = async (req: Request, res: Response, next: NextFunction) => {
     try {
      const token = req?.headers?.authorization?.split(' ')[1];

      res.clearCookie("refreshToken");
     } catch (error){
        next(error);
     }
      
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const listOfUser: IUserModel[] = await this.userRepository.list({
        isPaymentSuccessful: { $eq: true }, // only for debug for prod it should be changed
      });
      if (!listOfUser) {
        throw new Error("No User found");
      }
      return res.status(200).json(listOfUser);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
      }
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as any;
      const user = await this.userRepository.get({ _id: decoded.id });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const newAccessToken = generateAccessToken(user);
      return res.status(200).json({ accessToken: newAccessToken });
    } catch (error: any) {
      console.error("Refresh token error:", error.message);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Refresh token expired, please login again" });
      }
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  };

  updateUserRegistrationDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { id } = req.params;
      const { registrationDate, teamMemberCount } = req.body;
      if (!id) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const updateData: Partial<IUserModel> = {};
      const updatedRegistrationDate: Date = new Date(registrationDate);
      updatedRegistrationDate.setUTCHours(0, 0, 0, 0);
      if (registrationDate) updateData.registrationDate = updatedRegistrationDate.toISOString();
      if (teamMemberCount) updateData.teamMemberCount = teamMemberCount;
      const response = await this.userRepository.updateById(id, updateData);
      if (!response) {
        return res.status(404).json({ message: "User not found or not updated" });
      }
      return res.status(200).json({ message: "User updated successfully", data: response });
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  };
  
}

export default UserController.getInstance();
