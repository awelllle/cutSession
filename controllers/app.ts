import { Request, Response } from "express";
import {randomBytes} from 'crypto'
import { default as utils }from '../utils'
import { User, UserInterface } from '../models/user';
import { Merchant, MerchantInterface } from '../models/merchant';
import { Booking, BookingInterface } from '../models/booking'
import { Session, SessionInterface } from '../models/studioSession'
import { isFuture } from 'date-fns'

export class AppController {
 
public async clients(req: Request & {user: any}, res: Response) {

 
  
    const type: string = req.query.type as string;
   
   

   const types = ['USER', 'MERCHANT'];
   if(!types.includes(type)){
     return utils.helpers.errorResponse(
       res,
       [],
       'Invalid parameter for type',
       )
   
   }

   var userType

   if(type === 'user'){

     userType = User

   }else{

    const excludeFields = "-_id -__v";
    const paginatedData = await utils.helpers.paginateData(Merchant, 'createdAt', -1, req, {}, excludeFields)
    
          return res.status(200).json(
               paginatedData
              );

        // Merchant.find({}, async (err:Error, merchant: MerchantInterface) => {
        //     if (err){
                
        //     return utils.helpers.errorResponse(
        //         res,
        //         [],
        //         'Something went wrong, please try again',
        //         )
        
        //     }

        //     return res.status(200).json({
        //         "count": 0,
        //         "next": "http://example.com",
        //         "previous": "http://example.com",
        //         "data": [
        //           {
        //             "merchantId": "c3073b9d-edd0-49f2-a28d-b7ded8ff9a8b",
        //             "name": "string",
        //             "email": "user@example.com",
        //             "cityOfOperation": "string",
        //             "phoneNumber": "string"
        //           }
        //         ]
        //       });



        // });

   }


 




}


public async createSession(req: Request & {user: any}, res: Response) {


 
 const required = [
   { name: 'startsAt', type: 'string' },
   { name: 'endsAt', type: 'string' },
   { name: 'type', type: 'string' },
  
 ]
 const { body } = req;
 const hasRequired = utils.helpers.validParam(body, required)

 if (hasRequired.success) {
  
    const { merchantId } = req.params;
   

   const types = ['WeekDay', 'WeekEnd'];
   if(!types.includes(body.type)){
     return utils.helpers.errorResponse(
       res,
       [],
       'Invalid parameter for session type',
       )
   
   }


   Merchant.findOne({merchantId}, async (err:Error, user: MerchantInterface) => {
     if (err){
         
       return utils.helpers.errorResponse(
         res,
         [],
         'Something went wrong, please try again',
         )
 
     }

    if(user != null){ 

             const id = randomBytes(80).toString('hex');

             const session = new Session({
       
               id: id,
               merchantId: merchantId,
               startsAt: body.startsAt,
               endsAt: body.endsAt,
               type: body.type,
         
         
             })

             await session.save();
           return  res.status(200).json({sessionId: id});


     }else{

         return utils.helpers.errorResponse(
           res,
           [],
           'Merchant does not exist',
           )
   

     }
         
     
 })

}else{
 return utils.helpers.errorResponse(
   res,
   [],
   'Missing required fields',
   )

 }

}


public async getSessions(req: Request & {user: any}, res: Response) {


 
 const required = [
   { name: 'startsAt', type: 'string' },
   { name: 'endsAt', type: 'string' },
   { name: 'type', type: 'string' },
  
 ]
 const { body } = req;
 const hasRequired = utils.helpers.validParam(body, required)

 if (hasRequired.success) {
  
    const { merchantId } = req.params;
   

   const types = ['WeekDay', 'WeekEnd'];
   if(!types.includes(body.type)){
     return utils.helpers.errorResponse(
       res,
       [],
       'Invalid parameter for session type',
       )
   
   }


   Merchant.findOne({merchantId}, async (err:Error, user: MerchantInterface) => {
     if (err){
         
       return utils.helpers.errorResponse(
         res,
         [],
         'Something went wrong, please try again',
         )
 
     }

    if(user != null){ 

     Session.find({ merchantId},{
       _id:0, __v:0
      
  }, async (err:Error, sessions: SessionInterface) => {
       if (err){
           
         return utils.helpers.errorResponse(
           res,
           [],
           'Something went wrong, please try again',
           )
   
       }

       return  res.status(200).json(sessions);

     })

            

     }else{

         return utils.helpers.errorResponse(
           res,
           [],
           'Merchant does not exist',
           )
   

     }
         
     
 })

}else{
 return utils.helpers.errorResponse(
   res,
   [],
   'Missing required fields',
   )

 }

}


public async bookSession(req: Request & {user: any}, res: Response) {


 
 const required = [
   { name: 'sessionId', type: 'string' },
   { name: 'date', type: 'string' },
   { name: 'userId', type: 'string' },
  
 ]
 const { body } = req;
 const { sessionId } = body;
 const hasRequired = utils.helpers.validParam(body, required)

 if (hasRequired.success) {
  
  
   



   Session.findOne({sessionId}, async (err:Error, session: SessionInterface) => {
     if (err){
         
       return utils.helpers.errorResponse(
         res,
         [],
         'Something went wrong, please try again',
         )
 
     }

    if(session != null){ 

     const result = isFuture(new Date(`${body.date}`))

     if(!result){
       return utils.helpers.errorResponse(
         res,
         [],
         'Booking has to be at a future date',
         )
     }

     const id = randomBytes(80).toString('hex');
     const ref = randomBytes(8).toString('hex');

             const booking = new Booking({
       
               bookingId: id,
               bookingRef: ref,
               userId: body.userId,
               sessionId: body.sessionId,
               date: body.date,
               startsAt : body.startsAt,
               endsAt: body.endsAt,
               notes:  body.notes || '',
               title : body.title || ''
         
         
             })

             await booking.save();
           return  res.status(200).json({bookingId: id, bookingRef: ref});

            

     }else{

         return utils.helpers.errorResponse(
           res,
           [],
           'Session does not exist',
           )
   

     }
         
     
 })

}else{
 return utils.helpers.errorResponse(
   res,
   [],
   'Missing required fields',
   )

 }

}

public async getBookings(req: Request & {user: any}, res: Response) {


 const city: string = req.query.city as string;
 const limit: string = req.query.limit as string;
 const offset: string = req.query.offset as string;
   



   Booking.find({city}, async (err:Error, session: SessionInterface) => {
     if (err){
         
       return utils.helpers.errorResponse(
         res,
         [],
         'Something went wrong, please try again',
         )
 
     }

    if(session != null){ 


     const id = randomBytes(80).toString('hex');
     const ref = randomBytes(8).toString('hex');

             const booking = new Booking({
       
               
             })

             await booking.save();
           return  res.status(200).json({bookingId: id, bookingRef: ref});

            

     }else{

         return utils.helpers.errorResponse(
           res,
           [],
           'Session does not exist',
           )
   

     }
         
     
 })



}

}