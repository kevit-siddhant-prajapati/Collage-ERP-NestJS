import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminModel } from './schemas/admin.schema';
import mongoose from 'mongoose';
import { UserHelper } from '../helper/user.helper';
import { logger } from '../logger/logger.service';
import { CreateAdminDto } from './dto/crete-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name)
        private AdminModel : mongoose.Model<Admin>,
    ) {}


    /**
     * @description : Give the data of all admin
     * @returns {*}  {Promise<Admin[]>}
     */
    async findAll() : Promise<Admin[]>{
        const admins : Admin[] = await this.AdminModel.find({}, {
          createdAt : 0,
          __v : 0,
          password : 0,
          tokens : 0,
          updatedAt : 0
        })
        logger.info(`Successfully getting data of all Admin`)
        return admins;
    }


    /**
     * @description : get admin data using id
     * @param {string} id
     * @returns {*}  {Promise<Admin>}
     */
    async findById(id: string) : Promise<Admin>{
      const admin : Admin = await this.AdminModel.findById(id, {
        createdAt : 0,
          __v : 0,
          password : 0,
          tokens : 0,
          updatedAt : 0
      })
      if(!admin){
        logger.error(`Unable to find data of Admin of Admin id : ${id}`)
        throw new NotFoundException('Unable to find data of Admin')
      }
      logger.info(`Successfully getting data of admin Id : ${id}`)
      return admin;
    }


    /**
     * @description : create new admin
     * @param {Admin} adminData
     * @returns {*}  {Promise<Admin>}
     */
    async createOne(adminData : CreateAdminDto) : Promise<Admin> {
        const hashedpasswordAdmin : string = await UserHelper.convertToHash(adminData)
        if(process.env.NODE_ENV === 'test'){  
          adminData.password = hashedpasswordAdmin
          new AdminModel(adminData)
          await UserHelper.generateAuthToken(adminData)
          return adminData
        } 

        else {
          const newAdmin = new this.AdminModel(hashedpasswordAdmin)
          if(!newAdmin){
            logger.error(`Admin data  is invalid`)
            throw new BadRequestException('Enter valid Admindata ')
          }
          try {
            UserHelper.generateAuthToken(newAdmin)
            logger.info(`successfully create new admin of admin id : ${newAdmin._id}`)
            return newAdmin
          } catch(e){
            logger.error(`error : ${e}`)
            throw new InternalServerErrorException(e)
          }
        }
    } 

    /**
     * @description : 
     * @param {string} id
     * @param {Admin} admindata
     * @returns {*}  {Promise<Admin>}
     */
    async updateOne(id : string, admindata: UpdateAdminDto) : Promise<Admin> {
      if(process.env.NODE_ENV === 'test'){  //mock-data contain tokens array that not present in original data
        delete admindata.tokens
        delete admindata._id
      }
        const updatable : Array<String> = ['name', 'email', 'password']
        const updateAdmin : Array<String> = Object.keys(admindata)
        //check for update is valid or not
        const isValidUpdate : boolean = updateAdmin.every(update => updatable.includes(update))
        if(!isValidUpdate){
          logger.error(`Invalid Update for Admin id : ${id}`)
          throw new BadRequestException('not valid Update')
        }
        //check that update is password if it is password then convert it to hash value before store
        if(admindata.hasOwnProperty('password')){
          admindata = await UserHelper.convertToHash(admindata)
        }
        const updatedAdmin : Admin = await this.AdminModel.findByIdAndUpdate(id, admindata)

        if(!updatedAdmin){
          logger.error(`Given Admin not found of Admin id : ${id}`)
          throw new NotFoundException('Given Admin not found')
        }
        logger.info(`Admin updated successfully of staff id : ${id}`)
        return updatedAdmin
    }

    /**
     * @description : delete admin by using its id
     * @author Siddhant Prajapati
     * @param {string} id
     * @returns {*} 
     */
    async deleteOne(id : string) {
        const deletedAdmin : Admin = await this.AdminModel.findByIdAndDelete(id)
        if(!deletedAdmin){
          logger.error(`Admin of admin id not found : ${id}`)
          throw new NotFoundException(`Given Admin not found`)
        }
        logger.info(`Admin deleted Successfully of admin id : ${id}`)
        return deletedAdmin
    }
}
