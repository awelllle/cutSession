import { Schema, model, Error, Document } from 'mongoose';

export interface MerchantInterface extends Document {
  name: string;
  username: string;
  email: string;
  merchantId: string;
  cityOfOperation: string;
  phoneNumber: string;

}


export const MerchantSchema = new Schema<MerchantInterface>(
  {
    email: String,
    name: String,
    username: String,
    merchantId: String,
    cityOfOperation: String,
    phoneNumber: String    
  },
 
);

export const Merchant = model('Merchant', MerchantSchema)
