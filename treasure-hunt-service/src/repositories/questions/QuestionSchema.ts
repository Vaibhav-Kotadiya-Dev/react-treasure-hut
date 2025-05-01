import VersionSchema from '../versionRepositories/VersionSchema';
import { Schema, Types } from 'mongoose';
export default class QuestionSchema extends VersionSchema {
  constructor(options: any) {
    const questionSchema = {
      clue: { type: String, required: true },
      hint: { type: String, required: true },
      trivia: { type: String, required: true },
      answer: { type: Schema.Types.Mixed },
      type: {
        type: String,
        enum: ["text", "image", "location"],
        required: true,
      },
      expectedLat: { type: Number },
      expectedLng: { type: Number },
      toleranceMeters: { type: Number, default: 100 },
      sequence: { type: Number, required: true },
      isStart: { type: Boolean, default: false },
    };
    super(questionSchema, options);
  };
};
