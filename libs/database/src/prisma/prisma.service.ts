import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ShutdownService } from 'libs/common/src/shutdown/shutdown.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly shutdownService: ShutdownService) {
    super();

    // register cleanup
    this.shutdownService.registerCleanup(async () => {
      console.log('🛑 Closing Prisma connection...');
      await this.$disconnect();
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
