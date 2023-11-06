import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../IsStringOrUndefined.pipe';


export class UpdateStudentDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string;
    @IsString()
    readonly name :string

    @IsOptional()
    @IsString()
    readonly email:string

    @IsOptional()
    @IsInt()
    readonly currentSem:number

    @IsOptional()
    @IsString()
    readonly password:string

    @IsOptional()
    @IsString()
    readonly phoneNumber : string

    @IsOptional()
    @IsInt()
    readonly batch : number

    @IsOptional()
    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens: Array<{ token: string }>;
}