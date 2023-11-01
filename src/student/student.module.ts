import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModel, StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports : [
        MongooseModule.forFeature([{ name: 'Student', schema : StudentSchema}]),
        StudentModel
    ],
    controllers : [StudentController],
    providers : [StudentService, JwtService],
    exports : [ StudentService, StudentModel, MongooseModule.forFeature([{ name: 'Student', schema : StudentSchema}])]
})
export class StudentModule {}
