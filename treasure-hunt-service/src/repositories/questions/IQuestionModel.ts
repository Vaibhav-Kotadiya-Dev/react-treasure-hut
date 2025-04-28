import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IQuestionModel extends IVersionSchema {
  title: string;
  clue: string;
  hint: string;
  trivia: string;
  answer?: string[];
  type: "text" | "image" | "location";
  expectedLat?: number;
  expectedLng?: number;
  toleranceMeters?: number;
  sequence: number;
  isStart: boolean;
};