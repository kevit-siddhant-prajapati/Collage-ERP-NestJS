import { BadRequestException, HttpCode, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import * as mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel : mongoose.Model<Student>,
        private jwtService : JwtService
    ) {}


    async findAll() : Promise<Student[]>{
        const students = await this.StudentModel.find({})
        return students;
    }


    async findById(id: string) : Promise<Student>{
      const student = await this.StudentModel.findById(id)
      return student;
    }


    async createOne(studentData : Student) : Promise<Student> {
      const newStudent = new this.StudentModel(studentData)
      if(!newStudent){
        throw new BadRequestException('Enter valid Studentdata ')
      }
      
      try {
        const payload = {
          id : newStudent._id 
        }
        const token = await jwt.sign(payload, "thisIsSecretJWTWebToken")
        console.log(token)
        newStudent.tokens.push({ token : token})
        await newStudent.save()
        return newStudent
      } catch(e){
        console.log(e)
      }
    } 

    async updateOne(id : string, studentdata: Student) : Promise<Student> {
      const updatable = ['name', 'email', 'currentSem', 'password', 'phoneNumber', 'batch', 'attendance', 'department']
      const updateStudent = Object.keys(studentdata)
      const isValidUpdate = updateStudent.every(update => updatable.includes(update))
      if(!isValidUpdate){
        throw new BadRequestException('not valid Update')
      }
      const updatedStudent = await this.StudentModel.findByIdAndUpdate(id, studentdata)
      if(!updatedStudent){
        throw new NotFoundException('Given student not found')
      }
      return updatedStudent
    }

    
    async deleteOne(id : string) {
      await this.StudentModel.findByIdAndDelete(id)
    }
}
