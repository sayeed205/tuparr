import vine from '@vinejs/vine'

export const deleteFilesValidator = vine.compile(
  vine.object({
    items: vine.array(vine.string()).minLength(1),
    dir: vine.string(),
  })
)

export const renameFileValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(1),
    item: vine.string(),
    dir: vine.string(),
  })
)
