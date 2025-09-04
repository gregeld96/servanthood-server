import { Controller, Post, UseInterceptors, Body, UploadedFile, HttpCode, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaFileService } from './mediafile.service';
import { File as MulterFile } from 'multer'; 
import { v7 } from 'uuid';

@Controller('/media-file')
export class MediaFileController {
    constructor(private readonly mediaFileService: MediaFileService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    public async uploadFile(
        @UploadedFile() file: MulterFile, 
        @Body() body: any,
        @Req() req: any,
    ) {
        return await this.mediaFileService.saveFile({ 
            bucketName: body.category, 
            file: file, 
            objectName: `${v7()}-${file.originalname.replace(/ /g, '-')}`, 
            userId: req.user?.userId, 
            isInternal: body?.isInternal || false, 
        });
    }
}