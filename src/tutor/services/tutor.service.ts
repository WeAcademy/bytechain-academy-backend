import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from '../entities/tutor.entity';
import { CreateTutorDto } from '../dto/create-tutor.dto';
import { UpdateTutorDto } from '../dto/update-tutor.dto';
import { PasswordHashingService } from './password.hashing.service';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    private passwordHashingService: PasswordHashingService,
  ) {}

  findAll(): Promise<Tutor[]> {
    return this.tutorRepository.find();
  }

  findOne(id: string): Promise<Tutor> {
    return this.tutorRepository.findOne({ where: { id } });
  }

  async create(createTutorDto: CreateTutorDto): Promise<Tutor> {
    const hashedPassword = await this.passwordHashingService.hashPassword(
      createTutorDto.password,
    );
    const tutor = this.tutorRepository.create({
      ...createTutorDto,
      password: hashedPassword,
    });
    return this.tutorRepository.save(tutor);
  }

  async update(id: string, updateTutorDto: UpdateTutorDto): Promise<Tutor> {
    const tutor = await this.tutorRepository.findOne({ where: { id } });
    if (!tutor) throw new Error('Tutor not found');

    if (updateTutorDto.password) {
      updateTutorDto.password = await this.passwordHashingService.hashPassword(
        updateTutorDto.password,
      );
    }

    Object.assign(tutor, updateTutorDto);
    return this.tutorRepository.save(tutor);
  }

  async delete(id: string): Promise<void> {
    await this.tutorRepository.delete(id);
  }
}
