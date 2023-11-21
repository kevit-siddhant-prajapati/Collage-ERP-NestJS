import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { Analysis1Dto } from './dto/analysis1.dto';
import { Analysis2Dto } from './dto/analysis2.dto';
import { Analysis3Dto } from './dto/analysis3.dto';
import { Analysis4Dto } from './dto/analysis4.dto';
import { Analysis4BodyDto } from './dto/analysis4-body.dto';
import { Analysis2BodyDto } from './dto/analysis2-body.dto';
import { Analysis3BodyDto } from './dto/analysis3-body.dto';

const mockStudentModel = {
  aggregate : jest.fn()
};

const mockAttendanceModel = {
  aggregate : jest.fn()
}


describe('AnalysisService', () => {
  let analysisService: AnalysisService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        {
          provide: 'StudentModel',
          useValue: mockStudentModel,
        },
        {
          provide: 'AttendanceModel',
          useValue: mockAttendanceModel,
        },
      ],
    }).compile();

    analysisService = moduleRef.get<AnalysisService>(AnalysisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('analysis1', () => {
    it('check analysis1 is correct or not', async () => {
      const mockAnalysis : Analysis1Dto[] = [
        {
          totalStudents: 1,
          year: 2020,
          branches: {
            CE: 1,
            EC: 0,
            ME: 0
          }
        }
      ]
      mockStudentModel.aggregate.mockResolvedValue(mockAnalysis)
      const result = await analysisService.analysis1()
      expect(result).toBe(mockAnalysis)
    })
  })

  describe('analysis2', () => {
    it('check analysis2 is correct or not', async () => {
      const mockAnalysis : Analysis2Dto[] = [
        {
          date : new Date('2021-06-20'),
          studentId : '6533635e9144267850a79b38'
        }
      ]
      const analysisBody : Analysis2BodyDto = {
        batch: 2020,
        branch: 'EC',
        semester: 1,
        date: new Date('2021-06-20')
      }
      mockAttendanceModel.aggregate.mockResolvedValue(mockAnalysis)
      const result = await analysisService.analysis2(analysisBody)
      expect(result).toBe(mockAnalysis)
    })
  })

  describe('analysis3', () => {
    it('check analysis3 is correct or not', async () => {
      const mockAnalysis : Analysis3Dto[] = [
        {
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
        }
      ]
      const analysisBody : Analysis3BodyDto = {
        batch: 2020,
        branch: 'CE',
        semester: 1,
        date: new Date('2021-06-20')
      }
      mockAttendanceModel.aggregate.mockResolvedValue(mockAnalysis)
      const result = await analysisService.analysis3(analysisBody)
      expect(result).toBe(mockAnalysis)
    })
  })

  describe('analysis4', () => {
    it('check analysis4 is correct or not', async () => {
      const mockAnalysis : Analysis4Dto[] = [
        {
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
      const analysisBody : Analysis4BodyDto = {
        batch: 2020,
        branch: 'CE'
      }
      mockAttendanceModel.aggregate.mockResolvedValue(mockAnalysis)
      const result = await analysisService.analysis4(analysisBody)
      expect(result).toBe(mockAnalysis)
    })
  })

});
