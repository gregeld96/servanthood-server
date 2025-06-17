import { Controller, Post, UseInterceptors, Body, UploadedFile, HttpCode } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFileService } from './mediafile.service';
import { File as MulterFile } from 'multer'; 
import { v7 } from 'uuid';


@Controller('/internal/media-file')
export class MediaFileController {
    private mediaFileService: MediaFileService;

    constructor(mediaFileService: MediaFileService) {
        this.mediaFileService = mediaFileService;
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    public async uploadFile(
        @UploadedFile() file: MulterFile, 
        @Body() body: any,
    ) {
        return await this.mediaFileService.saveFile(body.category, file, `${v7()}-${file.originalname.replace(/ /g, '-')}`);
    }
}