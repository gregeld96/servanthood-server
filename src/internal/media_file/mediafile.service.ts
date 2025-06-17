import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { File as MulterFile } from 'multer';
import { PrismaService } from 'src/shared/libs/prisma/prisma.service';

@Injectable()
export class MediaFileService {
    private minioClient: Client;

    constructor(
        private prismaService: PrismaService,
    ) {
        this.minioClient = new Client({
            endPoint: process.env.MINIO_URL_HOST || '',
            port: Number(process.env.MINIO_PORT || 9000),
            useSSL: process.env.NODE_ENV === 'dev' ? false : true,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });
    }

    async saveFile(bucketName: string, file: MulterFile, objectName: string): Promise<string> {
        const exists = await this.minioClient.bucketExists(bucketName)

        if (!exists) {
            await this.minioClient.makeBucket(bucketName, 'us-east-1');

            // Set bucket policy to public
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };

            await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        } else {
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${bucketName}/*`],
                    },
                ],
            };

            await this.minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
        }

        await this.minioClient.putObject(bucketName, objectName, file.buffer);

        const fileUrl = `${process.env.MINIO_COMPLETE_URL_HOST}/${bucketName}/${objectName}`;

        await this.prismaService.mediaFile.create({
            data: {
                name: objectName,
                category: bucketName,
                locationFile: fileUrl,
                mimetype: file.mimetype,
                size: file.size.toString(),
            }
        })

        return fileUrl;
    }
}