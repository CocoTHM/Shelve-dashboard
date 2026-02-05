import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  app.enableCors({
    origin: configService.get('WEB_URL'),
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Discord Dashboard API')
    .setDescription('API de gestion et supervision de serveurs Discord')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification')
    .addTag('users', 'Utilisateurs')
    .addTag('servers', 'Serveurs Discord')
    .addTag('stats', 'Statistiques')
    .addTag('logs', 'Historique et Logs')
    .addTag('voice', 'Tracking Vocal')
    .addTag('services', 'Prise de Service')
    .addTag('roles', 'Gestion des Rôles')
    .addTag('events', 'Calendrier')
    .addTag('tickets', 'Support Tickets')
    .addTag('chat', 'Chat Interne')
    .addTag('github', 'Intégration GitHub')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API démarrée sur le port ${port}`);
  console.log(`📚 Documentation Swagger: /api/docs`);
}

bootstrap();
