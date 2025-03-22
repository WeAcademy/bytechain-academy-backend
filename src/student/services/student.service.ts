// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Student } from './entities/student.entity';
// import { CreateStudentDto } from './dto/create-student.dto';

// @Injectable()
// export class StudentService {
//   constructor(
//     @InjectRepository(Student)
//     private readonly studentRepository: Repository<Student>,
//   ) {}

//   async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//     const student = this.studentRepository.create(createStudentDto);
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
//     return await this.studentRepository.save(student);
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { CreateStudentService } from './create.student.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly createStudentService: CreateStudentService,
  ) {}

  /**
   * Creates a new student
   * @param createStudentDto Student data to create
   * @returns The created student
   */
  public async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = await this.createStudentService.create(createStudentDto);
    
    //Return student without password & hashPassword method
    const { password, hashPassword, ...safeStudent } = student;
    return safeStudent as Student;
  }

  /**
   * Finds all students
   * @returns List of students
   */
  public async findAll(): Promise<Partial<Student>[]> {
    const students = await this.studentRepository.find();
    return students.map(({ password, hashPassword, ...safeStudent }) => safeStudent);
  }

  /**
   * Finds a student by ID
   * @param id Student ID
   * @returns The found student
   */
  public async findOneById(id: string): Promise<Partial<Student>> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    const { password, hashPassword, ...safeStudent } = student;
    return safeStudent;
  }

  /**
   * Updates a student
   * @param id Student ID
   * @param updateStudentDto Student update data
   * @returns The updated student
   */
  public async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Partial<Student>> {
    const student = await this.findOneById(id);

    if (updateStudentDto.password) {
      updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
    }

    Object.assign(student, updateStudentDto);
    const updatedStudent = await this.studentRepository.save(student);

    const { password, hashPassword, ...safeStudent } = updatedStudent;
    return safeStudent;
  }

  /**
   * Deletes a student
   * @param id Student ID
   */
  public async delete(id: string): Promise<void> {
    // Fetch full student entity
    const student = await this.studentRepository.findOne({ where: { id } });
  
    if (!student) {
      throw new NotFoundException('Student not found');
    }
  
    // Remove full entity (not Partial<Student>)
    await this.studentRepository.remove(student);
  }
}

