import VersionSchema from '../versionRepositories/VersionSchema';
export default class UserSchema extends VersionSchema {
  constructor(options: any) {
    const voucherSchema = {
      sequence: { type: Number, required: true },
      voucherText: { type: String, required: true},
    };
    super(voucherSchema, options);
  }
}