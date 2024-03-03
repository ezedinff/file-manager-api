import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { FileEntity } from './file.entity';

@Entity('folders')
export class FolderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  @Column()
  path: string;

  @OneToMany(() => FileEntity, (file) => file.folder)
  files: FileEntity[];
}
