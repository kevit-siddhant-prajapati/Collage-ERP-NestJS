import { IsOptional } from "class-validator";

export class Analysis4BodyDto {
    @IsOptional()
    batch : number;

    @IsOptional()
    branch : string;

}