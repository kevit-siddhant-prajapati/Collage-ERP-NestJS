import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Staff, StaffSchema } from './schemas/staff.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Staff.name)
        private StaffModel : mongoose.Model<Staff>,
        private jwtService : JwtService
    ) {}


    async findAll() : Promise<Staff[]>{
        const staffs = await this.StaffModel.find({})
        //console.dir(StaffSchema.obj)
        return staffs;
    }


    async findById(id: string) : Promise<Staff>{
      const staff = await this.StaffModel.findById(id)
      return staff;
    }


    async createOne(studentData : Staff) : Promise<Staff> {
      const newStaff = new this.StaffModel(studentData)
      if(!newStaff){
        throw new BadRequestException('Enter valid Staffdata ')
      }
      
      try {
        const payload = {
          id : newStaff._id 
        }
        const token = await jwt.sign(payload, "thisIsSecretJWTWebToken")
        console.log(token)
        newStaff.tokens.push({ token : token})
        await newStaff.save()
        return newStaff
      } catch(e){
        console.log(e)
      }
    } 

    async updateOne(id : string, studentdata: Staff) : Promise<Staff> {
      const updatable = ['name', 'email', 'password', 'phoneNumber', 'attendance', 'department']
      const updateStaff = Object.keys(studentdata)
      const isValidUpdate = updateStaff.every(update => updatable.includes(update))
      if(!isValidUpdate){
        throw new BadRequestException('not valid Update')
      }
      const updatedStaff = await this.StaffModel.findByIdAndUpdate(id, studentdata)
      if(!updatedStaff){
        throw new NotFoundException('Given staff not found')
      }
      return updatedStaff
    }

    
    async deleteOne(id : string) {
      const deletedStaff = await this.StaffModel.findByIdAndDelete(id)
      return deletedStaff
    }
}
