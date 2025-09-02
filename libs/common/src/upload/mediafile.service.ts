import { Injectable } from '@nestjs/common';
import { PrismaService } from 'libs/database';
import { Client } from 'minio';
import { File as MulterFile } from 'multer';

@Injectable()
export class MediaFileService {
    private minioClient: Client;

    constructor(
        private prisma: PrismaService,
    ) {
        this.minioClient = new Client({
            endPoint: process.env.MINIO_URL_HOST || '',
            port: Number(process.env.MINIO_PORT || 9000),
            useSSL: process.env.NODE_ENV === 'dev' ? false : true,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });
    }

    async saveFile(payload: { bucketName: string, file: MulterFile, objectName: string, userId: number }): Promise<string> {
        const exists = await this.minioClient.bucketExists(payload.bucketName)

        if (!exists) {
            await this.minioClient.makeBucket(payload.bucketName, 'us-east-1');

            // Set bucket policy to public
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${payload.bucketName}/*`],
                    },
                ],
            };

            await this.minioClient.setBucketPolicy(payload.bucketName, JSON.stringify(policy));
        } else {
            const policy = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { AWS: ['*'] },
                        Action: ['s3:GetObject'],
                        Resource: [`arn:aws:s3:::${payload.bucketName}/*`],
                    },
                ],
            };

            await this.minioClient.setBucketPolicy(payload.bucketName, JSON.stringify(policy));
        }

        await this.minioClient.putObject(payload.bucketName, payload.objectName, payload.file.buffer);

        const fileUrl = `${process.env.MINIO_COMPLETE_URL_HOST}/${payload.bucketName}/${payload.objectName}`;

        await this.prisma.mediaFile.create({
            data: {
                name: payload.objectName,
                category: payload.bucketName,
                locationFile: fileUrl,
                mimetype: payload.file.mimetype,
                size: payload.file.size.toString(),
                userId: payload.userId,
            }
        })

        return fileUrl;
    }
}