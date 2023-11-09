import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { StaffSchema } from '../staff/schemas/staff.schema';
import { StudentSchema } from '../student/schemas/student.schema';
import { AdminSchema } from '../admin/schemas/admin.schema';
/**
 * @description : module use for authentication user as well as authorization user
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AuthModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Staff', schema : StaffSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Admin', schema : AdminSchema}
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}