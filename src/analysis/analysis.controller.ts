import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { Analysis1Dto } from './dto/analysis1.dto';
import { Analysis2Dto } from './dto/analysis2.dto';
import { Analysis3Dto } from './dto/analysis3.dto';
import { Analysis4Dto } from './dto/analysis4.dto';

@Controller('analysis')
export class AnalysisController {
    constructor(
        private analysisService: AnalysisService
    ){}

    /**
     * @description : Analytics which gives an idea about the total number of students in a particular year and the total number of students in a particular branch for that year.
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @returns {*} 
     */
    @Get('1')
    async getStudentByYear() : Promise<Analysis1Dto[]>{
        return this.analysisService.analysis1()
    }

    /**
     * @description : Need a list of absent students of the specific day 
                      Input parameters
                      batch (year) (Optional)
                      branch (Optional)
                      semester (Optional)
                      specific date (YYYY-MM-DD)
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} input
     * @returns {*} 
     */
    @Post('2')
    async getAbsentStudent(
        @Body() input
    ): Promise<Analysis2Dto[]>{
        return this.analysisService.analysis2(input)
    }

    /**
     * @description : Need a list of students whose attendance is less than 75%
                      Input parameters: 
                      batch (year) (Optional)
                      branch (Optional)
                      semester (Optional)
                      specific date (YYYY-MM-DD)
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} input
     * @returns {*} 
     */
    @Post('3')
    async studentWithLessAttendance(
        @Body() input
    ) : Promise<Analysis3Dto[]>{
        return this.analysisService.analysis3(input)
    }

    /**
     * @description : Get a list of vacant seat’s year wise
                      Input parameters:
                      batch (year) (Optional)
                      branch (Optional)
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @param {*} input
     * @returns {*} 
     */
    @Post('4')
    async studentIntakeAnalysis(
        @Body() input
    ): Promise<Analysis4Dto[]>{
        return this.analysisService.analysis4(input)
    }
}
