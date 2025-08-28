import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('SACOLA API')
    .setDescription('API documentation for SACOLA Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Global validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true, 
    exceptionFactory: (validationErrors = []) => {
      const messages = validationErrors
        .flatMap((e: any) => Object.values(e.constraints || {}))
        .filter(Boolean);
      return new BadRequestException(messages.length ? messages : 'Validation failed');
    },
  }));

  // Global response transform and exception handling
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS configuration
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
