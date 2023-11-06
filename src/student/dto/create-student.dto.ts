import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../IsStringOrUndefined.pipe';


export class CreateStudentDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string;
    @IsString()
    readonly name :string

    @IsString()
    readonly email:string

    @IsInt()
    readonly currentSem:number

    @IsString()
    readonly password:string

    @IsString()
    readonly phoneNumber : string

    @IsInt()
    readonly batch : number

    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens: Array<{ token: string }>;
}