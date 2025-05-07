import IVersionSchema from '../versionRepositories/IVersionSchema';

export default interface IVoucherModel extends IVersionSchema {
  sequenceId: number;
  voucherText: string;
}