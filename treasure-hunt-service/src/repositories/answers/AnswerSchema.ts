import VersionSchema from '../versionRepositories/VersionSchema';
import { Types } from 'mongoose';
export default class UserSchema extends VersionSchema {
  constructor(options: any) {
    const userSchema = {
      participantPhone: { type: String, required: true },
      questionId: {
        type: Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answerText: { type: String },
      isCorrect: { type: Boolean, default: false },
      attempts: { type: Number, default: 0 },
      submittedAt: { type: Date, default: Date.now },
    };
    super(userSchema, options);
  }
}