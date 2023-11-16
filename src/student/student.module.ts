import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModel, StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';
import { AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { AdminAuthMiddleware, StaffAuthMiddleware, StudentAuthMiddleware } from '../auth/auth.middleware';
import { StaffSchema } from '../staff/schemas/staff.schema';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminSchema } from '../admin/schemas/admin.schema';

/**
 * @description : Student module import different model sd well as connect student controller and service
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class StudentModule
 */
@Module({
    imports : [
        ConfigModule,
        DatabaseModule,
        MongooseModule.forFeature([
            { name: 'Attendance', schema : AttendanceSchema},
            { name: 'Student', schema : StudentSchema},
            { name: 'Staff', schema : StaffSchema},
            { name: 'Admin', schema : AdminSchema}
        ]),
    ],
    controllers : [StudentController],
    providers : [StudentService, JwtService],
    exports : [ StudentService]
})
export class StudentModule {
/**
 * @description : below methods connect different routes with middleware
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @param {MiddlewareConsumer} consumer
 */
    configure(consumer : MiddlewareConsumer){
        consumer
            .apply(StudentAuthMiddleware)
            .forRoutes(
                { path: 'students/all', method : RequestMethod.GET}
            )

        consumer
            .apply(StaffAuthMiddleware)
            .forRoutes(
                { path: 'students/new', method : RequestMethod.POST},
            )
        
        consumer
            .apply(AdminAuthMiddleware)
            .forRoutes(
                { path: 'students/update/:id', method : RequestMethod.PATCH},
                { path: 'students/delete/:id', method : RequestMethod.DELETE},
                { path: 'students/get:id', method: RequestMethod.GET},
            )
    }
}

