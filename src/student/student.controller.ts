import { Controller, Post, Body } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from '../student/entities/student.entity';

@Controller('/api/v1/student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    return this.studentService.createStudent(createStudentDto);
  }
}
