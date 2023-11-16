import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
import { isNumber, isString } from "class-validator";


@Injectable()
export class StudentValidationPipe implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {
        //checking validation if _id is valid or not
        if(value.hasOwnProperty('_id')){
            if (!Types.ObjectId.isValid(value._id)) {
                throw new BadRequestException('Invalid ObjectId');
            }
        }

        //checking if name is valid or not
        if(value.hasOwnProperty('name')){
            if(!isString(value.name)){
                throw new BadRequestException('Name is invalid')
            }
        }

        //checking if email is valid or not
        if(value.hasOwnProperty('email')){
            if(!isString(value.email)){
                throw new BadRequestException('Email is invalid')
            }
        }

        //checking if phone Number is valid or not
        if(value.hasOwnProperty('phoneNumber')){
            if(!isString(value.phoneNumber)){
                throw new BadRequestException('Phone number is invalid')
            }
        }

        //checking if attendance is valid or not
        if(value.hasOwnProperty('attendance')){
            if(value.attendance < 0){
                throw new BadRequestException('Attendance is invalid')
            }
        }


        //checking if department is valid or not
        if(value.hasOwnProperty('department')){
            const validDepartment = ['CE', 'ME', 'EC']
            if(validDepartment.indexOf(value.department) === -1){
                throw new BadRequestException('Department not present')
            }
        }

        //checking if batch is valid or not (taking batch between 2015-2025)
        if(value.hasOwnProperty('batch')){
            if(value.batch < 2015 && value.batch > 2025){
                throw new BadRequestException('Batch is invalid')
            }
        }

        //checking if semester is valid or not
        if(value.hasOwnProperty('currentSem')){
            if(value.currentSem > 0 && value.batch < 10){
                throw new BadRequestException('Semester is invalid')
            }
        }
        return value
    }
    
}