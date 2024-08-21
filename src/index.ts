import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { Edge } from "edge.js";
import { edgeIconify, addCollection } from "edge-iconify";
import { icons as googleIcons } from "@iconify-json/ic";

import { listAllTodos } from "./routes/todos.routes";

const app = new Hono();

addCollection(googleIcons);

const edge = Edge.create({
  cache: Bun.env.NODE_ENV === "production",
});
/**
 * Register the plugin
 */
edge.use(edgeIconify);

edge.mount(new URL("./views", import.meta.url));
edge.global("config", {
  colorScheme: "system",
  menu: [],
  socialLinks: [],
});

app.use(
  csrf({
    origin: ["localhost", "experimental-webap-setup.vercel.app"],
  }),
);

app.get("/", async (c) => {
  const todos = listAllTodos();
  const html = await edge.render("todos/index", {
    todos: todos,
    username: "Hono Dev",
  });

  return c.html(html, 200);
});

export default app;
