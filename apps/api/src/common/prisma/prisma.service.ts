import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service Prisma pour la gestion de la base de données
 * Initialise et ferme proprement la connexion Prisma
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Base de données connectée');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Méthode helper pour nettoyer la base de données (utile pour les tests)
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key[0] !== '$',
    );

    return Promise.all(
      models.map((modelKey) => (this as any)[modelKey].deleteMany()),
    );
  }
}
