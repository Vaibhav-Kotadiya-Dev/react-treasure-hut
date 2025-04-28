export interface IQuestion extends Document {
    title: string;
    clue: string;
    hint: string;
    trivia: string;
    answer?: string;
    type: 'text' | 'image' | 'location';
    expectedLat?: number;
    expectedLng?: number;
    toleranceMeters?: number;
    sequence: number;
    isStart: boolean;
  }
  