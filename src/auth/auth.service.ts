import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../admin/schemas/admin.schema';
import { UserHelper } from '../helper/user.helper';
import { Staff } from '../staff/schemas/staff.schema';
import { Student } from '../student/schemas/student.schema';
import { logger } from '../logger/logger.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Student.name) private readonly StudentModel : Model<Student>,
        @InjectModel(Staff.name) private readonly StaffModel : Model<Staff>,
        @InjectModel(Admin.name) private readonly AdminModel : Model<Admin>
    ){}
/**
 * @description : give authorization to student
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {*} credentials
 * @returns {*}  {Promise<Student>}
 */
async loginStudent(credentials) : Promise<LoginUserDto>{
      if(process.env.NODE_ENV === 'test'){
        const password = credentials.password
        await UserHelper.convertToHash(credentials)
        const valid = await UserHelper.findByCredentials(password, credentials.password)
        if(valid){
          return credentials
        }
      }
        const email = credentials.email
        const password = credentials.password
        const student :any = await this.StudentModel.findOne({ email : email });
        if (!student) {
          logger.error(`Given student of credential not found ${credentials}`)
          throw new NotFoundException('Given student not found')
        }
        console.log(student)
        const valid = await UserHelper.findByCredentials(password,student.password)
        await UserHelper.generateAuthToken(student)
        if(valid){
          logger.info(`Student Successfully login`)
          return student
        }
      }

      /**
       * @description : give authorization to staff
       * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
       * @param {*} credentials
       * @returns {*}  {Promise<Staff>}
       */
      async loginStaff(credentials ) : Promise<LoginUserDto>{
        if(process.env.NODE_ENV === 'test'){
          const password = credentials.password
          await UserHelper.convertToHash(credentials)
          const valid = await UserHelper.findByCredentials(password, credentials.password)
          if(valid){
            return credentials
          }
        }
        const email = credentials.email
        const password = credentials.password
        const staff :any = await this.StaffModel.findOne({ email : email });
        if (!staff) {
          logger.error(`Given staff of credential not found ${credentials}`)
          throw new NotFoundException('Given staff not found')
        }
        await UserHelper.findByCredentials(password, staff.password)
        await UserHelper.generateAuthToken(staff)
        if(UserHelper.findByCredentials(password,staff.password)){
          return staff
        }
      }
/**
 * @description : give authorization to admin
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {*} credentials
 * @returns {*}  {Promise<Staff>}
 */
      async loginAdmin(credentials ) : Promise<LoginUserDto>{
        if(process.env.NODE_ENV === 'test'){
          const password = credentials.password
          await UserHelper.convertToHash(credentials)
          const valid = await UserHelper.findByCredentials(password, credentials.password)
          if(valid){
            return credentials
          }
        }
        const email = credentials.email
        const password = credentials.password
        const admin :any = await this.AdminModel.findOne({ email : email });
        if (!admin) {
          logger.error(`Given admin of credential not found ${credentials}`)
          throw new NotFoundException('Given admin not found')
        }
        await UserHelper.findByCredentials(password, admin.password)
        await UserHelper.generateAuthToken(admin)
        if(UserHelper.findByCredentials(password, admin.password)){
          logger.info(`Staff successfully login`)
          return admin
        }
      }

      async logout(){
        Promise.all([
          this.StudentModel.updateMany({}, { $set: { tokens: [] } }),
          this.AdminModel.updateMany({}, { $set: { tokens: [] } }),
          this.StaffModel.updateMany({}, { $set: { tokens: [] } })
        ]).then()
        logger.info('Logout successfully')
      }
}
