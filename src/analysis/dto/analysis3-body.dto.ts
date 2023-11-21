import { IsOptional } from "class-validator";

export class Analysis3BodyDto {
    @IsOptional()
    batch : number;

    @IsOptional()
    branch : string;

    @IsOptional()
    semester : number;

    date : Date;
}