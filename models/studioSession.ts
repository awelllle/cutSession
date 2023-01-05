import { Schema, model, Error, Document } from 'mongoose';

export interface SessionInterface extends Document {
  id: string;
  merchantId: string;

  startsAt: String,
  endsAt: string;
  type: string;
 

}


export const SessionSchema = new Schema<SessionInterface>(
  {
    id: String,
    merchantId: String,
    startsAt: String,
    endsAt: String,
    type: String,   
  },
 
);

export const Session = model('Session', SessionSchema)
