import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres', // Change this to your DB type
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'nestjs-blog',
    autoLoadEntities: true,
    synchronize: true, // ⚠️ Set false in production
  }),StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
