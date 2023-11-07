import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { StudentSchema } from 'src/student/schemas/student.schema';
import { AdminAuthMiddleware } from 'src/auth/auth.middleware';
import { AdminSchema } from 'src/admin/schemas/admin.schema';
/**
 * @description : this module connect controller with analysis service
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AnalysisModule
 */
@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Attendance', schema : AttendanceSchema},
      { name: 'Student', schema : StudentSchema},
      { name: 'Admin', schema : AdminSchema}
    ]),
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController]
})

export class AnalysisModule {
  configure(consumer : MiddlewareConsumer){
    consumer
    .apply(AdminAuthMiddleware)
    .forRoutes(
      {path : 'analysis/1' , method : RequestMethod.GET},
      {path : 'analysis/2' , method : RequestMethod.POST},
      {path : 'analysis/3' , method : RequestMethod.POST},
      {path : 'analysis/4' , method : RequestMethod.POST},
    )
  }
}
