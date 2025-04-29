import { Types } from 'mongoose';
import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IUserModel extends IVersionSchema {
  participantPhone: string;
  questionId: Types.ObjectId;
  answerText?: string;
  isCorrect: boolean;
  attempts: number;
  submittedAt: Date;
}