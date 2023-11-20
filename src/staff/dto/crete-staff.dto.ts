import { IsString, IsInt, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

/**
 * @description : this dto give information as well restrict staff when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateStaffDto
 */
export class CreateStaffDto {

    @IsOptional()
    _id : string | undefined;
    @IsString()
    readonly name :string

    @IsString()
    @IsEmail()
    readonly email:string

    @IsString()
    readonly password:string

    @IsString()
    @IsPhoneNumber()
    readonly phoneNumber : string

    @IsString()
    readonly department : string

    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens : Array<{ token: string }>
}