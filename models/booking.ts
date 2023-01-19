import { Schema, model, Error, Document } from 'mongoose';

export interface BookingInterface extends Document {
  bookingId: string;
  bookingRef: string;

  userId: String,
  merchantId: String,
  sessionId: string;
  date: Date;
  startsAt:string;
  endsAt: string;
  notes: string;
  title: string;
 

}


export const BookingSchema = new Schema<BookingInterface>(
  {
    bookingId: String,
    bookingRef: String,
  
    userId: String,
    merchantId: String,
    sessionId: String,
    date: Date,
    startsAt:String,
    endsAt: String,
    notes: String,
    title: String,  
  },
 
);

export const Booking = model('Booking', BookingSchema)
