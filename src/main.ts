import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from '../logger.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('REST API 예제')
    .setDescription('nest.js와 prisma를 조합한 간단한 REST API')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('user')
    .addTag('post')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'token',
        name: 'JWT',
        description: 'JWT를 입력하세요.',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('nest-prisma', app, document);

  app.use(logger);
  await app.listen(3000);
}
bootstrap();
