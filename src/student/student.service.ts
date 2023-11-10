import { BadRequestException, HttpCode, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import * as mongoose from 'mongoose';
import { UserMiddleware } from '../middleware/user.middleware';
import { Attendance } from '../attendance/schemas/attendance.schema';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Attendance.name)
        private AttendanceModel : mongoose.Model<Attendance>,
        @InjectModel(Student.name)
        private StudentModel : mongoose.Model<Student>,
    ) {}

    /**
     * @description : get data of all student
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*}  {Promise<Student[]>}
     */
    async findAll() : Promise<Student[]>{
        const students = await this.StudentModel.find({})
        const publicStudent = new UserMiddleware()
        if(process.env.NODE_ENV === 'test'){
          return students
        }
        const secureStudents = students.map(student => publicStudent.getPublicProfile(student))
        return secureStudents;
    }

    /**
     * @description : get data of student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @returns {*}  {Promise<Student>}
     */
    async findById(id: string) : Promise<Student>{
      const student = await this.StudentModel.findById(id)
      if(process.env.NODE_ENV === 'test'){
        return student
      }
      const publicStudent = new UserMiddleware()
      publicStudent.getPublicProfile(student)
      return student;
    }

    /**
     * @description : create new student
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Student} studentData
     * @returns {*}  {Promise<Student>}
     */
    async createOne(studentData : Student) : Promise<Student> {
      if(process.env.NODE_ENV !== 'test'){
        const publicStudent = new UserMiddleware()
        const hashedpasswordStudent = await publicStudent.convertToHash(studentData)
        const newStudent = new this.StudentModel(hashedpasswordStudent)
        if(!newStudent){
          throw new BadRequestException('Enter valid Studentdata ')
        }
        try {
          const tokenGenerator = new UserMiddleware()
          tokenGenerator.generateAuthToken(newStudent)
          return newStudent
        } catch(e){
          console.log(e)
        }
      } else{
        return studentData
      }
    } 
    
/**
 * @description
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {string} id : id of Student
 * @param {Student} studentdata : updateable data
 * @returns {*}  {Promise<Student>} return value shold be Student type
 */
    async updateOne(id : string, studentdata: Student) : Promise<Student> {
      if(process.env.NODE_ENV !== 'test'){
        const updatable = ['name', 'email', 'currentSem', 'password', 'phoneNumber', 'batch', 'attendance', 'department']
        const updateStudent = Object.keys(studentdata)
        const isValidUpdate = updateStudent.every(update => updatable.includes(update))
        if(!isValidUpdate){
          throw new BadRequestException('not valid Update')
        }
        const publicStudent = new UserMiddleware()
        if(studentdata.hasOwnProperty('password')){
          studentdata = await publicStudent.convertToHash(studentdata)
          console.log(studentdata)
        }
        const updatedStudent = await this.StudentModel.findByIdAndUpdate(id, studentdata)
        if(process.env.NODE_ENV === 'test'){
          return updatedStudent
        }
        publicStudent.getPublicProfile(updatedStudent)
        if(!updatedStudent){
          throw new NotFoundException('Given student not found')
        }
        return updatedStudent
      } else {
        return studentdata
      }
    }
    
    /**
     * @description : delete student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     */
    async deleteOne(id : string) {
      const student = await this.StudentModel.findByIdAndDelete(id)
      if(process.env.NODE_ENV !== 'test'){
        await this.AttendanceModel.deleteMany({ userId : student._id})
      }
    }

}
