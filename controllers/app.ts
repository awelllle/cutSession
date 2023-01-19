import { Request, Response } from "express";
import {randomBytes} from 'crypto'
import { default as utils }from '../utils'
import { User, UserInterface } from '../models/user';
import { Merchant, MerchantInterface } from '../models/merchant';
import { Booking, BookingInterface } from '../models/booking'
import { Session, SessionInterface } from '../models/studioSession'
import { isFuture } from 'date-fns'
import { differenceInMinutes } from 'date-fns'
import { getHours } from 'date-fns'
import { getMinutes } from 'date-fns'


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

   if(type === 'user'){

    const excludeFields = "-_id -__v";
    const paginatedData = await utils.helpers.paginateData(User, 'createdAt', -1, req, {}, excludeFields)
    
    return res.status(200).json(
        paginatedData
        );


   }else{

         const excludeFields = "-_id -__v";
         const paginatedData = await utils.helpers.paginateData(Merchant, 'createdAt', -1, req, {}, excludeFields)
    
        return res.status(200).json(
            paginatedData
            );

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

   const minutes: number = differenceInMinutes(
    new Date(`2014, 6, 2,${body.endsAt}`),
    new Date(`2014, 6, 2,${body.startsAt}`)
  )
 
  const duration = [45, 60, 90];
  if(!duration.includes(minutes)){
    return utils.helpers.errorResponse(
      res,
      [],
      'Time slots can only be 45, 60 or 90 minutes',
      )
  
  }

  if(body.type === 'WeekEnd'){
    const startHour = getHours( new Date(`2014, 6, 2,${body.startsAt}`))
    const closeHour = getHours( new Date(`2014, 6, 2,${body.endsAt}`))
    const getMins =  getMinutes( new Date(`2014, 6, 2,${body.endsAt}`))

    
    if(startHour < 10){
      return utils.helpers.errorResponse(
        res,
        [],
        'Weekend sessions start at 10am',
        )
    }
   
   
    if(closeHour > 22){
      
      return utils.helpers.errorResponse(
        res,
        [],
        'Weekend sessions end at 10pm',
        )
    }

    if(closeHour == 22 && getMins > 0){
      
      return utils.helpers.errorResponse(
        res,
        [],
        'Weekend sessions end at 10pm',
        )
    }

  }

  if(body.type === 'WeekDay'){
    const startHour = getHours( new Date(`2014, 6, 2,${body.startsAt}`))
    const closeHour = getHours( new Date(`2014, 6, 2,${body.endsAt}`))
    const getMins =  getMinutes( new Date(`2014, 6, 2,${body.endsAt}`))
    
    if(startHour < 9){
      return utils.helpers.errorResponse(
        res,
        [],
        'Week day sessions start at 9am',
        )
    }

    if(closeHour > 20){
      return utils.helpers.errorResponse(
        res,
        [],
        'Week day sessions end at 8pm',
        )
    }

    if(closeHour == 20 && getMins > 0){
      
      return utils.helpers.errorResponse(
        res,
        [],
        'Week day sessions end at 8pm',
        )
    }

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
   { name: 'merchantId', type: 'string' },
  
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

      // const startsAt = addMinutes(new Date(`${body.date}`), 30)

      // const endsAt = addMinutes(new Date(`${body.date}`), 30)


            const datee = new Date(body.date)
             const booking = new Booking({
       
               bookingId: id,
               bookingRef: ref,
               userId: body.userId,
               merchantId: body.merchantId,
               sessionId: body.sessionId,
               date:datee,

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

    const limit: string = req.query.limit as string;
    const offset: string = req.query.offset as string;

    const city: string = req.query.city as string;
    const merchant: string = req.query.merchant as string || '';

    const startDate: Date = new Date(`${req.query.startDate}`) as any || ''
    const endDate: Date = new Date(`${req.query.endDate}` ) as any || ''
   

   const agg = [
    ...(startDate
      ? [

        { $match: { 
          "date": {$gte: startDate}
        }},

        ]
      : []),

      ...(endDate
        ? [
  
          { $match: { 
            "date": {$lt: endDate}
          }},
  
          ]
        : []),

        ...(merchant
          ? [
    
            {
              $lookup: {
                from: "merchants",
                localField: "merchantId",
                foreignField: "merchantId",
                as: "merchant",
              },
            },
            {
              $unwind: {
                path: "$merchant",
              },
            },

            { $match: { 
              $or: [ { "merchant.merchantId" : merchant }, { "merchant.name" : merchant } ] 
            }},

            ]
          : []),

          ...(city
            ? [
      
              {
                $lookup: {
                  from: "merchants",
                  localField: "merchantId",
                  foreignField: "merchantId",
                  as: "merchant",
                },
              },
              {
                $unwind: {
                  path: "$merchant",
                },
              },
  
              { $match: { 
                "cityOfOperation": city
              }},
  
              ]
            : []),
   ]
  // const excludeFields = "-_id -__v";
   const paginatedData = await utils.helpers.paginateAggregateData(Booking, agg, req)


    if(paginatedData != null){ 
      return res.status(200).json(paginatedData);
     }else{
         return utils.helpers.errorResponse(
           res,
           [],
           'No bookings',
           )
     }

}

}