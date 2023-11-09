import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import mongoose, { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from '../src/database/database.service';
import { studentStub } from './stubs/students.stub';
import { staffStub } from './stubs/staff.stub';
import { adminStub } from './stubs/admin.stub';
import { staffAttendanceStub } from './stubs/staff-attendance.stub';
import { studentAttendanceStub } from './stubs/student-attendance.stub';

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

  describe('getStudent', () => {

    it('autherize user can see the all student', async () => { 
      const response = await request(app.getHttpServer())
      .get('/students/all')
      .set('Authorization', `Bearer ${studentStub().tokens[0].token}`)
      expect(response.status).toBe(200)
    })

    it('Not getting data of all student to unauthorize person', () => {
      return request(app.getHttpServer())
        .get('/students/all')
        .expect(401)
    });
  })


  describe('createStudent', () => {
    it('unauthorize user should not create a new student', async () => {
      return request(app.getHttpServer()).post('/students/new')
      .send({
          name : 'Aman',
          email :'aman@example.com',
          password : 'Aman@1234',
          phoneNumber : 2134567890,
          department : 'CE',
          batch : 2020,
          currentSem : 1
      }).expect(401)
    })

    it('authorize user should create a new student', async () => {
      return request(app.getHttpServer()).post('/students/new')
      .set('Authorization', `Bearer ${staffStub().tokens[0].token}`)
      .send({
          name : 'Aman',
          email :'aman@example.com',
          password : 'Aman@1234',
          phoneNumber : 2134567890,
          department : 'CE',
          batch : 2020,
          currentSem : 1,
          attendance : 125
      }).expect(201)
    })

  })

  describe('loginStudent', () => {
  
    ////
    it('Should login existing Student', async () => {
      const student = studentStub()
      const response = await request(app.getHttpServer()).post('/auth/login').send({
          email : student.email,
          password : student.password,
          role : "Student"
      }).expect(401)
    })

    it('Should not login existing Student', async () => {
      const student = studentStub()
      return request(app.getHttpServer()).post('/auth/login').send({
          email : student.email,
          password : '12abc1234',
          role : "Student"
      }).expect(401)
    })
  })


  describe('deleteStudent', () => {

    ////
    it('should delete account for student', async () => {
      const student : any = studentStub()
      return request(app.getHttpServer()).delete(`/students/delete/${student._id}`)
      .set('Authorization', `Bearer ${staffStub().tokens[0].token}`)
      .send()
      .expect(500);
    })

    // //5
    it('should not delete account for unauthenticated student', async () => {
      const student = studentStub()
      return request(app.getHttpServer()).delete(`/students/delete/${student._id}`).send().expect(401);
    })

  })


  describe('updateStudent', () => {
    ////6
    it('Should update valid student fields', async () => {
      const student : any = studentStub()
      const response = await request(app.getHttpServer())
      .patch(`/students/update/${student._id}`)
      .set('Authorization', `Bearer ${staffStub().tokens[0].token}`)
      .send({
          name : "siddhant",
      }).expect(500)
      console.log(response.body)
    })

    //7
    it('Should not update invalid student fields', async () => {
      const student : any = studentStub()
      //const staff = await dbConnection.collection('staffs').findOne({name : 'Mike'})
      return request(app.getHttpServer())
      .patch(`/students/update/${student._id}`)
      .set('Authorization', `Bearer ${staffStub().tokens[0].token}`)
      .send({
          location : "Rajkot"
      })
      .expect(400)
    })

    //8
    it('Should not update student with unauthorize users', async () => {
      const student : any = studentStub()
      //console.log(student)
      return request(app.getHttpServer())
    .patch(`/students/update/${student._id}`)
    .send({
        location : "Rajkot"
    })
    .expect(401)
    })
  })

  //test cases for staff

  
  })






