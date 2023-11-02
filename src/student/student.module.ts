import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModel, StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';

@Module({
    imports : [
        MongooseModule.forFeature([
            { name: 'Student', schema : StudentSchema},
            { name: 'Attendance', schema : AttendanceSchema}
        ]),
        StudentModel
    ],
    controllers : [StudentController],
    providers : [StudentService, JwtService],
    exports : [ StudentService, StudentModel]
})
export class StudentModule {
}

