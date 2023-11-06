import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModel, StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { StaffAuthMiddleware, StudentAuthMiddleware } from '../auth/auth.middleware';
import { StaffSchema } from 'src/staff/schemas/staff.schema';

@Module({
    imports : [
        MongooseModule.forFeature([
            { name: 'Student', schema : StudentSchema},
            { name: 'Staff', schema : StaffSchema},
            { name: 'Attendance', schema : AttendanceSchema}
        ]),
        StudentModel
    ],
    controllers : [StudentController],
    providers : [StudentService, JwtService],
    exports : [ StudentService, StudentModel]
})
export class StudentModule {

    configure(consumer : MiddlewareConsumer){
        consumer
            .apply(StudentAuthMiddleware)
            .forRoutes(
                { path: 'students/all', method : RequestMethod.GET}
            )

        consumer
            .apply(StaffAuthMiddleware)
            .forRoutes(
                { path: 'students/update/:id', method : RequestMethod.PATCH},
                { path: 'students/delete/:id', method : RequestMethod.DELETE},
                { path: 'students/new', method : RequestMethod.POST},
                { path: 'students/:id', method: RequestMethod.GET},
            )
    }
}

