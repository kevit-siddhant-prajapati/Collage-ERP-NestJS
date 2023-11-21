import { IsOptional } from "class-validator";

export class Analysis2BodyDto {
    @IsOptional()
    batch : number;

    @IsOptional()
    branch : string;

    @IsOptional()
    semester : number;

    date : Date;
}