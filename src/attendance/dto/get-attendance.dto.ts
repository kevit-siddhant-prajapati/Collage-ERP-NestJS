import { IsString } from "class-validator";

export class GetAttendanceDto {
     @IsString()
     roleOfUser : string;
}