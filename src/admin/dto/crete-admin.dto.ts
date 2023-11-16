import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../../student/pipe/IsStringOrUndefined.pipe';
/**
 * @description : this dto give information as well restrict admin when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateAdminDto
 */
export class CreateAdminDto {

    @IsOptional()
    //@IsStringOrUndefined()
    _id : string | undefined;
    @IsString()
    readonly name :string

    @IsString()
    readonly email:string

    @IsString()
    readonly password:string

    @IsOptional()
    tokens : Array<{ token: string }>
}