import type { ApplicationService } from '@adonisjs/core/types'
import { Aria2 } from '@hitarashi/aria2'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    aria2: Aria2
  }
}

export default class Aria2Provider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton('aria2', () => new Aria2())
  }

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
   * Preparing to shut down the app
   */
  async shutdown() {}
}
