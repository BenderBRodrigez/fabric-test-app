import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(helmet());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  const options = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, options);
  const path = config.get('SWAGGER_PATH');
  SwaggerModule.setup(path, app, document);

  const port = config.get('PORT', '3000');
  await app.listen(port);
}

bootstrap();
