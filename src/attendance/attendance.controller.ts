import { BadRequestException, Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { fillAttendanceDto } from './dto/fill-Attendance.dto';
import { StudentModel } from '../student/schemas/student.schema';
import { ManageAttendanceDto } from './dto/manage-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ParseObjectIdPipe } from '../student/pipe/ParseObjectId.pipe';

@Controller('attendance')
export class AttendanceController {
    constructor(
        private attendanceService : AttendanceService
    ){}

    /**
     * @description : this method fill attendance of user
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {fillAttendanceDto} attendance
     * @returns {*} 
     */
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

    /**
     * @description : this route update attendance of user using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {string} id
     * @param {ManageAttendanceDto} attendance
     * @returns {*} 
     */
    @Patch('update/:id')
    async updateUserAttendance(
        @Param('id' , new ParseObjectIdPipe()) id: string,
        @Body() attendance : ManageAttendanceDto
    ){
        return this.attendanceService.manageAttendanceById(attendance, id)
    }

    /**
     * @description : this method give attendance by its role
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {CreateAttendanceDto} roleOfUser
     * @returns {*} 
     */
    @Get('get')
    async getUserByRole(
        @Body() roleOfUser: CreateAttendanceDto
    ){
        return this.attendanceService.getAttendanceByRole(roleOfUser)
    }
}
