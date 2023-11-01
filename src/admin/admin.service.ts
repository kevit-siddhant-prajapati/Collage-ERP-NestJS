import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        private AdminModel : mongoose.Model<Admin>,
        private jwtService : JwtService
    ) {}


    async findAll() : Promise<Admin[]>{
        const admins = await this.AdminModel.find({})
        return admins;
    }


    async findById(id: string) : Promise<Admin>{
      const admin = await this.AdminModel.findById(id)
      return admin;
    }


    async createOne(adminData : Admin) : Promise<Admin> {
      const newAdmin = new this.AdminModel(adminData)
      if(!newAdmin){
        throw new BadRequestException('Enter valid Staffdata ')
      }
      
      try {
        const payload = {
          id : newAdmin._id 
        }
        const token = await jwt.sign(payload, "thisIsSecretJWTWebToken")
        console.log(token)
        newAdmin.tokens.push({ token : token})
        await newAdmin.save()
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
      const updatedAdmin = await this.AdminModel.findByIdAndUpdate(id, admindata)
      if(!updatedAdmin){
        throw new NotFoundException('Given admin not found')
      }
      return updatedAdmin
    }

    
    async deleteOne(id : string) {
      const deletedAdmin = await this.AdminModel.findByIdAndDelete(id)
      return deletedAdmin
    }
}
