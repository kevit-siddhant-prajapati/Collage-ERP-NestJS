import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { StudentService } from './student.service';
import { Student, StudentModel, StudentSchema } from './schemas/student.schema';
import { UserMiddleware } from '../middleware/user.middleware';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Attendance, AttendanceSchema } from '../attendance/schemas/attendance.schema';
import { ConfigModule } from '@nestjs/config';
import { StaffSchema } from '../staff/schemas/staff.schema';
import { AdminSchema } from '../admin/schemas/admin.schema';
import { HttpStatusCode } from 'axios';

//const { setupDatabase, studentOne } = require('../../test/fixtures/testdatabase')
//console.log(studentOne)

const mockStudentModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

const mockAttendanceModel = {
  deleteMany: jest.fn(),
};

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [
        ConfigModule.forRoot({
          envFilePath : '.env.test',
          isGlobal : true
        }),
        MongooseModule.forRoot('mongodb://localhost:27017/college-next-test'),
        MongooseModule.forFeature([
          { name : 'Student', schema : StudentSchema},
          { name : 'Attendance', schema : AttendanceSchema},
          { name : 'Staff', schema : StaffSchema},
          { name : 'Admin' , schema : AdminSchema}
        ])
      ],
      providers: [
        StudentService,
        UserMiddleware,
        // {
        //   provide: getModelToken(Student.name),
        //   useValue: mockStudentModel,
        // },
        // {
        //   provide: getModelToken(Attendance.name),
        //   useValue: mockAttendanceModel,
        // },
      ],
    }).compile();


    service = module.get<StudentService>(StudentService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //creting mockdatabase
  describe('findAll', () => {
    it('should return an array of secure students', async () => {
      const mockStudents: Student[] = [
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
      ];

      const t1 = mockStudentModel.find.mockResolvedValue(mockStudents);
      
      await mockStudentModel.find({})

      const result = await service.findAll();
      console.log('result is generated below')
      console.log(result)
      expect(HttpStatusCode.Accepted)

      const student = await StudentModel.find({})
      //.toEqual(mockStudents.map((student) => expect.objectContaining(student)));
    });
  });

  describe('findById', () => {

    it('should return a single student', async () => {
      const mockStudent: Student = {
        name: "Kevin",
        email: "kevin@example.com",
        currentSem: 1,
        password: 'Kevin@123',
        phoneNumber: '8864000809',
        batch: 2020,
        department: 'CE',
        attendance: 216,
        tokens : []
    };

      console.log('value of mockResolvedValue')
      mockStudentModel.findById.mockResolvedValue(mockStudent);

      const result = await service.findById('653365527f2450effb99f630');

      expect(result).toEqual(expect.objectContaining(mockStudent));
    });


    it('should throw NotFoundException if student not found', async () => {
      mockStudentModel.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrowError(NotFoundException);
    });

  });


  describe('createOne', () => {
    it('create new Student', async () => {

    })
  })

});
