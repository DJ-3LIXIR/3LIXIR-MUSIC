import type { Express } from "express";
import { createServer, type Server } from "http";

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:3001";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const proxyAIBackend = async (req: any, res: any, next: any) => {
    const path = req.path;
    
    if (
      !path.startsWith("/api/auth") &&
      !path.startsWith("/api/chat") &&
      !path.startsWith("/api/tickets") &&
      !path.startsWith("/api/kb")
    ) {
      return next();
    }

    try {
      const url = `${AI_BACKEND_URL}${req.path}`;
      console.log(`[Proxy] ${req.method} ${req.path} -> ${url}`);
      
      const response = await fetch(url, {
        method: req.method,
        headers: {
          "Content-Type": "application/json",
          ...(req.headers.authorization && { authorization: req.headers.authorization }),
        },
        body: req.method !== "GET" && req.method !== "HEAD" ? JSON.stringify(req.body) : undefined,
      });

      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error(`[Proxy Error] ${req.path}:`, error.message);
      res.status(500).json({ message: "Error connecting to AI backend", error: error.message });
    }
  };

  app.use(proxyAIBackend);
  return httpServer;
}
