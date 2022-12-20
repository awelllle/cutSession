import { Request, Response } from "express";

import { default as utils }from '../utils'
import {randomBytes} from 'crypto'

import { User } from '../models/user';
import { Merchant, MerchantInterface } from '../models/merchant';

import { Booking, BookingInterface } from '../models/booking'
import { Session, SessionInterface } from '../models/studioSession'
import { isFuture } from 'date-fns'

export class AuthController {
    public async registerUser(req: Request & {user: any}, res: Response) {

      const required = [
        { name: 'name', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'dob', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
      ]
      const { body } = req;
      const hasRequired = utils.helpers.validParam(body, required)
  
      if (hasRequired.success) {
        let email: string = body.email.toLowerCase();

        User.findOne({email}, async (err:Error, user) => {
            if (err){
                console.log(err, 'user signup error');
                return utils.helpers.sendErrorResponse(res, { }, 'Something went wrong, please try again')
            }

           if(user == null){ 

                    const id = randomBytes(60).toString('hex');

                    user = new User({
                        email: email,
                        userId: id,
                        password: body.password,
                        phone: body.phoneNumber || '',
                        name: body.name,
                        dob: body.dob,                    
                        username: body.username,
                        cityOfResidence: body.cityOfResidence || ''


                    })

                    await user.save();
                  return  res.status(200).json({userId: id});


            }else{

                return utils.helpers.errorResponse(
                  res,
                  [],
                  'User already exists',
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


public async registerMerchant(req: Request & {user: any}, res: Response) {

  const required = [
    { name: 'name', type: 'string' },
    { name: 'username', type: 'string' },
    { name: 'cityOfOperation', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'password', type: 'string' },
  ]
  const { body } = req;
  const hasRequired = utils.helpers.validParam(body, required)

  if (hasRequired.success) {
    let email: string = body.email.toLowerCase();

    Merchant.findOne({email}, async (err:Error, user: MerchantInterface) => {
        if (err){
            console.log(err, 'user signup error');
            return utils.helpers.sendErrorResponse(res, { }, 'Something went wrong, please try again')
        }

       if(user == null){ 

                const id = randomBytes(60).toString('hex');

                user = new Merchant({
                    email: email,
                    merchantId: id,
                    password: body.password,
                    phone: body.phoneNumber || '',
                    name: body.name.toLowerCase(),
                                     
                    username: body.username.toLowerCase(),
                    cityOfOperation: body.cityOfResidence


                })

                await user.save();
              return  res.status(200).json({merchantId: id});


        }else{

            return utils.helpers.errorResponse(
              res,
              [],
              'Merchant already exists',
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


public async signIn(req: Request & {user: any}, res: Response) {

  const required = [
    { name: 'accessType', type: 'string' },
    { name: 'username', type: 'string' },
    { name: 'password', type: 'string' },
  ]
  const { body } = req;
  const hasRequired = utils.helpers.validParam(body, required)

  if (hasRequired.success) {
    let username: string = body.username.toLowerCase();
    let accessType: string = body.accessType.toLowerCase();
    

    const types = ['user', 'merchant'];
   

    if(!types.includes(accessType)){
      return utils.helpers.errorResponse(
        res,
        [],
        'Invalid parameter for access type',
        )
    
    }

    var userType

    if(accessType === 'user'){
      userType = User
    }else{
      userType = Merchant
    }


    userType.findOne({username}, async (err:Error, user) => {
        if (err){
            return utils.helpers.sendErrorResponse(res, { }, 'Something went wrong, please try again')
        }

       if(user != null){ 

        const token = utils.auth.generateToken(user.username)

        if(accessType === 'user'){
           return  res.status(200).json({token, userId: user.id});
        }else{
          return  res.status(200).json({token, merchantId: user.id});
        }



        }else{

            return utils.helpers.errorResponse(
              res,
              [],
              'User does not exist',
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




}

