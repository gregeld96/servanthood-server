import { Injectable, OnApplicationShutdown } from '@nestjs/common';

type CleanupFn = () => Promise<void> | void;

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private cleanupTasks: CleanupFn[] = [];

  /**
   * Register a cleanup function to be called during shutdown
   */
  registerCleanup(task: CleanupFn) {
    this.cleanupTasks.push(task);
  }

  async onApplicationShutdown(signal?: string) {
    console.log(`🚦 Application shutting down due to signal: ${signal}`);

    for (const task of this.cleanupTasks) {
      try {
        await task();
      } catch (err) {
        console.error('❌ Error during shutdown task:', err);
      }
    }
  }
}