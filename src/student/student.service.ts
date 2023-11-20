import { BadRequestException, HttpCode, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentModel, StudentSchema } from './schemas/student.schema';
import * as mongoose from 'mongoose';
import { UserHelper } from '../helper/user.helper';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { logger } from '../logger/logger.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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
        const students : Student[] = await this.StudentModel.find({}, {
          createdAt : 0,
          __v : 0,
          password : 0,
          tokens : 0,
          updatedAt : 0
        })
        
        logger.info(`successfully print all data of student`)
        return students;
    }

    /**
     * @description : get data of student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @returns {*}  {Promise<Student>}
     */
    async findById(id: string) : Promise<Student>{
      const student : Student = await this.StudentModel.findById(id,{
        createdAt : 0,
          __v : 0,
          password : 0,
          tokens : 0,
          updatedAt : 0
      })
      logger.info(`successfully find Student of _id: ${id}`)
      return student;
    }

    /**
     * @description : create new student
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {Student} studentData
     * @returns {*}  {Promise<Student>}
     */
    async createOne(studentData : CreateStudentDto) : Promise<Student> {
        const hashedpasswordStudent : string = await UserHelper.convertToHash(studentData)
        // using because test environment have different database and different student model(mock-data)
        if(process.env.NODE_ENV === 'test'){  
          studentData.password = hashedpasswordStudent
          new StudentModel(studentData)
          await UserHelper.generateAuthToken(studentData)
          return studentData
        } 
        // below else part use studentModel for development mongodb uri
        else {
          const newStudent : Student = new this.StudentModel(hashedpasswordStudent)
          if(!newStudent){
            logger.error(`Bad Request Exception`)
            throw new BadRequestException('Enter valid Studentdata ')
          }
          try {
            await UserHelper.generateAuthToken(newStudent)
            logger.info(`new Student is created of student id : ${newStudent}`)
            return newStudent
          } catch(e){
            logger.error(`Error generate : ${e}`)
            throw e;
          }
        }
    } 
    
/**
 * @description
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {string} id : id of Student
 * @param {Student} studentdata : updateable data
 * @returns {*}  {Promise<Student>} return value shold be Student type
 */
    async updateOne(id : string, studentdata: UpdateStudentDto) : Promise<Student> {
      if(process.env.NODE_ENV === 'test'){  //mock-data contain tokens array that not present in original data
        delete studentdata.tokens
        delete studentdata._id
      }
        const updatable : Array<string> = ['name', 'email', 'currentSem', 'password', 'phoneNumber', 'batch', 'attendance', 'department']
        const updateStudent : Array<string> = Object.keys(studentdata)
        //check for up update is valid or not
        const isValidUpdate : boolean = updateStudent.every(update => updatable.includes(update))
        if(!isValidUpdate){
          logger.error(` Not valid Update for student`)
          throw new BadRequestException('not valid Update')
        }
        // if update is passwaord then convert it to hashpassword
        if(studentdata.hasOwnProperty('password')){     
          studentdata = await UserHelper.convertToHash(studentdata)
        }
        const updatedStudent : Student = await this.StudentModel.findByIdAndUpdate(id, studentdata)
        if(process.env.NODE_ENV === 'test'){
          return updatedStudent
        }
        console.log(updatedStudent)
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
      const student : Student = await this.StudentModel.findByIdAndDelete(id)
        if(!student){
          throw new NotFoundException('Given student not found')
        }
        //delete attendance releted to that perticular student
        await this.AttendanceModel.deleteMany({ userId : student}) 
        logger.info(`Succefully delete student of id : ${id}`)
    }

}
