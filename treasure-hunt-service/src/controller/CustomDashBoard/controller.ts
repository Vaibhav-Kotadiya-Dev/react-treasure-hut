import { Request, Response, NextFunction } from "express";
import QuestionRepository from "../../repositories/questions/QuestionRepositories";
import IConfig from "../../config/IConfig";
import config from "../../config/configuration";
import sendWhatsAppMessage from "../../libs/twilio-client";
import UserRepository from "../../repositories/user/UserRepositories";
import { isAnswerCloseEnough } from "../../utils/isAnswerCloseEnough";
import {
  DEFAULT_ATTEMPT,
  DEFAULT_SEQUENCE,
  MAX_SEQUENCE,
  MIN_SEQUENCE,
  NO_BOOKING_TODAY,
  QUIZ_COMPLETED,
  QUIZ_START_KEYWORD,
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
        { mobileNumber: phone, },
        { currentSequence: question.sequence },
        {
          sort: { createdAt: -1 }
        }
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
      if (Body) {
        latestMessage = Body;
        const phone = parsePhoneNumberWithError(
          From?.split(":")[1]
        ).nationalNumber;
        console.log(`${phone} -> ${latestMessage}`);
        const userData = await this.userRepository.get(
          {
            mobileNumber: phone,
            isPaymentSuccessful: { $eq: true },
            userType: { $eq: "user" },
          },
          {},
          { sort: { createdAt: -1 } }
        );
        if (!userData) throw new Error("User not found");
        const now = new Date();
        if (now < new Date(userData.registrationDate)) {
          await sendWhatsAppMessage(phone, NO_BOOKING_TODAY);
        } else {
          const currentSequence = userData.currentSequence;
          const currentAttempts = userData.currentAttempts ?? 0;
          const hasVoucher = userData.hasVoucher;
          if (currentSequence === MIN_SEQUENCE && userData.hasVoucher) {
            if (
              latestMessage?.toLowerCase() === QUIZ_START_KEYWORD?.toLowerCase()
            ) {
              return await sendWhatsAppMessage(phone, NO_BOOKING_TODAY);
            } else {
              return ;
            }
          }
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
                if(currentSequence !== DEFAULT_SEQUENCE){
                  await sendWhatsAppMessage(
                    phone,
                    `✅ Great job — that's the correct answer! 🎯🎉`
                  );
                }
                if (currentSequence === 3 || currentSequence === 6) {
                  await sendWhatsAppMessage(
                    phone,
                    `🎁 You've unlocked a voucher! 🪙 Voucher: ${question?.voucher?.voucherText}`
                  );
                }
                const nextSequence = currentSequence + 1;
                if (nextSequence < TOTAL_SEQUENCE) {
                  const nextQuestion = await this.questionRepository.get({
                    sequence: nextSequence,
                  });
                  await this.userRepository.updateById(userData._id, {
                    currentSequence: nextSequence,
                    currentAttempts: DEFAULT_ATTEMPT,
                  });
                  const prefixText = currentSequence === DEFAULT_SEQUENCE ? '👉 Question': '👉 Next question'
                  await sendWhatsAppMessage(
                    phone,
                    `${prefixText}: ${nextQuestion?.clue}`
                  );
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
                const hint = `❌ That's not the correct answer.💡 Here's a hint: ${question.hint}`;
                await sendWhatsAppMessage(phone, hint);
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
                  const correctAnswers =
                    question?.answer?.length === 1
                      ? question?.answer[0]
                      : question?.answer.join(",");
                  await sendWhatsAppMessage(
                    phone,
                    `✅ Great job — that's the correct answer! 🎯🎉 : ${correctAnswers}`
                  );
                  if (currentSequence === 3 || currentSequence === 6) {
                    await sendWhatsAppMessage(
                      phone,
                      `🎁 You've unlocked a voucher! 🪙 Voucher: ${question?.voucher?.voucherText}`
                    );
                  }
                  await sendWhatsAppMessage(
                    phone,
                    `👉 Next question: ${nextQuestion?.clue}`
                  );
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
            await sendWhatsAppMessage(phone, QUIZ_COMPLETED);
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
