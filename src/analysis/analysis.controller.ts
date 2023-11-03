import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
    constructor(
        private analysisService: AnalysisService
    ){}

    @Get('1')
    async getStudentByYear(){
        return this.analysisService.analysis1()
    }

    @Post('2')
    async getAbsentStudent(
        @Body() input
    ){
        return this.analysisService.analysis2(input)
    }

    @Post('3')
    async studentWithLessAttendance(
        @Body() input
    ) {
        return this.analysisService.analysis3(input)
    }

    @Post('4')
    async studentIntakeAnalysis(
        @Body() input
    ){
        return this.analysisService.analysis4(input)
    }
}
