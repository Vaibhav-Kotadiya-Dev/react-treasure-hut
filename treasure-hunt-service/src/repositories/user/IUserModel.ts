import { Types } from 'mongoose';
import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IUserModel extends IVersionSchema {
  mobileNumber: string;
  registrationDate: string;
  paymentId: Types.ObjectId | null;
  isPaymentSuccessful: boolean;
  isPaymentPending: boolean;
  isPaymentError: boolean;
  teamMemberCount: number;
  hasVoucher: boolean;
  voucherUnlockedAt: string;
  currentSequence: number;
  currentAttempts: number;
  isBroadcasted: boolean;
};
