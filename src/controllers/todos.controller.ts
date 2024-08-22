import type { Todo } from "@/models/todo.model";
import type { TodosVariables } from "@/routes/todos.routes";
import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";

export async function listTodos(
  c: Context<{ Variables: TodosVariables }, "/", BlankInput>,
) {
  const todos: Todo[] = [];
  const html = c.get("renderer").render("todos/index", {
    todos: todos,
  });

  return c.html(html, 200);
}

export async function showTodo(
  c: Context<
    { Variables: TodosVariables },
    "/todos/:id/view",
    { in: { param: { id: string } }; out: { param: { id: string } } }
  >,
) {
  const { id } = c.req.valid("param");
  const todo: Todo = { id, title: "Todo 1", completed: true };
  const html = c.get("renderer").render("todos/view", { todo });

  return c.html(html, 200);
}

export async function createTodo(
  c: Context<{ Variables: TodosVariables }, "/todos/create", BlankInput>,
) {
  const html = c.get("renderer").render("todos/create");

  return c.html(html, 200);
}

export async function storeTodo(
  c: Context<{ Variables: TodosVariables }, "/todos/store", BlankInput>,
) {
  return c.json({ message: "Todo created" }, 201);
}

export async function updateTodo(
  _context: Context<
    { Variables: TodosVariables },
    "/todos/:id/update",
    BlankInput
  >,
) {}

export async function destroyTodo(
  _context: Context<BlankEnv, "/todos/:id/destroy", BlankInput>,
) {}
