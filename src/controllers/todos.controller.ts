import type { TodosVariables } from "@/routes/todos.routes";
import type { Context } from "hono";
import type { BlankEnv, BlankInput } from "hono/types";

export async function listTodos(
  _context: Context<{ Variables: TodosVariables }, "/", BlankInput>,
) {
  return [];
}

export async function showTodo(
  _context: Context<{ Variables: TodosVariables }, "/", BlankInput>,
) {}

export async function createTodo(
  _context: Context<BlankEnv, "/create", BlankInput>,
) {}

export async function updateTodo(
  _context: Context<{ Variables: TodosVariables }, "/", BlankInput>,
) {}

export async function destroyTodo(
  _context: Context<BlankEnv, "/destroy", BlankInput>,
) {}
