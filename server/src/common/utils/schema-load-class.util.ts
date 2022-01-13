import { Type } from "@nestjs/common";
import { Schema } from "mongoose";

export const schemaLoadClass = (schema: Schema, modelClsas: Type) => {
  Object.getOwnPropertyNames(modelClsas.prototype)
    .filter((propName) => propName !== "constructor")
    .forEach((propName) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        modelClsas.prototype,
        propName,
      );
      if (descriptor.value)
        if (descriptor.value instanceof Function)
          schema.methods[propName] = modelClsas.prototype[propName];

      if (descriptor.get) schema.virtual(propName).get(descriptor.get);
      if (descriptor.set) schema.virtual(propName).set(descriptor.set);
    });
};
