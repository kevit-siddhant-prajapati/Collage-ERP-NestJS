import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from 'src/admin/schemas/admin.schema';
import { UserMiddleware } from 'src/middleware/user.middleware';
import { Staff } from 'src/staff/schemas/staff.schema';
import { Student } from 'src/student/schemas/student.schema';
import { Request } from 'express';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Student.name) private readonly StudentModel : Model<Student>,
        @InjectModel(Staff.name) private readonly StaffModel : Model<Staff>,
        @InjectModel(Admin.name) private readonly AdminModel : Model<Admin>
    ){}

    async loginStudent(credentials ) : Promise<Student>{
        const email = credentials.email
        const password = credentials.password
        const student :any = await this.StudentModel.findOne({ email : email });
        if (!student) {
            return null;
        }
        const publicStudent = new UserMiddleware()
        await publicStudent.findByCredentials(password,student.password)

        const token = await publicStudent.generateAuthToken(student)
        console.log("generated token"+token)
        if(publicStudent.findByCredentials(password,student.password)){
          return student
        }
      }

      async loginStaff(credentials ) : Promise<Staff>{
        console.log('login Staff is selected')
        const email = credentials.email
        const password = credentials.password
        console.log(`email is: ${email}
        password: ${password}`)
        const staff :any = await this.StaffModel.findOne({ email : email });
        if (!staff) {
            return null;
        }
        console.log(staff)
        const publicStaff = new UserMiddleware()
        console.log(`Given password: ${password}
        actual password: ${staff.password}`)
        await publicStaff.findByCredentials(password, staff.password)

        const token = await publicStaff.generateAuthToken(staff)
        console.log(token)
        if(publicStaff.findByCredentials(password,staff.password)){
          return staff
        }
      }

      async loginAdmin(credentials ) : Promise<Staff>{
        const email = credentials.email
        const password = credentials.password
        //console.log(`email is: ${email}
        //password: ${password}`)
        const admin :any = await this.AdminModel.findOne({ email : email });
        //console.log(`admin is : ${admin}`)
        if (!admin) {
            return null;
        }
        const publicAdmin = new UserMiddleware()
        await publicAdmin.findByCredentials(password, admin.password)

        const token = await publicAdmin.generateAuthToken(admin)
        console.log(token)
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

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTMzNjNhYzkxNDQyNjc4NTBhNzliNDgiLCJpYXQiOjE2OTkyNTM1NDAsImV4cCI6MTY5OTI1NzE0MH0.g_k2bp-pFpG9NwsliQvEhYro2l4XtSBZsjFciqYFQco

//