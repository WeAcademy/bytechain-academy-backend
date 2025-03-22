/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Tutor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('simple-array')
  courses: string[];

  @Column()
  experience: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
