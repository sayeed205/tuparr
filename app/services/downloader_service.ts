import fs from 'node:fs/promises'
import { join } from 'node:path'

import app from '@adonisjs/core/services/app'

import type { DownloadOptions } from '@hitarashi/aria2/types'

import { type YTDLDownloadOptions, YtdlpService } from '#services/ytdlp_service'

const ytdl = new YtdlpService()

export class DownloaderService {
  // Your code here
  async addTask(
    uri: string,
    options?: DownloadOptions | YTDLDownloadOptions,
    engineName?: 'ytdl' | 'aria2'
  ) {
    const aria2 = await app.container.make('aria2')
    const engine = engineName || this.getEngine(uri)
    if (engine === 'ytdl') {
      return ytdl.addUri(uri, options)
    }
    return aria2.addUri([uri], options)
  }

  private getEngine(url: string) {
    const lower = url.toLowerCase()

    // Magnet links
    if (lower.startsWith('magnet:')) {
      return 'aria2'
    }

    // Torrent files
    if (lower.endsWith('.torrent')) {
      return 'aria2'
    }

    // HTTP/HTTPS/FTP direct downloads
    if (lower.startsWith('http://') || lower.startsWith('https://') || lower.startsWith('ftp://')) {
      // Special case: known streaming/video sites -> yt-dlp
      const ytDlpDomains = [
        'youtube.com',
        'youtu.be',
        'twitch.tv',
        'vimeo.com',
        'dailymotion.com',
        'facebook.com',
        'twitter.com',
        'x.com',
        'tiktok.com',
        'soundcloud.com',
      ]

      try {
        const { hostname } = new URL(url)
        if (ytDlpDomains.some((domain) => hostname.endsWith(domain))) {
          return 'ytdl'
        }
      } catch {
        return 'aria2'
      }

      return 'aria2'
    }

    // Default fallback
    return 'aria2'
  }
}

/**
 * Move a single file to the destination directory.
 * Safe: skips if file doesn't exist, handles EXDEV
 */
export async function moveFile(src: string, destDir: string) {
  try {
    await fs.access(src)
  } catch {
    console.warn(`[moveFile] Source does not exist, skipping: ${src}`)
    return
  }

  const fileName = src.split('/').pop()!
  const destPath = join(destDir, fileName)

  await fs.mkdir(destDir, { recursive: true })

  try {
    await fs.rename(src, destPath)
    console.log(`[moveFile] Moved: ${src} -> ${destPath}`)
  } catch (err: any) {
    if (err.code === 'EXDEV') {
      await fs.cp(src, destPath, { recursive: true })
      await fs.rm(src, { recursive: true, force: true })
      console.log(`[moveFile] Copied & removed across devices: ${src} -> ${destPath}`)
    } else {
      throw err
    }
  }
}
