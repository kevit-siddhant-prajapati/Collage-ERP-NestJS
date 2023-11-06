import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as jwt from "jsonwebtoken"
import { Model } from "mongoose";
import { Admin, AdminModel } from "src/admin/schemas/admin.schema";
import { Staff, StaffModel } from "src/staff/schemas/staff.schema";
import { Student, StudentModel } from "src/student/schemas/student.schema";

@Injectable()
export class StudentAuthMiddleware implements NestMiddleware{

    constructor(
        @InjectModel(Student.name) private readonly StudentModel : Model<Student>,
    ){
    }
    async use(req: any, res: any, next: (error?: any) => void) {
        try {
            console.log('Student Middleware is implimented!')
            const token = req.header('Authorization')
            const tokenArr = token.split(' ')
            console.log(`token student middleware ${tokenArr[1]}`)
            const decoded: any = jwt.verify(tokenArr[1], process.env.JWT_SECRET_CODE)   
            //console.log(`token is: ${token}`)
            if(!decoded){
                throw new NotFoundException("token not generate")
            }

            const student = await this.StudentModel.findOne({_id : decoded._id, 'tokens.token':tokenArr[1]})
            if(!student){
                throw new Error('User not found')
            }
            req.token = tokenArr[1]
            req.student = student
            //console.log('Authentication successful')
            next()
        } catch (e){
             res.status(401).send({error : `Please authenticate with Error: ${e}`})
        }
    }
    
}

@Injectable()
export class StaffAuthMiddleware implements NestMiddleware{

    constructor(
        @InjectModel(Staff.name) private readonly StaffModel : Model<Staff>,
    ){
         
    }
    async use(req: any, res: any, next: (error?: any) => void) {
        console.log('Staff Middleware is implimented!')
        try {
            const token = req.header('Authorization')
            const tokenArr = token.split(' ')
            console.log(`token staff middleware ${tokenArr[1]}`)
            const decoded: any = jwt.verify(tokenArr[1], process.env.JWT_SECRET_CODE)   //there is problem
            if(!decoded){
                throw Error('do not verify token')
            }
            const staff = await this.StaffModel.findOne({_id : decoded._id, 'tokens.token':tokenArr[1]})
            if(!staff){
                throw new Error('User not found')
            }
            req.token = tokenArr[1]
            req.staff = staff
            next()
        } catch (e){
             res.status(401).send({error : `Please authenticate with Error: ${e}`})
        }
    }
    
}

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware{
    constructor(
        @InjectModel(Admin.name) private readonly AdminModel : Model<Admin>,
    ){

    }
    async use(req: any, res: any, next: (error?: any) => void) {
        console.log('Admin Middleware is implimented!')
        try {
            const token = req.header('Authorization')
            const tokenArr = token.split(' ')
            console.log(`token admin middleware ${tokenArr[1]}`)
            const decoded: any = jwt.verify(tokenArr[1], process.env.JWT_SECRET_CODE)   //there is problem
            if(!decoded){
                throw Error('do not verify token')
            }
            const admin = await this.AdminModel.findOne({_id : decoded._id, 'tokens.token':tokenArr[1]})
            if(!admin){
                throw new Error('User not found')
            }
            req.token = tokenArr[1]
            req.admin = admin
            next()
        } catch (e){
             res.status(401).send({error : `Please authenticate with Error: ${e}`})
        }
    }
    
}

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTMzNjYwZTdmMjQ1MGVmZmI5OWY2NGMiLCJpYXQiOjE2OTkyNjE4NjgsImV4cCI6MTY5OTI2NTQ2OH0.C4m2r8rHaN24cXrbwzmRkTKv3UTbxN-9JVzrfm9FQVQ

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTMzNjYwZTdmMjQ1MGVmZmI5OWY2NGMiLCJpYXQiOjE2OTkyNjE2NjQsImV4cCI6MTY5OTI2NTI2NH0.8E3JLpnu59EJ6qFZ9QKOjuci3Jn3T9T2q3eQH5CAlOk"