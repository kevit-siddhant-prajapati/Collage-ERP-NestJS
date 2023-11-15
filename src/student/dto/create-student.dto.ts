import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto give information as well restrict student when it is created
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class CreateStudentDto
 */
export class CreateStudentDto {

    @IsOptional()
    @IsStringOrUndefined()
    _id : string | undefined;
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