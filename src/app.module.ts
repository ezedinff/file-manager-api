import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileManagerModule } from './features/file-manager/file-manager.module';
import entities from './entities';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'file_manager',
      entities: entities,
      synchronize: true,
    }),
    FileManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
