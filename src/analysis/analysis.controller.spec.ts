import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common'
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { Analysis1Dto } from './dto/analysis1.dto';
import { Analysis2Dto } from './dto/analysis2.dto';
import { Analysis3Dto } from './dto/analysis3.dto';
import { Analysis4Dto } from './dto/analysis4.dto';
import { Analysis4BodyDto } from './dto/analysis4-body.dto';
import { Analysis3BodyDto } from './dto/analysis3-body.dto';
import { Analysis2BodyDto } from './dto/analysis2-body.dto';

describe('AnalysisController', () => {
  let analysisController: AnalysisController;
  let analysisService : AnalysisService;
  let app : INestApplication

  beforeEach(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({

      controllers : [AnalysisController],
      providers : [
        AnalysisService,
        AuthService,
        {
          provide: 'StudentModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
        {
          provide: 'StaffModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
        {
          provide: 'AttendanceModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your AttendanceModel
        },
        {
          provide: 'AdminModel', // Use the token you use in your StudentService
          useValue: {}, // Provide a mock or instance of your StudentModel
        },
      ],

    }).compile()

    analysisService = await moduleRef.get<AnalysisService>(AnalysisService)
    analysisController = await moduleRef.get<AnalysisController>(AnalysisController)
  });


  describe('1', () => {
    it('check analysis1 is correct', async () => {
      const mockAnalysis : Analysis1Dto[] = [{
        totalStudents: 1,
        year: 2020,
        branches: {
          CE: 1,
          EC: 0,
          ME: 0
        }
      }]
      jest.spyOn(analysisService, 'analysis1').mockResolvedValue(mockAnalysis)
      expect(await analysisController.getStudentByYear()).toBe(mockAnalysis)
    })
  })

  describe('2', () => {
    it('check analysis2 is correct', async () => {
      const mockAnalysis : Analysis2Dto[] = [{
        date : new Date('2021-06-20'),
        studentId : '6533635e9144267850a79b38'
      }]
      const analysisInput : Analysis2BodyDto = {
        batch: 2020,
        branch: 'CE',
        semester: 1,
        date: new Date('2021-06-20')
      } 
      jest.spyOn(analysisService, 'analysis2').mockResolvedValue(mockAnalysis)
      expect(await analysisController.getAbsentStudent(analysisInput)).toBe(mockAnalysis)
    })
  })

  describe('3', () => {
    it('check analysis3 is correct', async () => {
      const mockAnalysis : Analysis3Dto[] = [{
        date : new Date('2021-06-20'),
        userId : '653365527f2450effb99f630',
        attendanceData : [{
                name: "Kevin",
                email: "kevin@example.com",
                currentSem: 1,
                password: "$2b$08$6L1bPUT13nHKI4TvV7w1Fewr1hD0Zqzh5qTvphwM075zEjPpS7Jqq",
                phoneNumber: "8864000809",
                batch: 2020,
                department: "CE",
                attendance: 217,
                tokens: []
          }
        ]
      }]
      const analysisInput : Analysis3BodyDto = {
        batch: 2020,
        branch: 'CE',
        semester: 1,
        date: new Date('2021-06-20')
      }
      jest.spyOn(analysisService, 'analysis3').mockResolvedValue(mockAnalysis)
      expect(await analysisController.studentWithLessAttendance(analysisInput)).toBe(mockAnalysis)
    })
  })

  describe('4', () => {
    it('check analysis4 is correct', async () => {
      const mockAnalysis : Analysis4Dto[] = [{
        totalStudents: 29,
        totalStudentsIntake: 0,
        availableIntake: 6,
        branches: {
            CE: {
                totalStudents: 9,
                totalStudentsIntake: [
                    120,
                    240,
                    60
                ],
                availableIntake: 5
            },
            EC: {
                totalStudents: 8,
                totalStudentsIntake: [
                    120,
                    240,
                    60
                ],
                availableIntake: 0
            },
            ME: {
                totalStudents: 12,
                totalStudentsIntake: [
                    240,
                    120,
                    60
                ],
                availableIntake: 1
            }
        }
    }
      ]
      const analysisInput : Analysis4BodyDto = {
        batch: 2020,
        branch: 'CE'
      }
      jest.spyOn(analysisService, 'analysis4').mockResolvedValue(mockAnalysis)
      expect(await analysisController.studentIntakeAnalysis(analysisInput)).toBe(mockAnalysis)
    })
  })
  })

