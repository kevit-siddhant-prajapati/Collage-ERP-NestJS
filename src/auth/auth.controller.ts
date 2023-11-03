import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('login')
    async loginUser(
        @Body() credencials :LoginUserDto
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
