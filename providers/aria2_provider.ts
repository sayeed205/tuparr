import { join, relative } from 'node:path'

import type { ApplicationService } from '@adonisjs/core/types'
import { Aria2 } from '@hitarashi/aria2'
import app from '@adonisjs/core/services/app'

import env from '#start/env'
import { moveFile } from '#services/downloader_service'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    aria2: Aria2
  }
}

export default class Aria2Provider {
  constructor(protected appService: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.appService.container.singleton('aria2', () => new Aria2())
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
  async ready() {
    const aria2 = await this.appService.container.make('aria2')
    aria2.on('onBtDownloadComplete', ({ gid }) => moveAriaTask(gid))
    aria2.on('onDownloadComplete', ({ gid }) => moveAriaTask(gid))
  }

  /**
   * Preparing to shut down the app
   */
  async shutdown() {
    const aria2 = await this.appService.container.make('aria2')
    aria2.close()
  }
}

/**
 * Move all files from an Aria2 task to the final directory.
 * Safe: skips missing files, preserves folder structure
 */
export async function moveAriaTask(gid: string) {
  const aria2 = await app.container.make('aria2')
  const task = await aria2.tellStatus(gid)
  const filesDir = app.inProduction
    ? env.get('FILES_DIR', app.makePath('files'))
    : app.makePath('files')
  const downloadDir = task.dir

  for (const file of task.files) {
    const relPath = relative(downloadDir, file.path) // e.g., folder/file.ext or file.ext
    const destFolder = join(filesDir, relPath.split('/').slice(0, -1).join('/'))
    await moveFile(file.path, destFolder)
  }

  console.log(`[moveAriaTask] All files from GID ${gid} moved to ${filesDir}`)
}
