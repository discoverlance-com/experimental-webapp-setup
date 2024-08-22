import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { serveStatic } from "hono/bun";
import { csrf } from "hono/csrf";
import { Edge } from "edge.js";
import { edgeIconify, addCollection } from "edge-iconify";
import { icons as googleIcons } from "@iconify-json/ic";
import { secureHeaders, NONCE } from "hono/secure-headers";
import type { SecureHeadersVariables } from "hono/secure-headers";
import type { EdgeRenderer } from "node_modules/edge.js/build/src/edge/renderer";

import todosRoutes from "./routes/todos.routes";

// Specify the variable types to infer the `c.get('secureHeadersNonce')`:
type Variables = SecureHeadersVariables & {
  renderer: EdgeRenderer;
};

const app = new Hono<{ Variables: Variables }>();

app.get(
  "/static/*",
  serveStatic({
    root: "./",
  }),
);

/**
 * Configure edge
 */
addCollection(googleIcons);

const edge = Edge.create({
  cache: Bun.env.NODE_ENV === "production",
});

edge.use(edgeIconify);

edge.mount(new URL("./views", import.meta.url));

edge.global("config", {
  colorScheme: "light",
  menu: [
    {
      title: "Home",
      url: "/",
    },
    { title: "New Todo", url: "/todos/create" },
  ],
  socialLinks: [],
});

app.use(
  csrf({
    origin: ["localhost", "experimental-webap-setup.vercel.app"],
  }),
);
app.use(
  secureHeaders({
    xXssProtection: "1; mode=block",
    xContentTypeOptions: "nosniff",
    xFrameOptions: "SAMEORIGIN",
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      childSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:", "fonts.gstatic.com"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"],
      imgSrc: ["'self'", "data:"],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      // sandbox: ["allow-same-origin", "allow-scripts"],
      scriptSrc: [NONCE, "'self'"],
      scriptSrcAttr: ["'none'"],
      scriptSrcElem: [
        "'self'",
        "https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js",
      ],
      styleSrc: ["'self'", "https:", "'unsafe-inline'", "fonts.googleapis.com"],
      styleSrcAttr: ["'unsafe-inline'"],
      styleSrcElem: ["'self'", "https:", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'"],
    },
  }),
);

app.use(async (c, next) => {
  c.set("renderer", edge.createRenderer());
  await next();
});

app.use(async (c, next) => {
  c.get("renderer").share({
    nonce: c.get("secureHeadersNonce"),
  });
  await next();
});

app.route("/", todosRoutes);

app.notFound(async (c) => {
  const html = c.get("renderer").render("errors/not-found", {
    message: "The page you are looking for does not exist",
  });
  return c.html(html, 404);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const html = c.get("renderer").render("errors/server-error", {
      status: err.status,
      message:
        err.status === 500
          ? "Something went wrong. We will work to resolve the issue. Please try again later."
          : err.message,
      summary:
        err.status === 401
          ? "Unauthorized"
          : err.status === 403
            ? "Forbidden"
            : err.status === 404
              ? "Not Found"
              : err.status === 500
                ? "Internal Server Error"
                : "An unexpected error occurred",
    });
    console.log("HTTPException");
    console.log({ err });
    return c.html(html, err.status);
  }
  console.log("Uncaught(Not HttpException) Error");
  console.log({ err });
  return c.text("An unexpected error occurred", 500);
});

export default app;
