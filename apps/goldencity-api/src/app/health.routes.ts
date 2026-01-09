import { Router, type Request, type Response } from "express";

export const healthRoutes = Router();

healthRoutes.get("/", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});
