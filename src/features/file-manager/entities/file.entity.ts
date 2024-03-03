import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { FolderEntity } from './folder.entity';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @ManyToOne(() => FolderEntity, (folder) => folder.files)
  folder: FolderEntity;
}
