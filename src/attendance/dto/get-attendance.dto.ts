import { IsString } from "class-validator";
/**
 * @description : dto req attendance using role
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class GetAttendanceDto
 */
export class GetAttendanceDto {
     @IsString()
     roleOfUser : string;
}