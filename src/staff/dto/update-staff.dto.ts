import { IsString, IsInt, IsIn, IsOptional, IsEnum, IsEmail, IsPhoneNumber } from 'class-validator';
import { IsStringOrUndefined } from '../../student/pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto number of that can be change when update staff
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class UpdateStaffDto
 */
export class UpdateStaffDto {

    @IsString()
    @IsOptional()
    _id : string;
    readonly name :string

    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email:string

    @IsOptional()
    @IsString()
    readonly password:string

    @IsOptional()
    @IsString()
    @IsPhoneNumber()
    readonly phoneNumber : string

    @IsOptional()
    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens : Array<{ token: string }>
}