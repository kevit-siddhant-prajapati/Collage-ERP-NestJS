import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentModel, StudentSchema } from './schemas/student.schema';
import { AttendanceModel, AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffSchema } from 'src/staff/schemas/staff.schema';
import { JwtService } from '@nestjs/jwt';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService : StudentService;

  beforeEach(async () => {
    // studentService = new StudentService(AttendanceModel, StudentModel);
    // studentController = new StudentController(studentService)
    const moduleRef : TestingModule = await Test.createTestingModule({
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
    }).compile()

    studentService = await moduleRef.resolve(StudentService)
  });

 //check if Student Controller is defined or not
  it('should be defined', () => {
    expect(studentController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of student', async () => {
      const result = ['test']
      jest.spyOn(studentService, 'findAll').mockImplementation(() => result);

      expect(await studentController.getAllStudents()).toBe(result)
    })
  })
});
