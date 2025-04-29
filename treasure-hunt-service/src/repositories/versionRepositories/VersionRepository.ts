import * as mongoose from 'mongoose';
export default class VersionRepository<D extends mongoose.Document, M extends mongoose.Model<D>> {
    private modelType: M;

    constructor(modelType: M) {
        this.modelType = modelType;
    }
    static generateObjectId() {
        return String(new mongoose.Types.ObjectId());
    }
    async create(options: object) : Promise<D>{
        return this.modelType.create({
            ...options
        });
    }

    async countDocuments(): Promise<number> {
       return this.modelType.countDocuments();
    }

    async insertMany(bulkInsert: any[] = []) : Promise<D[]> {
        return this.modelType.insertMany(bulkInsert);
    }

    async list(query: any = {}, options: any = {}) : Promise<D[] | any> {
        return this.modelType.find(query, {}, options);
    }

    async update(filters: any, dataToUpdate: any = {}) : Promise<D | null> {
        return this.modelType.findOneAndUpdate({ ...filters }, dataToUpdate);
    }

    async updateById(id: any, dataToUpdate: any = {}) : Promise<D | null> {
        return this.modelType.findByIdAndUpdate({ _id: id }, dataToUpdate);
    }

    async delete(id: any) {

        return this.modelType.findOneAndDelete({ _id: id })
    }

    async get(data: object, projection: object = {} , options: object = {}) {
        return this.modelType.findOne({ ...data }, projection, options).lean();
    }
}