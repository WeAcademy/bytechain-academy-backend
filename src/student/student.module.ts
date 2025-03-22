/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from './services/student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/student.entity';
import { CreateStudentService } from './services/create.student.service';

@Module({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentService, CreateStudentService],
  controllers: [StudentController],
  exports: [StudentService,CreateStudentService],
})
export class StudentModule {}
