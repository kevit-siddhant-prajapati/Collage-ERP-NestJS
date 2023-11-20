import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto give information as well restrict student when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateStudentDto
 */
export class CreateStudentDto {

    @IsOptional()
    _id : string;
    @IsString()
    name :string

    @IsString()
    email:string

    @IsInt()
    currentSem:number

    @IsString()
    password:string

    @IsString()
    phoneNumber : string

    @IsInt()
    batch : number

    @IsString()
    department : string

    @IsInt()
    attendance : number

    @IsOptional()
    tokens: Array<{ token: string }>;
}