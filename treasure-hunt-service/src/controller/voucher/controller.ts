import { Request, Response, NextFunction } from "express";
import VersionRepository from "../../repositories/voucher/VoucherRepositories";
import IConfig from "../../config/IConfig";
import config from '../../config/configuration';

class VoucherController {
  private voucherRepository: VersionRepository = new VersionRepository();
  private config: IConfig;
  static instance: VoucherController;
  constructor(config: IConfig) {
    this.config = config;
  }
  static getInstance = () : VoucherController => {
    if (!VoucherController.instance) {
      return (VoucherController.instance = new VoucherController(config));
    }
    return VoucherController.instance;
  };
  bulkInsertVoucher = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vouchers = req.body;
        if(!vouchers && !vouchers.length){
           const error = new Error('Vouchers is not given') as any;
           
        }
       
      } catch (error) {
         next(error);
      }
  };
 
}

export default VoucherController.getInstance();