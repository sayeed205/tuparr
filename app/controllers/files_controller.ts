import fs from 'node:fs/promises'
import path from 'node:path'
import app from '@adonisjs/core/services/app'

import { type HttpContext } from '@adonisjs/core/http'

import env from '#start/env'
import type { Entry, FileEntry, FolderEntry } from '#types/files'
import { DateTime } from 'luxon'
import { deleteFilesValidator, renameFileValidator } from '#validators/files_validator'

export default class FilesController {
  async index({ params, inertia }: HttpContext) {
    const segments: string[] = (params['*'] || []).map(decodeURIComponent)
    const relativePath = segments.join(path.sep)

    const baseDir = app.inProduction ? env.get('FILES_DIR', '/files') : app.makePath('files')
    const targetPath = path.join(baseDir, relativePath)

    try {
      const entries = await fs.readdir(targetPath, { withFileTypes: true })

      const files: Entry[] = await Promise.all(
        entries.map(async (entry) => {
          const entryPath = path.join(targetPath, entry.name)
          const stats = await fs.stat(entryPath)

          if (entry.isDirectory()) {
            const children = await fs.readdir(entryPath)
            const folder: FolderEntry = {
              type: 'folder',
              name: entry.name,
              count: children.length,
              createdAt: DateTime.fromJSDate(stats.birthtime).toFormat('D - t'),
            }
            return folder
          } else {
            const file: FileEntry = {
              type: 'file',
              name: entry.name,
              size: stats.size,
              createdAt: DateTime.fromJSDate(stats.birthtime).toFormat('D - t'),
            }
            return file
          }
        })
      )

      return inertia.render('files/page', {
        status: '200',
        path: relativePath || path.sep,
        files,
      })
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return inertia.render('files/page', { status: '404', path: relativePath, files: [] })
      }
      throw err
    }
  }

  async delete({ request, response }: HttpContext) {
    const { items, dir } = await request.validateUsing(deleteFilesValidator)
    const segments: string[] = dir.split('/files').filter(Boolean).map(decodeURIComponent)
    const relativePath = segments.join(path.sep)
    const baseDir = app.inProduction ? env.get('FILES_DIR', '/files') : app.makePath('files')
    const targetDir = path.join(baseDir, relativePath)

    for (const item of items) {
      const itemPath = path.join(targetDir, item)

      try {
        await fs.rm(itemPath, { recursive: true, force: true })
      } catch (err) {
        console.error(`Failed to delete ${itemPath}:`, err)
      }
    }

    return response.redirect().back()
  }

  async rename({ request, response, session }: HttpContext) {
    const { item, name, dir } = await request.validateUsing(renameFileValidator)

    // Decode segments safely
    const segments: string[] = dir.split('/files').filter(Boolean).map(decodeURIComponent)
    const relativePath = segments.join(path.sep)

    const baseDir = app.inProduction ? env.get('FILES_DIR', '/files') : app.makePath('files')
    const targetDir = path.join(baseDir, relativePath)

    const oldPath = path.join(targetDir, item)
    const newPath = path.join(targetDir, name)

    try {
      // Determine type: file or folder
      let type = 'item'
      try {
        const stats = await fs.stat(oldPath)
        type = stats.isDirectory() ? 'folder' : 'file'
      } catch {
        session.flash('errors.rename', `The item does not exist.`)
        return response.redirect().back()
      }

      // Check if newPath already exists
      try {
        await fs.access(newPath)
        // If no error, file/folder exists
        session.flash('errors.rename', `A ${type} with that name already exists`)
        return response.redirect().back()
      } catch {
        // fs.access throws if the path does not exist → safe to rename
      }

      await fs.rename(oldPath, newPath)
      console.log(`Renamed ${oldPath} → ${newPath}`)
    } catch (err) {
      console.error(`Failed to rename ${oldPath} → ${newPath}:`, err)
      session.flash('errors.rename', 'Unknown error occurred.')
      return response.status(500).send({ error: 'Rename failed' })
    }

    return response.redirect().back()
  }
}
