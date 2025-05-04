import { Request, Response, NextFunction } from "express";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import sendWhatsAppMessage from "../../libs/twilio-client";
import UserRepository from "../../repositories/user/UserRepositories";
import { isAnswerCloseEnough } from "../../utils/isAnswerCloseEnough";
import {
  DEFAULT_ATTEMPT,
  MAX_SEQUENCE,
  MIN_SEQUENCE,
  TOTAL_SEQUENCE,
} from "../../utils/constant";
import { parsePhoneNumberWithError } from "libphonenumber-js";

class MessengerController {
  protected questionRepository: QuestionRepository = new QuestionRepository();
  protected config: IConfig;
  private userRepository: UserRepository = new UserRepository();
  static instance: MessengerController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = (): MessengerController => {
    if (!MessengerController.instance) {
      return (MessengerController.instance = new MessengerController(config));
    }
    return MessengerController.instance;
  };
  sendLatestQuestionToParticipant = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { phone } = req.body;
      const question = await this.questionRepository.get({ isStart: true });
      if (!question) return;
      await this.userRepository.update(
        { mobileNumber: phone },
        { currentSequence: question.sequence }
      );
      const response = await sendWhatsAppMessage(phone, question?.clue);
      res.status(200).json(response);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  };

  evaluateAnswerAndReply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { Body = "", From = "" } = req.body;
      let latestMessage = "";
      console.log(Body, From);
      if (Body) {
        latestMessage = Body;
        const phone = parsePhoneNumberWithError(
          From?.split(":")[1]
        ).nationalNumber;
        console.log(`${phone} -> ${latestMessage}`);
        const userData = await this.userRepository.get(
          {
            mobileNumber: phone,
            isPaymentSuccessful: { $eq: false },
            userType: { $eq: "user" },
          },
          {},
          { sort: { createdAt: -1 } }
        );
        if (!userData) throw new Error("User not found");
        const now = new Date();
        if (now < new Date(userData.registrationDate)) {
          await sendWhatsAppMessage(
            phone,
            `🕒 Your treasure hunt window opens on ${new Date(
              userData.registrationDate
            ).toLocaleString()}`
          );
        } else {
          const currentSequence = userData.currentSequence;
          const currentAttempts = userData.currentAttempts ?? 0;
          const hasVoucher = userData.hasVoucher;

          if (
            currentSequence > MIN_SEQUENCE &&
            currentSequence <= MAX_SEQUENCE &&
            !hasVoucher
          ) {
            const question = await this.questionRepository.get({
              sequence: currentSequence,
            });
            if (!question) throw new Error("Question not found");

            if (latestMessage && question?.answer?.length) {
              const isCorrect = isAnswerCloseEnough(
                latestMessage,
                question.answer
              );
              if (isCorrect) {
                const nextSequence = currentSequence + 1;
                if (nextSequence < TOTAL_SEQUENCE) {
                  const nextQuestion = await this.questionRepository.get({
                    sequence: nextSequence,
                  });
                  await this.userRepository.updateById(userData._id, {
                    currentSequence: nextSequence,
                    currentAttempts: DEFAULT_ATTEMPT,
                  });
                  await sendWhatsAppMessage(phone, nextQuestion?.clue);
                } else {
                  await this.userRepository.updateById(userData._id, {
                    hasVoucher: true,
                    voucherUnlockedAt: new Date(),
                    currentSequence: MIN_SEQUENCE,
                    currentAttempts: DEFAULT_ATTEMPT,
                  });
                  await sendWhatsAppMessage(
                    phone,
                    `Thank you for participating in the quiz! 🎉 We appreciate your enthusiasm and hope you had fun.`
                  );
                }
              } else if (currentAttempts === DEFAULT_ATTEMPT) {
                await this.userRepository.updateById(userData._id, {
                  currentAttempts: 1,
                });
                await sendWhatsAppMessage(phone, question.hint);
              } else {
                const nextSequence = currentSequence + 1;
                if (nextSequence < TOTAL_SEQUENCE) {
                  const nextQuestion = await this.questionRepository.get({
                    sequence: nextSequence,
                  });
                  await this.userRepository.updateById(userData._id, {
                    currentSequence: nextSequence,
                    currentAttempts: DEFAULT_ATTEMPT,
                  });
                  const correctAnswers = question?.answer?.length === 1 ? question?.answer[0]: question?.answer.join(",");
                  await sendWhatsAppMessage(phone, `✅ Correct Answer: ${correctAnswers}`);
                  await sendWhatsAppMessage(phone, nextQuestion?.clue);
                } else {
                  await this.userRepository.updateById(userData._id, {
                    hasVoucher: true,
                    voucherUnlockedAt: new Date(),
                    currentSequence: MIN_SEQUENCE,
                    currentAttempts: DEFAULT_ATTEMPT,
                  });
                  await sendWhatsAppMessage(
                    phone,
                    `Thank you for participating in the quiz! 🎉 We appreciate your enthusiasm and hope you had fun.`
                  );
                }
              }
            }
          } else {
            throw new Error("Invalid current sequence");
          }
        }
      }
      return res.status(200).json(latestMessage);
    } catch (error) {
      console.log("evaluateAnswerAndReply error:", error);
      return res.sendStatus(500);
    }
  };
}

export default MessengerController.getInstance();
