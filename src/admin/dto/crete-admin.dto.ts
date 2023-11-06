import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/IsStringOrUndefined.pipe';

export class CreateAdminDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string;
    @IsString()
    readonly name :string

    @IsString()
    readonly email:string

    @IsString()
    readonly password:string

    @IsOptional()
    tokens : Array<{ token: string }>
}