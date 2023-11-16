import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose, { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '../src/database/database.service';
import { studentStub } from './stubs/students.stub';
import { studentAttendanceStub } from './stubs/student-attendance.stub';
import { staffAttendanceStub } from './stubs/staff-attendance.stub';
import { staffStub } from './stubs/staff.stub';
import { adminStub } from './stubs/admin.stub';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbConnection : Connection;

  beforeAll(async () => {
  })

  afterAll(async () => {
    // Closing the DB connection allows Jest to exit successfully.
    await dbConnection.collection('students').deleteMany({});
    await dbConnection.collection('staffs').deleteMany({});
    await dbConnection.collection('admins').deleteMany({});
    await dbConnection.collection('attendances').deleteMany({});
    await dbConnection.collection('students').insertOne(studentStub())
    await dbConnection.collection('attendances').insertOne(studentAttendanceStub())
    await dbConnection.collection('staffs').insertOne(staffStub())
    await dbConnection.collection('attendances').insertOne(staffAttendanceStub())
    await dbConnection.collection('admins').insertOne(adminStub())
    await app.close()
  })

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: './.test.env',
          isGlobal : true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();

  });


  describe('fillAttendanceStudent', () => {

        it('Should create attendance for student', async () => {
            return request(app.getHttpServer())
            .post('/attendance/fill')
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                date : "2020-07-18",
                attendance : [
                    studentStub()._id,
                ],
                role : "Student"
            })
            .expect(201)
        })
        
        it('Should not create attendance of nonexistance student', async () => {
            await request(app.getHttpServer())
            .post('/attendance/fill')
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                date : "2020-07-18",
                attendance : [
                    studentStub()._id,
                ],
                role : "Student"
            })
            .expect(201)
        })
        
        it('Unauthorize user Should not fill attendance of student', async () => {
            await request(app.getHttpServer())
            .post('/attendance/fill')
            .send({
                date : "2020-07-18",
                attendance : [
                    studentStub()._id,
                ],
                role : "Student"
            })
            .expect(401)
        })

    })

    describe('getAttendanceStudent', () => {
        it('Authorize User show data of students', async () => {
            await request(app.getHttpServer())
            .get('/attendance/get')
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                roleOfUser : "Student"
            })
            .expect(200)
        })
        
        it('Unauthorize User should not show data of students', async () => {
            await request(app.getHttpServer())
            .get('/attendance/get')
            .send({
                roleOfUser : "Student"
            })
            .expect(401)
        })

    })
    

    describe('updateAttendanceStudent', () => {
        it('Should update valid student fields', async () => {
            await request(app.getHttpServer())
            .patch(`/attendance/update/${studentAttendanceStub()._id}`)
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                date : "2020-08-22",
            }).expect(200)
        })
        
        
        it('Unauthorize User Should not update student fields', async () => {
            await request(app.getHttpServer())
            .patch(`/attendance/update/${studentAttendanceStub()._id}`)
            .send({
                date : "2020-08-22",
            }).expect(401)
        })
    })


    describe('fillAttendanceStaff', () => {
        it('Should create attendance for staff', async () => {
            await request(app.getHttpServer())
            .post('/attendance/fill')
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                date : "2020-07-18",
                attendance : [
                    staffStub()._id,
                ],
                roleOfUser : "Staff"
            })
            .expect(200)
            await app.close()
        })
        
        it('Unauthorize user Should not fill attendance of student', async () => {
            await request(app.getHttpServer())
            .post('/attendance/fill')
            .send({
                date : "2020-07-18",
                attendance : [
                    staffStub()._id,
                ],
                roleOfUser : "Staff"
            })
            .expect(401)
        })
    })

    describe('getAttendanceStaff', () => {
        it('Authorize User show data of staffs', async () => {
            await request(app.getHttpServer())
            .get('/attendance/get')
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                roleOfUser : "Staff"
            })
            .expect(200)
        })
        
        it('Unauthorize User should not show data of staffs', async () => {
            await request(app.getHttpServer())
            .get('/attendance/get')
            .send({
                roleOfUser : "Staff"
            })
            .expect(401)
        })
        
    })
    
    describe('manageAttendance', () => {
        it('Unauthorize User Should not update invalid staff fields', async () => {
            await request(app.getHttpServer())
            .patch(`/attendance/update/${staffAttendanceStub()._id}`)
            .send({
                date : "2020-08-22",
            }).expect(401)
        })

        it('Update valide staff for update', async () => {
            const result = await request(app.getHttpServer())
            .patch(`/attendance/update/${staffAttendanceStub()._id}`)
            .set('Authorization', `Bearer ${adminStub().tokens[0].token}`)
            .send({
                date : "2021-06-18",
            }).expect(200)
            console.log(result)
        })
    })
    
  })    
  
  



  







