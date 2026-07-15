#!/usr/bin/env node
/**
 * Stable local dev server launcher.
 * - Fixed port (5173) — no silent switch to 8081
 * - Clear error if port is already in use
 * - `npm run dev:stop` kills stale Vite on that port
 */
import { spawn, execSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const PORT = Number(process.env.PORT || process.env.VITE_DEV_PORT || 5173);

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen({ port, host: "127.0.0.1" }, () => {
      server.close(() => resolve(true));
    });
  });
}

function killPort(port) {
  try {
    const pids = execSync(`lsof -ti tcp:${port}`, { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), "SIGTERM");
      } catch {
        /* already gone */
      }
    }
    if (pids.length) {
      console.log(`Stopped process(es) on port ${port}: ${pids.join(", ")}`);
    } else {
      console.log(`No process found on port ${port}.`);
    }
  } catch {
    console.log(`No process found on port ${port}.`);
  }
}

const command = process.argv[2];

if (command === "stop") {
  killPort(PORT);
  process.exit(0);
}

if (command === "restart") {
  killPort(PORT);
  await new Promise((r) => setTimeout(r, 400));
}

const free = await isPortFree(PORT);
if (!free) {
  console.error(`
Port ${PORT} is already in use.

Fix:
  npm run dev:stop
  npm run dev

Or open the existing server: http://localhost:${PORT}/
`);
  process.exit(1);
}

console.log(`Starting Nexavo dev server on http://localhost:${PORT}/\n`);

const child = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT) },
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
