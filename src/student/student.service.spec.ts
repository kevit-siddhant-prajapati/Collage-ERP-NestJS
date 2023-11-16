import { Test, TestingModule } from '@nestjs/testing';
import { StudentService } from './student.service';
import { Student } from './schemas/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserHelper } from '../helper/user.helper';

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

const mockLogger = {
  error : jest.fn(),
  info : jest.fn()
}

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
      const outputStudent = [
        {
          name: 'Kevin',
          email: 'kevin@example.com',
          currentSem: 1,
          phoneNumber: '8864000809',
          batch: 2020,
          department: 'CE',
          attendance: 216
        },
        {
          name: 'Maya',
          email: 'maya@example.com',
          currentSem: 1,
          phoneNumber: '8964009809',
          batch: 2019,
          department: 'ME',
          attendance: 213
        }
      ]
      mockStudentModel.find.mockResolvedValue(mockStudents);
      const result = await studentService.findAll();
      expect(result).toEqual(outputStudent); 
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
      const outputStudent = {
        name: 'Kevin',
        email: 'kevin@example.com',
        currentSem: 1,
        phoneNumber: '8864000809',
        batch: 2020,
        department: 'CE',
        attendance: 216
      }
        mockStudentModel.findById.mockResolvedValue(mockStudent);
        const result = await studentService.findById('653365527f2450effb99f630');
        expect(result).toEqual(outputStudent);
      });

    })

    describe('createOne', () => {
      it('should create a new student', async () => {
        const studentData = {
          name : "Lina",
          email : "lina@example.com",
          password : "Lina@1234",
          phoneNumber : '1234567290',
          department : "CE",
          batch : 2020,
          currentSem : 1,
          attendance : 120,
          tokens : []
        };
  
        const hashedPasswordStudent = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordStudent);
  
        const mockGenerateAuthToken = jest.spyOn(UserHelper, 'generateAuthToken').mockResolvedValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTQ5YmVkY2M2ZDUxYTYzY2FkMDAzNGYiLCJpYXQiOjE3MDAxMjA0NDgsImV4cCI6MTcwMDEyNDA0OH0.dGd_YBQbCG69lgMVnf-qXxk3yN_Y8hHr35uPwb6vclw');
        
        mockStudentModel.create.mockResolvedValue(studentData);
  
        const result = await studentService.createOne(studentData);

        expect(result).toEqual(studentData);
        expect(mockGenerateAuthToken).toHaveBeenCalled();
    });
  })

    describe('updateOne', () => {
      it('should update an existing student and return the updated data', async () => {
        const mockStudent = { 
          //value that to be update
          name : "Mike",
          email : "mike@example.com",
          password : "Mike@1234",
          phoneNumber : '1234567290',
          department : "CE",
          batch : 2020,
          currentSem : 1,
          attendance : 120,
          _id : '653365527f2490effb99f630',
          tokens : []
         };

        const hashedPasswordStudent = '$2b$08$36sq1MNRqpERM8IejEv9Be9qsNy9UtmqGr5ObMDTkBhb5VoldTtJW'; // replace with actual hashed password

        jest.spyOn(UserHelper, 'convertToHash').mockResolvedValue(hashedPasswordStudent);
        
        mockStudentModel.findByIdAndUpdate.mockResolvedValue(mockStudent)

        const result = await studentService.updateOne('653365527f2490effb99f630', {
          //original value(in mock-data)
          attendance: 100,
          name: 'Linda',
          email: 'linda',
          currentSem: 2,
          password: 'Linda@123',
          phoneNumber: '9087654321',
          batch: 2021,
          department: 'EC',
          tokens: []
        })

        expect(result).toEqual(mockStudent);
      });
    })

  describe('deleteOne', () => {
    it('should delete a student and associated attendance data', async () => {
      const mockStudent = { 
        name : "Mike",
        email : "mike@example.com",
        password : "Mike@1234",
        phoneNumber : '1234567290',
        department : "CE",
        batch : 2020,
        currentSem : 1,
        attendance : 120,
        _id : '653365527f2490effb99f630', 
        tokens : []
       };
      mockStudentModel.findByIdAndDelete.mockResolvedValue(mockStudent)
      const result = await studentService.deleteOne('653365527f2490effb99f630');
      expect(result).not.toBeDefined();
    });
  });

});
