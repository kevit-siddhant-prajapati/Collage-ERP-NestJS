import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Staff } from './schemas/staff.schema';
import mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserMiddleware } from '../middleware/user.middleware';
import { Attendance } from '../attendance/schemas/attendance.schema';

@Injectable()
export class StaffService {
    constructor(
        @InjectModel(Attendance.name)
        private AttendanceModel : mongoose.Model<Attendance>,
        @InjectModel(Staff.name)
        private StaffModel : mongoose.Model<Staff>,
    ) {}

/**
 * @description : service for get data of all staff
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @returns {*}  {Promise<Staff[]>}
 */
    async findAll() : Promise<Staff[]>{
        const staffs = await this.StaffModel.find({})
        const publicStaff = new UserMiddleware()
        const secureStaff = staffs.map(staff => publicStaff.getPublicProfile(staff))
        return secureStaff;
    }


    /**
     * @description : find staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @returns {*}  {Promise<Staff>}
     */
    async findById(id: string) : Promise<Staff>{
      const staff = await this.StaffModel.findById(id)
      const publicStaff = new UserMiddleware()
      publicStaff.getPublicProfile(staff)
      return staff;
    }


    /**
     * @description : create new staff 
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Staff} staffData
     * @returns {*}  {Promise<Staff>}
     */
    async createOne(staffData : Staff) : Promise<Staff> {
      const publicStaff = new UserMiddleware()
      const hashedpasswordStaff = await publicStaff.convertToHash(staffData)
      const newStaff = new this.StaffModel(hashedpasswordStaff)
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

    /**
     * @description : update new staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @param {*} staffdata
     * @returns {*}  {Promise<Staff>}
     */
    async updateOne(id : string, staffdata) : Promise<Staff> {
      console.log(`updateable staff is call:`)
      const updatable = ['name', 'email', 'password', 'phoneNumber', 'attendance', 'department']
      const updateStaff = Object.keys(staffdata)
      const isValidUpdate = updateStaff.every(update => updatable.includes(update))
      if(!isValidUpdate){
        throw new BadRequestException('not valid Update')
      }
      const publicStaff = new UserMiddleware()
      if(staffdata.hasOwnProperty('password')){
        staffdata = await publicStaff.convertToHash(staffdata)
        console.log(staffdata)
      }
      const updatedStaff = await this.StaffModel.findByIdAndUpdate(id, staffdata)
      publicStaff.getPublicProfile(updatedStaff)
      if(!updatedStaff){
        throw new NotFoundException('Given staff not found')
      }
      return updatedStaff
    }
    
    /**
     * @description : delete staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     */
    async deleteOne(id : string) {
      const staff = await this.StaffModel.findByIdAndDelete(id)
      await this.AttendanceModel.deleteMany({ userId : staff._id})
    }
}
