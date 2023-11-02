import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from './schemas/staff.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserMiddleware } from 'src/middleware/user.middleware';

@Injectable()
export class StaffService {
    AttendanceModel: any;
    constructor(
        @InjectModel(Staff.name)
        private StaffModel : mongoose.Model<Staff>,
    ) {}


    async findAll() : Promise<Staff[]>{
        const staffs = await this.StaffModel.find({})
        const publicStaff = new UserMiddleware()
        const secureStaff = staffs.map(staff => publicStaff.getPublicProfile(staff))
        return secureStaff;
    }


    async findById(id: string) : Promise<Staff>{
      const staff = await this.StaffModel.findById(id)
      const publicStaff = new UserMiddleware()
      publicStaff.getPublicProfile(staff)
      return staff;
    }


    async createOne(studentData : Staff) : Promise<Staff> {
      const newStaff = new this.StaffModel(studentData)
      if(!newStaff){
        throw new BadRequestException('Enter valid Staffdata ')
      }
      try {
        const tokenGenerator = new UserMiddleware()
        tokenGenerator.generateAuthToken(newStaff)
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
      const publicStudent = new UserMiddleware()
      publicStudent.getPublicProfile(updatedStaff)
      return updatedStaff
    }
    
    async deleteOne(id : string) {
      const staff = await this.StaffModel.findByIdAndDelete(id)
      await this.AttendanceModel.deleteMany({ userId : staff._id})
    }
}
