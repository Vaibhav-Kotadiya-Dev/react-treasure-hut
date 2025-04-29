import * as mongoose from 'mongoose';
import IUserModel from './IAnswerModel';
import AnswerSchema from './AnswerSchema';

export const answerSchema = new AnswerSchema({
    collection: 'answers'
});
answerSchema.index({ participantPhone: 1, questionId: 1 }, { unique: true });

export const answerModel: mongoose.Model<IUserModel> = mongoose.model<IUserModel>(
    'answers', answerSchema, 'Answers');