import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, ResponseInterceptor, ShutdownService } from 'libs/common';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  app.enableShutdownHooks();

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const corsOptions = {
    origin: '*', // Example: 'http://localhost:3000'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  // Enable CORS with the retrieved options
  app.enableCors(corsOptions);

  // 👇 Enable URI versioning
  app.enableVersioning({
    type: VersioningType.URI, // adds /v1, /v2 automatically
    defaultVersion: '1',
  });
  
  // 🚫 disable ETag
  app.getHttpAdapter().getInstance().disable('etag');

  app.setGlobalPrefix('admin');

  const shutdownService = app.get(ShutdownService);

  // 👇 handle uncaught errors
  process.on('uncaughtException', async (err) => {
    console.error('[Fatal] Uncaught Exception:', err);
    await shutdownService.onApplicationShutdown('uncaughtException');
    process.exit(1);
  });

  process.on('unhandledRejection', async (reason) => {
    console.error('[Fatal] Unhandled Rejection:', reason);
    await shutdownService.onApplicationShutdown('unhandledRejection');
    process.exit(1);
  });

  await app.listen(Number(process.env.ADMIN_PORT) ?? 5002);
}
bootstrap();
