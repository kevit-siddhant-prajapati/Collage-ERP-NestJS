import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { Student } from 'src/student/schemas/student.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

/**
 * @description : this route use for login user
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {LoginUserDto} credencials
 * @returns {*} : res back to postman
 */
@Post('login')
    @HttpCode(200)
    async loginUser(
        @Body() credencials :LoginUserDto,
    ) : Promise<any>{
        if(credencials.role === "Student"){
            return this.authService.loginStudent(credencials)
        } else if(credencials.role === "Staff"){
            return this.authService.loginStaff(credencials)
        } else if(credencials.role === "Admin") {
            return this.authService.loginAdmin(credencials)
        } else {
            throw new BadRequestException("Enter valid role")
        }
    }

    /**
     * @description : logout all existing user
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*} 
     */
    @Get('logout')
    @HttpCode(200)
    async logoutUser(){
        return this.authService.logout()
    }
}
