import { Types } from "mongoose";

export default interface IUserCreate {
    mobileNumber: string;
    registrationDate: string;
    paymentId: Types.ObjectId | null;
    isPaymentSuccessful: boolean;
    isPaymentPending: boolean;
    isPaymentError: boolean;
    teamMemberCount: number;
    hasVoucher: boolean;
    voucherUnlockedAt: Date;
    currentSequence: number;
    currentAttempts: number;
    isBroadcasted: boolean;
};