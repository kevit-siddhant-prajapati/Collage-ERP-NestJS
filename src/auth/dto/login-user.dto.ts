import { IsEnum, IsString } from "class-validator";

/**
 * @description : set what type of login request should come
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class LoginUserDto
 */
export class LoginUserDto {
    @IsString()
    email :string;

    @IsString()
    password : string;

    @IsString()
    role : string;
}