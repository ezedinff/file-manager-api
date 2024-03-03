import { Module } from '@nestjs/common';
import { FileManagerController } from './file-manager.controller';
import { FileManagerService } from './file-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FolderEntity } from './entities/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity, FolderEntity])],
  controllers: [FileManagerController],
  providers: [FileManagerService],
  exports: [FileManagerService, TypeOrmModule],
})
export class FileManagerModule {}
