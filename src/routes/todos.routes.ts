import { Hono } from "hono";
import type { SecureHeadersVariables } from "hono/secure-headers";
import type { EdgeRenderer } from "node_modules/edge.js/build/src/edge/renderer";
import { validator } from "hono/validator";
import vine, { errors } from "@vinejs/vine";

import {
  createTodo,
  listTodos,
  showTodo,
  storeTodo,
} from "@/controllers/todos.controller";
import { todoIdRequestParamSchema } from "@/lib/utils/route.utils";
import { HTTPException } from "hono/http-exception";

// Specify the variable types to infer the `c.get('secureHeadersNonce')`:
export type TodosVariables = SecureHeadersVariables & {
  renderer: EdgeRenderer;
};

const todosRoutes = new Hono<{ Variables: TodosVariables }>();

todosRoutes.get("/", async (c) => {
  return await listTodos(c);
});

todosRoutes.get("/todos/create", async (c) => {
  return await createTodo(c);
});

todosRoutes.post("/todos/store", async (c) => {
  return await storeTodo(c);
});

todosRoutes.get(
  "/todos/:id/view",
  validator("param", async (value) => {
    // find todo and if not available, return 404
    try {
      const validator = vine.compile(todoIdRequestParamSchema);
      const output = await validator.validate({ id: value["id"] });

      return output;
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        throw new HTTPException(404, { message: error.messages[0]?.message });
      }

      throw new HTTPException(404, { message: "Todo not found" });
    }
  }),
  async (c) => {
    return await showTodo(c);
  },
);

export default todosRoutes;
