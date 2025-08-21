import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mcp_configs')
export class McpConfig {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ length: 160 }) name!: string;
  @Column({ type: 'jsonb' }) config!: any; // validated by zod
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}
