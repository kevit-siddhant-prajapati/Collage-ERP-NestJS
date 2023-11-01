import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { StudentModel } from 'src/student/schemas/student.schema';
import { ManageAttendanceDto } from './dto/manage-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
    constructor(
        private attendanceService : AttendanceService
    ){}

    @Post('fill')
    async fillAttendenceOfUser(
        @Body() attendance : fillAttendanceDto
    ){
        if(attendance.role == 'Student'){
            return this.attendanceService.fillStudentAttendance(attendance)
        } else if (attendance.role == 'Staff') {
            return this.attendanceService.fillStaffAttendance(attendance)
        } else {
            throw new BadRequestException('Enter valid Role of User')
        }
    }

    @Patch('update/:id')
    async updateUserAttendance(
        @Param('id') id: string,
        @Body() attendance : ManageAttendanceDto
    ){
        return this.attendanceService.manageAttendanceById(attendance, id)
    }

    @Get('get')
    async getUserByRole(
        @Body() roleOfUser: CreateAttendanceDto
    ){
        return this.attendanceService.getAttendanceByRole(roleOfUser)
    }
}
