import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserMiddleware } from 'src/middleware/user.middleware';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        private AdminModel : mongoose.Model<Admin>,
        private jwtService : JwtService
    ) {}


    async findAll() : Promise<Admin[]>{
        const admins = await this.AdminModel.find({})
        const publicAdmin = new UserMiddleware()
        const secureAdmin = admins.map(admin => publicAdmin.getPublicProfile(admin))
        return secureAdmin;
    }


    async findById(id: string) : Promise<Admin>{
      const admin = await this.AdminModel.findById(id)
      const publicAdmin = new UserMiddleware()
      const secureAdmin = publicAdmin.getPublicProfile(admin)
      return secureAdmin;
    }


    async createOne(adminData : Admin) : Promise<Admin> {
      const publicAdmin = new UserMiddleware()
      const hashedpasswordAdmin = await publicAdmin.convertToHash(adminData)
      const newAdmin = new this.AdminModel(hashedpasswordAdmin)
      if(!newAdmin){
        throw new BadRequestException('Enter valid Staffdata ')
      }
      
      try {
        const publicAdmin = new UserMiddleware()
        publicAdmin.generateAuthToken(newAdmin)
        return newAdmin
      } catch(e){
        console.log(e)
      }
    } 

    async updateOne(id : string, admindata: Admin) : Promise<Admin> {
      const updatable = ['name', 'email', 'password']
      const updateAdmin = Object.keys(admindata)
      const isValidUpdate = updateAdmin.every(update => updatable.includes(update))
      if(!isValidUpdate){
        throw new BadRequestException('not valid Update')
      }
      const publicAdmin = new UserMiddleware()
      if(admindata.hasOwnProperty('password')){
        admindata = await publicAdmin.convertToHash(admindata)
        console.log(admindata)
      }
      const updatedAdmin = await this.AdminModel.findByIdAndUpdate(id, admindata)
      publicAdmin.getPublicProfile(updatedAdmin)
      if(!updatedAdmin){
        throw new NotFoundException('Given Admin not found')
      }
      return updatedAdmin
    }

    
    async deleteOne(id : string) {
      const deletedAdmin = await this.AdminModel.findByIdAndDelete(id)
      return deletedAdmin
    }
}
