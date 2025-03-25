import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Beekk API')
    .setDescription('Beekk 과제 API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // BigInt -> Number 인터셉터 전역 등록
  app.useGlobalInterceptors(new BigIntInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
