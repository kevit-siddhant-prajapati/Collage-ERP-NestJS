import { Test, TestingModule } from '@nestjs/testing';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { INestApplication } from '@nestjs/common'
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentController', () => {
  let studentController: StudentController;
  let studentService : StudentService;
  let app : INestApplication

  beforeEach(async () => {
    // studentService = new StudentService(AttendanceModel, StudentModel);
    // studentController = new StudentController(studentService)
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [StudentController],
      providers : [StudentService,

        {
          provide: 'AttendanceModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your AttendanceModel
        },
        {
          provide: 'StudentModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
      ],

    }).compile()

    studentService = await moduleRef.get<StudentService>(StudentService)
    studentController = await moduleRef.get<StudentController>(StudentController)
  });


  describe('getAllStudents', () => {
    it('should return array of student', async () => {
      const result: any = 
      [
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
      jest.spyOn(studentService, 'findAll').mockResolvedValue(result);

      expect(await studentController.getAllStudents()).toBe(result);
    })

    describe('getStudentById', () => {
      it('should return a student by ID', async () => {
        const result: any = {};
        jest.spyOn(studentService, 'findById').mockResolvedValue(result);
  
        expect(await studentController.getStudentById('654c90d94d320ee33c106517')).toBe(result);
      });
    });
  
    describe('addStudent', () => {
      it('should create a new student', async () => {
        const createStudentDto: CreateStudentDto = {
          name: "Maya",
          email: "maya@example.com",
          currentSem: 1,
          password: 'Maya@1234',
          phoneNumber: "8964009809",
          batch: 2019,
          department: 'ME',
          attendance: 213,
          _id: "6549be3dc6d51a63cad0033a",
          tokens: []
        };
        const result: any = {};
        jest.spyOn(studentService, 'createOne').mockResolvedValue(result);
  
        expect(await studentController.addStudent(createStudentDto)).toBe(result);
      });
    });
  
    describe('updateStudent', () => {
      it('should update a student by ID', async () => {
        const updateStudentDto: UpdateStudentDto = {
          name: "Jaya",
          email: "jaya@example.com",
          _id: '6549be3dc6d51a63cad0033a',
          currentSem: 2,
          password: 'Jaya@1234',
          phoneNumber: '1234567890',
          batch: 2021,
          department: 'CE',
          attendance: 90,
          tokens: []
        };
        const result: any = {};
        jest.spyOn(studentService, 'updateOne').mockResolvedValue(result);
  
        expect(await studentController.updateStudent(updateStudentDto, '6549be3dc6d51a63cad0033a')).toBe(result);
      });
    });
  
    describe('deleteStudent', () => {
      it('should delete a student by ID', async () => {
        jest.spyOn(studentService, 'deleteOne').mockResolvedValue();
        expect(await studentController.deleteStudent('6549be3dc6d51a63cad0033a')).toBeUndefined();
      });
    });


  })
});
