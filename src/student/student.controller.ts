import { Controller, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from '../student/entities/student.entity';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/roles/roles.enum';

@Controller('/api/v1/student')
@Roles(UserRole.STUDENT) 
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async createStudent(
    @Body() createStudentDto: CreateStudentDto,
  ): Promise<Student> {
    return this.studentService.createStudent(createStudentDto);
  }
}
