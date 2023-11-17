import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Staff, StaffModel } from './schemas/staff.schema';
import mongoose from 'mongoose';
import { UserHelper } from '../helper/user.helper';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { logger } from '../logger/logger.service';

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
        const secureStaff = await Promise.all(
          staffs.map(async (staff) => await UserHelper.getPublicProfile(staff))
        );
        logger.info(`Successfully getting data of all staff`)
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
      if(!staff){
        logger.error(`Unable to find data of Staff id : ${id}`)
        throw new NotFoundException('Unable to find data of given staff')
      }
      UserHelper.getPublicProfile(staff)
      logger.info(`Successfully get data of Staff id : ${id}`)
      return staff;
    }


    /**
     * @description : create new staff 
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Staff} staffData
     * @returns {*}  {Promise<Staff>}
     */
    async createOne(staffData : Staff) : Promise<Staff> {
      
        const hashedpasswordStaff = await UserHelper.convertToHash(staffData)
        // using because test environment have different database and different staff model(mock-data)
        if(process.env.NODE_ENV === 'test'){  
          staffData.password = hashedpasswordStaff
          new StaffModel(staffData)
          await UserHelper.generateAuthToken(staffData)
          return staffData
        }
        // below else part use staffModel for development mongodb uri
        else {
          const newStaff = new this.StaffModel(hashedpasswordStaff)
          if(!newStaff){
            logger.error(`Invalid Staff data provided`)
            throw new BadRequestException('Enter valid Staffdata ')
          }
          try {
            UserHelper.generateAuthToken(newStaff)
            logger.info(`Successfully generate new Staff of id: ${newStaff._id}`)
            return newStaff
          } catch(e){
            logger.error(`Error : ${e}`)
          }
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
      if(process.env.NODE_ENV === 'test'){  //mock-data contain tokens array that not present in original data
        delete staffdata.tokens
      }
        //console.log(`updateable staff is call:`)
        const updatable = ['name', 'email', 'password', 'phoneNumber', 'attendance', 'department']
        const updateStaff = Object.keys(staffdata)
        // check for if update is valid or not
        const isValidUpdate = updateStaff.every(update => updatable.includes(update))
        if(!isValidUpdate){
          logger.error('Invalid update for Staff')
          throw new BadRequestException('not valid Update')
        }
        // check for update is password if it is password then convert it to hashpassword
        if(staffdata.hasOwnProperty('password')){
          staffdata = await UserHelper.convertToHash(staffdata)
        }
        const updatedStaff = await this.StaffModel.findByIdAndUpdate(id, staffdata)
        UserHelper.getPublicProfile(updatedStaff)
        if(!updatedStaff){
          logger.error(`Unable to find Staff of id : ${id}`)
          throw new NotFoundException('Given staff not found')
        }
        logger.info(`Update staff successfully of staff id : ${id}`)
        return updatedStaff
    }
    
    /**
     * @description : delete staff using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     */
    async deleteOne(id : string) {
      const staff = await this.StaffModel.findByIdAndDelete(id)
        if(!staff){
          logger.error(`Unable to find Staff of Staff id : ${id}`)
          throw new NotFoundException('Unable to Staff of given id')
        }
        //delete attendance releted to that staff
        await this.AttendanceModel.deleteMany({ userId : staff._id})
        logger.info(`Successfully delete data of Staff: ${id}`)  
    }
}
