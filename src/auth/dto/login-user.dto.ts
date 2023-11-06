import { IsEnum, IsString } from "class-validator";


export class LoginUserDto {
    @IsString()
    email :string;

    @IsString()
    password : string;

    @IsString()
    role : string;
}