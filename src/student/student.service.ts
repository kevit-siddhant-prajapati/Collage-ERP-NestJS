import { BadRequestException, HttpCode, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import * as mongoose from 'mongoose';
import { UserHelper } from '../helper/user.helper';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { logger } from '../logger/logger.service';

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
        const secureStudents = students.map(student => UserHelper.getPublicProfile(student))
        logger.info(`successfully print all data of student`)
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
      UserHelper.getPublicProfile(student)
      logger.info(`successfully find Student of _id: ${id}`)
      return student;
    }

    /**
     * @description : create new student
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Student} studentData
     * @returns {*}  {Promise<Student>}
     */
    async createOne(studentData : Student) : Promise<Student> {
        const hashedpasswordStudent = await UserHelper.convertToHash(studentData)
        const newStudent = new this.StudentModel(hashedpasswordStudent)
        if(!newStudent){
          logger.error(`Bad Request Exception`)
          throw new BadRequestException('Enter valid Studentdata ')
        }
        try {
          UserHelper.generateAuthToken(newStudent)
          logger.info(`new Student is created of student id : ${newStudent._id}`)
          return newStudent
        } catch(e){
          logger.error(`Error generate : ${e}`)
          console.log(e)
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
        const updatable = ['name', 'email', 'currentSem', 'password', 'phoneNumber', 'batch', 'attendance', 'department']
        const updateStudent = Object.keys(studentdata)
        //check for up update is valid or not
        const isValidUpdate = updateStudent.every(update => updatable.includes(update))
        if(!isValidUpdate){
          logger.error(` Not valid Update for student`)
          throw new BadRequestException('not valid Update')
        }
        // if update is passwaord then convert it to hashpassword
        if(studentdata.hasOwnProperty('password')){     
          studentdata = await UserHelper.convertToHash(studentdata)
          console.log(studentdata)
        }
        const updatedStudent = await this.StudentModel.findByIdAndUpdate(id, studentdata)
        if(process.env.NODE_ENV === 'test'){
          return updatedStudent
        }
        UserHelper.getPublicProfile(updatedStudent)
        if(!updatedStudent){
          logger.error(`Given student of id : ${id} not found`)
          throw new NotFoundException('Given student not found')
        }
        return updatedStudent
    }
    
    /**
     * @description : delete student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     */
    async deleteOne(id : string) {
      const student = await this.StudentModel.findByIdAndDelete(id)
        if(!student){
          throw new NotFoundException('Given student not found')
        }
        //delete attendance releted to that perticular student
        await this.AttendanceModel.deleteMany({ userId : student._id}) 
        logger.info(`Succefully delete student of id : ${id}`)
    }

}
