import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/IsStringOrUndefined.pipe';

export class CreateStaffDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string;
    @IsString()
    readonly name :string

    @IsString()
    readonly email:string

    @IsString()
    readonly password:string

    @IsString()
    readonly phoneNumber : string

    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens : Array<{ token: string }>
}