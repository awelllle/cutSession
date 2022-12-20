import { Schema, model, Error, Document } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  username: string,
  userId: string;
  dob: Date;
  cityOfResidence: string;
  phoneNumber: string;

}


export const UserSchema = new Schema<UserInterface>(
  {
    email: String,
    name: String,
    username: String,
    userId: String,
    dob: Date,
    cityOfResidence: String,
    phoneNumber: String    
  },
 
);

export const User = model('User', UserSchema)
