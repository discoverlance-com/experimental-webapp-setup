import vine from "@vinejs/vine";
import type { Infer, InferInput } from "@vinejs/vine/types";
vine.convertEmptyStringsToNull = true;

export const todoSchema = vine.object({
  id: vine.string().uuid().optional(),
  title: vine.string().minLength(3).maxLength(125),
  completed: vine.accepted(),
});

export type Todo = Infer<typeof todoSchema>;
export type TodoInput = InferInput<typeof todoSchema>;

export const createTodoSchema = todoSchema;

// const validator = vine.compile(schema)
// const output = await validator.validate(data)
