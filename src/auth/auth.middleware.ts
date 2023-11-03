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
            const token = req.header('Authorization').replace('Bearer ','');
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_CODE)   
            console.log(`token is: ${token}`)
            if(!decoded){
                throw new NotFoundException("token not generate")
            }
            const student = await this.StudentModel.findOne({_id : decoded._id, 'tokens.token':token})
            if(!student){
                throw new Error('User not found')
            }
            req.token = token
            req.student = student
            console.log('Authentication successful')
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
            const token = req.header('Authorization').replace('Bearer ','');
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_CODE)   //there is problem
            if(!decoded){
                throw Error('do not verify token')
            }
            const staff = await this.StaffModel.findOne({_id : decoded._id, 'tokens.token':token})
            if(!staff){
                throw new Error('User not found')
            }
            req.token = token
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
        console.log('Student Middleware is implimented!')
        try {
            const token = req.header('Authorization').replace('Bearer ','');
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET_CODE)   //there is problem
            if(!decoded){
                throw Error('do not verify token')
            }
            const admin = await this.AdminModel.findOne({_id : decoded._id, 'tokens.token':token})
            if(!admin){
                throw new Error('User not found')
            }
            req.token = token
            req.admin = admin
            next()
        } catch (e){
             res.status(401).send({error : `Please authenticate with Error: ${e}`})
        }
    }
    
}
