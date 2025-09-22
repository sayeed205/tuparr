import vine from '@vinejs/vine'

export const addTransferValidator = vine.compile(
  vine.object({
    links: vine.array(vine.string()).minLength(1),
  })
)

export const transfersActionValidator = vine.compile(
  vine.object({
    GIDs: vine.array(vine.string()).minLength(1),
    action: vine.enum(['pause', 'resume', 'remove']),
  })
)
