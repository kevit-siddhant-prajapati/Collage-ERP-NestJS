import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ParseObjectIdPipe } from './pipe/ParseObjectId.pipe';
import { StudentValidationPipe } from './pipe/student-validation.pipe';


@Controller('students')
export class StudentController {
  
    constructor(private studentService : StudentService){}

    /**
     * @description : get data of all student
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*}  {Promise<Student[]>}
     */
    @Get('all')
    async getAllStudents() : Promise<Student[]> {
        return this.studentService.findAll()
    }


    /**
     * @description  : get data of student using id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} id
     * @returns {*}  {Promise<Student>}
     */
    @Get('get/:id')
    async getStudentById(@Param('id', new ParseObjectIdPipe()) id:string) : Promise<Student> {
        return this.studentService.findById(id)
    }

    /**
     * @description : create new student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {CreateStudentDto} input
     * @returns {*}  {Promise<Student>}
     */
    @UsePipes(StudentValidationPipe)
    @Post('new')
    async addStudent(@Body() input: CreateStudentDto) : Promise<Student> {
        return this.studentService.createOne(input)
    }

    /**
     * @description : update new student using its id
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {UpdateStudentDto} student
     * @param {string} id
     * @returns {*}  {Promise<Student>}
     */
    @UsePipes(StudentValidationPipe)
    @Patch('/update/:id')
    async updateStudent(
        @Body() student: UpdateStudentDto,
        @Param('id', new ParseObjectIdPipe()) id: string
        ) : Promise<Student> {
        return this.studentService.updateOne(id, student)
    }

/**
 * @description : delete student using its id
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {string} id
 * @returns {*} 
 */
@Delete('/delete/:id')
    @HttpCode(204)
    async deleteStudent(
        @Param('id', new ParseObjectIdPipe()) id: string
    ) {
        return this.studentService.deleteOne(id)
    }
}
