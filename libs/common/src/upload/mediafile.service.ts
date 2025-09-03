import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'libs/database';
import { Client } from 'minio';
import { File as MulterFile } from 'multer';

@Injectable()
export class MediaFileService {
    private minioClient: Client;

    constructor(
        private prisma: PrismaService,
        private config: ConfigService
    ) {
        this.minioClient = new Client({
            endPoint: this.config.get<string>('MINIO_URL_HOST', 'localhost'),
            port: Number(this.config.get<string>('MINIO_PORT') || 9000),
            useSSL: this.config.get<string>('NODE_ENV') !== 'dev',
            accessKey: this.config.get<string>('MINIO_ACCESS_KEY'),
            secretKey: this.config.get<string>('MINIO_SECRET_KEY'),
        });
    }

    async saveFile(payload: { bucketName: string, file: MulterFile, objectName: string, userId: number, isInternal?: boolean, }): Promise<string> {
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
                isInternal: payload?.isInternal || false,
            }
        })

        return fileUrl;
    }
}