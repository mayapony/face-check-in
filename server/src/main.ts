import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const SERVER_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  console.log(`listen at http://localhost:${SERVER_PORT}`);
  await app.listen(SERVER_PORT);
}
bootstrap();
