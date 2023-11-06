import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('login')
    @HttpCode(200)
    async loginUser(
        @Body() credencials :LoginUserDto,
    ) {
        if(credencials.role == "Student"){
            return this.authService.loginStudent(credencials)
        } else if(credencials.role == "Staff"){
            return this.authService.loginStaff(credencials)
        } else if(credencials.role == "Admin") {
            return this.authService.loginAdmin(credencials)
        } else {
            throw new BadRequestException("Enter valid role")
        }
    }

    @Get('logout')
    async logoutUser(){
        return this.authService.logout()
    }
}
