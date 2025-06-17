import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './middlewares/response_interceptor';
import { GlobalExceptionFilter } from './middlewares/exception_interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  const corsOptions = {
    origin: '*', // Example: 'http://localhost:3000'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  // Enable CORS with the retrieved options
  app.enableCors(corsOptions);

  const config = app.get(ConfigService);
  await app.listen(config.get('PORT') ?? 3000);
}
bootstrap();
