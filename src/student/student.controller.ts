import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('students')
export class StudentController {
    constructor(private studentService : StudentService){}

    @Get()
    async getAllStudents() : Promise<Student[]> {
        return this.studentService.findAll()
    }


    @Get('/:id')
    async getStudentById(@Param('id') id) : Promise<Student> {
        return this.studentService.findById(id)
    }

    @Post('new')
    async addStudent(@Body() input: CreateStudentDto) : Promise<Student> {
        return this.studentService.createOne(input)
    }

    @Patch('/update/:id')
    async updateStudent(
        @Body() student: UpdateStudentDto,
        @Param('id') id: string
        ) : Promise<Student> {
        return this.studentService.updateOne(id, student)
    }

    @Delete('/delete/:id')
    @HttpCode(204)
    async deleteStudent(
        @Param('id') id: string
    ) {
        return this.studentService.deleteOne(id)
    }

    @Post('login')
    async loginStudent(
        @Body() credencials :LoginUserDto
    ) {
        return this.studentService.loginStudent(credencials)
    }

}
