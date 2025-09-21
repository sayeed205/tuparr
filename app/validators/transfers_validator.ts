import vine from '@vinejs/vine'

export const addTransferValidator = vine.compile(
  vine.object({
    links: vine.array(vine.string()).minLength(1),
  })
)
