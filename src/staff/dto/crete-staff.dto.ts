import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto give information as well restrict staff when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateStaffDto
 */
export class CreateStaffDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string | undefined;
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