import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { FolderEntity } from './entities/folder.entity';
import { Repository } from 'typeorm';
import { FileFilterDto } from './dtos/file-filter.dto';
import * as fs from 'fs';
import * as path from 'path';
import { DownloadFileDto } from './dtos/download-file.dto';

@Injectable()
export class FileManagerService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(FolderEntity)
    private readonly folderRepository: Repository<FolderEntity>,
  ) {}
  async saveFileData(file: any, folderName: string) {
    let targetFolder = await this.folderRepository.findOne({
      where: { name: folderName },
    });
    const uploadDirPath = path.join('uploads', folderName);
    if (!targetFolder) {
      targetFolder = this.folderRepository.create({
        name: folderName,
        path: uploadDirPath,
      });
      await this.folderRepository.save(targetFolder);
    }

    if (!fs.existsSync(uploadDirPath)) {
      fs.mkdirSync(uploadDirPath, { recursive: true });
    }

    const filePath = path.join(uploadDirPath, file.originalname);

    const newFile = this.fileRepository.create({
      name: file.originalname,
      path: filePath,
      folder: targetFolder,
    });
    await this.fileRepository.save(newFile);
    fs.writeFileSync(filePath, file.buffer);
    return newFile;
  }

  async saveFileToFolder(file: any, folder: FolderEntity) {
    const newFile = new FileEntity();
    newFile.name = file.originalname;
    newFile.path = file.path;
    newFile.folder = folder;
    return this.fileRepository.save(newFile);
  }

  async getAllFiles(filter: FileFilterDto) {
    const query = this.fileRepository
      .createQueryBuilder('files')
      .leftJoinAndSelect('files.folder', 'folder');

    if (filter.folder) {
      if (!filter.fileName) {
        query.where('folder.name = :folder', { folder: filter.folder });
      } else {
        query.andWhere('folder.name = :folder AND files.name = :fileName', {
          folder: filter.folder,
          fileName: filter.fileName,
        });
      }
    }
    if (filter.fileName && !filter.folder) {
      query.where('files.name = :fileName', { fileName: filter.fileName });
    }
    return query.getMany();
  }

  async getFile(filter: DownloadFileDto) {
    const query = this.fileRepository
      .createQueryBuilder('files')
      .leftJoinAndSelect('files.folder', 'folder')
      .where('files.name = :fileName', {
        fileName: filter.fileName,
      });

    if (filter.folder) {
      query.andWhere('folder.name = :folder', {
        folder: filter.folder,
      });
    }

    const file = await query.getOne();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    file.path = path.join(__dirname, '../../..', file.path);

    return file;
  }
}
