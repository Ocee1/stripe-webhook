import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
helmet
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors();
  const configService = app.get(ConfigService);
  app.use(helmet());
  await app.listen(configService.get('PORT'));

}
bootstrap();
