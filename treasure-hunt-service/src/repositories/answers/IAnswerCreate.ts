import { Types } from "mongoose";

export default interface IUserCreate {
  participantPhone: string;
  questionId: Types.ObjectId;
  answerText?: string;
  isCorrect: boolean;
  attempts: number;
  submittedAt: Date;
};