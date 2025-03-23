import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TutorModule } from './tutor/tutor.module';



@Module({
  imports: [StudentModule, TutorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
