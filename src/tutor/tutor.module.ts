import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorService } from './services/tutor.service';
import { TutorController } from './tutor.controller';
import { Tutor } from './entities/tutor.entity';
import { PasswordHashingService } from './services/password.hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor])],
  controllers: [TutorController],
  providers: [TutorService, PasswordHashingService],
  exports: [TutorService],
})
export class TutorModule {}
