import { IsArray, IsDate, IsString } from "class-validator";

/**
 * @description : this dto useful for proving field to fill attendance
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class fillAttendanceDto
 */
export class fillAttendanceDto{
    @IsDate()
    date: Date;

    @IsArray()
    attendance : Array<string>;

    @IsString()
    role : string;
}