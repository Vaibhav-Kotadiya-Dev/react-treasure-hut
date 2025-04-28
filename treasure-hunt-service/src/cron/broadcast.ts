import cron from "node-cron";
import IUserCreate from "../repositories/user/IUserCreate";
import UserRepository from "../repositories/user/UserRepositories";
import sendWhatsAppMessage from "../libs/twilio-client";
import QuestionRepository from "../repositories/questions/QuestionRepositories";

export const startBroadcastJob = (): void => {
  cron.schedule(
    "*/1 * * * *",
    async (): Promise<void> => {
      console.log(
        "Checking for today’s registrations at:",
        new Date().toISOString()
      );
      const userRepository = new UserRepository();
      const questionRepository = new QuestionRepository();
      const today: Date = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow: Date = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      console.log(tomorrow.toISOString());
      try {
        const users: IUserCreate[] | any = await userRepository.list({
          registrationDate: { $gte: today.toISOString(), $lt: tomorrow.toISOString() },
          isPaymentSuccessful: { $eq: true },
          isBroadcasted: { $ne: true },
        });
        if (users && users.length > 0) {
          for (const user of users) {
            console.log(`Broadcasting to user: ${user.mobileNumber}`);
            const question = await questionRepository.get({ isStart: true });
            if (!question) return;
            await sendWhatsAppMessage(user?.mobileNumber, question?.title);
            await userRepository.update(
              { mobileNumber: user?.mobileNumber },
              { currentSequence: question.sequence, isBroadcasted: true }
            );
          }
        } else {
          console.log("No users to broadcast currently.");
        }
      } catch (error: any) {
        console.error("Broadcast job error:", error.message);
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
  console.log("Broadcast cron job scheduled.");
};

