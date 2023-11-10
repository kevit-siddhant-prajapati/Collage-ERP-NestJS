import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Attendance } from '../attendance/schemas/attendance.schema';
import { Student } from '../student/schemas/student.schema';
import { Analysis1Dto } from './dto/analysis1.dto';
import { Analysis2Dto } from './dto/analysis2.dto';
import { Analysis3Dto } from './dto/analysis3.dto';
import { Analysis4Dto } from './dto/analysis4.dto';

@Injectable()
export class AnalysisService {
    constructor(
        @InjectModel(Student.name)
        private StudentModel : mongoose.Model<Student>,
        @InjectModel(Attendance.name)
        private AttendanceModel : mongoose.Model<Attendance>
    ){}

    /**
     * @description : it will provide data as given is analysis1
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*} 
     */
    async analysis1() : Promise<Analysis1Dto[]>{
        try {
            const student = await this.StudentModel.aggregate([
                // this pipe group the data according to batch the after year
                //totalStudent count the number of student according to year
                {
                  $group: {
                    _id: {
                      year: "$batch",
                      department: "$department"
                    },
                    totalStudents: { $sum: 1 }
                  }
                },
                //grouping the student further department
                // here k - nameOfDepartment
                // v- total numberOfStudent per department
                {
                  $group: {
                    _id: "$_id.year",
                    totalStudents: { $sum: "$totalStudents" },
                    branches: {
                      $push: {
                        k: "$_id.department",
                        v: "$totalStudents"
                      }
                    }
                  }
                },
                //print only year , totalStudent per year and array of department
                {
                  $project: {
                    _id: 0,
                    year: "$_id",
                    totalStudents: 1,
                    branches: { $arrayToObject: "$branches" }
                  }
                }
            ])
        
            if(!student) {
                //studentsLogger.error('Data for analysis 1 not get')
                throw new NotFoundException("Data not found")
            }
            return student
        } catch (e){
            //studentsLogger.error('enable to get Analysis 1 details')
            throw new InternalServerErrorException(`Internal server error: ${e}`)
        }
       }


       /**
        * @description : give data according to analysis2
        * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
        * @param {*} inputData
        * @returns {*} 
        */
       async analysis2(inputData) : Promise<Analysis2Dto[]>{
        const date = inputData.date
        const newDate = new Date(date)
        //console.log(newDate)
        const attendance = await this.AttendanceModel.aggregate([
            //$match : pipe is select only data that is match with date
            {
                $match : {
                    'date' : newDate,
                    'status' : false
                }
            },
            //$project : only show userId as studentId and date of attendance
            {
                $project : {
                    studentId : "$userId",
                    date : 1,
                    _id : 0
                }
            }
        ])
        if(!attendance){
            throw new NotFoundException("Attendance data not found")
        }
        return attendance
       }


       /**
        * @description : get request from postman give analysis3
        * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
        * @param {*} inputData
        * @returns {*} 
        */
       async analysis3(inputData) : Promise<Analysis3Dto[]>{
        try {
            const specificDate = new Date(inputData.date); // Replace 'YYYY-MM-DD' with your specific date
            const batchSize = inputData.batch || 2020; // Replace with the desired batch year
            const branch = inputData.department || 'CE'; // Replace with the desired branch
            const semester = inputData.currentSem || 1; // Replace with the desired semester
            
            const result = await this.AttendanceModel.aggregate([
            /**$lookup : this pipe used for getting data from student collection
             * it map userId of attendence with _id of student
             */
            {
                $lookup: {
                    from: 'students',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'attendanceData'
                  }
            },
            /**
             * $match : this pipe is match data that come as request to data of different field of document
            */
             {
                $match : { 
                     date : specificDate,
                    'attendanceData.batch': batchSize,
                    'attendanceData.department' : branch,
                    'attendanceData.currentSem' : semester
                 },
                },
             /**
              * $addFields : add percentantageAttendance field that cointain the percentage attendance of student
             */
            {
                $addFields: {
                    percentageAttendance: {
                      $cond: {
                        if: { $gt: [{ $size: '$attendanceData' }, 0] },
                        then: {
                          $multiply: [
                            100,
                            {
                              $divide: [
                                {
                                  $sum: {
                                    $map: {
                                      input: '$attendanceData',
                                      as: 'attendanceItem',
                                      in: '$$attendanceItem.attendance'
                                    }
                                  }
                                },
                                { $multiply: [{$size: '$attendanceData'}, 300] }
                              ]
                            }
                          ]
                        },
                        else: 0  // or any default value when the array is empty
                      }
                    }
                  }
            },
            /**
             * $match : select only those attendance which have attendance more than 75%
            */
            {
                $match: {
                    percentageAttendance : {
                      $lt : 75
                    }
                 }
            },
            /**
             * $project : only show below given fields
            */
            {
                $project: {
                    _id : 0,
                  status : 0,
                  roleOfUser : 0,
                  __v : 0,
                }
            }
            ]);

            console.log(result);

            if(!result){
                //res.status(404).send('student attendance data not found')
                throw new NotFoundException('student attendance data not found')
            }
            return result
        } catch(e){
            //studentsLogger.error('enable to get Analysis 2 details')
            throw new InternalServerErrorException('Internal Server Error!')
        }
       }

      /**
       * @description : give the data according to analysis 4
       * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
       * @param {*} inputData
       * @returns {*} 
       */
      async analysis4(inputData) : Promise<Analysis4Dto[]>{
        try {
            const result = await this.AttendanceModel.aggregate([
                /**
                 * $match : select date of Student Attendance , where date and status are optional
                */
                {
                  $match: {
                    //date: { $gte: new Date('2021-06-18T00:00:00.000Z') }, // Add your date filter if needed
                    roleOfUser: 'Student',
                    //status: false // Assuming you want to consider only false status
                  }
                },
                /**
                 * $lookup : get data from student collection
                 * here i set userId of attendence with _id of student  
                */
                {
                  $lookup: {
                    from: 'students',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'student'
                  }
                },
                /**
                 * $unwind : to access all field of student array
                */
                {
                  $unwind: '$student'
                },
                /**
                 * $lookup : use for getting data of batches collection
                 * it sets batch of student collection with year of batches collection
                 * it use to access data of totalStudentsIntake from batches
                */
                {
                  $lookup: {
                    from: 'batches',
                    localField: 'student.batch',
                    foreignField: 'year',
                    as: 'batch'
                  }
                },
                /**
                 * $unwind : to access data of batches collection
                */
                {
                  $unwind: '$batch'
                },
                /**
                 * $group : grouping data with respect to department of student 
                */
                {
                  $group: {
                    _id: '$student.department',
                    totalStudents: { $sum: 1 },
                    totalStudentsIntake: { $first: '$batch.branches.totalStudentsIntake' },
                    availableIntake: {
                      $sum: {
                        $cond: [
                          { $eq: ['$status', false] },
                          1,
                          0
                        ]
                      }
                    }
                  }
                },
                /**
                 * $group : set the count of totalStudents and available intake
                */
                {
                  $group: {
                    _id: null,
                    totalStudents: { $sum: '$totalStudents' },
                    totalStudentsIntake: { $sum: '$totalStudentsIntake' },
                    availableIntake: { $sum: '$availableIntake' },
                    branches: {
                      $push: {
                        k: '$_id',
                        v: {
                          totalStudents: '$totalStudents',
                          totalStudentsIntake: '$totalStudentsIntake',
                          availableIntake: '$availableIntake'
                        }
                      }
                    }
                  }
                },
                // $project : it is use to show data of only required fields
                {
                  $project: {
                    _id: 0,
                    batch: 2020, // Assuming you want to consider a specific batch (adjust as needed)
                    totalStudents: 1,
                    totalStudentsIntake: 1,
                    availableIntake: 1,
                    branches: { $arrayToObject: '$branches' }
                  }
                }
              ]);
              
              console.log(result);
            return result
        } catch(e){
            //res.status(500).send(`Internal Server Error : ${e}`)
            throw new InternalServerErrorException(`Internal Server Error : ${e}`)
        }
       }
       }
    

