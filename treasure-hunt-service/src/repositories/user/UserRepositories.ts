import { userModel } from './UserModel';
import * as mongoose from 'mongoose';
import IUserModel from './IUserModel';
import VersionRepository from '../versionRepositories/VersionRepository';

export default class UserRepository extends VersionRepository<IUserModel, mongoose.Model<IUserModel>> {
  constructor() {
    super(userModel);
  }

  static generateObjectId() {
    return String(new mongoose.Types.ObjectId());
  }

  async create(options: object) {
    const userId = UserRepository.generateObjectId();
    return super.create({...options, userId });
  }

  async list(query: any = {}, options: any = {}) {
    options.skip = Number(options.skip);
    options.limit = Number(options.limit);
    return super.list(query, options);
  }

  async update(filter: object, dataToUpdate: any = {}) {
    return super.update(filter, dataToUpdate);
  }

  async updateById(id: any, dataToUpdate: any = {}) : Promise<IUserModel | null> {
    return super.updateById(id, dataToUpdate);
  }

  async delete(id: string) {
    return super.delete(id);
  }

  async get(data: object, projection?: object, options?: object) {
    return super.get({ ...data }, projection, options);
  }
}