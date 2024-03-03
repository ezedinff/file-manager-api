import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileManagerService } from './file-manager.service';
import { FileFilterDto } from './dtos/file-filter.dto';
import { DownloadFileDto } from './dtos/download-file.dto';
import { Response } from 'express';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Body('folder') folder: string) {
    const savedFile = await this.fileManagerService.saveFileData(file, folder);
    return {
      message: 'File uploaded successfully',
      fileDetails: savedFile,
    };
  }

  @Get('files')
  async getFiles(@Query() filter: FileFilterDto) {
    const files = await this.fileManagerService.getAllFiles(filter);
    return files;
  }

  @Get('download')
  async downloadFile(@Query() filter: DownloadFileDto, @Res() res: Response) {
    const file = await this.fileManagerService.getFile(filter);
    res.sendFile(file.path, (err) => {
      if (err) {
        console.log(err);
        throw new NotFoundException('File not found on server');
      }
    });
  }
}
