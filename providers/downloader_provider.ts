import type { ApplicationService } from '@adonisjs/core/types'
import { DownloaderService } from '#services/downloader_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    downloader: DownloaderService
  }
}

export default class DownloaderProvider {
  constructor(protected app: ApplicationService) {
    this.app.container.singleton('downloader', () => new DownloaderService())
  }

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
