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


    /**
     * @description : Student Middleware use for student authorization
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} req : Request comming from postman
     * @param {*} res : Responce back to postman
     * @param {(error?: any) => void} next
     */
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

/**
 * @description : Staff middleware use for staff authorization
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class StaffAuthMiddleware
 * @implements {NestMiddleware}
 */
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


/**
 * @description : AdminMiddleware use for admin authorization
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AdminAuthMiddleware
 * @implements {NestMiddleware}
 */
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
            const decoded: any = jwt.verify(tokenArr[1], process.env.JWT_SECRET_CODE)   
            console.log()
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
