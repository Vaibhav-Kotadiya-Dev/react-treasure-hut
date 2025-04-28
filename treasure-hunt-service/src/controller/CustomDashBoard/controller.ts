import { Request, Response, NextFunction } from "express";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';
import sendWhatsAppMessage, { getLastUserMessage } from "../../libs/twilio-client";
import UserRepository from "../../repositories/user/UserRepositories";
import { isAnswerCloseEnough } from "../../utils/isAnswerCloseEnough";
import { DEFAULT_ATTEMPT, MAX_SEQUENCE, MIN_SEQUENCE, TOTAL_SEQUENCE } from "../../utils/constant";

class MessengerController {
  protected questionRepository: QuestionRepository = new QuestionRepository();
  protected config: IConfig;
  private userRepository: UserRepository = new UserRepository();
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
  sendLatestQuestionToParticipant = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { phone = ''} = req.body;
      const now = new Date();
      const question = await this.questionRepository.get({ isStart: true });
      if (!question) return;
      await this.userRepository.update({ mobileNumber: phone }, { currentSequence: question.sequence });
      const response = await sendWhatsAppMessage(phone, question?.title);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  };

  evaluateAnswerAndReply = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { phone = '' } = req.body;
      const latestMessage = await getLastUserMessage(phone);
      const userData = await this.userRepository.get({ mobileNumber: phone });

      if (!userData) throw new Error("User not found");
      const now = new Date();
      if (now < new Date(userData.registrationDate)) {
        await sendWhatsAppMessage(phone, `🕒 Your treasure hunt window opens on ${new Date(userData.registrationDate).toLocaleString()}`);
      }
      const currentSequence = userData.currentSequence;
      const currentAttempts = userData.currentAttempts ?? 0;
      const hasVoucher = userData.hasVoucher;

      if (currentSequence > MIN_SEQUENCE || (currentSequence <= MAX_SEQUENCE && !hasVoucher)) {
        const question = await this.questionRepository.get({
          sequence: currentSequence,
        });
        if (!question) throw new Error("Question not found");

        if (latestMessage && question?.answer?.length) {
          const isCorrect = isAnswerCloseEnough(latestMessage, question.answer);
          if (isCorrect) {
            const nextSequence = currentSequence + 1;
            const nextQuestion = await this.questionRepository.get({
              sequence: nextSequence,
            });
            await this.userRepository.updateById(userData._id, {
              currentSequence: nextSequence,
              currentAttempts: DEFAULT_ATTEMPT,
            });
            await sendWhatsAppMessage(phone, nextQuestion?.title);
          } else if (currentAttempts === DEFAULT_ATTEMPT) {
            await this.userRepository.updateById(userData._id, {
              currentAttempts: 1,
            });
            await sendWhatsAppMessage(phone, question.hint);
          } else {
            const nextSequence = currentSequence + 1;
            const nextQuestion = await this.questionRepository.get({
              sequence: nextSequence,
            });

            await this.userRepository.updateById(userData._id, {
              currentSequence: nextSequence,
              currentAttempts: DEFAULT_ATTEMPT,
            });

            await sendWhatsAppMessage(phone, nextQuestion?.title);
          }
        }
      } else if (currentSequence == TOTAL_SEQUENCE) {
        await this.userRepository.updateById(userData._id, {
          hasVoucher: true,
          voucherUnlockedAt: new Date(),
          currentSequence: MIN_SEQUENCE,
          currentAttempts: DEFAULT_ATTEMPT,
        });
      } else {
        throw new Error("Invalid current sequence");
      }
      return res.status(200).json(latestMessage);
    } catch (error) {
      console.log("evaluateAnswerAndReply error:", error);
      return res.sendStatus(500);
    }
  }
  
}

export default MessengerController.getInstance();