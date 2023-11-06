import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/IsStringOrUndefined.pipe';

export class UpdateAdminDto {

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
    tokens : Array<{ token: string }>
}