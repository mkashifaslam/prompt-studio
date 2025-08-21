import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid') id!: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  name!: string;

  @Column({ type: 'text' }) content!: string; // prompt body with {{variables}}

  @Column({ type: 'jsonb', default: [] }) variables!: {
    key: string;
    description?: string;
    required?: boolean;
  }[];

  @Column({ type: 'jsonb', default: [] }) metadata!: Record<string, any>;

  @Column({ default: 1 }) version!: number;

  @Column({ default: true }) active!: boolean;

  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
