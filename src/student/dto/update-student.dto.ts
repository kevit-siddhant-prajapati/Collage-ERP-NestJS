import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto number of that can be change when update student
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class UpdateStudentDto
 */
export class UpdateStudentDto {

    @IsOptional()
    //@IsStringOrUndefined()
    _id : string | undefined;
    @IsString()
    name :string

    @IsOptional()
    @IsString()
    email:string

    @IsOptional()
    @IsInt()
    currentSem:number

    @IsOptional()
    @IsString()
    password:string

    @IsOptional()
    @IsString()
    phoneNumber : string

    @IsOptional()
    @IsInt()
    batch : number

    @IsOptional()
    @IsString()
    department : string

    @IsOptional()
    @IsInt()
    attendance : number

    @IsOptional()
    tokens: Array<{ token: string }>;
}