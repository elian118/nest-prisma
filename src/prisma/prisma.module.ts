import { Module, Provider } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { setQueryLog } from '../config/utils';

const PrismaClientProvider: Provider = {
  provide: PrismaClient,
  useFactory: () => {
    const prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    prisma.$on('query', (e) => setQueryLog(e));

    return prisma;
  },
};

@Module({
  providers: [PrismaClientProvider],
  exports: [PrismaClient],
})
export class PrismaModule {}
