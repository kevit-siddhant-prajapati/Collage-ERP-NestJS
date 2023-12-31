import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModel, StaffSchema } from './schemas/staff.schema';
import { JwtService } from '@nestjs/jwt';
import { AdminAuthMiddleware, StaffAuthMiddleware } from '../auth/auth.middleware';
import { AdminModule } from '../admin/admin.module';
import { AdminSchema } from '../admin/schemas/admin.schema';
import { AttendanceSchema } from '../attendance/schemas/attendance.schema';

/**
 * @description : Staffmodule connect controller and services
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class StaffModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Staff', schema : StaffSchema},
      { name: 'Admin', schema : AdminSchema},
      { name: 'Attendance', schema : AttendanceSchema}
    ]),
    AdminModule,
  ],
  providers: [StaffService, JwtService],
  controllers: [StaffController],
   exports : [StaffService]
})


export class StaffModule {
  /**
   * @description : configure different middleware to different routes
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   * @param {MiddlewareConsumer} consumer
   */
  configure(consumer: MiddlewareConsumer) {
    // Apply StaffAuthMiddleware for '/staffs/all'
    consumer
      .apply(StaffAuthMiddleware)
      .forRoutes({ path: 'staffs/all', method: RequestMethod.GET });
  
    // Apply AdminAuthMiddleware for all other routes
    consumer
      .apply(AdminAuthMiddleware)
      .forRoutes(
        { path: 'staffs/get/:id', method: RequestMethod.GET },
        { path: 'staffs/new', method: RequestMethod.POST },
        { path: 'staffs/update/:id', method: RequestMethod.PATCH },
        { path: 'staffs/delete/:id', method: RequestMethod.DELETE }
      );
  }
}
