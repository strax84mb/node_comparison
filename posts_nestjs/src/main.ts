import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = new Date();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const end = new Date();
  console.log('>>>', end.getTime() - start.getTime());
}
bootstrap();
