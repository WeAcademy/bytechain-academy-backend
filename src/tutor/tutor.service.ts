/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
  ) {}

  async create(createTutorDto: CreateTutorDto): Promise<Tutor> {
    // Check if email already exists
    const existingTutor = await this.tutorRepository.findOne({
      where: { email: createTutorDto.email },
    });

    if (existingTutor) {
      throw new ConflictException('Email already exists');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const tutor = this.tutorRepository.create(createTutorDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return await this.tutorRepository.save(tutor);
  }

  async findAll(): Promise<Tutor[]> {
    return await this.tutorRepository.find();
  }

  async findOne(id: string): Promise<Tutor> {
    const tutor = await this.tutorRepository.findOne({ where: { id } });
    if (!tutor) {
      throw new NotFoundException(`Tutor with ID "${id}" not found`);
    }
    return tutor;
  }

  async update(id: string, updateTutorDto: UpdateTutorDto): Promise<Tutor> {
    const tutor = await this.findOne(id);
    Object.assign(tutor, updateTutorDto);
    return await this.tutorRepository.save(tutor);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tutorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tutor with ID "${id}" not found`);
    }
  }
}
