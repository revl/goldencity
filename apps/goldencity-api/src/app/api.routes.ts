import { Router, type Request, type Response } from "express";
import { authRoutes } from "./auth.routes.js";
import { usersRoutes } from "./users.routes.js";

export const apiRoutes = Router();

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", usersRoutes);

// API info endpoint
apiRoutes.get("/", (_req: Request, res: Response) => {
  res.json({ version: "1.0.0", name: "goldencity-api" });
});
