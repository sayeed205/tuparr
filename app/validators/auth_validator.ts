import vine from '@vinejs/vine'

export const onboardValidator = vine.compile(
  vine.object({
    username: vine.string().alphaNumeric().trim().minLength(3).maxLength(254),
    password: vine
      .string()
      .minLength(8)
      .maxLength(32)
      .trim()
      .confirmed({ confirmationField: 'confirmPassword' }),
    confirmPassword: vine.string().minLength(8).maxLength(32).trim(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    username: vine.string().alphaNumeric().trim().minLength(3).maxLength(254),
    password: vine.string().minLength(8).maxLength(32).trim(),
  })
)
