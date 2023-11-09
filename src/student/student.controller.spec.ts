import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentModel, StudentSchema } from './schemas/student.schema';
import { AttendanceSchema } from 'src/attendance/schemas/attendance.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StaffSchema } from 'src/staff/schemas/staff.schema';
import { JwtService } from '@nestjs/jwt';
import { INestApplication } from '@nestjs/common'

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService : StudentService;
  let app : INestApplication

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
      const result: Promise<Student[]> = [
        {
          name: "Kevin",
          email: "kevin@example.com",
          currentSem: 1,
          password: 'Kevin@123',
          phoneNumber: '8864000809',
          batch: 2020,
          department: 'CE',
          attendance: 216,
          tokens : []
      },
      {
          name: "Maya",
          email: "maya@example.com",
          currentSem: 1,
          password: 'Maya@1234',
          phoneNumber: "8964009809",
          batch: 2019,
          department: 'ME',
          attendance: 213,
          tokens : []
      }
      ]
      jest.spyOn(studentService, 'findAll').mockImplementation(() => result);

      expect(await studentController.getAllStudents()).toBe(result)
    })
  })
});
