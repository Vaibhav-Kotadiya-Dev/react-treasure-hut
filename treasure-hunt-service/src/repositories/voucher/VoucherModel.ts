import * as mongoose from 'mongoose';
import IVoucherModel from './IVoucherModel';
import VoucherSchema from './VoucherSchema';

export const voucherSchema = new VoucherSchema({
    collection: 'voucher'
});

export const voucherModel: mongoose.Model<IVoucherModel> = mongoose.model<IVoucherModel>(
    'vouchers', voucherSchema, 'Voucher');