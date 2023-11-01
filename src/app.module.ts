import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { StudentController } from './student/student.controller';
// import { StudentService } from './student/student.service';
import { StudentModule } from './student/student.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffModule } from './staff/staff.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal : true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    StudentModule,
    StaffModule,
    AdminModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
