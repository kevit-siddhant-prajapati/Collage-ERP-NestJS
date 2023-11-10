import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Student } from './schemas/student.schema';

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
  let studentService: StudentService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: 'AttendanceModel',
          useValue: mockAttendanceModel,
        },
        {
          provide: 'StudentModel',
          useValue: mockStudentModel,
        },
      ],
    }).compile();

    studentService = moduleRef.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of secure students', async () => {
      const mockStudents : Student[] = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
          currentSem: 1,
          password: 'Kevin@123',
          phoneNumber: '8864000809',
          batch: 2020,
          department: 'CE',
          attendance: 216,
          tokens: [],
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
          currentSem: 1,
          password: 'Maya@1234',
          phoneNumber: '8964009809',
          batch: 2019,
          department: 'ME',
          attendance: 213,
          tokens: [],
        },
      ];
      mockStudentModel.find.mockResolvedValue(mockStudents);
      const result = await studentService.findAll();
      expect(result).toEqual(mockStudents); 
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
        mockStudentModel.findById.mockResolvedValue(mockStudent);
        const result = await studentService.findById('653365527f2450effb99f630');
        expect(result).toEqual(mockStudent);
      });

    })

    describe('createOne', () => {
      it('should create a new student and return it', async () => {
        const mockStudent: Student = await studentService.createOne({
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          phoneNumber : '1234567890',
          department : "CE",
          batch : 2020,
          currentSem : 1,
          attendance : 120,
          tokens : []
      });
      mockStudentModel.create.mockResolvedValue(mockStudent);
      expect(mockStudent).toBeDefined();
      });
    });

    describe('updateOne', () => {
      it('should update an existing student and return the updated data', async () => {
        const result = await studentService.updateOne('653365527f2490effb99f630', { 
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          phoneNumber : '1234567290',
          department : "CE",
          batch : 2020,
          currentSem : 1,
          attendance : 120,
          tokens : []
         });
         mockStudentModel.findByIdAndUpdate.mockResolvedValue(result);
        expect(result).toBeDefined();
      });
    })

  describe('deleteOne', () => {
    it('should delete a student and associated attendance data', async () => {
      const result: any = await studentService.deleteOne('653365527f2490effb99f630');
      mockStudentModel.findByIdAndDelete.mockResolvedValue(result)
      mockAttendanceModel.deleteMany.mockResolvedValue(result)
      expect(result).not.toBeDefined();
    });
  });

});
