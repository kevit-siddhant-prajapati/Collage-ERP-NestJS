import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { StaffModule } from './staff/staff.module';
import { AdminModule } from './admin/admin.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { AnalysisModule } from './analysis/analysis.module';
import { DatabaseModule } from './database/database.module';
/**
 * @description : this module all module of project
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal : true,
    }),
    StudentModule,
    StaffModule,
    AdminModule,
    AttendanceModule,
    AuthModule,
    AnalysisModule,
    DatabaseModule
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {
  
}
