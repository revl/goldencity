import { errorHandler, logger, NotFoundError } from "@goldencity/utils-node";
import compression from "compression";
import cookieParser from "cookie-parser";
import type { CorsOptions } from "cors";
import cors from "cors";
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRoutes } from "./app/api.routes.js";
import { healthRoutes } from "./app/health.routes.js";
import { env } from "./config.js";

const app: Application = express();

if (env.NODE_ENV !== "development") {
  app.set("trust proxy", 1); // trust first proxy
}

// Security middleware
app.use(helmet());

// CORS configuration pulled from env-configured origins
const corsOptions: CorsOptions = {
  origin: env.CORS_ORIGINS,
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Compression middleware
app.use(
  compression({
    filter: (req, res) => {
      // EventSource sets Accept: text/event-stream
      if (req.headers.accept?.includes("text/event-stream")) return false;
      return compression.filter(req, res);
    },
  }),
);

// Logging middleware
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Cookie parser middleware
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req: Request, _res: Response, next: NextFunction) => {
  return next(
    new NotFoundError("Path not found", { details: { path: req.path } }),
  );
});

// Error handling middleware
app.use(errorHandler);

const port = env.PORT;
const host = env.HOST;

const server = app.listen(port, host);

server.on("error", (error: NodeJS.ErrnoException) => {
  logger.error(
    error.code === "EADDRINUSE"
      ? "Port is already in use"
      : "Error starting server",
    { error, details: { port, host } },
  );
  process.exit(1);
});

server.on("listening", () => {
  logger.info("API Server running", { details: { host, port } });
});

const serverCloseCallback = async () => {
  logger.info("HTTP server closed");
  process.exit(0);
};

// Graceful shutdown handlers
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    logger.info("Signal received; closing connections", {
      details: { signal },
    });
    server.close(serverCloseCallback);
  });
}

export { app };
