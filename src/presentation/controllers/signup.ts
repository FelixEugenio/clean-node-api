import { badRequest,serverError,ok } from '../helpers/http-helper'
import { Controller,HttRequest,HttpResponse,EmailValidator } from '../protocols'
import { MissingParamError , InvalidParamError} from '../errors'
import { AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements Controller{
    private readonly emailValidator: EmailValidator
    private readonly addAccount: AddAccount

    constructor(emailValidator: EmailValidator,addAccount:AddAccount){
    this.emailValidator = emailValidator
    this.addAccount = addAccount 
    }

  async  handle(httpRequest:HttRequest):Promise<HttpResponse>{
        try{
            const requiredFields = ['name','email','password','passwordConfirmation']

        for(const field of requiredFields){
            if(!httpRequest.body[field]){
                return badRequest(new MissingParamError(field))
            }
        }

        const {email,password,name,passwordConfirmation} = httpRequest.body;

        if(password !== passwordConfirmation){
             return badRequest(new InvalidParamError('passwordConfirmation'))
        }

       const isValid =  this.emailValidator.isValid(email);

       if(!isValid){
        return badRequest(new InvalidParamError('email'))
       }

     const account = await this.addAccount.add({
        name,
        email,
        password
       })

       return ok(account)

        }catch(error){
           return serverError()
        }
    }
}
