import { cuid } from '@adonisjs/core/helpers'
import { column, beforeCreate } from '@adonisjs/lucid/orm'

import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { BaseModel } from '@adonisjs/lucid/orm'

type ModelWithCUIDRow = {
  id: string
}

type ModelWithCUIDClass<
  Model extends NormalizeConstructor<typeof BaseModel> = NormalizeConstructor<typeof BaseModel>,
> = Model & {
  new (...args: any[]): ModelWithCUIDRow
}

export default function withCUID() {
  return <T extends NormalizeConstructor<typeof BaseModel>>(
    superclass: T
  ): ModelWithCUIDClass<T> => {
    class ModelWithCUID extends superclass {
      public static selfAssignPrimaryKey = true

      @column({ isPrimary: true })
      declare id: string

      @beforeCreate()
      public static beforeCreate(model: ModelWithCUID) {
        model.id = model.id || cuid()
      }
    }

    return ModelWithCUID as unknown as ModelWithCUIDClass<T>
  }
}
