import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/helpers/error-handler';
import { winstonConfig } from './common/helpers/winston.logger';

async function start() {
  try {
    const PORT = process.env.PORT || 3003;
    const app = await NestFactory.create(AppModule, {
      logger: WinstonModule.createLogger(winstonConfig),
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter)

    const config = new DocumentBuilder()
      .setTitle('TastyUZ')
      .setDescription(
        "TastyUZ saytining Swagger REST API proyekti",
      )
      .setVersion('1.0')
      .addTag('nestjs,validation,swagger,sequelize,pg,guard')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT, () => {
      console.log(`Server started at: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();
