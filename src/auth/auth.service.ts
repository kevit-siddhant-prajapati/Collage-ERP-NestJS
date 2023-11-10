import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../admin/schemas/admin.schema';
import { UserMiddleware } from '../middleware/user.middleware';
import { Staff } from '../staff/schemas/staff.schema';
import { Student } from '../student/schemas/student.schema';
import { Request } from 'express';

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
async loginStudent(credentials) : Promise<Student>{
        const email = credentials.email
        const password = credentials.password
        const student :any = await this.StudentModel.findOne({ email : email });
        if (!student) {
            return null;
        }
        const publicStudent = new UserMiddleware()
        await publicStudent.findByCredentials(password,student.password)

         await publicStudent.generateAuthToken(student)
        if(publicStudent.findByCredentials(password,student.password)){
          return student
        }
      }

      /**
       * @description : give authorization to staff
       * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
       * @param {*} credentials
       * @returns {*}  {Promise<Staff>}
       */
      async loginStaff(credentials ) : Promise<Staff>{
        const email = credentials.email
        const password = credentials.password
        const staff :any = await this.StaffModel.findOne({ email : email });
        if (!staff) {
            return null;
        }
        const publicStaff = new UserMiddleware()
        await publicStaff.findByCredentials(password, staff.password)
        await publicStaff.generateAuthToken(staff)
        if(publicStaff.findByCredentials(password,staff.password)){
          return staff
        }
      }
/**
 * @description : give authorization to admin
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {*} credentials
 * @returns {*}  {Promise<Staff>}
 */
      async loginAdmin(credentials ) : Promise<Staff>{
        const email = credentials.email
        const password = credentials.password
        const admin :any = await this.AdminModel.findOne({ email : email });
        if (!admin) {
            return null;
        }
        const publicAdmin = new UserMiddleware()
        await publicAdmin.findByCredentials(password, admin.password)
        await publicAdmin.generateAuthToken(admin)
        if(publicAdmin.findByCredentials(password, admin.password)){
          return admin
        }
      }

      async logout(){
        await this.StudentModel.updateMany({}, { $set: { tokens: [] } })
        await this.AdminModel.updateMany({}, { $set: { tokens: [] } })
        await this.StaffModel.updateMany({}, { $set: { tokens: [] } })
      }
}
