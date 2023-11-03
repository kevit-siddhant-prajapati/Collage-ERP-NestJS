import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { StudentSchema } from 'src/student/schemas/student.schema';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: 'Attendance', schema : AttendanceSchema},
      { name: 'Student', schema : StudentSchema}
    ]),
  ],
  providers: [AnalysisService],
  controllers: [AnalysisController]
})
export class AnalysisModule {}
