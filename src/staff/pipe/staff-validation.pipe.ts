import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Types } from "mongoose";
import { isNumber, isString } from "class-validator";


@Injectable()
export class StaffValidationPipe implements PipeTransform{
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

        if(value.hasOwnProperty('department')){
            const validDepartment = ['CE', 'ME', 'EC']
            if(validDepartment.indexOf(value.department) === -1){
                throw new BadRequestException('Department not present')
            }
        }

        return value
    }
    
}