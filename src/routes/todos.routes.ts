import { listTodos } from "@/controllers/todos.controller";
import { Hono } from "hono";
import type { SecureHeadersVariables } from "hono/secure-headers";
import type { EdgeRenderer } from "node_modules/edge.js/build/src/edge/renderer";

// Specify the variable types to infer the `c.get('secureHeadersNonce')`:
export type TodosVariables = SecureHeadersVariables & {
  renderer: EdgeRenderer;
};

const todosRoutes = new Hono<{ Variables: TodosVariables }>();

todosRoutes.get("/", async (c) => {
  const todos = listTodos(c);
  const html = c.get("renderer").render("todos/index", {
    todos: todos,
  });

  return c.html(html, 200);
});

export default todosRoutes;
