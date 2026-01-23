import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible locations
  const possiblePaths = [
    path.resolve(__dirname, "public"),
    path.resolve(__dirname, "../client/dist"),
    path.resolve(__dirname, "../dist"),
  ];

  const distPath = possiblePaths.find((p) => fs.existsSync(p));

  if (!distPath) {
    throw new Error(
      `Could not find the build directory in any of: ${possiblePaths.join(", ")}, make sure to build the client first`,
    );
  }

  console.log(`📁 Serving static files from: ${distPath}`);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
