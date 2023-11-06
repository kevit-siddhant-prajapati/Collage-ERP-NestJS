import { IsArray, IsDate, IsString } from "class-validator";


export class fillAttendanceDto{
    @IsDate()
    date: Date;

    @IsArray()
    attendance : Array<string>;

    @IsString()
    role : string;
}