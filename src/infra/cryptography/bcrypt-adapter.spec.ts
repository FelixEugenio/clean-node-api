import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

//mokando o Bcrypt
jest.mock('bcrypt',()=>({
  async hash(): Promise<string>{
    return new Promise(resolve => resolve('hash'))
  }
}))

describe('Bcrypt Adapter ',()=>{
    test('Should call bcrypt with correct value',async() => {
      const salt = 12;
       const sut = new BcryptAdapter(salt)
       const hashSpy = jest.spyOn(bcrypt,'hash')
       await sut.encrypt('any_value')
       expect(bcrypt.hash).toHaveBeenCalledWith('any_value',salt)
    })

    test('Should return a hash on success ',async() => {
      const salt = 12;
       const sut = new BcryptAdapter(salt)
       const hash = await sut.encrypt('any_value')
       expect(hash).toBe('hash')
    })
})