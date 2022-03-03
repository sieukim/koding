import { EntityManager, FindCondition } from "typeorm";
import { Type } from "@nestjs/common";

export async function increaseField<T extends Type>(
  em: EntityManager,
  Entity: T,
  fieldName: keyof InstanceType<T>,
  delta: number,
  id: FindCondition<InstanceType<T>>,
) {
  await em.update(Entity, id, {
    [fieldName]: () => `${fieldName} + ${delta}`,
  });
}
