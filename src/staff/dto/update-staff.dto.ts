import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/IsStringOrUndefined.pipe';


export class UpdateStaffDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string;
    @IsString()
    readonly name :string

    @IsOptional()
    @IsString()
    readonly email:string

    @IsOptional()
    @IsString()
    readonly password:string

    @IsOptional()
    @IsString()
    readonly phoneNumber : string


    @IsOptional()
    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens : Array<{ token: string }>
}