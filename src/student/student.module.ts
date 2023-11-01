import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports : [MongooseModule.forFeature([{ name: 'Student', schema : StudentSchema}])],
    controllers : [StudentController],
    providers : [StudentService, JwtService]
})
export class StudentModule {}
