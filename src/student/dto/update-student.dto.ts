import { IsString, IsInt, IsIn, IsOptional, IsEnum } from 'class-validator';
import { IsStringOrUndefined } from '../pipe/IsStringOrUndefined.pipe';

/**
 * @description : this dto number of that can be change when update student
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class UpdateStudentDto
 */
export class UpdateStudentDto {

    @IsOptional()
    //@IsStringOrUndefined()
    _id : string | undefined;
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

    @IsOptional()
    @IsInt()
    readonly attendance : number

    @IsOptional()
    tokens: Array<{ token: string }>;
}